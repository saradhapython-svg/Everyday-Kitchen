import React from 'react';
import { Heart, ThumbsDown, Clock, ChevronRight } from 'lucide-react';

const ROMAN = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.'];

export function RecipeCard({ theme, recipe, rank, score, feedback, stats, onOpen, onRate, delay }) {
  const isLux = theme.id === 'lux';
  const liked = feedback === 'like';
  const disliked = feedback === 'dislike';
  const isFresh = recipe.source === 'llm';

  return (
    <article className="ek-card-hover ek-fade-in" style={{
      borderRadius: theme.radius.lg, overflow: 'hidden', cursor: 'pointer',
      background: theme.colors.surface, border: `1px solid ${theme.colors.border}`,
      display: 'flex', flexDirection: 'column',
      animationDelay: `${delay}ms`,
    }}>
      {isLux ? (
        <div style={{ height: 80, background: recipe.accent, position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 10, left: 14,
            fontFamily: theme.fonts.serif, fontSize: 12, color: 'rgba(245,241,234,0.95)',
            letterSpacing: '0.25em',
          }}>{ROMAN[rank - 1]}</div>
          {isFresh && (
            <div style={{
              position: 'absolute', top: 10, right: 12,
              padding: '2px 8px', background: 'rgba(0,0,0,0.25)', borderRadius: 2,
              fontFamily: theme.fonts.serif, fontSize: 9, color: '#F5F1EA',
              letterSpacing: '0.2em', textTransform: 'uppercase', fontStyle: 'italic',
            }}>{theme.copy.newBadge}</div>
          )}
          <div style={{
            position: 'absolute', bottom: 10, right: 14,
            fontFamily: theme.fonts.serif, fontSize: 9, color: 'rgba(245,241,234,0.7)',
            letterSpacing: '0.2em', textTransform: 'uppercase', fontStyle: 'italic',
          }}>{['First', 'Second', 'Third'][rank - 1] || `${rank}th`}</div>
        </div>
      ) : (
        <div style={{
          padding: '16px 20px 12px', background: theme.colors.surfaceMuted,
          borderBottom: `1px solid ${theme.colors.borderSoft}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{
              fontFamily: 'monospace', fontSize: 11, fontWeight: 600,
              color: recipe.accent, letterSpacing: '0.05em',
            }}>
              № {String(rank).padStart(2, '0')}
              {isFresh && <span style={{ color: theme.colors.textHint }}> · {theme.copy.newBadge}</span>}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, color: theme.colors.textHint }}>{score.toFixed(1)} fit</span>
          </div>
          <h3 style={{
            fontFamily: theme.fonts.serif, fontSize: 18, fontWeight: 600,
            lineHeight: 1.2, color: theme.colors.text, margin: 0,
          }} onClick={onOpen}>
            {recipe.name}
          </h3>
        </div>
      )}

      <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }} onClick={onOpen}>
        {isLux && (
          <>
            <div style={{
              fontFamily: theme.fonts.serif, fontSize: 9,
              color: recipe.accent, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 6,
            }}>{recipe.time}</div>
            <h3 style={{
              fontFamily: theme.fonts.serif, fontSize: 18, fontWeight: 500,
              lineHeight: 1.15, color: theme.colors.text, margin: '0 0 10px',
            }}>{recipe.name}</h3>
          </>
        )}
        <p style={{
          fontSize: isLux ? 12 : 13,
          fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
          fontStyle: isLux ? 'italic' : 'normal',
          lineHeight: 1.5, color: theme.colors.textMuted, margin: '0 0 14px', flex: 1,
        }}>{recipe.benefit}</p>
        {!isLux && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: theme.colors.textMuted }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{recipe.time}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: theme.colors.border }} />
            <span style={{ textTransform: 'capitalize' }}>{theme.copy.tasteLabels[recipe.taste]?.toLowerCase()}</span>
          </div>
        )}
      </div>

      <div style={{
        padding: '12px 20px', borderTop: `1px solid ${theme.colors.borderSoft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={(e) => { e.stopPropagation(); onRate('like'); }}
            style={{
              padding: isLux ? 0 : 8,
              width: isLux ? 28 : 'auto', height: isLux ? 28 : 'auto',
              borderRadius: isLux ? '50%' : theme.radius.md,
              background: liked ? theme.colors.inverted : 'transparent',
              color: liked ? theme.colors.accent : theme.colors.textMuted,
              border: liked ? 'none' : `1px solid ${theme.colors.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <Heart size={14} fill={liked ? theme.colors.accent : 'none'} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onRate('dislike'); }}
            style={{
              padding: isLux ? 0 : 8,
              width: isLux ? 28 : 'auto', height: isLux ? 28 : 'auto',
              borderRadius: isLux ? '50%' : theme.radius.md,
              background: disliked ? theme.colors.danger : 'transparent',
              color: disliked ? 'white' : theme.colors.textMuted,
              border: disliked ? 'none' : `1px solid ${theme.colors.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <ThumbsDown size={14} />
          </button>
        </div>
        <button onClick={onOpen} style={{
          fontSize: 11, fontWeight: 600,
          fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
          fontStyle: isLux ? 'italic' : 'normal',
          letterSpacing: isLux ? '0.2em' : 'normal',
          textTransform: isLux ? 'uppercase' : 'none',
          color: theme.colors.accent, background: 'none', border: 'none',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {isLux ? 'Read on →' : <>View recipe <ChevronRight size={12} /></>}
        </button>
      </div>

      {stats && stats.visits > 0 && (
        <div style={{
          padding: '0 20px 12px', fontSize: 11, color: theme.colors.textHint,
          display: 'flex', gap: 12,
        }}>
          <span>Opened {stats.visits}×</span>
          {stats.dwellMs > 0 && <span>· {Math.round(stats.dwellMs / 1000)}s studied</span>}
        </div>
      )}
    </article>
  );
}
