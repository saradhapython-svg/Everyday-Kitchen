import React, { useState, useRef, useEffect } from 'react';
import { TIERS } from '../lib/tier.js';

// Renders as a tiny middle-dot in the footer (·).
// Clicking it triple-fast opens a password prompt.
// Right password = owner unlock. Wrong password = silent close.
// Visible enough for you to find, obscure enough that no one notices.

export function OwnerUnlockFooter({ tierApi, showToast, theme }) {
  const [clicks, setClicks] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [pw, setPw] = useState('');
  const clickTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Already an owner? Show a discreet badge instead of the click target
  if (tierApi.tier === TIERS.OWNER) {
    return <span style={{ color: theme.colors.accent, fontWeight: 500 }}>owner ●</span>;
  }

  // Triple-click within 1 second opens the prompt
  function onDot() {
    setClicks(c => c + 1);
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => setClicks(0), 1000);
  }

  useEffect(() => {
    if (clicks >= 3) {
      setShowPrompt(true);
      setClicks(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [clicks]);

  async function trySubmit() {
    const ok = await tierApi.tryOwnerUnlock(pw);
    setShowPrompt(false);
    setPw('');
    if (ok) showToast('Owner mode unlocked.');
    // No error message on failure — keeps the unlock obscure
  }

  return (
    <>
      <span onClick={onDot}
        style={{
          cursor: 'default', color: theme.colors.textHint,
          userSelect: 'none', padding: '0 4px',
        }}
        title="">·</span>

      {showPrompt && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 20,
        }} onClick={() => setShowPrompt(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: theme.colors.surface, padding: 28, borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.border}`, maxWidth: 380, width: '100%',
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              fontFamily: theme.fonts.serif, fontSize: 18, fontWeight: 500,
              color: theme.colors.text, marginBottom: 8,
            }}>
              Owner unlock
            </div>
            <div style={{ fontSize: 13, color: theme.colors.textMuted, marginBottom: 16 }}>
              Enter the owner password to unlock all features.
            </div>
            <input
              ref={inputRef}
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') trySubmit(); if (e.key === 'Escape') setShowPrompt(false); }}
              style={{
                width: '100%', padding: '12px 14px', fontSize: 14,
                background: theme.colors.surfaceMuted, border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md, color: theme.colors.text, outline: 'none',
                fontFamily: theme.fonts.sans,
              }}
              placeholder="Password" />
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowPrompt(false); setPw(''); }} style={{
                padding: '8px 14px', borderRadius: theme.radius.md, fontSize: 13,
                background: 'none', border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textMuted,
              }}>Cancel</button>
              <button onClick={trySubmit} style={{
                padding: '8px 14px', borderRadius: theme.radius.md, fontSize: 13, fontWeight: 600,
                background: theme.colors.text, color: theme.colors.invertedText, border: 'none',
              }}>Unlock</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
