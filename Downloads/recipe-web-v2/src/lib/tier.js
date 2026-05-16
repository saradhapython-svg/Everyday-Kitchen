// ============================================================
//  Tier system — gates features by user level
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { storage } from './storage.js';

export const TIERS = { FREE: 'free', PREMIUM: 'premium', OWNER: 'owner' };

const OWNER_PASSWORD = 'kitchen-2026';

const FEATURE_GATING = {
  llmUnlimited: ['premium', 'owner'],
  themeLux: ['premium', 'owner'],
  cookingTimeMood: ['premium', 'owner'],
  seasonalSuggestions: ['premium', 'owner'],
  mealPlan: ['premium', 'owner'],
  pantry: ['premium', 'owner'],
  nutritionGoals: ['premium', 'owner'],
  exportCookbook: ['premium', 'owner'],
  cookingMode: ['premium', 'owner'],
  mealTimeBrowsing: ['premium', 'owner'],
  weekendShare: ['premium', 'owner'],
  debugPanel: ['owner'],
  bypassRateLimits: ['owner'],
};

const FREE_LLM_MONTHLY_QUOTA = 3;

export function useTier() {
  const [tier, setTier] = useState(TIERS.FREE);
  const [llmCallsThisMonth, setLlmCallsThisMonth] = useState(0);
  const [llmMonthKey, setLlmMonthKey] = useState('');

  useEffect(() => {
    (async () => {
      const saved = await storage.load('tier', TIERS.FREE);
      const usage = await storage.load('llmUsage', { month: '', count: 0 });
      const currentMonth = new Date().toISOString().slice(0, 7);
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

  const promote = useCallback(async () => {
    setTier(TIERS.PREMIUM);
    await storage.save('tier', TIERS.PREMIUM);
  }, []);

  const downgrade = useCallback(async () => {
    setTier(TIERS.FREE);
    await storage.save('tier', TIERS.FREE);
  }, []);

  const tryOwnerUnlock = useCallback(async (input) => {
    if (input?.trim() === OWNER_PASSWORD) {
      setTier(TIERS.OWNER);
      await storage.save('tier', TIERS.OWNER);
      return true;
    }
    return false;
  }, []);

  const canUse = useCallback((feature) => {
    const allowed = FEATURE_GATING[feature];
    if (!allowed) return true;
    return allowed.includes(tier);
  }, [tier]);

  const remainingLlmCalls = tier === TIERS.FREE
    ? Math.max(0, FREE_LLM_MONTHLY_QUOTA - llmCallsThisMonth)
    : Infinity;

  const canCallLlm = remainingLlmCalls > 0;

  const recordLlmCall = useCallback(async () => {
    if (tier !== TIERS.FREE) return;
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
