import React from 'react';
import { ArrowLeft, Check, Sparkles, Calendar, Apple, Cloud, Image, Crown, ChefHat, Share2, Users, Award, Clock } from 'lucide-react';
import { LUX_THEME } from '../themes/tokens.js';
import { TIERS } from '../lib/tier.js';

const T = LUX_THEME;

const PREMIUM_FEATURES = [
  {
    icon: Sparkles,
    title: 'Unlimited new recipes',
    body: 'Ask for fresh recipes any time. Free is limited to three per month.',
  },
  {
    icon: ChefHat,
    title: 'Cooking mode with timers',
    body: 'Full-screen step-by-step walkthrough with built-in timers and screen-stays-on while you cook.',
  },
  {
    icon: Calendar,
    title: 'Browse by meal time',
    body: 'Tabs for breakfast, lunch, dinner, and snacks. Each surface tuned to your taste.',
  },
  {
    icon: Share2,
    title: 'Weekend list to your phone',
    body: 'One tap sends your entire weekend ingredient list to your email, WhatsApp, or SMS.',
  },
  {
    icon: Clock,
    title: 'Cooking-time mood',
    body: 'Quick weekday meals, comfort cooking on Sunday, slow projects when you have the afternoon.',
  },
  {
    icon: Crown,
    title: 'The atelier theme',
    body: 'A more considered visual treatment — deeper colors, finer typography. Switch between themes at will.',
  },
];

const COMING_SOON = [
  {
    icon: ChefHat,
    title: 'Share your own recipes',
    body: 'Submit a recipe your family loves and watch others discover it.',
    when: 'Soon',
  },
  {
    icon: Users,
    title: 'Follow other home cooks',
    body: 'See what cooks whose taste matches yours are making this week.',
    when: 'Later',
  },
  {
    icon: Award,
    title: 'Earn points, unlock something special',
    body: 'Cook regularly, build a streak, get rewarded with limited-edition seasonal recipes.',
    when: 'Later',
  },
];

