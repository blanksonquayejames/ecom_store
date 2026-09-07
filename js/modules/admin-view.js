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
import { openAuthModal } from './auth-modal.js';
import { CATEGORIES } from '../data/products.js';

let activeAdminTab = 'overview'; // 'overview' | 'products' | 'orders' | 'promos' | 'customers' | 'settings'

function getTabLabel(tab) {
  switch (tab) {
    case 'overview': return 'Overview & Analytics';
    case 'products': return 'Products & Inventory';
    case 'orders': return 'Orders & MoMo Gateway';
    case 'promos': return 'Promo Codes & Discounts';
    case 'customers': return 'Customer Loyalty & Accounts';
    case 'settings': return 'Store Settings & Operations';
    default: return 'Overview';
  }
}

export function renderAdminView(container, subTab = null) {
  const { user, currentView } = store.state;
  if (subTab) {
    activeAdminTab = subTab;
  } else if (currentView && currentView.tab) {
    activeAdminTab = currentView.tab;
  }

  const isAdmin = Boolean(user && user.isLoggedIn && user.role === 'admin');
  if (!isAdmin) {
    renderAdminLoginGate(container);
    return;
  }

  renderAdminDashboard(container);
}

/**
 * 1. Admin Security Checkpoint Gate (Role-based User Auth)
 */
function renderAdminLoginGate(container) {
  const { user } = store.state;
  const isCustomerLoggedIn = Boolean(user && user.isLoggedIn);

  container.innerHTML = `
    <div class="admin-auth-wrapper animate-fade-in">
      <div class="admin-auth-card">
        <div class="admin-auth-header text-center">
          <div class="admin-shield-icon">🛡️</div>
          <h2 class="admin-auth-title">Administrator Portal</h2>
          <p class="admin-auth-sub">Enterprise access restricted exclusively to authenticated Store Administrators.</p>
        </div>

        <div class="admin-gate-status-card mb-3">
          <div class="gate-status-avatar">
            <img src="${(user && user.avatar) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}" alt="User Avatar" />
          </div>
          <div class="gate-status-text">
            <span class="gate-status-label">Current Account State</span>
            <strong class="gate-status-name">${isCustomerLoggedIn ? user.name : 'Guest Shopper'}</strong>
            <span class="gate-status-badge ${isCustomerLoggedIn ? 'badge-customer' : 'badge-guest'}">
              ${isCustomerLoggedIn ? (user.tier || 'Customer Account') : 'Unauthenticated Guest'}
            </span>
          </div>
        </div>

        <div class="admin-gate-prompt-text text-center mb-3">
          ${isCustomerLoggedIn 
            ? `Your current account (<strong>${user.name}</strong>) is a Customer profile and lacks Administrator clearance. Sign in with an Administrator account to access store management.` 
            : `You are currently browsing as a guest. Please sign in with an Administrator profile to access the store management console.`
          }
        </div>

        <div class="admin-gate-actions">
          <button type="button" class="btn btn-primary w-100 btn-lg" id="admin-gate-login-admin-btn">
            👑 Sign In as Administrator (Kwame Blankson)
          </button>
          
          <button type="button" class="btn btn-secondary w-100 mt-2" id="admin-gate-open-modal-btn">
            🔑 Sign In with User Account
          </button>

          <button type="button" class="btn btn-ghost w-100 mt-2" id="admin-return-store-btn">
            ← Return to Live Customer Store
          </button>
        </div>

        <div class="admin-security-footer mt-4">
          <span>🔒 Role-Based Access Control • Verified Admin Session</span>
        </div>
      </div>
    </div>
  `;

  // 1-Click Authenticate as Admin Kwame Blankson
  container.querySelector('#admin-gate-login-admin-btn')?.addEventListener('click', () => {
    sounds.playSuccess();
    const adminUser = {
      isLoggedIn: true,
      role: 'admin',
      name: 'Kwame Blankson',
      email: 'admin@7thjune.com',
      phone: '+233 24 555 8899',
      tier: 'Chief Technology Officer & Administrator',
      points: 9999,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      addresses: [
        {
          id: 'addr-admin-1',
          type: '7th June Headquarters (Vault)',
          fullName: 'Kwame Blankson (Admin)',
          address: '7th June Tech Tower, Suite 400',
          city: 'Accra',
          region: 'Airport Residential Area',
          country: 'Ghana',
          phone: '+233 24 555 8899',
          isDefault: true
        }
      ]
    };
    store.setUser(adminUser);
    ui.showToast({
      title: 'Administrator Verified',
      message: 'Logged in as Chief Administrator Kwame Blankson.',
      type: 'success'
    });
    renderAdminView(container, activeAdminTab);
  });

  // Open the standard user authentication modal
  container.querySelector('#admin-gate-open-modal-btn')?.addEventListener('click', () => {
    sounds.playClick();
    openAuthModal('login');
  });

  // Return to Storefront
  container.querySelector('#admin-return-store-btn')?.addEventListener('click', () => {
    sounds.playClick();
    window.location.hash = '#/catalog';
    store.setView('catalog');
  });
}

