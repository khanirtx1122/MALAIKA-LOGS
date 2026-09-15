/**
 * MALAIKA FABRICS — Product Detail Modal
 * =========================================
 * Opens a premium two-column product detail modal.
 * Exposes window.MF_openModal(product) globally.
 */

(function () {
  'use strict';

  let currentProduct = null;

  // ── Get / Create modal backdrop ──────────────────────────
  function getBackdrop() {
    return document.getElementById('product-modal-backdrop');
  }

  // ── Modal Color Placeholder ──────────────────────────────
  function buildModalColorPlaceholder(p) {
    const gradient = p.colorGradient || 'linear-gradient(155deg,#ffeaf1,#f08ab3,#c94f7a)';
    const colorName = p.colorName || p.name;
    const colorHex  = p.colorHex  || '#c94f7a';
    return `
      <div class="modal__color-placeholder" style="background:${gradient};">
        <div class="product-card__color-texture" aria-hidden="true"></div>
        <div class="modal__color-ornament" aria-hidden="true">
          <svg viewBox="0 0 100 100" fill="none" width="100" height="100" opacity="0.2">
            <ellipse cx="50" cy="16" rx="10" ry="20" fill="white" transform="rotate(0 50 50)"/>
            <ellipse cx="50" cy="16" rx="10" ry="20" fill="white" transform="rotate(45 50 50)"/>
            <ellipse cx="50" cy="16" rx="10" ry="20" fill="white" transform="rotate(90 50 50)"/>
            <ellipse cx="50" cy="16" rx="10" ry="20" fill="white" transform="rotate(135 50 50)"/>
            <ellipse cx="50" cy="16" rx="10" ry="20" fill="white" transform="rotate(180 50 50)"/>
            <ellipse cx="50" cy="16" rx="10" ry="20" fill="white" transform="rotate(225 50 50)"/>
            <ellipse cx="50" cy="16" rx="10" ry="20" fill="white" transform="rotate(270 50 50)"/>
            <ellipse cx="50" cy="16" rx="10" ry="20" fill="white" transform="rotate(315 50 50)"/>
            <circle cx="50" cy="50" r="9" fill="white" opacity="0.7"/>
          </svg>
        </div>
        <div class="product-card__color-label">
          <span class="product-card__color-label-dot" style="background:${colorHex};"></span>
          <span class="product-card__color-label-text">${colorName}</span>
        </div>
        <div class="product-card__color-brand">Malaika Fabrics</div>
      </div>`;
  }

  // ── Open Modal ────────────────────────────────────────────
  function openModal(product) {
    currentProduct = product;
    const backdrop = getBackdrop();
    if (!backdrop) return;

    // Populate
    populateModal(backdrop, product);

    // Show
    backdrop.classList.add('modal--open');
    document.body.style.overflow = 'hidden';

    // Focus close button
    setTimeout(() => {
      backdrop.querySelector('.modal__close')?.focus();
    }, 350);
  }

  // ── Close Modal ───────────────────────────────────────────
  function closeModal() {
    const backdrop = getBackdrop();
    if (!backdrop) return;
    backdrop.classList.remove('modal--open');
    document.body.style.overflow = '';
    currentProduct = null;
  }

  // ── Populate ──────────────────────────────────────────────
  function populateModal(backdrop, p) {
    const modal = backdrop.querySelector('.modal');
    if (!modal) return;

    const displayPrice = p.salePrice ?? p.price;
    const formattedPrice = window.MF_formatPrice(displayPrice);
    const formattedOriginal = p.salePrice ? window.MF_formatPrice(p.price) : null;

    const priceHTML = formattedOriginal
      ? `<span class="modal__price">${formattedPrice}</span>
         <span class="modal__price-original">${formattedOriginal}</span>`
      : `<span class="modal__price">${formattedPrice}</span>`;

    const details = [
      { key: 'Fabric',      val: p.fabric    },
      { key: 'Embroidery',  val: p.embroidery },
      { key: 'Occasion',    val: p.occasion   },
      { key: 'Includes',    val: p.includes   },
    ].filter(d => d.val);

    const detailsHTML = details.length
      ? `<div class="modal__details">
           ${details.map(d =>
             `<div class="modal__detail-row">
               <span class="modal__detail-key">${d.key}</span>
               <span class="modal__detail-val">${d.val}</span>
             </div>`
           ).join('')}
         </div>`
      : '';

    const imageHTML = p.image
      ? `<img 
           class="modal__image" 
           src="${p.image}" 
           alt="${p.name} — Malaika Fabrics"
           width="480"
           height="640"
         />`
      : buildModalColorPlaceholder(p);

    modal.innerHTML = `
      <div class="modal__image-section">
        <button class="modal__close" id="modal-close-btn" aria-label="Close product details">&times;</button>
        ${imageHTML}
      </div>
      <div class="modal__info">
        <div>
          <p class="modal__brand-label">Malaika Fabrics</p>
          <h2 class="modal__name">${p.name}</h2>
        </div>
        <div class="modal__pricing">${priceHTML}</div>
        <div class="modal__divider"></div>
        <div>
          <p class="modal__desc-label">About This Piece</p>
          <p class="modal__desc">${p.description}</p>
        </div>
        ${detailsHTML}
        <div class="modal__divider"></div>
        <div class="modal__cta">
          <button class="btn-primary" id="modal-order-btn" aria-label="Order ${p.name} now">
            Order Now
          </button>
          <p class="modal__whatsapp-note">
            <span class="modal__wa-icon">&#9654;</span>
            You'll be connected via WhatsApp to confirm your order
          </p>
        </div>
      </div>
    `;

    // Close listeners
    backdrop.querySelector('#modal-close-btn')?.addEventListener('click', closeModal);
    backdrop.querySelector('#modal-order-btn')?.addEventListener('click', () => {
      closeModal();
      window.MF_openOrder(p);
    });
  }

  // ── Backdrop click + Escape key ───────────────────────────
  function initEventListeners() {
    const backdrop = getBackdrop();
    if (!backdrop) return;

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ── Expose globally ───────────────────────────────────────
  window.MF_openModal  = openModal;
  window.MF_closeModal = closeModal;

  // ── Init ──────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventListeners);
  } else {
    initEventListeners();
  }
})();
