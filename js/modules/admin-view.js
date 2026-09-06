/**
 * 7th JUNE COMPUTERS - Complete E-Commerce Admin Suite
 * Enterprise Dashboard, Product Catalog CRUD, Inventory Management,
 * Order Fulfillment & MoMo Gateway Tracking, Promo Code Manager, and Store Settings.
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { sounds } from './audio.js';
import { ui } from './ui.js';
import { showOrderReceiptModal } from './account-view.js';
import { CATEGORIES } from '../data/products.js';

let activeAdminTab = 'overview'; // 'overview' | 'products' | 'orders' | 'promos' | 'customers' | 'settings'

export function renderAdminView(container) {
  const { adminSession } = store.state;

  if (!adminSession || !adminSession.isLoggedIn) {
    renderAdminLoginGate(container);
    return;
  }

  renderAdminDashboard(container);
}

/**
 * 1. Admin Security Checkpoint Gate
 */
function renderAdminLoginGate(container) {
  container.innerHTML = `
    <div class="admin-auth-wrapper animate-fade-in">
      <div class="admin-auth-card">
        <div class="admin-auth-header text-center">
          <div class="admin-shield-icon">🛡️</div>
          <h2 class="admin-auth-title">7th June Admin Portal</h2>
          <p class="admin-auth-sub">Restricted access for authorized store managers and system administrators.</p>
        </div>

        <form class="admin-auth-form" id="admin-login-form">
          <div class="form-group">
            <label>Security Admin PIN / Passcode</label>
            <input type="password" class="custom-input" id="admin-pin-input" placeholder="Enter PIN (Demo: 7788)" value="7788" required />
          </div>

          <button type="submit" class="btn btn-primary w-100 btn-lg mt-2" id="admin-submit-pin">
            Unlock Store Administration
          </button>
        </form>

        <div class="auth-demo-divider mt-4">
          <span>OR 1-CLICK QUICK ACCESS</span>
        </div>

        <div class="admin-demo-actions mt-2">
          <button type="button" class="btn btn-secondary w-100" id="admin-quick-demo-btn">
            👑 Sign In as Kwame Blankson (Administrator)
          </button>
          <button type="button" class="btn btn-ghost w-100 mt-2" id="admin-return-store-btn">
            ← Return to Live Customer Store
          </button>
        </div>

        <div class="admin-security-footer">
          <span>🔒 256-bit Encrypted Local Admin Session</span>
        </div>
      </div>
    </div>
  `;

  // PIN Form Submission
  container.querySelector('#admin-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = container.querySelector('#admin-pin-input')?.value.trim();
    if (pin === '7788' || pin.length >= 4) {
      sounds.playSuccess();
      store.setAdminSession(true, {
        name: 'Kwame Blankson',
        role: 'Chief Technology Officer & Administrator',
        email: 'admin@7thjune.com'
      });
      ui.showToast({
        title: 'Admin Session Activated',
        message: 'Welcome back, Kwame Blankson! Admin suite unlocked.',
        type: 'success'
      });
      renderAdminView(container);
    } else {
      sounds.playPop();
      ui.showToast({
        title: 'Access Denied',
        message: 'Invalid Admin PIN. Use demo passcode: 7788',
        type: 'error'
      });
    }
  });

  // 1-Click Demo Admin Login
  container.querySelector('#admin-quick-demo-btn')?.addEventListener('click', () => {
    sounds.playSuccess();
    store.setAdminSession(true, {
      name: 'Kwame Blankson',
      role: 'Chief Technology Officer & Administrator',
      email: 'admin@7thjune.com'
    });
    ui.showToast({
      title: 'Administrator Verified',
      message: 'Logged in as Chief Administrator Kwame Blankson.',
      type: 'success'
    });
    renderAdminView(container);
  });

  // Return to Storefront
  container.querySelector('#admin-return-store-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });
}

/**
 * 2. Main Admin Dashboard Controller & View
 */