/**
 * 2. Main Admin Dashboard Controller & View
 */
function renderAdminDashboard(container) {
  const { user, products, orders, promoCodes } = store.state;
  const adminName = (user && user.name) || 'Kwame Blankson';
  const adminRole = (user && user.tier) || 'Chief Technology Officer & Administrator';
  const initials = adminName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'KB';

  container.innerHTML = `
    <div class="admin-portal-wrapper animate-fade-in">
      
      <!-- Top Executive Admin Bar -->
      <div class="admin-top-bar">
        <div class="container admin-top-bar-inner">
          <div class="admin-brand-group">
            <img src="image/7th June logo.png" alt="7th June Logo" class="admin-brand-logo" />
            <div>
              <div class="admin-brand-title">7TH JUNE COMPUTERS • ENTERPRISE CONSOLE</div>
              <div class="admin-system-status">
                <span class="status-live-dot"></span>
                <span>Production Live • MoMo Gateway Active</span>
              </div>
            </div>
          </div>

          <div class="admin-user-controls">
            <button class="btn btn-secondary btn-sm" id="admin-view-storefront-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Return to Live Store</span>
            </button>
            <div class="admin-user-chip" title="${adminRole}">
              <span class="admin-avatar">${initials}</span>
              <div class="admin-user-text">
                <span class="admin-user-name">${adminName}</span>
                <span class="admin-user-role-sub">${adminRole}</span>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" id="admin-logout-btn" title="Sign out of Admin Session">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <!-- Main Admin Body with Breadcrumbs & Tabs -->
      <div class="container admin-body-container mt-3">
        
        <!-- Interactive Breadcrumbs -->
        <nav class="admin-breadcrumb-nav mb-3" aria-label="Admin Navigation Breadcrumb">
          <a href="#/catalog" class="admin-breadcrumb-link" id="admin-bread-store">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Storefront
          </a>
          <span class="breadcrumb-sep">/</span>
          <a href="#/admin/overview" class="admin-breadcrumb-link" id="admin-bread-console">Admin Console</a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-active" id="admin-active-breadcrumb">${getTabLabel(activeAdminTab)}</span>
        </nav>

        <div class="admin-nav-tabs">
          <button class="admin-tab-btn ${activeAdminTab === 'overview' ? 'is-active' : ''}" data-tab="overview">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Overview</span>
          </button>
          <button class="admin-tab-btn ${activeAdminTab === 'products' ? 'is-active' : ''}" data-tab="products">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Products & Inventory</span>
            <span class="admin-tab-badge">${products.length}</span>
          </button>
          <button class="admin-tab-btn ${activeAdminTab === 'orders' ? 'is-active' : ''}" data-tab="orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span>Orders & MoMo</span>
            <span class="admin-tab-badge">${orders.length}</span>
          </button>
          <button class="admin-tab-btn ${activeAdminTab === 'promos' ? 'is-active' : ''}" data-tab="promos">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>Promo Codes</span>
            <span class="admin-tab-badge">${Object.keys(promoCodes).length}</span>
          </button>
          <button class="admin-tab-btn ${activeAdminTab === 'customers' ? 'is-active' : ''}" data-tab="customers">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Customers</span>
            <span class="admin-tab-badge">1 VIP</span>
          </button>
          <button class="admin-tab-btn ${activeAdminTab === 'settings' ? 'is-active' : ''}" data-tab="settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Store Settings</span>
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
                  <span class="admin-stock-qty-display ${Number(prod.stockCount !== undefined ? prod.stockCount : (prod.stock !== undefined ? prod.stock : 0)) <= 5 ? (Number(prod.stockCount !== undefined ? prod.stockCount : (prod.stock !== undefined ? prod.stock : 0)) === 0 ? 'stock-zero' : 'stock-low') : 'stock-normal'}">
                    <strong>${prod.stockCount !== undefined ? prod.stockCount : (prod.stock !== undefined ? prod.stock : 0)}</strong>
                    <span class="stock-unit-label">units</span>
                  </span>
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
  container.querySelector('#admin-logout-btn')?.addEventListener('click', async () => {
    const confirmed = await ui.confirm({
      title: 'Exit Admin Console & Sign Out?',
      message: 'Are you sure you want to end your executive administrative session?',
      subMessage: 'All catalog and inventory updates are saved. You will return to the live storefront as a guest.',
      confirmText: 'Sign Out of Admin',
      cancelText: 'Stay in Console',
      type: 'warning',
      icon: '🛡️'
    });

    if (!confirmed) return;

    sounds.playClick();
    store.logout();
    ui.showToast({
      title: 'Signed Out',
      message: 'Admin session closed securely. Returned to live storefront.',
      type: 'info'
    });
    window.location.hash = '#/catalog';
    store.setView('catalog');
  });

  // Breadcrumb Store Link
  container.querySelector('#admin-bread-store')?.addEventListener('click', (e) => {
    e.preventDefault();
    sounds.playClick();
    window.location.hash = '#/catalog';
    store.setView('catalog');
  });

  // Breadcrumb Console Link
  container.querySelector('#admin-bread-console')?.addEventListener('click', (e) => {
    e.preventDefault();
    sounds.playClick();
    switchToTab(container, 'overview');
  });

  // Tab Navigation Switcher
  container.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const tab = btn.dataset.tab;
      switchToTab(container, tab);
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
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const prod = store.state.products.find(p => p.id === id);
        if (!prod) return;

        const confirmed = await ui.confirm({
          title: 'Delete Hardware Product?',
          message: `Are you sure you want to permanently delete <strong>"${prod.name}"</strong> from the store catalog?`,
          subMessage: 'This hardware item will be removed immediately from public listings, category shelves, and customer wishlists.',
          confirmText: 'Permanently Delete',
          cancelText: 'Keep Product',
          type: 'danger',
          icon: '🗑️'
        });

        if (confirmed) {
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
      btn.addEventListener('click', async () => {
        const code = btn.dataset.code;
        const confirmed = await ui.confirm({
          title: 'Deactivate Promo Code?',
          message: `Are you sure you want to deactivate discount code <strong>"${code}"</strong>?`,
          subMessage: 'Customers will no longer be able to claim discounts with this voucher code at checkout.',
          confirmText: 'Deactivate Code',
          cancelText: 'Keep Active',
          type: 'danger',
          icon: '🏷️'
        });

        if (confirmed) {
          sounds.playPop();
          store.deletePromoCode(code);
          ui.showToast({
            title: `Code ${code} Deactivated`,
            message: `Promo code ${code} was deactivated from checkout.`,
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
    container.querySelector('#admin-reset-demo-btn')?.addEventListener('click', async () => {
      const confirmed = await ui.confirm({
        title: 'Restore Factory Defaults?',
        message: 'Are you sure you want to reset the store catalog and promo codes to default factory settings?',
        subMessage: 'All newly added products, edited specifications, and custom discounts will be reverted.',
        confirmText: 'Restore Defaults',
        cancelText: 'Cancel',
        type: 'danger',
        icon: '⚠️'
      });

      if (confirmed) {
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
  window.location.hash = `#/admin/${tabName}`;
  container.querySelectorAll('.admin-tab-btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.tab === tabName);
  });
  const breadcrumbActive = container.querySelector('#admin-active-breadcrumb');
  if (breadcrumbActive) {
    breadcrumbActive.textContent = getTabLabel(tabName);
  }
  const pane = container.querySelector('#admin-pane-content');
  if (pane) {
    pane.innerHTML = renderActiveAdminPaneContent(tabName);
    attachPaneSpecificEvents(container, tabName);
  }
}

