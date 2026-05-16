import React from 'react';
import { Lock } from 'lucide-react';

export function ThemeSwitcher({ theme, themeId, setTheme, canSwitchTheme }) {
  const options = [
    { id: 'warm', name: 'Everyday', desc: 'Warm and inviting. The default.', preview: ['#FAF7F2', '#C2410C', '#3F2A1A'] },
    { id: 'lux', name: 'Atelier', desc: 'Refined and editorial. Premium only.', preview: ['#1A1410', '#A68A2D', '#F5F1EA'] },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {options.map(opt => {
        const isSelected = opt.id === themeId;
        const isLocked = opt.id === 'lux' && !canSwitchTheme;
        return (
          <button key={opt.id}
            onClick={() => !isLocked && setTheme(opt.id)}
            disabled={isLocked}
            style={{
              padding: 16, borderRadius: theme.radius.lg, textAlign: 'left',
              background: isSelected ? theme.colors.accentSoft : theme.colors.surface,
              border: `${isSelected ? '2px' : '1px'} solid ${isSelected ? theme.colors.accent : theme.colors.border}`,
              cursor: isLocked ? 'not-allowed' : 'pointer',
              opacity: isLocked ? 0.6 : 1,
              position: 'relative',
            }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
              {opt.preview.map((c, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: theme.radius.sm,
                  background: c, border: `1px solid ${theme.colors.border}`,
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: theme.fonts.serif, fontSize: 16, fontWeight: 500, color: theme.colors.text }}>
                {opt.name}
              </span>
              {isLocked && <Lock size={12} style={{ color: theme.colors.textHint }} />}
            </div>
            <div style={{ fontSize: 12, color: theme.colors.textMuted }}>{opt.desc}</div>
          </button>
        );
      })}
    </div>
  );
}
