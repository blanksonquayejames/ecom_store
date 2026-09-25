/**
 * 7th JUNE COMPUTERS - Customer Account Hub & Client Portal
 * Production-ready account suite: Order tracking with MoMo verification,
 * Saved address management (CRUD), Profile & Security settings, and VIP Rewards Club.
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { sounds } from './audio.js';
import { ui } from './ui.js';
import { openAuthModal } from './auth-modal.js';

let activeAccountTab = 'overview'; // 'overview' | 'orders' | 'addresses' | 'profile' | 'rewards'

function getAccountTabLabel(tab) {
  switch (tab) {
    case 'overview': return 'Account Overview';
    case 'orders': return 'Order History & Tracking';
    case 'addresses': return 'Saved Delivery Addresses';
    case 'profile': return 'Profile & Security';
    case 'rewards': return 'VIP Loyalty & Rewards';
    default: return 'Account Hub';
  }
}

export function renderAccountView(container, subTab = null) {
  const { user, orders, currency, currentView } = store.state;
  if (subTab) {
    activeAccountTab = subTab;
  } else if (currentView && currentView.tab) {
    activeAccountTab = currentView.tab;
  }

  const isLoggedIn = user && user.isLoggedIn;
  const firstName = user && user.name ? user.name.trim().split(' ')[0] : 'Member';

  if (!isLoggedIn) {
    renderGuestGate(container);
    return;
  }

  renderAuthenticatedHub(container, user, orders, currency, firstName);
}

/**
 * 1. Guest / Logged-Out Checkpoint
 */