/**
 * Hardware Preset Library for 1-Click Fast Fill
 */
const HARDWARE_PRESETS = [
  {
    name: 'ApexPro Magnetic Keyboard',
    category: 'Keyboards & Keycaps',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'ViperStrike 8K Optical Mouse',
    category: 'Mice & Precision',
    url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'Acoustic Studio Headset',
    category: 'Audio & Headsets',
    url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'UltraWide OLED Gaming Display',
    category: 'Monitors & Mounts',
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'Precision Desk Mat Desk Pad',
    category: 'Desk Setup & Mats',
    url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'Thunderbolt Quad Workstation Dock',
    category: 'Hubs & Docks',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=85'
  }
];

/**
 * Client-Side Canvas Image Compression Helper
 * Resizes large camera/phone photos to max 1200px and converts to optimized Data URL
 * to avoid browser localStorage quota exhaustion.
 */
function compressAndReadImage(file, maxWidth = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl,
          fileName: file.name,
          fileSize: `${Math.round(dataUrl.length * 0.75 / 1024)} KB`,
          originalSize: `${Math.round(file.size / 1024)} KB`
        });
      };
      img.onerror = () => {
        resolve({
          dataUrl: e.target.result,
          fileName: file.name,
          fileSize: `${Math.round(file.size / 1024)} KB`,
          originalSize: `${Math.round(file.size / 1024)} KB`
        });
      };
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Controller for Product Photography Drag-and-Drop Image Uploader
 */
