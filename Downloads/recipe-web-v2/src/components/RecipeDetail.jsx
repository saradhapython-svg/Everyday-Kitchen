import React, { useState } from 'react';
import { ArrowLeft, Heart, ThumbsDown, Share2, Utensils, Check, Lock, ChefHat, Lightbulb } from 'lucide-react';
import { CookingMode } from './CookingMode.jsx';
import { findSubstitutions, SWAP_LABELS } from '../lib/substitutions.js';

export function RecipeDetail({
  theme, recipe, feedback, analytics, excluded, onToggleExcluded, onBack, onRate,
  showToast, canCookingMode, onUpgradeRequest, prefs,
}) {
  const isLux = theme.id === 'lux';
  const [cookingModeOpen, setCookingModeOpen] = useState(false);
  const needCount = recipe.ingredients.filter(i => !excluded[i]).length;

  async function shareRecipe() {
    const text = `${recipe.name}\n\n${recipe.benefit}\n\nIngredients:\n${recipe.ingredients.map(i => `• ${i}`).join('\n')}\n\nSteps:\n${recipe.simpleSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    if (navigator.share) {
      try { await navigator.share({ title: recipe.name, text }); } catch {}
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast && showToast('Recipe copied.');
    }
  }

  function startCookingMode() {
    if (!canCookingMode) {
      onUpgradeRequest && onUpgradeRequest();
      return;
    }
    setCookingModeOpen(true);
  }

  if (cookingModeOpen) {
    return <CookingMode theme={theme} recipe={recipe} onExit={() => setCookingModeOpen(false)} />;
  }

  return (
    <div className="ek-fade-in" style={{ maxWidth: 780, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 13, fontWeight: 500, color: theme.colors.textMuted,
          background: 'none', border: 'none',
        }}>
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={shareRecipe} style={{
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500,
          padding: '6px 14px', borderRadius: theme.radius.md,
          border: `1px solid ${theme.colors.border}`,
          color: theme.colors.text, background: theme.colors.surface,
        }}>
          <Share2 size={13} /> Share
        </button>
      </div>

      <article style={{
        background: theme.colors.surface, borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border}`, overflow: 'hidden',
      }}>
        {/* Hero band */}
        <header style={{
          padding: 32, background: isLux ? theme.colors.inverted : theme.colors.surfaceMuted,
          color: isLux ? theme.colors.invertedText : theme.colors.text,
          borderBottom: `1px solid ${theme.colors.borderSoft}`,
          textAlign: isLux ? 'center' : 'left',
        }}>
          {isLux ? (
            <>
              <div style={{
                fontFamily: theme.fonts.serif, fontSize: 10, color: theme.colors.accent,
                letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 12,
              }}>— {recipe.time} · {theme.copy.tasteLabels[recipe.taste]} —</div>
              <h2 style={{
                fontFamily: theme.fonts.serif, fontSize: 36, fontWeight: 400,
                lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 12px',
              }}>{recipe.name}</h2>
              <div style={{ width: 40, height: 1, background: theme.colors.accent, margin: '12px auto' }} />
              <p style={{
                fontFamily: theme.fonts.serif, fontSize: 15, fontStyle: 'italic',
                color: '#C9B79C', margin: 0, lineHeight: 1.5, maxWidth: 480,
                marginLeft: 'auto', marginRight: 'auto',
              }}>{recipe.benefit}</p>
            </>
          ) : (
            <>
              <div style={{
                fontFamily: 'monospace', fontSize: 11, fontWeight: 600,
                color: recipe.accent, letterSpacing: '0.05em', marginBottom: 8,
              }}>VEGETARIAN · {recipe.time.toUpperCase()} · {recipe.taste.toUpperCase()}</div>
              <h2 style={{
                fontFamily: theme.fonts.serif, fontSize: 32, fontWeight: 600,
                lineHeight: 1.1, margin: '0 0 12px',
              }}>{recipe.name}</h2>
              <p style={{
                fontSize: 15, fontStyle: 'italic', color: theme.colors.textMuted,
                margin: 0, lineHeight: 1.5,
              }}>{recipe.benefit}</p>
            </>
          )}
        </header>

        {/* Macros */}
        <div style={{
          padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 24, borderBottom: `1px solid ${theme.colors.borderSoft}`,
          textAlign: isLux ? 'center' : 'left',
        }}>
          {[['Protein', recipe.macros.protein], ['Fats', recipe.macros.fat], ['Carbs', recipe.macros.carb]].map(([label, value]) => (
            <div key={label}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: theme.colors.textHint,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
              }}>{label}</div>
              <div style={{
                fontFamily: theme.fonts.serif, fontSize: isLux ? 22 : 20,
                fontWeight: isLux ? 400 : 600, color: theme.colors.text,
                fontStyle: isLux ? 'italic' : 'normal',
              }}>{theme.copy.macroLabels[value]}</div>
            </div>
          ))}
        </div>

        {/* Ingredients */}
        <div style={{ padding: 28, borderBottom: `1px solid ${theme.colors.borderSoft}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Utensils size={14} style={{ color: theme.colors.textHint }} />
              <h3 style={{
                fontSize: 11, fontWeight: 600, color: theme.colors.textHint,
                textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0,
              }}>{theme.copy.ingredientsLabel}</h3>
            </div>
            <span style={{ fontSize: 12, color: theme.colors.textMuted }}>
              <span style={{ color: theme.colors.accent, fontWeight: 600 }}>{needCount}</span>/{recipe.ingredients.length} needed
            </span>
          </div>
          <div style={{ fontSize: 12, color: theme.colors.textMuted, marginBottom: 12 }}>
            {theme.copy.groceryHint}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recipe.ingredients.map((i, idx) => {
              const skip = !!excluded[i];
              const swaps = prefs ? findSubstitutions(i, prefs) : [];
              return (
                <li key={idx}>
                  <button onClick={() => onToggleExcluded(i)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 4px', textAlign: 'left',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                  }}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: 10, color: theme.colors.textHint, width: 24,
                    }}>{String(idx + 1).padStart(2, '0')}</span>
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 16, height: 16, borderRadius: theme.radius.sm, flexShrink: 0,
                      background: skip ? 'transparent' : theme.colors.accent,
                      border: `1px solid ${skip ? theme.colors.border : theme.colors.accent}`,
                    }}>
                      {!skip && <Check size={11} strokeWidth={3} style={{ color: 'white' }} />}
                    </span>
                    <span style={{
                      fontSize: 14, flex: 1,
                      fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
                      color: skip ? theme.colors.textHint : theme.colors.text,
                      textDecoration: skip ? 'line-through' : 'none',
                    }}>{i}</span>
                    {skip && <span style={{
                      fontSize: 11, fontStyle: 'italic', color: theme.colors.textHint,
                    }}>at home</span>}
                  </button>
                  {/* Inline swap hints when prefs would benefit */}
                  {!skip && swaps.length > 0 && swaps.map((s, si) => (
                    <div key={si} style={{
                      marginLeft: 52, marginRight: 4, marginBottom: 4,
                      padding: '8px 12px', borderLeft: `2px solid ${theme.colors.accent}`,
                      background: theme.colors.accentSoft,
                      borderRadius: `0 ${theme.radius.sm}px ${theme.radius.sm}px 0`,
                      fontSize: 12, lineHeight: 1.5,
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontWeight: 600, color: theme.colors.accent, marginBottom: 2,
                        fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        <Lightbulb size={11} /> {SWAP_LABELS[s.target]}
                      </div>
                      <div style={{ color: theme.colors.text }}>
                        <strong>{s.sub.swap}</strong> — {s.sub.ratio}
                      </div>
                      {s.sub.notes && (
                        <div style={{ color: theme.colors.textMuted, marginTop: 2, fontStyle: 'italic' }}>
                          {s.sub.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </li>
              );
            })}
          </ul>
        </div>

        {/* COOKING STEPS — the new section */}
        <div style={{ padding: 28, borderBottom: `1px solid ${theme.colors.borderSoft}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ChefHat size={14} style={{ color: theme.colors.textHint }} />
              <h3 style={{
                fontSize: 11, fontWeight: 600, color: theme.colors.textHint,
                textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0,
              }}>{theme.copy.stepsLabel}</h3>
            </div>
            <button onClick={startCookingMode} style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
              padding: '8px 14px', borderRadius: theme.radius.md,
              fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
              fontStyle: isLux ? 'italic' : 'normal',
              background: canCookingMode ? theme.colors.accent : theme.colors.surface,
              color: canCookingMode ? 'white' : theme.colors.textHint,
              border: `1px solid ${canCookingMode ? theme.colors.accent : theme.colors.border}`,
            }}>
              <ChefHat size={12} /> {theme.copy.cookingModeCta}
              {!canCookingMode && <Lock size={11} />}
            </button>
          </div>
          {recipe.simpleSteps && recipe.simpleSteps.length > 0 ? (
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recipe.simpleSteps.map((step, idx) => (
                <li key={idx} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                    background: theme.colors.accentSoft, color: theme.colors.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                    fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
                  }}>
                    {isLux ? ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][idx] || (idx + 1) : (idx + 1)}
                  </span>
                  <p style={{
                    margin: 0, paddingTop: 2,
                    fontSize: 14, lineHeight: 1.6,
                    fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
                    color: theme.colors.text,
                  }}>{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div style={{
              padding: 20, textAlign: 'center', fontSize: 13,
              fontStyle: 'italic', color: theme.colors.textMuted,
              background: theme.colors.surfaceMuted, borderRadius: theme.radius.md,
            }}>
              Steps not available for this recipe yet.
            </div>
          )}
          {!canCookingMode && (
            <div style={{
              marginTop: 16, padding: 12,
              background: theme.colors.accentSoft, borderRadius: theme.radius.md,
              fontSize: 12, color: theme.colors.text,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <ChefHat size={14} style={{ color: theme.colors.accent }} />
              <span>
                <b>Cooking mode</b> walks you through each step with built-in timers, voice prompts, and keeps your screen awake. {' '}
                <button onClick={onUpgradeRequest} style={{
                  background: 'none', border: 'none', color: theme.colors.accent,
                  textDecoration: 'underline', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 12,
                }}>See Premium</button>
              </span>
            </div>
          )}
        </div>

        {/* Rate */}
        <div style={{
          padding: 28, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: theme.colors.textHint,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
            }}>Tried it?</div>
            <div style={{ fontSize: 12, color: theme.colors.textMuted }}>
              Your feedback shapes future suggestions.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onRate('like')} style={{
              padding: '10px 16px', borderRadius: theme.radius.md,
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
              background: feedback === 'like' ? theme.colors.accent : theme.colors.surface,
              color: feedback === 'like' ? 'white' : theme.colors.text,
              border: `1px solid ${feedback === 'like' ? theme.colors.accent : theme.colors.border}`,
            }}>
              <Heart size={14} fill={feedback === 'like' ? 'white' : 'none'} /> Loved
            </button>
            <button onClick={() => onRate('dislike')} style={{
              padding: '10px 16px', borderRadius: theme.radius.md,
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
              background: feedback === 'dislike' ? theme.colors.danger : theme.colors.surface,
              color: feedback === 'dislike' ? 'white' : theme.colors.text,
              border: `1px solid ${feedback === 'dislike' ? theme.colors.danger : theme.colors.border}`,
            }}>
              <ThumbsDown size={14} /> Skip
            </button>
          </div>
        </div>

        {/* Honest disclosure for generated recipes — subtle, but present */}
        {recipe.source === 'llm' && (
          <div style={{
            padding: '12px 28px', background: theme.colors.surfaceMuted,
            borderTop: `1px solid ${theme.colors.borderSoft}`,
            fontSize: 11, color: theme.colors.textHint,
            fontStyle: 'italic', textAlign: 'center',
          }}>
            This recipe was composed for you with the help of an assistant — please review the ingredients before cooking.
          </div>
        )}
      </article>
    </div>
  );
}
