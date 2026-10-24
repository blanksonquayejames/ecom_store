/**
 * 7th JUNE COMPUTERS - Dedicated Authentication Page (Sign In & Sign Up)
 * Replaces interstitial checkout gates with a full-fledged client access view.
 */

import { store } from './state.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';
import { performLogin, performRegister } from './auth-modal.js';

export function renderAuthView(container, options = {}) {
  const currentView = store.state.currentView || {};
  const redirectTo = options.redirectTo || currentView.redirectTo || null;
  const initialMode = options.mode || currentView.tab || 'login';

  // If already logged in, redirect away
  if (store.state.user && store.state.user.isLoggedIn) {
    if (redirectTo) {
      store.setView(redirectTo);
    } else {
      store.setView('account', null, { tab: 'overview' });
    }
    return;
  }

  const isCheckoutFlow = redirectTo === 'checkout';

  container.innerHTML = `
    <div class="auth-page-wrapper animate-fade-in">
      <div class="container" style="max-width: 580px; margin: 2rem auto; padding: 0 1.25rem;">
        
        <!-- Breadcrumb Navigation -->
        <nav class="account-breadcrumb-nav mb-4" aria-label="Breadcrumb">
          <a href="#/catalog" class="account-breadcrumb-link" id="auth-bread-home">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Storefront
          </a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-active" id="auth-bread-title">${initialMode === 'register' ? 'Create VIP Account' : 'Client Sign In'}</span>
        </nav>

        <!-- Auth Card -->
        <div class="auth-page-card">
          
          <!-- Brand Header -->
          <div class="auth-page-header text-center">
            <img src="image/7th June logo.png" alt="7th June Computers" class="auth-page-logo" />
            <h1 class="auth-page-title">7th June Computers</h1>
            <p class="auth-page-sub">Client Identity & Dispatch Services</p>
          </div>

          <!-- Checkout Flow Notice (if navigating from Cart / Checkout) -->
          ${isCheckoutFlow ? `
            <div class="auth-flow-notice animate-fade-in">
              <div class="auth-flow-notice-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div class="auth-flow-notice-text">
                <strong>Sign In or Register to Checkout</strong>
                <p>Please sign in or create an account to finalize your order, apply VIP rewards, and access live delivery tracking.</p>
              </div>
            </div>
          ` : ''}

          <!-- Segmented Tab Navigation -->
          <div class="auth-page-tabs-wrap">
            <button type="button" class="auth-page-tab-btn ${initialMode === 'login' ? 'is-active' : ''}" id="auth-page-tab-login">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Sign In
            </button>
            <button type="button" class="auth-page-tab-btn ${initialMode === 'register' ? 'is-active' : ''}" id="auth-page-tab-register">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Create Account
            </button>
          </div>

          <!-- Tab Content: Sign In Form -->
          <form class="auth-page-form" id="auth-page-login-form" style="${initialMode === 'login' ? 'display: block;' : 'display: none;'}">
            <div class="form-group mb-3">
              <label for="page-login-email" class="form-label">Email Address</label>
              <div class="input-with-icon">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" class="custom-input with-left-icon" id="page-login-email" placeholder="name@example.com" required value="julian.vance@7thjune.com" />
              </div>
            </div>

            <div class="form-group mb-3">
              <label for="page-login-pwd" class="form-label">Password</label>
              <div class="input-with-icon">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" class="custom-input with-left-icon with-right-btn" id="page-login-pwd" placeholder="Enter your password" required value="demo1234" />
                <button type="button" class="input-action-btn" id="btn-toggle-login-pwd" title="Toggle password visibility">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div class="auth-extra-row mb-4">
              <label class="custom-checkbox">
                <input type="checkbox" id="page-login-remember" checked />
                <span class="checkmark"></span>
                <span class="text-sm">Remember me</span>
              </label>
              <a href="#" class="forgot-link text-sm" id="page-forgot-pwd-link">Forgot Password?</a>
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-100" id="page-login-submit-btn">
              ${isCheckoutFlow ? 'Sign In & Proceed to Checkout &rarr;' : 'Sign In to Account'}
            </button>

            <!-- 1-Click Demo Profiles -->
            <div class="auth-demo-profiles-box mt-4">
              <span class="demo-profiles-title">Quick 1-Click Demo Login:</span>
              <div class="demo-pills-row">
                <button type="button" class="btn btn-sm btn-ghost demo-pill-btn" id="quick-demo-customer">
                  <span class="pill-dot green-dot"></span>
                  Demo Customer (Julian)
                </button>
                <button type="button" class="btn btn-sm btn-ghost demo-pill-btn" id="quick-demo-admin">
                  <span class="pill-dot red-dot"></span>
                  Demo Admin (Kwame)
                </button>
              </div>
            </div>

            <div class="auth-switch-wrap text-center mt-4">
              <span class="text-muted text-sm">Don't have an account?</span>
              <button type="button" class="auth-switch-link-btn" id="auth-switch-tab-to-reg">Create VIP Account</button>
            </div>
          </form>

          <!-- Tab Content: Register Form -->
          <form class="auth-page-form" id="auth-page-reg-form" style="${initialMode === 'register' ? 'display: block;' : 'display: none;'}">
            <div class="form-group mb-3">
              <label for="page-reg-name" class="form-label">Full Legal Name</label>
              <div class="input-with-icon">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" class="custom-input with-left-icon" id="page-reg-name" placeholder="Kwame Blankson" required />
              </div>
            </div>

            <div class="form-group mb-3">
              <label for="page-reg-email" class="form-label">Email Address</label>
              <div class="input-with-icon">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" class="custom-input with-left-icon" id="page-reg-email" placeholder="name@example.com" required />
              </div>
            </div>

            <div class="form-group mb-3">
              <label for="page-reg-phone" class="form-label">Phone Number (For Delivery)</label>
              <div class="input-with-icon">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <input type="tel" class="custom-input with-left-icon" id="page-reg-phone" placeholder="+233 24 555 7788" />
              </div>
            </div>

            <div class="form-group mb-3">
              <label for="page-reg-pwd" class="form-label">Create Password</label>
              <div class="input-with-icon">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" class="custom-input with-left-icon with-right-btn" id="page-reg-pwd" placeholder="At least 8 characters" required />
                <button type="button" class="input-action-btn" id="btn-toggle-reg-pwd" title="Toggle password visibility">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div class="form-group mb-4">
              <label class="custom-checkbox">
                <input type="checkbox" id="page-reg-vip-optin" checked />
                <span class="checkmark"></span>
                <span class="text-sm">Join 7th June VIP Rewards (+500 Bonus Points)</span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-100" id="page-reg-submit-btn">
              ${isCheckoutFlow ? 'Create VIP Account & Proceed to Checkout &rarr;' : 'Create VIP Account (+500 Pts)'}
            </button>

            <div class="auth-switch-wrap text-center mt-4">
              <span class="text-muted text-sm">Already have an account?</span>
              <button type="button" class="auth-switch-link-btn" id="auth-switch-tab-to-login">Sign In</button>
            </div>
          </form>

        </div>

      </div>
    </div>
  `;

  attachAuthViewEvents(container, redirectTo);
}