function setupProductImageDropzone() {
  const dropzone = document.getElementById('modal-prod-dropzone');
  if (!dropzone) return;

  const fileInput = document.getElementById('modal-prod-file-input');
  const browseBtn = document.getElementById('modal-prod-browse-btn');
  const replaceBtn = document.getElementById('dropzone-replace-btn');
  const removeBtn = document.getElementById('dropzone-remove-btn');
  const hiddenInput = document.getElementById('modal-prod-img');
  const emptyState = document.getElementById('dropzone-empty-state');
  const previewState = document.getElementById('dropzone-preview-state');
  const previewImg = document.getElementById('modal-prod-preview-img');
  const filenameSpan = document.getElementById('modal-prod-filename');
  const filesizeSpan = document.getElementById('modal-prod-filesize');
  const togglePresetsBtn = document.getElementById('toggle-preset-gallery-btn');
  const presetsTray = document.getElementById('presets-gallery-tray');
  const toggleUrlBtn = document.getElementById('toggle-url-fallback-btn');
  const urlWrap = document.getElementById('url-fallback-wrap');
  const applyUrlBtn = document.getElementById('apply-url-fallback-btn');
  const urlInput = document.getElementById('modal-prod-url-fallback');

  function setActiveImage(dataUrl, fileName = 'uploaded-hardware.jpg', fileSize = 'Optimized') {
    if (hiddenInput) hiddenInput.value = dataUrl;
    if (previewImg) previewImg.src = dataUrl;
    if (filenameSpan) filenameSpan.textContent = fileName;
    if (filesizeSpan) filesizeSpan.textContent = fileSize;
    if (emptyState) emptyState.style.display = 'none';
    if (previewState) previewState.style.display = 'block';
    dropzone.classList.add('has-file');
    dropzone.classList.remove('has-error');
  }

  function clearActiveImage() {
    if (hiddenInput) hiddenInput.value = '';
    if (previewImg) previewImg.src = '';
    if (fileInput) fileInput.value = '';
    if (emptyState) emptyState.style.display = 'flex';
    if (previewState) previewState.style.display = 'none';
    dropzone.classList.remove('has-file');
  }

  // Populate presets grid if empty
  if (presetsTray && !presetsTray.dataset.populated) {
    presetsTray.dataset.populated = 'true';
    const grid = presetsTray.querySelector('#presets-grid') || presetsTray;
    grid.innerHTML = HARDWARE_PRESETS.map(p => `
      <div class="preset-card-chip" data-url="${p.url}" data-name="${p.name}">
        <img src="${p.url}" alt="${p.name}" />
        <span>${p.name}</span>
      </div>
    `).join('');

    presetsTray.querySelectorAll('.preset-card-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        sounds.playClick();
        const url = chip.dataset.url;
        const name = chip.dataset.name;
        setActiveImage(url, `${name}.jpg`, 'Catalog Preset');
        presetsTray.style.display = 'none';
        ui.showToast({
          title: 'Preset Photo Applied',
          message: `Loaded photography for "${name}".`,
          type: 'info'
        });
      });
    });
  }

  // Handle selected file upload
  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      ui.showToast({
        title: 'Unsupported File Format',
        message: 'Please select an image file (PNG, JPG, WEBP, SVG).',
        type: 'error'
      });
      return;
    }

    try {
      const result = await compressAndReadImage(file);
      setActiveImage(result.dataUrl, result.fileName, result.fileSize);
      sounds.playSuccess();
      ui.showToast({
        title: 'Photo Uploaded & Optimized',
        message: `"${result.fileName}" (${result.fileSize}) ready for catalog.`,
        type: 'success'
      });
    } catch (err) {
      console.error(err);
      ui.showToast({
        title: 'Upload Failed',
        message: 'Unable to process image file. Please try another image.',
        type: 'error'
      });
    }
  }

  // Bind dropzone listeners only once
  if (!dropzone.dataset.bound) {
    dropzone.dataset.bound = 'true';

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('is-dragover');
    });

    dropzone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('is-dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('is-dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    browseBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput?.click();
    });

    replaceBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput?.click();
    });

    removeBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      sounds.playPop();
      clearActiveImage();
    });

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });

    togglePresetsBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (presetsTray) {
        presetsTray.style.display = presetsTray.style.display === 'none' ? 'block' : 'none';
      }
    });

    toggleUrlBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (urlWrap) {
        urlWrap.style.display = urlWrap.style.display === 'none' ? 'block' : 'none';
      }
    });

    applyUrlBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const val = urlInput?.value.trim();
      if (val) {
        setActiveImage(val, 'custom-url.jpg', 'Direct Link');
        if (urlWrap) urlWrap.style.display = 'none';
        sounds.playSuccess();
        ui.showToast({
          title: 'Image URL Linked',
          message: 'External image linked to product.',
          type: 'info'
        });
      }
    });
  }

  return { setActiveImage, clearActiveImage };
}

