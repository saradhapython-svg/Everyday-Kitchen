import React from 'react';
import { ArrowLeft, Heart, ThumbsDown } from 'lucide-react';

export function AnalyticsView({ theme, analytics, feedback, allRecipes, onBack }) {
  const isLux = theme.id === 'lux';
  const rows = Object.entries(analytics)
    .map(([id, stats]) => { const r = allRecipes.find(x => x.id === id); return r ? { recipe: r, stats, fb: feedback[id] } : null; })
    .filter(Boolean)
    .sort((a, b) => (b.stats.visits + b.stats.likes * 3) - (a.stats.visits + a.stats.likes * 3));
  const totalCooked = rows.reduce((s, r) => s + r.stats.visits, 0);
  const totalLoved = rows.reduce((s, r) => s + r.stats.likes, 0);

  return (
    <div className="ek-fade-in">
      <button onClick={onBack} style={{
        marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 13, fontWeight: 500, color: theme.colors.textMuted, background: 'none', border: 'none',
      }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontFamily: theme.fonts.serif, fontSize: isLux ? 28 : 26,
          fontWeight: isLux ? 400 : 600, color: theme.colors.text, margin: '0 0 6px',
        }}>{theme.copy.ledgerHeading}</h2>
        <p style={{
          fontSize: 14, color: theme.colors.textMuted, margin: 0,
          fontStyle: isLux ? 'italic' : 'normal',
          fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
        }}>Every tap shapes tomorrow's suggestions.</p>
      </div>

      {rows.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <StatBlock theme={theme} label="Opened" value={totalCooked} />
          <StatBlock theme={theme} label="Loved" value={totalLoved} accent />
        </div>
      )}

      {rows.length === 0 ? (
        <div style={{
          padding: 40, textAlign: 'center',
          background: theme.colors.surface, borderRadius: theme.radius.lg,
          border: `1px solid ${theme.colors.border}`,
        }}>
          <div style={{
            fontFamily: theme.fonts.serif, fontSize: 16, fontStyle: 'italic',
            color: theme.colors.textMuted,
          }}>Nothing recorded yet.</div>
          <div style={{ fontSize: 13, color: theme.colors.textHint, marginTop: 6 }}>
            Open a recipe to begin.
          </div>
        </div>
      ) : (
        <div style={{
          background: theme.colors.surface, borderRadius: theme.radius.lg,
          border: `1px solid ${theme.colors.border}`, overflow: 'hidden',
        }}>
          {rows.map(({ recipe, stats, fb }, idx) => {
            const signal = stats.likes * 3 + stats.visits - stats.dislikes * 5;
            return (
              <div key={recipe.id} style={{
                padding: '14px 18px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 12, fontSize: 14,
                borderBottom: idx < rows.length - 1 ? `1px solid ${theme.colors.borderSoft}` : 'none',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
                    fontWeight: 500, color: theme.colors.text,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{recipe.name}</div>
                  <div style={{
                    fontSize: 11, marginTop: 2, color: theme.colors.textHint,
                    display: 'flex', gap: 8, alignItems: 'center',
                  }}>
                    <span>{stats.visits} opens</span>
                    <span>· {Math.round(stats.dwellMs / 1000)}s</span>
                    {fb === 'like' && <Heart size={11} fill={theme.colors.accent} style={{ color: theme.colors.accent }} />}
                    {fb === 'dislike' && <ThumbsDown size={11} style={{ color: theme.colors.textMuted }} />}
                  </div>
                </div>
                <div style={{
                  fontFamily: theme.fonts.serif, fontSize: 18, fontWeight: 500,
                  color: signal > 0 ? '#15803D' : signal < 0 ? '#B91C1C' : theme.colors.textMuted,
                }}>
                  {signal > 0 ? '+' : ''}{signal}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        marginTop: 24, background: theme.colors.surface,
        borderRadius: theme.radius.lg, padding: 20,
        borderLeft: `4px solid ${theme.colors.accent}`,
        border: `1px solid ${theme.colors.border}`,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: theme.colors.textHint,
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
        }}>How it adapts</div>
        <p style={{
          fontSize: 13, lineHeight: 1.6, color: theme.colors.text, margin: 0,
          fontStyle: isLux ? 'italic' : 'normal',
          fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
        }}>
          A like adds +2, a dislike subtracts -3, each revisit adds +0.5 (capped), each minute of attention adds +0.4.
          Patterns of return quietly promote new favorites.
        </p>
      </div>
    </div>
  );
}

function StatBlock({ theme, label, value, accent }) {
  return (
    <div style={{
      padding: 18, background: theme.colors.surface, borderRadius: theme.radius.lg,
      border: `1px solid ${theme.colors.border}`,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: theme.colors.textHint,
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontFamily: theme.fonts.serif, fontSize: 26, fontWeight: 500,
        color: accent ? theme.colors.accent : theme.colors.text,
      }}>{value}</div>
    </div>
  );
}
