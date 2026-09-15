/**
 * MALAIKA FABRICS — Store Rendering
 * =========================================
 * Renders the product grid, handles nav scroll behavior,
 * hero floating petals, and section reveal animations.
 * 
 * Product clicks navigate to product.html?id=... (dedicated page).
 */

(function () {
  'use strict';

  // ── Color Gradient Placeholder ────────────────────────────
  function buildColorPlaceholder(p) {
    const gradient = p.colorGradient || 'linear-gradient(155deg,#ffeaf1,#f08ab3,#c94f7a)';
    const colorName = p.colorName || '';
    const colorHex  = p.colorHex  || '#c94f7a';

    return `
      <div class="product-card__color-placeholder" style="background:${gradient};">
        <!-- Subtle fabric texture overlay -->
        <div class="product-card__color-texture" aria-hidden="true"></div>
        <!-- Blossom ornament -->
        <div class="product-card__color-ornament" aria-hidden="true">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72" opacity="0.22">
            <ellipse cx="40" cy="14" rx="8" ry="16" fill="white" transform="rotate(0 40 40)"/>
            <ellipse cx="40" cy="14" rx="8" ry="16" fill="white" transform="rotate(45 40 40)"/>
            <ellipse cx="40" cy="14" rx="8" ry="16" fill="white" transform="rotate(90 40 40)"/>
            <ellipse cx="40" cy="14" rx="8" ry="16" fill="white" transform="rotate(135 40 40)"/>
            <ellipse cx="40" cy="14" rx="8" ry="16" fill="white" transform="rotate(180 40 40)"/>
            <ellipse cx="40" cy="14" rx="8" ry="16" fill="white" transform="rotate(225 40 40)"/>
            <ellipse cx="40" cy="14" rx="8" ry="16" fill="white" transform="rotate(270 40 40)"/>
            <ellipse cx="40" cy="14" rx="8" ry="16" fill="white" transform="rotate(315 40 40)"/>
            <circle cx="40" cy="40" r="7" fill="white" opacity="0.6"/>
          </svg>
        </div>
        <!-- Color label -->
        <div class="product-card__color-label">
          <span class="product-card__color-label-dot" style="background:${colorHex};"></span>
          <span class="product-card__color-label-text">${colorName}</span>
        </div>
        <!-- Brand watermark -->
        <div class="product-card__color-brand">Malaika Fabrics</div>
      </div>`;
  }

  // ── Render Product Grid ───────────────────────────────────
  async function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const products = await window.mfDB.getProducts();

    if (!products || !products.length) return;

    grid.innerHTML = '';

    products.forEach((product) => {
      const card = buildProductCard(product);
      grid.appendChild(card);
    });
  }

  function buildProductCard(p) {
    const card = document.createElement('article');
    card.className   = 'product-card reveal-on-scroll';
    card.setAttribute('data-product-id', p.id);
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View ${p.name} — ${window.MF_formatPrice(p.price)}`);

    const hasImage = p.image && p.image.length > 0;
    const imgHTML  = hasImage
      ? `<img 
           class="product-card__img" 
           src="${p.image}" 
           alt="${p.name} — ${p.category} by Malaika Fabrics"
           loading="lazy"
           width="400"
           height="533"
         />`
      : buildColorPlaceholder(p);

    const colorSwatchHTML = p.colorName
      ? `<div class="product-card__color-row">
           <span class="product-card__color-dot" style="background:${p.colorHex || '#c94f7a'}"></span>
           <span class="product-card__color-name">${p.colorName}</span>
         </div>`
      : '';

    const badgeHTML = p.badge
      ? `<span class="product-card__badge product-card__badge--${p.badge.toLowerCase()}">${p.badge}</span>`
      : '';

    const priceHTML = p.salePrice
      ? `<span class="product-card__price">${window.MF_formatPrice(p.salePrice)}</span>
         <span class="product-card__price-original">${window.MF_formatPrice(p.price)}</span>
         <span class="product-card__price-badge">${Math.round((1 - p.salePrice / p.price) * 100)}% OFF</span>`
      : `<span class="product-card__price">${window.MF_formatPrice(p.price)}</span>`;

    const tagsHTML = p.tags && p.tags.length
      ? `<div class="product-card__tags">
           ${p.tags.map(t => `<span class="product-card__tag">${t}</span>`).join('')}
         </div>`
      : '';

    card.innerHTML = `
      <a href="product.html?id=${p.id}" class="product-card__img-wrap" aria-label="View ${p.name}">
        ${badgeHTML}
        ${imgHTML}
        <div class="product-card__actions">
          <span class="product-card__quick-view">
            View Details
          </span>
        </div>
      </a>
      <div class="product-card__body">
        <span class="product-card__category">${p.category}</span>
        <a href="product.html?id=${p.id}" class="product-card__name-link">
          <h3 class="product-card__name">${p.name}</h3>
        </a>
        ${colorSwatchHTML}
        <p class="product-card__desc">${p.description}</p>
        <div class="product-card__pricing">${priceHTML}</div>
        ${tagsHTML}
        <button class="product-card__order" data-action="order" aria-label="Order ${p.name}">
          Order Now
        </button>
      </div>
    `;

    // ── Card event listeners ──
    // Click on card body area → open product page
    card.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset?.action;

      if (action === 'order') {
        e.preventDefault();
        e.stopPropagation();
        window.MF_openOrder(p);
      } else if (!e.target.closest('a')) {
        // Navigate to product page for any non-link click
        window.location.href = `product.html?id=${p.id}`;
      }
    });

    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = `product.html?id=${p.id}`;
      }
    });

    return card;
  }

  // Expose buildProductCard for use by other modules (e.g., collectionsCarousel.js)
  window.MF_buildProductCard = buildProductCard;

  // ── Nav Scroll Behavior ───────────────────────────────────
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('nav--scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ── Generalized Scroll Reveal Animation ──────────────────
  function initScrollReveal() {
    const items = document.querySelectorAll('.product-card, .reveal-on-scroll');
    if (!items.length) return;

    // Set initial hidden state
    items.forEach((item, i) => {
      if (item.style.opacity === '1') return; // Already revealed
      item.style.opacity   = '0';
      item.style.transform = 'translateY(28px)';
      const delay = Math.min(i * 80, 600); // Cap delay at 600ms
      item.style.transition = `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    });

    if (!window.IntersectionObserver) {
      // Fallback: just show everything immediately
      items.forEach(item => {
        item.style.opacity   = '1';
        item.style.transform = 'translateY(0)';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );

    items.forEach(item => observer.observe(item));

    // Hard fallback after 1200ms — ensures items never stay invisible
    setTimeout(() => {
      items.forEach(item => {
        item.style.opacity   = '1';
        item.style.transform = 'translateY(0)';
      });
    }, 1200);
  }

  // ── Hero Scroll Handler ───────────────────────────────────
  function initHeroScroll() {
    const scrollIndicator = document.querySelector('.hero__scroll');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', () => {
      document.querySelector('.collection')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ── Smooth reveal on store show ───────────────────────────
  function initStoreReveal() {
    const store = document.getElementById('store');
    if (!store) return;

    const revealObserver = new MutationObserver(() => {
      if (store.classList.contains('store--visible')) {
        setTimeout(initScrollReveal, 400);
        revealObserver.disconnect();
      }
    });

    revealObserver.observe(store, { attributes: true, attributeFilter: ['class'] });

    // Also handle if store is already visible (no intro)
    if (store.classList.contains('store--visible')) {
      setTimeout(initScrollReveal, 100);
    }
  }

  // ── Fast Navigation Transitions ───────────────────────────
  function initFastNavigation() {
    document.querySelectorAll('a.nav__link, a.footer__link').forEach(link => {
      link.addEventListener('click', (e) => {
        // Intercept internal links
        if (link.hostname === window.location.hostname && !link.hash && link.getAttribute('target') !== '_blank') {
          e.preventDefault();
          
          // Set flag so intro doesn't replay on internal navigation
          sessionStorage.setItem('mf_internal_nav', 'true');
          
          // Navigate immediately, no artificial delay or fade out
          window.location.href = link.href;
        }
      });
    });
    
    // Also add a fast fade-in when the page loads internally
    if (sessionStorage.getItem('mf_internal_nav_fade_in')) {
      sessionStorage.removeItem('mf_internal_nav_fade_in');
      document.body.style.opacity = '0';
      requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        document.body.style.opacity = '1';
      });
    }
  }

  // ── Section Header Scroll Reveal ─────────────────────────
  function initSectionReveals() {
    const headers = document.querySelectorAll('.collection__header, .collections-section__header, .top-sellers__header');
    headers.forEach(header => {
      header.classList.add('reveal-on-scroll');
    });
  }

  // ── Main Init ─────────────────────────────────────────────
  function init() {
    renderProducts();
    initNav();
    initHeroScroll();
    initSectionReveals();
    initStoreReveal();
    initFastNavigation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
