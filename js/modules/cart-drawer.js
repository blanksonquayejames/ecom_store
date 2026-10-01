/**
 * 7TH JUNE COMPUTERS - Shopping Cart Drawer & Amazon-Style Mini-Cart Rail
 * - Slide-over full cart drawer with promo codes, quantity manager, shipping tracker
 * - Amazon-style permanently docked right-side mini-cart rail with yellow pill [ − qty + ]
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';
import { openAuthModal } from './auth-modal.js';

export function initCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;

  renderCartDrawerContent();
  initMiniCartRail();

  // Subscribe to state updates
  store.subscribe('cart_updated', () => {
    renderCartDrawerContent();
    renderMiniCartRail();
    updateCartBadges();
    updateEdgeTab();
  });

  store.subscribe('cart_item_added', () => {
    // Only auto-open on desktop — on mobile the user opens it via the cart icon
    if (window.innerWidth >= 992) {
      openMiniCartRail();
    }
  });

  store.subscribe('promo_applied', () => {
    renderCartDrawerContent();
  });

  store.subscribe('currency_changed', () => {
    renderCartDrawerContent();
    renderMiniCartRail();
  });

  // Keep mini-cart rail docked on desktop across page navigation
  store.subscribe('view_changed', () => {
    if (store.state.cart && store.state.cart.length > 0) {
      const railEl = document.getElementById('amazon-mini-cart-rail');
      if (window.innerWidth >= 992) {
        // Desktop: keep rail open across page changes
        if (railEl && !railEl.classList.contains('is-open')) {
          openMiniCartRail();
        } else {
          renderMiniCartRail();
        }
      } else {
        // Mobile: just refresh content, don't auto-open
        renderMiniCartRail();
      }
    }
  });

  // Close drawer buttons
  document.querySelectorAll('.cart-drawer-close').forEach(btn => {
    btn.addEventListener('click', () => ui.toggleDrawer('cart-drawer', false));
  });
}

export function updateCartBadges() {
  const count = store.getCartCount();
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.style.display = 'inline-flex';
      badge.classList.add('badge-bump');
      setTimeout(() => badge.classList.remove('badge-bump'), 300);
    } else {
      badge.style.display = 'none';
    }
  });
}

export function renderCartDrawerContent() {
  const body = document.getElementById('cart-drawer-body');
  const footer = document.getElementById('cart-drawer-footer');
  const countHeader = document.getElementById('cart-drawer-count');

  if (!body || !footer) return;

  const { cart, currency, appliedPromo } = store.state;
  const summary = store.getCartSummary();
  const totalCount = store.getCartCount();

  if (countHeader) {
    countHeader.textContent = `(${totalCount} item${totalCount === 1 ? '' : 's'})`;
  }

  // Empty cart
  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <div class="empty-bag-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <h3>Your Cart is Empty</h3>
        <p>Experience our flagship spatial optics and audiophile acoustics.</p>
        <button class="btn btn-primary" id="cart-empty-explore-btn">
          Explore Flagship Catalog
        </button>
      </div>
    `;

    footer.innerHTML = '';
    footer.style.display = 'none';

    body.querySelector('#cart-empty-explore-btn')?.addEventListener('click', () => {
      ui.toggleDrawer('cart-drawer', false);
      store.setView('catalog');
    });

    return;
  }

  footer.style.display = 'block';

  // Progress Bar for Free Global Express Shipping ($500 threshold)
  const isFree = summary.amountNeededForFreeShipping === 0 || (appliedPromo && appliedPromo.freeShipping);
  const progressBarHtml = `
    <div class="shipping-progress-box">
      <div class="progress-message">
        ${isFree
          ? '<span>🎉 <strong>Complimentary Global Express Courier Unlocked!</strong></span>'
          : `<span>Add <strong>${convertPrice(summary.amountNeededForFreeShipping, currency).formatted}</strong> more for <strong>Free Global Express Shipping</strong></span>`
        }
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${isFree ? 100 : summary.freeShippingProgress}%"></div>
      </div>
    </div>
  `;

  // Item list HTML
  const itemsHtml = `
    <div class="cart-items-list">
      ${cart.map(item => {
        const itemTotal = item.price * item.quantity;
        return `
          <div class="cart-item-card" data-cart-id="${item.id}">
            <div class="cart-item-img-wrap">
              <img src="${item.heroImage}" alt="${item.name}" />
            </div>
            <div class="cart-item-info">
              <h4 class="cart-item-title">${item.name}</h4>
              <div class="cart-item-variants">
                ${item.selectedColor && item.selectedColor !== 'Default' ? `<span class="cart-variant-pill">${item.selectedColor}</span>` : ''}
                ${item.selectedOption ? `<span class="cart-variant-pill">${item.selectedOption}</span>` : ''}
              </div>
              <div class="cart-item-price-row">
                <span class="cart-unit-price">${convertPrice(item.price, currency).formatted}</span>
                <span class="cart-line-total">${convertPrice(itemTotal, currency).formatted}</span>
              </div>
              <div class="cart-item-actions-row">
                <div class="cart-qty-spinner">
                  <button class="cart-qty-btn cart-qty-minus" data-id="${item.id}">-</button>
                  <span class="cart-qty-number">${item.quantity}</span>
                  <button class="cart-qty-btn cart-qty-plus" data-id="${item.id}">+</button>
                </div>
                <button class="cart-remove-btn" data-id="${item.id}" title="Remove item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  Remove
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  body.innerHTML = progressBarHtml + itemsHtml;

  // Footer breakdown & checkout button
  footer.innerHTML = `
    <!-- Promo Code Box -->
    <div class="drawer-promo-box">
      ${appliedPromo ? `
        <div class="promo-active-chip">
          <div class="promo-active-text">
            <strong>${appliedPromo.code}</strong> (${appliedPromo.description})
          </div>
          <button class="promo-remove-btn" id="drawer-remove-promo">&times;</button>
        </div>
      ` : `
        <div class="promo-input-group">
          <input type="text" class="custom-input custom-input-sm" id="drawer-promo-input" placeholder="Promo code (e.g. SAVE20)" />
          <button class="btn btn-secondary btn-sm" id="drawer-apply-promo-btn">Apply</button>
        </div>
      `}
    </div>

    <!-- Pricing Breakdown Table -->
    <div class="drawer-summary-breakdown">
      <div class="summary-line">
        <span>Subtotal</span>
        <span>${convertPrice(summary.subtotal, currency).formatted}</span>
      </div>
      ${summary.discount > 0 ? `
        <div class="summary-line line-discount">
          <span>Promo Discount</span>
          <span>-${convertPrice(summary.discount, currency).formatted}</span>
        </div>
      ` : ''}
      <div class="summary-line">
        <span>White Glove Courier</span>
        <span>${summary.shipping === 0 ? '<strong class="text-red">COMPLIMENTARY</strong>' : convertPrice(summary.shipping, currency).formatted}</span>
      </div>
      <div class="summary-line">
        <span>Estimated Duty &amp; Tax (8%)</span>
        <span>${convertPrice(summary.tax, currency).formatted}</span>
      </div>
      <div class="summary-line line-total">
        <span>Total Amount</span>
        <span class="total-number">${convertPrice(summary.total, currency).formatted}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="drawer-footer-actions">
      <button class="btn btn-primary btn-lg w-100" id="drawer-checkout-btn">
        Proceed to Secure Checkout
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
      <button class="btn btn-ghost btn-sm w-100" id="drawer-continue-btn">
        Continue Shopping
      </button>
    </div>
  `;

  attachCartDrawerEvents(body, footer);
}

function attachCartDrawerEvents(body, footer) {
  // Quantity Minus
  body.querySelectorAll('.cart-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const id = btn.dataset.id;
      const item = store.state.cart.find(i => i.id === id);
      if (item) {
        store.updateCartQuantity(id, item.quantity - 1);
      }
    });
  });

  // Quantity Plus
  body.querySelectorAll('.cart-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const id = btn.dataset.id;
      const item = store.state.cart.find(i => i.id === id);
      if (item) {
        store.updateCartQuantity(id, item.quantity + 1);
      }
    });
  });

  // Remove Item with Undo Toast
  body.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const removed = store.removeFromCart(id);
      if (removed) {
        ui.showToast({
          title: 'Item Removed',
          message: `${removed.name} removed from bag.`,
          type: 'info',
          actionText: 'Undo',
          onAction: () => {
            store.addToCart({
              id: removed.productId,
              name: removed.name,
              price: removed.price,
              originalPrice: removed.originalPrice,
              heroImage: removed.heroImage
            }, removed.selectedColor, removed.selectedOption, removed.quantity);
          }
        });
      }
    });
  });

  // Apply Promo
  const promoInput = footer.querySelector('#drawer-promo-input');
  const promoBtn = footer.querySelector('#drawer-apply-promo-btn');
  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim();
      if (!code) return;
      const res = store.applyPromo(code);
      if (res.success) {
        ui.showToast({
          title: 'Promo Applied!',
          message: `${res.promo.description} discount activated.`,
          type: 'success'
        });
      } else {
        ui.showToast({
          title: 'Invalid Promo Code',
          message: res.message,
          type: 'error'
        });
      }
    });
  }

  // Remove Promo
  footer.querySelector('#drawer-remove-promo')?.addEventListener('click', () => {
    store.removePromo();
    ui.showToast({ title: 'Promo Code Removed', message: 'Standard pricing restored.', type: 'info' });
  });

  // Checkout Button
  footer.querySelector('#drawer-checkout-btn')?.addEventListener('click', () => {
    sounds.playClick();
    const isLoggedIn = !!(store.state.user && store.state.user.isLoggedIn);
    if (!isLoggedIn) {
      ui.toggleDrawer('cart-drawer', false);
      ui.showToast({
        title: 'Sign In Required',
        message: 'Please sign in or create an account to proceed to checkout.',
        type: 'info'
      });
      openAuthModal('login', {
        redirectTo: 'checkout',
        notice: '<strong>Sign In Required:</strong> Please sign in or create an account to proceed with checkout.'
      });
      return;
    }
    ui.toggleDrawer('cart-drawer', false);
    store.setView('checkout');
  });

  // Continue Shopping
  footer.querySelector('#drawer-continue-btn')?.addEventListener('click', () => {
    ui.toggleDrawer('cart-drawer', false);
  });
}

// ============================================================================
// AMAZON-STYLE RIGHT DOCKED MINI-CART RAIL
// Permanently visible at the right side of every page when cart has items
// ============================================================================

export function initMiniCartRail() {
  // Ensure the rail element exists in DOM
  let railEl = document.getElementById('amazon-mini-cart-rail');
  if (!railEl) {
    railEl = document.createElement('aside');
    railEl.id = 'amazon-mini-cart-rail';
    railEl.className = 'amazon-mini-cart-rail';
    railEl.setAttribute('aria-label', 'Quick Shopping Cart');
    railEl.innerHTML = `
      <div class="mini-cart-rail-header">
        <button class="mini-cart-rail-close" id="mini-cart-rail-close" aria-label="Close cart panel" title="Close">&times;</button>
        <div class="mini-cart-subtotal-caption">Subtotal</div>
        <div class="mini-cart-subtotal-price" id="mini-cart-subtotal-price">GHS 0.00</div>
        <button class="mini-cart-goto-btn" id="mini-cart-goto-btn">Go to Cart</button>
      </div>
      <div class="mini-cart-rail-divider"></div>
      <div class="mini-cart-items-scroll" id="mini-cart-items-scroll"></div>
    `;
    document.body.appendChild(railEl);
  }

  // Ensure edge tab exists
  let edgeTab = document.getElementById('mini-cart-edge-tab');
  if (!edgeTab) {
    edgeTab = document.createElement('button');
    edgeTab.id = 'mini-cart-edge-tab';
    edgeTab.className = 'mini-cart-edge-tab';
    edgeTab.setAttribute('aria-label', 'Open mini cart');
    edgeTab.title = 'Open Cart';
    edgeTab.innerHTML = `
      <span class="mini-cart-edge-tab-icon">🛒</span>
      <span class="mini-cart-edge-tab-count" id="mini-cart-edge-tab-count">0</span>
    `;
    document.body.appendChild(edgeTab);
  }

  // Bind close button
  document.getElementById('mini-cart-rail-close')?.addEventListener('click', () => {
    sounds.playClick();
    closeMiniCartRail();
  });

  // Bind "Go to Cart" button — opens the full Cart Page view
  document.getElementById('mini-cart-goto-btn')?.addEventListener('click', () => {
    sounds.playClick();
    closeMiniCartRail();
    store.setView('cart');
  });

  // Bind edge tab to re-open rail
  document.getElementById('mini-cart-edge-tab')?.addEventListener('click', () => {
    sounds.playClick();
    openMiniCartRail();
  });

  // Expose globally for external callers (pdp-view.js, catalog-view.js etc.)
  window.openMiniCartRail = openMiniCartRail;
  window.closeMiniCartRail = closeMiniCartRail;
  window.renderMiniCartRail = renderMiniCartRail;

  // On page load: auto-open on desktop only — mobile requires explicit tap on cart icon
  if (store.state.cart && store.state.cart.length > 0 && window.innerWidth >= 992) {
    openMiniCartRail();
  } else {
    renderMiniCartRail();
  }
}

export function openMiniCartRail() {
  const railEl = document.getElementById('amazon-mini-cart-rail');
  const edgeTab = document.getElementById('mini-cart-edge-tab');
  if (!railEl) return;

  renderMiniCartRail();
  railEl.classList.add('is-open');
  document.body.classList.add('has-cart-rail');

  // Hide edge tab when rail is open
  if (edgeTab) {
    edgeTab.classList.remove('is-visible');
  }
}

export function closeMiniCartRail() {
  const railEl = document.getElementById('amazon-mini-cart-rail');
  const edgeTab = document.getElementById('mini-cart-edge-tab');

  if (railEl) railEl.classList.remove('is-open');
  document.body.classList.remove('has-cart-rail');

  // Show edge tab with count when rail is closed and cart has items
  const count = store.getCartCount();
  if (edgeTab) {
    if (count > 0) {
      edgeTab.classList.add('is-visible');
      const countEl = document.getElementById('mini-cart-edge-tab-count');
      if (countEl) countEl.textContent = count;
    } else {
      edgeTab.classList.remove('is-visible');
    }
  }
}

function updateEdgeTab() {
  const railEl = document.getElementById('amazon-mini-cart-rail');
  const edgeTab = document.getElementById('mini-cart-edge-tab');
  const count = store.getCartCount();

  // If cart becomes empty, close rail and hide edge tab
  if (count === 0) {
    if (railEl) railEl.classList.remove('is-open');
    document.body.classList.remove('has-cart-rail');
    if (edgeTab) edgeTab.classList.remove('is-visible');
    return;
  }

  // Update edge tab count if visible
  if (edgeTab && edgeTab.classList.contains('is-visible')) {
    const countEl = document.getElementById('mini-cart-edge-tab-count');
    if (countEl) countEl.textContent = count;
  }
}

export function renderMiniCartRail() {
  const subtotalEl = document.getElementById('mini-cart-subtotal-price');
  const listEl = document.getElementById('mini-cart-items-scroll');
  if (!subtotalEl || !listEl) return;

  const { cart, currency } = store.state;
  const subtotal = store.getCartSubtotal();
  subtotalEl.textContent = convertPrice(subtotal, currency).formatted;

  if (!cart || cart.length === 0) {
    listEl.innerHTML = `
      <div class="mini-cart-empty">
        <span class="mini-cart-empty-icon">🛒</span>
        <p>Your cart is empty</p>
      </div>
    `;
    return;
  }

  // Render items — most recently added first
  const itemsHtml = [...cart].reverse().map(item => {
    const priceFormatted = convertPrice(item.price, currency).formatted;
    return `
      <div class="mini-cart-item-card" data-cart-id="${item.id}">
        <div class="mini-cart-item-img-wrap" data-nav-product="${item.productId}" title="View ${item.name}">
          <img src="${item.heroImage}" alt="${item.name}" class="mini-cart-item-img" loading="lazy" />
        </div>
        <div class="mini-cart-item-price">${priceFormatted}</div>
        <div class="mini-cart-yellow-pill">
          <button class="mini-pill-btn mini-pill-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="mini-pill-qty">${item.quantity}</span>
          <button class="mini-pill-btn mini-pill-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
    `;
  }).join('');

  listEl.innerHTML = itemsHtml;

  // Bind + buttons
  listEl.querySelectorAll('.mini-pill-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playClick();
      const itemId = btn.dataset.id;
      const targetItem = store.state.cart.find(i => i.id === itemId);
      if (targetItem) {
        store.updateCartQuantity(targetItem.id, targetItem.quantity + 1);
      }
    });
  });

  // Bind − buttons
  listEl.querySelectorAll('.mini-pill-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playClick();
      const itemId = btn.dataset.id;
      const targetItem = store.state.cart.find(i => i.id === itemId);
      if (targetItem) {
        if (targetItem.quantity > 1) {
          store.updateCartQuantity(targetItem.id, targetItem.quantity - 1);
        } else {
          // Remove item when quantity reaches 0
          store.removeFromCart(targetItem.id);
        }
      }
    });
  });

  // Clicking product thumbnail navigates to PDP
  listEl.querySelectorAll('[data-nav-product]').forEach(el => {
    el.addEventListener('click', () => {
      sounds.playClick();
      const prodId = el.dataset.navProduct;
      if (prodId) {
        closeMiniCartRail();
        store.setView('pdp', prodId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}