function renderAdminDashboard(container) {
  const { adminSession, currency } = store.state;

  container.innerHTML = `
    <div class="admin-portal-wrapper animate-fade-in">
      
      <!-- Top Admin Banner Bar -->
      <div class="admin-top-bar">
        <div class="container admin-top-bar-inner">
          <div class="admin-brand-group">
            <img src="image/7th June logo.png" alt="7th June Logo" class="admin-brand-logo" />
            <div>
              <div class="admin-brand-title">7TH JUNE COMPUTERS • ADMIN SUITE</div>
              <div class="admin-brand-badge">${adminSession.role || 'System Administrator'}</div>
            </div>
          </div>

          <div class="admin-user-controls">
            <button class="btn btn-secondary btn-sm" id="admin-view-storefront-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View Live Store
            </button>
            <div class="admin-user-chip">
              <span class="admin-avatar">KB</span>
              <span class="admin-user-name">${adminSession.name || 'Kwame Blankson'}</span>
            </div>
            <button class="btn btn-ghost btn-sm" id="admin-logout-btn" title="Sign out of Admin">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <!-- Main Admin Body with Navigation Tabs -->
      <div class="container admin-body-container mt-3">
        <div class="admin-nav-tabs">
          <button class="admin-tab-btn ${activeAdminTab === 'overview' ? 'is-active' : ''}" data-tab="overview">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Overview
          </button>
          <button class="admin-tab-btn ${activeAdminTab === 'products' ? 'is-active' : ''}" data-tab="products">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Products & Inventory
          </button>
          <button class="admin-tab-btn ${activeAdminTab === 'orders' ? 'is-active' : ''}" data-tab="orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Orders & MoMo
          </button>
          <button class="admin-tab-btn ${activeAdminTab === 'promos' ? 'is-active' : ''}" data-tab="promos">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Promo Codes
          </button>
          <button class="admin-tab-btn ${activeAdminTab === 'customers' ? 'is-active' : ''}" data-tab="customers">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Customers
          </button>
          <button class="admin-tab-btn ${activeAdminTab === 'settings' ? 'is-active' : ''}" data-tab="settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Store Settings
          </button>
        </div>

        <!-- Dynamic Active Tab Content Container -->
        <div class="admin-pane-container" id="admin-pane-content">
          ${renderActiveAdminPaneContent(activeAdminTab)}
        </div>
      </div>

    </div>
  `;

  attachAdminDashboardEvents(container);
}

/**
 * 3. Render content for the active Tab
 */
function renderActiveAdminPaneContent(tab) {
  switch (tab) {
    case 'overview':
      return renderOverviewTab();
    case 'products':
      return renderProductsTab();
    case 'orders':
      return renderOrdersTab();
    case 'promos':
      return renderPromosTab();
    case 'customers':
      return renderCustomersTab();
    case 'settings':
      return renderSettingsTab();
    default:
      return renderOverviewTab();
  }
}

/**
 * TAB 1: OVERVIEW & REAL-TIME KPIS
 */
