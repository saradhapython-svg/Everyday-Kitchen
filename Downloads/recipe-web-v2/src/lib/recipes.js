// ============================================================
//  Recipes — seed data + scoring engine
//  Each recipe has simpleSteps, cookingMode, and mealTime tagging
// ============================================================

export const MEAL_TIMES = ['breakfast', 'lunch', 'dinner', 'snack'];

export const MEAL_TIME_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export const MEAL_TIME_LABELS_LUX = {
  breakfast: 'Morning',
  lunch: 'Midday',
  dinner: 'Evening',
  snack: 'Between',
};

export const SEED_RECIPES = [
  {
    id: 'paneer-tikka-bowl', name: 'Paneer Tikka Bowl', accent: '#C2410C',
    macros: { protein: 'high', fat: 'medium', carb: 'medium' }, taste: 'spicy',
    suitableFor: ['adults', 'teenagers'], cookingTime: 'comfort',
    mealTime: ['lunch', 'dinner'],
    benefit: 'Packs 28g of protein per serving — sustained fuel for active days and post-workout recovery.',
    time: '35 min', source: 'seed',
    ingredients: ['Paneer (250g, cubed)', 'Bell peppers (2, chunked)', 'Greek yogurt (1 cup)', 'Garam masala (2 tsp)', 'Brown rice (1 cup, dry)', 'Spinach (2 cups)', 'Lemon (1, juiced)', 'Garlic (4 cloves, minced)'],
    simpleSteps: [
      'Whisk yogurt with garam masala, garlic, and a pinch of salt. Toss the paneer and bell pepper chunks in this marinade for at least 15 minutes.',
      'Start the rice — bring it to a boil with 2 cups water, then simmer covered for 20 minutes.',
      'Heat a wide pan or grill pan over medium-high. Once hot, add the paneer and peppers in a single layer. Cook 8–10 minutes, turning to char the edges.',
      'Wilt the spinach in the same pan with a splash of water — takes about 2 minutes.',
      'Divide the rice into bowls, top with spinach, paneer, and peppers. Squeeze lemon over everything just before eating.',
    ],
    cookingMode: [
      { text: 'Whisk yogurt, garam masala, garlic, and salt in a bowl. Add paneer and bell peppers, toss gently.', timer: 15, timerLabel: 'Marinate' },
      { text: 'Rinse 1 cup brown rice. Combine with 2 cups water in a saucepan. Bring to a boil, then cover and reduce heat to low.', timer: 20, timerLabel: 'Simmer rice' },
      { text: 'Heat a wide pan over medium-high heat. Add the marinated paneer and peppers in a single layer.' },
      { text: 'Cook without stirring for 4 minutes, then flip everything once.', timer: 4, timerLabel: 'First side' },
      { text: 'Cook for another 4 minutes until edges are charred.', timer: 4, timerLabel: 'Second side' },
      { text: 'Push everything to one side of the pan. Add spinach with a splash of water and stir until just wilted.', timer: 2, timerLabel: 'Wilt spinach' },
      { text: 'Divide rice between two bowls. Top with spinach, then paneer and peppers. Finish with lemon juice.' },
    ],
  },
  {
    id: 'chickpea-mediterranean', name: 'Mediterranean Chickpea Stew', accent: '#B45309',
    macros: { protein: 'high', fat: 'medium', carb: 'high' }, taste: 'tangy',
    suitableFor: ['adults', 'old', 'kids'], cookingTime: 'comfort',
    mealTime: ['lunch', 'dinner'],
    benefit: 'Gentle on digestion across ages — fiber and olive oil support heart health for the whole family.',
    time: '40 min', source: 'seed',
    ingredients: ['Chickpeas (2 cans, drained)', 'Tomatoes (4, chopped)', 'Olive oil (3 tbsp)', 'Lemon (2, juiced)', 'Parsley (1 bunch, chopped)', 'Onion (1, diced)', 'Cumin (1 tsp)', 'Pita bread (to serve)'],
    simpleSteps: [
      'Heat olive oil in a large pot over medium heat. Add the diced onion and cook until soft and translucent, about 5 minutes.',
      'Stir in the cumin and let it bloom for 30 seconds — the kitchen will smell like a market.',
      'Add the chopped tomatoes and a generous pinch of salt. Cook down for 10 minutes, stirring occasionally.',
      'Add the drained chickpeas with about half a cup of water. Simmer gently for 15 minutes so the flavors meld.',
      'Finish with lemon juice and chopped parsley. Warm the pita while you ladle into bowls.',
    ],
    cookingMode: [
      { text: 'Heat 3 tbsp olive oil in a large pot over medium heat.' },
      { text: 'Add diced onion and a pinch of salt. Cook until soft and translucent, stirring occasionally.', timer: 5, timerLabel: 'Soften onion' },
      { text: 'Stir in 1 tsp cumin. Let it bloom in the oil for 30 seconds.', timer: 1, timerLabel: 'Bloom spice' },
      { text: 'Add chopped tomatoes and another pinch of salt. Cook down until the tomatoes break apart.', timer: 10, timerLabel: 'Reduce tomatoes' },
      { text: 'Drain the chickpeas and add to the pot with ½ cup water. Stir to combine.' },
      { text: 'Simmer gently, lid slightly ajar, until the flavors meld and stew thickens.', timer: 15, timerLabel: 'Simmer stew' },
      { text: 'Off the heat, squeeze in lemon juice and stir in chopped parsley.' },
      { text: 'Warm pita bread in a dry pan or oven while you serve.', timer: 2, timerLabel: 'Warm pita' },
    ],
  },
  {
    id: 'sweet-potato-pancakes', name: 'Sweet Potato Pancakes', accent: '#DC2626',
    macros: { protein: 'medium', fat: 'low', carb: 'high' }, taste: 'sweet',
    suitableFor: ['kids', 'teenagers', 'adults'], cookingTime: 'quick',
    mealTime: ['breakfast'],
    benefit: 'Naturally sweet so kids skip the syrup — beta-carotene supports growing eyes and immunity.',
    time: '25 min', source: 'seed',
    ingredients: ['Sweet potato (2 large, peeled)', 'Eggs (2)', 'Whole wheat flour (1 cup)', 'Cinnamon (1 tsp)', 'Maple syrup (to serve)', 'Milk (1 cup)', 'Vanilla extract (1 tsp)'],
    simpleSteps: [
      'Cube and microwave the sweet potatoes for 6–8 minutes until completely soft. Mash thoroughly with a fork.',
      'In a large bowl, whisk together the eggs, milk, and vanilla. Add the mashed sweet potato and stir until smooth.',
      'Fold in the flour and cinnamon. The batter should be thick but pourable — add a splash more milk if needed.',
      'Heat a non-stick pan over medium-low. Ladle the batter into rounds. Cook 2–3 minutes per side, until golden.',
      "Stack and serve with maple syrup — though they're sweet enough on their own.",
    ],
    cookingMode: [
      { text: 'Peel and cube 2 large sweet potatoes. Place in a microwave-safe bowl with 2 tbsp water, cover loosely.' },
      { text: 'Microwave on high until completely fork-tender.', timer: 8, timerLabel: 'Cook potato' },
      { text: 'Mash the cooked sweet potato thoroughly with a fork until no lumps remain.' },
      { text: 'In a large bowl, whisk 2 eggs, 1 cup milk, and 1 tsp vanilla extract.' },
      { text: 'Add the mashed sweet potato to the bowl and stir until smooth.' },
      { text: 'Fold in 1 cup whole wheat flour and 1 tsp cinnamon until just combined.' },
      { text: 'Heat a non-stick pan over medium-low heat. Lightly grease.' },
      { text: 'Ladle batter into 4-inch rounds. Cook until bubbles form on top.', timer: 3, timerLabel: 'First side' },
      { text: 'Flip carefully and cook until golden brown.', timer: 2, timerLabel: 'Second side' },
      { text: 'Stack on a warm plate. Serve with maple syrup.' },
    ],
  },
  {
    id: 'thai-tofu-curry', name: 'Thai Red Tofu Curry', accent: '#B91C1C',
    macros: { protein: 'high', fat: 'high', carb: 'medium' }, taste: 'spicy',
    suitableFor: ['adults', 'teenagers'], cookingTime: 'comfort',
    mealTime: ['dinner'],
    benefit: 'Coconut milk delivers MCTs for sustained energy; tofu provides complete plant protein.',
    time: '30 min', source: 'seed',
    ingredients: ['Firm tofu (400g, cubed)', 'Coconut milk (1 can, full-fat)', 'Red curry paste (3 tbsp)', 'Jasmine rice (1 cup, dry)', 'Bok choy (2 heads, halved)', 'Lime (2, juiced)', 'Thai basil (1 handful)', 'Bamboo shoots (1 small can)'],
    simpleSteps: [
      'Rinse the rice and cook it — 1 cup rice with 1.5 cups water, simmered covered for 15 minutes.',
      'Press the tofu between paper towels for 5 minutes to remove excess water, then cube.',
      'In a deep pan, fry the red curry paste in 2 tbsp of the thick top layer of coconut milk for 1–2 minutes until very fragrant.',
      'Pour in the rest of the coconut milk, add the tofu and bamboo shoots, and simmer for 8 minutes.',
      'Add the halved bok choy and cook for another 3 minutes until just tender. Finish with lime juice and torn Thai basil.',
      'Serve over rice in deep bowls — and warn the spice-shy.',
    ],
    cookingMode: [
      { text: 'Rinse 1 cup jasmine rice. Combine with 1.5 cups water in a saucepan and bring to a boil.' },
      { text: 'Reduce heat to low, cover, and cook until water is absorbed.', timer: 15, timerLabel: 'Rice' },
      { text: 'Press 400g firm tofu between paper towels with something heavy on top.', timer: 5, timerLabel: 'Press tofu' },
      { text: 'Cube the pressed tofu into 1-inch pieces.' },
      { text: 'Open the can of coconut milk WITHOUT shaking it. Scoop the thick top cream into a deep pan.' },
      { text: 'Heat the pan over medium. Add 3 tbsp red curry paste and stir constantly until very fragrant and oil separates.', timer: 2, timerLabel: 'Bloom curry' },
      { text: 'Pour in the rest of the coconut milk and stir to combine.' },
      { text: 'Add tofu and drained bamboo shoots. Simmer gently.', timer: 8, timerLabel: 'Infuse tofu' },
      { text: 'Add halved bok choy. Cook until stems are just tender.', timer: 3, timerLabel: 'Tender greens' },
      { text: 'Off the heat: squeeze in lime juice and tear in Thai basil leaves.' },
      { text: 'Fluff the rice with a fork and serve the curry over it in deep bowls.' },
    ],
  },
  {
    id: 'lentil-soup', name: 'Golden Lentil Soup', accent: '#CA8A04',
    macros: { protein: 'medium', fat: 'low', carb: 'medium' }, taste: 'balanced',
    suitableFor: ['old', 'kids', 'adults'], cookingTime: 'comfort',
    mealTime: ['lunch', 'dinner'],
    benefit: 'Soft, easily chewable and iron-rich — well-suited for grandparents and young children alike.',
    time: '30 min', source: 'seed',
    ingredients: ['Red lentils (1 cup, rinsed)', 'Carrots (3, diced)', 'Turmeric (1 tsp)', 'Ginger (1 inch, grated)', 'Vegetable broth (4 cups)', 'Coconut oil (2 tbsp)', 'Cilantro (a handful)', 'Lime (1, juiced)'],
    simpleSteps: [
      'Melt the coconut oil in a pot over medium heat. Add the diced carrots and grated ginger, cook for 4 minutes until fragrant.',
      'Stir in the turmeric — it should turn everything a deep gold. Let it bloom for 30 seconds.',
      'Add the rinsed lentils, broth, and a generous pinch of salt. Bring to a boil, then reduce to a simmer.',
      'Cook for 20 minutes until the lentils completely break down and the soup thickens.',
      'Blend smooth with an immersion blender (or leave rustic). Stir in lime juice and torn cilantro just before serving.',
    ],
    cookingMode: [
      { text: 'Rinse 1 cup red lentils under cold water until the water runs clear.' },
      { text: 'Melt 2 tbsp coconut oil in a heavy pot over medium heat.' },
      { text: 'Add 3 diced carrots and 1 inch grated ginger. Stir occasionally.', timer: 4, timerLabel: 'Soften carrots' },
      { text: 'Stir in 1 tsp turmeric. Cook for 30 seconds until very fragrant.', timer: 1, timerLabel: 'Bloom turmeric' },
      { text: 'Add the rinsed lentils, 4 cups vegetable broth, and 1 tsp salt. Bring to a boil.' },
      { text: 'Reduce heat to low and simmer, partially covered, until lentils completely break down.', timer: 20, timerLabel: 'Simmer soup' },
      { text: 'Off the heat: use an immersion blender to puree until smooth (or leave rustic).' },
      { text: 'Stir in juice of 1 lime and a handful of torn cilantro.' },
    ],
  },
  {
    id: 'quinoa-roasted-veg', name: 'Quinoa & Roasted Vegetable Bowl', accent: '#65A30D',
    macros: { protein: 'medium', fat: 'medium', carb: 'medium' }, taste: 'balanced',
    suitableFor: ['adults', 'teenagers', 'old'], cookingTime: 'comfort',
    mealTime: ['lunch', 'dinner'],
    benefit: 'A complete protein with all nine essential amino acids — balanced fuel without the post-meal slump.',
    time: '35 min', source: 'seed',
    ingredients: ['Quinoa (1 cup, rinsed)', 'Zucchini (2, sliced)', 'Cherry tomatoes (2 cups)', 'Feta cheese (100g, crumbled)', 'Olive oil (3 tbsp)', 'Balsamic vinegar (2 tbsp)', 'Pine nuts (¼ cup)', 'Arugula (2 cups)'],
    simpleSteps: [
      'Preheat the oven to 425°F (220°C). Rinse the quinoa under cold water until it runs clear.',
      'Toss the zucchini and cherry tomatoes with olive oil and salt on a sheet pan. Roast for 20 minutes.',
      'While vegetables roast, simmer the quinoa with 2 cups of water for 15 minutes, then let it rest covered for 5 more.',
      'Toast the pine nuts in a dry pan over medium heat — 3 minutes, shaking often, until golden. Watch closely; they burn fast.',
      'Fluff the quinoa, fold in the arugula, top with the roasted vegetables, crumbled feta, and pine nuts. Drizzle balsamic over.',
    ],
    cookingMode: [
      { text: 'Preheat oven to 425°F (220°C).' },
      { text: 'Rinse 1 cup quinoa in a fine mesh strainer until water runs clear.' },
      { text: 'Slice 2 zucchini into half-moons. Place on a sheet pan with 2 cups cherry tomatoes.' },
      { text: 'Drizzle with 2 tbsp olive oil and a pinch of salt. Toss to coat.' },
      { text: 'Roast in the oven until tomatoes burst and zucchini is tender.', timer: 20, timerLabel: 'Roast vegetables' },
      { text: 'While vegetables roast: combine quinoa and 2 cups water in a saucepan. Bring to a boil.' },
      { text: 'Reduce heat to low, cover, and simmer.', timer: 15, timerLabel: 'Cook quinoa' },
      { text: 'Remove quinoa from heat and let it rest, covered.', timer: 5, timerLabel: 'Rest' },
      { text: 'Toast ¼ cup pine nuts in a dry pan over medium heat, shaking often.', timer: 3, timerLabel: 'Toast pine nuts' },
      { text: 'Fluff quinoa with a fork. Fold in 2 cups arugula.' },
      { text: 'Plate: quinoa base, roasted vegetables, crumbled feta, pine nuts. Drizzle 2 tbsp balsamic over.' },
    ],
  },
  {
    id: 'mango-sticky-rice', name: 'Mango Coconut Sticky Rice', accent: '#D97706',
    macros: { protein: 'low', fat: 'medium', carb: 'high' }, taste: 'sweet',
    suitableFor: ['kids', 'teenagers', 'adults'], cookingTime: 'comfort',
    mealTime: ['snack', 'breakfast'],
    benefit: 'Satisfies the sweet tooth without refined sugar — vitamin C from mango supports immunity.',
    time: '30 min', source: 'seed',
    ingredients: ['Sticky rice (1 cup, soaked)', 'Ripe mango (2, sliced)', 'Coconut milk (1 cup)', 'Palm sugar (¼ cup)', 'Salt (¼ tsp)', 'Sesame seeds (1 tbsp, toasted)'],
    simpleSteps: [
      'Soak the sticky rice for at least 4 hours, or overnight if you can plan ahead.',
      'Drain and steam the rice in a bamboo steamer or fine mesh sieve over boiling water for 25 minutes.',
      'While it steams, gently warm the coconut milk with palm sugar and salt — stir until the sugar dissolves. Do not let it boil.',
      'Pour two-thirds of the coconut sauce over the hot rice, mix gently, and let it absorb for 10 minutes.',
      'Slice the mango thin. Serve mounds of rice with mango on the side, the rest of the coconut sauce poured over, and a sprinkle of sesame.',
    ],
    cookingMode: [
      { text: 'Place 1 cup sticky rice in a bowl, cover with water, and soak.', timer: 240, timerLabel: 'Soak rice' },
      { text: 'Drain the rice thoroughly.' },
      { text: 'Set up a bamboo steamer or fine mesh sieve over a pot of boiling water. Place rice inside.' },
      { text: 'Steam covered until rice is translucent and tender.', timer: 25, timerLabel: 'Steam rice' },
      { text: 'In a small saucepan, gently warm 1 cup coconut milk, ¼ cup palm sugar, and ¼ tsp salt.' },
      { text: 'Stir until the sugar dissolves completely. Do not boil.', timer: 3, timerLabel: 'Make sauce' },
      { text: 'Transfer hot rice to a bowl. Pour ⅔ of the warm coconut sauce over it.' },
      { text: 'Gently mix and let the rice absorb the sauce.', timer: 10, timerLabel: 'Absorb' },
      { text: 'Slice 2 ripe mangoes into thin slabs.' },
      { text: 'Mound rice on plates, fan mango slices alongside. Drizzle remaining sauce. Sprinkle sesame seeds over.' },
    ],
  },
  {
    id: 'tamarind-rasam', name: 'Tangy Tomato Rasam', accent: '#BE123C',
    macros: { protein: 'low', fat: 'low', carb: 'low' }, taste: 'sour',
    suitableFor: ['old', 'adults'], cookingTime: 'quick',
    mealTime: ['lunch', 'dinner'],
    benefit: 'Tamarind aids digestion; light and warming, gentle on senior stomachs.',
    time: '20 min', source: 'seed',
    ingredients: ['Tomatoes (4, chopped)', 'Tamarind paste (2 tbsp)', 'Toor dal (½ cup, rinsed)', 'Curry leaves (10)', 'Mustard seeds (1 tsp)', 'Asafoetida (pinch)', 'Black pepper (½ tsp, freshly ground)', 'Cilantro (a handful, chopped)'],
    simpleSteps: [
      'Cook the toor dal: pressure cook for 3 whistles with 2 cups water, or simmer for 25 minutes until mushy.',
      'In a separate pot, simmer the chopped tomatoes with tamarind paste, black pepper, and 3 cups of water for 8 minutes.',
      'Mash the cooked dal and add it to the rasam pot. Simmer gently for 5 more minutes — do not let it boil hard.',
      'In a tiny pan, heat 1 tsp oil and pop the mustard seeds. Add curry leaves and asafoetida — they will sizzle and crackle.',
      'Pour this tempering over the rasam, add chopped cilantro, and serve hot in small bowls or as a soup.',
    ],
    cookingMode: [
      { text: 'Rinse ½ cup toor dal. Add to a pressure cooker with 2 cups water.' },
      { text: 'Pressure cook for 3 whistles, then let pressure release naturally.', timer: 20, timerLabel: 'Cook dal' },
      { text: 'While dal cooks: chop 4 tomatoes and place in a separate pot.' },
      { text: 'Add 2 tbsp tamarind paste, ½ tsp pepper, and 3 cups water. Bring to a gentle simmer.' },
      { text: 'Simmer until tomatoes soften and the broth turns rust-orange.', timer: 8, timerLabel: 'Tomato broth' },
      { text: 'Mash the cooked dal until smooth. Add it to the rasam pot and stir.' },
      { text: 'Simmer very gently — do not boil hard or it goes cloudy.', timer: 5, timerLabel: 'Marry flavors' },
      { text: 'In a small tadka pan, heat 1 tsp oil over medium-high.' },
      { text: 'Add 1 tsp mustard seeds. When they pop, add 10 curry leaves and a pinch of asafoetida.', timer: 1, timerLabel: 'Temper' },
      { text: 'Pour the sizzling tempering over the rasam. Stir in chopped cilantro.' },
      { text: 'Serve hot in small bowls.' },
    ],
  },
  {
    id: 'avocado-toast-deluxe', name: 'Avocado Toast with Egg', accent: '#15803D',
    macros: { protein: 'medium', fat: 'high', carb: 'medium' }, taste: 'balanced',
    suitableFor: ['adults', 'teenagers'], cookingTime: 'quick',
    mealTime: ['breakfast', 'lunch'],
    benefit: 'Healthy fats from avocado support brain function — keeps teenagers focused through morning classes.',
    time: '15 min', source: 'seed',
    ingredients: ['Avocado (2, ripe)', 'Sourdough bread (4 slices)', 'Eggs (4)', 'Chili flakes (to taste)', 'Lemon (1, juiced)', 'Sea salt (flaky)', 'Microgreens (a small handful)'],
    simpleSteps: [
      'Toast the sourdough until deeply golden — really golden, not pale. This is the foundation.',
      'While the bread toasts, halve and pit the avocados. Scoop into a bowl with a generous squeeze of lemon and a pinch of salt. Mash to your preferred texture.',
      'In a non-stick pan over medium heat, cook the eggs sunny-side-up in a film of olive oil — about 3 minutes for runny yolks.',
      'Spread the avocado generously on the toast. Slide an egg on top of each.',
      'Finish with flaky salt, chili flakes, and a few microgreens. Crack pepper if you like.',
    ],
    cookingMode: [
      { text: 'Toast 4 slices of sourdough bread until deeply golden — not pale.', timer: 3, timerLabel: 'Toast bread' },
      { text: 'Halve and pit 2 ripe avocados. Scoop into a bowl.' },
      { text: 'Add juice of 1 lemon and a generous pinch of salt. Mash with a fork to your preferred texture.' },
      { text: 'Heat a non-stick pan over medium heat. Add 1 tsp olive oil.' },
      { text: 'Crack in 4 eggs, leaving space between them. Cook undisturbed.', timer: 3, timerLabel: 'Sunny eggs' },
      { text: 'Spread the mashed avocado generously over each piece of toast.' },
      { text: 'Slide an egg on top of each toast.' },
      { text: 'Finish with flaky sea salt, chili flakes, and microgreens.' },
    ],
  },
  {
    id: 'spinach-paneer-paratha', name: 'Spinach Paneer Paratha', accent: '#166534',
    macros: { protein: 'high', fat: 'medium', carb: 'high' }, taste: 'balanced',
    suitableFor: ['kids', 'teenagers', 'adults', 'old'], cookingTime: 'slow',
    mealTime: ['breakfast', 'lunch', 'dinner'],
    benefit: 'Iron-rich spinach folded inside flatbread — kids eat their greens without protest.',
    time: '40 min', source: 'seed',
    ingredients: ['Whole wheat flour (2 cups)', 'Paneer (200g, grated)', 'Spinach (3 cups, finely chopped)', 'Ginger (1 inch, grated)', 'Green chili (1, minced)', 'Cumin (1 tsp)', 'Ghee (for cooking)', 'Yogurt (to serve)'],
    simpleSteps: [
      'Make the dough: mix flour with ¾ cup water and a pinch of salt. Knead for 5 minutes until smooth. Cover and rest for 15 minutes.',
      'Wilt the chopped spinach in a dry pan for 2 minutes, then squeeze out as much water as you can — this is the key step.',
      'Mix the squeezed spinach, grated paneer, ginger, chili, cumin, and salt in a bowl. The filling should be barely moist.',
      'Divide dough into 6 balls. Roll each into a small disc, place a heaping spoonful of filling in the center, pinch to seal, then roll out gently to flatten.',
      'Cook on a hot tawa or skillet, 2 minutes per side, brushing with ghee. Serve hot with cool yogurt.',
    ],
    cookingMode: [
      { text: 'In a large bowl, combine 2 cups whole wheat flour, ½ tsp salt, and ¾ cup water.' },
      { text: 'Knead with your hands until smooth and elastic.', timer: 5, timerLabel: 'Knead' },
      { text: 'Cover with a damp cloth and let rest.', timer: 15, timerLabel: 'Rest dough' },
      { text: 'While dough rests: finely chop 3 cups spinach.' },
      { text: 'Wilt the spinach in a dry pan over medium heat.', timer: 2, timerLabel: 'Wilt' },
      { text: 'Transfer wilted spinach to a clean towel. Squeeze out as much water as possible — be ruthless.' },
      { text: 'In a bowl, combine the squeezed spinach, 200g grated paneer, grated ginger, minced chili, 1 tsp cumin, and salt.' },
      { text: 'Divide rested dough into 6 equal balls.' },
      { text: 'Take one ball. Flatten into a 4-inch disc with your hands.' },
      { text: 'Place a heaping spoonful of filling in the center. Gather edges up and pinch closed at the top.' },
      { text: "Flatten gently and roll out into a 7-inch round, dusting with flour as needed. Don't rush — patches will tear." },
      { text: 'Heat a tawa or skillet over medium-high heat.' },
      { text: 'Cook each paratha 2 minutes per side, brushing with ghee, until golden brown spots form.', timer: 4, timerLabel: 'Cook paratha' },
      { text: 'Repeat with remaining dough and filling. Serve hot with yogurt.' },
    ],
  },
  {
    id: 'kimchi-fried-rice', name: 'Kimchi Fried Rice', accent: '#9F1239',
    macros: { protein: 'medium', fat: 'medium', carb: 'high' }, taste: 'tangy',
    suitableFor: ['adults', 'teenagers'], cookingTime: 'quick',
    mealTime: ['lunch', 'dinner'],
    benefit: 'Fermented kimchi supports gut health — probiotics improve immunity and digestion.',
    time: '20 min', source: 'seed',
    ingredients: ['Cooked rice (3 cups, day-old)', 'Kimchi (1 cup, chopped)', 'Eggs (2)', 'Scallions (4, sliced)', 'Sesame oil (2 tbsp)', 'Soy sauce (1 tbsp)', 'Gochujang (1 tbsp)', 'Nori (2 sheets, torn)'],
    simpleSteps: [
      'Day-old rice is non-negotiable. Fresh rice goes mushy. If you must use fresh, spread it on a sheet pan to cool first.',
      'Heat sesame oil in a wide pan over medium-high. Add the kimchi and stir-fry for 3 minutes until the edges caramelize.',
      'Stir in the gochujang for 30 seconds, then add the rice. Press it against the pan to develop crispy bits — leave it alone for stretches.',
      'Push the rice to one side, crack the eggs into the empty side, scramble them, then fold everything together.',
      'Finish with soy sauce, scallions, and torn nori. Eat directly from the pan.',
    ],
    cookingMode: [
      { text: 'Have 3 cups of day-old cooked rice ready. If freshly cooked, spread on a sheet pan to cool first.' },
      { text: 'Chop 1 cup kimchi. Slice 4 scallions.' },
      { text: 'Heat 2 tbsp sesame oil in a wide pan over medium-high heat.' },
      { text: 'Add the chopped kimchi. Stir-fry until edges caramelize.', timer: 3, timerLabel: 'Caramelize kimchi' },
      { text: 'Stir in 1 tbsp gochujang. Cook for 30 seconds until fragrant.', timer: 1, timerLabel: 'Bloom paste' },
      { text: 'Add the cold rice. Press it down against the pan to create a thin layer.' },
      { text: 'Cook undisturbed to develop crispy bits.', timer: 2, timerLabel: 'Crisp rice' },
      { text: 'Stir, then press flat again. Cook for another 2 minutes.', timer: 2, timerLabel: 'Crisp more' },
      { text: 'Push rice to one side of the pan. Crack 2 eggs into the empty side and scramble.', timer: 1, timerLabel: 'Eggs' },
      { text: 'Fold everything together. Drizzle 1 tbsp soy sauce around the edges.' },
      { text: 'Off the heat: scatter sliced scallions and torn nori sheets. Serve immediately.' },
    ],
  },
  {
    id: 'oatmeal-berry-bowl', name: 'Cinnamon Berry Oatmeal', accent: '#7C3AED',
    macros: { protein: 'low', fat: 'low', carb: 'high' }, taste: 'sweet',
    suitableFor: ['kids', 'old', 'adults'], cookingTime: 'quick',
    mealTime: ['breakfast'],
    benefit: 'Beta-glucan in oats lowers cholesterol — a gentle morning bowl that suits every generation.',
    time: '15 min', source: 'seed',
    ingredients: ['Rolled oats (1 cup)', 'Mixed berries (2 cups, fresh or frozen)', 'Milk (2 cups)', 'Cinnamon (½ tsp)', 'Honey (to drizzle)', 'Almonds (¼ cup, sliced)', 'Chia seeds (1 tbsp)'],
    simpleSteps: [
      'In a saucepan, bring the milk just to a simmer over medium heat — watch it, milk burns fast.',
      'Add the oats, cinnamon, and a pinch of salt. Stir, lower the heat, and simmer for 7 minutes, stirring occasionally.',
      'Meanwhile, if using frozen berries, warm them in a small pan with a splash of water for 3 minutes until juicy.',
      'Stir the chia seeds into the cooked oats — they thicken everything in a minute or two.',
      'Ladle into bowls, top with warm berries, sliced almonds, and a thread of honey.',
    ],
    cookingMode: [
      { text: 'Pour 2 cups milk into a saucepan. Heat over medium until just simmering.', timer: 3, timerLabel: 'Heat milk' },
      { text: 'Add 1 cup rolled oats, ½ tsp cinnamon, and a pinch of salt. Stir.' },
      { text: 'Reduce heat to medium-low and simmer, stirring occasionally.', timer: 7, timerLabel: 'Cook oats' },
      { text: 'In a small pan, warm 2 cups berries with a splash of water until juicy.', timer: 3, timerLabel: 'Warm berries' },
      { text: 'When oats are done, stir in 1 tbsp chia seeds. Let them thicken.', timer: 1, timerLabel: 'Thicken' },
      { text: 'Divide oatmeal into bowls. Top with warm berries.' },
      { text: 'Sprinkle ¼ cup sliced almonds over. Finish with a thread of honey.' },
    ],
  },
];

