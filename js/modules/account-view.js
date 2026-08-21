/**
 * 7th JUNE COMPUTERS - Customer Account & Order History Hub
 * User profile, past orders tracking, 7th June Elite loyalty points, and digital receipt inspector.
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { sounds } from './audio.js';
import { ui } from './ui.js';
import { openAuthModal } from './auth-modal.js';

export function renderAccountView(container) {
  const { user, orders, currency } = store.state;

  container.innerHTML = `
    <div class="account-page-wrapper animate-fade-in">
      <div class="container">
        
        <!-- Top Back Navigation -->
        <div class="account-top-nav mb-3">
          <button class="btn btn-ghost btn-sm" id="account-back-shop-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Back to Store</span>
          </button>
        </div>

        <!-- Account Header Card -->
        <div class="account-header-card">
          <div class="account-profile-info">
            <img src="${user.avatar}" alt="${user.name}" class="account-avatar" />
            <div class="account-texts">
              <div class="tier-pill">${user.tier}</div>
              <h1 class="account-name">${user.name}</h1>
              <p class="account-email">${user.email}</p>
              
              <div class="account-user-actions mt-2">
                <button class="btn btn-secondary btn-sm" id="account-switch-btn">
                  Switch / Sign In
                </button>
                <button class="btn btn-ghost btn-sm" id="account-logout-btn">
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <!-- Loyalty Card -->
          <div class="loyalty-card-box">
            <div class="loyalty-card-tag">7TH JUNE VIP REWARDS</div>
            <div class="loyalty-points-number">${user.points.toLocaleString()} <span class="pts-label">PTS</span></div>
            <p class="loyalty-points-sub">Equivalent to ${convertPrice(Math.floor(user.points / 10), currency).formatted} in store credit</p>
            <div class="loyalty-progress-track">
              <div class="loyalty-progress-fill" style="width: 75%;"></div>
            </div>
            <div class="loyalty-tier-status">Next Tier: <strong>Titanium Sovereign VIP (5,000 pts)</strong></div>
          </div>
        </div>

        <!-- Account Navigation Tabs -->
        <div class="account-tabs-nav">
          <button class="account-tab-btn is-active" data-tab="tab-orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Order History (${orders.length})
          </button>
          <button class="account-tab-btn" data-tab="tab-address">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Saved Delivery Addresses
          </button>
        </div>

        <!-- Tab Content Panes -->
        <div class="account-tab-content">
          
          <!-- TAB 1: Orders -->
          <div class="account-tab-pane is-active" id="tab-orders">
            ${orders.length === 0 ? `
              <div class="empty-orders-state">
                <p>No past orders recorded in this session.</p>
                <button class="btn btn-primary mt-3" onclick="store.setView('catalog')">Start Shopping</button>
              </div>
            ` : `
              <div class="orders-list">
                ${orders.map(ord => `
                  <div class="order-card">
                    <div class="order-card-header">
                      <div>
                        <span class="order-number-label">Order Ref:</span>
                        <strong class="order-number">${ord.orderId}</strong>
                        <span class="order-date">• Placed on ${ord.date}</span>
                      </div>
                      <div class="order-status-badge ${ord.status === 'In Transit' ? 'status-transit' : 'status-processing'}">
                        <span class="status-dot"></span>
                        ${ord.status}
                      </div>
                    </div>

                    <!-- Items in order -->
                    <div class="order-items-grid">
                      ${ord.items.map(item => `
                        <div class="order-item-chip">
                          <img src="${item.heroImage}" alt="${item.name}" />
                          <div class="order-item-desc">
                            <strong>${item.name}</strong>
                            <span>${item.selectedColor || ''} • Qty: ${item.quantity}</span>
                          </div>
                        </div>
                      `).join('')}
                    </div>

                    <!-- Footer of order card -->
                    <div class="order-card-footer">
                      <div class="order-total-block">
                        <span>Total Paid:</span>
                        <strong>${convertPrice(ord.total, currency).formatted}</strong>
                        <span class="tracking-sub">Tracking: ${ord.trackingNumber}</span>
                      </div>
                      <div class="order-actions-row">
                        <button class="btn btn-secondary btn-sm order-receipt-btn" data-order-id="${ord.orderId}">
                          View Digital Receipt
                        </button>
                        <button class="btn btn-primary btn-sm order-reorder-btn" data-order-id="${ord.orderId}">
                          Re-Order Items
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- TAB 2: Saved Addresses -->
          <div class="account-tab-pane" id="tab-address">
            <div class="addresses-grid">
              
              <div class="address-card is-default">
                <div class="address-tag-row">
                  <span class="address-type">Primary Office</span>
                  <span class="default-badge">DEFAULT</span>
                </div>
                <h4>${user.name}</h4>
                <p>7th June Tech Tower, Suite 400</p>
                <p>Airport Residential Area, Accra, Ghana</p>
                <p>Phone: +233 24 555 7788</p>
              </div>

              <div class="address-card">
                <div class="address-tag-row">
                  <span class="address-type">Secondary Dispatch</span>
                </div>
                <h4>${user.name}</h4>
                <p>742 Evergreen Terrace, Suite 800</p>
                <p>San Francisco, CA 94107, USA</p>
                <p>Phone: +1 (415) 890-4321</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  attachAccountEvents(container);
}

function attachAccountEvents(container) {
  // Back to Store
  container.querySelector('#account-back-shop-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });

  // Tabs
  container.querySelectorAll('.account-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const tabId = btn.dataset.tab;
      container.querySelectorAll('.account-tab-btn').forEach(b => b.classList.remove('is-active'));
      container.querySelectorAll('.account-tab-pane').forEach(p => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      container.querySelector(`#${tabId}`)?.classList.add('is-active');
    });
  });

  // Switch / Sign In
  container.querySelector('#account-switch-btn')?.addEventListener('click', () => {
    sounds.playClick();
    openAuthModal('login');
  });

  // Sign Out
  container.querySelector('#account-logout-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.logout();
    ui.showToast({
      title: 'Signed Out',
      message: 'You are now browsing as a guest.',
      type: 'info'
    });
    renderAccountView(container);
  });

  // Re-order button
  container.querySelectorAll('.order-reorder-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.dataset.orderId;
      const order = store.state.orders.find(o => o.orderId === orderId);
      if (order) {
        order.items.forEach(item => {
          const prod = store.state.products.find(p => p.id === item.productId || p.name === item.name);
          if (prod) {
            store.addToCart(prod, item.selectedColor, item.selectedOption, item.quantity);
          }
        });
        ui.showToast({
          title: 'Items Re-added',
          message: `All items from order ${orderId} added to your cart.`,
          type: 'success',
          actionText: 'View Cart',
          onAction: () => ui.toggleDrawer('cart-drawer', true)
        });
      }
    });
  });

  // Digital Receipt
  container.querySelectorAll('.order-receipt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.dataset.orderId;
      const order = store.state.orders.find(o => o.orderId === orderId);
      if (order) {
        ui.showToast({
          title: `Receipt #${order.orderId}`,
          message: `Digital invoice for ${order.shippingAddress.fullName} generated.`,
          type: 'info'
        });
      }
    });
  });
}
