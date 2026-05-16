// ============================================================
//  Tier system — gates features behind user level
//
//  Tiers:
//   - 'free'    — default
//   - 'premium' — paid (mocked: clicking Upgrade flips the flag locally)
//   - 'owner'   — you, via hidden footer password
//
//  This file is the single source of truth for "can the user do X?"
//  Components ask via the canUse() helper; they never check tier directly.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { storage } from './storage.js';

export const TIERS = { FREE: 'free', PREMIUM: 'premium', OWNER: 'owner' };

// Owner password — change this before deploying.
// You'll type this into the footer dot to unlock owner mode.
const OWNER_PASSWORD = 'kitchen-2026';

// Feature flags by tier
// Anything not listed = available to all
const FEATURE_GATING = {
  // LLM generation: free gets 3/month, premium and owner unlimited
  llmUnlimited: ['premium', 'owner'],

  // The luxurious theme is available to premium and owner.
  // Free users cannot select it.
  themeLux: ['premium', 'owner'],

  // Advanced preferences
  cookingTimeMood: ['premium', 'owner'],     // quick / comfort / slow
  seasonalSuggestions: ['premium', 'owner'], // weather-aware

  // Premium-only features (we'll build these screens later)
  mealPlan: ['premium', 'owner'],
  pantry: ['premium', 'owner'],
  nutritionGoals: ['premium', 'owner'],
  exportCookbook: ['premium', 'owner'],

  // Owner-only debug
  debugPanel: ['owner'],
  bypassRateLimits: ['owner'],
};

const FREE_LLM_MONTHLY_QUOTA = 3;

export function useTier() {
  const [tier, setTier] = useState(TIERS.FREE);
  const [llmCallsThisMonth, setLlmCallsThisMonth] = useState(0);
  const [llmMonthKey, setLlmMonthKey] = useState('');

  // Load on mount
  useEffect(() => {
    (async () => {
      const saved = await storage.load('tier', TIERS.FREE);
      const usage = await storage.load('llmUsage', { month: '', count: 0 });
      const currentMonth = new Date().toISOString().slice(0, 7); // "2026-05"
      // Reset counter at the start of each calendar month
      if (usage.month !== currentMonth) {
        const reset = { month: currentMonth, count: 0 };
        await storage.save('llmUsage', reset);
        setLlmMonthKey(currentMonth);
        setLlmCallsThisMonth(0);
      } else {
        setLlmMonthKey(usage.month);
        setLlmCallsThisMonth(usage.count);
      }
      setTier(saved);
    })();
  }, []);

  // Promote — user clicks Upgrade (mocked: just flips the local flag)
  const promote = useCallback(async () => {
    setTier(TIERS.PREMIUM);
    await storage.save('tier', TIERS.PREMIUM);
  }, []);

  // Downgrade — Cancel/manage subscription
  const downgrade = useCallback(async () => {
    setTier(TIERS.FREE);
    await storage.save('tier', TIERS.FREE);
  }, []);

  // Owner unlock — typed the password into the hidden footer dot
  const tryOwnerUnlock = useCallback(async (input) => {
    if (input?.trim() === OWNER_PASSWORD) {
      setTier(TIERS.OWNER);
      await storage.save('tier', TIERS.OWNER);
      return true;
    }
    return false;
  }, []);

  // Check feature access
  const canUse = useCallback((feature) => {
    const allowed = FEATURE_GATING[feature];
    if (!allowed) return true; // ungated
    return allowed.includes(tier);
  }, [tier]);

  // LLM call accounting
  const remainingLlmCalls = tier === TIERS.FREE
    ? Math.max(0, FREE_LLM_MONTHLY_QUOTA - llmCallsThisMonth)
    : Infinity;

  const canCallLlm = remainingLlmCalls > 0;

  const recordLlmCall = useCallback(async () => {
    if (tier !== TIERS.FREE) return; // unlimited tiers don't count
    const newCount = llmCallsThisMonth + 1;
    setLlmCallsThisMonth(newCount);
    await storage.save('llmUsage', { month: llmMonthKey, count: newCount });
  }, [tier, llmCallsThisMonth, llmMonthKey]);

  return {
    tier,
    isFree: tier === TIERS.FREE,
    isPremium: tier === TIERS.PREMIUM,
    isOwner: tier === TIERS.OWNER,
    isPaidOrOwner: tier === TIERS.PREMIUM || tier === TIERS.OWNER,
    canUse,
    canCallLlm,
    remainingLlmCalls,
    recordLlmCall,
    promote,
    downgrade,
    tryOwnerUnlock,
  };
}
