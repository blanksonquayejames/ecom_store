/**
 * AURA LUXE - Catalog & Product Discovery View
 * Hero showcase, faceted filters, search, sorting, and rich product grid.
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { CATEGORIES } from '../data/products.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';

export function renderCatalogView(container) {
  const { filters, currency } = store.state;

  container.innerHTML = `
    <!-- Hero Showcase Section -->
    <section class="hero-showcase">
      <div class="hero-background-glow"></div>
      <div class="hero-content">
        <div class="hero-badge animate-fade-in">
          <span class="hero-sparkle">✦</span>
          <span>AURA QUANTUM SERIES 2026</span>
        </div>
        <h1 class="hero-title animate-slide-up">Next-Gen Luxury.<br><span class="gradient-text">Engineered Perfection.</span></h1>
        <p class="hero-subtitle animate-slide-up">
          Spatial optics, planar acoustic monitors, and aerospace titanium wearables crafted for visionary creators and modern connoisseurs.
        </p>
        <div class="hero-actions animate-slide-up">
          <button class="btn btn-primary btn-lg" id="hero-explore-btn">
            Explore Collection
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
      <div class="hero-featured-card-wrapper animate-fade-in">
        <div class="hero-featured-card" id="hero-featured-product">
          <div class="hero-card-tag">FLARED SPOTLIGHT</div>
          <div class="hero-card-img-wrap">
            <img src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=85" alt="Aura Horizon Spatial Vision Glass" class="hero-card-img" />
          </div>
          <div class="hero-card-info">
            <div class="hero-card-stars">★★★★★ <span>(4.95)</span></div>
            <div class="hero-card-name">Aura Horizon Spatial Vision Glass</div>
            <div class="hero-card-price">${convertPrice(1899, currency).formatted} <span class="old-price">${convertPrice(2299, currency).formatted}</span></div>
            <button class="btn btn-sm btn-white hero-quick-add" data-id="prod-001">Quick Add to Cart</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Pills Bar -->
    <div class="category-pills-bar">
      <div class="container pills-scroll-container">
        ${CATEGORIES.map(cat => `
          <button class="category-pill ${filters.category === cat ? 'is-active' : ''}" data-category="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Main Catalog Section -->
    <section class="catalog-section" id="catalog-section">
      <div class="container">
        
        <!-- Controls Bar: Filter Toggle, Result Count, Sort Dropdown, View Switcher -->
        <div class="catalog-controls-bar">
          <div class="controls-left">
            <button class="btn btn-secondary filter-drawer-toggle" id="filter-drawer-toggle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
              <span>Filters</span>
              <span class="filter-count-badge" id="filter-active-count"></span>
            </button>
            <div class="catalog-results-info" id="results-count-text">
              Showing filtered products
            </div>
          </div>

          <div class="controls-right">
            <!-- Active Search indicator if any -->
            <div class="active-query-chip" id="active-query-chip" style="display: none;">
              <span id="query-chip-text"></span>
              <button id="clear-query-chip-btn">&times;</button>
            </div>

            <!-- Sort By -->
            <div class="sort-selector">
              <label for="catalog-sort" class="sort-label">Sort by:</label>
              <select id="catalog-sort" class="custom-select">
                <option value="featured" ${filters.sortBy === 'featured' ? 'selected' : ''}>Featured & Trending</option>
                <option value="price-asc" ${filters.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-desc" ${filters.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="rating" ${filters.sortBy === 'rating' ? 'selected' : ''}>Customer Rating</option>
                <option value="newest" ${filters.sortBy === 'newest' ? 'selected' : ''}>New Arrivals</option>
              </select>
            </div>

            <!-- View Toggle -->
            <div class="view-mode-toggle">
              <button class="view-btn ${filters.viewMode === 'grid' ? 'is-active' : ''}" data-mode="grid" title="Grid View">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </button>
              <button class="view-btn ${filters.viewMode === 'list' ? 'is-active' : ''}" data-mode="list" title="List View">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Catalog Layout with Sidebar & Products Grid -->
        <div class="catalog-layout">
          
          <!-- Filter Sidebar -->
          <aside class="catalog-sidebar" id="catalog-sidebar">
            <div class="sidebar-header">
              <h3 class="sidebar-title">Filters</h3>
              <button class="sidebar-reset-btn" id="reset-all-filters">Reset All</button>
            </div>

            <!-- Price Range Filter -->
            <div class="filter-group">
              <div class="filter-group-header">
                <span class="filter-label">Max Price</span>
                <span class="filter-val" id="price-range-val">${convertPrice(filters.maxPrice, currency).formatted}</span>
              </div>
              <input type="range" class="custom-range" id="price-range-slider" min="150" max="2500" step="50" value="${filters.maxPrice}" />
              <div class="range-bounds">
                <span>${convertPrice(150, currency).formatted}</span>
                <span>${convertPrice(2500, currency).formatted}</span>
              </div>
            </div>

            <!-- Availability & Offers -->
            <div class="filter-group">
              <span class="filter-label">Status & Offers</span>
              <label class="custom-checkbox">
                <input type="checkbox" id="filter-in-stock" ${filters.inStockOnly ? 'checked' : ''} />
                <span class="checkmark"></span>
                <span>In Stock Only</span>
              </label>
              <label class="custom-checkbox">
                <input type="checkbox" id="filter-on-sale" ${filters.onSaleOnly ? 'checked' : ''} />
                <span class="checkmark"></span>
                <span>On Sale / VIP Offers</span>
              </label>
            </div>

            <!-- Minimum Rating Filter -->
            <div class="filter-group">
              <span class="filter-label">Customer Rating</span>
              <div class="rating-filter-options">
                ${[0, 4.5, 4.8, 4.9].map(r => `
                  <button class="rating-filter-pill ${filters.minRating === r ? 'is-active' : ''}" data-rating="${r}">
                    ${r === 0 ? 'All Ratings' : `★ ${r}+`}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Free Global Delivery VIP Callout -->
            <div class="sidebar-vip-card">
              <div class="vip-badge">AURA PRIVILEGE</div>
              <div class="vip-title">Complimentary Global Express</div>
              <p class="vip-desc">Free insured courier on all orders exceeding $500 with tamper-evident seal.</p>
            </div>
          </aside>

          <!-- Products Display Container -->
          <div class="catalog-products-wrap">
            <div class="products-grid ${filters.viewMode === 'list' ? 'products-list-view' : ''}" id="products-grid">
              <!-- Dynamically rendered products -->
            </div>

            <!-- Empty State if no products match -->
            <div class="empty-results-state" id="empty-results" style="display: none;">
              <div class="empty-icon">🔍</div>
              <h3>No matching luxury items found</h3>
              <p>Try adjusting your category, price range, or clearing active filters.</p>
              <button class="btn btn-secondary" id="empty-reset-btn">Clear All Filters</button>
            </div>
          </div>

        </div>

      </div>
    </section>
  `;

  attachCatalogEvents(container);
  updateProductsList();
}

export function updateProductsList() {
  const grid = document.getElementById('products-grid');
  const empty = document.getElementById('empty-results');
  const countText = document.getElementById('results-count-text');
  const activeCountBadge = document.getElementById('filter-active-count');
  const queryChip = document.getElementById('active-query-chip');
  const queryChipText = document.getElementById('query-chip-text');

  if (!grid) return;

  const { products, filters, currency, wishlist, compareList } = store.state;

  // Filter products
  let filtered = products.filter(p => {
    // Category
    if (filters.category !== 'All Products' && p.category !== filters.category) return false;
    // Price
    if (p.price > filters.maxPrice) return false;
    // In Stock
    if (filters.inStockOnly && p.stock <= 0) return false;
    // On Sale
    if (filters.onSaleOnly && (!p.originalPrice || p.originalPrice <= p.price)) return false;
    // Rating
    if (filters.minRating > 0 && p.rating < filters.minRating) return false;
    // Query search
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchTag = p.tagline.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchTag && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  // Sort
  if (filters.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === 'newest') {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  // Active filters count
  let activeFiltersCount = 0;
  if (filters.category !== 'All Products') activeFiltersCount++;
  if (filters.maxPrice < 2500) activeFiltersCount++;
  if (filters.inStockOnly) activeFiltersCount++;
  if (filters.onSaleOnly) activeFiltersCount++;
  if (filters.minRating > 0) activeFiltersCount++;

  if (activeCountBadge) {
    if (activeFiltersCount > 0) {
      activeCountBadge.textContent = activeFiltersCount;
      activeCountBadge.style.display = 'inline-flex';
    } else {
      activeCountBadge.style.display = 'none';
    }
  }

  // Active query chip
  if (queryChip && queryChipText) {
    if (filters.query) {
      queryChipText.textContent = `"${filters.query}"`;
      queryChip.style.display = 'inline-flex';
    } else {
      queryChip.style.display = 'none';
    }
  }

  if (countText) {
    countText.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${products.length}</strong> mastercraft pieces`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }

  if (empty) empty.style.display = 'none';

  grid.innerHTML = filtered.map(p => {
    const isWishlisted = wishlist.includes(p.id);
    const isCompared = compareList.includes(p.id);
    const currentPriceObj = convertPrice(p.price, currency);
    const originalPriceObj = p.originalPrice ? convertPrice(p.originalPrice, currency) : null;
    const discountPercent = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

    return `
      <div class="product-card animate-card-fade" data-id="${p.id}">
        
        <!-- Card Badges -->
        <div class="card-badges">
          ${p.isNew ? '<span class="badge badge-new">NEW EDITION</span>' : ''}
          ${discountPercent > 0 ? `<span class="badge badge-sale">-${discountPercent}%</span>` : ''}
          ${p.stock <= 5 ? '<span class="badge badge-low-stock">FEW LEFT</span>' : ''}
        </div>

        <!-- Action Floating Buttons -->
        <div class="card-floating-actions">
          <button class="action-circle-btn btn-wishlist-toggle ${isWishlisted ? 'is-active' : ''}" data-id="${p.id}" title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? '#ef4444' : 'none'}" stroke="${isWishlisted ? '#ef4444' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button class="action-circle-btn btn-compare-toggle ${isCompared ? 'is-active' : ''}" data-id="${p.id}" title="${isCompared ? 'In Comparison' : 'Compare Specs'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </button>
        </div>

        <!-- Product Image & Quick View Trigger -->
        <div class="card-img-container" data-view-pdp="${p.id}">
          <img src="${p.heroImage}" alt="${p.name}" class="product-img" loading="lazy" id="prod-img-${p.id}" />
          <div class="card-overlay">
            <button class="btn btn-glass-sm btn-quick-view" data-quickview="${p.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Quick View
            </button>
          </div>
        </div>

        <!-- Product Details -->
        <div class="card-content">
          <div class="card-category-rating">
            <span class="card-category">${p.category}</span>
            <div class="card-stars">★ ${p.rating.toFixed(2)} <span class="rating-count">(${p.reviewsCount})</span></div>
          </div>

          <h3 class="card-title" data-view-pdp="${p.id}">${p.name}</h3>
          <p class="card-tagline">${p.tagline}</p>

          <!-- Color Swatches (if any) -->
          ${p.colors && p.colors.length > 1 ? `
            <div class="card-color-swatches">
              ${p.colors.map((c, idx) => `
                <button 
                  class="color-swatch-dot ${idx === 0 ? 'is-selected' : ''}" 
                  style="background-color: ${c.hex};" 
                  data-prod-id="${p.id}" 
                  data-img="${c.img}" 
                  data-color-name="${c.name}"
                  title="${c.name}">
                </button>
              `).join('')}
            </div>
          ` : ''}

          <!-- Price & Add to Cart -->
          <div class="card-footer">
            <div class="card-price-wrap">
              <span class="card-price">${currentPriceObj.formatted}</span>
              ${originalPriceObj ? `<span class="card-original-price">${originalPriceObj.formatted}</span>` : ''}
            </div>
            <button class="btn btn-primary-sm btn-add-cart" data-id="${p.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Add
            </button>
          </div>

        </div>

      </div>
    `;
  }).join('');

  attachCardEvents(grid);
}

function attachCatalogEvents(container) {
  // Hero Explore Button
  const heroExploreBtn = container.querySelector('#hero-explore-btn');
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', () => {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Hero Featured Add
  const heroQuickAdd = container.querySelector('.hero-quick-add');
  if (heroQuickAdd) {
    heroQuickAdd.addEventListener('click', () => {
      const prod = store.state.products.find(p => p.id === 'prod-001');
      if (prod) {
        store.addToCart(prod);
        ui.showToast({
          title: 'Added to Cart',
          message: `${prod.name} has been added.`,
          type: 'success',
          actionText: 'View Cart',
          onAction: () => ui.toggleDrawer('cart-drawer', true)
        });
      }
    });
  }

  // Category Pills
  container.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      sounds.playClick();
      const cat = pill.dataset.category;
      container.querySelectorAll('.category-pill').forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      store.setFilter('category', cat);
      updateProductsList();
    });
  });

  // Sort Dropdown
  const sortSelect = container.querySelector('#catalog-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sounds.playClick();
      store.setFilter('sortBy', e.target.value);
      updateProductsList();
    });
  }

  // View Mode (Grid vs List)
  container.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const mode = btn.dataset.mode;
      container.querySelectorAll('.view-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      store.setFilter('viewMode', mode);
      const grid = document.getElementById('products-grid');
      if (grid) {
        if (mode === 'list') grid.classList.add('products-list-view');
        else grid.classList.remove('products-list-view');
      }
    });
  });

  // Price Range Slider
  const priceSlider = container.querySelector('#price-range-slider');
  const priceValText = container.querySelector('#price-range-val');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (priceValText) {
        priceValText.textContent = convertPrice(val, store.state.currency).formatted;
      }
      store.setFilter('maxPrice', val);
      updateProductsList();
    });
  }

  // Checkboxes
  const inStockCheck = container.querySelector('#filter-in-stock');
  if (inStockCheck) {
    inStockCheck.addEventListener('change', (e) => {
      sounds.playClick();
      store.setFilter('inStockOnly', e.target.checked);
      updateProductsList();
    });
  }

  const onSaleCheck = container.querySelector('#filter-on-sale');
  if (onSaleCheck) {
    onSaleCheck.addEventListener('change', (e) => {
      sounds.playClick();
      store.setFilter('onSaleOnly', e.target.checked);
      updateProductsList();
    });
  }

  // Rating Pills
  container.querySelectorAll('.rating-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      sounds.playClick();
      const r = parseFloat(pill.dataset.rating);
      container.querySelectorAll('.rating-filter-pill').forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      store.setFilter('minRating', r);
      updateProductsList();
    });
  });

  // Reset Filters
  const resetBtn = container.querySelector('#reset-all-filters');
  const emptyResetBtn = container.querySelector('#empty-reset-btn');
  const handleReset = () => {
    sounds.playClick();
    store.resetFilters();
    renderCatalogView(container);
  };
  if (resetBtn) resetBtn.addEventListener('click', handleReset);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', handleReset);

  // Clear query chip
  const clearQueryBtn = container.querySelector('#clear-query-chip-btn');
  if (clearQueryBtn) {
    clearQueryBtn.addEventListener('click', () => {
      sounds.playClick();
      store.setFilter('query', '');
      const searchInput = document.getElementById('global-search-input');
      if (searchInput) searchInput.value = '';
      updateProductsList();
    });
  }

  // Mobile Filter Drawer Toggle
  const filterToggleBtn = container.querySelector('#filter-drawer-toggle');
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
      const sidebar = document.getElementById('catalog-sidebar');
      if (sidebar) sidebar.classList.toggle('is-mobile-open');
    });
  }
}

function attachCardEvents(grid) {
  // Swatches
  grid.querySelectorAll('.color-swatch-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playClick();
      const prodId = dot.dataset.prodId;
      const imgUrl = dot.dataset.img;
      const imgEl = document.getElementById(`prod-img-${prodId}`);
      if (imgEl && imgUrl) {
        imgEl.src = imgUrl;
      }
      dot.parentElement.querySelectorAll('.color-swatch-dot').forEach(d => d.classList.remove('is-selected'));
      dot.classList.add('is-selected');
    });
  });

  // Quick View
  grid.querySelectorAll('[data-quickview]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prodId = btn.dataset.quickview;
      store.setQuickView(prodId);
    });
  });

  // PDP Navigation
  grid.querySelectorAll('[data-view-pdp]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.btn-quick-view') || e.target.closest('.color-swatch-dot')) return;
      const prodId = el.dataset.viewPdp;
      store.setView('pdp', prodId);
    });
  });

  // Wishlist Toggle
  grid.querySelectorAll('.btn-wishlist-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prodId = btn.dataset.id;
      const added = store.toggleWishlist(prodId);
      const prod = store.state.products.find(p => p.id === prodId);
      btn.classList.toggle('is-active', added);
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', added ? '#ef4444' : 'none');
        svg.setAttribute('stroke', added ? '#ef4444' : 'currentColor');
      }
      ui.showToast({
        title: added ? 'Saved to Wishlist' : 'Removed from Wishlist',
        message: added ? `${prod.name} is saved to your private collection.` : `${prod.name} was removed.`,
        type: added ? 'success' : 'info'
      });
    });
  });

  // Compare Toggle
  grid.querySelectorAll('.btn-compare-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prodId = btn.dataset.id;
      const res = store.toggleCompare(prodId);
      if (!res.success) {
        ui.showToast({
          title: 'Comparison Limit Reached',
          message: res.message,
          type: 'warning'
        });
        return;
      }
      const prod = store.state.products.find(p => p.id === prodId);
      const isNowIn = store.isInCompare(prodId);
      btn.classList.toggle('is-active', isNowIn);
      ui.showToast({
        title: isNowIn ? 'Added to Comparator' : 'Removed from Comparator',
        message: isNowIn ? `${prod.name} added to comparison tray.` : `${prod.name} removed from comparison.`,
        type: 'info'
      });
    });
  });

  // Add to Cart
  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prodId = btn.dataset.id;
      const prod = store.state.products.find(p => p.id === prodId);
      if (prod) {
        // Find if a color was selected in card
        const card = btn.closest('.product-card');
        const selectedDot = card.querySelector('.color-swatch-dot.is-selected');
        const selectedColor = selectedDot ? selectedDot.dataset.colorName : null;
        
        store.addToCart(prod, selectedColor, null, 1);

        // Visual feedback on button
        const origHtml = btn.innerHTML;
        btn.innerHTML = `✓ Added`;
        btn.classList.add('btn-added-state');
        setTimeout(() => {
          btn.innerHTML = origHtml;
          btn.classList.remove('btn-added-state');
        }, 1200);

        ui.showToast({
          title: 'Added to Cart',
          message: `${prod.name} (${selectedColor || 'Default'}) added.`,
          type: 'success',
          actionText: 'View Cart',
          onAction: () => ui.toggleDrawer('cart-drawer', true)
        });
      }
    });
  });
}
