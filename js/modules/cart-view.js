/**
 * 7TH JUNE COMPUTERS / ECOM STORE - Full Shopping Cart View Component
 * Modeled after modern e-commerce shopping cart UI:
 * - Breadcrumb Header Banner ("Shopping Cart", Home / Shopping Cart)
 * - Two-Column Layout (Items Table on left with Gold header bar, Order Summary Card on right)
 * - Gold Table Header: Product, Price, Quantity, Subtotal
 * - Item Rows: Delete (×), Product Image + Title + Subtext, Unit Price, Quantity Pill [- Qty +], Subtotal
 * - Order Summary Card: Items count, Sub Total, Shipping, Taxes, Coupon Discount, Promo Code box, Total, Green Checkout CTA
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';

let isCartSubscribed = false;

export function renderCartView(container) {
  if (!container) return;

  // Register state subscriptions once
  if (!isCartSubscribed) {
    isCartSubscribed = true;

    store.subscribe('cart_updated', () => {
      if (store.state.currentView && store.state.currentView.page === 'cart') {
        const mainContainer = document.getElementById('app-main-view');
        if (mainContainer) renderCartView(mainContainer);
      }
    });

    store.subscribe('promo_applied', () => {
      if (store.state.currentView && store.state.currentView.page === 'cart') {
        const mainContainer = document.getElementById('app-main-view');
        if (mainContainer) renderCartView(mainContainer);
      }
    });

    store.subscribe('currency_changed', () => {
      if (store.state.currentView && store.state.currentView.page === 'cart') {
        const mainContainer = document.getElementById('app-main-view');
        if (mainContainer) renderCartView(mainContainer);
      }
    });
  }

  const { cart, currency, appliedPromo } = store.state;
  const summary = store.getCartSummary();
  const totalCount = store.getCartCount();

  // If cart is empty
  if (!cart || cart.length === 0) {
    container.innerHTML = `
      <div class="cart-page-wrapper animate-fade-in">
        <div class="cart-banner">
          <div class="container text-center">
            <h1 class="cart-banner-title">Shopping Cart</h1>
          </div>
        </div>

        <div class="container py-5">
          <div class="cart-empty-card text-center">
            <div class="cart-empty-icon-box">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2 class="cart-empty-title">Your Shopping Cart is Empty</h2>
            <p class="cart-empty-subtitle">Explore our collection and add items to your cart.</p>
            <button class="btn btn-primary btn-lg cart-continue-shopping-btn mt-4" id="empty-cart-shop-btn">
              Explore Hardware Catalog
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#empty-cart-shop-btn')?.addEventListener('click', () => {
      store.setView('catalog');
    });

    return;
  }

  // Cart Has Items Layout
  container.innerHTML = `
    <div class="cart-page-wrapper animate-fade-in">
      <!-- Top Banner -->
      <div class="cart-banner">
        <div class="container text-center">
          <h1 class="cart-banner-title">Shopping Cart</h1>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="container cart-container py-5">
        <div class="cart-page-grid">
          
          <!-- Left Column: Cart Table -->
          <div class="cart-main-content">
            <div class="cart-table-card">
              <!-- Yellow/Gold Header Pill Bar -->
              <div class="cart-table-header">
                <div class="col-head col-product">Product</div>
                <div class="col-head col-price">Price</div>
                <div class="col-head col-qty">Quantity</div>
                <div class="col-head col-subtotal">Subtotal</div>
              </div>

              <!-- Cart Item Rows -->
              <div class="cart-table-body">
                ${cart.map(item => {
                  const itemSubtotal = item.price * item.quantity;
                  const unitPriceFormatted = convertPrice(item.price, currency).formatted;
                  const subtotalFormatted = convertPrice(itemSubtotal, currency).formatted;
                  
                  // Product subtext / variant info
                  let subtext = '';
                  if (item.selectedColor || item.selectedOption) {
                    subtext = [item.selectedColor, item.selectedOption].filter(Boolean).join(' • ');
                  } else if (item.weight) {
                    subtext = item.weight;
                  } else {
                    subtext = '500 g';
                  }

                  return `
                    <div class="cart-table-row" data-cart-id="${item.id}">
                      <!-- Remove Icon -->
                      <button type="button" class="cart-item-remove-btn" data-id="${item.id}" title="Remove item" aria-label="Remove ${item.name}">
                        &times;
                      </button>

                      <!-- Product Image & Title -->
                      <div class="cart-product-cell">
                        <div class="cart-product-img-wrap" data-prod-id="${item.productId || item.id}">
                          <img src="${item.heroImage}" alt="${item.name}" class="cart-product-img" />
                        </div>
                        <div class="cart-product-info">
                          <h3 class="cart-product-title" data-prod-id="${item.productId || item.id}">${item.name}</h3>
                          <span class="cart-product-subtext">${subtext}</span>
                          <span class="cart-unit-price-mobile">${unitPriceFormatted} each</span>
                        </div>
                      </div>

                      <!-- Price -->
                      <div class="cart-price-cell">
                        <span class="cart-unit-price-val">${unitPriceFormatted}</span>
                      </div>

                      <!-- Quantity Pill Box -->
                      <div class="cart-qty-cell">
                        <div class="cart-qty-pill-wrap">
                          <button type="button" class="cart-qty-btn cart-qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                          <span class="cart-qty-value">${item.quantity}</span>
                          <button type="button" class="cart-qty-btn cart-qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                        </div>
                      </div>

                      <!-- Subtotal -->
                      <div class="cart-subtotal-cell">
                        <span class="cart-row-subtotal-val">${subtotalFormatted}</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column: Order Summary Card -->
          <div class="cart-sidebar-content">
            <div class="cart-order-summary-card">
              <h2 class="summary-card-title">Order Summary</h2>
              
              <div class="summary-rows-group">
                <div class="summary-row">
                  <span class="summary-row-label">Items</span>
                  <span class="summary-row-val">${totalCount}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-row-label">Sub Total</span>
                  <span class="summary-row-val">${convertPrice(summary.subtotal, currency).formatted}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-row-label">Shipping</span>
                  <span class="summary-row-val">${summary.shipping === 0 ? '$00.00' : convertPrice(summary.shipping, currency).formatted}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-row-label">Taxes</span>
                  <span class="summary-row-val">${summary.tax === 0 ? '$00.00' : convertPrice(summary.tax, currency).formatted}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-row-label">Coupon Discount</span>
                  <span class="summary-row-val ${summary.discount > 0 ? 'text-discount' : ''}">${summary.discount > 0 ? '-' + convertPrice(summary.discount, currency).formatted : '-$00.00'}</span>
                </div>
              </div>

              <div class="summary-divider"></div>

              <!-- Final Total Row -->
              <div class="summary-row total-row">
                <span class="total-label">Total</span>
                <span class="total-val">${convertPrice(summary.total, currency).formatted}</span>
              </div>

              <!-- Primary Checkout CTA -->
              <button type="button" class="btn cart-checkout-btn cart-checkout-green-btn w-100" id="cart-proceed-checkout-btn">
                Proceed to Checkout
              </button>

              <!-- Continue Shopping CTA -->
              <button type="button" class="btn cart-continue-btn w-100" id="cart-continue-shopping-btn">
                ← Continue Shopping
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  attachCartViewEvents(container);
}

function attachCartViewEvents(container) {
  // Continue shopping button
  container.querySelector('#cart-continue-shopping-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });

  // Quantity Minus
  container.querySelectorAll('.cart-qty-minus').forEach(btn => {
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
  container.querySelectorAll('.cart-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const id = btn.dataset.id;
      const item = store.state.cart.find(i => i.id === id);
      if (item) {
        store.updateCartQuantity(id, item.quantity + 1);
      }
    });
  });

  // Remove Item
  container.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const id = btn.dataset.id;
      const removed = store.removeFromCart(id);
      if (removed) {
        ui.showToast({
          title: 'Item Removed',
          message: `${removed.name} removed from cart.`,
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

  // Product title or image click -> Go to PDP
  container.querySelectorAll('.cart-product-img-wrap, .cart-product-title').forEach(el => {
    el.addEventListener('click', () => {
      const prodId = el.dataset.prodId;
      if (prodId) {
        store.setView('pdp', prodId);
      }
    });
  });



  // Proceed to Checkout
  container.querySelector('#cart-proceed-checkout-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('checkout');
  });
}
