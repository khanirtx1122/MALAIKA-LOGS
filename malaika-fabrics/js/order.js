/**
 * MALAIKA FABRICS — Order Form & WhatsApp Redirect
 * =================================================
 * Handles the order form overlay, form validation,
 * and generates a WhatsApp pre-filled message redirect.
 * 
 * WhatsApp number is read from window.MF_CONFIG.WHATSAPP_NUMBER
 * — never hardcoded in this file.
 */

(function () {
  'use strict';

  let orderProduct = null;

  // ── Helpers ───────────────────────────────────────────────
  function getOverlay() {
    return document.getElementById('order-overlay');
  }

  // ── Open Order Overlay ────────────────────────────────────
  function openOrder(product) {
    orderProduct = product;
    const overlay = getOverlay();
    if (!overlay) return;

    populateOrderPanel(overlay, product);
    overlay.classList.add('order--open');
    document.body.style.overflow = 'hidden';

    // Focus first input
    setTimeout(() => {
      overlay.querySelector('#order-name')?.focus();
    }, 350);
  }

  // ── Close Order Overlay ───────────────────────────────────
  function closeOrder() {
    const overlay = getOverlay();
    if (!overlay) return;
    overlay.classList.remove('order--open');
    document.body.style.overflow = '';
    orderProduct = null;
  }

  // ── Populate Panel ────────────────────────────────────────
  function populateOrderPanel(overlay, p) {
    const panel = overlay.querySelector('.order-panel');
    if (!panel) return;

    const displayPrice = p.salePrice ?? p.price;

    panel.innerHTML = `
      <!-- Header -->
      <div class="order-panel__header">
        <button class="order-panel__close" id="order-close-btn" aria-label="Close order form">×</button>
        <p class="order-panel__label">Place Your Order</p>
        <h2 class="order-panel__title">Order Details</h2>
      </div>

      <!-- Product Summary -->
      <div class="order-product-summary">
        <div class="order-product-summary__img">
          ${p.image
            ? `<img src="${p.image}" alt="${p.name}" width="68" height="68" />`
            : ''
          }
        </div>
        <div class="order-product-summary__info">
          <p class="order-product-summary__name">${p.name}</p>
          <p class="order-product-summary__price">${window.MF_formatPrice(displayPrice)}</p>
          <p class="order-product-summary__sub">${p.category} · 3-Piece Suit</p>
        </div>
      </div>

      <!-- Form -->
      <form class="order-form" id="order-form" novalidate>
        <!-- Name -->
        <div class="order-form__group">
          <label class="order-form__label" for="order-name">Full Name *</label>
          <input 
            class="order-form__input" 
            type="text" 
            id="order-name" 
            name="name"
            placeholder="Enter your full name"
            autocomplete="name"
            required
          />
          <span class="order-form__error" id="order-name-err">Please enter your full name.</span>
        </div>

        <!-- Phone -->
        <div class="order-form__group">
          <label class="order-form__label" for="order-phone">Phone Number *</label>
          <input 
            class="order-form__input" 
            type="tel" 
            id="order-phone" 
            name="phone"
            placeholder="e.g. 0300 123 4567"
            autocomplete="tel"
            required
          />
          <span class="order-form__error" id="order-phone-err">Please enter a valid phone number.</span>
        </div>

        <!-- Email -->
        <div class="order-form__group">
          <label class="order-form__label" for="order-email">Email Address *</label>
          <input 
            class="order-form__input" 
            type="email" 
            id="order-email" 
            name="email"
            placeholder="your@email.com"
            autocomplete="email"
            required
          />
          <span class="order-form__error" id="order-email-err">Please enter a valid email address.</span>
        </div>

        <!-- Payment Method -->
        <div class="order-form__group">
          <label class="order-form__label">Payment Method</label>
          <div class="order-form__payment">
            <div class="order-form__payment-icon">💳</div>
            <div class="order-form__payment-text">
              <span class="order-form__payment-label">Cash on Delivery</span>
              <span class="order-form__payment-sub">Pay when your order arrives</span>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <button 
          type="submit" 
          class="order-form__submit" 
          id="order-submit-btn"
        >
          <span>📱</span>
          <span>Order via WhatsApp</span>
        </button>

        <!-- WhatsApp note -->
        <p class="order-form__wa-note">
          <span class="order-form__wa-icon">✓</span>
          Your order details will be pre-filled in WhatsApp
        </p>
      </form>
    `;

    // Attach events
    overlay.querySelector('#order-close-btn')?.addEventListener('click', closeOrder);
    overlay.querySelector('#order-form')?.addEventListener('submit', handleSubmit);
  }

  // ── Form Validation ───────────────────────────────────────
  function validateForm(form) {
    let valid = true;

    // Name
    const name = form.querySelector('#order-name');
    const nameErr = form.querySelector('#order-name-err');
    if (!name.value.trim() || name.value.trim().length < 2) {
      name.classList.add('order-form__input--error');
      nameErr.classList.add('visible');
      valid = false;
    } else {
      name.classList.remove('order-form__input--error');
      nameErr.classList.remove('visible');
    }

    // Phone
    const phone = form.querySelector('#order-phone');
    const phoneErr = form.querySelector('#order-phone-err');
    const phoneClean = phone.value.replace(/[\s\-\(\)]/g, '');
    if (!phoneClean || phoneClean.length < 7) {
      phone.classList.add('order-form__input--error');
      phoneErr.classList.add('visible');
      valid = false;
    } else {
      phone.classList.remove('order-form__input--error');
      phoneErr.classList.remove('visible');
    }

    // Email
    const email = form.querySelector('#order-email');
    const emailErr = form.querySelector('#order-email-err');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRe.test(email.value.trim())) {
      email.classList.add('order-form__input--error');
      emailErr.classList.add('visible');
      valid = false;
    } else {
      email.classList.remove('order-form__input--error');
      emailErr.classList.remove('visible');
    }

    return valid;
  }

  // ── Handle Submit ─────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    if (!validateForm(form)) return;

    const name  = form.querySelector('#order-name').value.trim();
    const phone = form.querySelector('#order-phone').value.trim();
    const email = form.querySelector('#order-email').value.trim();

    redirectToWhatsApp({ name, phone, email });
  }

  // ── Build WhatsApp Message ────────────────────────────────
  function buildWhatsAppMessage(customerData, product) {
    const { name, phone, email } = customerData;
    const displayPrice = product.salePrice ?? product.price;
    const priceFormatted = window.MF_formatPrice(displayPrice);

    const lines = [
      `🛍️ *New Order — Malaika Fabrics*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `*🧣 Product Details*`,
      `• Name: ${product.name}`,
      `• Category: ${product.category}`,
      `• Price: ${priceFormatted}`,
      `• Includes: ${product.includes || '3-Piece Suit'}`,
      ``,
    ];

    // Include image URL if available
    if (product.image && product.image.startsWith('http')) {
      lines.push(`• Image: ${product.image}`);
      lines.push(``);
    }

    lines.push(
      `*👤 Customer Details*`,
      `• Name: ${name}`,
      `• Phone: ${phone}`,
      `• Email: ${email}`,
      ``,
      `*💳 Payment Method*`,
      `• Cash on Delivery (COD)`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━`,
      `_Order placed via Malaika Fabrics website_`,
    );

    return lines.join('\n');
  }

  // ── WhatsApp Redirect ─────────────────────────────────────
  function redirectToWhatsApp(customerData) {
    const config = window.MF_CONFIG;
    const number = config?.WHATSAPP_NUMBER;

    if (!number) {
      console.error('MF: WhatsApp number not configured in js/config.js');
      alert('Order configuration error. Please contact the store directly.');
      return;
    }

    const message = buildWhatsAppMessage(customerData, orderProduct);
    const encoded = encodeURIComponent(message);
    const waUrl   = `https://wa.me/${number}?text=${encoded}`;

    // Disable submit button to prevent double-tap
    const submitBtn = document.getElementById('order-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Redirecting...';
    }

    // Small delay for UX — then redirect
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      closeOrder();
    }, 400);
  }

  // ── Backdrop click & Escape ───────────────────────────────
  function initEventListeners() {
    const overlay = getOverlay();
    if (!overlay) return;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOrder();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeOrder();
    });

    // Live validation on blur
    overlay.addEventListener('blur', (e) => {
      const input = e.target.closest('.order-form__input');
      if (input) {
        const form = input.closest('#order-form');
        if (form) validateForm(form);
      }
    }, true);
  }

  // ── Expose globally ───────────────────────────────────────
  window.MF_openOrder  = openOrder;
  window.MF_closeOrder = closeOrder;

  // ── Init ──────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventListeners);
  } else {
    initEventListeners();
  }
})();
