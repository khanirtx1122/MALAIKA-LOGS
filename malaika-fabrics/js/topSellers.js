/**
 * MALAIKA FABRICS — Top Selling Products Section
 * ===============================================
 * Renders top-selling product cards with direct
 * Add to Cart and Buy Now actions on the home page.
 */

(function () {
  'use strict';

  // ── Simple localStorage Cart ─────────────────────────────
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('mf_cart') || '[]');
    } catch { return []; }
  }

  function addToCart(product, qty) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.image,
        qty: qty,
      });
    }
    localStorage.setItem('mf_cart', JSON.stringify(cart));
    showCartToast(`${product.name} added to cart`);
  }

  // ── Toast Notification ───────────────────────────────────
  function showCartToast(message) {
    let toast = document.querySelector('.cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'cart-toast';
      document.body.appendChild(toast);
    }

    toast.textContent = `✓ ${message}`;
    toast.classList.remove('cart-toast--visible');

    // Force reflow
    void toast.offsetWidth;

    toast.classList.add('cart-toast--visible');
    setTimeout(() => {
      toast.classList.remove('cart-toast--visible');
    }, 2500);
  }

  // ── Render Top Sellers Grid ──────────────────────────────
  async function renderTopSellers() {
    const grid = document.getElementById('top-sellers-grid');
    if (!grid) return;

    const allProducts = await window.mfDB.getProducts();
    const products = allProducts.filter(p => p.topSeller === true);
    if (!products.length) {
      // Hide section if no top sellers
      const section = document.getElementById('top-sellers');
      if (section) section.style.display = 'none';
      return;
    }

    grid.innerHTML = '';

    products.forEach((product, index) => {
      const card = buildTopSellerCard(product, index);
      grid.appendChild(card);
    });
  }

  function buildTopSellerCard(p, index) {
    const card = document.createElement('article');
    card.className = 'ts-card reveal-on-scroll';
    card.style.transitionDelay = `${index * 80}ms`;

    const priceHTML = p.salePrice
      ? `<span class="ts-card__price">${window.MF_formatPrice(p.salePrice)}</span>
         <span class="ts-card__price-original">${window.MF_formatPrice(p.price)}</span>
         <span class="ts-card__price-badge">${Math.round((1 - p.salePrice / p.price) * 100)}% OFF</span>`
      : `<span class="ts-card__price">${window.MF_formatPrice(p.price)}</span>`;

    const badgeHTML = `<span class="ts-card__badge">★ Top Seller</span>`;

    card.innerHTML = `
      <div class="ts-card__img-wrap" data-product-id="${p.id}">
        ${badgeHTML}
        <img class="ts-card__img" 
             src="${p.image}" 
             alt="${p.name} — Malaika Fabrics"
             loading="lazy"
             width="400" height="533" />
        <div class="ts-card__overlay">
          <a class="ts-card__view-btn" href="product.html?id=${p.id}">View Details</a>
        </div>
      </div>
      <div class="ts-card__body">
        <h3 class="ts-card__name" data-product-id="${p.id}">${p.name}</h3>
        <div class="ts-card__pricing">${priceHTML}</div>
      </div>
      <div class="ts-card__actions">
        <button class="ts-card__cart-btn" data-action="add-cart" aria-label="Add ${p.name} to cart">
          Add to Cart
        </button>
        <button class="ts-card__buy-btn" data-action="buy-now" aria-label="Buy ${p.name} now">
          Buy Now
        </button>
      </div>
    `;

    // ── Event Listeners ──
    // Image click → product page
    const imgWrap = card.querySelector('.ts-card__img-wrap');
    imgWrap.addEventListener('click', (e) => {
      if (!e.target.closest('.ts-card__view-btn') && !e.target.closest('.ts-card__overlay a')) {
        window.location.href = `product.html?id=${p.id}`;
      }
    });

    // Name click → product page
    const nameEl = card.querySelector('.ts-card__name');
    nameEl.addEventListener('click', () => {
      window.location.href = `product.html?id=${p.id}`;
    });

    // Add to Cart → localStorage
    const cartBtn = card.querySelector('[data-action="add-cart"]');
    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(p, 1);
      
      // Button feedback animation
      cartBtn.textContent = '✓ Added';
      cartBtn.style.borderColor = '#25d366';
      cartBtn.style.color = '#25d366';
      setTimeout(() => {
        cartBtn.textContent = 'Add to Cart';
        cartBtn.style.borderColor = '';
        cartBtn.style.color = '';
      }, 1500);
    });

    // Buy Now → WhatsApp order
    const buyBtn = card.querySelector('[data-action="buy-now"]');
    buyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.MF_openOrder) {
        window.MF_openOrder(p);
      }
    });

    return card;
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    renderTopSellers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
