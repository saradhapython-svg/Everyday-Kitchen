// ============================================================
//  Recipes — seed data + scoring engine
// ============================================================

export const SEED_RECIPES = [
  { id: 'paneer-tikka-bowl', name: 'Paneer Tikka Bowl', accent: '#C2410C',
    macros: { protein: 'high', fat: 'medium', carb: 'medium' }, taste: 'spicy',
    suitableFor: ['adults', 'teenagers'], cookingTime: 'comfort',
    benefit: 'Packs 28g of protein per serving — sustained fuel for active days and post-workout recovery.',
    time: '35 min', source: 'seed',
    ingredients: ['Paneer (250g)', 'Bell peppers (2)', 'Greek yogurt (1 cup)', 'Garam masala (2 tsp)', 'Brown rice (1 cup)', 'Spinach (2 cups)', 'Lemon (1)', 'Garlic (4 cloves)'] },
  { id: 'chickpea-mediterranean', name: 'Mediterranean Chickpea Stew', accent: '#B45309',
    macros: { protein: 'high', fat: 'medium', carb: 'high' }, taste: 'tangy',
    suitableFor: ['adults', 'old', 'kids'], cookingTime: 'comfort',
    benefit: 'Gentle on digestion across ages — fiber and olive oil support heart health for the whole family.',
    time: '40 min', source: 'seed',
    ingredients: ['Chickpeas (2 cans)', 'Tomatoes (4)', 'Olive oil (3 tbsp)', 'Lemon (2)', 'Parsley (1 bunch)', 'Onion (1)', 'Cumin (1 tsp)', 'Pita bread'] },
  { id: 'sweet-potato-pancakes', name: 'Sweet Potato Pancakes', accent: '#DC2626',
    macros: { protein: 'medium', fat: 'low', carb: 'high' }, taste: 'sweet',
    suitableFor: ['kids', 'teenagers', 'adults'], cookingTime: 'quick',
    benefit: 'Naturally sweet so kids skip the syrup — beta-carotene supports growing eyes and immunity.',
    time: '25 min', source: 'seed',
    ingredients: ['Sweet potato (2 large)', 'Eggs (2)', 'Whole wheat flour (1 cup)', 'Cinnamon (1 tsp)', 'Maple syrup', 'Milk (1 cup)', 'Vanilla extract'] },
  { id: 'thai-tofu-curry', name: 'Thai Red Tofu Curry', accent: '#B91C1C',
    macros: { protein: 'high', fat: 'high', carb: 'medium' }, taste: 'spicy',
    suitableFor: ['adults', 'teenagers'], cookingTime: 'comfort',
    benefit: 'Coconut milk delivers MCTs for sustained energy; tofu provides complete plant protein.',
    time: '30 min', source: 'seed',
    ingredients: ['Firm tofu (400g)', 'Coconut milk (1 can)', 'Red curry paste (3 tbsp)', 'Jasmine rice (1 cup)', 'Bok choy', 'Lime (2)', 'Thai basil', 'Bamboo shoots'] },
  { id: 'lentil-soup', name: 'Golden Lentil Soup', accent: '#CA8A04',
    macros: { protein: 'medium', fat: 'low', carb: 'medium' }, taste: 'balanced',
    suitableFor: ['old', 'kids', 'adults'], cookingTime: 'comfort',
    benefit: 'Soft, easily chewable and iron-rich — well-suited for grandparents and young children alike.',
    time: '30 min', source: 'seed',
    ingredients: ['Red lentils (1 cup)', 'Carrots (3)', 'Turmeric (1 tsp)', 'Ginger (1 inch)', 'Vegetable broth (4 cups)', 'Coconut oil', 'Cilantro', 'Lime (1)'] },
  { id: 'quinoa-roasted-veg', name: 'Quinoa & Roasted Vegetable Bowl', accent: '#65A30D',
    macros: { protein: 'medium', fat: 'medium', carb: 'medium' }, taste: 'balanced',
    suitableFor: ['adults', 'teenagers', 'old'], cookingTime: 'comfort',
    benefit: 'A complete protein with all nine essential amino acids — balanced fuel without the post-meal slump.',
    time: '35 min', source: 'seed',
    ingredients: ['Quinoa (1 cup)', 'Zucchini (2)', 'Cherry tomatoes', 'Feta cheese (100g)', 'Olive oil', 'Balsamic vinegar', 'Pine nuts', 'Arugula'] },
  { id: 'mango-sticky-rice', name: 'Mango Coconut Sticky Rice', accent: '#D97706',
    macros: { protein: 'low', fat: 'medium', carb: 'high' }, taste: 'sweet',
    suitableFor: ['kids', 'teenagers', 'adults'], cookingTime: 'comfort',
    benefit: 'Satisfies the sweet tooth without refined sugar — vitamin C from mango supports immunity.',
    time: '30 min', source: 'seed',
    ingredients: ['Sticky rice (1 cup)', 'Ripe mango (2)', 'Coconut milk (1 cup)', 'Palm sugar', 'Salt', 'Sesame seeds'] },
  { id: 'tamarind-rasam', name: 'Tangy Tomato Rasam', accent: '#BE123C',
    macros: { protein: 'low', fat: 'low', carb: 'low' }, taste: 'sour',
    suitableFor: ['old', 'adults'], cookingTime: 'quick',
    benefit: 'Tamarind aids digestion; light and warming, gentle on senior stomachs.',
    time: '20 min', source: 'seed',
    ingredients: ['Tomatoes (4)', 'Tamarind paste (2 tbsp)', 'Toor dal (½ cup)', 'Curry leaves', 'Mustard seeds', 'Asafoetida', 'Black pepper', 'Cilantro'] },
  { id: 'avocado-toast-deluxe', name: 'Avocado Toast with Egg', accent: '#15803D',
    macros: { protein: 'medium', fat: 'high', carb: 'medium' }, taste: 'balanced',
    suitableFor: ['adults', 'teenagers'], cookingTime: 'quick',
    benefit: 'Healthy fats from avocado support brain function — keeps teenagers focused through morning classes.',
    time: '15 min', source: 'seed',
    ingredients: ['Avocado (2)', 'Sourdough bread (4 slices)', 'Eggs (4)', 'Chili flakes', 'Lemon (1)', 'Sea salt', 'Microgreens'] },
  { id: 'spinach-paneer-paratha', name: 'Spinach Paneer Paratha', accent: '#166534',
    macros: { protein: 'high', fat: 'medium', carb: 'high' }, taste: 'balanced',
    suitableFor: ['kids', 'teenagers', 'adults', 'old'], cookingTime: 'slow',
    benefit: 'Iron-rich spinach folded inside flatbread — kids eat their greens without protest.',
    time: '40 min', source: 'seed',
    ingredients: ['Whole wheat flour (2 cups)', 'Paneer (200g)', 'Spinach (3 cups)', 'Ginger (1 inch)', 'Green chili', 'Cumin', 'Ghee', 'Yogurt'] },
  { id: 'kimchi-fried-rice', name: 'Kimchi Fried Rice', accent: '#9F1239',
    macros: { protein: 'medium', fat: 'medium', carb: 'high' }, taste: 'tangy',
    suitableFor: ['adults', 'teenagers'], cookingTime: 'quick',
    benefit: 'Fermented kimchi supports gut health — probiotics improve immunity and digestion.',
    time: '20 min', source: 'seed',
    ingredients: ['Cooked rice (3 cups)', 'Kimchi (1 cup)', 'Eggs (2)', 'Scallions', 'Sesame oil', 'Soy sauce', 'Gochujang', 'Nori'] },
  { id: 'oatmeal-berry-bowl', name: 'Cinnamon Berry Oatmeal', accent: '#7C3AED',
    macros: { protein: 'low', fat: 'low', carb: 'high' }, taste: 'sweet',
    suitableFor: ['kids', 'old', 'adults'], cookingTime: 'quick',
    benefit: 'Beta-glucan in oats lowers cholesterol — a gentle morning bowl that suits every generation.',
    time: '15 min', source: 'seed',
    ingredients: ['Rolled oats (1 cup)', 'Mixed berries (2 cups)', 'Milk (2 cups)', 'Cinnamon', 'Honey', 'Almonds', 'Chia seeds'] },
];