export function PremiumScreen({ tier, onBack, onUpgrade, onDowngrade }) {
  const isAlreadyPremium = tier === TIERS.PREMIUM;
  const isOwner = tier === TIERS.OWNER;

  return (
    <div className="ek-fade-in" style={{ maxWidth: 760, margin: '0 auto', fontFamily: T.fonts.sans, color: T.colors.text }}>
      <button onClick={onBack} style={{
        marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 13, fontWeight: 500, color: T.colors.textMuted, background: 'none', border: 'none',
      }}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* Hero */}
      <div style={{
        background: T.colors.inverted, color: T.colors.invertedText,
        padding: '40px 32px', borderRadius: T.radius.lg, marginBottom: 24, textAlign: 'center',
      }}>
        <div style={{
          fontFamily: T.fonts.serif, fontSize: 10, color: T.colors.accent,
          letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: 16,
        }}>— Premium —</div>
        <h1 style={{
          fontFamily: T.fonts.serif, fontSize: 42, fontWeight: 400,
          lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0,
        }}>
          The kitchen, <span style={{ fontStyle: 'italic', color: T.colors.accent }}>composed</span>.
        </h1>
        <div style={{ width: 40, height: 1, background: T.colors.accent, margin: '20px auto' }} />
        <p style={{
          fontFamily: T.fonts.serif, fontSize: 16, fontStyle: 'italic',
          color: '#C9B79C', margin: 0, lineHeight: 1.5,
        }}>
          Every advanced feature, a more refined aesthetic,<br />
          and unlimited recipes — for the cost of a coffee.
        </p>
      </div>

      {/* Price */}
      <div style={{
        textAlign: 'center', padding: '32px 0', marginBottom: 24,
        background: T.colors.surface, borderRadius: T.radius.lg,
        border: `1px solid ${T.colors.border}`,
      }}>
        <div style={{
          fontFamily: T.fonts.serif, fontSize: 10, color: T.colors.accent,
          letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 12,
        }}>— Monthly subscription —</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
          <span style={{ fontFamily: T.fonts.serif, fontSize: 56, fontWeight: 400, color: T.colors.text }}>$4.99</span>
          <span style={{ fontFamily: T.fonts.serif, fontSize: 18, color: T.colors.textMuted, fontStyle: 'italic' }}>/ month</span>
        </div>
        <p style={{ fontSize: 12, color: T.colors.textMuted, margin: '12px 0 0' }}>
          Cancel any time. Or pay $39 once for a full year.
        </p>
      </div>

      {/* Features grid */}
      <SectionHeading>Today in Premium</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
        {PREMIUM_FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} style={{
              padding: 20, background: T.colors.surface, borderRadius: T.radius.lg,
              border: `1px solid ${T.colors.border}`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 18,
                background: T.colors.accentSoft, color: T.colors.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
              }}>
                <Icon size={18} />
              </div>
              <div style={{
                fontFamily: T.fonts.serif, fontSize: 17, fontWeight: 500,
                color: T.colors.text, marginBottom: 6,
              }}>{f.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: T.colors.textMuted }}>{f.body}</div>
            </div>
          );
        })}
      </div>

      {/* Coming Soon */}
      <SectionHeading>What's coming</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
        {COMING_SOON.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} style={{
              padding: 20, background: T.colors.surface, borderRadius: T.radius.lg,
              border: `1px dashed ${T.colors.border}`,
              opacity: 0.85,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: 12, right: 12,
                padding: '2px 8px', borderRadius: 2,
                background: T.colors.surfaceMuted, color: T.colors.textHint,
                fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              }}>{f.when}</div>
              <div style={{
                width: 36, height: 36, borderRadius: 18,
                background: T.colors.surfaceMuted, color: T.colors.textMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
              }}>
                <Icon size={18} />
              </div>
              <div style={{
                fontFamily: T.fonts.serif, fontSize: 17, fontWeight: 500,
                color: T.colors.text, marginBottom: 6,
              }}>{f.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: T.colors.textMuted }}>{f.body}</div>
            </div>
          );
        })}
      </div>

      {/* Comparison */}
      <SectionHeading>Comparison</SectionHeading>
      <div style={{
        background: T.colors.surface, borderRadius: T.radius.lg,
        border: `1px solid ${T.colors.border}`, padding: 24, marginBottom: 32,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <ComparisonCol title="Free" items={[
            'Three daily picks, adaptive scoring',
            'Cooking steps in every recipe',
            'Basic shopping list',
            'Three new recipes per month',
            'Warm visual theme',
          ]} />
          <ComparisonCol title="Premium" items={[
            'Everything in Free',
            'Unlimited new recipes',
            'Cooking mode with timers',
            'Browse by mealtime',
            'Weekend list to your phone',
            'Cooking-time mood matching',
            'Atelier theme + theme switching',
          ]} highlight />
        </div>
      </div>

      {/* CTA */}
      {isOwner ? (
        <div style={{
          padding: 20, background: T.colors.accentSoft, borderRadius: T.radius.lg,
          textAlign: 'center', border: `1px solid ${T.colors.accent}`,
        }}>
          <div style={{ fontFamily: T.fonts.serif, fontSize: 16, color: T.colors.text }}>
            You are the <span style={{ fontStyle: 'italic', color: T.colors.accent }}>owner</span>. Everything is yours.
          </div>
        </div>
      ) : isAlreadyPremium ? (
        <div>
          <div style={{
            padding: 20, background: T.colors.accentSoft, borderRadius: T.radius.lg,
            textAlign: 'center', marginBottom: 16, border: `1px solid ${T.colors.accent}`,
          }}>
            <div style={{ fontFamily: T.fonts.serif, fontSize: 16, color: T.colors.text }}>
              You are a <span style={{ fontStyle: 'italic', color: T.colors.accent }}>Premium</span> member. Thank you.
            </div>
          </div>
          <button onClick={onDowngrade} style={{
            width: '100%', padding: 14, borderRadius: T.radius.md,
            background: 'none', border: `1px solid ${T.colors.border}`,
            color: T.colors.textMuted, fontSize: 13, fontWeight: 500,
          }}>
            Cancel subscription
          </button>
        </div>
      ) : (
        <button onClick={onUpgrade} style={{
          width: '100%', padding: 18, borderRadius: T.radius.md,
          background: T.colors.inverted, color: T.colors.invertedText,
          border: 'none', fontFamily: T.fonts.serif, fontSize: 16, fontWeight: 500,
          letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>
          Begin your subscription
        </button>
      )}

      <p style={{
        fontSize: 11, color: T.colors.textHint, textAlign: 'center', marginTop: 16,
        fontStyle: 'italic',
      }}>
        For now, the upgrade is instant and free — when this becomes a real product, this is where Stripe takes over.
      </p>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <div style={{
      textAlign: 'center', marginBottom: 16,
      fontFamily: T.fonts.serif, fontSize: 10, color: T.colors.accent,
      letterSpacing: '0.4em', textTransform: 'uppercase',
    }}>— {children} —</div>
  );
}

function ComparisonCol({ title, items, highlight }) {
  return (
    <div>
      <div style={{
        fontFamily: T.fonts.serif, fontSize: 18, fontWeight: 500,
        color: highlight ? T.colors.accent : T.colors.text,
        marginBottom: 12, paddingBottom: 8,
        borderBottom: `1px solid ${highlight ? T.colors.accent : T.colors.border}`,
      }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            padding: '8px 0', fontSize: 13, color: T.colors.text,
          }}>
            <Check size={14} style={{ color: highlight ? T.colors.accent : T.colors.textMuted, marginTop: 2, flexShrink: 0 }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
