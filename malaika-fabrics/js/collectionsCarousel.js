/**
 * MALAIKA FABRICS — Collections Carousel
 * =========================================
 * Renders circular collection thumbnails from MF_COLLECTIONS.
 * Implements infinite auto-scroll with pause-on-hover.
 * Also renders the collections page grid dynamically.
 */

(function () {
  'use strict';

  // ── Render Home Page Carousel ────────────────────────────
  async function renderCarousel() {
    const track = document.getElementById('collections-track');
    if (!track) return;

    const collections = await window.mfDB.getCollections();
    if (!collections || !collections.length) return;

    // Build items twice for seamless infinite loop
    const itemsHTML = collections.map(col => buildCircleItem(col)).join('');
    track.innerHTML = itemsHTML + itemsHTML;

    // Calculate animation duration based on item count
    const totalWidth = collections.length * 160; // approx width per item
    const duration = Math.max(25, collections.length * 6); // ~6s per item, min 25s
    track.style.animationDuration = `${duration}s`;

    // Setup touch/swipe interaction
    setupTouchScroll(track.parentElement);
  }

  function buildCircleItem(col) {
    return `
      <a class="collection-circle" href="collections.html?col=${col.slug}" 
         aria-label="Browse ${col.name}">
        <div class="collection-circle__img-wrap">
          <img class="collection-circle__img" 
               src="${col.image}" 
               alt="${col.name}" 
               loading="lazy"
               width="130" height="130" />
        </div>
        <span class="collection-circle__name">${col.name}</span>
      </a>
    `;
  }

  // ── Touch/Swipe Support ──────────────────────────────────
  function setupTouchScroll(carousel) {
    if (!carousel) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const track = carousel.querySelector('.collections-track');
    if (!track) return;

    carousel.addEventListener('touchstart', (e) => {
      track.style.animationPlayState = 'paused';
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      setTimeout(() => {
        track.style.animationPlayState = 'running';
      }, 2000); // Resume after 2s of no touch
    }, { passive: true });

    // Mouse drag for desktop
    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX;
      track.style.animationPlayState = 'paused';
      carousel.style.cursor = 'grabbing';
    });

    carousel.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        carousel.style.cursor = '';
        setTimeout(() => {
          track.style.animationPlayState = 'running';
        }, 1500);
      }
    });

    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.style.cursor = '';
      setTimeout(() => {
        track.style.animationPlayState = 'running';
      }, 1500);
    });
  }

  // ── Render Collections Page Grid ─────────────────────────
  async function renderCollectionsList() {
    const grid = document.getElementById('collections-grid');
    if (!grid) return;

    const collections = await window.mfDB.getCollections();
    if (!collections || !collections.length) return;

    const allProducts = await window.mfDB.getProducts();

    grid.innerHTML = '';

    collections.forEach(col => {
      const filter = col.product_filter || col.productFilter;
      let products = allProducts;
      if (filter) {
        products = allProducts.filter(p => {
          for (const [key, val] of Object.entries(filter)) {
            if (key === 'tags') {
              if (!p.tags || !p.tags.some(t => t.toLowerCase().includes(val.toLowerCase()))) return false;
            } else if (key === 'occasion') {
              if (!p.occasion || !p.occasion.toLowerCase().includes(val.toLowerCase())) return false;
            } else if (key === 'embroidery') {
              if (val === true && !p.embroidery) return false;
            } else {
              if (p[key] !== val) return false;
            }
          }
          return true;
        });
      }

      const card = document.createElement('a');
      card.className = 'collection-card reveal-on-scroll';
      card.href = `collections.html?col=${col.slug}`;

      card.innerHTML = `
        <div class="collection-card__img-wrap">
          <img class="collection-card__img" 
               src="${col.image}" 
               alt="${col.name}" 
               loading="lazy"
               width="400" height="300" />
        </div>
        <div class="collection-card__body">
          <h3 class="collection-card__name">${col.name}</h3>
          <p class="collection-card__count">${products.length} Product${products.length !== 1 ? 's' : ''}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // ── Render Collections Page Grid ───────────────────────────
  async function renderCollectionsGrid() {
    const productsSection = document.getElementById('collection-products');
    if (!productsSection) return;

    const urlParams = new URLSearchParams(window.location.search);
    const colSlug = urlParams.get('col');
    if (!colSlug) return;

    const collections = await window.mfDB.getCollections();
    const collection = collections.find(c => c.slug === colSlug);
    if (!collection) return;

    const allProducts = await window.mfDB.getProducts();
    const filter = collection.product_filter;
    
    let products = allProducts;
    if (filter) {
      products = allProducts.filter(p => {
        for (const [key, val] of Object.entries(filter)) {
          if (key === 'tags') {
            if (!p.tags || !p.tags.some(t => t.toLowerCase().includes(val.toLowerCase()))) return false;
          } else if (key === 'occasion') {
            if (!p.occasion || !p.occasion.toLowerCase().includes(val.toLowerCase())) return false;
          } else if (key === 'embroidery') {
            if (val === true && !p.embroidery) return false;
          } else {
            if (p[key] !== val) return false;
          }
        }
        return true;
      });
    }

    // Update page header
    const headerTitle = document.querySelector('.collection-page__title');
    const headerSubtitle = document.querySelector('.collection-page__subtitle');
    if (headerTitle) headerTitle.textContent = collection.name;
    if (headerSubtitle) headerSubtitle.textContent = collection.description;

    if (!products.length) {
      productsSection.innerHTML = `
        <p style="text-align: center; color: var(--gray-400); padding: var(--space-2xl);">
          No products found in this collection yet.
        </p>
      `;
      return;
    }

    productsSection.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'product-grid';
    grid.setAttribute('role', 'list');

    products.forEach(product => {
      // Reuse the existing card builder from store.js if available
      if (window.MF_buildProductCard) {
        grid.appendChild(window.MF_buildProductCard(product));
      } else {
        // Fallback: simple card
        const card = document.createElement('article');
        card.className = 'product-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `
          <div class="product-card__img-wrap">
            <img class="product-card__img" src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>
          <div class="product-card__body">
            <h3 class="product-card__name">${product.name}</h3>
            <div class="product-card__pricing">
              <span class="product-card__price">${window.MF_formatPrice(product.salePrice || product.price)}</span>
            </div>
          </div>
        `;
        card.addEventListener('click', () => {
          window.location.href = `product.html?id=${product.id}`;
        });
        grid.appendChild(card);
      }
    });

    productsSection.appendChild(grid);
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    renderCarousel();
    renderCollectionsList();
    renderCollectionsGrid();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
