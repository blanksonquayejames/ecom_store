/**
 * 7th JUNE COMPUTERS - User Authentication & Account Modal Controller
 * Handles Sign In, Account Registration, Demo Profiles, and Session Persistence.
 */

import { store } from './state.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';

let authCallback = null;

export function initAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  setupAuthEvents();
}

export function openAuthModal(mode = 'login', options = {}) {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  if (typeof options === 'function') {
    authCallback = options;
  } else if (options && typeof options.onSuccess === 'function') {
    authCallback = options.onSuccess;
  } else if (options && options.redirectTo) {
    const target = options.redirectTo;
    authCallback = (loggedInUser) => {
      // If logging in to access admin page, guarantee admin access
      if (target === 'admin' && loggedInUser && loggedInUser.role !== 'admin' && loggedInUser.role !== 'sub-admin') {
        loggedInUser.role = 'admin';
        loggedInUser.tier = 'Main Administrator (Full Control)';
        store.setUser(loggedInUser);
      }
      store.setView(target);
    };
  } else {
    authCallback = null;
  }

  const noticeEl = document.getElementById('auth-modal-notice');
  if (noticeEl) {
    if (options && options.notice) {
      noticeEl.innerHTML = options.notice;
      noticeEl.style.display = 'block';
    } else {
      noticeEl.style.display = 'none';
      noticeEl.innerHTML = '';
    }
  }

  // Enforce strictly Sign In only when accessing admin (no Create Account option)
  const switchWrap = modal.querySelector('.auth-switch-wrap');
  const subTitle = modal.querySelector('.auth-modal-sub');
  const modalTitle = document.getElementById('auth-modal-title');
  const isForAdmin = options && (options.redirectTo === 'admin' || options.onlySignIn);

  if (isForAdmin) {
    if (switchWrap) switchWrap.style.display = 'none';
    if (modalTitle) modalTitle.textContent = 'Admin Sign In';
    if (subTitle) subTitle.textContent = 'Enter administrator credentials to access store management.';
  } else {
    if (switchWrap) switchWrap.style.display = 'block';
    if (modalTitle) modalTitle.textContent = 'Welcome to 7th June Computers';
    if (subTitle) subTitle.textContent = 'Sign in to track orders, save shipping addresses, and unlock VIP points.';
  }

  setAuthMode(mode);
  ui.openModal('auth-modal');
}

export function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  const noticeEl = document.getElementById('auth-modal-notice');
  if (noticeEl) {
    noticeEl.style.display = 'none';
    noticeEl.innerHTML = '';
  }
  const switchWrap = modal?.querySelector('.auth-switch-wrap');
  if (switchWrap) switchWrap.style.display = 'block';
  ui.closeModal('auth-modal');
}

function triggerAuthSuccess(user) {
  closeAuthModal();
  if (authCallback) {
    const cb = authCallback;
    authCallback = null;
    cb(user);
  }
}

function setAuthMode(mode) {
  const loginForm = document.getElementById('auth-form-login');
  const registerForm = document.getElementById('auth-form-register');
  const title = document.getElementById('auth-modal-title');

  if (mode === 'login') {
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
    if (title) title.textContent = 'Welcome to 7th June Computers';
  } else {
    if (registerForm) registerForm.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';
    if (title) title.textContent = '7th June Computers';
  }
}

function setupAuthEvents() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  // Mode Switch Links
  document.getElementById('auth-switch-to-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    sounds.playClick();
    setAuthMode('register');
  });

  document.getElementById('auth-switch-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    sounds.playClick();
    setAuthMode('login');
  });

  // Login Submit
  document.getElementById('auth-form-login')?.addEventListener('submit', (e) => {
    e.preventDefault();
    sounds.playClick();
    const inputVal = document.getElementById('login-email')?.value.trim() || 'julian.vance@7thjune.com';
    const user = performLogin(inputVal);
    triggerAuthSuccess(user);
  });

  // Register Submit
  document.getElementById('auth-form-register')?.addEventListener('submit', (e) => {
    e.preventDefault();
    sounds.playClick();
    const name = document.getElementById('reg-name')?.value.trim() || 'New Member';
    const email = document.getElementById('reg-email')?.value.trim() || 'client@7thjune.com';
    const user = performRegister(name, email);
    triggerAuthSuccess(user);
  });
}

export function performLogin(inputVal) {
  // Check if credentials match a Sub-Admin
  const subAdmin = store.findSubAdmin(inputVal);
  if (subAdmin) {
    const permLabels = (subAdmin.permissions || ['orders']).map(p => {
      if (p === 'orders') return 'Order Status';
      if (p === 'products') return 'Products';
      if (p === 'customers') return 'Customers';
      if (p === 'settings') return 'Settings';
      return p;
    }).join(', ');

    const user = {
      isLoggedIn: true,
      role: 'sub-admin',
      name: subAdmin.name,
      username: subAdmin.username,
      email: subAdmin.email,
      permissions: subAdmin.permissions || ['orders'],
      phone: '+233 24 555 4422',
      tier: `Sub-Admin (${permLabels})`,
      points: 500,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      addresses: []
    };

    store.setUser(user);
    ui.showToast({
      title: `Welcome, Sub-Admin ${subAdmin.name}!`,
      message: `Session verified with ${permLabels} access limits.`,
      type: 'success'
    });
    return user;
  }

  const email = inputVal;
  const isAdmin = email.toLowerCase().includes('admin') || 
                  email.toLowerCase().includes('kwame') || 
                  email.toLowerCase() === 'admin' ||
                  email.toLowerCase().includes('manager');
  const name = isAdmin ? 'Kwame Blankson' : (email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Valued Client');
  const firstName = name.trim().split(' ')[0] || 'Valued Client';

  const user = {
    isLoggedIn: true,
    role: isAdmin ? 'admin' : 'customer',
    name: name,
    email: email.includes('@') ? email : `${email}@7thjune.com`,
    phone: isAdmin ? '+233 24 555 8899' : '+233 24 555 7788',
    tier: isAdmin ? 'Main Administrator (Full Control)' : '7th June Gold VIP',
    points: isAdmin ? 9999 : 1250,
    avatar: isAdmin 
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  };

  store.setUser(user);
  ui.showToast({
    title: isAdmin ? `Welcome, Administrator ${firstName}!` : `Welcome back, ${firstName}!`,
    message: isAdmin ? `Administrator session activated with full store management permissions.` : `Order history and delivery addresses loaded.`,
    type: 'success'
  });
  return user;
}

export function performRegister(name, email, phone = '+233 24 555 7788') {
  const firstName = name.trim().split(' ')[0] || 'Member';
  const user = {
    isLoggedIn: true,
    role: 'customer',
    name: name,
    email: email,
    phone: phone,
    tier: '7th June VIP Member',
    points: 500,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  };

  store.setUser(user);
  ui.showToast({
    title: `Welcome to 7th June Computers, ${firstName}!`,
    message: `Your VIP account has been created with 500 bonus reward points.`,
    type: 'success'
  });
  return user;
}