// ============================================================
//  Scoring engine — accepts optional mealTime filter
// ============================================================
export function scoreRecipe(recipe, prefs, analytics, currentMealTime = null) {
  let score = 0;
  if (recipe.macros.protein === prefs.protein) score += 3;
  if (recipe.macros.fat === prefs.fat) score += 2;
  if (recipe.macros.carb === prefs.carb) score += 2;
  if (recipe.taste === prefs.taste || prefs.taste === 'balanced') score += 3;
  const audienceMatch = prefs.audience.some(a => recipe.suitableFor.includes(a));
  if (audienceMatch) score += 4; else score -= 5;

  if (prefs.cookingTime && recipe.cookingTime === prefs.cookingTime) score += 2;

  if (currentMealTime) {
    if (recipe.mealTime?.includes(currentMealTime)) score += 6;
    else score -= 20;
  }

  const a = analytics[recipe.id] || { likes: 0, dislikes: 0, visits: 0, dwellMs: 0 };
  score += a.likes * 2;
  score -= a.dislikes * 3;
  score += Math.min(a.visits, 5) * 0.5;
  score += Math.min(a.dwellMs / 60000, 5) * 0.4;
  return score;
}

// ============================================================
//  LLM client — now also asks for mealTime when set
// ============================================================
export async function fetchLLMRecipe(prefs, feedback, existingNames, mealTime = null) {
  const likedNames = Object.entries(feedback).filter(([, v]) => v === 'like').map(([id]) => existingNames[id]).filter(Boolean).slice(0, 5);
  const dislikedNames = Object.entries(feedback).filter(([, v]) => v === 'dislike').map(([id]) => existingNames[id]).filter(Boolean).slice(0, 5);
  const res = await fetch('/api/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prefs, likedRecipes: likedNames, dislikedRecipes: dislikedNames,
      avoidNames: Object.values(existingNames),
      mealTime,
    }),
  });
  if (!res.ok) throw new Error(`Backend ${res.status}`);
  return await res.json();
}
