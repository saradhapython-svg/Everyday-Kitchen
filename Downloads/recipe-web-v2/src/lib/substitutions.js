// ============================================================
//  Ingredient substitution database
//
//  Maps common ingredients to alternative versions for dietary preferences.
//  Used by:
//   - Free users: inline swap hints on recipe detail page when prefs mismatch
//   - Premium users: hint data feeds the "Rewrite for my preferences" LLM call as context
//
//  Schema:
//   {
//     <keyword>: {
//       <target-pref>: { swap, ratio, notes, costImpact? }
//     }
//   }
//
//  Matching is keyword-based (case-insensitive substring) so "whole wheat flour"
//  and "wheat flour" both match the same swap rule.
// ============================================================

export const SUBSTITUTIONS = {
  // === CARBS — flours, grains, breads ===
  'wheat flour': {
    lowCarb: {
      swap: 'Almond flour',
      ratio: '0.75x (use 1.5 cups for every 2 cups)',
      notes: 'Less stretchy dough. Add 2 tbsp psyllium husk per cup for binding.',
    },
  },
  'all-purpose flour': {
    lowCarb: {
      swap: 'Almond flour or coconut flour',
      ratio: '0.75x for almond, 0.25x for coconut',
      notes: 'Coconut flour absorbs much more liquid — add an extra egg if baking.',
    },
  },
  'brown rice': {
    lowCarb: {
      swap: 'Cauliflower rice',
      ratio: 'Equal volume',
      notes: 'Cooks in 3-4 min vs 25 min. Pulse cauliflower in food processor first.',
    },
  },
  'jasmine rice': {
    lowCarb: {
      swap: 'Cauliflower rice',
      ratio: 'Equal volume',
      notes: 'Stir-fry for 3 min instead of simmering. Drier texture works well with curries.',
    },
  },
  'sticky rice': {
    lowCarb: {
      swap: 'Cauliflower rice + chia gel',
      ratio: 'Equal volume + 2 tbsp chia per cup',
      notes: 'Soak chia in water for 10 min first to mimic the sticky texture.',
    },
  },
  'rolled oats': {
    lowCarb: {
      swap: 'Hemp hearts + chia seeds',
      ratio: 'Half-and-half mix, equal total volume',
      notes: 'Soak in milk for 5 min before eating. Slightly nuttier flavor.',
    },
  },
  'sourdough bread': {
    lowCarb: {
      swap: 'Cloud bread or lettuce wraps',
      ratio: '1 slice equivalent',
      notes: 'For toast recipes, use almond flour bread or lettuce as the base.',
    },
  },
  'pita bread': {
    lowCarb: {
      swap: 'Cucumber rounds or romaine leaves',
      ratio: 'About 4 slices per pita',
      notes: 'For dipping recipes. Less structural but very fresh.',
    },
  },
  'quinoa': {
    lowCarb: {
      swap: 'Cauliflower rice',
      ratio: 'Equal volume',
      notes: 'You lose the complete protein. Add hemp hearts or tofu to compensate.',
    },
  },
  'sweet potato': {
    lowCarb: {
      swap: 'Cauliflower or butternut squash',
      ratio: 'Equal volume',
      notes: 'Butternut squash is still carby but lower than sweet potato.',
    },
  },

  // === SUGARS — sweeteners ===
  'maple syrup': {
    lowCarb: {
      swap: 'Sugar-free maple syrup or monk fruit syrup',
      ratio: 'Equal volume',
      notes: 'Adjust to taste — some sugar-free versions are sweeter.',
    },
    lowSugar: {
      swap: 'Mashed ripe banana or date paste',
      ratio: 'Equal volume',
      notes: 'Natural sweetness from whole fruit, with fiber.',
    },
  },
  'palm sugar': {
    lowCarb: {
      swap: 'Allulose or erythritol',
      ratio: 'Equal volume',
      notes: 'Won\'t caramelize the same. Brown the recipe with extra vanilla.',
    },
    lowSugar: {
      swap: 'Date paste',
      ratio: 'Equal volume',
      notes: 'Soak dates in warm water 10 min, blend smooth.',
    },
  },
  'honey': {
    lowCarb: {
      swap: 'Sugar-free honey substitute or stevia drops',
      ratio: 'Use sparingly with stevia',
      notes: 'Stevia is 200x sweeter than sugar — start with a few drops.',
    },
    lowSugar: {
      swap: 'Mashed ripe banana',
      ratio: 'Equal volume',
      notes: 'Adds natural sweetness and creaminess.',
    },
  },
  'sugar': {
    lowCarb: {
      swap: 'Erythritol or monk fruit sweetener',
      ratio: 'Equal volume for most',
      notes: 'Some sugar substitutes have a cooling aftertaste — taste before committing.',
    },
    lowSugar: {
      swap: 'Mashed banana or applesauce',
      ratio: '¾x volume',
      notes: 'Reduce other liquids slightly to compensate.',
    },
  },

  // === FATS — oils and dairy for low-fat swaps ===
  'ghee': {
    lowFat: {
      swap: 'Vegetable broth',
      ratio: 'Equal volume',
      notes: 'You lose richness. Add a splash of lemon juice at the end for brightness.',
    },
  },
  'olive oil': {
    lowFat: {
      swap: 'Vegetable broth or water',
      ratio: 'Half the original amount',
      notes: 'Only works for sautéing, not for dressings or roasting.',
    },
  },
  'coconut oil': {
    lowFat: {
      swap: 'Vegetable broth',
      ratio: 'Half the original amount',
      notes: 'Lose the coconut flavor. Add ¼ tsp coconut extract if you want to keep it.',
    },
  },
  'butter': {
    lowFat: {
      swap: 'Greek yogurt or applesauce',
      ratio: '¾x volume',
      notes: 'For baking only. Won\'t work for sautéing.',
    },
  },
  'coconut milk': {
    lowFat: {
      swap: 'Light coconut milk or coconut water + cornstarch',
      ratio: 'Equal volume',
      notes: 'Less creamy. Whisk in 1 tsp cornstarch for body if needed.',
    },
  },
  'feta cheese': {
    lowFat: {
      swap: 'Low-fat feta or Greek yogurt with lemon',
      ratio: 'Equal volume',
      notes: 'For salads, marinated tofu also works.',
    },
  },
  'paneer': {
    lowFat: {
      swap: 'Low-fat paneer or pressed tofu',
      ratio: 'Equal volume',
      notes: 'Tofu absorbs flavor differently — marinate longer.',
    },
  },

  // === PROTEINS — for high-protein needs (boost existing recipes) ===
  // (Not as common but useful for users wanting more protein)
};

