// ============================================================
//  Theme tokens
//  Two complete visual systems, identical structure, different values.
//  Every component reads from the active theme via useTheme().
// ============================================================

export const WARM_THEME = {
  id: 'warm',
  name: 'Everyday',
  fonts: {
    sans: '"Inter", system-ui, sans-serif',
    serif: '"Fraunces", Georgia, serif',
    mono: 'ui-monospace, monospace',
  },
  colors: {
    pageBg: '#FAF7F2',
    surface: '#FFFFFF',
    surfaceMuted: '#FAF7F2',
    text: '#3F2A1A',
    textMuted: '#7A6852',
    textHint: '#A8896B',
    accent: '#C2410C',
    accentSoft: '#FAF0E6',
    border: '#E5DDD0',
    borderSoft: '#F0EBE0',
    inverted: '#3F2A1A',
    invertedText: '#FFFFFF',
    danger: '#A0522D',
  },
  radius: { sm: 6, md: 8, lg: 12 },
  // Copy variations
  copy: {
    appName: 'The Everyday Kitchen',
    tagline: 'Recipes that adapt to what your family loves.',
    formTitle: 'Tell us a little about today',
    formSubtitle: "Three quick questions — we'll learn the rest as you cook.",
    q1: 'How would you like to balance your day?',
    q2: 'What flavor are you in the mood for?',
    q3: "Who's at the table?",
    submitCta: "See tonight's recipes",
    tonightTitle: "Tonight's selections",
    macroLabels: { low: 'Low', medium: 'Medium', high: 'High' },
    tasteLabels: { spicy: 'Spicy', tangy: 'Tangy', sweet: 'Sweet', sour: 'Sour', balanced: 'Balanced' },
    audienceLabels: { kids: 'Children', teenagers: 'Teenagers', adults: 'Adults', old: 'Seniors' },
    shoppingTitle: 'Shopping reminder',
    shoppingBody: (day) => `You shop on ${day}.`,
    groceryHeading: 'Grocery list',
    groceryHint: 'Uncheck what you already have.',
    askLLMCta: 'Suggest new',
    insightsCta: 'Insights',
    ledgerHeading: 'What we\'re learning',
    section: (n) => String(n).padStart(2, '0'),
  },
};

export const LUX_THEME = {
  id: 'lux',
  name: 'Atelier',
  fonts: {
    sans: '"Inter", system-ui, sans-serif',
    serif: '"Cormorant Garamond", "Fraunces", Georgia, serif',
    mono: 'ui-monospace, monospace',
  },
  colors: {
    pageBg: '#F5F1EA',
    surface: '#FFFFFF',
    surfaceMuted: '#F5F1EA',
    text: '#1A1410',
    textMuted: '#6B5D4F',
    textHint: '#8B7355',
    accent: '#A68A2D',         // antique gold
    accentSoft: '#F0EBDF',
    border: '#D4C8B5',
    borderSoft: '#F0EBE0',
    inverted: '#1A1410',       // deep espresso
    invertedText: '#F5F1EA',
    invertedAccent: '#A68A2D',
    danger: '#6B5D4F',
  },
  radius: { sm: 2, md: 2, lg: 4 }, // sharper corners read as more refined
  copy: {
    appName: 'The Everyday Kitchen',
    tagline: 'Recipes composed for the table you keep.',
    formTitle: 'Three quiet questions',
    formSubtitle: 'We learn the rest as you cook.',
    q1: 'A question of balance',
    q2: 'A question of mood',
    q3: 'A question of company',
    submitCta: "Compose tonight's selection",
    tonightTitle: "Tonight's selection",
    macroLabels: { low: 'Modest', medium: 'Considered', high: 'Generous' },
    tasteLabels: { spicy: 'Spirited', tangy: 'Bright', sweet: 'Tender', sour: 'Sharp', balanced: 'Composed' },
    audienceLabels: { kids: 'Little ones', teenagers: 'Teenagers', adults: 'Adults', old: 'Elders' },
    shoppingTitle: 'The ledger',
    shoppingBody: (day) => `For ${day}'s market.`,
    groceryHeading: 'To gather',
    groceryHint: 'Set aside what is already in your kitchen.',
    askLLMCta: 'Commission new',
    insightsCta: 'The ledger',
    ledgerHeading: 'What the kitchen has learned',
    section: (n) => ['i', 'ii', 'iii', 'iv', 'v', 'vi'][n - 1] || String(n),
  },
};

export const THEMES = { warm: WARM_THEME, lux: LUX_THEME };
