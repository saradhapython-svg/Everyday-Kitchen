# Everyday Kitchen — v2 with Tiers

This is the upgraded version of the recipe app with three user tiers, two themes, and a soft paywall system.

## What changed from v1

| Area | v1 | v2 |
|---|---|---|
| Architecture | One 800-line file | Modular: lib, components, themes |
| Users | One kind | Free / Premium / Owner |
| Look | Warm only | Warm or Atelier (luxurious) |
| Payment | None | Mocked Stripe (instant unlock for now) |
| Owner mode | None | Hidden via triple-tap footer dot |

## How the three tiers work

### Free
- Warm theme (locked — can't switch to Atelier)
- 3 LLM-generated recipes per month
- Sees a "Premium" feature badge next to cooking-time question
- Hits paywall modal when trying to use Premium features

### Premium (mocked)
- Atelier theme by default — can switch back to warm in settings
- Unlimited LLM recipes
- Cooking-time mood matching
- All future advanced features (weather, meal planning, etc.) unlock here
- "Cancel subscription" in settings reverts to free

### Owner (you)
- Everything Premium gets
- No paywall ever appears
- Footer shows a small "owner ●" badge instead of the trigger dot

## How to test each tier

**Test the free experience:**
1. Open the app — you're free by default
2. Try clicking "Suggest new" 4 times → 4th attempt shows the paywall modal
3. Try the "Cooking time" question in the form → shows premium badge, hitting it triggers paywall

**Test the premium experience:**
1. Click "Upgrade" in header
2. Click "Begin your subscription" on the Premium screen
3. App reloads with Atelier theme, premium features unlocked
4. Go to Settings → switch back to warm theme if you want
5. Settings → Manage → Cancel subscription to return to free

**Unlock owner mode:**
1. Scroll to the footer
2. Find the small `·` dot between "Privacy" and the next text
3. **Triple-click it within 1 second**
4. A password prompt appears
5. Enter the password: **`kitchen-2026`**
6. You're now in owner mode — footer shows "owner ●"

## How to change the owner password

Open `src/lib/tier.js` and change line 17:
```js
const OWNER_PASSWORD = 'kitchen-2026';  // change me
```

**Important:** This password lives in your bundled JavaScript. Anyone who downloads your site can see it by viewing the source. For real security you'd need server-side authentication. For "keep features hidden from casual users while letting yourself in" — this is fine.

To rotate the password later: change it, redeploy, and your old browser sessions stay authenticated until they hit reset. Anyone who learned the old password is locked out.

## File layout

```
recipe-web-v2/
├── src/
│   ├── App.jsx                    Main orchestrator. Wires tier + theme + screens.
│   ├── main.jsx                   React entry.
│   ├── index.css                  Tailwind base.
│   ├── themes/
│   │   └── tokens.js              All design tokens. Warm + Atelier.
│   ├── lib/
│   │   ├── storage.js             localStorage wrapper, namespaced.
│   │   ├── tier.js                useTier hook. Free/Premium/Owner gating + LLM quota.
│   │   ├── theme.js               useTheme hook. Picks warm/lux based on tier.
│   │   └── recipes.js             Seed data, scoring engine, LLM client.
│   └── components/
│       ├── PreferenceForm.jsx     The 4-question intake (premium question is locked for free).
│       ├── SuggestionsView.jsx    Top 3 cards + shopping list.
│       ├── RecipeCard.jsx         Theme-aware card.
│       ├── RecipeDetail.jsx       Full recipe view.
│       ├── AnalyticsView.jsx      "The ledger" — learning stats.
│       ├── PremiumScreen.jsx      Always-luxurious upgrade page.
│       ├── PaywallModal.jsx       Soft paywall when free user hits a gate.
│       ├── ThemeSwitcher.jsx      In Settings, for paid users.
│       └── OwnerUnlockFooter.jsx  The hidden dot.
├── api/
│   └── suggest.js                 Vercel serverless function for LLM recipe gen.
└── public/
    ├── manifest.webmanifest       PWA manifest.
    ├── privacy.html               Required for production.
    └── robots.txt
```

## Going from mock to real subscriptions later

When you have real paying customers and want Stripe to handle billing automatically:

1. Replace the body of `tierApi.promote()` in `src/lib/tier.js` with a call to a `/api/checkout` endpoint that creates a Stripe Checkout session
2. Add a `/api/webhook` endpoint that listens for Stripe `customer.subscription.created` and `customer.subscription.deleted` events
3. Add a database (Vercel Postgres or Supabase) to persist `customer_id → tier` mappings
4. Add minimal auth (Magic Link email or Google sign-in) so users keep their subscription across devices
5. The UI doesn't change — `tierApi` is the only thing that needs new logic

That's the entire migration path. The component layer is fully isolated from how unlock decisions get made.

## Adding the weather/seasonal feature later

The architecture supports it cleanly:

1. Add `weatherSeasonal: ['premium', 'owner']` to `FEATURE_GATING` in `tier.js`
2. Create `src/lib/weather.js` with a hook that calls a free weather API (Open-Meteo, no key needed)
3. In `recipes.js`, add a `season` field to each recipe and a bonus to `scoreRecipe` when current weather/season matches
4. Add a small "It's a cold day — soups boosted" indicator above the recipe grid for premium users
5. Free users see no indicator, no bonus applied

You can build this in an afternoon.

## Deployment

Same as v1 — push to GitHub, connect to Vercel, set `ANTHROPIC_API_KEY` env var, redeploy. See `DEPLOY.md` from the previous version for the full walkthrough.

The first deploy with the new structure will look identical to free users. Premium users will only exist when they click Upgrade or you unlock owner mode for yourself.