// Keys sorted by length descending — match longest first so "whole wheat flour"
// wins over "flour" when scanning ingredient text.
const SORTED_KEYS = Object.keys(SUBSTITUTIONS).sort((a, b) => b.length - a.length);

/**
 * Find all applicable substitutions for an ingredient string, given user prefs.
 *
 * @param {string} ingredientText - e.g. "Whole wheat flour (2 cups)"
 * @param {object} prefs - { carb: 'low', fat: 'low', ... }
 * @returns {Array<{key, sub}>} - applicable substitution suggestions
 */
export function findSubstitutions(ingredientText, prefs) {
  if (!ingredientText || !prefs) return [];
  const lower = ingredientText.toLowerCase();
  const results = [];
  const matchedKeys = new Set();

  for (const key of SORTED_KEYS) {
    if (lower.includes(key)) {
      // Skip if we already matched a longer key that contained this one
      const wasContained = [...matchedKeys].some(k => k.includes(key));
      if (wasContained) continue;
      matchedKeys.add(key);

      const subs = SUBSTITUTIONS[key];
      // Check each preference dimension
      if (prefs.carb === 'low' && subs.lowCarb) {
        results.push({ key, target: 'lowCarb', sub: subs.lowCarb });
      }
      if (prefs.fat === 'low' && subs.lowFat) {
        results.push({ key, target: 'lowFat', sub: subs.lowFat });
      }
      if (subs.lowSugar) {
        // Sugar substitutions trigger if user picked taste !== 'sweet' or carb === 'low'
        if (prefs.carb === 'low' || prefs.taste !== 'sweet') {
          results.push({ key, target: 'lowSugar', sub: subs.lowSugar });
        }
      }
    }
  }
  return results;
}

// Human-readable label for the swap reason
export const SWAP_LABELS = {
  lowCarb: 'Low-carb swap',
  lowFat: 'Low-fat swap',
  lowSugar: 'No-sugar swap',
};
