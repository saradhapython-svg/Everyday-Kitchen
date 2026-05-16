// ============================================================
//  Vercel Serverless Function — POST /api/suggest
//
//  Hybrid agent: takes user prefs + analytics, asks Claude for one new
//  vegetarian recipe in the app's strict schema, validates, returns.
//
//  Required env vars (set in Vercel dashboard):
//   - ANTHROPIC_API_KEY  (your key from console.anthropic.com)
//
//  Optional:
//   - SHARED_SECRET      (extra header your app sends; not required but adds defense)
// ============================================================

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RECIPE_SCHEMA_EXAMPLE = {
  id: 'kebab-case-unique-id',
  name: 'Recipe Name',
  accent: '#C2410C',
  macros: { protein: 'high', fat: 'medium', carb: 'medium' },
  taste: 'spicy',
  suitableFor: ['adults', 'teenagers'],
  benefit: 'One sentence describing why this recipe is good for the family today.',
  time: '30 min',
  ingredients: ['Ingredient 1 (amount)', 'Ingredient 2 (amount)'],
};

const SYSTEM_PROMPT = `You are a thoughtful vegetarian cook helping a family find a new recipe.
You will receive the family's taste profile, recipes they have liked, and recipes they have disliked.
Suggest ONE new vegetarian recipe (no meat, no fish, no seafood) that:
 - Matches their protein/fat/carb and taste preferences as closely as possible
 - Is appropriate for everyone at their table (especially if "kids" or "old" are present)
 - Is DIFFERENT from any recipe in the "avoidNames" list
 - Resembles the dishes they have liked, and is unlike the ones they disliked
 - Is realistic, with simple home ingredients

Respond ONLY with a single valid JSON object. No prose, no markdown fences. Schema:
${JSON.stringify(RECIPE_SCHEMA_EXAMPLE, null, 2)}

Rules:
 - id: lowercase, kebab-case, unique, descriptive
 - accent: pick one of these hex colors: #C2410C #B45309 #DC2626 #B91C1C #CA8A04 #65A30D #D97706 #BE123C #15803D #166534 #9F1239 #7C3AED
 - macros: each value MUST be exactly "low", "medium", or "high"
 - taste: MUST be exactly one of "spicy", "tangy", "sweet", "sour", "balanced"
 - suitableFor: array using only "kids", "teenagers", "adults", "old"
 - benefit: ONE sentence (under 25 words) describing why it's good for the family today
 - time: format like "30 min"
 - ingredients: 6-10 items, each a short string with quantity in parentheses like "Olive oil (2 tbsp)"
`;

function validateRecipe(r) {
  const macroVals = ['low', 'medium', 'high'];
  const tasteVals = ['spicy', 'tangy', 'sweet', 'sour', 'balanced'];
  const audVals = ['kids', 'teenagers', 'adults', 'old'];
  if (!r || typeof r !== 'object') return 'not an object';
  if (typeof r.id !== 'string' || !/^[a-z0-9-]+$/.test(r.id)) return 'bad id';
  if (typeof r.name !== 'string' || r.name.length < 3) return 'bad name';
  if (!r.macros || !macroVals.includes(r.macros.protein) || !macroVals.includes(r.macros.fat) || !macroVals.includes(r.macros.carb)) return 'bad macros';
  if (!tasteVals.includes(r.taste)) return 'bad taste';
  if (!Array.isArray(r.suitableFor) || !r.suitableFor.every(x => audVals.includes(x))) return 'bad suitableFor';
  if (typeof r.benefit !== 'string' || r.benefit.length < 10) return 'bad benefit';
  if (typeof r.time !== 'string') return 'bad time';
  if (!Array.isArray(r.ingredients) || r.ingredients.length < 3 || !r.ingredients.every(i => typeof i === 'string')) return 'bad ingredients';
  return null;
}

// In-memory rate limit (per-instance — Vercel functions are stateless across cold starts,
// but this still blunts bursts within a single warm instance)
const recentCalls = new Map();
function rateLimit(key, maxPerHour = 20) {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const arr = (recentCalls.get(key) || []).filter(t => now - t < hour);
  if (arr.length >= maxPerHour) return false;
  arr.push(now);
  recentCalls.set(key, arr);
  return true;
}

export default async function handler(req, res) {
  // Vercel auto-handles CORS for same-origin, but be explicit
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // Optional shared-secret check (set SHARED_SECRET in Vercel env, send same value in X-App-Key header from the app)
  if (process.env.SHARED_SECRET && req.headers['x-app-key'] !== process.env.SHARED_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // Rate limit by IP (best-effort — behind Vercel's edge it's the real client IP)
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in an hour.' });
  }

  const { prefs, likedRecipes = [], dislikedRecipes = [], avoidNames = [] } = req.body || {};
  if (!prefs?.protein || !prefs?.audience) {
    return res.status(400).json({ error: 'prefs required' });
  }

  const userMessage = `Family taste profile:
- Protein preference: ${prefs.protein}
- Fat preference: ${prefs.fat}
- Carb preference: ${prefs.carb}
- Flavor mood today: ${prefs.taste}
- At the table: ${prefs.audience.join(', ')}

Recipes they have liked: ${likedRecipes.length ? likedRecipes.join(', ') : '(none yet)'}
Recipes they have disliked: ${dislikedRecipes.length ? dislikedRecipes.join(', ') : '(none yet)'}

Do NOT suggest any of these existing recipes: ${avoidNames.join(', ')}

Suggest ONE new vegetarian recipe in the JSON schema described.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
    const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();

    let recipe;
    try { recipe = JSON.parse(clean); }
    catch { return res.status(502).json({ error: 'LLM returned non-JSON' }); }

    const err = validateRecipe(recipe);
    if (err) return res.status(502).json({ error: `validation: ${err}` });

    if (avoidNames.map(n => n.toLowerCase()).includes(recipe.name.toLowerCase())) {
      recipe.id = recipe.id + '-' + Date.now().toString(36);
    }

    res.json(recipe);
  } catch (e) {
    console.error('LLM error:', e);
    res.status(500).json({ error: 'LLM call failed' });
  }
}
