import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Lock, Calendar, Send, Check } from 'lucide-react';

// Lets users send themselves their weekend ingredient list.
// Uses native share intents — no server-side email/SMS infrastructure.
// Email -> mailto: link, WhatsApp -> wa.me link, SMS -> sms: link.
// No server, no compliance burden, works on phone and desktop.

export function WeekendShare({ theme, weekendList, shoppingDay, canUse, onUpgradeRequest, showToast }) {
  const isLux = theme.id === 'lux';
  const [sent, setSent] = useState(null);

  const recipes = weekendList?.recipes || [];
  const ingredients = weekendList?.ingredients || [];

  // Format the message body
  const messageBody = `Your weekend kitchen list

For ${capitalize(shoppingDay)}'s shop. Recipes planned:

${recipes.map(r => `• ${r.name}`).join('\n')}

INGREDIENTS:
${ingredients.map(i => `- ${i}`).join('\n')}

— From The Everyday Kitchen`;

  const emailSubject = `Your weekend kitchen list — ${capitalize(shoppingDay)}`;

  function handleShare(channel) {
    if (!canUse) {
      onUpgradeRequest && onUpgradeRequest('Sending your weekend list is a Premium feature.');
      return;
    }

    let url;
    if (channel === 'email') {
      url = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(messageBody)}`;
    } else if (channel === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(messageBody)}`;
    } else if (channel === 'sms') {
      // SMS body delimiter differs by platform — & is most compatible
      url = `sms:?&body=${encodeURIComponent(messageBody)}`;
    }

    if (url) {
      window.open(url, '_blank');
      setSent(channel);
      showToast && showToast('Opening your app...');
      setTimeout(() => setSent(null), 3000);
    }
  }

  async function handleCopy() {
    if (!canUse) {
      onUpgradeRequest && onUpgradeRequest('Sending your weekend list is a Premium feature.');
      return;
    }
    try {
      await navigator.clipboard.writeText(messageBody);
      setSent('copy');
      showToast && showToast('Copied to clipboard.');
      setTimeout(() => setSent(null), 3000);
    } catch {
      showToast && showToast("Couldn't copy — please try email instead.");
    }
  }

  return (
    <section style={{
      background: canUse ? theme.colors.surface : theme.colors.surfaceMuted,
      borderRadius: theme.radius.lg,
      padding: 24,
      border: `1px solid ${canUse ? theme.colors.accent : theme.colors.border}`,
      opacity: canUse ? 1 : 0.85,
      position: 'relative',
    }}>
      {!canUse && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '3px 10px', borderRadius: theme.radius.md,
          background: theme.colors.accentSoft, color: theme.colors.accent,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Lock size={10} /> Premium
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: theme.radius.md,
          background: theme.colors.accentSoft, color: theme.colors.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Calendar size={18} />
        </div>
        <div>
          <h3 style={{
            fontFamily: theme.fonts.serif, fontSize: isLux ? 20 : 18,
            fontWeight: isLux ? 500 : 600, color: theme.colors.text, margin: 0,
            letterSpacing: isLux ? '-0.01em' : 'normal',
          }}>
            {isLux ? <>Send <span style={{ fontStyle: 'italic', color: theme.colors.accent }}>the weekend</span> to your phone</> : 'Get your weekend list'}
          </h3>
          <p style={{
            fontSize: 12, color: theme.colors.textMuted, margin: '4px 0 0',
            fontStyle: isLux ? 'italic' : 'normal',
            fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
          }}>
            All ingredients for {recipes.length || 0} recipes — Fri, Sat, Sun. One tap, no signup.
          </p>
        </div>
      </div>

      <div style={{
        marginTop: 16, padding: 12,
        background: theme.colors.surfaceMuted, borderRadius: theme.radius.md,
        fontSize: 12, color: theme.colors.textMuted, marginBottom: 16,
      }}>
        <strong style={{ color: theme.colors.text }}>Includes:</strong>{' '}
        {recipes.slice(0, 4).map(r => r.name).join(' · ')}
        {recipes.length > 4 && ` · and ${recipes.length - 4} more`}
        <div style={{ marginTop: 6, fontSize: 11 }}>
          <span style={{ color: theme.colors.accent, fontWeight: 600 }}>{ingredients.length}</span> ingredients total
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8,
      }}>
        <ShareButton theme={theme} icon={Mail} label="Email"
          onClick={() => handleShare('email')} disabled={!canUse}
          active={sent === 'email'} />
        <ShareButton theme={theme} icon={MessageCircle} label="WhatsApp"
          onClick={() => handleShare('whatsapp')} disabled={!canUse}
          active={sent === 'whatsapp'} />
        <ShareButton theme={theme} icon={Phone} label="SMS"
          onClick={() => handleShare('sms')} disabled={!canUse}
          active={sent === 'sms'} />
        <ShareButton theme={theme} icon={sent === 'copy' ? Check : Send} label={sent === 'copy' ? 'Copied' : 'Copy'}
          onClick={handleCopy} disabled={!canUse}
          active={sent === 'copy'} />
      </div>

      {!canUse && (
        <button onClick={() => onUpgradeRequest && onUpgradeRequest()} style={{
          marginTop: 16, width: '100%',
          padding: 12, borderRadius: theme.radius.md,
          background: theme.colors.accent, color: 'white',
          border: 'none', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Lock size={14} /> Unlock with Premium
        </button>
      )}
    </section>
  );
}

function ShareButton({ theme, icon: Icon, label, onClick, disabled, active }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '12px 8px', borderRadius: theme.radius.md,
      background: active ? theme.colors.accent : theme.colors.surface,
      color: active ? 'white' : disabled ? theme.colors.textHint : theme.colors.text,
      border: `1px solid ${active ? theme.colors.accent : theme.colors.border}`,
      fontSize: 12, fontWeight: 500,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.15s ease',
    }}>
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
