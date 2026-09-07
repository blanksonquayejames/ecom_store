/**
 * AURA LUXE - UI Helper & Component Manager
 * Toast notifications, drawer controller, modal controllers, and live tickers.
 */

import { sounds } from './audio.js';

class UIManager {
  constructor() {
    this.toastContainer = null;
  }

  init() {
    this.toastContainer = document.getElementById('toast-container');
    this.setupEscapeListener();
  }

  showToast({ title, message, type = 'info', actionText = null, onAction = null, duration = 4000 }) {
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
          onAction();
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
        backdrop.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
      });
    }
  }
}

export const ui = new UIManager();