function renderGuestGate(container) {
  container.innerHTML = `
    <div class="account-page-wrapper animate-fade-in">
      <div class="container">
        
        <!-- Breadcrumb Navigation -->
        <nav class="account-breadcrumb-nav mb-3" aria-label="Breadcrumb">
          <a href="#/catalog" class="account-breadcrumb-link" id="guest-bread-store">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Storefront
          </a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-active">Client Services & Sign In</span>
        </nav>

        <!-- Guest Prompt Card -->
        <div class="account-guest-gate-card">
          <div class="guest-gate-icon">🔐</div>
          <h2 class="guest-gate-title">Sign In to 7th June Account Hub</h2>
          <p class="guest-gate-desc">
            Access your <strong>Order History</strong>, track live courier deliveries, manage <strong>Saved Shipping Destinations</strong> in Ghana and worldwide, and redeem <strong>VIP Rewards</strong>.
          </p>
          
          <div class="guest-gate-actions">
            <button class="btn btn-primary btn-lg" id="guest-open-login-btn">
              Sign In to Account
            </button>
            <button class="btn btn-secondary btn-lg" id="guest-open-reg-btn">
              Create New VIP Account (+500 Pts)
            </button>
          </div>

          <div class="auth-demo-divider mt-4">
            <span>OR 1-CLICK INSTANT ACCESS</span>
          </div>
          
          <div class="guest-demo-pill-wrap mt-2">
            <button class="btn btn-ghost btn-sm" id="guest-demo-julian-btn">
              👑 Sign In as Julian Vance (VIP Member)
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  attachGuestAccountEvents(container);
}

/**
 * 2. Authenticated Account Dashboard
 */
function renderAuthenticatedHub(container, user, orders, currency, firstName) {
  const addresses = user.addresses || [];
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0] || null;

  container.innerHTML = `
    <div class="account-page-wrapper animate-fade-in">
      <div class="container">
        
        <!-- Breadcrumbs -->
        <nav class="account-breadcrumb-nav mb-3" aria-label="Account Breadcrumbs">
          <a href="#/catalog" class="account-breadcrumb-link" id="account-bread-store">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Storefront
          </a>
          <span class="breadcrumb-sep">/</span>
          <a href="#/account/overview" class="account-breadcrumb-link" id="account-bread-hub">Client Services</a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-active" id="account-active-breadcrumb">${getAccountTabLabel(activeAccountTab)}</span>
        </nav>

        <!-- Executive Account Profile Header Banner -->
        <div class="account-header-card">
          <div class="account-profile-info">
            <div class="account-avatar-wrap">
              <img src="${user.avatar}" alt="${user.name}" class="account-avatar" />
              <span class="avatar-vip-badge" title="Verified VIP Client">✦</span>
            </div>
            <div class="account-texts">
              <div class="tier-pill">${user.tier}</div>
              <h1 class="account-name">Welcome back, ${firstName}!</h1>
              <p class="account-email">${user.name} • ${user.email} ${user.phone ? `• ${user.phone}` : ''}</p>
              
              <div class="account-user-actions mt-2">
                <button class="btn btn-secondary btn-sm" id="account-tab-nav-profile">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Edit Profile
                </button>
                <button class="btn btn-secondary btn-sm" id="account-goto-admin-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Store Administration
                </button>
                <button class="btn btn-ghost btn-sm" id="account-logout-btn">
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <!-- Loyalty Card -->
          <div class="loyalty-card-box">
            <div class="loyalty-card-tag">7TH JUNE VIP CLUB</div>
            <div class="loyalty-points-number">${user.points.toLocaleString()} <span class="pts-label">PTS</span></div>
            <p class="loyalty-points-sub">Equivalent to ${convertPrice(Math.floor(user.points / 10), currency).formatted} in redeemable credit</p>
            <div class="loyalty-progress-track">
              <div class="loyalty-progress-fill" style="width: ${Math.min(100, Math.round((user.points / 5000) * 100))}%;"></div>
            </div>
            <div class="loyalty-tier-status">Next Tier: <strong>Titanium Sovereign (5,000 pts)</strong></div>
          </div>
        </div>

        <!-- Account Hub Navigation Tabs -->
        <div class="account-tabs-nav">
          <button class="account-tab-btn ${activeAccountTab === 'overview' ? 'is-active' : ''}" data-tab="overview">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Overview</span>
          </button>
          <button class="account-tab-btn ${activeAccountTab === 'orders' ? 'is-active' : ''}" data-tab="orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <span>Orders & Tracking</span>
            <span class="account-tab-badge">${orders.length}</span>
          </button>
          <button class="account-tab-btn ${activeAccountTab === 'addresses' ? 'is-active' : ''}" data-tab="addresses">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Saved Addresses</span>
            <span class="account-tab-badge">${addresses.length}</span>
          </button>
          <button class="account-tab-btn ${activeAccountTab === 'profile' ? 'is-active' : ''}" data-tab="profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profile & Security</span>
          </button>
          <button class="account-tab-btn ${activeAccountTab === 'rewards' ? 'is-active' : ''}" data-tab="rewards">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>VIP Rewards Club</span>
          </button>
        </div>

        <!-- Dynamic Tab Content Pane -->
        <div class="account-pane-container" id="account-pane-content">
          ${renderAccountPane(activeAccountTab, user, orders, currency, defaultAddress)}
        </div>

      </div>
    </div>
  `;

  attachAccountHubEvents(container);
  setupAddressModal();
}

/**
 * 3. Render Content for Active Tab
 */
function renderAccountPane(tab, user, orders, currency, defaultAddress) {
  switch (tab) {
    case 'overview':
      return renderOverviewTab(user, orders, currency, defaultAddress);
    case 'orders':
      return renderOrdersTab(orders, currency);
    case 'addresses':
      return renderAddressesTab(user);
    case 'profile':
      return renderProfileTab(user);
    case 'rewards':
      return renderRewardsTab(user, currency);
    default:
      return renderOverviewTab(user, orders, currency, defaultAddress);
  }
}

/**
 * TAB 1: OVERVIEW & DASHBOARD SUMMARY
 */
function renderOverviewTab(user, orders, currency, defaultAddress) {
  const inTransitOrders = orders.filter(o => o.status === 'In Transit');
  const recentOrder = orders[0] || null;

  return `
    <div class="account-overview-grid animate-fade-in">
      
      <!-- Metrics Overview Cards -->
      <div class="account-metrics-row">
        <div class="account-metric-card">
          <span class="metric-label">TOTAL ORDERS</span>
          <div class="metric-number">${orders.length}</div>
          <span class="metric-sub">Across all sessions</span>
        </div>
        <div class="account-metric-card">
          <span class="metric-label">ACTIVE DELIVERIES</span>
          <div class="metric-number text-blue">${inTransitOrders.length}</div>
          <span class="metric-sub">In transit via Courier</span>
        </div>
        <div class="account-metric-card">
          <span class="metric-label">SAVED ADDRESSES</span>
          <div class="metric-number">${(user.addresses || []).length}</div>
          <span class="metric-sub">Ghana & International</span>
        </div>
        <div class="account-metric-card">
          <span class="metric-label">VIP REWARD CREDIT</span>
          <div class="metric-number text-green">${convertPrice(Math.floor(user.points / 10), currency).formatted}</div>
          <span class="metric-sub">Ready to redeem</span>
        </div>
      </div>

      <div class="account-two-col-grid mt-3">
        
        <!-- Left: Recent Order Snapshot -->
        <div class="account-card-box">
          <div class="card-box-header">
            <h3>Latest Order Snapshot</h3>
            <button class="btn btn-ghost btn-xs" onclick="window.location.hash='#/account/orders'">View All Orders →</button>
          </div>

          ${recentOrder ? `
            <div class="recent-order-card">
              <div class="recent-order-top">
                <div>
                  <strong>Order ${recentOrder.orderId}</strong>
                  <span class="order-date-sub">• Placed ${recentOrder.date}</span>
                </div>
                <span class="status-badge-chip status-${(recentOrder.status || 'processing').toLowerCase().replace(/\s+/g, '-')}">
                  ${recentOrder.status}
                </span>
              </div>

              <!-- Item Chips -->
              <div class="recent-order-items mt-2">
                ${recentOrder.items.slice(0, 2).map(item => `
                  <div class="recent-item-chip">
                    <img src="${item.heroImage}" alt="${item.name}" />
                    <div class="chip-info">
                      <span class="chip-name">${item.name}</span>
                      <span class="chip-qty">Qty: ${item.quantity} • ${item.selectedColor || ''}</span>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="recent-order-footer mt-3">
                <div>
                  <span class="text-xs text-muted">Total Paid:</span>
                  <strong>${convertPrice(recentOrder.total, currency).formatted}</strong>
                </div>
                <button class="btn btn-secondary btn-sm inspect-order-receipt-btn" data-order-id="${recentOrder.orderId}">
                  Inspect Tax Invoice & Receipt
                </button>
              </div>
            </div>
          ` : `
            <div class="empty-state-card text-center py-4">
              <p>No recent orders found.</p>
              <button class="btn btn-primary btn-sm mt-2" onclick="window.location.hash='#/catalog'">Start Exploring Hardware</button>
            </div>
          `}
        </div>

        <!-- Right: Primary Shipping Address Card -->
        <div class="account-card-box">
          <div class="card-box-header">
            <h3>Default Shipping Destination</h3>
            <button class="btn btn-ghost btn-xs" onclick="window.location.hash='#/account/addresses'">Manage Addresses →</button>
          </div>

          ${defaultAddress ? `
            <div class="address-preview-card">
              <div class="address-preview-tag">
                <span class="default-pill">PRIMARY DEFAULT</span>
                <span class="address-type-label">${defaultAddress.type}</span>
              </div>
              <h4 class="mt-2">${defaultAddress.fullName}</h4>
              <p class="address-line">${defaultAddress.address}</p>
              <p class="address-line">${defaultAddress.city}, ${defaultAddress.region} • ${defaultAddress.country}</p>
              <p class="address-phone">Phone: ${defaultAddress.phone}</p>
            </div>
          ` : `
            <div class="empty-state-card text-center py-4">
              <p>No default address saved yet.</p>
              <button class="btn btn-secondary btn-sm mt-2" onclick="window.location.hash='#/account/addresses'">Add Delivery Address</button>
            </div>
          `}

          <!-- Quick Shortcuts -->
          <div class="account-shortcuts-box mt-3">
            <h4>Quick Navigation</h4>
            <div class="shortcuts-buttons-row">
              <button class="btn btn-secondary btn-xs" onclick="window.location.hash='#/account/profile'">
                Security & Passcode
              </button>
              <button class="btn btn-secondary btn-xs" onclick="window.location.hash='#/account/rewards'">
                Redeem Promo Voucher
              </button>
              <button class="btn btn-ghost btn-xs" onclick="window.location.hash='#/catalog'">
                Continue Shopping
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;
}

/**
 * TAB 2: ORDER HISTORY & LIVE COURIER TRACKING
 */
function renderOrdersTab(orders, currency) {
  return `
    <div class="account-orders-section animate-fade-in">
      
      <div class="orders-toolbar-row mb-3">
        <div class="toolbar-search-wrap">
          <input type="text" class="custom-input custom-input-sm" id="customer-order-search" placeholder="Search by Order ID (e.g. 7TH-892419) or item..." />
        </div>
        <div class="orders-filter-chips" id="orders-status-filters">
          <button class="filter-chip-btn is-active" data-status="All">All (${orders.length})</button>
          <button class="filter-chip-btn" data-status="In Transit">In Transit</button>
          <button class="filter-chip-btn" data-status="Processing">Processing</button>
          <button class="filter-chip-btn" data-status="Delivered">Delivered</button>
        </div>
      </div>

      ${orders.length === 0 ? `
        <div class="empty-orders-state text-center py-5">
          <div class="empty-icon">📦</div>
          <h3>No Orders Found</h3>
          <p>You haven't placed any hardware orders in this session yet.</p>
          <button class="btn btn-primary mt-3" onclick="window.location.hash='#/catalog'">Browse Hardware Catalog</button>
        </div>
      ` : `
        <div class="orders-cards-list" id="customer-orders-list">
          ${orders.map(ord => `
            <div class="order-card" data-order-id="${ord.orderId}" data-status="${ord.status}">
              
              <!-- Card Header -->
              <div class="order-card-header">
                <div>
                  <span class="order-number-label">Order Ref:</span>
                  <strong class="order-number">${ord.orderId}</strong>
                  <span class="order-date">• Placed on ${ord.date}</span>
                </div>
                <div class="order-header-right">
                  <span class="momo-pill">
                    <span class="momo-dot"></span>
                    ${ord.paymentMethod || 'MTN MoMo'}
                  </span>
                  <span class="status-badge-chip status-${(ord.status || 'processing').toLowerCase().replace(/\s+/g, '-')}">
                    ${ord.status}
                  </span>
                </div>
              </div>

              <!-- Interactive Timeline -->
              <div class="order-timeline-track">
                <div class="timeline-step ${ord.timeline && ord.timeline[0]?.completed ? 'is-complete' : 'is-active'}">
                  <div class="step-dot">✓</div>
                  <div class="step-meta">
                    <span class="step-title">Order Placed</span>
                    <span class="step-time">${ord.timeline ? ord.timeline[0]?.time : 'Verified'}</span>
                  </div>
                </div>
                <div class="timeline-step ${ord.timeline && ord.timeline[1]?.completed ? 'is-complete' : (ord.status === 'Processing' ? 'is-active' : '')}">
                  <div class="step-dot">2</div>
                  <div class="step-meta">
                    <span class="step-title">Assembly & QA</span>
                    <span class="step-time">${ord.timeline ? ord.timeline[1]?.time : 'Pending'}</span>
                  </div>
                </div>
                <div class="timeline-step ${ord.timeline && ord.timeline[2]?.completed ? 'is-complete' : (ord.status === 'In Transit' ? 'is-active' : '')}">
                  <div class="step-dot">3</div>
                  <div class="step-meta">
                    <span class="step-title">Vault Dispatch</span>
                    <span class="step-time">${ord.timeline ? ord.timeline[2]?.time : 'Pending'}</span>
                  </div>
                </div>
                <div class="timeline-step ${ord.status === 'Delivered' ? 'is-complete' : ''}">
                  <div class="step-dot">4</div>
                  <div class="step-meta">
                    <span class="step-title">Delivery</span>
                    <span class="step-time">${ord.status === 'Delivered' ? 'Delivered' : 'In Transit'}</span>
                  </div>
                </div>
              </div>

              <!-- Items in Order -->
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

              <!-- Card Footer -->
              <div class="order-card-footer">
                <div class="order-total-block">
                  <span>Total Amount Paid:</span>
                  <strong>${convertPrice(ord.total, currency).formatted}</strong>
                  <span class="tracking-sub">Tracking: ${ord.trackingNumber || 'FX-84920412A'}</span>
                </div>
                <div class="order-actions-row">
                  <button class="btn btn-secondary btn-sm inspect-order-receipt-btn" data-order-id="${ord.orderId}">
                    View Tax Invoice
                  </button>
                  <button class="btn btn-primary btn-sm reorder-items-btn" data-order-id="${ord.orderId}">
                    Re-Order Items
                  </button>
                </div>
              </div>

            </div>
          `).join('')}
        </div>
      `}

    </div>
  `;
}

/**
 * TAB 3: SAVED DELIVERY ADDRESSES (FULL CRUD)
 */
function renderAddressesTab(user) {
  const addresses = user.addresses || [];

  return `
    <div class="account-addresses-section animate-fade-in">
      
      <div class="section-top-toolbar mb-3">
        <div>
          <h3>Saved Shipping Destinations (${addresses.length})</h3>
          <p class="section-subtext">Manage verified locations for rapid checkout and insured courier shipping.</p>
        </div>
        <button class="btn btn-primary btn-sm" id="open-add-address-modal-btn">
          + Add New Address
        </button>
      </div>

      <div class="addresses-grid">
        ${addresses.map(addr => `
          <div class="address-card ${addr.isDefault ? 'is-default' : ''}" data-address-id="${addr.id}">
            <div class="address-tag-row">
              <span class="address-type-tag">${addr.type || 'Destination'}</span>
              ${addr.isDefault ? '<span class="default-badge">DEFAULT</span>' : `
                <button class="link-btn text-xs set-default-address-btn" data-id="${addr.id}">
                  Set as Default
                </button>
              `}
            </div>

            <h4 class="mt-2">${addr.fullName || user.name}</h4>
            <p class="address-street">${addr.address}</p>
            <p class="address-region">${addr.city}, ${addr.region} • ${addr.country}</p>
            <p class="address-contact">Phone: ${addr.phone || user.phone}</p>

            <div class="address-card-actions mt-3">
              <button class="btn btn-secondary btn-xs edit-address-btn" data-id="${addr.id}">
                Edit
              </button>
              ${!addr.isDefault ? `
                <button class="btn btn-ghost btn-xs text-danger delete-address-btn" data-id="${addr.id}">
                  Delete
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

/**
 * TAB 4: CUSTOMER PROFILE & SECURITY SETTINGS
 */
function renderProfileTab(user) {
  return `
    <div class="account-profile-section animate-fade-in">
      <div class="account-two-col-grid">
        
        <!-- Left: Profile Information Form -->
        <div class="account-card-box">
          <h3>Personal Client Profile</h3>
          <p class="card-subtext mb-3">Keep your recipient details and contact numbers updated for order updates.</p>

          <form id="customer-profile-form" class="customer-profile-form">
            <div class="form-group">
              <label>Full Legal Name</label>
              <input type="text" class="custom-input" id="profile-name" value="${user.name || ''}" required />
            </div>

            <div class="form-group">
              <label>Primary Email Address</label>
              <input type="email" class="custom-input" id="profile-email" value="${user.email || ''}" required />
            </div>

            <div class="form-group">
              <label>Ghana Mobile Money / Contact Phone</label>
              <input type="tel" class="custom-input" id="profile-phone" value="${user.phone || '+233 24 555 7788'}" placeholder="+233 24 555 7788" required />
              <span class="input-hint">Used for courier arrival SMS and MoMo payment approval prompts.</span>
            </div>

            <!-- Avatar Picker -->
            <div class="form-group mt-3">
              <label>Profile Avatar Selection</label>
              <div class="avatar-selection-row">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" class="avatar-option-thumb ${user.avatar?.includes('1534528741775') ? 'is-selected' : ''}" data-avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" class="avatar-option-thumb ${user.avatar?.includes('1507003211169') ? 'is-selected' : ''}" data-avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" />
                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" class="avatar-option-thumb ${user.avatar?.includes('1517841905240') ? 'is-selected' : ''}" data-avatar="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" />
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80" class="avatar-option-thumb ${user.avatar?.includes('1535713875002') ? 'is-selected' : ''}" data-avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80" />
              </div>
              <input type="hidden" id="profile-avatar-url" value="${user.avatar}" />
            </div>

            <button type="submit" class="btn btn-primary mt-3" id="save-profile-btn">
              Save Profile Changes
            </button>
          </form>
        </div>

        <!-- Right: Security & Passcode Settings -->
        <div class="account-card-box">
          <h3>Security & Passcode</h3>
          <p class="card-subtext mb-3">Protect your stored payment preferences and VIP reward balance.</p>

          <form id="customer-security-form" class="customer-security-form" onsubmit="event.preventDefault(); sounds.playSuccess(); ui.showToast({ title: 'Password Updated', message: 'Your account passcode was changed successfully.', type: 'success' });">
            <div class="form-group">
              <label>Current Password</label>
              <input type="password" class="custom-input" placeholder="••••••••" value="password123" required />
            </div>

            <div class="form-group">
              <label>New Password</label>
              <input type="password" class="custom-input" placeholder="Enter at least 8 characters" required />
            </div>

            <div class="form-group">
              <label>Confirm New Password</label>
              <input type="password" class="custom-input" placeholder="Re-type new password" required />
            </div>

            <div class="auth-extra-row mt-2">
              <label class="custom-checkbox">
                <input type="checkbox" checked />
                <span class="checkmark"></span>
                <span>Enable Two-Factor SMS Verification on Checkout</span>
              </label>
            </div>

            <button type="submit" class="btn btn-secondary mt-3">
              Update Security Password
            </button>
          </form>
        </div>

      </div>
    </div>
  `;
}

/**
 * TAB 5: VIP LOYALTY & REWARDS CLUB
 */
function renderRewardsTab(user, currency) {
  return `
    <div class="account-rewards-section animate-fade-in">
      
      <!-- Tier Banner Card -->
      <div class="rewards-banner-card">
        <div class="rewards-banner-left">
          <span class="vip-crown-badge">👑 7TH JUNE ELITE CLIENT CLUB</span>
          <h2 class="mt-1">${user.tier}</h2>
          <p class="rewards-banner-desc">You are currently enjoying accelerated points multipliers, complimentary priority courier delivery, and VIP vault allocation.</p>
        </div>
        <div class="rewards-banner-right text-right">
          <div class="big-points-label">${user.points.toLocaleString()} PTS</div>
          <span class="store-credit-tag">Valued at ${convertPrice(Math.floor(user.points / 10), currency).formatted} store credit</span>
        </div>
      </div>

      <!-- Tier Benefits Grid -->
      <div class="vip-tiers-grid mt-4">
        <div class="vip-tier-card">
          <div class="tier-card-header">
            <h4>Gold VIP</h4>
            <span class="tier-req">0 - 1,499 pts</span>
          </div>
          <ul class="tier-perks-list">
            <li>✓ Standard reward points (1 pt / $1)</li>
            <li>✓ Annual member gift</li>
            <li>✓ Email priority dispatch</li>
          </ul>
        </div>

        <div class="vip-tier-card is-current-tier">
          <div class="tier-card-header">
            <h4>Platinum Titan (Current)</h4>
            <span class="tier-req">1,500 - 4,999 pts</span>
          </div>
          <ul class="tier-perks-list">
            <li>✓ 1.5x Accelerated Points Multiplier</li>
            <li>✓ Free Priority Courier across Ghana</li>
            <li>✓ Exclusive early access to artisan drops</li>
            <li>✓ Dedicated 7th June hardware concierge</li>
          </ul>
        </div>

        <div class="vip-tier-card">
          <div class="tier-card-header">
            <h4>Titanium Sovereign</h4>
            <span class="tier-req">5,000+ pts</span>
          </div>
          <ul class="tier-perks-list">
            <li>✓ 2.0x Double Points Multiplier</li>
            <li>✓ White Glove Same-Day Vault Courier</li>
            <li>✓ 6-Month Hardware Warranty</li>
            <li>✓ Private Showroom Consultations</li>
          </ul>
        </div>
      </div>

      <!-- Instant Points Redemption Simulator -->
      <div class="points-redemption-box mt-4">
        <h3>Redeem Points for Discount Vouchers</h3>
        <p class="section-subtext mb-3">Exchange your loyalty balance for instant discount codes to apply during checkout.</p>

        <div class="redemption-options-row">
          <div class="redeem-option-card">
            <h4>$5 Off Voucher</h4>
            <span class="pts-cost">500 PTS</span>
            <button class="btn btn-secondary btn-sm mt-2 redeem-voucher-btn" data-pts="500" data-discount="5" data-code="VIP5">
              Redeem Code
            </button>
          </div>

          <div class="redeem-option-card">
            <h4>$10 Off Voucher</h4>
            <span class="pts-cost">1,000 PTS</span>
            <button class="btn btn-secondary btn-sm mt-2 redeem-voucher-btn" data-pts="1000" data-discount="10" data-code="VIP10">
              Redeem Code
            </button>
          </div>

          <div class="redeem-option-card">
            <h4>$25 Off Voucher</h4>
            <span class="pts-cost">2,500 PTS</span>
            <button class="btn btn-secondary btn-sm mt-2 redeem-voucher-btn" data-pts="2500" data-discount="25" data-code="VIP25">
              Redeem Code
            </button>
          </div>
        </div>
      </div>

    </div>
  `;
}

/**
 * 4. Attach Event Listeners to Account Hub
 */
function attachAccountHubEvents(container) {
  // Breadcrumbs
  container.querySelector('#account-bread-store')?.addEventListener('click', (e) => {
    e.preventDefault();
    sounds.playClick();
    window.location.hash = '#/catalog';
    store.setView('catalog');
  });

  container.querySelector('#account-bread-hub')?.addEventListener('click', (e) => {
    e.preventDefault();
    sounds.playClick();
    switchAccountTab(container, 'overview');
  });

  // Header quick edit profile button
  container.querySelector('#account-tab-nav-profile')?.addEventListener('click', () => {
    sounds.playClick();
    switchAccountTab(container, 'profile');
  });

  // Admin Portal Navigation
  container.querySelector('#account-goto-admin-btn')?.addEventListener('click', () => {
    sounds.playClick();
    window.location.hash = '#/admin';
    store.setView('admin');
  });

  // Sign Out
  container.querySelector('#account-logout-btn')?.addEventListener('click', async () => {
    const confirmed = await ui.confirm({
      title: 'Sign Out of Account?',
      message: 'Are you sure you want to sign out of your private account?',
      subMessage: 'You will need to sign in again to track active shipments, manage delivery destinations, and redeem VIP points.',
      confirmText: 'Sign Out',
      cancelText: 'Stay Signed In',
      type: 'warning',
      icon: '🚪'
    });

    if (!confirmed) return;

    sounds.playClick();
    store.logout();
    ui.showToast({
      title: 'Signed Out',
      message: 'You have signed out of your account.',
      type: 'info'
    });
    window.location.hash = '#/account';
    renderAccountView(container);
  });

  // Tab buttons
  container.querySelectorAll('.account-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const tab = btn.dataset.tab;
      switchAccountTab(container, tab);
    });
  });

  // Attach pane specific actions
  attachAccountPaneSpecificEvents(container, activeAccountTab);
}

function switchAccountTab(container, tabName) {
  activeAccountTab = tabName;
  window.location.hash = `#/account/${tabName}`;
  container.querySelectorAll('.account-tab-btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.tab === tabName);
  });
  const breadcrumbActive = container.querySelector('#account-active-breadcrumb');
  if (breadcrumbActive) {
    breadcrumbActive.textContent = getAccountTabLabel(tabName);
  }

  const { user, orders, currency } = store.state;
  const addresses = user.addresses || [];
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0] || null;

  const pane = container.querySelector('#account-pane-content');
  if (pane) {
    pane.innerHTML = renderAccountPane(tabName, user, orders, currency, defaultAddress);
    attachAccountPaneSpecificEvents(container, tabName);
  }
}

