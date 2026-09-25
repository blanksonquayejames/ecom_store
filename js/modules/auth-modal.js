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
    authCallback = () => {
      store.setView(options.redirectTo);
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

  setAuthMode(mode);
  ui.openModal('auth-modal');
}

export function closeAuthModal() {
  const noticeEl = document.getElementById('auth-modal-notice');
  if (noticeEl) {
    noticeEl.style.display = 'none';
    noticeEl.innerHTML = '';
  }
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
  const loginTab = document.getElementById('auth-tab-login');
  const registerTab = document.getElementById('auth-tab-register');
  const loginForm = document.getElementById('auth-form-login');
  const registerForm = document.getElementById('auth-form-register');
  const title = document.getElementById('auth-modal-title');

  if (mode === 'login') {
    loginTab?.classList.add('is-active');
    registerTab?.classList.remove('is-active');
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
    if (title) title.textContent = 'Welcome Back to 7th June';
  } else {
    registerTab?.classList.add('is-active');
    loginTab?.classList.remove('is-active');
    if (registerForm) registerForm.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';
    if (title) title.textContent = 'Join 7th June Elite Club';
  }
}

function setupAuthEvents() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  // Tabs
  document.getElementById('auth-tab-login')?.addEventListener('click', () => {
    sounds.playClick();
    setAuthMode('login');
  });

  document.getElementById('auth-tab-register')?.addEventListener('click', () => {
    sounds.playClick();
    setAuthMode('register');
  });

  // Login Submit
  document.getElementById('auth-form-login')?.addEventListener('submit', (e) => {
    e.preventDefault();
    sounds.playClick();
    const inputVal = document.getElementById('login-email')?.value.trim() || 'julian.vance@7thjune.com';
    
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
      triggerAuthSuccess(user);
      ui.showToast({
        title: `Welcome, Sub-Admin ${subAdmin.name}!`,
        message: `Session verified with ${permLabels} access limits.`,
        type: 'success'
      });
      return;
    }

    const email = inputVal;
    const isAdmin = email.toLowerCase().includes('admin');
    const name = isAdmin ? 'Kwame Blankson' : (email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Valued Client');
    const firstName = name.trim().split(' ')[0] || 'Valued Client';

    const user = {
      isLoggedIn: true,
      role: isAdmin ? 'admin' : 'customer',
      name: name,
      email: email,
      phone: isAdmin ? '+233 24 555 8899' : '+233 24 555 7788',
      tier: isAdmin ? 'Chief Technology Officer & Administrator' : '7th June Gold VIP',
      points: isAdmin ? 9999 : 1250,
      avatar: isAdmin 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };

    store.setUser(user);
    triggerAuthSuccess(user);
    ui.showToast({
      title: isAdmin ? `Welcome, Administrator ${firstName}!` : `Welcome back, ${firstName}!`,
      message: isAdmin ? `Administrator session activated with full store management permissions.` : `Order history and delivery addresses loaded.`,
      type: 'success'
    });
  });

  // Register Submit
  document.getElementById('auth-form-register')?.addEventListener('submit', (e) => {
    e.preventDefault();
    sounds.playClick();
    const name = document.getElementById('reg-name')?.value.trim() || 'New Member';
    const email = document.getElementById('reg-email')?.value.trim() || 'client@7thjune.com';
    const firstName = name.trim().split(' ')[0] || 'Member';

    const user = {
      isLoggedIn: true,
      role: 'customer',
      name: name,
      email: email,
      phone: '+233 24 555 7788',
      tier: '7th June VIP Member',
      points: 500,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    };

    store.setUser(user);
    triggerAuthSuccess(user);
    ui.showToast({
      title: `Welcome to 7th June, ${firstName}!`,
      message: `Your VIP account has been created with 500 bonus reward points.`,
      type: 'success'
    });
  });

  // 1-Click VIP Customer Profile (Julian Vance)
  document.getElementById('demo-login-julian')?.addEventListener('click', () => {
    sounds.playClick();
    const user = {
      isLoggedIn: true,
      role: 'customer',
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
    triggerAuthSuccess(user);
    ui.showToast({
      title: `Welcome back, Julian!`,
      message: `Signed in as Julian Vance (VIP Member).`,
      type: 'success'
    });
  });

  // 1-Click Administrator Profile (Kwame Blankson)
  document.getElementById('demo-login-admin')?.addEventListener('click', () => {
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
    triggerAuthSuccess(adminUser);
    ui.showToast({
      title: 'Administrator Verified',
      message: 'Signed in as Chief Administrator Kwame Blankson.',
      type: 'success'
    });
  });

  // 1-Click Sub-Administrator Profile (John - Order Status Access)
  document.getElementById('demo-login-subadmin')?.addEventListener('click', () => {
    sounds.playSuccess();
    const sub = store.findSubAdmin('john') || {
      id: 'sub-admin-john',
      name: 'John',
      username: 'john',
      email: 'john@7thjune.com',
      permissions: ['orders']
    };
    const subUser = {
      isLoggedIn: true,
      role: 'sub-admin',
      name: sub.name,
      username: sub.username,
      email: sub.email,
      permissions: sub.permissions || ['orders'],
      phone: '+233 24 555 4422',
      tier: 'Sub-Admin (Order Status Access)',
      points: 500,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      addresses: []
    };
    store.setUser(subUser);
    triggerAuthSuccess(subUser);
    ui.showToast({
      title: 'Sub-Admin John Verified',
      message: 'Signed in with Order Status access limits.',
      type: 'success'
    });
  });

  document.getElementById('demo-login-guest')?.addEventListener('click', () => {
    sounds.playClick();
    authCallback = null;
    store.logout();
    closeAuthModal();
    ui.showToast({
      title: 'Browsing as Guest',
      message: 'Sign in anytime from Account to view past orders and saved addresses.',
      type: 'info'
    });
  });
}
