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
  const initialSpotlight = store.state.products.find(p => p.id === 'prod-001') || store.state.products[0];

  container.innerHTML = `
    <!-- Modern High-Tech Hero Showcase Section -->
    <section class="hero-showcase" id="hero-showcase">
      <div class="hero-mesh-glow hero-mesh-1"></div>
      <div class="hero-mesh-glow hero-mesh-2"></div>
      <div class="hero-tech-grid-overlay"></div>
      
      <div class="container hero-container-grid">
        
        <!-- Left: Typography, Value Proposition & Actions -->
        <div class="hero-content">
          <div class="hero-badge animate-fade-in">
            <span class="hero-badge-pulse"></span>
            <span class="hero-badge-icon">⚡</span>
            <span>7TH JUNE COMPUTERS • NEXT-GEN 2026</span>
          </div>

          <h1 class="hero-title animate-slide-up">
            Extreme Precision.<br>
            <span class="hero-gradient-text">Engineered for PC Mastery.</span>
          </h1>

          <p class="hero-subtitle animate-slide-up">
            Magnetic Hall-Effect mechanical keyboards, 8K ultra-light gaming mice, audiophile planar headsets, and heavy-duty workstation mounts built for pure competitive speed.
          </p>

          <div class="hero-actions animate-slide-up">
            <button class="btn btn-primary btn-lg hero-cta-btn" id="hero-explore-btn">
              <span>Explore Accessories</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <button class="btn btn-secondary btn-lg hero-ai-btn" id="hero-ai-concierge-btn">
              <span class="hero-sparkle-gold">✦</span>
              <span>AI Setup Configurator</span>
            </button>
          </div>

          <!-- Hero Metrics & Trust Indicators -->
          <div class="hero-metrics-strip animate-slide-up">
            <div class="metric-item">
              <div class="metric-val">4.98 ★</div>
              <div class="metric-lbl">Pro Rating</div>
            </div>
            <div class="metric-sep"></div>
            <div class="metric-item">
              <div class="metric-val">24h</div>
              <div class="metric-lbl">Fast Dispatch</div>
            </div>
            <div class="metric-sep"></div>
            <div class="metric-item">
              <div class="metric-val">3-Year</div>
              <div class="metric-lbl">Hardware Care</div>
            </div>
            <div class="metric-sep"></div>
            <div class="metric-item">
              <div class="metric-val">100%</div>
              <div class="metric-lbl">Tested & QA</div>
            </div>
          </div>
        </div>

        <!-- Right: Interactive Flagship Spotlight Showcase Card -->
        <div class="hero-featured-card-wrapper animate-fade-in">
          <div class="hero-featured-card" id="hero-spotlight-card">
            
            <!-- Top Spotlight Header -->
            <div class="spotlight-top-bar">
              <span class="spotlight-tag">✦ FLAGSHIP SPOTLIGHT</span>
              <span class="spotlight-stock-badge"><span class="stock-pulse-dot"></span> In Stock & Ready</span>
            </div>

            <!-- Spotlight Visual Frame -->
            <div class="hero-card-img-wrap" id="hero-spotlight-img-wrap">
              <img src="${initialSpotlight.heroImage}" alt="${initialSpotlight.name}" class="hero-card-img" id="hero-spotlight-img" />
              
              <!-- Floating Specification Badges -->
              <div class="hero-floating-badge badge-top-right" id="hero-float-spec1">
                <span class="float-icon">⚡</span>
                <span id="hero-float-spec1-text">Magnetic Hall-Effect • 8000Hz</span>
              </div>
              <div class="hero-floating-badge badge-bottom-left" id="hero-float-spec2">
                <span class="float-icon">★</span>
                <span id="hero-float-spec2-text">4.96 (184 Verified Reviews)</span>
              </div>
            </div>

            <!-- Spotlight Information & Interactive Switcher -->
            <div class="hero-card-info">
              <div class="spotlight-meta-row">
                <span class="hero-card-category" id="hero-spotlight-category">${initialSpotlight.category}</span>
                
                <!-- Quick Switcher Tabs (3 Flagship items) -->
                <div class="hero-spotlight-switcher" aria-label="Switch Flagship Product">
                  <button class="spotlight-switch-btn is-active" data-id="prod-001" title="ApexPro V3 Keyboard">01</button>
                  <button class="spotlight-switch-btn" data-id="prod-002" title="ViperStrike 8K Mouse">02</button>
                  <button class="spotlight-switch-btn" data-id="prod-003" title="Acoustix Pro Headset">03</button>
                </div>
              </div>

              <h3 class="hero-card-name" id="hero-spotlight-title">${initialSpotlight.name}</h3>
              <p class="hero-card-tagline" id="hero-spotlight-tagline">${initialSpotlight.tagline}</p>
              
              <div class="hero-card-price-row">
                <div class="hero-card-price" id="hero-spotlight-price">
                  <span class="current-price-val">${convertPrice(initialSpotlight.price, currency).formatted}</span>
                  ${initialSpotlight.originalPrice ? `<span class="old-price">${convertPrice(initialSpotlight.originalPrice, currency).formatted}</span>` : ''}
                </div>
                <div class="spotlight-discount-badge" id="hero-spotlight-discount">Save 15%</div>
              </div>

              <!-- CTA Actions -->
              <div class="hero-spotlight-actions">
                <button class="btn btn-primary flex-1 hero-spotlight-add" id="hero-spotlight-add-btn" data-id="${initialSpotlight.id}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  <span>Quick Add to Cart</span>
                </button>
                <button class="btn btn-secondary hero-spotlight-view" id="hero-spotlight-view-btn" data-id="${initialSpotlight.id}">
                  View Specs
                </button>
              </div>
            </div>

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
              <div class="sidebar-title-wrap">
                <h3 class="sidebar-title">Filters</h3>
              </div>
              <div class="sidebar-header-actions">
                <button class="sidebar-reset-btn" id="reset-all-filters">Reset All</button>
                <button class="sidebar-close-mobile-btn" id="sidebar-close-mobile-btn" aria-label="Close filter drawer">&times;</button>
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="filter-group">
              <div class="filter-group-header">
                <span class="filter-label">Max Price</span>
                <span class="filter-val" id="price-range-val">${convertPrice(filters.maxPrice, currency).formatted}</span>
              </div>
              <input type="range" class="custom-range" id="price-range-slider" min="30" max="5000" step="50" value="${filters.maxPrice}" />
              <div class="range-bounds">
                <span>${convertPrice(30, currency).formatted}</span>
                <span>${convertPrice(5000, currency).formatted}</span>
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

  const { products, filters, currency } = store.state;

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
  if (filters.maxPrice < 5000) activeFiltersCount++;
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
  // Hero Explore Collection Scroll
  const heroExploreBtn = container.querySelector('#hero-explore-btn');
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', () => {
      sounds.playClick();
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Hero AI Concierge Trigger
  const heroAiBtn = container.querySelector('#hero-ai-concierge-btn');
  if (heroAiBtn) {
    heroAiBtn.addEventListener('click', () => {
      sounds.playClick();
      const floatingAiBtn = document.querySelector('.floating-ai-btn');
      if (floatingAiBtn) {
        floatingAiBtn.click();
      } else {
        ui.showToast({
          title: 'AI System Configurator',
          message: 'Personalized workstation & computing recommendations ready.',
          type: 'info'
        });
      }
    });
  }

  // Hero Spotlight Interactive Switcher
  const HERO_SPOTLIGHT_ITEMS = {
    'prod-001': {
      spec1: 'Magnetic Hall-Effect • 8000Hz',
      spec2: '4.96 ★ (184 Reviews)',
      discount: 'Save 15%'
    },
    'prod-002': {
      spec1: '49g Magnesium Shell • PAW3950',
      spec2: '4.98 ★ (235 Reviews)',
      discount: 'Save 17%'
    },
    'prod-003': {
      spec1: 'Planar Drivers • 50kHz Hi-Res',
      spec2: '4.92 ★ (142 Reviews)',
      discount: 'Save 15%'
    }
  };

  let activeSpotlightId = 'prod-001';

  container.querySelectorAll('.spotlight-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const targetId = btn.dataset.id;
      if (targetId === activeSpotlightId) return;

      const targetProd = store.state.products.find(p => p.id === targetId);
      if (!targetProd) return;

      activeSpotlightId = targetId;

      // Update Active Switcher Button
      container.querySelectorAll('.spotlight-switch-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Update Card Visuals with smooth animation
      const imgEl = container.querySelector('#hero-spotlight-img');
      const titleEl = container.querySelector('#hero-spotlight-title');
      const catEl = container.querySelector('#hero-spotlight-category');
      const taglineEl = container.querySelector('#hero-spotlight-tagline');
      const priceEl = container.querySelector('#hero-spotlight-price');
      const discountEl = container.querySelector('#hero-spotlight-discount');
      const spec1El = container.querySelector('#hero-float-spec1-text');
      const spec2El = container.querySelector('#hero-float-spec2-text');
      const addBtn = container.querySelector('#hero-spotlight-add-btn');
      const viewBtn = container.querySelector('#hero-spotlight-view-btn');

      if (imgEl) {
        imgEl.style.opacity = '0';
        setTimeout(() => {
          imgEl.src = targetProd.heroImage;
          imgEl.alt = targetProd.name;
          imgEl.style.opacity = '1';
        }, 150);
      }

      if (titleEl) titleEl.textContent = targetProd.name;
      if (catEl) catEl.textContent = targetProd.category;
      if (taglineEl) taglineEl.textContent = targetProd.tagline;
      
      const { currency } = store.state;
      if (priceEl) {
        priceEl.innerHTML = `
          <span class="current-price-val">${convertPrice(targetProd.price, currency).formatted}</span>
          ${targetProd.originalPrice ? `<span class="old-price">${convertPrice(targetProd.originalPrice, currency).formatted}</span>` : ''}
        `;
      }

      const meta = HERO_SPOTLIGHT_ITEMS[targetId];
      if (meta) {
        if (spec1El) spec1El.textContent = meta.spec1;
        if (spec2El) spec2El.textContent = meta.spec2;
        if (discountEl) discountEl.textContent = meta.discount;
      }

      if (addBtn) addBtn.dataset.id = targetId;
      if (viewBtn) viewBtn.dataset.id = targetId;
    });
  });

  // Hero Spotlight Quick Add
  const heroSpotlightAdd = container.querySelector('#hero-spotlight-add-btn');
  if (heroSpotlightAdd) {
    heroSpotlightAdd.addEventListener('click', () => {
      const targetId = heroSpotlightAdd.dataset.id || activeSpotlightId;
      const prod = store.state.products.find(p => p.id === targetId);
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

  // Hero Spotlight View Specs
  const heroSpotlightView = container.querySelector('#hero-spotlight-view-btn');
  if (heroSpotlightView) {
    heroSpotlightView.addEventListener('click', () => {
      sounds.playClick();
      const targetId = heroSpotlightView.dataset.id || activeSpotlightId;
      store.setView('pdp', targetId);
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

  // Mobile Filter Drawer Toggle & Backdrop
  const filterToggleBtn = container.querySelector('#filter-drawer-toggle');
  const sidebarCloseBtn = container.querySelector('#sidebar-close-mobile-btn');
  const sidebar = document.getElementById('catalog-sidebar');
  const backdrop = document.getElementById('global-backdrop');

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('is-mobile-open');
    if (backdrop) backdrop.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  }

  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
      sounds.playClick();
      if (sidebar) sidebar.classList.add('is-mobile-open');
      if (backdrop) backdrop.classList.add('is-active');
      document.body.classList.add('no-scroll');
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', () => {
      sounds.playClick();
      closeMobileSidebar();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileSidebar);
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