// ============================================================
//  Scoring engine
//  Same hybrid logic — explicit preferences + implicit feedback signals
// ============================================================
export function scoreRecipe(recipe, prefs, analytics) {
  let score = 0;
  if (recipe.macros.protein === prefs.protein) score += 3;
  if (recipe.macros.fat === prefs.fat) score += 2;
  if (recipe.macros.carb === prefs.carb) score += 2;
  if (recipe.taste === prefs.taste || prefs.taste === 'balanced') score += 3;
  const audienceMatch = prefs.audience.some(a => recipe.suitableFor.includes(a));
  if (audienceMatch) score += 4; else score -= 5;

  // Premium-only: cooking time mood (only counted if pref is set)
  if (prefs.cookingTime && recipe.cookingTime === prefs.cookingTime) score += 2;

  const a = analytics[recipe.id] || { likes: 0, dislikes: 0, visits: 0, dwellMs: 0 };
  score += a.likes * 2;
  score -= a.dislikes * 3;
  score += Math.min(a.visits, 5) * 0.5;
  score += Math.min(a.dwellMs / 60000, 5) * 0.4;
  return score;
}

// ============================================================
//  LLM agent — fetches a brand-new recipe from the Vercel function
// ============================================================
export async function fetchLLMRecipe(prefs, feedback, existingNames) {
  const likedNames = Object.entries(feedback).filter(([, v]) => v === 'like').map(([id]) => existingNames[id]).filter(Boolean).slice(0, 5);
  const dislikedNames = Object.entries(feedback).filter(([, v]) => v === 'dislike').map(([id]) => existingNames[id]).filter(Boolean).slice(0, 5);
  const res = await fetch('/api/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefs, likedRecipes: likedNames, dislikedRecipes: dislikedNames, avoidNames: Object.values(existingNames) }),
  });
  if (!res.ok) throw new Error(`Backend ${res.status}`);
  return await res.json();
}
