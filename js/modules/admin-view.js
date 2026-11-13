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
import { openAuthModal, performLogin } from './auth-modal.js';
import { CATEGORIES } from '../data/products.js';

let activeAdminTab = 'overview'; // 'overview' | 'products' | 'orders' | 'customers' | 'settings' | 'subadmins'

function getTabLabel(tab) {
  switch (tab) {
    case 'overview': return 'Overview & Analytics';
    case 'products': return 'Products & Inventory';
    case 'orders': return 'Orders & MoMo Gateway';
    case 'customers': return 'Customer Loyalty & Accounts';
    case 'settings': return 'Store Settings & Operations';
    case 'subadmins': return 'Sub-Admins & Access Limits';
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

  const isMainAdmin = Boolean(user && user.isLoggedIn && user.role === 'admin');
  const isSubAdmin = Boolean(user && user.isLoggedIn && user.role === 'sub-admin');
  const hasAccess = isMainAdmin || isSubAdmin;

  if (!hasAccess) {
    renderAdminLoginGate(container);
    return;
  }

  // Enforce access limits for Sub-Admins: automatically route to authorized section
  if (isSubAdmin) {
    const permissions = user.permissions || ['orders'];
    if (!permissions.includes(activeAdminTab)) {
      activeAdminTab = permissions[0] || 'orders';
    }
  }

  renderAdminDashboard(container);
}

/**
 * 1. Admin Security Gate (Direct Sign In Only Form)
 */
function renderAdminLoginGate(container) {
  container.innerHTML = `
    <div class="admin-auth-wrapper animate-fade-in" style="min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem;">
      <div class="admin-auth-card" style="max-width: 440px; width: 100%; margin: 0 auto;">
        
        <div class="admin-auth-header text-center mb-4">
          <div class="admin-shield-icon">🔒</div>
          <h2 class="admin-auth-title">Admin Sign In</h2>
          <p class="admin-auth-sub">Enter credentials to access the 7th June store management console.</p>
        </div>

        <!-- Strictly Sign In Only (No Create Account / Register) -->
        <form id="admin-direct-login-form">
          <div class="form-group mb-3 text-left">
            <label class="form-label-bold" for="admin-login-username">Email Address or Username</label>
            <input type="text" class="custom-input" id="admin-login-username" placeholder="admin@7thjune.com or admin" required autocomplete="username" autofocus />
          </div>

          <div class="form-group mb-3 text-left">
            <label class="form-label-bold" for="admin-login-password">Password</label>
            <input type="password" class="custom-input" id="admin-login-password" placeholder="Enter your password" required autocomplete="current-password" />
          </div>

          <div class="auth-extra-row mb-3" style="display: flex; justify-content: space-between; align-items: center;">
            <label class="custom-checkbox" style="font-size: 0.8rem; color: #475569; display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="checkbox" checked />
              <span class="checkmark"></span>
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-link" style="font-size: 0.8rem; color: #DC2626; text-decoration: none;"
              onclick="event.preventDefault(); window.ui?.showToast({ title: 'Password Reset', message: 'Admin security reset instructions dispatched.', type: 'info' });">Forgot Password?</a>
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-100" id="admin-submit-login-btn">
            Sign In to Admin
          </button>
        </form>

        <div class="text-center mt-3 pt-3" style="border-top: 1px solid #E2E8F0;">
          <a href="#/catalog" class="text-muted text-sm" style="text-decoration: underline;" id="admin-return-store-btn">
            ← Return to Live Customer Store
          </a>
        </div>

      </div>
    </div>
  `;

  // Direct sign in form submission
  container.querySelector('#admin-direct-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    sounds.playClick();
    const inputVal = container.querySelector('#admin-login-username')?.value.trim() || 'admin';
    const user = performLogin(inputVal);
    if (user.role !== 'admin' && user.role !== 'sub-admin') {
      user.role = 'admin';
      user.tier = 'Main Administrator (Full Control)';
      store.setUser(user);
    }
    renderAdminView(container, 'overview');
  });

  // Return to Storefront
  container.querySelector('#admin-return-store-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    sounds.playClick();
    window.location.hash = '#/catalog';
    store.setView('catalog');
  });
}

/**
 * 2. Main Admin & Sub-Admin Dashboard Controller & View
 */
function renderAdminDashboard(container) {
  const { user, products, orders, subAdmins } = store.state;
  const isMainAdmin = Boolean(user && user.role === 'admin');
  const isSubAdmin = Boolean(user && user.role === 'sub-admin');
  const adminName = (user && user.name) || (isMainAdmin ? 'Kwame Blankson' : 'Sub-Admin');

  // Compute allowed permissions
  const permissions = isMainAdmin
    ? ['overview', 'products', 'orders', 'customers', 'settings', 'subadmins']
    : (user.permissions || ['orders']);

  const permSummary = (user.permissions || ['orders']).map(p => p === 'orders' ? 'Order Status' : p).join(', ');
  const adminRoleDisplay = isMainAdmin
    ? 'Main Administrator (Full Control)'
    : `Sub-Admin (Access Limit: ${permSummary})`;

  const initials = adminName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || (isMainAdmin ? 'KB' : 'SA');

  container.innerHTML = `
    <div class="admin-portal-wrapper animate-fade-in">
      
      <!-- Top Executive Admin Bar -->
      <header class="admin-top-bar">
        <div class="admin-top-bar-inner">
          <div class="admin-brand-group">
            <button type="button" class="admin-hamburger-btn" id="admin-sidebar-toggle-btn" aria-label="Toggle Navigation Menu" title="Open Navigation Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <img src="image/7th June logo.png" alt="7th June Logo" class="admin-brand-logo" />
            <div class="admin-brand-text-wrap">
              <div class="admin-brand-title">
                <span class="admin-brand-title-full">7TH JUNE COMPUTERS • ${isMainAdmin ? 'ENTERPRISE CONSOLE' : 'SUB-ADMIN WORKSPACE'}</span>
                <span class="admin-brand-title-compact">7th June <span class="admin-portal-badge">${isMainAdmin ? 'Console' : 'Staff'}</span></span>
              </div>
              <div class="admin-system-status">
                <span class="status-live-dot"></span>
                <span>${isMainAdmin ? 'Main Admin Session • Full Store Access' : `Sub-Admin Session (${adminName}) • Limited Access`}</span>
              </div>
            </div>
          </div>

          <div class="admin-user-controls">
            <button class="btn btn-secondary btn-sm" id="admin-view-storefront-btn" title="Return to Storefront">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span class="admin-btn-label">Return to Store</span>
            </button>
            <div class="admin-user-chip" title="${adminName} • ${adminRoleDisplay}">
              <span class="admin-avatar">${initials}</span>
              <div class="admin-user-text">
                <span class="admin-user-name">${adminName}</span>
                <span class="admin-user-role-sub">${adminRoleDisplay}</span>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" id="admin-logout-btn" title="Sign out of Admin Session">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="admin-logout-svg"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span class="admin-logout-label">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Dashboard Layout with Sidebar and Content -->
      <div class="admin-dashboard-layout">

        <!-- Mobile Sidebar Backdrop -->
        <div class="admin-sidebar-backdrop" id="admin-sidebar-backdrop"></div>

        <!-- Admin Left Sidebar -->
        <aside class="admin-sidebar" id="admin-sidebar" aria-label="Admin Navigation Sidebar">
          <div class="admin-sidebar-header">
            <div class="admin-sidebar-brand-mini">
              <span class="admin-sidebar-kicker">Navigation</span>
              <span class="admin-sidebar-badge">${isMainAdmin ? 'SUPER ADMIN' : 'LIMITED'}</span>
            </div>
            <button type="button" class="admin-sidebar-close" id="admin-sidebar-close-btn" aria-label="Close navigation menu">&times;</button>
          </div>

          <!-- Quick User Card in Sidebar -->
          <div class="admin-sidebar-user-card">
            <span class="admin-avatar">${initials}</span>
            <div class="admin-sidebar-user-info">
              <span class="admin-sidebar-user-name">${adminName}</span>
              <span class="admin-sidebar-user-role">${isMainAdmin ? 'Chief Administrator' : 'Sub-Admin Staff'}</span>
            </div>
          </div>

          <!-- Access-Filtered Admin Navigation Tabs (Vertical Sidebar Style) -->
          <nav class="admin-nav-tabs admin-sidebar-nav">
            <div class="admin-nav-group-heading">Core Management</div>

            ${permissions.includes('overview') ? `
              <button class="admin-tab-btn ${activeAdminTab === 'overview' ? 'is-active' : ''}" data-tab="overview">
                <span class="admin-tab-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </span>
                <span class="admin-tab-text">Overview</span>
              </button>
            ` : ''}

            ${permissions.includes('products') ? `
              <button class="admin-tab-btn ${activeAdminTab === 'products' ? 'is-active' : ''}" data-tab="products">
                <span class="admin-tab-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </span>
                <span class="admin-tab-text">Products &amp; Stock</span>
                <span class="admin-tab-badge">${products.length}</span>
              </button>
            ` : ''}

            ${permissions.includes('orders') ? `
              <button class="admin-tab-btn ${activeAdminTab === 'orders' ? 'is-active' : ''}" data-tab="orders">
                <span class="admin-tab-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </span>
                <span class="admin-tab-text">Orders &amp; MoMo</span>
                <span class="admin-tab-badge">${orders.length}</span>
              </button>
            ` : ''}

            ${permissions.includes('customers') ? `
              <button class="admin-tab-btn ${activeAdminTab === 'customers' ? 'is-active' : ''}" data-tab="customers">
                <span class="admin-tab-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
                <span class="admin-tab-text">Customers</span>
                <span class="admin-tab-badge">1 VIP</span>
              </button>
            ` : ''}

            <div class="admin-nav-group-heading">System &amp; Settings</div>

            ${permissions.includes('settings') ? `
              <button class="admin-tab-btn ${activeAdminTab === 'settings' ? 'is-active' : ''}" data-tab="settings">
                <span class="admin-tab-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </span>
                <span class="admin-tab-text">Store Settings</span>
              </button>
            ` : ''}

            ${isMainAdmin ? `
              <button class="admin-tab-btn ${activeAdminTab === 'subadmins' ? 'is-active' : ''}" data-tab="subadmins">
                <span class="admin-tab-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
                <span class="admin-tab-text">Sub-Admins &amp; Staff</span>
                <span class="admin-tab-badge">${(subAdmins || []).length} Staff</span>
              </button>
            ` : ''}
          </nav>

          <div class="admin-sidebar-footer">
            <button class="btn btn-secondary btn-sm w-100 mb-2 admin-sidebar-storefront-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Storefront View</span>
            </button>
            <div class="admin-sidebar-status-line">
              <span class="status-live-dot"></span>
              <span>Online • Node Accra</span>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="admin-main-content">
          <div class="admin-pane-container" id="admin-pane-content">
            ${renderActiveAdminPaneContent(activeAdminTab)}
          </div>
        </main>
      </div>

    </div>
  `;


  attachAdminDashboardEvents(container);
}

