/**
 * MALAIKA FABRICS — Hero Slider
 * =========================================
 * Handles the automatic fluid slider and dynamic theming.
 * Drives the centralized color system: hero + header + nav + arrows
 */

(function () {
  'use strict';

  const SLIDES = [
    {
      id: 'green',
      imageUrl: 'assets/hero/hero_green.jpg',
      themeBg: '#f2f7f4',
      themeSurfaceLight: '#e4efe7',
      themeSurfaceDark: '#1a231b',
      themeGlow: 'rgba(76, 175, 80, 0.22)',
      themeGlowStrong: 'rgba(76, 175, 80, 0.45)',
      themeAccent: '#388e3c',
      themeBrand: '#2e7d32',
      themeTextPrimary: '#1a231b',
      themeTextSecondary: '#3a5d3e',
      themeBorder: '#a8d5ad',
      // Header tinted backgrounds
      themeHeaderBg: 'rgba(230, 245, 232, 0.88)',
      themeHeaderGradient: 'rgba(220, 240, 224, 0.6)',
      transition: 'wipe',
      collection: 'Emerald Velvet Collection',
      title: 'Emerald<br><span>Elegance</span>',
      desc: 'Discover our curated green ensemble — a celebration of sophisticated craftsmanship and timeless Pakistani heritage.'
    },
    {
      id: 'pink',
      imageUrl: 'assets/hero/hero_pink.jpg',
      themeBg: '#fff5f8',
      themeSurfaceLight: '#ffeaf1',
      themeSurfaceDark: '#2d1a21',
      themeGlow: 'rgba(201, 79, 122, 0.22)',
      themeGlowStrong: 'rgba(201, 79, 122, 0.45)',
      themeAccent: '#c9a96e',
      themeBrand: '#c94f7a',
      themeTextPrimary: '#1a1218',
      themeTextSecondary: '#5b4752',
      themeBorder: '#f0b8d0',
      themeHeaderBg: 'rgba(255, 235, 242, 0.88)',
      themeHeaderGradient: 'rgba(252, 220, 233, 0.6)',
      transition: 'depth',
      collection: 'Pinkest Blossom Collection',
      title: 'Malaika<br><span>Fabrics</span>',
      desc: 'Where luxury meets craftsmanship. Discover our curated collection of premium women\'s 3-piece suits.'
    },
    {
      id: 'purple',
      imageUrl: 'assets/hero/hero_purple.jpg',
      themeBg: '#f7f4f9',
      themeSurfaceLight: '#efe7f4',
      themeSurfaceDark: '#201826',
      themeGlow: 'rgba(123, 31, 162, 0.22)',
      themeGlowStrong: 'rgba(123, 31, 162, 0.45)',
      themeAccent: '#c9a96e',
      themeBrand: '#6a1b9a',
      themeTextPrimary: '#1a141e',
      themeTextSecondary: '#4a3d52',
      themeBorder: '#cfb0e0',
      themeHeaderBg: 'rgba(240, 232, 248, 0.88)',
      themeHeaderGradient: 'rgba(232, 218, 244, 0.6)',
      transition: 'reveal',
      collection: 'Royal Orchid Collection',
      title: 'Royal<br><span>Orchid</span>',
      desc: 'Step into regal luxury. A magnificent purple 3-piece suit featuring intricate embroidery and majestic presence.'
    }
  ];

  let currentIndex = 0;
  let intervalId = null;
  const slideDuration = 4800; // Faster auto-slide
  let animTimeout = null;

  function initSlider() {
    const container = document.querySelector('.hero__slider');
    if (!container) return;

    // Build slides
    SLIDES.forEach((slide, i) => {
      const slideEl = document.createElement('div');
      slideEl.className = `hero__slide ${i === 0 ? 'active' : ''} transition-${slide.transition}`;
      slideEl.innerHTML = `
        <img src="${slide.imageUrl}" alt="${slide.collection}" class="hero__slide-img" loading="${i === 0 ? 'eager' : 'lazy'}" ${i === 0 ? 'fetchpriority="high" decoding="sync"' : 'decoding="async"'} />
        <div class="hero__content">
          <div class="hero__ornament" aria-hidden="true">
            <div class="hero__ornament-line"></div>
            <span>${slide.collection}</span>
            <div class="hero__ornament-line hero__ornament-line--right"></div>
          </div>
          <h2 class="hero__brand">${slide.title}</h2>
          <div class="hero__divider" aria-hidden="true"></div>
          <p class="hero__desc">${slide.desc}</p>
          <a href="https://wa.me/923488153311?text=Hi%20Malaika%20Fabrics%2C%20I%E2%80%99m%20interested%20in%20your%20collection%20and%20would%20like%20more%20information." target="_blank" rel="noopener noreferrer" class="hero__scroll hero-contact-wa" aria-label="Contact Us on WhatsApp">
            <div class="hero__scroll-line" aria-hidden="true"></div>
            <span class="hero__scroll-text">Contact Us</span>
          </a>
        </div>
      `;
      container.appendChild(slideEl);
    });

    applyTheme(SLIDES[0]);
    markActiveNavLink();
    setupControls();
    setupTouch();
    startAutoSlide();
  }

  function startAutoSlide() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      changeSlide((currentIndex + 1) % SLIDES.length);
    }, slideDuration);
  }

  function changeSlide(newIndex) {
    if (newIndex === currentIndex) return;
    const slides = document.querySelectorAll('.hero__slide');
    if (!slides.length) return;

    if (animTimeout) {
      clearTimeout(animTimeout);
      // Clean up previous transition states if interrupted
      slides.forEach(s => {
        s.classList.remove('entering', 'exiting');
        s.removeAttribute('data-dir');
      });
    }

    // Determine simple direction
    let direction = 'next';
    if (newIndex < currentIndex) direction = 'prev';
    if (currentIndex === SLIDES.length - 1 && newIndex === 0) direction = 'next';
    if (currentIndex === 0 && newIndex === SLIDES.length - 1) direction = 'prev';

    // Previous active out
    const oldSlide = slides[currentIndex];
    oldSlide.classList.remove('active');
    oldSlide.classList.add('exiting');
    oldSlide.setAttribute('data-dir', direction);
    
    currentIndex = newIndex;
    const nextSlide = SLIDES[currentIndex];
    const newSlideEl = slides[currentIndex];

    // New active in
    newSlideEl.setAttribute('data-dir', direction);
    newSlideEl.classList.add('active', 'entering');

    // Update global CSS variables for dynamic theme
    applyTheme(nextSlide);

    // Cleanup after animation completes
    animTimeout = setTimeout(() => {
      oldSlide.classList.remove('exiting');
      oldSlide.removeAttribute('data-dir');
      newSlideEl.classList.remove('entering');
      newSlideEl.removeAttribute('data-dir');
      animTimeout = null;
    }, 700); // 700ms exact match with CSS transition
  }

  function setupControls() {
    const prevBtn = document.querySelector('.hero__arrow--prev');
    const nextBtn = document.querySelector('.hero__arrow--next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = SLIDES.length - 1;
        changeSlide(newIndex);
        startAutoSlide(); // Reset interval
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        let newIndex = (currentIndex + 1) % SLIDES.length;
        changeSlide(newIndex);
        startAutoSlide(); // Reset interval
      });
    }
  }

  function setupTouch() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let startX = 0;
    let endX = 0;

    hero.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 50;
      if (startX - endX > threshold) {
        // Swipe left -> Next
        let newIndex = (currentIndex + 1) % SLIDES.length;
        changeSlide(newIndex);
        startAutoSlide();
      } else if (endX - startX > threshold) {
        // Swipe right -> Prev
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = SLIDES.length - 1;
        changeSlide(newIndex);
        startAutoSlide();
      }
    }
  }

  /**
   * Central theme application.
   * One palette drives: hero + header + nav glow + arrows
   */
  function applyTheme(slideConfig) {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', slideConfig.themeBg);
    root.style.setProperty('--theme-surface-light', slideConfig.themeSurfaceLight);
    root.style.setProperty('--theme-surface-dark', slideConfig.themeSurfaceDark);
    root.style.setProperty('--theme-glow-color', slideConfig.themeGlow);
    root.style.setProperty('--theme-glow-strong', slideConfig.themeGlowStrong);
    root.style.setProperty('--theme-accent', slideConfig.themeAccent);
    root.style.setProperty('--theme-brand', slideConfig.themeBrand);
    root.style.setProperty('--theme-text-primary', slideConfig.themeTextPrimary);
    root.style.setProperty('--theme-text-secondary', slideConfig.themeTextSecondary);
    root.style.setProperty('--theme-border', slideConfig.themeBorder);
    // Header-specific tinted backgrounds
    root.style.setProperty('--theme-header-bg', slideConfig.themeHeaderBg);
    root.style.setProperty('--theme-header-gradient', slideConfig.themeHeaderGradient);
  }

  /**
   * Mark the current page's nav link as active
   */
  function markActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav__link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('nav__link--active');
      }
    });
  }

  // Preload first image only to prioritize initial load speed
  function preloadImages() {
    if (SLIDES.length > 0) {
      const img = new Image();
      img.src = SLIDES[0].imageUrl;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      preloadImages();
      initSlider();
    });
  } else {
    preloadImages();
    initSlider();
  }

})();
