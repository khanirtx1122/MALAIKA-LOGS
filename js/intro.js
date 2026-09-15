/**
 * MALAIKA FABRICS — Intro Animation
 * =========================================
 * Orchestrates the full-screen animated intro:
 * 1. Cinematic clip-path image reveals (not fades)
 * 2. Masked clip-path brand name reveal + light sweep
 * 3. Clip-path curtain-lift exit revealing the store
 *
 * EVERY reload starts the intro fresh. No session persistence.
 * Proper cleanup of all timers/intervals to prevent duplicates.
 */

(function () {
  'use strict';

  // Time before exit begins (brand reveal finishes ~2.5s, ornaments ~2s)
  const INTRO_DURATION = (window.MF_CONFIG?.INTRO_DURATION_MS) || 3200;
  // Duration of the exit animation (must match CSS introExitReveal)
  const EXIT_DURATION = 1200;
  // Image cycle interval
  const IMAGE_INTERVAL = 1800;

  // Track all timers for cleanup
  let imageInterval = null;
  let autoAdvanceTimer = null;
  let exitTimer = null;
  let imageCleanupTimers = [];

  // ── Cinematic Image Sequence (clip-path reveals) ──────────
  function initImageSequence() {
    const images = document.querySelectorAll('.intro__img-wrap');
    if (!images.length) return;

    let currentIndex = 0;

    imageInterval = setInterval(() => {
      const oldImg = images[currentIndex];

      // Old image exits
      oldImg.classList.remove('active', 'intro-entering');
      oldImg.classList.add('intro-exiting');

      // New image enters via clip-path reveal
      currentIndex = (currentIndex + 1) % images.length;
      const newImg = images[currentIndex];
      newImg.classList.add('active', 'intro-entering');

      // Cleanup exiting state after animation completes
      const cleanupTimer = setTimeout(() => {
        oldImg.classList.remove('intro-exiting');
      }, 1000);
      imageCleanupTimers.push(cleanupTimer);

    }, IMAGE_INTERVAL);
  }

  // ── Exit & Advance ────────────────────────────────────────
  function initAdvance(onFinish) {
    let finished = false;
    const btn = document.getElementById('intro-skip');

    const triggerFinish = () => {
      if (finished) return;
      finished = true;

      const intro = document.getElementById('intro');
      if (intro) {
        // Apply clip-path curtain-lift exit (NOT opacity fade)
        intro.classList.add('intro-exit');

        exitTimer = setTimeout(() => {
          onFinish();
        }, EXIT_DURATION);
      } else {
        onFinish();
      }
    };

    // Auto advance after brand reveal completes
    autoAdvanceTimer = setTimeout(triggerFinish, INTRO_DURATION);

    if (btn) {
      btn.addEventListener('click', () => {
        btn.style.opacity = '0';
        triggerFinish();
      });
    }
  }

  // ── Cleanup all animation state ───────────────────────────
  function cleanup() {
    if (imageInterval) { clearInterval(imageInterval); imageInterval = null; }
    if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
    if (exitTimer) { clearTimeout(exitTimer); exitTimer = null; }
    imageCleanupTimers.forEach(t => clearTimeout(t));
    imageCleanupTimers = [];
  }

  // ── Reveal the store ──────────────────────────────────────
  function revealStore() {
    cleanup();

    const store = document.getElementById('store');
    if (store) {
      store.classList.add('visible');
      store.classList.add('store--visible');
    }

    const intro = document.getElementById('intro');
    if (intro) intro.remove();

    document.body.style.overflow = '';
  }

  // ── Main Init ─────────────────────────────────────────────
  function init() {
    // If the page was loaded via internal SPA-like navigation,
    // skip the intro entirely and reveal the store immediately.
    if (sessionStorage.getItem('mf_internal_nav')) {
      sessionStorage.removeItem('mf_internal_nav');
      // Set fade in for next store.js init
      sessionStorage.setItem('mf_internal_nav_fade_in', 'true');
      revealStore();
      return;
    }

    if (window.MF_CONFIG && window.MF_CONFIG.INTRO_ENABLED === false) {
      revealStore();
      return;
    }

    initImageSequence();
    initAdvance(() => {
      revealStore();
    });
  }

  // Run when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