function attachAuthViewEvents(container, redirectTo) {
  const tabLoginBtn = container.querySelector('#auth-page-tab-login');
  const tabRegBtn = container.querySelector('#auth-page-tab-register');
  const loginForm = container.querySelector('#auth-page-login-form');
  const regForm = container.querySelector('#auth-page-reg-form');
  const breadTitle = container.querySelector('#auth-bread-title');

  const switchTab = (mode) => {
    sounds.playClick();
    if (mode === 'login') {
      tabLoginBtn?.classList.add('is-active');
      tabRegBtn?.classList.remove('is-active');
      if (loginForm) loginForm.style.display = 'block';
      if (regForm) regForm.style.display = 'none';
      if (breadTitle) breadTitle.textContent = 'Client Sign In';
      history.replaceState(null, '', '#/login');
    } else {
      tabRegBtn?.classList.add('is-active');
      tabLoginBtn?.classList.remove('is-active');
      if (regForm) regForm.style.display = 'block';
      if (loginForm) loginForm.style.display = 'none';
      if (breadTitle) breadTitle.textContent = 'Create VIP Account';
      history.replaceState(null, '', '#/register');
    }
  };

  tabLoginBtn?.addEventListener('click', () => switchTab('login'));
  tabRegBtn?.addEventListener('click', () => switchTab('register'));

  container.querySelector('#auth-switch-tab-to-reg')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('register');
  });

  container.querySelector('#auth-switch-tab-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('login');
  });

  // Breadcrumb home link
  container.querySelector('#auth-bread-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    sounds.playClick();
    store.setView('catalog');
  });

  // Toggle password visibility
  container.querySelector('#btn-toggle-login-pwd')?.addEventListener('click', () => {
    const pwdInput = container.querySelector('#page-login-pwd');
    if (!pwdInput) return;
    pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
  });

  container.querySelector('#btn-toggle-reg-pwd')?.addEventListener('click', () => {
    const pwdInput = container.querySelector('#page-reg-pwd');
    if (!pwdInput) return;
    pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
  });

  // Forgot password link
  container.querySelector('#page-forgot-pwd-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    ui.showToast({
      title: 'Password Recovery',
      message: 'Password reset link sent to your registered email address.',
      type: 'info'
    });
  });

  // Quick Demo Buttons
  container.querySelector('#quick-demo-customer')?.addEventListener('click', () => {
    sounds.playClick();
    const emailInput = container.querySelector('#page-login-email');
    const pwdInput = container.querySelector('#page-login-pwd');
    if (emailInput) emailInput.value = 'julian.vance@7thjune.com';
    if (pwdInput) pwdInput.value = 'demo1234';
    container.querySelector('#auth-page-login-form')?.dispatchEvent(new Event('submit'));
  });

  container.querySelector('#quick-demo-admin')?.addEventListener('click', () => {
    sounds.playClick();
    const emailInput = container.querySelector('#page-login-email');
    const pwdInput = container.querySelector('#page-login-pwd');
    if (emailInput) emailInput.value = 'admin@7thjune.com';
    if (pwdInput) pwdInput.value = 'admin1234';
    container.querySelector('#auth-page-login-form')?.dispatchEvent(new Event('submit'));
  });

  // Submit Login
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    sounds.playClick();
    const email = container.querySelector('#page-login-email')?.value.trim() || 'julian.vance@7thjune.com';
    performLogin(email);

    sounds.playSuccess();
    if (redirectTo === 'checkout') {
      store.setView('checkout');
    } else {
      store.setView('account', null, { tab: 'overview' });
    }
  });

  // Submit Register
  regForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    sounds.playClick();
    const name = container.querySelector('#page-reg-name')?.value.trim() || 'Valued Member';
    const email = container.querySelector('#page-reg-email')?.value.trim() || 'member@7thjune.com';
    const phone = container.querySelector('#page-reg-phone')?.value.trim() || '+233 24 555 7788';

    performRegister(name, email, phone);

    sounds.playSuccess();
    if (redirectTo === 'checkout') {
      store.setView('checkout');
    } else {
      store.setView('account', null, { tab: 'overview' });
    }
  });
}
