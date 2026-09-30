/**
 * 7th JUNE COMPUTERS - Cart Icon & Dynamic Button Controller
 * Professional e-commerce cart state management and statements:
 * - Unadded State: Black Shopping Cart Icon (+) with "Add to Cart" statement
 * - In-Cart State: Emerald Green Cart Icon (✓) with "In Cart" / "In Cart (qty)" statement
 * - Real-time reactive sync across catalog cards, PDP, sticky bar, and modals
 */

import { store } from './state.js';

let iconCounter = 0;

/**
 * Returns SVG for the Black Shopping Cart Icon with Plus (+) Badge
 * Shown when product is NOT added to cart.
 */
export function getCartBlackSvg(uniqueId = '', size = 20) {
  const uid = uniqueId || `b-${++iconCounter}`;
  const maskId = `cart-mask-black-${uid}`;

  return `
    <svg class="cart-icon cart-icon-black" viewBox="0 0 100 100" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
      <defs>
        <mask id="${maskId}">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <circle cx="58" cy="27" r="22" fill="black" />
        </mask>
      </defs>
      <!-- Cart Body with Cutout Gap for Badge -->
      <g mask="url(#${maskId})">
        <path d="M 18 20 L 25 58 C 25.5 61 27.5 63 30.5 63 L 83 63 C 86 63 88 61 88.5 58 L 95 20 Z" fill="#000000" />
        <path d="M 4 8 L 15 8 C 17 8 18.5 9.3 19 11.2 L 25 45" stroke="#000000" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <!-- Lower Chassis Runner -->
      <path d="M 23 59 C 18.5 59 16.5 63 16.5 67 C 16.5 71.5 19.5 73.5 24 73.5 L 89 73.5" stroke="#000000" stroke-width="5.5" stroke-linecap="round" fill="none" />
      <!-- Ring Wheels (Hollow Center as in black icon) -->
      <circle cx="31" cy="85" r="9" stroke="#000000" stroke-width="5" fill="none" />
      <circle cx="81" cy="85" r="9" stroke="#000000" stroke-width="5" fill="none" />
      <!-- Badge Circle -->
      <circle cx="58" cy="27" r="17.5" fill="#000000" />
      <!-- Plus Sign (+) -->
      <path d="M 58 17 L 58 37 M 48 27 L 68 27" stroke="#FFFFFF" stroke-width="4.4" stroke-linecap="round" />
    </svg>
  `.trim();
}

/**
 * Returns SVG for the Green Shopping Cart Icon with Checkmark (✓) Badge
 * Shown when product IS added to cart.
 */
export function getCartGreenSvg(uniqueId = '', size = 20) {
  const uid = uniqueId || `g-${++iconCounter}`;
  const maskId = `cart-mask-green-${uid}`;

  return `
    <svg class="cart-icon cart-icon-green" viewBox="0 0 100 100" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
      <defs>
        <mask id="${maskId}">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <circle cx="58" cy="27" r="22" fill="black" />
        </mask>
      </defs>
      <!-- Cart Body with Cutout Gap for Badge -->
      <g mask="url(#${maskId})">
        <path d="M 18 20 L 25 58 C 25.5 61 27.5 63 30.5 63 L 83 63 C 86 63 88 61 88.5 58 L 95 20 Z" fill="#00C853" />
        <path d="M 4 8 L 15 8 C 17 8 18.5 9.3 19 11.2 L 25 45" stroke="#00C853" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <!-- Lower Chassis Runner -->
      <path d="M 23 59 C 18.5 59 16.5 63 16.5 67 C 16.5 71.5 19.5 73.5 24 73.5 L 89 73.5" stroke="#00C853" stroke-width="5.5" stroke-linecap="round" fill="none" />
      <!-- Solid Wheels as in green icon -->
      <circle cx="31" cy="85" r="9" fill="#00C853" />
      <circle cx="81" cy="85" r="9" fill="#00C853" />
      <!-- Badge Circle -->
      <circle cx="58" cy="27" r="17.5" fill="#00C853" />
      <!-- Checkmark (✓) -->
      <path d="M 47.5 27.5 L 54.5 34.5 L 68.5 19.5" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </svg>
  `.trim();
}

/**
 * Returns either the Black or Green SVG depending on cart state
 */
export function getCartIconSvg(isInCart, uniqueId = '', size = 20) {
  return isInCart ? getCartGreenSvg(uniqueId, size) : getCartBlackSvg(uniqueId, size);
}

/**
 * Computes the total quantity of a product currently in the cart across all color/option variants
 */
export function getProductCartQuantity(productId) {
  if (!store.state.cart || !store.state.cart.length || !productId) return 0;
  return store.state.cart
    .filter(item => item.productId === productId)
    .reduce((sum, item) => sum + (item.quantity || 1), 0);
}

/**
 * Generates the clean, professional e-commerce statement for buttons
 */
