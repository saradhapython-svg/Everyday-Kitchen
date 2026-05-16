import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ThumbsDown, Clock, Calendar, ArrowLeft, Heart, ChevronRight, BarChart3, Utensils, Check, Copy, Sparkles, Loader2, Lock, Crown, Settings } from 'lucide-react';
import { useTier, TIERS } from './lib/tier.js';
import { useTheme } from './lib/theme.js';
import { storage } from './lib/storage.js';
import { SEED_RECIPES, scoreRecipe, fetchLLMRecipe } from './lib/recipes.js';
import { PremiumScreen } from './components/PremiumScreen.jsx';
import { OwnerUnlockFooter } from './components/OwnerUnlockFooter.jsx';
import { ThemeSwitcher } from './components/ThemeSwitcher.jsx';
import { PaywallModal } from './components/PaywallModal.jsx';
import { RecipeCard } from './components/RecipeCard.jsx';
import { RecipeDetail } from './components/RecipeDetail.jsx';
import { PreferenceForm } from './components/PreferenceForm.jsx';
import { SuggestionsView } from './components/SuggestionsView.jsx';
import { AnalyticsView } from './components/AnalyticsView.jsx';

function getGreeting(theme) {
  const h = new Date().getHours();
  if (theme.id === 'lux') {
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Hello';
  }
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Hello';
}

