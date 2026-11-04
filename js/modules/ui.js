/**
 * AURA LUXE - UI Helper & Component Manager
 * Toast notifications, drawer controller, modal controllers, and live tickers.
 */

import { sounds } from './audio.js';
import { store } from './state.js';
import { convertPrice } from './currency.js';

class UIManager {
  constructor() {
    this.toastContainer = null;
    this.navToastTimer = null;
  }

  init() {
    this.toastContainer = document.getElementById('toast-container');
    this.setupEscapeListener();

    // Close on view changes
    store.subscribe('view_changed', () => {
      this.closeNavNotification();
    });

    // Automatically trigger navbar notification on cart item added
    store.subscribe('cart_item_added', (payload) => {
      const item = payload && payload.item ? payload.item : store.state.lastAddedItem;
      this.showNavCartNotification({
        title: payload && !payload.isNew ? 'Cart Updated' : 'Added to Cart',
        item
      });
    });
  }

  isCartToast(title, message) {
    const t = (title || '').toLowerCase();
    const m = (message || '').toLowerCase();
    return (
      t.includes('added to cart') ||
      t.includes('cart updated') ||
      t.includes('added to bag') ||
      t.includes('reorder added') ||
      t.includes('item removed') ||
      t.includes('removed from cart') ||
      t.includes('deleted') ||
      t.includes('removed') ||
      m.includes('removed from cart') ||
      m.includes('removed from bag') ||
      m.includes('added to cart') ||
      m.includes('in your cart') ||
      m.includes('removed') ||
      m.includes('deleted') ||
      (t.includes('cart') && (m.includes('added') || m.includes('shopping cart') || m.includes('in your cart') || m.includes('removed') || m.includes('deleted') || m.includes('bag')))
    );
  }

