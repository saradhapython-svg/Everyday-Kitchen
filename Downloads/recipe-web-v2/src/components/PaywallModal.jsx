import React from 'react';
import { X, Crown } from 'lucide-react';

export function PaywallModal({ theme, message, onClose, onUpgrade }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 20, animation: 'fadeIn 0.2s ease-out',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.colors.surface, padding: 32, borderRadius: theme.radius.lg,
        border: `1px solid ${theme.colors.border}`, maxWidth: 420, width: '100%',
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)', position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'none', border: 'none',
          color: theme.colors.textMuted, padding: 4,
        }}><X size={18} /></button>

        <div style={{
          width: 48, height: 48, borderRadius: 24,
          background: theme.colors.accentSoft, color: theme.colors.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <Crown size={22} />
        </div>

        <h2 style={{
          fontFamily: theme.fonts.serif, fontSize: 22, fontWeight: theme.id === 'lux' ? 400 : 600,
          color: theme.colors.text, margin: '0 0 8px',
        }}>
          {theme.id === 'lux' ? 'A premium feature' : 'Premium feature'}
        </h2>

        <p style={{
          fontSize: 14, color: theme.colors.textMuted, lineHeight: 1.55, margin: '0 0 24px',
        }}>
          {message || "This feature is part of Premium. See what else you'd unlock."}
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: 12, borderRadius: theme.radius.md, fontSize: 13, fontWeight: 500,
            background: 'none', border: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted,
          }}>
            Maybe later
          </button>
          <button onClick={onUpgrade} style={{
            flex: 1, padding: 12, borderRadius: theme.radius.md, fontSize: 13, fontWeight: 600,
            background: theme.colors.accent, color: 'white', border: 'none',
          }}>
            See Premium
          </button>
        </div>
      </div>
    </div>
  );
}