export function getCartButtonStatement(isInCart, quantity = 0, format = 'short') {
  if (!isInCart || quantity <= 0) {
    if (format === 'short') {
      return `<span class="btn-text-full">Add to Cart</span><span class="btn-text-short">Add</span>`;
    }
    return `Add to Cart`;
  }

  // When product is in cart:
  const qtySuffix = quantity > 1 ? ` (${quantity})` : '';
  if (format === 'short') {
    return `<span class="btn-text-full">In Cart${qtySuffix}</span><span class="btn-text-short">In Cart${qtySuffix}</span>`;
  }

  return `In Cart${qtySuffix}`;
}

/**
 * Updates a button's icon, statement text, title tooltip, and aria attributes dynamically
 */
export function updateCartButtonElement(button, isInCart = null, format = 'short') {
  if (!button) return;

  const prodId = button.dataset.id || button.dataset.navId || button.id;
  const inCart = isInCart !== null ? isInCart : store.isInCart(prodId);
  const qty = getProductCartQuantity(prodId);

  const iconWrap = button.querySelector('.cart-icon-wrap') || button.querySelector('.btn-card-add-icon') || button.querySelector('.pdp-cart-btn-icon');
  const textEl = button.querySelector('.btn-card-add-text') || button.querySelector('.pdp-cart-btn-text') || button.querySelector('span:not(.cart-icon-wrap):not(.btn-card-add-icon):not(.pdp-cart-btn-icon)');

  button.classList.toggle('is-in-cart', inCart);
  button.classList.toggle('btn-added-state', inCart);

  const iconSize = (format === 'long' || button.id === 'sticky-bar-add-btn' || button.id === 'pdp-add-cart-btn') ? 22 : 20;

  // Update Icon
  if (iconWrap) {
    iconWrap.innerHTML = getCartIconSvg(inCart, prodId, iconSize);
  } else if (!textEl) {
    // Icon-only button (e.g. mobile sticky action bar)
    button.innerHTML = getCartIconSvg(inCart, prodId, 22);
  }

  // Update Professional Statement (clean, no "Add More")
  if (textEl) {
    textEl.innerHTML = getCartButtonStatement(inCart, qty, format);
  }

  // Tooltip & Accessibility Statement
  const prod = store.state.products.find(p => p.id === prodId);
  const prodName = prod ? prod.name : 'item';

  if (!inCart) {
    button.title = `Add ${prodName} to Cart`;
    button.setAttribute('aria-label', `Add ${prodName} to Cart`);
  } else {
    button.title = `${qty} ${prodName} in your cart`;
    button.setAttribute('aria-label', `${prodName} is in cart (${qty})`);
  }
}

/**
 * Globally scans the DOM and syncs all cart buttons to match current store.state.cart
 */
export function syncAllCartButtons() {
  const cartProductIds = new Set((store.state.cart || []).map(item => item.productId));

  // 1. Catalog grid cards and suggested items
  document.querySelectorAll('.btn-card-add, .btn-add-cart, .suggested-add-btn').forEach(btn => {
    const prodId = btn.dataset.id;
    if (prodId) {
      const isIn = cartProductIds.has(prodId);
      updateCartButtonElement(btn, isIn, 'short');
    }
  });

  // 2. Main PDP Add to Cart Button & Quantity Selector
  const pdpAddBtn = document.getElementById('pdp-add-cart-btn');
  const pdpQtyWrap = document.getElementById('pdp-qty-wrap');
  const pdpQtyVal = document.getElementById('pdp-qty-val');
  if (pdpAddBtn) {
    const prodId = pdpAddBtn.dataset.id || store.state.currentProductId;
    if (prodId) {
      const isIn = cartProductIds.has(prodId);
      const qty = getProductCartQuantity(prodId);
      updateCartButtonElement(pdpAddBtn, isIn, 'long');

      // Only show - and + when product is in cart!
      if (pdpQtyWrap) {
        pdpQtyWrap.style.display = isIn ? 'flex' : 'none';
      }
      if (pdpQtyVal && isIn) {
        pdpQtyVal.textContent = qty;
      }
    }
  }

  // 3. PDP Mobile Sticky Bar Button
  const stickyAddBtn = document.getElementById('sticky-bar-add-btn');
  if (stickyAddBtn) {
    const prodId = stickyAddBtn.dataset.id || store.state.currentProductId;
    if (prodId) {
      const isIn = cartProductIds.has(prodId);
      updateCartButtonElement(stickyAddBtn, isIn, 'icon-only');
    }
  }

  // 4. Quick View Modal Button
  const qvBtn = document.getElementById('quick-view-add-btn');
  if (qvBtn) {
    const qvProdId = qvBtn.dataset.id;
    if (qvProdId) {
      const isIn = cartProductIds.has(qvProdId);
      updateCartButtonElement(qvBtn, isIn, 'long');
    }
  }
}

// Automatically subscribe to store cart updates so any change (add/remove/clear) immediately refreshes all icons & statements!
store.subscribe('cart_updated', () => {
  syncAllCartButtons();
});