function renderOverviewTab() {
  const { products, orders, currency } = store.state;

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const processingCount = orders.filter(o => o.status === 'Processing').length;
  const lowStockProducts = products.filter(p => {
    const sc = Number(p.stockCount !== undefined ? p.stockCount : (p.stock !== undefined ? p.stock : 0));
    return sc > 0 && sc <= 5;
  });
  const outOfStockProducts = products.filter(p => {
    const sc = Number(p.stockCount !== undefined ? p.stockCount : (p.stock !== undefined ? p.stock : 0));
    return sc <= 0 || !p.inStock;
  });

  return `
    <div class="admin-overview-section animate-fade-in">
      
      <!-- KPI Stats Grid -->
      <div class="admin-kpi-grid">
        
        <div class="admin-stat-card">
          <div class="stat-card-top">
            <span class="stat-label">GROSS SALES REVENUE</span>
            <span class="stat-icon-wrap bg-blue-light">💰</span>
          </div>
          <div class="stat-value">${convertPrice(totalRevenue, currency).formatted}</div>
          <div class="stat-trend trend-positive">
            <span>↑ 18.4%</span> vs prior cycle • MoMo verified
          </div>
        </div>

        <div class="admin-stat-card">
          <div class="stat-card-top">
            <span class="stat-label">TOTAL ORDERS</span>
            <span class="stat-icon-wrap bg-purple-light">📑</span>
          </div>
          <div class="stat-value">${totalOrdersCount}</div>
          <div class="stat-trend">
            <span class="badge-accent">${processingCount} Processing / Pending</span>
          </div>
        </div>

        <div class="admin-stat-card">
          <div class="stat-card-top">
            <span class="stat-label">HARDWARE INVENTORY</span>
            <span class="stat-icon-wrap bg-green-light">📦</span>
          </div>
          <div class="stat-value">${products.length} Products</div>
          <div class="stat-trend ${lowStockProducts.length > 0 ? 'text-amber' : 'text-green'}">
            <span>${lowStockProducts.length} low stock</span> • ${outOfStockProducts.length} out of stock
          </div>
        </div>

        <div class="admin-stat-card">
          <div class="stat-card-top">
            <span class="stat-label">PAYMENT CHANNEL</span>
            <span class="stat-icon-wrap bg-yellow-light">📲</span>
          </div>
          <div class="stat-value">100% MoMo</div>
          <div class="stat-trend text-blue">
            MTN MoMo • Telecel Cash • AT Money
          </div>
        </div>

      </div>

      <!-- Quick Action Shortcuts -->
      <div class="admin-quick-shortcuts-row mt-3">
        <button class="btn btn-primary btn-sm" id="quick-add-product-btn">
          + Add New Hardware Product
        </button>
        <button class="btn btn-secondary btn-sm" id="quick-view-orders-btn">
          Review Live Orders (${orders.length})
        </button>
        <button class="btn btn-secondary btn-sm" id="quick-create-promo-btn">
          Create Promo Discount
        </button>
      </div>

      <!-- Recent Customer Orders Table -->
      <div class="admin-card-section mt-4">
        <div class="section-title-row">
          <h3>Recent Customer Transactions</h3>
          <button class="btn btn-ghost btn-sm" id="overview-see-all-orders">View All Orders →</button>
        </div>

        <div class="admin-table-wrap mt-2">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Date</th>
                <th>MoMo Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${orders.slice(0, 5).map(ord => `
                <tr>
                  <td><strong>${ord.orderId}</strong></td>
                  <td>${ord.shippingAddress?.fullName || 'Customer'}</td>
                  <td>${ord.date}</td>
                  <td>
                    <span class="momo-channel-chip">
                      ${ord.paymentMethod || 'Mobile Money'}
                    </span>
                  </td>
                  <td><strong>${convertPrice(ord.total, currency).formatted}</strong></td>
                  <td>
                    <span class="status-badge-chip status-${(ord.status || 'processing').toLowerCase().replace(/\s+/g, '-')}">
                      ${ord.status || 'Processing'}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <button class="btn btn-secondary btn-xs admin-inspect-receipt-btn" data-order-id="${ord.orderId}">
                      Inspect Receipt
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

/**
 * TAB 2: PRODUCTS & INVENTORY MANAGEMENT (CRUD)
 */
function renderProductsTab() {
  const { products, currency } = store.state;

  return `
    <div class="admin-products-section animate-fade-in">
      
      <!-- Top Action Bar -->
      <div class="admin-toolbar-row">
        <div class="toolbar-left">
          <input type="text" class="custom-input custom-input-sm" id="admin-product-search" placeholder="Search title or ID..." />
          <select class="custom-select custom-select-sm" id="admin-product-cat-filter">
            <option value="All">All Categories</option>
            ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="toolbar-right">
          <button class="btn btn-primary" id="admin-open-add-product-btn">
            + Add New Product
          </button>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="admin-table-wrap mt-3">
        <table class="admin-data-table" id="admin-products-table">
          <thead>
            <tr>
              <th style="width: 60px;">Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th style="text-align: center;">Stock</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-products-tbody">
            ${products.map(prod => `
              <tr data-product-id="${prod.id}">
                <td>
                  <img src="${prod.heroImage}" alt="${prod.name}" class="admin-table-thumb" />
                </td>
                <td>
                  <strong>${prod.name}</strong>
                  <div class="admin-sku-label">ID: ${prod.id}</div>
                </td>
                <td><span class="category-pill">${prod.category}</span></td>
                <td>
                  <strong>${convertPrice(prod.price, currency).formatted}</strong>
                  ${prod.originalPrice ? `<span class="original-price-sub">${convertPrice(prod.originalPrice, currency).formatted}</span>` : ''}
                </td>
                <td style="text-align: center;">
                  <div class="stock-adjust-stepper">
                    <button class="stepper-btn stock-dec-btn" data-id="${prod.id}">-</button>
                    <span class="stock-number">${prod.stockCount !== undefined ? prod.stockCount : (prod.stock !== undefined ? prod.stock : 0)}</span>
                    <button class="stepper-btn stock-inc-btn" data-id="${prod.id}">+</button>
                  </div>
                </td>
                <td>
                  ${Number(prod.stockCount !== undefined ? prod.stockCount : (prod.stock !== undefined ? prod.stock : 0)) > 5 ? `
                    <span class="stock-pill stock-pill-ok">In Stock</span>
                  ` : Number(prod.stockCount !== undefined ? prod.stockCount : (prod.stock !== undefined ? prod.stock : 0)) > 0 ? `
                    <span class="stock-pill stock-pill-low">Low Stock (${prod.stockCount !== undefined ? prod.stockCount : prod.stock})</span>
                  ` : `
                    <span class="stock-pill stock-pill-out">Out of Stock</span>
                  `}
                </td>
                <td style="text-align: right;">
                  <div class="admin-action-btn-group">
                    <button class="btn btn-secondary btn-xs admin-edit-prod-btn" data-id="${prod.id}">
                      Edit
                    </button>
                    <button class="btn btn-danger-ghost btn-xs admin-del-prod-btn" data-id="${prod.id}">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}

/**
 * TAB 3: ORDERS & MOMO FULFILLMENT
 */
function renderOrdersTab() {
  const { orders, currency } = store.state;

  return `
    <div class="admin-orders-section animate-fade-in">
      
      <!-- Filter Bar -->
      <div class="admin-toolbar-row">
        <div class="toolbar-left">
          <input type="text" class="custom-input custom-input-sm" id="admin-order-search" placeholder="Search Order ID, Name, Phone..." />
          <select class="custom-select custom-select-sm" id="admin-order-status-filter">
            <option value="All">All Statuses (${orders.length})</option>
            <option value="Processing">Processing</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="admin-table-wrap mt-3">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer & Destination</th>
              <th>MoMo Gateway</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Fulfillment Status</th>
              <th style="text-align: right;">Receipt</th>
            </tr>
          </thead>
          <tbody id="admin-orders-tbody">
            ${orders.map(order => `
              <tr data-order-id="${order.orderId}">
                <td>
                  <strong>${order.orderId}</strong>
                  <div class="admin-sku-label">${order.date}</div>
                  <div class="admin-sku-label">Track: ${order.trackingNumber || 'N/A'}</div>
                </td>
                <td>
                  <strong>${order.shippingAddress?.fullName || 'Customer'}</strong>
                  <div class="admin-sub-text">${order.shippingAddress?.address || ''}</div>
                  <div class="admin-sub-text">Tel: ${order.shippingAddress?.phone || order.momoPhone || 'N/A'}</div>
                </td>
                <td>
                  <div class="momo-admin-cell">
                    <span class="momo-tag-icon">📲</span>
                    <div>
                      <strong>${order.paymentMethod || 'Mobile Money'}</strong>
                      ${order.momoTransactionId ? `<div class="admin-sub-text">Ref: ${order.momoTransactionId}</div>` : ''}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="order-items-snippet">
                    ${order.items ? order.items.map(i => `${i.name} (x${i.quantity})`).join(', ') : '1 Item'}
                  </div>
                </td>
                <td>
                  <strong>${convertPrice(order.total, currency).formatted}</strong>
                </td>
                <td>
                  <select class="admin-status-select" data-order-id="${order.orderId}">
                    <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="In Transit" ${order.status === 'In Transit' ? 'selected' : ''}>In Transit</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                  </select>
                </td>
                <td style="text-align: right;">
                  <button class="btn btn-secondary btn-xs admin-inspect-receipt-btn" data-order-id="${order.orderId}">
                    Inspect Receipt
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}

/**
 * TAB 4: PROMO CODES & DISCOUNTS
 */
function renderPromosTab() {
  const promoCodes = store.state.promoCodes || {};
  const entries = Object.entries(promoCodes);

  return `
    <div class="admin-promos-section animate-fade-in">
      
      <div class="admin-two-col-grid">
        
        <!-- Left: Create Promo Code Form -->
        <div class="admin-card-section">
          <h3>Create New Promotional Code</h3>
          <p class="section-desc">Codes take effect immediately across all customer checkout sessions.</p>

          <form class="admin-form mt-3" id="admin-create-promo-form">
            <div class="form-group">
              <label>Promo Code (e.g. TECH15)</label>
              <input type="text" class="custom-input" id="new-promo-code" placeholder="ACCRA25" required style="text-transform: uppercase;" />
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Discount Type</label>
                <select class="custom-select" id="new-promo-type">
                  <option value="percent">Percentage Off (%)</option>
                  <option value="shipping">Free Shipping</option>
                </select>
              </div>
              <div class="form-group flex-1" id="new-promo-val-group">
                <label>Discount Percentage (%)</label>
                <input type="number" class="custom-input" id="new-promo-val" min="1" max="90" placeholder="15" value="15" />
              </div>
            </div>

            <div class="form-group">
              <label>Description / Public Note</label>
              <input type="text" class="custom-input" id="new-promo-desc" placeholder="Special Storewide Offer" value="15% Off All Computer Peripherals" required />
            </div>

            <button type="submit" class="btn btn-primary w-100 mt-3">
              Activate Promo Code
            </button>
          </form>
        </div>

        <!-- Right: Active Promo Codes Table -->
        <div class="admin-card-section">
          <div class="section-title-row">
            <h3>Active Store Promotional Codes (${entries.length})</h3>
          </div>

          <div class="admin-table-wrap mt-3">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Benefit</th>
                  <th>Description</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${entries.map(([code, p]) => `
                  <tr>
                    <td><strong class="promo-badge">${code}</strong></td>
                    <td>${p.freeShipping ? 'Free Shipping' : `${p.discountPercent}% OFF`}</td>
                    <td><span class="admin-sub-text">${p.description}</span></td>
                    <td style="text-align: right;">
                      <button class="btn btn-danger-ghost btn-xs admin-del-promo-btn" data-code="${code}">
                        Delete
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `;
}

/**
 * TAB 5: CUSTOMER MANAGEMENT & LOYALTY
 */
function renderCustomersTab() {
  const { user, orders, currency } = store.state;

  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return `
    <div class="admin-customers-section animate-fade-in">
      <div class="admin-card-section">
        <h3>Registered Client Concierge Accounts</h3>
        <p class="section-desc">Manage customer loyalty points, order frequencies, and VIP sovereign tiers.</p>

        <div class="admin-table-wrap mt-3">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Membership Tier</th>
                <th>Loyalty Balance</th>
                <th>Orders Placed</th>
                <th>Total Spent</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="customer-info-cell">
                    <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" alt="${user.name}" class="customer-avatar-sm" />
                    <strong>${user.name}</strong>
                  </div>
                </td>
                <td>${user.email}</td>
                <td><span class="tier-pill">${user.tier || '7th June Gold Member'}</span></td>
                <td><strong>${(user.points || 0).toLocaleString()} PTS</strong></td>
                <td>${orders.length} orders</td>
                <td><strong>${convertPrice(totalSpent, currency).formatted}</strong></td>
                <td style="text-align: right;">
                  <button class="btn btn-secondary btn-xs admin-bonus-pts-btn" data-pts="500">
                    + 500 Bonus Pts
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

/**
 * TAB 6: STORE & MOMO GATEWAY SETTINGS
 */
function renderSettingsTab() {
  return `
    <div class="admin-settings-section animate-fade-in">
      <div class="admin-two-col-grid">
        
        <!-- Store Information -->
        <div class="admin-card-section">
          <h3>Store Profile & Official Registry</h3>
          <div class="admin-form mt-3">
            <div class="form-group">
              <label>Company Legal Name</label>
              <input type="text" class="custom-input" value="7th June Computers Ltd." readonly />
            </div>
            <div class="form-group">
              <label>Physical Address (Ghana)</label>
              <input type="text" class="custom-input" value="Tech Tower, 4th Floor, Airport Residential Area, Accra, Ghana" readonly />
            </div>
            <div class="form-group">
              <label>Ghana VAT Registry ID</label>
              <input type="text" class="custom-input" value="GH-94810294-A" readonly />
            </div>
            <div class="form-group">
              <label>Support Email</label>
              <input type="text" class="custom-input" value="support@7thjune.com" readonly />
            </div>
          </div>
        </div>

        <!-- MoMo Payment Gateway Config -->
        <div class="admin-card-section">
          <h3>Ghana Mobile Money (MoMo) Settings</h3>
          <p class="section-desc">Configured as the exclusive live payment gateway for 7th June checkout.</p>

          <div class="momo-config-card mt-3">
            <div class="momo-status-banner">
              <span class="status-dot"></span>
              <strong>MoMo USSD Push Gateway: ACTIVE & VERIFIED</strong>
            </div>

            <div class="form-group mt-3">
              <label>Merchant MoMo Payout / Notification Number</label>
              <input type="text" class="custom-input" value="+233 24 555 7788" id="admin-momo-merchant-phone" />
            </div>

            <div class="mt-3">
              <label class="d-block mb-1">Supported Networks</label>
              <div class="momo-network-status-list">
                <div class="momo-net-row">🟡 MTN Mobile Money (Active)</div>
                <div class="momo-net-row">🔴 Telecel Cash (Active)</div>
                <div class="momo-net-row">🔵 AT Money (Active)</div>
              </div>
            </div>

            <div class="admin-danger-box mt-4">
              <h4>System Reset & Maintenance</h4>
              <p>Restore default products catalog and factory promotions seed.</p>
              <button class="btn btn-secondary btn-sm mt-2" id="admin-reset-demo-btn">
                Reset to Factory Catalog Seed
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

/**
 * 4. Attach Event Listeners to Dashboard Components
 */
function attachAdminDashboardEvents(container) {
  // Return to Storefront
  container.querySelector('#admin-view-storefront-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });

  // Admin Logout
  container.querySelector('#admin-logout-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setAdminSession(false);
    ui.showToast({
      title: 'Signed Out',
      message: 'Admin session closed securely.',
      type: 'info'
    });
    renderAdminView(container);
  });

  // Tab Navigation Switcher
  container.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const tab = btn.dataset.tab;
      activeAdminTab = tab;
      container.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const pane = container.querySelector('#admin-pane-content');
      if (pane) {
        pane.innerHTML = renderActiveAdminPaneContent(tab);
        attachPaneSpecificEvents(container, tab);
      }
    });
  });

  attachPaneSpecificEvents(container, activeAdminTab);
}

/**
 * 5. Attach Events Specific to the Active Pane
 */
function attachPaneSpecificEvents(container, tab) {
  // Inspect Receipt on Orders & Overview
  container.querySelectorAll('.admin-inspect-receipt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const orderId = btn.dataset.orderId;
      const order = store.state.orders.find(o => o.orderId === orderId);
      if (order) {
        showOrderReceiptModal(order);
      }
    });
  });

  // Quick Shortcuts on Overview Tab
  container.querySelector('#quick-add-product-btn')?.addEventListener('click', () => {
    openProductModal();
  });
  container.querySelector('#quick-view-orders-btn')?.addEventListener('click', () => {
    switchToTab(container, 'orders');
  });
  container.querySelector('#quick-create-promo-btn')?.addEventListener('click', () => {
    switchToTab(container, 'promos');
  });
  container.querySelector('#overview-see-all-orders')?.addEventListener('click', () => {
    switchToTab(container, 'orders');
  });

  // Products Tab Actions
  if (tab === 'products') {
    container.querySelector('#admin-open-add-product-btn')?.addEventListener('click', () => {
      openProductModal();
    });

    // Stock Stepper Increment
    container.querySelectorAll('.stock-inc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playPop();
        const id = btn.dataset.id;
        store.adjustProductStock(id, 1);
        container.querySelector('#admin-pane-content').innerHTML = renderProductsTab();
        attachPaneSpecificEvents(container, 'products');
      });
    });

    // Stock Stepper Decrement
    container.querySelectorAll('.stock-dec-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playPop();
        const id = btn.dataset.id;
        store.adjustProductStock(id, -1);
        container.querySelector('#admin-pane-content').innerHTML = renderProductsTab();
        attachPaneSpecificEvents(container, 'products');
      });
    });

    // Edit Product Button
    container.querySelectorAll('.admin-edit-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const prod = store.state.products.find(p => p.id === id);
        if (prod) openProductModal(prod);
      });
    });

    // Delete Product Button
    container.querySelectorAll('.admin-del-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const prod = store.state.products.find(p => p.id === id);
        if (prod && confirm(`Delete "${prod.name}" permanently from the catalog?`)) {
          sounds.playSuccess();
          store.deleteProduct(id);
          ui.showToast({
            title: 'Product Deleted',
            message: `"${prod.name}" was removed from the store catalog.`,
            type: 'info'
          });
          container.querySelector('#admin-pane-content').innerHTML = renderProductsTab();
          attachPaneSpecificEvents(container, 'products');
        }
      });
    });

    // Category Filter in Products Table
    const catFilter = container.querySelector('#admin-product-cat-filter');
    const searchInput = container.querySelector('#admin-product-search');
    const filterProductsTable = () => {
      const query = searchInput?.value.toLowerCase().trim() || '';
      const cat = catFilter?.value || 'All';
      const rows = container.querySelectorAll('#admin-products-tbody tr');

      rows.forEach(row => {
        const prodId = row.dataset.productId;
        const prod = store.state.products.find(p => p.id === prodId);
        if (!prod) return;

        const matchQuery = !query || prod.name.toLowerCase().includes(query) || prod.id.toLowerCase().includes(query);
        const matchCat = cat === 'All' || prod.category === cat;

        row.style.display = (matchQuery && matchCat) ? '' : 'none';
      });
    };

    catFilter?.addEventListener('change', filterProductsTable);
    searchInput?.addEventListener('input', filterProductsTable);
  }

  // Orders Tab Status Update Dropdown
  if (tab === 'orders') {
    container.querySelectorAll('.admin-status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        sounds.playSuccess();
        const orderId = select.dataset.orderId;
        const newStatus = e.target.value;
        store.updateOrderStatus(orderId, newStatus);
        ui.showToast({
          title: `Order #${orderId} Updated`,
          message: `Fulfillment status changed to "${newStatus}".`,
          type: 'success'
        });
      });
    });

    // Orders Filter
    const orderSearch = container.querySelector('#admin-order-search');
    const statusFilter = container.querySelector('#admin-order-status-filter');
    const filterOrders = () => {
      const q = orderSearch?.value.toLowerCase().trim() || '';
      const status = statusFilter?.value || 'All';
      const rows = container.querySelectorAll('#admin-orders-tbody tr');

      rows.forEach(row => {
        const ordId = row.dataset.orderId;
        const ord = store.state.orders.find(o => o.orderId === ordId);
        if (!ord) return;

        const matchQ = !q ||
          ord.orderId.toLowerCase().includes(q) ||
          (ord.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
          (ord.shippingAddress?.phone || '').includes(q) ||
          (ord.trackingNumber || '').toLowerCase().includes(q);

        const matchStatus = status === 'All' || ord.status === status;

        row.style.display = (matchQ && matchStatus) ? '' : 'none';
      });
    };

    orderSearch?.addEventListener('input', filterOrders);
    statusFilter?.addEventListener('change', filterOrders);
  }

  // Promo Codes Tab Actions
  if (tab === 'promos') {
    const form = container.querySelector('#admin-create-promo-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = container.querySelector('#new-promo-code')?.value.trim().toUpperCase();
      const type = container.querySelector('#new-promo-type')?.value;
      const val = Number(container.querySelector('#new-promo-val')?.value) || 10;
      const desc = container.querySelector('#new-promo-desc')?.value.trim();

      if (!code) return;

      const promoData = type === 'shipping'
        ? { freeShipping: true, description: desc || 'Free Express Shipping' }
        : { discountPercent: val, description: desc || `${val}% Storewide Discount` };

      store.addPromoCode(code, promoData);
      sounds.playSuccess();
      ui.showToast({
        title: `Code ${code} Activated`,
        message: `Customers can now use promo code ${code} at checkout.`,
        type: 'success'
      });

      container.querySelector('#admin-pane-content').innerHTML = renderPromosTab();
      attachPaneSpecificEvents(container, 'promos');
    });

    // Delete promo
    container.querySelectorAll('.admin-del-promo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        if (confirm(`Deactivate promo code "${code}"?`)) {
          sounds.playPop();
          store.deletePromoCode(code);
          ui.showToast({
            title: `Code ${code} Removed`,
            message: `Promo code ${code} deactivated.`,
            type: 'info'
          });
          container.querySelector('#admin-pane-content').innerHTML = renderPromosTab();
          attachPaneSpecificEvents(container, 'promos');
        }
      });
    });
  }

  // Customers Tab Bonus Points Action
  if (tab === 'customers') {
    container.querySelectorAll('.admin-bonus-pts-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playSuccess();
        const pts = Number(btn.dataset.pts) || 500;
        store.updateCustomerPoints(pts);
        ui.showToast({
          title: 'Reward Points Credited',
          message: `Added +${pts} loyalty points to Julian Vance.`,
          type: 'success'
        });
        container.querySelector('#admin-pane-content').innerHTML = renderCustomersTab();
        attachPaneSpecificEvents(container, 'customers');
      });
    });
  }

  // Settings Tab
  if (tab === 'settings') {
    container.querySelector('#admin-reset-demo-btn')?.addEventListener('click', () => {
      if (confirm('Reset catalog and promo codes to default factory settings?')) {
        sounds.playSuccess();
        store.resetStoreData();
        ui.showToast({
          title: 'Factory Data Restored',
          message: 'Product catalog & demo promo codes reset to original state.',
          type: 'success'
        });
        container.querySelector('#admin-pane-content').innerHTML = renderSettingsTab();
        attachPaneSpecificEvents(container, 'settings');
      }
    });
  }
}