/**
 * 3. Render content for the active Tab with Access Permission Checking
 */
function renderActiveAdminPaneContent(tab) {
  const { user } = store.state;
  const isMainAdmin = Boolean(user && user.role === 'admin');
  const allowed = isMainAdmin || (user?.permissions || []).includes(tab);

  if (!allowed) {
    const firstAllowed = user?.permissions?.[0] || 'orders';
    return `
      <div class="admin-card-section text-center p-5 animate-fade-in">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🔒</div>
        <h3>Access Limit Restricted</h3>
        <p class="section-desc mt-2" style="max-width: 500px; margin: 0.5rem auto 1.5rem auto;">
          Your sub-admin account (<strong>${user?.name || 'Sub-Admin'}</strong>) does not have clearance for the <strong>${getTabLabel(tab)}</strong> section.
        </p>
        <p class="text-xs text-muted mb-4">Your profile is currently limited to: <strong>${(user?.permissions || ['orders']).map(p => p === 'orders' ? 'Order Status' : p).join(', ')}</strong>.</p>
        <button class="btn btn-primary" id="subadmin-return-allowed-btn" data-target="${firstAllowed}">
          Go to Authorized Section (${getTabLabel(firstAllowed)})
        </button>
      </div>
    `;
  }

  switch (tab) {
    case 'overview':
      return renderOverviewTab();
    case 'products':
      return renderProductsTab();
    case 'orders':
      return renderOrdersTab();
    case 'customers':
      return renderCustomersTab();
    case 'settings':
      return renderSettingsTab();
    case 'subadmins':
      return renderSubAdminsTab();
    default:
      return isMainAdmin ? renderOverviewTab() : renderOrdersTab();
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
            <span class="stat-icon-wrap bg-red-light">💰</span>
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
            <span class="stat-icon-wrap bg-red-light">📦</span>
          </div>
          <div class="stat-value">${products.length} Products</div>
          <div class="stat-trend ${lowStockProducts.length > 0 ? 'text-orange' : 'text-red'}">
            <span>${lowStockProducts.length} low stock</span> • ${outOfStockProducts.length} out of stock
          </div>
        </div>

        <div class="admin-stat-card">
          <div class="stat-card-top">
            <span class="stat-label">PAYMENT CHANNEL</span>
            <span class="stat-icon-wrap bg-orange-light">📲</span>
          </div>
          <div class="stat-value">100% MoMo</div>
          <div class="stat-trend text-red">
            MTN MoMo • Telecel Cash • AT Money
          </div>
        </div>

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
                  <div class="admin-sku-label">ID: ${prod.id}${prod.specs && Object.keys(prod.specs).length > 0 ? ` • <span style="color: #DC2626; font-weight: 700;">${Object.keys(prod.specs).length} specs</span>` : ''}</div>
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
 * TAB: SUB-ADMIN ACCOUNTS & ACCESS LIMITS (Main Admin Exclusive)
 */
function renderSubAdminsTab() {
  const subAdmins = store.state.subAdmins || [];

  return `
    <div class="admin-subadmins-section animate-fade-in">
      
      <!-- Top Section Executive Hero Banner -->
      <div class="subadmin-hero-banner">
        <div class="subadmin-hero-content">
          <div class="subadmin-hero-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <h2 class="subadmin-hero-title">Staff Provisioning &amp; Access Control</h2>
            <p class="subadmin-hero-sub">Delegate sub-admin credentials with role-based module clearance. Sub-admins are restricted strictly to authorized consoles.</p>
          </div>
        </div>
        <div class="subadmin-hero-meta">
          <span class="subadmin-hero-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            RBAC Enforced
          </span>
          <span class="subadmin-hero-count"><strong>${subAdmins.length}</strong> Active Account${subAdmins.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      <!-- 1. Provision New Sub-Admin Console (All Inputs Visible at a Glance) -->
      <div class="admin-card-section subadmin-form-card subadmin-console-card" id="subadmin-provision-card">
        <div class="subadmin-card-header d-flex justify-between align-center">
          <div class="d-flex align-center gap-2">
            <span class="subadmin-card-header-icon" title="Toggle Provisioning Form" id="subadmin-header-icon-toggle">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </span>
            <div>
              <h3 class="subadmin-card-title">Provision New Sub-Admin</h3>
              <p class="subadmin-card-desc">Assign identity credentials and configure granular module permissions.</p>
            </div>
          </div>
          <div class="subadmin-header-actions d-flex align-center gap-2">
            <span class="subadmin-badge-direct">Direct Provisioning</span>
            <button type="button" class="btn btn-secondary btn-sm subadmin-toggle-btn" id="toggle-subadmin-form-btn" title="Toggle Provisioning Form Visibility">
              <svg class="subadmin-toggle-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 15l-6-6-6 6"/></svg>
              <span id="toggle-form-btn-text">Hide Form</span>
            </button>
          </div>
        </div>

        <form class="admin-form subadmin-provision-form mt-2" id="admin-create-subadmin-form">
          <div class="subadmin-provision-columns">
            
            <!-- Left Column: Step 1 Staff Identity & Login (All 4 Inputs Visible Side-by-Side) -->
            <div class="subadmin-provision-col">
              <div class="subadmin-block-header mb-2">
                <span class="subadmin-step-num">1</span>
                <div>
                  <span class="subadmin-step-title">Staff Identity &amp; Login</span>
                  <p class="subadmin-step-desc">Login credentials &amp; executive auditing</p>
                </div>
              </div>

              <div class="subadmin-compact-fields-grid">
                <div class="form-group mb-2" style="grid-column: 1 / -1;">
                  <label class="subadmin-input-label" for="new-sub-name">Sub-Admin Full Name</label>
                  <div class="subadmin-input-wrap">
                    <span class="subadmin-input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>
                    <input type="text" class="custom-input subadmin-input" id="new-sub-name" placeholder="e.g. John Blankson" required autocomplete="name" />
                  </div>
                </div>

                <div class="form-group mb-2">
                  <label class="subadmin-input-label" for="new-sub-username">Username / Handle</label>
                  <div class="subadmin-input-wrap">
                    <span class="subadmin-input-icon">@</span>
                    <input type="text" class="custom-input subadmin-input" id="new-sub-username" placeholder="e.g. john" required autocomplete="username" />
                  </div>
                </div>

                <div class="form-group mb-2">
                  <label class="subadmin-input-label" for="new-sub-email">Staff Work Email</label>
                  <div class="subadmin-input-wrap">
                    <span class="subadmin-input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>
                    <input type="email" class="custom-input subadmin-input" id="new-sub-email" placeholder="john@7thjune.com" required autocomplete="email" />
                  </div>
                </div>

                <div class="form-group mb-2" style="grid-column: 1 / -1;">
                  <div class="d-flex justify-between align-center mb-1">
                    <label class="subadmin-input-label mb-0" for="new-sub-password">Initial Password</label>
                    <button type="button" class="subadmin-gen-pwd-btn" id="subadmin-gen-pwd-btn" title="Generate random secure password">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                      <span>Generate</span>
                    </button>
                  </div>
                  <div class="subadmin-input-wrap">
                    <span class="subadmin-input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                    <input type="password" class="custom-input subadmin-input" id="new-sub-password" placeholder="••••••••••••" value="password123" required />
                    <button type="button" class="subadmin-pwd-toggle" id="subadmin-pwd-toggle" aria-label="Toggle password visibility">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <span class="subadmin-hint-text">Staff member can sign in using either username or email with this initial password.</span>
            </div>

            <!-- Right Column: Step 2 Access Limits & Permissions -->
            <div class="subadmin-provision-col">
              <div class="d-flex justify-between align-center mb-2 flex-wrap gap-2">
                <div class="subadmin-block-header mb-0">
                  <span class="subadmin-step-num">2</span>
                  <div>
                    <span class="subadmin-step-title">Access Limits &amp; Permissions</span>
                    <p class="subadmin-step-desc">Designate authorized console tabs for this sub-admin</p>
                  </div>
                </div>
                <div class="subadmin-perm-actions">
                  <button type="button" class="btn-subtle-xs" id="perm-select-all-btn">Select All</button>
                  <button type="button" class="btn-subtle-xs" id="perm-reset-orders-btn">Orders Only</button>
                </div>
              </div>
              
              <div class="subadmin-permissions-list subadmin-permissions-stack">
                
                <!-- Order Status & Fulfillment -->
                <label class="perm-option-card is-selected" for="perm-orders">
                  <input type="checkbox" id="perm-orders" class="perm-checkbox-input" checked />
                  <span class="perm-custom-check">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <div class="perm-module-icon perm-icon-orders">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <div class="perm-option-info">
                    <div class="perm-title-row">
                      <strong class="perm-title">Orders &amp; MoMo Verification</strong>
                      <span class="perm-code-tag">orders</span>
                    </div>
                    <span class="perm-desc">Verify slips, update order fulfillment status &amp; waybills</span>
                  </div>
                </label>

                <!-- Products & Inventory -->
                <label class="perm-option-card" for="perm-products">
                  <input type="checkbox" id="perm-products" class="perm-checkbox-input" />
                  <span class="perm-custom-check">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <div class="perm-module-icon perm-icon-products">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </div>
                  <div class="perm-option-info">
                    <div class="perm-title-row">
                      <strong class="perm-title">Products &amp; Stock Inventory</strong>
                      <span class="perm-code-tag">products</span>
                    </div>
                    <span class="perm-desc">Manage catalog, specifications &amp; live warehouse stock</span>
                  </div>
                </label>

                <!-- Customers & VIP Concierge -->
                <label class="perm-option-card" for="perm-customers">
                  <input type="checkbox" id="perm-customers" class="perm-checkbox-input" />
                  <span class="perm-custom-check">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <div class="perm-module-icon perm-icon-customers">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div class="perm-option-info">
                    <div class="perm-title-row">
                      <strong class="perm-title">Customers &amp; Concierge</strong>
                      <span class="perm-code-tag">customers</span>
                    </div>
                    <span class="perm-desc">Client account lifetime spends, delivery addresses &amp; history</span>
                  </div>
                </label>

                <!-- Overview Analytics -->
                <label class="perm-option-card" for="perm-overview">
                  <input type="checkbox" id="perm-overview" class="perm-checkbox-input" />
                  <span class="perm-custom-check">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <div class="perm-module-icon perm-icon-overview">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  </div>
                  <div class="perm-option-info">
                    <div class="perm-title-row">
                      <strong class="perm-title">Overview KPIs &amp; Revenue</strong>
                      <span class="perm-code-tag">overview</span>
                    </div>
                    <span class="perm-desc">Turnover statistics, revenue trends &amp; conversion metrics</span>
                  </div>
                </label>

                <!-- Store Operations & Settings -->
                <label class="perm-option-card" for="perm-settings">
                  <input type="checkbox" id="perm-settings" class="perm-checkbox-input" />
                  <span class="perm-custom-check">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <div class="perm-module-icon perm-icon-settings">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  </div>
                  <div class="perm-option-info">
                    <div class="perm-title-row">
                      <strong class="perm-title">Store Operations &amp; Settings</strong>
                      <span class="perm-code-tag">settings</span>
                    </div>
                    <span class="perm-desc">MoMo gateway phone numbers, delivery fee rules &amp; currency</span>
                  </div>
                </label>

              </div>

              <!-- Submit Action Row -->
              <div class="subadmin-submit-bar mt-2">
                <button type="submit" class="btn btn-primary subadmin-create-submit-btn w-100" id="subadmin-submit-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  <span>Provision &amp; Save Sub-Admin</span>
                </button>
                <span class="subadmin-submit-note">Account activates immediately with enforced boundary limits.</span>
              </div>
            </div>

          </div>
        </form>
      </div>

      <!-- 2. Full-Width Active Staff Directory & Sessions -->
      <div class="admin-card-section subadmin-directory-card">
        <div class="subadmin-card-header d-flex justify-between align-center">
          <div class="d-flex align-center gap-2">
            <span class="subadmin-card-header-icon subadmin-icon-team">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <div>
              <h3 class="subadmin-card-title">Staff Directory &amp; Active Logins</h3>
              <p class="subadmin-card-desc">Review provisioned staff logins, test their access limits, or revoke permissions.</p>
            </div>
          </div>
          <div class="subadmin-header-actions d-flex align-center gap-2">
            <span class="subadmin-badge-count">${subAdmins.length} Active Staff</span>
          </div>
        </div>

        ${subAdmins.length === 0 ? `
          <div class="subadmin-empty-state mt-3">
            <div class="subadmin-empty-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <h4 class="subadmin-empty-title">No Sub-Administrators Yet</h4>
            <p class="subadmin-empty-desc">Use the provisioning console above to create dedicated staff credentials with customized module access limits.</p>
          </div>
        ` : `
          <div class="admin-table-wrap mt-3 subadmin-table-wrap">
            <table class="admin-data-table subadmin-data-table">
              <thead>
                <tr>
                  <th style="min-width: 170px;">Staff Profile</th>
                  <th style="min-width: 170px;">Credentials</th>
                  <th style="min-width: 200px;">Authorized Modules</th>
                  <th style="text-align: right; min-width: 220px; white-space: nowrap;">Session Actions</th>
                </tr>
              </thead>
              <tbody>
                ${subAdmins.map(sub => {
                  const permBadges = (sub.permissions || []).map(p => {
                    const label = p === 'orders' ? 'Orders' : (p.charAt(0).toUpperCase() + p.slice(1));
                    return `<span class="badge-pill perm-badge-${p}">${label}</span>`;
                  }).join(' ');

                  const initials = sub.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'SA';

                  return `
                    <tr data-sub-id="${sub.id}" class="subadmin-row">
                      <td>
                        <div class="subadmin-profile-cell">
                          <span class="admin-avatar subadmin-table-avatar">${initials}</span>
                          <div class="subadmin-profile-meta">
                            <strong class="subadmin-profile-name">${sub.name}</strong>
                            <span class="subadmin-profile-status"><span class="status-live-dot status-dot-xs"></span> Active Staff</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="subadmin-cred-cell">
                          <code class="subadmin-username-code">@${sub.username}</code>
                          <span class="subadmin-email-text">${sub.email}</span>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex flex-wrap gap-1">
                          ${permBadges || '<span class="text-muted text-xs">No Access</span>'}
                        </div>
                      </td>
                      <td style="text-align: right;">
                        <div class="subadmin-action-btns">
                          <button class="btn btn-secondary btn-sm admin-switch-subadmin-btn" data-sub-id="${sub.id}" title="Test login as ${sub.name}">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-1-1l-2 2m-2-2l-2 2m-2-2l-2 2m-2-2l-2 2M3 21l10-10"/><circle cx="7.5" cy="16.5" r="3.5"/></svg>
                            <span>Test Login</span>
                          </button>
                          <button class="btn btn-secondary btn-sm admin-edit-subadmin-btn" data-sub-id="${sub.id}" title="Edit ${sub.name}'s permissions &amp; credentials">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            <span>Edit</span>
                          </button>
                          <button class="btn btn-danger-ghost btn-sm admin-del-subadmin-btn" data-sub-id="${sub.id}" title="Revoke sub-admin access">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}

        <div class="subadmin-guidance-card mt-3">
          <div class="d-flex align-center gap-2">
            <span class="subadmin-guidance-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
            <div>
              <strong class="subadmin-guidance-title">Role-Based Access Enforcement:</strong>
              <p class="subadmin-guidance-text">
                Sub-Admins strictly see only authorized tabs (e.g. <strong>Orders &amp; MoMo Verification</strong>). Turnover statistics, catalog editing, customer CRM, store settings, and staff provisioning remain completely restricted and hidden from their session.
              </p>
            </div>
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

  const currentSpend = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Professional client concierge directory
  const customers = [
    {
      id: 'cust-001',
      name: user.name || 'Kwame Blankson',
      email: user.email || 'admin@7thjune.com',
      phone: user.phone || '+233 24 555 7788',
      location: 'Accra Central, Ghana',
      tier: user.role === 'admin' ? 'Chief Administrator' : (user.tier || 'VIP Sovereign Gold'),
      tierClass: user.role === 'admin' ? 'tier-admin' : 'tier-gold',
      tierIcon: user.role === 'admin' ? '👑' : '⭐',
      points: user.points || 9999,
      ordersCount: orders.length || 1,
      totalSpent: currentSpend || 2518.40,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      status: 'Active'
    },
    {
      id: 'cust-002',
      name: 'Julian Vance',
      email: 'julian.vance@techcorp.gh',
      phone: '+233 20 442 8901',
      location: 'Airport Residential, Accra',
      tier: 'VIP Sovereign Gold',
      tierClass: 'tier-gold',
      tierIcon: '⭐',
      points: 14250,
      ordersCount: 4,
      totalSpent: 8420.00,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      status: 'Active'
    },
    {
      id: 'cust-003',
      name: 'Ama Osei Boateng',
      email: 'ama.osei@ghana-invest.com',
      phone: '+233 27 889 1234',
      location: 'Cantonments, Accra',
      tier: 'Platinum Patron',
      tierClass: 'tier-platinum',
      tierIcon: '💎',
      points: 8400,
      ordersCount: 2,
      totalSpent: 5420.00,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      status: 'Active'
    },
    {
      id: 'cust-004',
      name: 'Dr. Kojo Mensah',
      email: 'k.mensah@ug.edu.gh',
      phone: '+233 24 119 5500',
      location: 'Legon Campus, Accra',
      tier: 'Verified Member',
      tierClass: 'tier-member',
      tierIcon: '🏷️',
      points: 2800,
      ordersCount: 1,
      totalSpent: 1850.00,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      status: 'Active'
    }
  ];

  return `
    <div class="admin-customers-section animate-fade-in">
      
      <!-- Main Customers Table Card -->
      <div class="admin-card-section">
        <div class="section-title-row">
          <div>
            <h3>Client Concierge &amp; Loyalty Directory</h3>
            <p class="section-desc">Manage verified client profiles, loyalty point allocations, order histories, and sovereign tiers.</p>
          </div>
          <span class="subadmin-badge-count">${customers.length} Verified Accounts</span>
        </div>

        <div class="admin-table-wrap mt-3">
          <table class="admin-data-table admin-customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Email</th>
                <th>Membership Tier</th>
                <th>Loyalty Pts</th>
                <th style="text-align: center;">Orders</th>
                <th>Total Spent</th>
                <th style="text-align: right;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${customers.map(c => `
                <tr>
                  <td>
                    <div class="customer-info-cell">
                      <img src="${c.avatar}" alt="${c.name}" class="customer-avatar-sm" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';" loading="lazy" />
                      <div class="customer-details">
                        <span class="customer-name">${c.name}</span>
                        <span class="customer-sub">${c.phone}</span>
                        <span class="customer-location">${c.location}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="customer-email">${c.email}</span>
                  </td>
                  <td>
                    <span class="tier-pill-modern ${c.tierClass}">
                      <span>${c.tierIcon}</span>
                      <span>${c.tier}</span>
                    </span>
                  </td>
                  <td>
                    <span class="loyalty-pts-badge">
                      <strong>${c.points.toLocaleString()}</strong>
                      <small>PTS</small>
                    </span>
                  </td>
                  <td style="text-align: center;">
                    <span class="order-count-badge">
                      ${c.ordersCount} ${c.ordersCount === 1 ? 'order' : 'orders'}
                    </span>
                  </td>
                  <td>
                    <span class="customer-total-spent">
                      ${convertPrice(c.totalSpent, currency).formatted}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <span class="status-badge-chip status-active">
                      ● Active
                    </span>
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
  // Mobile Sidebar Drawer Toggle & Backdrop Events
  const sidebarEl = container.querySelector('#admin-sidebar');
  const backdropEl = container.querySelector('#admin-sidebar-backdrop');
  const toggleBtn = container.querySelector('#admin-sidebar-toggle-btn');
  const closeBtn = container.querySelector('#admin-sidebar-close-btn');

  const openSidebar = () => {
    sounds.playClick();
    sidebarEl?.classList.add('is-open');
    backdropEl?.classList.add('is-active');
    document.body.classList.add('no-scroll');
  };

  const closeSidebar = () => {
    sidebarEl?.classList.remove('is-open');
    backdropEl?.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  };

  toggleBtn?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  backdropEl?.addEventListener('click', closeSidebar);

  container.querySelectorAll('.admin-sidebar-storefront-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      closeSidebar();
      store.setView('catalog');
    });
  });

  // Return to Storefront
  container.querySelector('#admin-view-storefront-btn')?.addEventListener('click', () => {
    sounds.playClick();
    document.body.classList.remove('no-scroll');
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
    document.body.classList.remove('no-scroll');
    store.logout();
    ui.showToast({
      title: 'Signed Out',
      message: 'Admin session closed securely. Returned to live storefront.',
      type: 'info'
    });
    window.location.hash = '#/catalog';
    store.setView('catalog');
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

  // Overview View All Orders Link
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

  // Sub-Admins Tab Actions (Main Admin Only)
  if (tab === 'subadmins') {
    // Permission Quick Actions
    container.querySelector('#perm-select-all-btn')?.addEventListener('click', () => {
      sounds.playClick();
      ['orders', 'products', 'customers', 'overview', 'settings'].forEach(id => {
        const el = container.querySelector(`#perm-${id}`);
        if (el) {
          el.checked = true;
          el.closest('.perm-option-card')?.classList.add('is-selected');
        }
      });
    });

    container.querySelector('#perm-reset-orders-btn')?.addEventListener('click', () => {
      sounds.playClick();
      ['products', 'customers', 'overview', 'settings'].forEach(id => {
        const el = container.querySelector(`#perm-${id}`);
        if (el) {
          el.checked = false;
          el.closest('.perm-option-card')?.classList.remove('is-selected');
        }
      });
      const ordersEl = container.querySelector('#perm-orders');
      if (ordersEl) {
        ordersEl.checked = true;
        ordersEl.closest('.perm-option-card')?.classList.add('is-selected');
      }
    });

    // Checkbox visual sync
    container.querySelectorAll('.perm-checkbox-input').forEach(chk => {
      chk.addEventListener('change', () => {
        chk.closest('.perm-option-card')?.classList.toggle('is-selected', chk.checked);
      });
    });

    // Password Tools
    container.querySelector('#subadmin-gen-pwd-btn')?.addEventListener('click', () => {
      sounds.playClick();
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
      let pwd = 'Staff#';
      for (let i = 0; i < 6; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const pwdInput = container.querySelector('#new-sub-password');
      if (pwdInput) {
        pwdInput.value = pwd;
        pwdInput.type = 'text';
        ui.showToast({
          title: 'Generated Password',
          message: `Temporary password set to: ${pwd}`,
          type: 'info'
        });
      }
    });

    container.querySelector('#subadmin-pwd-toggle')?.addEventListener('click', () => {
      const pwdInput = container.querySelector('#new-sub-password');
      if (!pwdInput) return;
      pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
    });

    const form = container.querySelector('#admin-create-subadmin-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = container.querySelector('#new-sub-name')?.value.trim();
      const username = container.querySelector('#new-sub-username')?.value.trim();
      const email = container.querySelector('#new-sub-email')?.value.trim();
      const password = container.querySelector('#new-sub-password')?.value;

      const perms = [];
      if (container.querySelector('#perm-orders')?.checked) perms.push('orders');
      if (container.querySelector('#perm-products')?.checked) perms.push('products');
      if (container.querySelector('#perm-customers')?.checked) perms.push('customers');
      if (container.querySelector('#perm-overview')?.checked) perms.push('overview');
      if (container.querySelector('#perm-settings')?.checked) perms.push('settings');

      if (perms.length === 0) {
        ui.showToast({
          title: 'Permission Required',
          message: 'Please select at least one module access limit for this sub-admin.',
          type: 'warning'
        });
        return;
      }

      sounds.playSuccess();
      store.addSubAdmin({ name, username, email, password, permissions: perms });
      ui.showToast({
        title: `Sub-Admin Created`,
        message: `Account for "${name}" (@${username}) provisioned with ${perms.length} access limit(s).`,
        type: 'success'
      });

      container.querySelector('#admin-pane-content').innerHTML = renderSubAdminsTab();
      attachPaneSpecificEvents(container, 'subadmins');
    });

    // Toggle Provisioning Form Collapse / Expand
    const toggleBtn = container.querySelector('#toggle-subadmin-form-btn');
    const headerIconToggle = container.querySelector('#subadmin-header-icon-toggle');
    const quickAddBtn = container.querySelector('#subadmin-quick-add-btn');
    const formCard = container.querySelector('#subadmin-provision-card');
    const toggleText = container.querySelector('#toggle-form-btn-text');

    const toggleForm = (forceOpen = false) => {
      if (!formCard) return;
      const isHidden = formCard.classList.contains('is-collapsed');
      if (forceOpen || isHidden) {
        formCard.classList.remove('is-collapsed');
        if (toggleText) toggleText.textContent = 'Hide Form';
        container.querySelector('#new-sub-name')?.focus();
      } else {
        formCard.classList.add('is-collapsed');
        if (toggleText) toggleText.textContent = 'Add Form';
      }
    };

    toggleBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playClick();
      toggleForm();
    });

    headerIconToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playClick();
      toggleForm();
    });

    quickAddBtn?.addEventListener('click', () => {
      sounds.playClick();
      toggleForm(true);
      formCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      container.querySelector('#new-sub-name')?.focus();
    });

    // Test Login / Switch to Sub-Admin Session
    container.querySelectorAll('.admin-switch-subadmin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playSuccess();
        const subId = btn.dataset.subId;
        const sub = (store.state.subAdmins || []).find(s => s.id === subId);
        if (!sub) return;

        const permLabels = (sub.permissions || ['orders']).map(p => p === 'orders' ? 'Order Status' : p).join(', ');
        const subUser = {
          isLoggedIn: true,
          role: 'sub-admin',
          name: sub.name,
          username: sub.username,
          email: sub.email,
          permissions: sub.permissions || ['orders'],
          phone: '+233 24 555 4422',
          tier: `Sub-Admin (${permLabels})`,
          points: 500,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          addresses: []
        };

        store.setUser(subUser);
        ui.showToast({
          title: `Switched to Sub-Admin: ${sub.name}`,
          message: `Viewing workspace with limited access (${permLabels}).`,
          type: 'info'
        });
        renderAdminView(container, sub.permissions[0] || 'orders');
      });
    });

    // Delete Sub-Admin
    container.querySelectorAll('.admin-del-subadmin-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const subId = btn.dataset.subId;
        const sub = (store.state.subAdmins || []).find(s => s.id === subId);
        if (!sub) return;

        const confirmed = await ui.confirm({
          title: 'Revoke Sub-Admin Access?',
          message: `Are you sure you want to revoke sub-administrator access for <strong>"${sub.name}"</strong> (@${sub.username})?`,
          subMessage: 'This account will immediately lose access to all store operations.',
          confirmText: 'Revoke Access',
          cancelText: 'Keep Active',
          type: 'danger',
          icon: '🛡️'
        });

        if (confirmed) {
          sounds.playPop();
          store.deleteSubAdmin(subId);
          ui.showToast({
            title: 'Sub-Admin Revoked',
            message: `Account for ${sub.name} was removed.`,
            type: 'info'
          });
          container.querySelector('#admin-pane-content').innerHTML = renderSubAdminsTab();
          attachPaneSpecificEvents(container, 'subadmins');
        }
      });
    });

    // Edit Sub-Admin
    container.querySelectorAll('.admin-edit-subadmin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        const subId = btn.dataset.subId;
        const sub = (store.state.subAdmins || []).find(s => s.id === subId);
        if (!sub) return;

        const modal = document.getElementById('subadmin-edit-modal');
        if (!modal) return;

        modal.querySelector('#edit-sub-id').value = sub.id;
        modal.querySelector('#edit-sub-name').value = sub.name || '';
        modal.querySelector('#edit-sub-username').value = sub.username || '';
        modal.querySelector('#edit-sub-email').value = sub.email || '';
        modal.querySelector('#edit-sub-password').value = '';

        const perms = sub.permissions || ['orders'];
        ['orders', 'products', 'customers', 'overview', 'settings'].forEach(p => {
          const chk = modal.querySelector(`#edit-perm-${p}`);
          if (chk) {
            chk.checked = perms.includes(p);
            chk.closest('.perm-option-card')?.classList.toggle('is-selected', chk.checked);
          }
        });

        ui.openModal('subadmin-edit-modal');
      });
    });

    // Edit modal utilities & form submit
    const editModal = document.getElementById('subadmin-edit-modal');
    if (editModal && !editModal.dataset.eventsBound) {
      editModal.dataset.eventsBound = 'true';

      editModal.querySelector('#edit-sub-gen-pwd-btn')?.addEventListener('click', () => {
        sounds.playClick();
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
        let pwd = 'Staff#';
        for (let i = 0; i < 6; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const pwdInput = editModal.querySelector('#edit-sub-password');
        if (pwdInput) {
          pwdInput.value = pwd;
          pwdInput.type = 'text';
          ui.showToast({
            title: 'Generated Password',
            message: `New temporary password set to: ${pwd}`,
            type: 'info'
          });
        }
      });

      editModal.querySelector('#edit-sub-pwd-toggle')?.addEventListener('click', () => {
        const pwdInput = editModal.querySelector('#edit-sub-password');
        if (!pwdInput) return;
        pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
      });

      editModal.querySelector('#edit-perm-select-all-btn')?.addEventListener('click', () => {
        ['orders', 'products', 'customers', 'overview', 'settings'].forEach(id => {
          const el = editModal.querySelector(`#edit-perm-${id}`);
          if (el) {
            el.checked = true;
            el.closest('.perm-option-card')?.classList.add('is-selected');
          }
        });
      });

      editModal.querySelector('#edit-perm-reset-orders-btn')?.addEventListener('click', () => {
        ['products', 'customers', 'overview', 'settings'].forEach(id => {
          const el = editModal.querySelector(`#edit-perm-${id}`);
          if (el) {
            el.checked = false;
            el.closest('.perm-option-card')?.classList.remove('is-selected');
          }
        });
        const ordersEl = editModal.querySelector('#edit-perm-orders');
        if (ordersEl) {
          ordersEl.checked = true;
          ordersEl.closest('.perm-option-card')?.classList.add('is-selected');
        }
      });

      editModal.querySelectorAll('.edit-perm-checkbox').forEach(chk => {
        chk.addEventListener('change', () => {
          chk.closest('.perm-option-card')?.classList.toggle('is-selected', chk.checked);
        });
      });

      editModal.querySelector('#admin-edit-subadmin-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const subId = editModal.querySelector('#edit-sub-id')?.value;
        const name = editModal.querySelector('#edit-sub-name')?.value.trim();
        const username = editModal.querySelector('#edit-sub-username')?.value.trim();
        const email = editModal.querySelector('#edit-sub-email')?.value.trim();
        const password = editModal.querySelector('#edit-sub-password')?.value;

        const perms = [];
        if (editModal.querySelector('#edit-perm-orders')?.checked) perms.push('orders');
        if (editModal.querySelector('#edit-perm-products')?.checked) perms.push('products');
        if (editModal.querySelector('#edit-perm-customers')?.checked) perms.push('customers');
        if (editModal.querySelector('#edit-perm-overview')?.checked) perms.push('overview');
        if (editModal.querySelector('#edit-perm-settings')?.checked) perms.push('settings');

        if (perms.length === 0) {
          ui.showToast({
            title: 'Permission Required',
            message: 'Please designate at least one authorized module limit.',
            type: 'warning'
          });
          return;
        }

        const updates = { name, username, email, permissions: perms };
        if (password && password.trim().length > 0) {
          updates.password = password.trim();
        }

        store.updateSubAdmin(subId, updates);
        sounds.playSuccess();
        ui.showToast({
          title: 'Sub-Admin Updated',
          message: `Permissions and credentials saved for "${name}".`,
          type: 'success'
        });
        ui.closeModal('subadmin-edit-modal');

        const paneContent = document.getElementById('admin-pane-content');
        if (paneContent) {
          paneContent.innerHTML = renderSubAdminsTab();
          attachPaneSpecificEvents(document.querySelector('.admin-portal-wrapper') || document.body, 'subadmins');
        }
      });
    }
  }

  // Handle return button on restricted access card
  container.querySelector('#subadmin-return-allowed-btn')?.addEventListener('click', (e) => {
    sounds.playClick();
    const target = e.currentTarget.dataset.target || 'orders';
    switchToTab(container, target);
  });

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
  const { user } = store.state;
  const isMainAdmin = Boolean(user && user.role === 'admin');
  const allowed = isMainAdmin || (user?.permissions || []).includes(tabName);

  if (!allowed) {
    ui.showToast({
      title: 'Access Restricted',
      message: `Your sub-admin account is limited and cannot access ${getTabLabel(tabName)}.`,
      type: 'warning'
    });
    return;
  }

  activeAdminTab = tabName;
  window.location.hash = `#/admin/${tabName}`;
  container.querySelectorAll('.admin-tab-btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.tab === tabName);
  });
  // Auto-close mobile sidebar if open
  const sidebarEl = container.querySelector('#admin-sidebar');
  const backdropEl = container.querySelector('#admin-sidebar-backdrop');
  if (sidebarEl?.classList.contains('is-open')) {
    sidebarEl.classList.remove('is-open');
    backdropEl?.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
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
  document.getElementById('modal-prod-price').value = isEdit ? product.price : '';
  document.getElementById('modal-prod-orig-price').value = isEdit ? (product.originalPrice || '') : '';
  document.getElementById('modal-prod-category').value = isEdit ? product.category : (CATEGORIES[0] || 'Laptops & Workstations');
  document.getElementById('modal-prod-badge').value = isEdit ? (product.badge || '') : '';
  document.getElementById('modal-prod-desc').value = isEdit ? product.description : '';

  // Stock Management Controller in Edit Modal
  const initialStock = isEdit
    ? (product.stockCount !== undefined ? product.stockCount : (product.stock !== undefined ? product.stock : 15))
    : 10;
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


  // Setup Image Dropzone
  const dropzoneCtrl = setupProductImageDropzone();
  if (isEdit && product.heroImage) {
    dropzoneCtrl?.setActiveImage(product.heroImage, `${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg`, 'Current Photo');
  } else {
    dropzoneCtrl?.clearActiveImage();
  }

  // Setup Technical Specifications & Highlights Builder (Matches Storefront PDP)
  setupProductSpecsBuilder(product);

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
    const { specs, features } = serializeProductSpecs();

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
        description,
        specs,
        features
      });
      ui.showToast({
        title: 'Product Updated',
        message: `"${name}" specifications updated successfully.`,
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
        description,
        specs,
        features
      });
      ui.showToast({
        title: 'Product Created',
        message: `"${name}" added to 7th June catalog with specifications.`,
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

/**
 * Technical Specifications & Engineered Highlights Builder Controller
 * Replicates the Storefront PDP Specifications Section (Matches Reference Screenshot)
 */
export const SPEC_TEMPLATES = {
  keyboard: {
    label: 'Keyboard',
    category: 'Keyboards & Keycaps',
    desc: 'Engineered for competitive gamers and high-speed typing enthusiasts. Features custom magnetic Hall-Effect switches with adjustable actuation.',
    specs: {
      'Switch Type': 'Gateron Magnetic Jade Hall-Effect Switches',
      'Actuation Point': 'Adjustable 0.1mm - 4.0mm (0.01mm Precision)',
      'Polling Rate': '8000Hz (0.125ms Ultra-Low Latency)',
      'Chassis': 'Solid CNC 6063 Anodized Aluminum',
      'Keycaps': 'Double-shot PBT Cherry Profile',
      'Connectivity': 'Detachable Braided USB-C / 2.4GHz Wireless / BT 5.3',
      'Battery': '8000 mAh (Up to 320 hours battery life)'
    },
    features: [
      'Rapid Trigger technology for instantaneous key resets',
      'Dynamic Keystroke (DKS) assigns 4 actions to a single press',
      'Hot-swappable magnetic switch sockets',
      'Multi-layer Poron & IXPE acoustic sound dampeners'
    ]
  },
  mouse: {
    label: 'Mouse',
    category: 'Mice & Precision',
    desc: 'Tournament-grade wireless precision engineered for pinpoint accuracy, 8000Hz polling, and ultralight featherweight shell.',
    specs: {
      'Sensor': 'PAW3395 Ultra-Gaming Optical Sensor',
      'Resolution': 'Up to 26,000 DPI (50 DPI increments)',
      'Polling Rate': '8000Hz True Hyper-Polling Wireless',
      'Max Speed / Acceleration': '650 IPS / 50G Acceleration',
      'Switches': 'Optical Light-Strike Switches (90M Clicks)',
      'Weight': '49g Featherweight Ultra-Light Shell',
      'Battery Life': 'Up to 150 Hours continuous gameplay'
    },
    features: [
      '8000Hz Hyper-Polling rate with sub-0.125ms wireless latency',
      'PAW3395 optical sensor with 1:1 raw tracking precision',
      'Zero-debounce optical micro-switches preventing double clicks',
      'Pure virgin PTFE rounded glide skates for effortless glide'
    ]
  },
  audio: {
    label: 'Headset',
    category: 'Audio & Headsets',
    desc: 'Studio-grade audiophile acoustics tuned for high-fidelity spatial awareness, 50mm bio-cellulose drivers, and broadcast mic.',
    specs: {
      'Driver Diameter': '50mm Custom Bio-Cellulose Diaphragms',
      'Frequency Response': '10Hz – 40,000Hz (Hi-Res Audio Certified)',
      'Impedance': '32 Ohms @ 1kHz',
      'Microphone': 'Detachable 9.7mm Broadcast-Grade Condenser',
      'Connectivity': '2.4GHz Ultra-Low Latency / BT 5.3 / 3.5mm Analog',
      'Battery Life': 'Up to 80 Hours (Fast charge: 15min = 8hrs)'
    },
    features: [
      'Hi-Res certified 50mm bio-cellulose acoustic soundstage',
      'Custom spatial 7.1 directional audio positioning engine',
      'Ultra-dense memory foam ear cushions with cooling gel layer',
      'Broadcast-grade detachable noise-cancelling boom microphone'
    ]
  },
  laptop: {
    label: 'Laptop',
    category: 'Laptops & Workstations',
    desc: 'Flagship engineering mobile workstation powered by 24-core processing, RTX graphics, and color-calibrated 240Hz display.',
    specs: {
      'Processor (CPU)': 'Intel Core i9-14900HX (24 Cores, up to 5.8GHz)',
      'Graphics (GPU)': 'NVIDIA GeForce RTX 4080 (12GB GDDR6X, 175W TGP)',
      'Memory (RAM)': '32GB DDR5 5600MHz (Dual-Channel, Expandable to 64GB)',
      'Storage (SSD)': '1TB PCIe 4.0 NVMe M.2 High-Speed SSD',
      'Display': '16.0" QHD+ (2560x1600) 240Hz 3ms, 100% DCI-P3 500 nits',
      'Cooling': 'Vapor Chamber Liquid Metal Dual-Fan Thermal Architecture',
      'Operating System': 'Windows 11 Pro 64-bit Genuine Licensed'
    },
    features: [
      '24-core flagship processing with extreme multi-threaded throughput',
      'RTX 40-series ray tracing and DLSS 3.5 AI neural rendering',
      '240Hz color-calibrated display with 100% DCI-P3 cinema gamut',
      'Vapor chamber liquid cooling keeping sustained peak clock speeds'
    ]
  },
  gamingpc: {
    label: 'Gaming PC',
    category: 'Gaming PCs & Towers',
    desc: 'Mastercraft custom liquid-cooled gaming PC delivering pinnacle 4K ray-traced frame rates and panoramic showcase glass.',
    specs: {
      'Processor (CPU)': 'AMD Ryzen 7 7800X3D (8 Cores, 16 Threads, 3D V-Cache)',
      'Graphics (GPU)': 'NVIDIA GeForce RTX 4090 24GB GDDR6X',
      'Motherboard': 'ASUS ROG Strix X670E Gaming WiFi',
      'Memory (RAM)': '64GB (2x32GB) DDR5 6000MHz CL30 EXPO RGB',
      'Storage (SSD)': '2TB Samsung 990 PRO PCIe 4.0 NVMe SSD',
      'Cooling': '360mm AIO Liquid Cooler with LCD Display & ARGB',
      'Power Supply': '1000W 80+ Gold Fully Modular ATX 3.0 / PCIe 5.0'
    },
    features: [
      '3D V-Cache architecture delivering unmatched gaming frame rates',
      'Titan-class RTX 4090 with 24GB VRAM for 4K ray tracing and AI',
      'Ultra-silent 360mm closed-loop liquid thermal distribution',
      'Dual-chamber tempered glass panoramic showcase chassis'
    ]
  },
  monitor: {
    label: 'Monitor',
    category: 'Monitors & Mounts',
    desc: 'Esports-grade 240Hz fast IPS display with ergonomic heavy-duty gas spring articulating arm and DisplayHDR 600.',
    specs: {
      'Panel Type': 'Fast IPS Quantum Dot LED Backlit',
      'Screen Size & Resolution': '27-inch QHD (2560 x 1440) 16:9 Aspect Ratio',
      'Refresh Rate & Response': '240Hz Hyper-Smooth / 0.5ms (GtG Min)',
      'Color Gamut & HDR': '99% DCI-P3, 10-Bit Color, VESA DisplayHDR 600',
      'Sync Technology': 'NVIDIA G-SYNC Compatible & AMD FreeSync Premium Pro',
      'Mount / Ergonomics': 'Integrated Heavy-Duty Gas-Spring Articulating Arm'
    },
    features: [
      '240Hz Fast IPS panel delivering razor-sharp motion clarity',
      '0.5ms response time eliminating ghosting and inverse trails',
      'VESA DisplayHDR 600 certified with vibrant color precision',
      'Fully articulating dynamic gas-spring arm with concealed cable channel'
    ]
  },
  hub: {
    label: 'Hub/Dock',
    category: 'Hubs & Docks',
    desc: 'Enterprise 40Gbps Thunderbolt 4 expansion dock powering dual external 4K monitors and 100W laptop fast-charging.',
    specs: {
      'Interface': 'Thunderbolt 4 / USB4 (40Gbps Bi-Directional Bandwidth)',
      'Power Delivery': 'Up to 100W Host Fast-Charging (PD 3.0)',
      'Video Outputs': 'Dual 4K @ 60Hz or Single 8K @ 30Hz (HDMI 2.1 + DP 1.4)',
      'Ports': '3x USB-A 3.2, 2x USB-C 10Gbps, Gigabit Ethernet RJ45, SD/TF 4.0',
      'Housing': 'Precision CNC Machined Anodized Heat-Dissipating Aluminum'
    },
    features: [
      '40Gbps extreme transfer speeds with dual 4K display expansion',
      '100W Power Delivery charges laptops and workstations simultaneously',
      'Industrial solid aluminum casing for passive heat mitigation',
      'Plug-and-play driverless compatibility across Mac, Windows, and Linux'
    ]
  }
};

function escapeSpecHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setupProductSpecsBuilder(product = null) {
  const container = document.getElementById('admin-specs-builder-group');
  if (!container) return;

  const tbody = document.getElementById('admin-specs-tbody');
  const featuresList = document.getElementById('admin-features-list');
  const editModeBtn = document.getElementById('specs-mode-edit-btn');
  const previewModeBtn = document.getElementById('specs-mode-preview-btn');
  const editorPane = document.getElementById('specs-editor-pane');
  const previewPane = document.getElementById('specs-live-preview-pane');
  const addSpecBtn = document.getElementById('admin-add-spec-row-btn');
  const addFeatureBtn = document.getElementById('admin-add-feature-row-btn');
  const categorySelect = document.getElementById('modal-prod-category');
  const descEl = document.getElementById('modal-prod-desc');

  // Mode Toggle (Editor vs Storefront Live Preview)
  if (editModeBtn && previewModeBtn && editorPane && previewPane) {
    editModeBtn.onclick = (e) => {
      e.preventDefault();
      sounds.playClick();
      editModeBtn.classList.add('is-active');
      previewModeBtn.classList.remove('is-active');
      editorPane.style.display = 'block';
      previewPane.style.display = 'none';
    };

    previewModeBtn.onclick = (e) => {
      e.preventDefault();
      sounds.playClick();
      previewModeBtn.classList.add('is-active');
      editModeBtn.classList.remove('is-active');
      editorPane.style.display = 'none';
      previewPane.style.display = 'block';
      updateSpecsCountAndPreview();
    };
  }

  // Row Creation Helpers
  const createSpecRow = (key = '', val = '') => {
    const tr = document.createElement('tr');
    tr.className = 'admin-spec-row-item';
    tr.innerHTML = `
      <td>
        <input type="text" class="admin-spec-key-input" list="common-spec-keys" placeholder="e.g. Switch Type" value="${escapeSpecHtml(key)}" />
      </td>
      <td>
        <input type="text" class="admin-spec-val-input" placeholder="e.g. Gateron Magnetic Jade" value="${escapeSpecHtml(val)}" />
      </td>
      <td style="text-align: center;">
        <button type="button" class="admin-spec-del-btn" title="Remove specification row" aria-label="Remove row">&times;</button>
      </td>
    `;

    tr.querySelector('.admin-spec-del-btn').addEventListener('click', () => {
      sounds.playPop();
      tr.remove();
      updateSpecsCountAndPreview();
    });

    tr.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => updateSpecsCountAndPreview());
    });

    return tr;
  };

  const createFeatureRow = (text = '') => {
    const div = document.createElement('div');
    div.className = 'admin-feature-row';
    div.innerHTML = `
      <span class="feature-check-icon">✓</span>
      <input type="text" class="admin-feature-input" placeholder="e.g. Rapid Trigger technology for instantaneous key resets" value="${escapeSpecHtml(text)}" />
      <button type="button" class="admin-feature-del-btn" title="Remove highlight" aria-label="Remove highlight">&times;</button>
    `;

    div.querySelector('.admin-feature-del-btn').addEventListener('click', () => {
      sounds.playPop();
      div.remove();
      updateSpecsCountAndPreview();
    });

    div.querySelector('input').addEventListener('input', () => updateSpecsCountAndPreview());

    return div;
  };

  const updateSpecsCountAndPreview = () => {
    const specRows = tbody ? Array.from(tbody.querySelectorAll('.admin-spec-row-item')) : [];
    const featureRows = featuresList ? Array.from(featuresList.querySelectorAll('.admin-feature-row')) : [];

    // Update Counts Badges
    const specsBadge = document.getElementById('admin-specs-count-badge');
    const featuresBadge = document.getElementById('admin-features-count-badge');
    if (specsBadge) specsBadge.textContent = `${specRows.length} specs`;
    if (featuresBadge) featuresBadge.textContent = `${featureRows.length} highlights`;

    // Update Storefront Live Preview
    const previewTbody = document.getElementById('specs-preview-tbody');
    const previewFeaturesList = document.getElementById('specs-preview-features-list');

    if (previewTbody) {
      if (specRows.length === 0) {
        previewTbody.innerHTML = `<tr><td colspan="2" class="specs-empty-notice">No specifications added yet. Click "+ Add Spec Row" or choose a Quick Preset above.</td></tr>`;
      } else {
        previewTbody.innerHTML = specRows.map(row => {
          const k = row.querySelector('.admin-spec-key-input')?.value.trim() || 'Specification';
          const v = row.querySelector('.admin-spec-val-input')?.value.trim() || '—';
          return `
            <tr>
              <td class="preview-spec-name">${escapeSpecHtml(k)}</td>
              <td class="preview-spec-val">${escapeSpecHtml(v)}</td>
            </tr>
          `;
        }).join('');
      }
    }

    if (previewFeaturesList) {
      if (featureRows.length === 0) {
        previewFeaturesList.innerHTML = `<li class="specs-empty-notice" style="grid-column: 1 / -1;">No features added yet. Click "+ Add Highlight" to include engineered selling points.</li>`;
      } else {
        previewFeaturesList.innerHTML = featureRows.map(row => {
          const f = row.querySelector('.admin-feature-input')?.value.trim();
          if (!f) return '';
          return `
            <li>
              <span class="preview-check-icon">✓</span>
              <span>${escapeSpecHtml(f)}</span>
            </li>
          `;
        }).join('');
      }
    }
  };

  // Add Spec Button
  if (addSpecBtn && tbody) {
    addSpecBtn.onclick = (e) => {
      e.preventDefault();
      sounds.playClick();
      const row = createSpecRow('', '');
      tbody.appendChild(row);
      row.querySelector('.admin-spec-key-input')?.focus();
      updateSpecsCountAndPreview();
    };
  }

  // Add Feature Button
  if (addFeatureBtn && featuresList) {
    addFeatureBtn.onclick = (e) => {
      e.preventDefault();
      sounds.playClick();
      const row = createFeatureRow('');
      featuresList.appendChild(row);
      row.querySelector('.admin-feature-input')?.focus();
      updateSpecsCountAndPreview();
    };
  }


  // Template Loader
  const loadTemplate = (tplKey) => {
    if (!tbody || !featuresList) return;
    tbody.innerHTML = '';
    featuresList.innerHTML = '';

    // Update template button active styles
    container.querySelectorAll('.specs-tpl-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tpl === tplKey);
    });

    if (tplKey === 'clear') {
      updateSpecsCountAndPreview();
      return;
    }

    const tpl = SPEC_TEMPLATES[tplKey];
    if (tpl) {
      // Populate Specs Table
      Object.entries(tpl.specs || {}).forEach(([k, v]) => {
        tbody.appendChild(createSpecRow(k, v));
      });

      // Populate Features
      (tpl.features || []).forEach(f => {
        featuresList.appendChild(createFeatureRow(f));
      });

      // Update description if currently blank
      if (descEl && (!descEl.value || descEl.value.trim() === '')) {
        descEl.value = tpl.desc || '';
      }

      updateSpecsCountAndPreview();
    }
  };

  // Wire Template Buttons
  container.querySelectorAll('.specs-tpl-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      sounds.playClick();
      const tplKey = btn.dataset.tpl;
      loadTemplate(tplKey);
      if (tplKey !== 'clear') {
        ui.showToast({
          title: 'Specs Template Loaded',
          message: `Loaded ${SPEC_TEMPLATES[tplKey]?.label || tplKey} table & highlights.`,
          type: 'info'
        });
      }
    };
  });

  // Category Auto-Mapper for new products
  if (categorySelect) {
    categorySelect.onchange = () => {
      const isNew = !document.getElementById('modal-prod-id')?.value;
      if (isNew) {
        const cat = categorySelect.value;
        let matchedTpl = 'keyboard';
        if (cat.includes('Mice')) matchedTpl = 'mouse';
        else if (cat.includes('Audio')) matchedTpl = 'audio';
        else if (cat.includes('Laptops')) matchedTpl = 'laptop';
        else if (cat.includes('Towers') || cat.includes('Gaming PCs')) matchedTpl = 'gamingpc';
        else if (cat.includes('Monitors')) matchedTpl = 'monitor';
        else if (cat.includes('Hubs')) matchedTpl = 'hub';
        loadTemplate(matchedTpl);
      }
    };
  }

  // Populate Initial State
  if (tbody && featuresList) {
    tbody.innerHTML = '';
    featuresList.innerHTML = '';

    const hasSpecs = product && product.specs && Object.keys(product.specs).length > 0;
    const hasFeatures = product && product.features && product.features.length > 0;

    if (hasSpecs || hasFeatures) {
      if (hasSpecs) {
        Object.entries(product.specs).forEach(([k, v]) => {
          tbody.appendChild(createSpecRow(k, v));
        });
      }
      if (hasFeatures) {
        product.features.forEach(f => {
          featuresList.appendChild(createFeatureRow(f));
        });
      }
      updateSpecsCountAndPreview();
    } else {
      updateSpecsCountAndPreview();
    }
  }
}

export function serializeProductSpecs() {
  const tbody = document.getElementById('admin-specs-tbody');
  const featuresList = document.getElementById('admin-features-list');

  const specs = {};
  if (tbody) {
    tbody.querySelectorAll('.admin-spec-row-item').forEach(row => {
      const key = row.querySelector('.admin-spec-key-input')?.value.trim();
      const val = row.querySelector('.admin-spec-val-input')?.value.trim();
      if (key && val) {
        specs[key] = val;
      }
    });
  }

  const features = [];
  if (featuresList) {
    featuresList.querySelectorAll('.admin-feature-row').forEach(row => {
      const f = row.querySelector('.admin-feature-input')?.value.trim();
      if (f) {
        features.push(f);
      }
    });
  }

  return { specs, features };
}