function attachAccountPaneSpecificEvents(container, tab) {
  const { user, orders } = store.state;

  // Inspect order receipt on Overview and Orders tabs
  container.querySelectorAll('.inspect-order-receipt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const id = btn.dataset.orderId;
      const ord = orders.find(o => o.orderId === id);
      if (ord) showOrderReceiptModal(ord);
    });
  });

  // Reorder items
  container.querySelectorAll('.reorder-items-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playSuccess();
      const id = btn.dataset.orderId;
      const ord = orders.find(o => o.orderId === id);
      if (ord && ord.items) {
        ord.items.forEach(item => {
          store.addToCart({
            id: item.productId || 'prod-custom',
            name: item.name,
            price: item.price || 199,
            heroImage: item.heroImage,
            colors: [{ name: item.selectedColor || 'Standard' }],
            storageOptions: [item.selectedOption || 'Standard']
          }, item.selectedColor, item.selectedOption, item.quantity);
        });
        ui.showToast({
          title: 'Items Added to Cart',
          message: `${ord.items.length} item(s) re-added from order ${id}.`,
          type: 'success',
          actionText: 'View Cart',
          onAction: () => ui.toggleDrawer('cart-drawer', true)
        });
      }
    });
  });

  // Order status filter buttons
  if (tab === 'orders') {
    const statusBtns = container.querySelectorAll('.filter-chip-btn');
    const searchInput = container.querySelector('#customer-order-search');

    const filterOrders = () => {
      const activeBtn = container.querySelector('.filter-chip-btn.is-active');
      const targetStatus = activeBtn?.dataset.status || 'All';
      const query = searchInput?.value.toLowerCase().trim() || '';

      container.querySelectorAll('#customer-orders-list .order-card').forEach(card => {
        const status = card.dataset.status;
        const id = card.dataset.orderId.toLowerCase();
        const matchesStatus = targetStatus === 'All' || status === targetStatus;
        const matchesQuery = !query || id.includes(query) || card.textContent.toLowerCase().includes(query);

        card.style.display = (matchesStatus && matchesQuery) ? '' : 'none';
      });
    };

    statusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        statusBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        filterOrders();
      });
    });

    searchInput?.addEventListener('input', filterOrders);
  }

  // Address tab actions
  if (tab === 'addresses') {
    container.querySelector('#open-add-address-modal-btn')?.addEventListener('click', () => {
      openAddressModal();
    });

    // Edit address
    container.querySelectorAll('.edit-address-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const addr = (user.addresses || []).find(a => a.id === id);
        if (addr) openAddressModal(addr);
      });
    });

    // Delete address
    container.querySelectorAll('.delete-address-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const addr = (store.state.user?.addresses || []).find(a => a.id === id);
        const label = addr ? `"${addr.type || addr.address}"` : 'this delivery destination';

        const confirmed = await ui.confirm({
          title: 'Remove Delivery Address?',
          message: `Are you sure you want to remove <strong>${label}</strong> from your saved destinations?`,
          subMessage: 'This address will no longer be available for 1-click selection during checkout.',
          confirmText: 'Remove Address',
          cancelText: 'Keep Address',
          type: 'danger',
          icon: '📍'
        });

        if (confirmed) {
          sounds.playPop();
          store.deleteAddress(id);
          ui.showToast({
            title: 'Address Removed',
            message: 'Delivery destination removed from your profile.',
            type: 'info'
          });
          switchAccountTab(container, 'addresses');
        }
      });
    });

    // Set as default
    container.querySelectorAll('.set-default-address-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playSuccess();
        const id = btn.dataset.id;
        store.setDefaultAddress(id);
        ui.showToast({
          title: 'Default Address Updated',
          message: 'This address is now your primary delivery destination.',
          type: 'success'
        });
        switchAccountTab(container, 'addresses');
      });
    });
  }

  // Profile tab actions
  if (tab === 'profile') {
    // Avatar selection
    container.querySelectorAll('.avatar-option-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        sounds.playClick();
        container.querySelectorAll('.avatar-option-thumb').forEach(t => t.classList.remove('is-selected'));
        thumb.classList.add('is-selected');
        const hiddenInput = container.querySelector('#profile-avatar-url');
        if (hiddenInput) hiddenInput.value = thumb.dataset.avatar;
      });
    });

    // Profile form submit
    container.querySelector('#customer-profile-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      sounds.playSuccess();
      const name = container.querySelector('#profile-name')?.value.trim();
      const email = container.querySelector('#profile-email')?.value.trim();
      const phone = container.querySelector('#profile-phone')?.value.trim();
      const avatar = container.querySelector('#profile-avatar-url')?.value;

      store.updateUserProfile({ name, email, phone, avatar });
      ui.showToast({
        title: 'Profile Saved',
        message: 'Your personal details and phone have been updated.',
        type: 'success'
      });
      renderAccountView(container, 'profile');
    });
  }

  // Rewards tab voucher redemption
  if (tab === 'rewards') {
    container.querySelectorAll('.redeem-voucher-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pts = Number(btn.dataset.pts);
        const code = btn.dataset.code;
        const discount = Number(btn.dataset.discount);

        if ((user.points || 0) < pts) {
          sounds.playPop();
          ui.showToast({
            title: 'Insufficient Points',
            message: `You need ${pts} points to redeem this voucher (current balance: ${user.points}).`,
            type: 'error'
          });
          return;
        }

        sounds.playSuccess();
        store.updateCustomerPoints(-pts);
        store.addPromoCode(code, {
          discountPercent: 0,
          discountAmount: discount,
          minOrder: discount * 2,
          description: `VIP Loyalty Voucher ($${discount} Off)`
        });
        store.applyPromo(code);

        ui.showToast({
          title: `Voucher ${code} Unlocked!`,
          message: `$${discount} discount applied directly to your cart.`,
          type: 'success',
          actionText: 'View Cart',
          onAction: () => ui.toggleDrawer('cart-drawer', true)
        });

        renderAccountView(container, 'rewards');
      });
    });
  }
}

