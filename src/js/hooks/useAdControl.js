// useAdControl.js
import { useEffect, useRef } from 'react';

export default function useAdControl() {
  useEffect(() => {
    const AD_SRC       = "//xb.warpsterp.com/rN1prrqWh0q2mfT1V/elRvk";
    const SCRIPT_ID    = "warpsterp-ad";
    const FIRST_KEY    = "first_visit_time";
    const PAUSE_KEY    = "ad_pause_until";   // timestamp (ms) until we stay paused
    const CLICK_KEY    = "ad_clicked_once";  // optional: track if ever clicked

    const now = () => Date.now();

    // 1) First-visit timestamp
    let firstTs = Number(localStorage.getItem(FIRST_KEY));
    if (!firstTs) {
      firstTs = now();
      localStorage.setItem(FIRST_KEY, String(firstTs));
    }

    // 2) Pause-until timestamp
    const pauseUntil = () => {
      const ts = Number(localStorage.getItem(PAUSE_KEY));
      return isNaN(ts) ? 0 : ts;
    };

    // 3) Helpers to add/remove the ad script
    const addScript = () => {
      if (!document.getElementById(SCRIPT_ID)) {
        const s = document.createElement('script');
        s.id    = SCRIPT_ID;
        s.src   = AD_SRC;
        s.async = true;
        s.dataset.cfasync = "false";
        document.body.appendChild(s);
        console.log("Ad injected");
      }
    };
    const removeScript = () => {
      const existing = document.getElementById(SCRIPT_ID);
      if (existing) existing.remove();
      document
        .querySelectorAll(`script[src="${AD_SRC}"]`)
        .forEach((el) => el.remove());
      console.log("Ad removed");
    };

    // 4) Handle a “click” or new-tab attempt
    const schedulePause = () => {
      const until = now() + 10 * 60_000; // 10 minutes from now
      localStorage.setItem(PAUSE_KEY, String(until));
      removeScript();
      console.log("Ad paused until", new Date(until).toLocaleTimeString());
      restartCycle();
    };
    // wrap window.open
    const originalOpen = window.open;
    window.open = function (...args) {
      // any new-tab from the ad will hit us here
      schedulePause();
      return null;
    };

    // 5) Detect clicks inside iframes
    const observer = new MutationObserver(() => {
      document.querySelectorAll('iframe').forEach((ifr) => {
        if (!ifr.dataset._adListener) {
          ifr.dataset._adListener = '1';
          ifr.addEventListener('click', () => {
            schedulePause();
          });
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // --- Timing logic ---
    let timeoutId = null;
    let intervalId = null;

    const clearTimers = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };

    const restartCycle = () => {
      clearTimers();

      const nowTs   = now();
      const first30 = firstTs + 30 * 60_000;
      const paused  = pauseUntil();

      // next injection time is…
      //   • first30 if we haven’t hit 30 min yet  
      //   • paused if we’re still in a pause window  
      //   • otherwise “now” (i.e. immediately) or the next 10 min tick.
      let nextInjection = Math.max(first30, paused, nowTs);

      // align it onto a 10 min grid after first30:
      if (nextInjection > first30) {
        const sinceFirst30 = nextInjection - first30;
        const cycles       = Math.ceil(sinceFirst30 / (10 * 60_000));
        nextInjection     = first30 + cycles * 10 * 60_000;
      }

      const delay = nextInjection - nowTs;
      // schedule first add
      timeoutId = setTimeout(() => {
        // if still not in pause
        if (now() >= pauseUntil()) {
          addScript();
        }
        // then every 10 min thereafter
        intervalId = setInterval(() => {
          if (now() >= pauseUntil()) {
            removeScript();
            addScript();
          }
        }, 10 * 60_000);
      }, delay);
    };

    // start it up
    restartCycle();

    // cleanup on unmount
    return () => {
      clearTimers();
      observer.disconnect();
      window.open = originalOpen;
    };
  }, []);
}
