/**
 * AURA LUXE - Main Application Bootstrap & Controller
 * Global Router, Search Autocomplete, Theme Switcher, Currency Manager, and Event Delegation.
 */

import { store } from './modules/state.js';
import { CURRENCIES, convertPrice } from './modules/currency.js';
import { sounds } from './modules/audio.js';
import { ui } from './modules/ui.js';
import { renderCatalogView, updateProductsList } from './modules/catalog-view.js';
import { renderProductDetailPage, renderQuickViewModal } from './modules/pdp-view.js';
import { initCartDrawer, updateCartBadges } from './modules/cart-drawer.js';
import { renderCheckoutView } from './modules/checkout-view.js';
import { renderAccountView } from './modules/account-view.js';
import { initCompareTray } from './modules/compare-view.js';
import { initAIStylist } from './modules/ai-stylist.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', store.state.theme);

  // Initialize UI & Components
  ui.init();
  initCartDrawer();
  initCompareTray();
  initAIStylist();
  updateCartBadges();
  updateWishlistBadges();

  // Setup Global Header & Navigation
  setupHeaderEvents();
  setupGlobalSearch();

  // Subscribe to View changes
  store.subscribe('view_changed', ({ page, productId }) => {
    handleRoute(page, productId);
  });

  store.subscribe('quick_view_changed', (productId) => {
    if (productId) {
      renderQuickViewModal(productId);
    }
  });

  store.subscribe('wishlist_updated', () => {
    updateWishlistBadges();
  });

  // Initial Route Render
  handleRoute(store.state.currentView.page, store.state.currentView.productId);
}

function handleRoute(page, productId) {
  const mainViewContainer = document.getElementById('app-main-view');
  if (!mainViewContainer) return;

  switch (page) {
    case 'catalog':
      renderCatalogView(mainViewContainer);
      break;
    case 'pdp':
      renderProductDetailPage(mainViewContainer, productId);
      break;
    case 'checkout':
      renderCheckoutView(mainViewContainer);
      break;
    case 'account':
      renderAccountView(mainViewContainer);
      break;
    default:
      renderCatalogView(mainViewContainer);
  }
}

function setupHeaderEvents() {
  // Brand Logo Click
  document.getElementById('brand-logo-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });

  // Theme Toggle Button
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      sounds.playClick();
      const newTheme = store.toggleTheme();
      updateThemeIcon(newTheme);
    });
    updateThemeIcon(store.state.theme);
  }

  // Sound Mute Toggle Button
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = sounds.toggleMute();
      soundBtn.classList.toggle('is-muted', isMuted);
      ui.showToast({
        title: isMuted ? 'Sound FX Muted' : 'Tactile Sound FX Enabled',
        message: isMuted ? 'Audio feedback is now silent.' : 'Luxury audio synthesis active.',
        type: 'info'
      });
    });
  }

  // Currency Dropdown
  const currSelect = document.getElementById('currency-selector');
  if (currSelect) {
    currSelect.value = store.state.currency;
    currSelect.addEventListener('change', (e) => {
      sounds.playClick();
      store.setCurrency(e.target.value);
      ui.showToast({
        title: `Currency Changed to ${e.target.value}`,
        message: `Prices automatically converted with live exchange rates.`,
        type: 'info'
      });
      // Re-render active view to update all displayed currencies
      handleRoute(store.state.currentView.page, store.state.currentView.productId);
    });
  }

  // Bag / Cart Drawer Button
  document.getElementById('header-cart-btn')?.addEventListener('click', () => {
    ui.toggleDrawer('cart-drawer', true);
  });

  // Wishlist Header Button -> Go to Account Wishlist tab
  document.getElementById('header-wishlist-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('account');
    setTimeout(() => {
      document.querySelector('[data-tab="tab-wishlist"]')?.click();
    }, 50);
  });

  // Account Header Button
  document.getElementById('header-account-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('account');
  });

  // Announcement Bar Promo Click
  document.getElementById('announcement-promo-click')?.addEventListener('click', () => {
    store.applyPromo('SAVE20');
    ui.showToast({
      title: 'Code SAVE20 Applied',
      message: '20% discount code added to your order summary.',
      type: 'success',
      actionText: 'View Bag',
      onAction: () => ui.toggleDrawer('cart-drawer', true)
    });
  });
}

function updateThemeIcon(theme) {
  const iconSpan = document.getElementById('theme-icon');
  if (iconSpan) {
    if (theme === 'dark') {
      iconSpan.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    } else {
      iconSpan.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }
}

function updateWishlistBadges() {
  const count = store.state.wishlist.length;
  document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function setupGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const searchDropdown = document.getElementById('search-autocomplete-dropdown');

  if (!searchInput || !searchDropdown) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) {
      renderSearchSuggestions(val, searchDropdown);
      searchDropdown.style.display = 'block';
    } else {
      searchDropdown.style.display = 'none';
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = searchInput.value.trim();
      if (val) {
        store.addRecentSearch(val);
        store.setFilter('query', val);
        searchDropdown.style.display = 'none';
        if (store.state.currentView.page !== 'catalog') {
          store.setView('catalog');
        } else {
          updateProductsList();
        }
      }
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.style.display = 'none';
    }
  });

  // Focus open suggestions
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
      renderSearchSuggestions(searchInput.value.trim(), searchDropdown);
      searchDropdown.style.display = 'block';
    }
  });
}

function renderSearchSuggestions(query, dropdown) {
  const q = query.toLowerCase();
  const matched = store.state.products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q) ||
    p.tagline.toLowerCase().includes(q)
  ).slice(0, 4);

  const { currency } = store.state;

  dropdown.innerHTML = `
    <div class="search-suggestions-header">Products Matching "${escapeHtml(query)}"</div>
    ${matched.length === 0 ? `
      <div class="no-search-match">No immediate product matches. Press Enter to perform comprehensive search.</div>
    ` : `
      <div class="search-suggest-list">
        ${matched.map(item => `
          <div class="search-suggest-item" data-id="${item.id}">
            <img src="${item.heroImage}" alt="${item.name}" />
            <div class="search-suggest-meta">
              <strong>${highlightMatch(item.name, query)}</strong>
              <span>${item.category} • ${convertPrice(item.price, currency).formatted}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `}
    ${store.state.recentSearches.length > 0 ? `
      <div class="search-recent-searches">
        <span class="recent-title">Recent Searches:</span>
        <div class="recent-tags">
          ${store.state.recentSearches.map(tag => `
            <button class="recent-search-tag" data-tag="${tag}">${tag}</button>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  // Item click -> PDP
  dropdown.querySelectorAll('.search-suggest-item').forEach(el => {
    el.addEventListener('click', () => {
      const prodId = el.dataset.id;
      dropdown.style.display = 'none';
      store.setView('pdp', prodId);
    });
  });

  // Recent tag click
  dropdown.querySelectorAll('.recent-search-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      const searchInput = document.getElementById('global-search-input');
      if (searchInput) searchInput.value = tag;
      store.setFilter('query', tag);
      dropdown.style.display = 'none';
      if (store.state.currentView.page !== 'catalog') {
        store.setView('catalog');
      } else {
        updateProductsList();
      }
    });
  });
}

function highlightMatch(text, query) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return escapeHtml(text);
  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);
  return `${escapeHtml(before)}<span class="search-highlight">${escapeHtml(match)}</span>${escapeHtml(after)}`;
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
