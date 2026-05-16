// ============================================================
//  Theme hook
//   - Free users: warm only
//   - Premium/Owner: defaults to lux, but can opt back to warm
//   - Selection persists across sessions
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { THEMES, WARM_THEME } from '../themes/tokens.js';
import { storage } from './storage.js';

export function useTheme(tier, canUse) {
  const [themeId, setThemeId] = useState('warm');

  useEffect(() => {
    (async () => {
      const saved = await storage.load('themePref', null);
      // Premium/owner defaults to lux on first visit; respects saved choice on returns
      if (canUse('themeLux')) {
        if (saved === 'warm' || saved === 'lux') setThemeId(saved);
        else setThemeId('lux');
      } else {
        // Free user — force warm
        setThemeId('warm');
      }
    })();
  }, [tier]);

  const setTheme = useCallback(async (id) => {
    if (id === 'lux' && !canUse('themeLux')) return; // free users can't pick lux
    setThemeId(id);
    await storage.save('themePref', id);
  }, [canUse]);

  const theme = THEMES[themeId] || WARM_THEME;

  return { theme, themeId, setTheme, canSwitchTheme: canUse('themeLux') };
}
