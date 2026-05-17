import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Lock, Calendar, Send, Check, ChevronDown } from 'lucide-react';

// Lets users send themselves their weekly meal plan + ingredient list.
// Uses native share intents — no server-side email/SMS infrastructure.

export function WeekendShare({ theme, weekendList, shoppingDay, canUse, onUpgradeRequest, showToast, onOpenRecipe }) {
  const isLux = theme.id === 'lux';
  const [sent, setSent] = useState(null);
  const [showPlan, setShowPlan] = useState(false);

  const recipes = weekendList?.recipes || [];
  const days = weekendList?.days || [];
  const byCategory = weekendList?.ingredientsByCategory || {};
  const totalIngredients = weekendList?.totalIngredients || 0;

  // Compose the message body — formatted for readability across channels
  const messageBody = buildMessage(days, byCategory);

  const emailSubject = `Your weekly kitchen plan + shopping list`;

  function handleShare(channel) {
    if (!canUse) {
      onUpgradeRequest && onUpgradeRequest('Sending your weekly list is a Premium feature.');
      return;
    }

    let url;
    if (channel === 'email') {
      url = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(messageBody)}`;
    } else if (channel === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(messageBody)}`;
    } else if (channel === 'sms') {
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
      onUpgradeRequest && onUpgradeRequest('Sending your weekly list is a Premium feature.');
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

  // Warn if SMS would split into many pieces
  const smsParts = Math.ceil(messageBody.length / 160);

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
            {isLux ? <>Your <span style={{ fontStyle: 'italic', color: theme.colors.accent }}>weekly</span> plan</> : 'Your week ahead'}
          </h3>
          <p style={{
            fontSize: 12, color: theme.colors.textMuted, margin: '4px 0 0',
            fontStyle: isLux ? 'italic' : 'normal',
            fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
          }}>
            7 days of breakfast, lunch, and dinner — one tap to send the full plan and shopping list.
          </p>
        </div>
      </div>

      {/* Summary card */}
      <div style={{
        marginTop: 16, padding: 14,
        background: theme.colors.surfaceMuted, borderRadius: theme.radius.md,
        fontSize: 12, color: theme.colors.textMuted, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span><strong style={{ color: theme.colors.text }}>{recipes.length}</strong> unique recipes</span>
          <span><strong style={{ color: theme.colors.text }}>21</strong> meals planned</span>
          <span><strong style={{ color: theme.colors.text }}>{totalIngredients}</strong> ingredients</span>
        </div>

        {/* Expandable plan preview */}
        {canUse && days.length > 0 && (
          <>
            <button onClick={() => setShowPlan(!showPlan)} style={{
              marginTop: 12, padding: 0, border: 'none', background: 'none',
              color: theme.colors.accent, fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
            }}>
              <ChevronDown size={12} style={{
                transform: showPlan ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }} />
              {showPlan ? 'Hide plan' : 'Preview plan'}
            </button>

            {showPlan && (
              <div style={{ marginTop: 12, fontSize: 12, color: theme.colors.text }}>
                {days.map((d, i) => (
                  <div key={i} style={{
                    padding: '8px 0',
                    borderBottom: i < days.length - 1 ? `1px solid ${theme.colors.borderSoft}` : 'none',
                  }}>
                    <div style={{
                      fontFamily: isLux ? theme.fonts.serif : theme.fonts.sans,
                      fontWeight: 600, color: theme.colors.text, marginBottom: 4,
                      fontSize: 12,
                    }}>{d.day}</div>
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: 3,
                      fontSize: 11, lineHeight: 1.5,
                    }}>
                      {d.breakfast && (
                        <RecipeLink
                          theme={theme}
                          icon="🌅"
                          label="Breakfast"
                          recipe={d.breakfast}
                          onOpen={onOpenRecipe}
                        />
                      )}
                      {d.lunch && (
                        <RecipeLink
                          theme={theme}
                          icon="🥗"
                          label="Lunch"
                          recipe={d.lunch}
                          onOpen={onOpenRecipe}
                        />
                      )}
                      {d.dinner && (
                        <RecipeLink
                          theme={theme}
                          icon="🍽️"
                          label="Dinner"
                          recipe={d.dinner}
                          onOpen={onOpenRecipe}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
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
        <ShareButton theme={theme} icon={Phone}
          label={smsParts > 3 ? `SMS (${smsParts}×)` : 'SMS'}
          onClick={() => handleShare('sms')} disabled={!canUse}
          active={sent === 'sms'} />
        <ShareButton theme={theme} icon={sent === 'copy' ? Check : Send} label={sent === 'copy' ? 'Copied' : 'Copy'}
          onClick={handleCopy} disabled={!canUse}
          active={sent === 'copy'} />
      </div>

      {canUse && smsParts > 3 && (
        <div style={{
          marginTop: 10, fontSize: 11, color: theme.colors.textMuted, fontStyle: 'italic',
        }}>
          The full week is long — SMS will arrive as {smsParts} messages. Email is easier to read.
        </div>
      )}

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

function RecipeLink({ theme, icon, label, recipe, onOpen }) {
  if (!recipe) return null;
  const clickable = !!onOpen;
  return (
    <button
      onClick={() => clickable && onOpen(recipe)}
      disabled={!clickable}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '4px 6px', margin: '-4px -6px',
        background: 'transparent', border: 'none',
        textAlign: 'left', width: '100%',
        cursor: clickable ? 'pointer' : 'default',
        borderRadius: theme.radius.sm,
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => { if (clickable) e.currentTarget.style.background = theme.colors.surfaceMuted; }}
      onMouseLeave={(e) => { if (clickable) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 13, flexShrink: 0 }}>{icon}</span>
      <span style={{
        flex: 1, fontSize: 11, color: theme.colors.text,
        fontFamily: theme.fonts.sans,
      }}>
        {recipe.name}
      </span>
      {clickable && (
        <span style={{
          fontSize: 10, color: theme.colors.accent, fontWeight: 600,
          opacity: 0.7,
        }}>view →</span>
      )}
    </button>
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

// Build the message text — formatted for easy reading in any client
function buildMessage(days, byCategory) {
  const lines = ['YOUR WEEK AT THE KITCHEN', ''];

  // Day-by-day
  lines.push('— MEAL PLAN —');
  days.forEach(d => {
    lines.push('');
    lines.push(d.day);
    if (d.breakfast) lines.push(`  Breakfast: ${d.breakfast.name}`);
    if (d.lunch) lines.push(`  Lunch:     ${d.lunch.name}`);
    if (d.dinner) lines.push(`  Dinner:    ${d.dinner.name}`);
  });

  // Shopping list, categorized
  lines.push('');
  lines.push('— SHOPPING LIST —');
  const categoryOrder = ['Produce', 'Dairy', 'Eggs & Nuts', 'Pantry — grains & proteins', 'Pantry — oils & condiments', 'Spices', 'Bread', 'Other'];
  categoryOrder.forEach(cat => {
    if (byCategory[cat] && byCategory[cat].length > 0) {
      lines.push('');
      lines.push(cat.toUpperCase());
      byCategory[cat].forEach(item => lines.push(`  • ${item}`));
    }
  });

  lines.push('');
  lines.push('— From The Everyday Kitchen');

  return lines.join('\n');
}
