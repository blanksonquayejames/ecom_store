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
  const isLoggedIn = user && user.isLoggedIn;
  const firstName = user && user.name ? user.name.trim().split(' ')[0] : 'Member';

  if (!isLoggedIn) {
    // --- Logged Out / Guest State ---
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

          <!-- Guest / Sign In Prompt Card -->
          <div class="account-guest-gate-card">
            <div class="guest-gate-icon">🔐</div>
            <h2 class="guest-gate-title">Sign In to View Your Account</h2>
            <p class="guest-gate-desc">
              Sign in to access your complete <strong>Order History</strong>, track live courier shipments, manage your <strong>Saved Delivery Addresses</strong>, and earn <strong>7th June VIP Rewards</strong>.
            </p>
            
            <div class="guest-gate-actions">
              <button class="btn btn-primary btn-lg" id="guest-open-login-btn">
                Sign In to 7th June Account
              </button>
              <button class="btn btn-secondary btn-lg" id="guest-open-reg-btn">
                Create New VIP Account (+ 500 Pts)
              </button>
            </div>

            <div class="auth-demo-divider mt-4">
              <span>OR TEST WITH 1-CLICK DEMO PROFILE</span>
            </div>
            
            <div class="guest-demo-pill-wrap mt-2">
              <button class="btn btn-ghost btn-sm" id="guest-demo-julian-btn">
                👑 1-Click Sign In as Julian Vance (VIP Member)
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    attachGuestAccountEvents(container);
    return;
  }

  // --- Authenticated User State ---
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

        <!-- Account Header Card with Personalized First Name Greeting -->
        <div class="account-header-card">
          <div class="account-profile-info">
            <img src="${user.avatar}" alt="${user.name}" class="account-avatar" />
            <div class="account-texts">
              <div class="tier-pill">${user.tier}</div>
              <h1 class="account-name">Welcome back, ${firstName}!</h1>
              <p class="account-email">${user.name} • ${user.email}</p>
              
              <div class="account-user-actions mt-2">
                <button class="btn btn-secondary btn-sm" id="account-switch-btn">
                  Switch Account
                </button>
                <button class="btn btn-secondary btn-sm" id="account-goto-admin-btn">
                  🛠️ Store Admin
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

        <!-- Account Navigation Tabs (Orders & Saved Addresses) -->
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
                  <span class="address-type">Primary Office (Ghana)</span>
                  <span class="default-badge">DEFAULT</span>
                </div>
                <h4>${user.name}</h4>
                <p>7th June Tech Tower, Suite 400</p>
                <p>Airport Residential Area, Accra, Ghana</p>
                <p>Phone: +233 24 555 7788</p>
              </div>

              <div class="address-card">
                <div class="address-tag-row">
                  <span class="address-type">Secondary Dispatch (USA)</span>
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

function attachGuestAccountEvents(container) {
  // Back to Store
  container.querySelector('#account-back-shop-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });

  // Open Sign In Modal
  container.querySelector('#guest-open-login-btn')?.addEventListener('click', () => {
    sounds.playClick();
    openAuthModal('login');
  });

  // Open Register Modal
  container.querySelector('#guest-open-reg-btn')?.addEventListener('click', () => {
    sounds.playClick();
    openAuthModal('register');
  });

  // 1-Click Demo Login as Julian
  container.querySelector('#guest-demo-julian-btn')?.addEventListener('click', () => {
    sounds.playClick();
    const user = {
      isLoggedIn: true,
      name: 'Julian Vance',
      email: 'julian.vance@7thjune.com',
      tier: 'Platinum Titan VIP',
      points: 3450,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };
    store.setUser(user);
    ui.showToast({
      title: 'Welcome back, Julian!',
      message: 'Signed in as Julian Vance. Order history & saved addresses active.',
      type: 'success'
    });
    renderAccountView(container);
  });
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

  // Admin Portal Navigation
  container.querySelector('#account-goto-admin-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('admin');
  });

  // Sign Out
  container.querySelector('#account-logout-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.logout();
    ui.showToast({
      title: 'Signed Out',
      message: 'You have been signed out. Please sign in to access orders and addresses.',
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
        showOrderReceiptModal(order);
      }
    });
  });
}