/**
 * 5. Address Add / Edit Modal Controller
 */
function setupAddressModal() {
  const modal = document.getElementById('account-address-modal');
  if (!modal || modal.dataset.bound) return;
  modal.dataset.bound = 'true';

  const form = document.getElementById('account-address-form');
  const cancelBtn = document.getElementById('address-modal-cancel-btn');
  const closeBtn = document.getElementById('address-modal-close-btn');

  cancelBtn?.addEventListener('click', () => ui.closeModal('account-address-modal'));
  closeBtn?.addEventListener('click', () => ui.closeModal('account-address-modal'));

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    sounds.playSuccess();

    const id = document.getElementById('modal-address-id')?.value;
    const type = document.getElementById('modal-address-type')?.value.trim();
    const fullName = document.getElementById('modal-address-name')?.value.trim();
    const address = document.getElementById('modal-address-street')?.value.trim();
    const city = document.getElementById('modal-address-city')?.value.trim();
    const region = document.getElementById('modal-address-region')?.value.trim();
    const country = document.getElementById('modal-address-country')?.value;
    const phone = document.getElementById('modal-address-phone')?.value.trim();
    const isDefault = document.getElementById('modal-address-default')?.checked;

    if (id) {
      // Edit
      store.updateAddress(id, { type, fullName, address, city, region, country, phone, isDefault });
      ui.showToast({
        title: 'Address Updated',
        message: `"${type}" delivery address updated.`,
        type: 'success'
      });
    } else {
      // Add
      store.addAddress({ type, fullName, address, city, region, country, phone, isDefault });
      ui.showToast({
        title: 'Address Saved',
        message: `"${type}" added to your saved addresses.`,
        type: 'success'
      });
    }

    ui.closeModal('account-address-modal');
    const mainView = document.getElementById('app-main-view');
    if (mainView && store.state.currentView.page === 'account') {
      renderAccountView(mainView, 'addresses');
    }
  });
}

