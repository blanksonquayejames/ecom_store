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
import { initAuthModal, openAuthModal } from './modules/auth-modal.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', store.state.theme);

  // Initialize UI & Components
  ui.init();
  initCartDrawer();
  initAuthModal();
  updateCartBadges();

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

  store.subscribe('user_updated', () => {
    if (store.state.currentView.page === 'account') {
      handleRoute('account');
    }
  });

  // Initial Route Render
  handleRoute(store.state.currentView.page, store.state.currentView.productId);
}

function handleRoute(page, productId) {
  const mainViewContainer = document.getElementById('app-main-view');
  if (!mainViewContainer) return;

  // Toggle header elements based on active view
  updateHeaderLayoutForView(page);

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

function updateHeaderLayoutForView(page) {
  const isAccount = page === 'account';
  document.body.setAttribute('data-view', page);

  const announcementBar = document.getElementById('top-announcement-bar') || document.querySelector('.announcement-bar');
  const searchWrap = document.querySelector('.header-search-wrap');
  const bottomRow = document.querySelector('.header-bottom-row');
  const currencyWrap = document.querySelector('.currency-selector-wrap');
  const accountBtn = document.getElementById('header-account-btn');

  if (announcementBar) announcementBar.style.display = isAccount ? 'none' : '';
  if (bottomRow) bottomRow.style.display = isAccount ? 'none' : '';
  if (searchWrap) searchWrap.style.display = isAccount ? 'none' : '';
  if (currencyWrap) currencyWrap.style.display = isAccount ? 'none' : '';
  if (accountBtn) accountBtn.style.display = isAccount ? 'none' : '';
}

function setupHeaderEvents() {
  // Brand Logo Click
  document.getElementById('brand-logo-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });

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
      actionText: 'View Cart',
      onAction: () => ui.toggleDrawer('cart-drawer', true)
    });
  });
}


function setupGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const searchDropdown = document.getElementById('search-autocomplete-dropdown');
  const categoryBtn = document.getElementById('search-category-btn');
  const categoryMenu = document.getElementById('search-category-menu');
  const categoryLabel = document.getElementById('search-category-label');
  const searchSubmitBtn = document.getElementById('header-search-submit-btn');
  const searchCategoryWrap = document.getElementById('search-category-dropdown-wrap');

  if (!searchInput) return;

  // --- Department Dropdown Logic ---
  if (categoryBtn && categoryMenu) {
    // Toggle Category Menu
    categoryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playClick();
      const isExpanded = categoryBtn.getAttribute('aria-expanded') === 'true';
      categoryBtn.setAttribute('aria-expanded', !isExpanded);
      categoryMenu.style.display = isExpanded ? 'none' : 'block';
      if (searchDropdown) searchDropdown.style.display = 'none';
    });

    // Select Category Item
    categoryMenu.querySelectorAll('.search-category-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playClick();
        const selectedCat = item.dataset.category || 'All Products';
        const shortLabel = item.dataset.shortLabel || selectedCat;

        // Update Button UI
        if (categoryLabel) categoryLabel.textContent = shortLabel;
        categoryMenu.querySelectorAll('.search-category-item').forEach(i => i.classList.remove('is-selected'));
        item.classList.add('is-selected');

        // Close Menu
        categoryBtn.setAttribute('aria-expanded', 'false');
        categoryMenu.style.display = 'none';

        // Update Store Filter
        store.setFilter('category', selectedCat);

        // If there's an existing query in the search input, refresh autocomplete or trigger view
        if (store.state.currentView.page === 'catalog') {
          updateProductsList();
        } else if (searchInput.value.trim()) {
          store.setView('catalog');
        }

        // Re-render suggestions if input is active
        if (searchInput.value.trim() && searchDropdown) {
          renderSearchSuggestions(searchInput.value.trim(), searchDropdown);
        }
      });
    });

    // Sync search department label when category changes elsewhere (e.g. category pills)
    store.subscribe('filters_updated', (filters) => {
      const activeCat = filters.category || 'All Products';
      const matchingItem = categoryMenu.querySelector(`[data-category="${activeCat}"]`);
      if (matchingItem) {
        const shortLabel = matchingItem.dataset.shortLabel || activeCat;
        if (categoryLabel) categoryLabel.textContent = shortLabel;
        categoryMenu.querySelectorAll('.search-category-item').forEach(i => i.classList.remove('is-selected'));
        matchingItem.classList.add('is-selected');
      } else if (categoryLabel) {
        categoryLabel.textContent = activeCat === 'All Products' ? 'All' : activeCat;
      }
    });
  }

  // --- Search Execution Helper ---
  function executeSearch() {
    const val = searchInput.value.trim();
    if (val) {
      store.addRecentSearch(val);
    }
    store.setFilter('query', val);
    if (searchDropdown) searchDropdown.style.display = 'none';
    if (categoryMenu) {
      categoryMenu.style.display = 'none';
      categoryBtn?.setAttribute('aria-expanded', 'false');
    }

    if (store.state.currentView.page !== 'catalog') {
      store.setView('catalog');
    } else {
      updateProductsList();
      const catalogSection = document.getElementById('catalog-section');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Search Submit Button Click
  if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', () => {
      sounds.playClick();
      executeSearch();
    });
  }

  // Search Input Enter Key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  });

  // Autocomplete Suggestions on Input
  if (searchDropdown) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val.length > 0) {
        renderSearchSuggestions(val, searchDropdown);
        searchDropdown.style.display = 'block';
        if (categoryMenu) {
          categoryMenu.style.display = 'none';
          categoryBtn?.setAttribute('aria-expanded', 'false');
        }
      } else {
        searchDropdown.style.display = 'none';
      }
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim()) {
        renderSearchSuggestions(searchInput.value.trim(), searchDropdown);
        searchDropdown.style.display = 'block';
      }
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (searchDropdown && !searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.style.display = 'none';
    }
    if (categoryMenu && searchCategoryWrap && !searchCategoryWrap.contains(e.target)) {
      categoryMenu.style.display = 'none';
      categoryBtn?.setAttribute('aria-expanded', 'false');
    }
  });
}

function renderSearchSuggestions(query, dropdown) {
  const q = query.toLowerCase();
  const activeCategory = store.state.filters.category;
  
  // Filter products matching query & current department scope if any
  let matched = store.state.products.filter(p => {
    const matchesCategory = activeCategory === 'All Products' || p.category === activeCategory;
    const matchesText = p.name.toLowerCase().includes(q) || 
                        p.category.toLowerCase().includes(q) ||
                        p.tagline.toLowerCase().includes(q);
    return matchesCategory && matchesText;
  });

  // If no matches in active category, search across all categories as fallback
  if (matched.length === 0 && activeCategory !== 'All Products') {
    matched = store.state.products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q)
    );
  }

  matched = matched.slice(0, 4);
  const { currency } = store.state;

  dropdown.innerHTML = `
    <div class="search-suggestions-header">
      <span>Products Matching "${escapeHtml(query)}"</span>
      ${activeCategory !== 'All Products' ? `<span class="search-category-scope-tag">in ${activeCategory}</span>` : ''}
    </div>
    ${matched.length === 0 ? `
      <div class="no-search-match">No direct product matches. Press Enter or click the search button to explore all results.</div>
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
