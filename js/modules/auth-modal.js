/**
 * 7th JUNE COMPUTERS - User Authentication & Account Modal Controller
 * Handles Sign In, Account Registration, Demo Profiles, and Session Persistence.
 */

import { store } from './state.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';

export function initAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  setupAuthEvents();
}

export function openAuthModal(mode = 'login') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  setAuthMode(mode);
  ui.openModal('auth-modal');
}

export function closeAuthModal() {
  ui.closeModal('auth-modal');
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
    const email = document.getElementById('login-email')?.value.trim() || 'julian.vance@auraconcept.com';
    const name = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Valued Client';

    const user = {
      name: name,
      email: email,
      tier: '7th June Gold Member',
      points: 1250,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };

    store.setUser(user);
    closeAuthModal();
    ui.showToast({
      title: 'Signed In Successfully',
      message: `Welcome back, ${user.name}! Your preferences are active.`,
      type: 'success'
    });
  });

  // Register Submit
  document.getElementById('auth-form-register')?.addEventListener('submit', (e) => {
    e.preventDefault();
    sounds.playClick();
    const name = document.getElementById('reg-name')?.value.trim() || 'New Member';
    const email = document.getElementById('reg-email')?.value.trim() || 'client@7thjune.com';

    const user = {
      name: name,
      email: email,
      tier: '7th June VIP Member',
      points: 500,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    };

    store.setUser(user);
    closeAuthModal();
    ui.showToast({
      title: 'Account Created & 500 Points Awarded',
      message: `Welcome to 7th June Computers, ${user.name}!`,
      type: 'success'
    });
  });

  // 1-Click Demo Profiles
  document.getElementById('demo-login-julian')?.addEventListener('click', () => {
    sounds.playClick();
    const user = {
      name: 'Julian Vance',
      email: 'julian.vance@7thjune.com',
      tier: 'Platinum Titan VIP',
      points: 3450,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };
    store.setUser(user);
    closeAuthModal();
    ui.showToast({
      title: 'Demo Profile Loaded',
      message: 'Signed in as Julian Vance (VIP Tier)',
      type: 'info'
    });
  });

  document.getElementById('demo-login-guest')?.addEventListener('click', () => {
    sounds.playClick();
    const user = {
      name: 'Guest Shopper',
      email: 'guest@7thjune.com',
      tier: 'Guest Express Account',
      points: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
    };
    store.setUser(user);
    closeAuthModal();
    ui.showToast({
      title: 'Browsing as Guest',
      message: 'You can complete your order quickly as a guest.',
      type: 'info'
    });
  });
}