function openAddressModal(address = null) {
  const modal = document.getElementById('account-address-modal');
  if (!modal) return;

  const isEdit = !!address;
  const title = document.getElementById('address-modal-title');
  if (title) title.textContent = isEdit ? `Edit Address: ${address.type}` : 'Add Delivery Address';

  document.getElementById('modal-address-id').value = isEdit ? address.id : '';
  document.getElementById('modal-address-type').value = isEdit ? address.type : 'Primary Office';
  document.getElementById('modal-address-name').value = isEdit ? address.fullName : (store.state.user?.name || '');
  document.getElementById('modal-address-street').value = isEdit ? address.address : '';
  document.getElementById('modal-address-city').value = isEdit ? address.city : 'Accra';
  document.getElementById('modal-address-region').value = isEdit ? address.region : 'Airport Residential';
  document.getElementById('modal-address-country').value = isEdit ? address.country : 'Ghana';
  document.getElementById('modal-address-phone').value = isEdit ? address.phone : (store.state.user?.phone || '+233 24 555 7788');
  document.getElementById('modal-address-default').checked = isEdit ? Boolean(address.isDefault) : false;

  ui.openModal('account-address-modal');
}

/**
 * 6. Guest Checkpoint Events
 */
function attachGuestAccountEvents(container) {
  container.querySelector('#guest-bread-store')?.addEventListener('click', (e) => {
    e.preventDefault();
    sounds.playClick();
    window.location.hash = '#/catalog';
    store.setView('catalog');
  });

  container.querySelector('#guest-open-login-btn')?.addEventListener('click', () => {
    sounds.playClick();
    openAuthModal('login');
  });

  container.querySelector('#guest-open-reg-btn')?.addEventListener('click', () => {
    sounds.playClick();
    openAuthModal('register');
  });

  container.querySelector('#guest-demo-julian-btn')?.addEventListener('click', () => {
    sounds.playSuccess();
    const user = {
      isLoggedIn: true,
      name: 'Julian Vance',
      email: 'julian.vance@7thjune.com',
      phone: '+233 24 555 7788',
      tier: 'Platinum Titan VIP',
      points: 3450,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      addresses: [
        {
          id: 'addr-1',
          type: 'Primary Office (Ghana)',
          fullName: 'Julian Vance',
          address: '7th June Tech Tower, Suite 400',
          city: 'Accra',
          region: 'Airport Residential Area',
          country: 'Ghana',
          phone: '+233 24 555 7788',
          isDefault: true
        },
        {
          id: 'addr-2',
          type: 'Secondary Dispatch (USA)',
          fullName: 'Julian Vance',
          address: '742 Evergreen Terrace, Suite 800',
          city: 'San Francisco',
          region: 'CA 94107',
          country: 'United States',
          phone: '+1 (415) 890-4321',
          isDefault: false
        }
      ]
    };
    store.setUser(user);
    ui.showToast({
      title: 'Welcome back, Julian!',
      message: 'Signed in as Julian Vance. Order history & addresses ready.',
      type: 'success'
    });
    renderAccountView(container, 'overview');
  });
}

