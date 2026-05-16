import React from 'react';
import { Calendar, Sparkles, Loader2, Copy, Share2, Check } from 'lucide-react';
import { RecipeCard } from './RecipeCard.jsx';

export function SuggestionsView({
  theme, tierApi, top3, prefs, feedback, analytics,
  shoppingList, shoppingDay, excluded, onToggleExcluded, onSetManyExcluded,
  onChangeDay, onOpenRecipe, onRate, onEditPrefs, onReset,
  onAskLLM, llmLoading, showToast,
}) {
  const isLux = theme.id === 'lux';
  const needed = shoppingList.filter(i => !excluded[i]);

  async function shareList() {
    const text = `Shopping list:\n${needed.map(i => `• ${i}`).join('\n')}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Shopping list', text }); } catch {}
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text); showToast('Shopping list copied.');
    }
  }

  return (
    <div className="ek-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Profile pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontSize: 13 }}>
        <span style={{ color: theme.colors.textMuted }}>Tonight's profile:</span>
        <Chip theme={theme}>{theme.copy.macroLabels[prefs.protein]} protein</Chip>
        <Chip theme={theme}>{theme.copy.macroLabels[prefs.fat]} fat</Chip>
        <Chip theme={theme}>{theme.copy.macroLabels[prefs.carb]} carbs</Chip>
        <Chip theme={theme}>{theme.copy.tasteLabels[prefs.taste]}</Chip>
        <Chip theme={theme}>{prefs.audience.map(a => theme.copy.audienceLabels[a]).join(', ')}</Chip>
        {prefs.cookingTime && <Chip theme={theme}>{prefs.cookingTime}</Chip>}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 14 }}>
          <button onClick={onEditPrefs} style={{
            background: 'none', border: 'none', color: theme.colors.textMuted,
            fontSize: 12, textDecoration: 'underline',
          }}>Edit</button>
        </div>
      </div>

      {/* Recipe grid */}
      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
          <h2 style={{
            fontFamily: theme.fonts.serif, fontSize: isLux ? 26 : 24,
            fontWeight: isLux ? 400 : 600, color: theme.colors.text, margin: 0,
            letterSpacing: isLux ? '-0.01em' : 'normal',
          }}>
            {isLux ? <>Tonight's <span style={{ fontStyle: 'italic', color: theme.colors.accent }}>selection</span></> : theme.copy.tonightTitle}
          </h2>
          <button onClick={onAskLLM} disabled={llmLoading} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 500,
            fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
            fontStyle: isLux ? 'italic' : 'normal',
            padding: '8px 14px', borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`,
            color: llmLoading ? theme.colors.textHint : theme.colors.accent,
            background: theme.colors.surface,
            cursor: llmLoading ? 'wait' : 'pointer',
          }}>
            {llmLoading ? <Loader2 size={13} className="ek-spin" /> : <Sparkles size={13} />}
            {llmLoading ? 'Asking…' : theme.copy.askLLMCta}
            {tierApi.isFree && !llmLoading && tierApi.remainingLlmCalls < 3 && (
              <span style={{ fontSize: 10, color: theme.colors.textHint, marginLeft: 4 }}>
                ({tierApi.remainingLlmCalls} left)
              </span>
            )}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {top3.map(({ recipe, score }, idx) => (
            <RecipeCard key={recipe.id} theme={theme} recipe={recipe} rank={idx + 1} score={score}
              feedback={feedback[recipe.id]} stats={analytics[recipe.id]}
              onOpen={() => onOpenRecipe(recipe)}
              onRate={kind => onRate(recipe.id, kind)} delay={idx * 80} />
          ))}
        </div>
      </section>

      {/* Shopping reminder */}
      <section style={{
        background: theme.colors.surface, borderRadius: theme.radius.lg,
        padding: 24, border: `1px solid ${theme.colors.border}`,
      }}>
        {isLux && (
          <div style={{ textAlign: 'center', paddingBottom: 16, borderBottom: `1px solid ${theme.colors.borderSoft}`, marginBottom: 20 }}>
            <div style={{
              fontFamily: theme.fonts.serif, fontSize: 10, color: theme.colors.accent,
              letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 6,
            }}>— {theme.copy.shoppingTitle} —</div>
            <div style={{
              fontFamily: theme.fonts.serif, fontSize: 22, color: theme.colors.text, fontWeight: 400,
            }}>
              For <span style={{ fontStyle: 'italic', color: theme.colors.accent, textTransform: 'capitalize' }}>{shoppingDay}'s</span> market
            </div>
          </div>
        )}
        {!isLux && (
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: theme.colors.textHint,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
            }}>Shopping reminder</div>
            <div style={{
              fontFamily: theme.fonts.serif, fontSize: 17, fontWeight: 600, color: theme.colors.text,
            }}>
              You shop on <span style={{ color: theme.colors.accent, textTransform: 'capitalize' }}>{shoppingDay}</span>.
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: isLux ? 'center' : 'flex-start' }}>
          {['friday', 'saturday', 'sunday'].map(d => (
            <button key={d} onClick={() => onChangeDay(d)} style={{
              padding: '6px 18px', borderRadius: theme.radius.md,
              fontSize: 12, fontWeight: 500,
              fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
              fontStyle: isLux ? 'italic' : 'normal',
              textTransform: 'capitalize',
              background: shoppingDay === d ? theme.colors.inverted : theme.colors.surface,
              color: shoppingDay === d ? theme.colors.invertedText : theme.colors.text,
              border: `1px solid ${shoppingDay === d ? theme.colors.inverted : theme.colors.border}`,
            }}>{d}</button>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          paddingBottom: 10, borderBottom: `1px solid ${theme.colors.borderSoft}`, marginBottom: 12,
        }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: theme.colors.textHint,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>{theme.copy.groceryHeading}</div>
            <div style={{ fontSize: 11, color: theme.colors.textMuted, marginTop: 2 }}>
              {theme.copy.groceryHint}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, flexWrap: 'wrap' }}>
            <span style={{ color: theme.colors.text, fontWeight: 500 }}>
              <span style={{ color: theme.colors.accent }}>{needed.length}</span>/{shoppingList.length}
            </span>
            <button onClick={() => onSetManyExcluded(shoppingList, false)} style={btnLink(theme)}>All</button>
            <button onClick={() => onSetManyExcluded(shoppingList, true)} style={btnLink(theme)}>None</button>
            <button onClick={shareList} disabled={needed.length === 0} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
              background: theme.colors.surface, fontSize: 12,
              color: needed.length === 0 ? theme.colors.textHint : theme.colors.text,
              cursor: needed.length === 0 ? 'not-allowed' : 'pointer',
            }}>
              {navigator.share ? <Share2 size={11} /> : <Copy size={11} />}
              {navigator.share ? 'Share' : 'Copy'}
            </button>
          </div>
        </div>

        <ul style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 2, listStyle: 'none', padding: 0, margin: 0,
        }}>
          {shoppingList.map(item => {
            const skip = !!excluded[item];
            return (
              <li key={item}>
                <button onClick={() => onToggleExcluded(item)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 4px', textAlign: 'left',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 16, height: 16, borderRadius: theme.radius.sm, flexShrink: 0,
                    background: skip ? 'transparent' : theme.colors.accent,
                    border: `1px solid ${skip ? theme.colors.border : theme.colors.accent}`,
                  }}>
                    {!skip && <Check size={11} strokeWidth={3} style={{ color: 'white' }} />}
                  </span>
                  <span style={{
                    fontSize: 13,
                    fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
                    color: skip ? theme.colors.textHint : theme.colors.text,
                    textDecoration: skip ? 'line-through' : 'none',
                    fontStyle: skip && isLux ? 'italic' : 'normal',
                  }}>{item}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Chip({ theme, children }) {
  return (
    <span style={{
      padding: '4px 10px', borderRadius: theme.radius.md,
      fontSize: 11, fontWeight: 500,
      color: theme.colors.text, background: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      textTransform: 'capitalize',
    }}>{children}</span>
  );
}

function btnLink(theme) {
  return {
    background: 'none', border: 'none', color: theme.colors.textMuted,
    fontSize: 12, textDecoration: 'underline', cursor: 'pointer', padding: 0,
  };
}