function switchToTab(container, tabName) {
  activeAdminTab = tabName;
  container.querySelectorAll('.admin-tab-btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.tab === tabName);
  });
  const pane = container.querySelector('#admin-pane-content');
  if (pane) {
    pane.innerHTML = renderActiveAdminPaneContent(tabName);
    attachPaneSpecificEvents(container, tabName);
  }
}

/**
 * 6. Product Add / Edit Modal Controller
 */
export function openProductModal(product = null) {
  const modal = document.getElementById('admin-product-modal');
  if (!modal) return;

  const isEdit = !!product;
  const modalTitle = document.getElementById('admin-prod-modal-title');
  if (modalTitle) {
    modalTitle.textContent = isEdit ? `Edit: ${product.name}` : 'Add New Hardware Product';
  }

  // Prepopulate form fields
  document.getElementById('modal-prod-id').value = isEdit ? product.id : '';
  document.getElementById('modal-prod-name').value = isEdit ? product.name : '';
  document.getElementById('modal-prod-price').value = isEdit ? product.price : '199';
  document.getElementById('modal-prod-orig-price').value = isEdit ? (product.originalPrice || '') : '249';
  document.getElementById('modal-prod-stock').value = isEdit ? (product.stockCount !== undefined ? product.stockCount : (product.stock !== undefined ? product.stock : 15)) : '20';
  document.getElementById('modal-prod-category').value = isEdit ? product.category : (CATEGORIES[1] || 'Keyboards & Keycaps');
  document.getElementById('modal-prod-badge').value = isEdit ? (product.badge || 'NEW') : 'NEW';
  document.getElementById('modal-prod-img').value = isEdit ? product.heroImage : 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85';
  document.getElementById('modal-prod-desc').value = isEdit ? product.description : 'High-precision engineering mastercraft hardware with quantum response.';

  ui.openModal('admin-product-modal');

  // Submit Handler
  const form = document.getElementById('admin-product-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('modal-prod-id').value;
    const name = document.getElementById('modal-prod-name').value.trim();
    const price = Number(document.getElementById('modal-prod-price').value);
    const originalPrice = Number(document.getElementById('modal-prod-orig-price').value) || null;
    const stockCount = Number(document.getElementById('modal-prod-stock').value) || 0;
    const category = document.getElementById('modal-prod-category').value;
    const badge = document.getElementById('modal-prod-badge').value.trim();
    const heroImage = document.getElementById('modal-prod-img').value.trim();
    const description = document.getElementById('modal-prod-desc').value.trim();

    if (id) {
      // Edit Existing
      store.updateProduct(id, {
        name,
        price,
        originalPrice,
        stockCount,
        category,
        badge,
        heroImage,
        description
      });
      ui.showToast({
        title: 'Product Updated',
        message: `"${name}" updated successfully.`,
        type: 'success'
      });
    } else {
      // Add New
      store.addProduct({
        name,
        price,
        originalPrice,
        stockCount,
        category,
        badge,
        heroImage,
        description
      });
      ui.showToast({
        title: 'Product Created',
        message: `"${name}" added to 7th June catalog.`,
        type: 'success'
      });
    }

    sounds.playSuccess();
    ui.closeModal('admin-product-modal');

    // Refresh active admin pane
    const mainContainer = document.getElementById('app-main-view');
    if (mainContainer && store.state.currentView.page === 'admin') {
      renderAdminView(mainContainer);
    }
  };

  document.getElementById('admin-prod-modal-close')?.addEventListener('click', () => {
    ui.closeModal('admin-product-modal');
  });
}