export default function App() {
  const tierApi = useTier();
  const { theme, themeId, setTheme, canSwitchTheme } = useTheme(tierApi.tier, tierApi.canUse);

  const [view, setView] = useState('loading');
  const [prefs, setPrefs] = useState(null);
  const [analytics, setAnalytics] = useState({});
  const [feedback, setFeedback] = useState({});
  const [excluded, setExcluded] = useState({});
  const [userRecipes, setUserRecipes] = useState([]);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [shoppingDay, setShoppingDay] = useState('saturday');
  const [toast, setToast] = useState(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [paywall, setPaywall] = useState(null); // { feature, onClose }
  const dwellStart = useRef(null);

  const allRecipes = useMemo(() => [...SEED_RECIPES, ...userRecipes], [userRecipes]);

  useEffect(() => {
    (async () => {
      const [p, a, f, s, ex, ur] = await Promise.all([
        storage.load('prefs', null),
        storage.load('analytics', {}),
        storage.load('feedback', {}),
        storage.load('shopping', 'saturday'),
        storage.load('excluded', {}),
        storage.load('userRecipes', []),
      ]);
      setAnalytics(a); setFeedback(f); setShoppingDay(s); setExcluded(ex); setUserRecipes(ur);
      setView(p ? 'suggestions' : 'form');
      if (p) setPrefs(p);
    })();
  }, []);

  useEffect(() => {
    const onPop = () => {
      if (view === 'detail') { setActiveRecipe(null); setView('suggestions'); }
      else if (view === 'analytics' || view === 'premium' || view === 'settings') setView('suggestions');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [view]);

  useEffect(() => {
    if (['detail', 'analytics', 'premium', 'settings'].includes(view)) {
      window.history.pushState({ view }, '');
    }
  }, [view]);

  // Dwell tracking
  useEffect(() => {
    if (view === 'detail' && activeRecipe) {
      dwellStart.current = Date.now();
      setAnalytics(prev => {
        const next = { ...prev };
        const cur = next[activeRecipe.id] || { likes: 0, dislikes: 0, visits: 0, dwellMs: 0 };
        next[activeRecipe.id] = { ...cur, visits: cur.visits + 1 };
        storage.save('analytics', next);
        return next;
      });
    }
    return () => {
      if (dwellStart.current && activeRecipe) {
        const elapsed = Date.now() - dwellStart.current;
        setAnalytics(prev => {
          const next = { ...prev };
          const cur = next[activeRecipe.id] || { likes: 0, dislikes: 0, visits: 0, dwellMs: 0 };
          next[activeRecipe.id] = { ...cur, dwellMs: cur.dwellMs + elapsed };
          storage.save('analytics', next);
          return next;
        });
        dwellStart.current = null;
      }
    };
  }, [view, activeRecipe]);

  const ranked = useMemo(() => {
    if (!prefs) return [];
    return [...allRecipes].map(r => ({ recipe: r, score: scoreRecipe(r, prefs, analytics) })).sort((a, b) => b.score - a.score);
  }, [prefs, analytics, allRecipes]);
  const top3 = ranked.slice(0, 3);

  const showToast = useCallback((msg, ms = 2200) => {
    setToast({ msg, id: Date.now() });
    setTimeout(() => setToast(null), ms);
  }, []);

  const handleSubmitPrefs = useCallback((newPrefs) => {
    setPrefs(newPrefs); storage.save('prefs', newPrefs); setView('suggestions');
    showToast("Here are tonight's picks.");
  }, [showToast]);

  const rateRecipe = useCallback((recipeId, kind) => {
    setFeedback(prev => { const next = { ...prev, [recipeId]: kind }; storage.save('feedback', next); return next; });
    setAnalytics(prev => {
      const next = { ...prev };
      const cur = next[recipeId] || { likes: 0, dislikes: 0, visits: 0, dwellMs: 0 };
      next[recipeId] = { ...cur, likes: kind === 'like' ? cur.likes + 1 : cur.likes, dislikes: kind === 'dislike' ? cur.dislikes + 1 : cur.dislikes };
      storage.save('analytics', next);
      return next;
    });
    showToast(kind === 'like' ? "Saved. We'll suggest more like this." : "Noted. We'll steer away.");
  }, [showToast]);

  const toggleExcluded = useCallback((ingredient) => {
    setExcluded(prev => {
      const next = { ...prev };
      if (next[ingredient]) delete next[ingredient]; else next[ingredient] = true;
      storage.save('excluded', next);
      return next;
    });
  }, []);
  const setManyExcluded = useCallback((ingredients, value) => {
    setExcluded(prev => {
      const next = { ...prev };
      ingredients.forEach(i => { if (value) next[i] = true; else delete next[i]; });
      storage.save('excluded', next);
      return next;
    });
  }, []);

  const askLLMForNew = useCallback(async () => {
    if (!prefs) return;
    // Gate: free users get a quota; owner bypasses all limits
    if (!tierApi.canCallLlm) {
      setPaywall({ feature: 'llm', message: `You've used your ${3} AI recipes this month. Premium unlocks unlimited.` });
      return;
    }
    setLlmLoading(true);
    showToast(theme.copy.askLLMCta + '...');
    try {
      const namesMap = Object.fromEntries(allRecipes.map(r => [r.id, r.name]));
      const recipe = await fetchLLMRecipe(prefs, feedback, namesMap);
      if (!recipe?.id || !recipe?.name || !Array.isArray(recipe?.ingredients)) throw new Error('Bad shape');
      recipe.source = 'llm';
      recipe.accent = recipe.accent || theme.colors.accent;
      const updated = [recipe, ...userRecipes].slice(0, 20);
      setUserRecipes(updated);
      storage.save('userRecipes', updated);
      await tierApi.recordLlmCall();
      showToast('New recipe added.');
    } catch (e) {
      console.error(e);
      showToast("Couldn't reach the chef. Try again later.");
    } finally {
      setLlmLoading(false);
    }
  }, [prefs, feedback, userRecipes, theme, tierApi, allRecipes, showToast]);

  const resetAll = useCallback(async () => {
    setPrefs(null); setAnalytics({}); setFeedback({}); setExcluded({}); setUserRecipes([]);
    // Keep tier and theme — those are account-level, not recipe data
    await Promise.all([
      storage.remove('prefs'), storage.remove('analytics'), storage.remove('feedback'),
      storage.remove('excluded'), storage.remove('userRecipes'),
    ]);
    setView('form');
  }, []);

  const shoppingList = useMemo(() => {
    const set = new Set();
    top3.forEach(({ recipe }) => recipe.ingredients.forEach(i => set.add(i)));
    return [...set].sort();
  }, [top3]);

  // Show paywall when free user tries a premium feature
  const requestUpgrade = useCallback((feature, message) => {
    setPaywall({ feature, message });
  }, []);

  if (view === 'loading') {
    return <LoadingScreen theme={theme} />;
  }

  const greeting = getGreeting(theme);

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.colors.pageBg,
      fontFamily: theme.fonts.sans,
      color: theme.colors.text,
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <ThemeStyleInjector theme={theme} />

      {toast && <Toast theme={theme} toast={toast} />}

      <div style={{ maxWidth: 1024, margin: '0 auto', padding: '24px 20px' }}>
        <Header
          theme={theme}
          greeting={greeting}
          tier={tierApi.tier}
          hasPrefs={!!prefs}
          onInsights={() => setView('analytics')}
          onSettings={() => setView('settings')}
          onUpgrade={() => setView('premium')}
        />

        {view === 'form' && (
          <PreferenceForm
            theme={theme}
            initial={prefs}
            canUseCookingTime={tierApi.canUse('cookingTimeMood')}
            onUpgradeRequest={() => requestUpgrade('cookingTimeMood', 'Cooking time matching is a Premium feature.')}
            onSubmit={handleSubmitPrefs}
          />
        )}

        {view === 'suggestions' && prefs && (
          <SuggestionsView
            theme={theme}
            tierApi={tierApi}
            top3={top3}
            prefs={prefs}
            feedback={feedback}
            analytics={analytics}
            shoppingList={shoppingList}
            shoppingDay={shoppingDay}
            excluded={excluded}
            onToggleExcluded={toggleExcluded}
            onSetManyExcluded={setManyExcluded}
            onChangeDay={(d) => { setShoppingDay(d); storage.save('shopping', d); }}
            onOpenRecipe={(r) => { setActiveRecipe(r); setView('detail'); }}
            onRate={rateRecipe}
            onEditPrefs={() => setView('form')}
            onReset={resetAll}
            onAskLLM={askLLMForNew}
            llmLoading={llmLoading}
            showToast={showToast}
          />
        )}

        {view === 'detail' && activeRecipe && (
          <RecipeDetail
            theme={theme}
            recipe={activeRecipe}
            feedback={feedback[activeRecipe.id]}
            analytics={analytics[activeRecipe.id]}
            excluded={excluded}
            onToggleExcluded={toggleExcluded}
            onBack={() => { setView('suggestions'); setActiveRecipe(null); }}
            onRate={(kind) => rateRecipe(activeRecipe.id, kind)}
            showToast={showToast}
          />
        )}

        {view === 'analytics' && (
          <AnalyticsView
            theme={theme}
            analytics={analytics}
            feedback={feedback}
            allRecipes={allRecipes}
            onBack={() => setView('suggestions')}
          />
        )}

        {view === 'premium' && (
          <PremiumScreen
            theme={theme}
            tier={tierApi.tier}
            onBack={() => setView('suggestions')}
            onUpgrade={async () => { await tierApi.promote(); setView('suggestions'); showToast('Welcome to Premium. The kitchen feels different now.'); }}
            onDowngrade={async () => { await tierApi.downgrade(); setView('suggestions'); showToast('You\'re back on the free tier.'); }}
          />
        )}

        {view === 'settings' && (
          <SettingsView
            theme={theme}
            themeId={themeId}
            setTheme={setTheme}
            canSwitchTheme={canSwitchTheme}
            tier={tierApi.tier}
            onBack={() => setView('suggestions')}
            onManagePremium={() => setView('premium')}
            onReset={resetAll}
          />
        )}

        <Footer theme={theme} tierApi={tierApi} showToast={showToast} />
      </div>

      {paywall && (
        <PaywallModal
          theme={theme}
          message={paywall.message}
          onClose={() => setPaywall(null)}
          onUpgrade={() => { setPaywall(null); setView('premium'); }}
        />
      )}
    </div>
  );
}

// ============================================================
//  Subcomponents kept inline because they're small and theme-aware
// ============================================================

function ThemeStyleInjector({ theme }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
      @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
      @keyframes toastIn { from { opacity:0; transform: translate(-50%, -10px); } to { opacity:1; transform: translate(-50%, 0); } }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .ek-fade-in { animation: fadeIn 0.4s ease-out backwards; }
      .ek-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
      .ek-card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 30px -10px ${theme.id === 'lux' ? 'rgba(26,20,16,0.25)' : 'rgba(60, 30, 10, 0.15)'}; }
      .ek-card-hover:active { transform: scale(0.99); }
      .ek-spin { animation: spin 1s linear infinite; }
      button { -webkit-tap-highlight-color: transparent; cursor: pointer; }
    `}</style>
  );
}

function LoadingScreen({ theme }) {
  return (
    <div style={{
      minHeight: '100vh', background: theme.colors.pageBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: theme.colors.textMuted, fontFamily: theme.fonts.sans,
    }}>Loading…</div>
  );
}

function Toast({ theme, toast }) {
  return (
    <div key={toast.id} style={{
      position: 'fixed', top: 16, left: '50%', zIndex: 50,
      transform: 'translateX(-50%)',
      padding: '10px 18px', borderRadius: theme.radius.md,
      background: theme.colors.inverted, color: theme.colors.invertedText,
      animation: 'toastIn 0.3s ease-out', maxWidth: '90vw',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
    }}>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{toast.msg}</span>
    </div>
  );
}

function Header({ theme, greeting, tier, hasPrefs, onInsights, onSettings, onUpgrade }) {
  const isLux = theme.id === 'lux';
  return (
    <header style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: 12, marginBottom: 32, paddingBottom: 20,
      borderBottom: `1px solid ${theme.colors.border}`,
    }} className="ek-fade-in">
      <div style={{ minWidth: 0, flex: 1 }}>
        {isLux ? (
          <>
            <div style={{ fontFamily: theme.fonts.serif, fontSize: 10, color: theme.colors.accent, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 6 }}>
              — {greeting} —
            </div>
            <div style={{ fontFamily: theme.fonts.serif, fontSize: 36, color: theme.colors.text, lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 400 }}>
              The Everyday <span style={{ fontStyle: 'italic', color: theme.colors.accent }}>Kitchen</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: theme.colors.textHint, marginBottom: 4, fontWeight: 500 }}>{greeting}</div>
            <h1 style={{ fontFamily: theme.fonts.serif, fontSize: 38, color: theme.colors.text, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 600, margin: 0 }}>
              The Everyday Kitchen
            </h1>
            <p style={{ fontSize: 14, color: theme.colors.textMuted, margin: '6px 0 0' }}>
              {theme.copy.tagline}
            </p>
          </>
        )}
      </div>
      {hasPrefs && (
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {tier === TIERS.FREE && (
            <button onClick={onUpgrade}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
                padding: '8px 14px', borderRadius: theme.radius.md,
                border: `1px solid ${theme.colors.accent}`,
                color: theme.colors.accent, background: theme.colors.surface,
              }}>
              <Crown size={13} /> Upgrade
            </button>
          )}
          <button onClick={onInsights}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
              padding: '8px 12px', borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.text, background: theme.colors.surface,
            }}>
            <BarChart3 size={13} />
          </button>
          <button onClick={onSettings}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
              padding: '8px 12px', borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.text, background: theme.colors.surface,
            }}>
            <Settings size={13} />
          </button>
        </div>
      )}
    </header>
  );
}

function Footer({ theme, tierApi, showToast }) {
  return (
    <footer style={{
      marginTop: 60, paddingTop: 24, borderTop: `1px solid ${theme.colors.border}`,
      textAlign: 'center', fontSize: 11, color: theme.colors.textHint,
    }}>
      Vegetarian · Adapts to your taste over time · <a href="/privacy" style={{ color: theme.colors.textHint, textDecoration: 'underline' }}>Privacy</a>
      {' · '}
      <OwnerUnlockFooter tierApi={tierApi} showToast={showToast} theme={theme} />
    </footer>
  );
}

function SettingsView({ theme, themeId, setTheme, canSwitchTheme, tier, onBack, onManagePremium, onReset }) {
  const isLux = theme.id === 'lux';
  return (
    <div className="ek-fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <button onClick={onBack} style={{
        marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 14, fontWeight: 500, color: theme.colors.textMuted, background: 'none', border: 'none',
      }}>
        <ArrowLeft size={14} /> Back
      </button>

      <h2 style={{ fontFamily: theme.fonts.serif, fontSize: isLux ? 30 : 28, fontWeight: isLux ? 400 : 600, color: theme.colors.text, marginBottom: 8 }}>
        Settings
      </h2>
      <p style={{ fontSize: 14, color: theme.colors.textMuted, marginBottom: 32 }}>
        Make the kitchen yours.
      </p>

      <SettingsSection theme={theme} title="Theme">
        <ThemeSwitcher theme={theme} themeId={themeId} setTheme={setTheme} canSwitchTheme={canSwitchTheme} />
      </SettingsSection>

      <SettingsSection theme={theme} title="Subscription">
        <div style={{
          padding: 20, background: theme.colors.surface, borderRadius: theme.radius.lg,
          border: `1px solid ${theme.colors.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, color: theme.colors.textHint, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 4 }}>
                Current plan
              </div>
              <div style={{ fontFamily: theme.fonts.serif, fontSize: 22, color: theme.colors.text, fontWeight: 500 }}>
                {tier === TIERS.OWNER ? 'Owner' : tier === TIERS.PREMIUM ? 'Premium' : 'Free'}
              </div>
            </div>
            <button onClick={onManagePremium}
              style={{
                padding: '10px 18px', borderRadius: theme.radius.md, fontSize: 13, fontWeight: 600,
                background: theme.colors.text, color: theme.colors.invertedText, border: 'none',
              }}>
              {tier === TIERS.FREE ? 'View Premium' : 'Manage'}
            </button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection theme={theme} title="Reset">
        <button onClick={() => { if (confirm('Clear all preferences, likes, and history?')) onReset(); }}
          style={{
            padding: '10px 18px', borderRadius: theme.radius.md, fontSize: 13, fontWeight: 500,
            background: theme.colors.surface, color: theme.colors.danger,
            border: `1px solid ${theme.colors.border}`,
          }}>
          Clear all preferences and history
        </button>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ theme, title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{
        fontSize: 12, color: theme.colors.textHint, textTransform: 'uppercase',
        letterSpacing: '0.1em', fontWeight: 600, marginBottom: 12,
      }}>{title}</h3>
      {children}
    </div>
  );
}