/**
 * 7. Digital Receipt & Tax Invoice Modal Inspector
 */
export function showOrderReceiptModal(order) {
  const content = document.getElementById('receipt-modal-content');
  if (!content) return;

  const { currency } = store.state;

  content.innerHTML = `
    <div class="receipt-card animate-fade-in">
      <div class="receipt-header">
        <div class="receipt-brand">
          <img src="image/7th June logo.png" alt="7th June Computers" class="receipt-logo" />
          <div>
            <h3 class="receipt-company-title">7TH JUNE COMPUTERS</h3>
            <span class="receipt-company-sub">Computing & Gaming Hardware</span>
          </div>
        </div>
        <div class="receipt-title-box">
          <span class="receipt-paid-badge">
            <span class="paid-dot"></span>
            PAYMENT CONFIRMED (MOMO)
          </span>
          <h2 class="receipt-doc-title">TAX INVOICE & RECEIPT</h2>
          <span class="receipt-ref-num">Ref: #${order.orderId}</span>
          <span class="receipt-date-placed">Date: ${order.date}</span>
        </div>
      </div>

      <div class="receipt-divider"></div>

      <!-- Metadata Grid -->
      <div class="receipt-meta-grid">
        <div class="receipt-meta-box">
          <span class="meta-label">Billed To (Client):</span>
          <strong>${order.shippingAddress?.fullName || 'Valued Client'}</strong>
          <span>${order.shippingAddress?.address || 'Private Custody'}</span>
          <span>${order.shippingAddress?.city || 'Accra'}, ${order.shippingAddress?.country || 'Ghana'}</span>
          <span>Phone: ${order.shippingAddress?.phone || '+233 24 555 7788'}</span>
        </div>
        <div class="receipt-meta-box">
          <span class="meta-label">Carrier & Logistics:</span>
          <strong>${order.carrier || 'FedEx Express Courier'}</strong>
          <span>Waybill: <code>${order.trackingNumber}</code></span>
          <span>Status: <strong class="text-blue">${order.status}</strong></span>
        </div>
        <div class="receipt-meta-box">
          <span class="meta-label">Mobile Money Gateway:</span>
          <strong>${order.paymentMethod || 'MTN MoMo'}</strong>
          <span>Transaction ID:</span>
          <code>${order.momoTransactionId || 'MM-TX-984210'}</code>
        </div>
      </div>

      <!-- Line Items Table -->
      <div class="receipt-items-table-wrap">
        <table class="receipt-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Option</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  <strong>${item.name}</strong>
                  <div class="receipt-sku-text">${item.selectedColor || ''}</div>
                </td>
                <td>${item.selectedOption || 'Standard'}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${convertPrice(item.price || (order.subtotal / item.quantity), currency).formatted}</td>
                <td style="text-align: right;"><strong>${convertPrice((item.price || (order.subtotal / item.quantity)) * item.quantity, currency).formatted}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div class="receipt-finance-wrap">
        <div class="receipt-notes-col">
          <div class="receipt-security-note">
            <span class="shield-icon">🛡️</span>
            <div>
              <strong>7th June 6-Month Hardware Protection</strong>
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

      <!-- Actions -->
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
