import { useEffect } from 'react';

const useAdControl = () => {
  useEffect(() => {
    const AD_SRC = "//xb.warpsterp.com/rN1prrqWh0q2mfT1V/elRvk";
    const SCRIPT_ID = "warpsterp-ad";
    const AD_CLICK_KEY = 'ad_clicked';
    const FIRST_VISIT_KEY = 'first_visit_time';

    const now = Date.now();
    let firstVisit = localStorage.getItem(FIRST_VISIT_KEY);

    // If first visit isn't recorded, store it
    if (!firstVisit) {
      localStorage.setItem(FIRST_VISIT_KEY, now);
      firstVisit = now;
    }

    const minutesSinceFirstVisit = (now - firstVisit) / (1000 * 60);
    const adClicked = localStorage.getItem(AD_CLICK_KEY);

    // Function to add ad script
    const addScript = () => {
      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = AD_SRC;
        script.async = true;
        script.dataset.cfasync = "false";
        document.body.appendChild(script);
        console.log("Ad script injected.");
      }
    };

    // Function to remove ad script
    const removeScript = () => {
      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) {
        existingScript.remove();
        console.log("Ad script removed.");
      }
    };

    // Monitor for click on ad iframe (basic approach)
    const detectAdClick = () => {
      const observer = new MutationObserver(() => {
        const iframes = document.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
          iframe.addEventListener("click", () => {
            localStorage.setItem(AD_CLICK_KEY, "true");
            removeScript();
            console.log("Ad clicked. Script disabled permanently.");
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };

    // Main control logic
    if (adClicked === "true") {
      removeScript();
      return;
    }

    detectAdClick();

    if (minutesSinceFirstVisit >= 30) {
      addScript();

      const intervalId = setInterval(() => {
        if (localStorage.getItem(AD_CLICK_KEY) !== "true") {
          addScript();
        } else {
          removeScript();
          clearInterval(intervalId);
        }
      }, 10 * 60 * 1000); // every 10 minutes

      return () => clearInterval(intervalId);
    } else {
      removeScript(); // During first 30 minutes
    }
  }, []);
};

export default useAdControl;