/**
 * 6. Product Add / Edit Modal Controller (with Normal File Upload)
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
  document.getElementById('modal-prod-category').value = isEdit ? product.category : (CATEGORIES[1] || 'Keyboards & Keycaps');
  document.getElementById('modal-prod-badge').value = isEdit ? (product.badge || 'NEW') : 'NEW';
  document.getElementById('modal-prod-desc').value = isEdit ? product.description : 'High-precision engineering mastercraft hardware with quantum response.';

  // Stock Management Controller in Edit Modal
  const initialStock = isEdit 
    ? (product.stockCount !== undefined ? product.stockCount : (product.stock !== undefined ? product.stock : 15)) 
    : 20;
  const stockInput = document.getElementById('modal-prod-stock');
  const stockLabel = document.getElementById('modal-stock-label');
  const stockStatusPill = document.getElementById('modal-stock-status-pill');
  const decBtn = document.getElementById('modal-stock-dec-btn');
  const incBtn = document.getElementById('modal-stock-inc-btn');

  if (stockInput) stockInput.value = initialStock;
  if (stockLabel) {
    stockLabel.textContent = isEdit 
      ? `Vault Stock Management (${product.name})` 
      : 'Initial Vault Stock Allocation';
  }

  const updateStockPill = () => {
    const qty = Number(stockInput?.value) || 0;
    if (!stockStatusPill) return;
    if (qty <= 0) {
      stockStatusPill.textContent = 'Out of Stock (0 units)';
      stockStatusPill.className = 'stock-status-preview-pill pill-out';
    } else if (qty <= 5) {
      stockStatusPill.textContent = `Low Stock (${qty} units left)`;
      stockStatusPill.className = 'stock-status-preview-pill pill-low';
    } else {
      stockStatusPill.textContent = `In Stock (${qty} units)`;
      stockStatusPill.className = 'stock-status-preview-pill pill-ok';
    }
  };

  updateStockPill();

  if (stockInput) {
    stockInput.oninput = updateStockPill;
    stockInput.onchange = updateStockPill;
  }

  if (decBtn && stockInput) {
    decBtn.onclick = (e) => {
      e.preventDefault();
      sounds.playClick();
      const current = Number(stockInput.value) || 0;
      stockInput.value = Math.max(0, current - 1);
      updateStockPill();
    };
  }

  if (incBtn && stockInput) {
    incBtn.onclick = (e) => {
      e.preventDefault();
      sounds.playClick();
      const current = Number(stockInput.value) || 0;
      stockInput.value = current + 1;
      updateStockPill();
    };
  }

  // Quick Chips inside Edit Modal
  modal.querySelectorAll('.stock-quick-chip').forEach(chip => {
    chip.onclick = (e) => {
      e.preventDefault();
      sounds.playClick();
      if (!stockInput) return;
      if (chip.dataset.set !== undefined) {
        stockInput.value = Number(chip.dataset.set);
      } else if (chip.dataset.delta !== undefined) {
        const delta = Number(chip.dataset.delta);
        const current = Number(stockInput.value) || 0;
        stockInput.value = Math.max(0, current + delta);
      }
      updateStockPill();
    };
  });

  // Setup Image Dropzone
  const dropzoneCtrl = setupProductImageDropzone();
  if (isEdit && product.heroImage) {
    dropzoneCtrl?.setActiveImage(product.heroImage, `${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg`, 'Current Photo');
  } else {
    dropzoneCtrl?.clearActiveImage();
  }

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

    // Verify an image was uploaded or chosen
    if (!heroImage) {
      sounds.playPop();
      const dropzone = document.getElementById('modal-prod-dropzone');
      dropzone?.classList.add('has-error');
      ui.showToast({
        title: 'Product Photo Required',
        message: 'Please upload an image file or choose from the preset hardware library.',
        type: 'warning'
      });
      return;
    }

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
      renderAdminView(mainContainer, activeAdminTab);
    }
  };

  document.getElementById('admin-prod-modal-close')?.addEventListener('click', () => {
    ui.closeModal('admin-product-modal');
  });
}
