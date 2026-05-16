import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Check } from 'lucide-react';

// Premium-only step-by-step walkthrough with timers and a wake-lock attempt
// so the screen doesn't sleep while you're cooking.

export function CookingMode({ theme, recipe, onExit }) {
  const isLux = theme.id === 'lux';
  const steps = recipe.cookingMode && recipe.cookingMode.length > 0
    ? recipe.cookingMode
    : recipe.simpleSteps.map(s => ({ text: s }));
  const [stepIndex, setStepIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const wakeLockRef = useRef(null);

  const currentStep = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const hasTimer = currentStep?.timer && currentStep.timer > 0;

  // Try to acquire screen wake lock so screen doesn't sleep
  useEffect(() => {
    let cancelled = false;
    async function acquire() {
      try {
        if ('wakeLock' in navigator) {
          const lock = await navigator.wakeLock.request('screen');
          if (cancelled) { lock.release(); return; }
          wakeLockRef.current = lock;
        }
      } catch (e) {
        // Wake lock not available — that's fine, just degrade gracefully
      }
    }
    acquire();
    return () => {
      cancelled = true;
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, []);

  // Reset timer when step changes
  useEffect(() => {
    if (hasTimer) {
      setTimerSecondsLeft(currentStep.timer * 60);
      setTimerActive(false);
    } else {
      setTimerSecondsLeft(0);
      setTimerActive(false);
    }
  }, [stepIndex]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive) return;
    if (timerSecondsLeft <= 0) {
      setTimerActive(false);
      // Notify when timer finishes
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`${currentStep.timerLabel || 'Timer'} done`, { body: `Step ${stepIndex + 1} of ${steps.length}` });
        }
      } catch {}
      // Beep — uses Web Audio API for a small ding
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      } catch {}
      return;
    }
    const id = setTimeout(() => setTimerSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timerActive, timerSecondsLeft]);

  function next() {
    setCompleted(prev => new Set(prev).add(stepIndex));
    if (!isLast) setStepIndex(stepIndex + 1);
  }
  function prev() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }
  function toggleTimer() {
    if (timerSecondsLeft <= 0 && hasTimer) {
      setTimerSecondsLeft(currentStep.timer * 60);
    }
    setTimerActive(a => !a);
  }
  function resetTimer() {
    if (hasTimer) setTimerSecondsLeft(currentStep.timer * 60);
    setTimerActive(false);
  }

  const minutes = Math.floor(timerSecondsLeft / 60);
  const seconds = timerSecondsLeft % 60;
  const timerDone = hasTimer && timerSecondsLeft === 0 && !timerActive && completed.has(stepIndex - 1) === false;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: isLux ? theme.colors.inverted : theme.colors.pageBg,
      color: isLux ? theme.colors.invertedText : theme.colors.text,
      display: 'flex', flexDirection: 'column',
      fontFamily: theme.fonts.sans,
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: `1px solid ${isLux ? 'rgba(255,255,255,0.1)' : theme.colors.border}`,
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: theme.colors.accent, marginBottom: 4,
            fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
          }}>
            {isLux ? '— Cooking —' : 'Cooking mode'}
          </div>
          <div style={{
            fontFamily: theme.fonts.serif, fontSize: 18, fontWeight: 500,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{recipe.name}</div>
        </div>
        <button onClick={onExit} style={{
          padding: 10, background: 'transparent', border: 'none',
          color: isLux ? theme.colors.invertedText : theme.colors.text,
          cursor: 'pointer',
        }}>
          <X size={20} />
        </button>
      </header>

      {/* Progress bar */}
      <div style={{
        height: 3, background: isLux ? 'rgba(255,255,255,0.1)' : theme.colors.border,
      }}>
        <div style={{
          height: '100%', width: `${((stepIndex + 1) / steps.length) * 100}%`,
          background: theme.colors.accent, transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Step indicator dots */}
      <div style={{
        display: 'flex', gap: 6, padding: '16px 24px',
        justifyContent: 'center', flexWrap: 'wrap',
      }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: completed.has(i) ? theme.colors.accent
              : i === stepIndex ? theme.colors.accent
              : isLux ? 'rgba(255,255,255,0.2)' : theme.colors.border,
            opacity: completed.has(i) ? 0.6 : 1,
          }} />
        ))}
      </div>

      {/* Step content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '20px 32px', textAlign: 'center',
      }}>
        <div style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: theme.colors.accent, marginBottom: 16,
          fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
        }}>
          Step {stepIndex + 1} of {steps.length}
        </div>

        <p style={{
          fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
          fontSize: 24, fontWeight: isLux ? 400 : 500,
          lineHeight: 1.4, maxWidth: 560,
          color: isLux ? theme.colors.invertedText : theme.colors.text,
          margin: '0 0 32px',
        }}>{currentStep.text}</p>

        {/* Timer */}
        {hasTimer && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 16, padding: '24px 32px',
            background: isLux ? 'rgba(166,138,45,0.1)' : theme.colors.accentSoft,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.accent}`,
            minWidth: 240,
          }}>
            {currentStep.timerLabel && (
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: theme.colors.accent,
                fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
              }}>{currentStep.timerLabel}</div>
            )}
            <div style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: 56, fontWeight: 500, lineHeight: 1,
              color: timerDone ? theme.colors.accent : isLux ? theme.colors.invertedText : theme.colors.text,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={toggleTimer} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', borderRadius: theme.radius.md,
                background: theme.colors.accent, color: 'white', border: 'none',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                {timerActive ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Start</>}
              </button>
              <button onClick={resetTimer} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 14px', borderRadius: theme.radius.md,
                background: 'transparent', color: theme.colors.accent,
                border: `1px solid ${theme.colors.accent}`,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                <RotateCcw size={14} />
              </button>
            </div>
            {timerDone && (
              <div style={{
                fontSize: 13, color: theme.colors.accent, fontWeight: 600,
                fontStyle: 'italic',
              }}>Time's up</div>
            )}
          </div>
        )}
      </div>

      {/* Nav footer */}
      <footer style={{
        padding: '20px 24px',
        borderTop: `1px solid ${isLux ? 'rgba(255,255,255,0.1)' : theme.colors.border}`,
        display: 'flex', gap: 12,
      }}>
        <button onClick={prev} disabled={stepIndex === 0} style={{
          flex: '0 0 auto', padding: '14px 18px', borderRadius: theme.radius.md,
          background: 'transparent', color: isLux ? theme.colors.invertedText : theme.colors.text,
          border: `1px solid ${isLux ? 'rgba(255,255,255,0.2)' : theme.colors.border}`,
          fontSize: 14, fontWeight: 500,
          opacity: stepIndex === 0 ? 0.4 : 1,
          cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={isLast ? onExit : next} style={{
          flex: 1, padding: '14px 18px', borderRadius: theme.radius.md,
          background: theme.colors.accent, color: 'white', border: 'none',
          fontSize: 14, fontWeight: 600,
          fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
          fontStyle: isLux ? 'italic' : 'normal',
          letterSpacing: isLux ? '0.15em' : 'normal',
          textTransform: isLux ? 'uppercase' : 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {isLast ? (
            <><Check size={16} /> Finished</>
          ) : (
            <>Next step <ChevronRight size={16} /></>
          )}
        </button>
      </footer>
    </div>
  );
}