  /**
   * Temu-Style Navbar Notification Pill
   * Sleek, high-contrast, compact toast that drops down from the navbar.
   * Matches Temu's remove from cart / add to cart navbar banner.
   */
  showNavNotification({
    message = 'Added to Cart',
    icon = 'check', // 'check' | 'trash' | 'info' | 'error'
    thumb = null,
    actionText = null,
    onAction = null,
    duration = 3500
  } = {}) {
    const toast = document.getElementById('nav-toast');
    if (!toast) return;

    if (this.navToastTimer) {
      clearTimeout(this.navToastTimer);
      this.navToastTimer = null;
    }

    const msgEl = document.getElementById('nav-toast-msg');
    const iconEl = document.getElementById('nav-toast-icon');
    const thumbEl = document.getElementById('nav-toast-thumb');
    const actionBtn = document.getElementById('nav-toast-action');
    const closeBtn = document.getElementById('nav-toast-close');

    if (msgEl) msgEl.textContent = message;

    // Optional Product Thumbnail
    if (thumb && thumbEl) {
      thumbEl.src = thumb;
      thumbEl.alt = message;
      thumbEl.style.display = 'inline-block';
    } else if (thumbEl) {
      thumbEl.style.display = 'none';
    }

    // Status Icon (Temu green checkmark circle)
    if (iconEl) {
      if (icon === 'trash') {
        iconEl.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
      } else if (icon === 'error') {
        iconEl.innerHTML = `<svg width="17" height="17" viewBox="0 0 20 20" fill="#EF4444"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`;
      } else {
        // Standard Temu green checkmark
        iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 20 20" fill="#22C55E"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`;
      }
    }

    // Action Button (e.g. "Undo" or "View Cart")
    if (actionBtn) {
      if (actionText) {
        actionBtn.textContent = actionText;
        actionBtn.style.display = 'inline-block';
        actionBtn.onclick = (e) => {
          e.stopPropagation();
          this.closeNavNotification();
          if (typeof onAction === 'function') onAction();
        };
      } else {
        actionBtn.style.display = 'none';
        actionBtn.onclick = null;
      }
    }

    // Close Button
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        this.closeNavNotification();
      };
    }

    // Animate in from navbar
    toast.classList.remove('is-hiding');
    toast.classList.add('is-visible');

    // Bounce cart badge
    const cartBadge = document.querySelector('.cart-count-badge');
    if (cartBadge) {
      cartBadge.classList.remove('badge-bump');
      void cartBadge.offsetWidth;
      cartBadge.classList.add('badge-bump');
    }

    // Auto-dismiss with pause on hover
    let remainingTime = duration;
    let startTime = Date.now();

    const startTimer = (ms) => {
      this.navToastTimer = setTimeout(() => {
        this.closeNavNotification();
      }, ms);
    };

    toast.onmouseenter = () => {
      if (this.navToastTimer) {
        clearTimeout(this.navToastTimer);
        this.navToastTimer = null;
        remainingTime -= (Date.now() - startTime);
      }
    };

    toast.onmouseleave = () => {
      startTime = Date.now();
      startTimer(Math.max(800, remainingTime));
    };

    startTimer(duration);
  }

  closeNavNotification() {
    const toast = document.getElementById('nav-toast');
    if (!toast) return;
    if (this.navToastTimer) {
      clearTimeout(this.navToastTimer);
      this.navToastTimer = null;
    }
    toast.classList.add('is-hiding');
    setTimeout(() => {
      toast.classList.remove('is-visible', 'is-hiding');
    }, 220);
  }

  showNavCartNotification({ title = 'Added to Cart', message = '', item = null, duration = 3500 } = {}) {
    const isUpdated = (title || '').toLowerCase().includes('update');
    const displayMsg = isUpdated ? 'Cart updated' : 'Item added to cart';

    this.showNavNotification({
      message: displayMsg,
      icon: 'check',
      thumb: null,
      actionText: 'View Cart',
      onAction: () => {
        this.toggleDrawer('cart-drawer', false);
        store.setView('cart');
      },
      duration
    });
  }

  showToast({ title, message, type = 'info', actionText = null, onAction = null, duration = 3500, item = null }) {
    // If it's a cart addition, removal, or deletion, show it right at the navbar without product names!
    if (this.isCartToast(title, message)) {
      const isRemoval = (title || '').toLowerCase().includes('remov') ||
                        (message || '').toLowerCase().includes('remov') ||
                        (title || '').toLowerCase().includes('delet') ||
                        (message || '').toLowerCase().includes('delet');

      const isUpdated = (title || '').toLowerCase().includes('update') ||
                        (message || '').toLowerCase().includes('update');

      let displayMsg = 'Item added to cart';
      if (isRemoval) {
        displayMsg = 'Item removed from cart';
      } else if (isUpdated) {
        displayMsg = 'Cart updated';
      }

      this.showNavNotification({
        message: displayMsg,
        icon: 'check',
        thumb: null,
        actionText: actionText || (isRemoval ? 'Undo' : 'View Cart'),
        onAction: () => {
          if (isRemoval && typeof onAction === 'function') {
            onAction();
          } else {
            this.toggleDrawer('cart-drawer', false);
            store.setView('cart');
          }
        },
        duration: isRemoval ? 4500 : 3500
      });
      return;
    }

    // Fallback standard toast container for non-cart notices
    if (!this.toastContainer) {
      this.toastContainer = document.getElementById('toast-container');
    }
    if (!this.toastContainer) return;

    if (type === 'success') sounds.playSuccess();
    else sounds.playPop();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-up`;
    
    const iconSvg = this.getToastIcon(type);

    toast.innerHTML = `
      <div class="toast-icon-wrap">${iconSvg}</div>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-msg">${message}</div>
      </div>
      ${actionText ? `<button class="toast-action-btn">${actionText}</button>` : ''}
      <button class="toast-close-btn" aria-label="Close Notification">&times;</button>
    `;

    if (actionText && onAction) {
      const actionBtn = toast.querySelector('.toast-action-btn');
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          if (actionText === 'View Cart' || actionText === 'View Bag') {
            this.toggleDrawer('cart-drawer', false);
            store.setView('cart');
          } else if (typeof onAction === 'function') {
            onAction();
          }
          this.dismissToast(toast);
        });
      }
    }

    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.dismissToast(toast));
    }

    this.toastContainer.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        this.dismissToast(toast);
      }, duration);
    }
  }

  dismissToast(toast) {
    if (!toast || !toast.parentElement) return;
    toast.classList.add('toast-fade-out');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }

  getToastIcon(type) {
    switch (type) {
      case 'success':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
      case 'error':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
      case 'warning':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      default:
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }
  }

  // Drawer open / close
  toggleDrawer(drawerId, open = true) {
    const drawer = document.getElementById(drawerId);
    const backdrop = document.getElementById('global-backdrop');
    if (!drawer) return;

    sounds.playClick();

    if (open) {
      drawer.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-active');
      document.body.classList.add('no-scroll');
    } else {
      drawer.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-active');
      document.body.classList.remove('no-scroll');
    }
  }

  // Modal open / close
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('global-backdrop');
    if (!modal) return;

    sounds.playClick();
    modal.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-active');
    document.body.classList.add('no-scroll');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('global-backdrop');
    if (!modal) return;

    modal.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  }

  /**
   * Modern Confirmation Prompt Dialog
   * Returns a Promise resolving to true (confirmed) or false (cancelled)
   */
  confirm({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    subMessage = '',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger', // 'danger' | 'warning' | 'primary'
    icon = null
  } = {}) {
    return new Promise((resolve) => {
      const modal = document.getElementById('confirm-modal');
      const backdrop = document.getElementById('global-backdrop');
      const titleEl = document.getElementById('confirm-modal-title');
      const msgEl = document.getElementById('confirm-modal-message');
      const subMsgBox = document.getElementById('confirm-modal-submessage-box');
      const subMsgEl = document.getElementById('confirm-modal-submessage');
      const iconWrap = document.getElementById('confirm-modal-icon-wrap');
      const iconEl = document.getElementById('confirm-modal-icon');
      const cancelBtn = document.getElementById('confirm-modal-cancel-btn');
      const actionBtn = document.getElementById('confirm-modal-action-btn');
      const closeBtn = document.getElementById('confirm-modal-close-btn');

      if (!modal) {
        resolve(window.confirm(`${title}\n\n${message}`));
        return;
      }

      if (type === 'danger') sounds.playPop();
      else sounds.playClick();

      if (titleEl) titleEl.textContent = title;
      if (msgEl) msgEl.innerHTML = message;

      if (subMsgBox && subMsgEl) {
        if (subMessage) {
          subMsgEl.innerHTML = subMessage;
          subMsgBox.style.display = 'block';
        } else {
          subMsgBox.style.display = 'none';
        }
      }

      const defaultIcons = {
        danger: '🗑️',
        warning: '🚪',
        primary: '✓',
        info: 'ℹ️'
      };
      if (iconEl) iconEl.textContent = icon || defaultIcons[type] || '⚠️';

      if (iconWrap) {
        iconWrap.className = `confirm-icon-wrap confirm-theme-${type}`;
      }

      if (actionBtn) {
        actionBtn.textContent = confirmText;
        actionBtn.className = `btn flex-1 ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`;
      }

      if (cancelBtn) {
        cancelBtn.textContent = cancelText;
      }

      let settled = false;
      const finish = (confirmed) => {
        if (settled) return;
        settled = true;
        sounds.playClick();
        window.removeEventListener('keydown', onKeyDown);
        cancelBtn?.removeEventListener('click', onCancel);
        actionBtn?.removeEventListener('click', onAction);
        closeBtn?.removeEventListener('click', onCancel);
        backdrop?.removeEventListener('click', onBackdrop);
        this.closeModal('confirm-modal');
        resolve(confirmed);
      };

      const onAction = () => finish(true);
      const onCancel = () => finish(false);
      const onBackdrop = () => {
        if (modal.classList.contains('is-open')) finish(false);
      };

      const onKeyDown = (e) => {
        if (!modal.classList.contains('is-open')) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          finish(false);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          finish(true);
        }
      };

      cancelBtn?.addEventListener('click', onCancel);
      actionBtn?.addEventListener('click', onAction);
      closeBtn?.addEventListener('click', onCancel);
      backdrop?.addEventListener('click', onBackdrop);
      window.addEventListener('keydown', onKeyDown);

      this.openModal('confirm-modal');
      setTimeout(() => actionBtn?.focus(), 60);
    });
  }

  setupEscapeListener() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open modal or drawer
        document.querySelectorAll('.modal.is-open').forEach(m => m.classList.remove('is-open'));
        document.querySelectorAll('.drawer.is-open').forEach(d => d.classList.remove('is-open'));
        this.closeNavNotification();
        const backdrop = document.getElementById('global-backdrop');
        if (backdrop) backdrop.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
      }
    });

    const backdrop = document.getElementById('global-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        document.querySelectorAll('.modal.is-open').forEach(m => m.classList.remove('is-open'));
        document.querySelectorAll('.drawer.is-open').forEach(d => d.classList.remove('is-open'));
        this.closeNavNotification();
        backdrop.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
      });
    }
  }
}

export const ui = new UIManager();
