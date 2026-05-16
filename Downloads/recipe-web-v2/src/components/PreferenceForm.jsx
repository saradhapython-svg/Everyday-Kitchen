import React, { useState } from 'react';
import { ChevronRight, Lock, Clock, Heart, Coffee } from 'lucide-react';

export function PreferenceForm({ theme, initial, canUseCookingTime, onUpgradeRequest, onSubmit }) {
  const isLux = theme.id === 'lux';
  const [protein, setProtein] = useState(initial?.protein || 'medium');
  const [fat, setFat] = useState(initial?.fat || 'medium');
  const [carb, setCarb] = useState(initial?.carb || 'medium');
  const [taste, setTaste] = useState(initial?.taste || 'balanced');
  const [audience, setAudience] = useState(initial?.audience || ['adults']);
  const [cookingTime, setCookingTime] = useState(initial?.cookingTime || null);

  const canSubmit = audience.length > 0;

  function toggleAudience(val) {
    setAudience(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  }

  return (
    <div className="ek-fade-in">
      <div style={{
        background: theme.colors.surface, borderRadius: theme.radius.lg,
        padding: 32, border: `1px solid ${theme.colors.border}`,
      }}>
        <div style={{ marginBottom: 28, textAlign: isLux ? 'center' : 'left' }}>
          {isLux && (
            <div style={{
              fontFamily: theme.fonts.serif, fontSize: 10, color: theme.colors.accent,
              letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 10,
            }}>— The inquiry —</div>
          )}
          <h2 style={{
            fontFamily: theme.fonts.serif, fontSize: isLux ? 28 : 22,
            fontWeight: isLux ? 400 : 600, color: theme.colors.text, margin: '0 0 6px',
            letterSpacing: isLux ? '-0.01em' : 'normal',
          }}>
            {theme.copy.formTitle}
          </h2>
          <p style={{
            fontSize: 14, color: theme.colors.textMuted, margin: 0,
            fontStyle: isLux ? 'italic' : 'normal', fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
          }}>{theme.copy.formSubtitle}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <FormSection theme={theme} number={1} title={theme.copy.q1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <MacroRow theme={theme} label="Protein" value={protein} setValue={setProtein} />
              <MacroRow theme={theme} label="Fats" value={fat} setValue={setFat} />
              <MacroRow theme={theme} label="Carbs" value={carb} setValue={setCarb} />
            </div>
          </FormSection>

          <FormSection theme={theme} number={2} title={theme.copy.q2}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['spicy', 'tangy', 'sweet', 'sour', 'balanced'].map(t => (
                <button key={t} onClick={() => setTaste(t)}
                  style={{
                    padding: '10px 18px', borderRadius: theme.radius.md,
                    fontSize: isLux ? 13 : 13, fontWeight: 500,
                    fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
                    fontStyle: isLux ? 'italic' : 'normal',
                    background: taste === t ? theme.colors.inverted : theme.colors.surface,
                    color: taste === t ? theme.colors.invertedText : theme.colors.text,
                    border: `1px solid ${taste === t ? theme.colors.inverted : theme.colors.border}`,
                  }}>
                  {theme.copy.tasteLabels[t]}
                </button>
              ))}
            </div>
          </FormSection>

          {/* Premium-only: Cooking time mood */}
          <FormSection theme={theme} number={3} title="How much time do you have?" premium={!canUseCookingTime}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { id: 'quick', label: 'Quick (under 20 min)', icon: Clock },
                { id: 'comfort', label: 'Comfort (30–60 min)', icon: Coffee },
                { id: 'slow', label: 'Slow (project)', icon: Heart },
              ].map(opt => {
                const Icon = opt.icon;
                const selected = cookingTime === opt.id;
                return (
                  <button key={opt.id}
                    onClick={() => canUseCookingTime ? setCookingTime(selected ? null : opt.id) : onUpgradeRequest()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 18px', borderRadius: theme.radius.md,
                      fontSize: 13, fontWeight: 500,
                      fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
                      fontStyle: isLux ? 'italic' : 'normal',
                      background: selected ? theme.colors.accent : theme.colors.surface,
                      color: selected ? 'white' : (canUseCookingTime ? theme.colors.text : theme.colors.textHint),
                      border: `1px solid ${selected ? theme.colors.accent : theme.colors.border}`,
                      opacity: canUseCookingTime ? 1 : 0.7,
                    }}>
                    <Icon size={13} />
                    {opt.label}
                    {!canUseCookingTime && <Lock size={11} />}
                  </button>
                );
              })}
            </div>
          </FormSection>

          <FormSection theme={theme} number={4} title={theme.copy.q3}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {['kids', 'teenagers', 'adults', 'old'].map(v => {
                const on = audience.includes(v);
                return (
                  <button key={v} onClick={() => toggleAudience(v)}
                    style={{
                      padding: '14px 16px', borderRadius: theme.radius.md,
                      fontSize: isLux ? 14 : 13, fontWeight: 500, textAlign: 'left',
                      fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
                      background: on ? theme.colors.accent : theme.colors.surface,
                      color: on ? 'white' : theme.colors.text,
                      border: `1px solid ${on ? theme.colors.accent : theme.colors.border}`,
                    }}>
                    {theme.copy.audienceLabels[v]}
                  </button>
                );
              })}
            </div>
          </FormSection>

          <button onClick={() => canSubmit && onSubmit({ protein, fat, carb, taste, audience, cookingTime })}
            disabled={!canSubmit}
            style={{
              padding: isLux ? 16 : 14, borderRadius: theme.radius.md,
              fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
              fontSize: isLux ? 14 : 14, fontWeight: isLux ? 500 : 600,
              letterSpacing: isLux ? '0.2em' : 'normal',
              textTransform: isLux ? 'uppercase' : 'none',
              background: canSubmit ? theme.colors.inverted : theme.colors.border,
              color: theme.colors.invertedText,
              border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
            {theme.copy.submitCta} {!isLux && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormSection({ theme, number, title, premium, children }) {
  const isLux = theme.id === 'lux';
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
        <span style={{
          fontFamily: isLux ? theme.fonts.serif : 'monospace',
          fontSize: isLux ? 13 : 11, color: theme.colors.accent,
          fontStyle: isLux ? 'italic' : 'normal', fontWeight: 600,
          letterSpacing: isLux ? 'normal' : '0.05em',
        }}>
          {isLux ? ['i.', 'ii.', 'iii.', 'iv.', 'v.'][number - 1] : String(number).padStart(2, '0')}
        </span>
        <h3 style={{
          fontFamily: theme.fonts.serif, fontSize: isLux ? 18 : 16,
          fontWeight: isLux ? 400 : 600, color: theme.colors.text, margin: 0,
          flex: 1,
        }}>{title}</h3>
        {premium && (
          <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 4,
            background: theme.colors.accentSoft, color: theme.colors.accent,
            fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>Premium</span>
        )}
      </div>
      {children}
    </div>
  );
}

function MacroRow({ theme, label, value, setValue }) {
  const isLux = theme.id === 'lux';
  const opts = ['low', 'medium', 'high'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{
        width: isLux ? 70 : 70,
        fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
        fontSize: isLux ? 14 : 14, fontStyle: isLux ? 'italic' : 'normal',
        color: isLux ? theme.colors.textMuted : theme.colors.text, fontWeight: 500,
      }}>{label}</span>
      <div style={{
        display: 'flex', flex: 1, borderRadius: theme.radius.md, overflow: 'hidden',
        border: `1px solid ${theme.colors.border}`,
      }}>
        {opts.map(o => (
          <button key={o} onClick={() => setValue(o)}
            style={{
              flex: 1, padding: '8px 4px', fontSize: isLux ? 9 : 10, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: isLux ? '0.2em' : '0.05em',
              background: value === o ? theme.colors.accent : theme.colors.surface,
              color: value === o ? 'white' : theme.colors.textMuted,
              border: 'none', cursor: 'pointer',
            }}>
            {theme.copy.macroLabels[o]}
          </button>
        ))}
      </div>
    </div>
  );
}