/**
 * High-fidelity Digital Receipt Modal Inspector
 * Displays full itemized invoice, MoMo transaction verification, and PDF printing.
 */
export function showOrderReceiptModal(order) {
  const modal = document.getElementById('receipt-modal');
  const content = document.getElementById('receipt-modal-content');
  if (!modal || !content) return;

  const { currency } = store.state;
  sounds.playPop();

  const receiptNumber = `REC-${order.orderId.replace('7TH-', 'GH')}`;
  const momoRef = order.momoTransactionId || `MM-${order.orderId.replace('7TH-', '8890')}`;
  const phone = order.shippingAddress?.phone || order.momoPhone || '+233 24 555 7788';
  const paymentMethod = order.paymentMethod || 'Mobile Money (MTN MoMo)';

  content.innerHTML = `
    <div class="receipt-card">
      <!-- Receipt Header -->
      <div class="receipt-header">
        <div class="receipt-brand">
          <div class="receipt-logo-wrap">
            <img src="image/7th June logo.png" alt="7th June Computers" class="receipt-logo-img" />
            <div>
              <div class="receipt-brand-title">7TH JUNE COMPUTERS</div>
              <div class="receipt-brand-sub">Premium Hardware & Custom Tech Systems Ltd.</div>
            </div>
          </div>
          <div class="receipt-store-address">
            <p>Tech Tower, 4th Floor, Airport Residential Area</p>
            <p>Accra, Greater Accra Region, Ghana</p>
            <p>VAT Reg: GH-94810294-A • contact@7thjune.com</p>
          </div>
        </div>

        <div class="receipt-title-box">
          <div class="receipt-badge-paid">
            <span class="paid-dot"></span>
            <span>PAID &amp; VERIFIED</span>
          </div>
          <h2 class="receipt-doc-title">OFFICIAL SALES RECEIPT</h2>
          <div class="receipt-ref-num">Receipt #: <strong>${receiptNumber}</strong></div>
          <div class="receipt-date-placed">Date: <strong>${order.date}</strong></div>
        </div>
      </div>

      <div class="receipt-divider"></div>

      <!-- Customer & Payment Metadata Grid -->
      <div class="receipt-meta-grid">
        <div class="receipt-meta-box">
          <span class="receipt-meta-label">CUSTOMER / BILLED TO</span>
          <strong class="receipt-meta-val">${order.shippingAddress?.fullName || 'Valued Customer'}</strong>
          <p class="receipt-meta-sub">${order.shippingAddress?.address || ''}</p>
          <p class="receipt-meta-sub">${order.shippingAddress?.city || ''}, ${order.shippingAddress?.country || 'Ghana'}</p>
          <p class="receipt-meta-sub">Tel: <strong>${phone}</strong></p>
        </div>

        <div class="receipt-meta-box">
          <span class="receipt-meta-label">PAYMENT CHANNEL</span>
          <div class="receipt-momo-badge">
            <span class="momo-icon-sm">📲</span>
            <strong>${paymentMethod}</strong>
          </div>
          <p class="receipt-meta-sub">Gateway: <strong>Ghana Mobile Money (MoMo)</strong></p>
          <p class="receipt-meta-sub">MoMo Ref: <code>${momoRef}</code></p>
          <p class="receipt-meta-sub">Status: <strong class="text-green">Instant USSD PIN Verified</strong></p>
        </div>

        <div class="receipt-meta-box">
          <span class="receipt-meta-label">DISPATCH &amp; LOGISTICS</span>
          <p class="receipt-meta-sub">Order Ref: <strong>${order.orderId}</strong></p>
          <p class="receipt-meta-sub">Logistics: <strong>${order.carrier || 'FedEx Express Courier'}</strong></p>
          <p class="receipt-meta-sub">Tracking: <code>${order.trackingNumber || 'FX-84920412A'}</code></p>
          <p class="receipt-meta-sub">Delivery Status: <strong class="text-blue">${order.status || 'Processing'}</strong></p>
        </div>
      </div>

      <!-- Itemized Table -->
      <div class="receipt-table-wrap">
        <table class="receipt-items-table">
          <thead>
            <tr>
              <th style="width: 50%;">Item Description</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 15%; text-align: right;">Unit Price</th>
              <th style="width: 20%; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  <div class="receipt-item-cell">
                    <img src="${item.heroImage}" alt="${item.name}" class="receipt-item-thumb" />
                    <div>
                      <strong class="receipt-item-name">${item.name}</strong>
                      <span class="receipt-item-variant">${item.selectedColor ? `${item.selectedColor}` : ''} ${item.selectedOption ? `• ${item.selectedOption}` : ''}</span>
                    </div>
                  </div>
                </td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${convertPrice(item.price, currency).formatted}</td>
                <td style="text-align: right;"><strong>${convertPrice(item.price * item.quantity, currency).formatted}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Financial Calculation Summary -->
      <div class="receipt-finance-wrap">
        <div class="receipt-notes-col">
          <div class="receipt-security-note">
            <span class="shield-icon">🛡️</span>
            <div>
              <strong>7th June 3-Year Hardware Protection</strong>
              <p>This electronic receipt is your official proof of purchase for genuine warranty coverage and concierge technical support in Ghana.</p>
            </div>
          </div>
          <div class="receipt-barcode-row">
            <div class="receipt-barcode-lines"></div>
            <span class="receipt-barcode-text">*${order.orderId}*</span>
          </div>
        </div>

        <div class="receipt-totals-col">
          <div class="receipt-total-row">
            <span>Subtotal</span>
            <span>${convertPrice(order.subtotal, currency).formatted}</span>
          </div>
          ${order.discount > 0 ? `
            <div class="receipt-total-row receipt-row-discount">
              <span>Promo Discount</span>
              <span>-${convertPrice(order.discount, currency).formatted}</span>
            </div>
          ` : ''}
          <div class="receipt-total-row">
            <span>Insured Courier Shipping</span>
            <span>${order.shipping === 0 ? '<strong class="text-green">COMPLIMENTARY</strong>' : convertPrice(order.shipping, currency).formatted}</span>
          </div>
          <div class="receipt-total-row">
            <span>Tax &amp; VAT</span>
            <span>${convertPrice(order.tax, currency).formatted}</span>
          </div>
          <div class="receipt-total-divider"></div>
          <div class="receipt-total-row receipt-grand-row">
            <span>Total Paid (MoMo)</span>
            <span class="receipt-grand-amount">${convertPrice(order.total, currency).formatted}</span>
          </div>
        </div>
      </div>

      <!-- Receipt Action Bar -->
      <div class="receipt-modal-actions no-print">
        <button class="btn btn-primary" id="receipt-print-action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print / Save PDF Receipt
        </button>
        <button class="btn btn-secondary" id="receipt-close-action-btn">
          Close Receipt
        </button>
      </div>
    </div>
  `;

  ui.openModal('receipt-modal');

  // Wire up close and print buttons
  content.querySelector('#receipt-print-action-btn')?.addEventListener('click', () => {
    sounds.playClick();
    window.print();
  });

  content.querySelector('#receipt-close-action-btn')?.addEventListener('click', () => {
    sounds.playClick();
    ui.closeModal('receipt-modal');
  });

  document.getElementById('receipt-modal-close-btn')?.addEventListener('click', () => {
    sounds.playClick();
    ui.closeModal('receipt-modal');
  });
}
