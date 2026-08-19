/**
 * AURA LUXE - Product Detail Page (PDP) & Quick View Controller
 * Full product exploration, multi-angle gallery, zoom lens, variants, reviews, and bundles.
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';

export function renderProductDetailPage(container, productId) {
  const product = store.state.products.find(p => p.id === productId) || store.state.products[0];
  const { currency } = store.state;

  let selectedColor = product.colors && product.colors[0] ? product.colors[0].name : 'Default';
  let selectedOption = product.storageOptions && product.storageOptions[0] ? product.storageOptions[0] : 'Standard';
  let currentImage = (product.colors && product.colors[0]?.img) || product.heroImage;
  let quantity = 1;

  const currentPriceObj = convertPrice(product.price, currency);
  const originalPriceObj = product.originalPrice ? convertPrice(product.originalPrice, currency) : null;
  const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;


  container.innerHTML = `
    <div class="pdp-wrapper animate-fade-in">
      <div class="container">
        
        <!-- Breadcrumbs Navigation -->
        <nav class="pdp-breadcrumbs">
          <button class="breadcrumb-link" id="breadcrumb-home">Collection</button>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-link">${product.category}</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">${product.name}</span>
        </nav>

        <!-- Main Product Grid: Gallery Left + Configuration Right -->
        <div class="pdp-main-grid">
          
          <!-- Left: Gallery & Zoom -->
          <div class="pdp-gallery-col">
            <div class="pdp-main-image-wrap" id="pdp-zoom-container">
              <img src="${currentImage}" alt="${product.name}" id="pdp-active-img" class="pdp-main-img" />
              <div class="pdp-zoom-lens" id="pdp-zoom-lens"></div>
              
              <div class="pdp-image-badges">
                ${product.isNew ? '<span class="badge badge-new">NEW EDITION</span>' : ''}
                ${discountPercent > 0 ? `<span class="badge badge-sale">-${discountPercent}% OFF</span>` : ''}
              </div>
            </div>

            <!-- Thumbnail Strip -->
            <div class="pdp-thumbnails-strip" id="pdp-thumbs-strip">
              ${(product.gallery || [product.heroImage]).map((img, idx) => `
                <button class="pdp-thumb-btn ${idx === 0 ? 'is-active' : ''}" data-img="${img}">
                  <img src="${img}" alt="Thumbnail ${idx + 1}" />
                </button>
              `).join('')}
            </div>

            <!-- Authenticity & Security Guarantee Callouts -->
            <div class="pdp-guarantee-box">
              <div class="guarantee-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <div>
                  <strong>3-Year Aura Care Warranty</strong>
                  <span>Global hardware replacement & dedicated concierge support.</span>
                </div>
              </div>
              <div class="guarantee-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <strong>30-Day Bespoke Trial</strong>
                  <span>Full return guarantee with complimentary return courier pickup.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Details, Variants & Purchase -->
          <div class="pdp-details-col">
            <div class="pdp-meta-header">
              <span class="pdp-category-tag">${product.category}</span>
              <div class="pdp-rating-row">
                <span class="stars">★★★★★</span>
                <span class="score">${product.rating.toFixed(2)}</span>
                <a href="#reviews-tab" class="reviews-link" id="scroll-to-reviews">(${product.reviewsCount} verified reviews)</a>
              </div>
            </div>

            <h1 class="pdp-title">${product.name}</h1>
            <p class="pdp-tagline">${product.tagline}</p>

            <!-- Pricing Box -->
            <div class="pdp-price-box">
              <div class="pdp-current-price" id="pdp-price-display">${currentPriceObj.formatted}</div>
              ${originalPriceObj ? `<div class="pdp-original-price">${originalPriceObj.formatted}</div>` : ''}
              ${discountPercent > 0 ? `<div class="pdp-savings-pill">Save ${discountPercent}%</div>` : ''}
            </div>

            <p class="pdp-description">${product.description}</p>

            <div class="pdp-divider"></div>

            <!-- Color Variants Selection -->
            ${product.colors && product.colors.length > 0 ? `
              <div class="pdp-variant-section">
                <div class="variant-label-row">
                  <span class="variant-label">Finishing / Color:</span>
                  <span class="variant-selected-name" id="selected-color-name">${selectedColor}</span>
                </div>
                <div class="pdp-color-picker">
                  ${product.colors.map((c, idx) => `
                    <button 
                      class="pdp-color-dot ${idx === 0 ? 'is-active' : ''}" 
                      style="background-color: ${c.hex};" 
                      data-color="${c.name}" 
                      data-img="${c.img}"
                      title="${c.name}">
                      <span class="color-inner-ring"></span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Specification / Storage Selection -->
            ${product.storageOptions && product.storageOptions.length > 0 ? `
              <div class="pdp-variant-section">
                <div class="variant-label-row">
                  <span class="variant-label">Configuration / Edition:</span>
                </div>
                <div class="pdp-options-grid">
                  ${product.storageOptions.map((opt, idx) => `
                    <button class="pdp-option-btn ${idx === 0 ? 'is-active' : ''}" data-option="${opt}">
                      ${opt}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Stock Urgency -->
            <div class="pdp-stock-status">
              <span class="stock-pulse"></span>
              <span><strong>In Stock</strong> — ${product.stock} units available in Zurich Vault</span>
            </div>

            <!-- Quantity & Actions -->
            <div class="pdp-cta-container">
              <div class="pdp-qty-picker">
                <button class="qty-btn" id="pdp-qty-minus">-</button>
                <span class="qty-val" id="pdp-qty-val">1</span>
                <button class="qty-btn" id="pdp-qty-plus">+</button>
              </div>

              <button class="btn btn-primary btn-lg flex-1" id="pdp-add-cart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span>Add to Cart</span>
              </button>

              <button class="btn btn-gold btn-lg" id="pdp-buy-now-btn">
                Buy Now
              </button>
            </div>


          </div>

        </div>

        <!-- Tabbed Information Section: Specs, Reviews, Shipping -->
        <div class="pdp-tabs-section" id="pdp-tabs-section">
          <div class="pdp-tabs-nav">
            <button class="pdp-tab-btn is-active" data-tab="tab-specs">Technical Specifications</button>
            <button class="pdp-tab-btn" data-tab="tab-reviews" id="reviews-tab-nav">Verified Reviews (${product.reviews.length})</button>
            <button class="pdp-tab-btn" data-tab="tab-shipping">White Glove Delivery & Returns</button>
          </div>

          <div class="pdp-tab-content">
            
            <!-- Tab 1: Specs -->
            <div class="pdp-tab-pane is-active" id="tab-specs">
              <table class="specs-table">
                <tbody>
                  ${Object.entries(product.specs || {}).map(([key, val]) => `
                    <tr>
                      <td class="spec-name">${key}</td>
                      <td class="spec-val">${val}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="features-list-wrap">
                <h4>Signature Innovations</h4>
                <ul class="features-bullet-list">
                  ${(product.features || []).map(f => `
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>${f}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <!-- Tab 2: Reviews -->
            <div class="pdp-tab-pane" id="tab-reviews">
              <div class="reviews-header-bar">
                <div class="reviews-summary-score">
                  <div class="big-rating">${product.rating.toFixed(1)}</div>
                  <div class="stars-gold">★★★★★</div>
                  <div class="total-rating-count">Based on ${product.reviewsCount} verified clients</div>
                </div>
                <button class="btn btn-secondary" id="write-review-btn">
                  Write a Verified Review
                </button>
              </div>

              <!-- Interactive Review Form (collapsed by default) -->
              <div class="review-form-card" id="write-review-form" style="display: none;">
                <h4>Share Your Experience</h4>
                <div class="form-group">
                  <label>Your Rating</label>
                  <div class="star-rating-input" id="star-rating-input">
                    <span class="star-pick" data-val="1">★</span>
                    <span class="star-pick" data-val="2">★</span>
                    <span class="star-pick" data-val="3">★</span>
                    <span class="star-pick" data-val="4">★</span>
                    <span class="star-pick is-selected" data-val="5">★</span>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group flex-1">
                    <label>Full Name</label>
                    <input type="text" class="custom-input" id="rev-name" placeholder="e.g. Julian Vance" />
                  </div>
                  <div class="form-group flex-1">
                    <label>Headline</label>
                    <input type="text" class="custom-input" id="rev-headline" placeholder="e.g. Exceeded expectations" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Your Review</label>
                  <textarea class="custom-textarea" id="rev-comment" rows="3" placeholder="Describe the materials, craftsmanship, sound, or performance..."></textarea>
                </div>
                <div class="form-actions">
                  <button class="btn btn-primary" id="submit-review-btn">Submit Review</button>
                  <button class="btn btn-ghost" id="cancel-review-btn">Cancel</button>
                </div>
              </div>

              <!-- Reviews List -->
              <div class="reviews-list" id="reviews-list">
                ${product.reviews.map(rev => `
                  <div class="review-card">
                    <div class="review-header">
                      <div class="review-author-info">
                        <strong class="author-name">${rev.author}</strong>
                        ${rev.verified ? '<span class="verified-badge">✓ Verified Collector</span>' : ''}
                      </div>
                      <span class="review-date">${rev.date}</span>
                    </div>
                    <div class="review-stars">★★★★★</div>
                    <h5 class="review-title">${rev.title}</h5>
                    <p class="review-comment">${rev.comment}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Tab 3: Shipping & Returns -->
            <div class="pdp-tab-pane" id="tab-shipping">
              <div class="shipping-info-grid">
                <div class="shipping-card">
                  <div class="shipping-icon">✈️</div>
                  <h4>Bespoke Insured Transit</h4>
                  <p>All items are sealed in tamper-evident aerospace canisters and dispatched via temperature-regulated courier with real-time biometric GPS monitoring.</p>
                </div>
                <div class="shipping-card">
                  <div class="shipping-icon">🛡️</div>
                  <h4>Global Concierge Warranty</h4>
                  <p>Comprehensive 36-month worldwide warranty covering component craftsmanship, optical recalibration, and software firmware enhancements.</p>
                </div>
                <div class="shipping-card">
                  <div class="shipping-icon">🔄</div>
                  <h4>30-Day Complimentary Exchange</h4>
                  <p>If you are not captivated by your selection, our courier will pick up the package from your residence or office at zero cost.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;

  attachPdpEvents(container, product, {
    getSelectedColor: () => selectedColor,
    setSelectedColor: (c) => { selectedColor = c; },
    getSelectedOption: () => selectedOption,
    setSelectedOption: (o) => { selectedOption = o; },
    getQuantity: () => quantity,
    setQuantity: (q) => { quantity = q; }
  });
}

function attachPdpEvents(container, product, state) {
  // Breadcrumb home
  container.querySelector('#breadcrumb-home')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });

  // Thumbnails click
  const activeImg = container.querySelector('#pdp-active-img');
  container.querySelectorAll('.pdp-thumb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      const imgUrl = btn.dataset.img;
      if (activeImg && imgUrl) {
        activeImg.src = imgUrl;
      }
      container.querySelectorAll('.pdp-thumb-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  // Color selection
  const selectedColorText = container.querySelector('#selected-color-name');
  container.querySelectorAll('.pdp-color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      sounds.playClick();
      const color = dot.dataset.color;
      const imgUrl = dot.dataset.img;
      state.setSelectedColor(color);
      if (selectedColorText) selectedColorText.textContent = color;
      if (activeImg && imgUrl) activeImg.src = imgUrl;

      container.querySelectorAll('.pdp-color-dot').forEach(d => d.classList.remove('is-active'));
      dot.classList.add('is-active');
    });
  });

  // Option selection
  container.querySelectorAll('.pdp-option-btn').forEach(optBtn => {
    optBtn.addEventListener('click', () => {
      sounds.playClick();
      state.setSelectedOption(optBtn.dataset.option);
      container.querySelectorAll('.pdp-option-btn').forEach(b => b.classList.remove('is-active'));
      optBtn.classList.add('is-active');
    });
  });

  // Quantity adjustments
  const qtyVal = container.querySelector('#pdp-qty-val');
  container.querySelector('#pdp-qty-minus')?.addEventListener('click', () => {
    sounds.playClick();
    let q = state.getQuantity();
    if (q > 1) {
      q--;
      state.setQuantity(q);
      if (qtyVal) qtyVal.textContent = q;
    }
  });

  container.querySelector('#pdp-qty-plus')?.addEventListener('click', () => {
    sounds.playClick();
    let q = state.getQuantity();
    if (q < 10) {
      q++;
      state.setQuantity(q);
      if (qtyVal) qtyVal.textContent = q;
    }
  });

  // Add to Cart
  const addCartBtn = container.querySelector('#pdp-add-cart-btn');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      store.addToCart(product, state.getSelectedColor(), state.getSelectedOption(), state.getQuantity());
      ui.showToast({
        title: 'Added to Cart',
        message: `${state.getQuantity()}x ${product.name} (${state.getSelectedColor()})`,
        type: 'success',
        actionText: 'View Cart',
        onAction: () => ui.toggleDrawer('cart-drawer', true)
      });
    });
  }

  // Buy Now (Direct to Checkout)
  const buyNowBtn = container.querySelector('#pdp-buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      store.addToCart(product, state.getSelectedColor(), state.getSelectedOption(), state.getQuantity());
      store.setView('checkout');
    });
  }


  // Tabs Switching
  container.querySelectorAll('.pdp-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      sounds.playClick();
      const targetTab = tabBtn.dataset.tab;
      container.querySelectorAll('.pdp-tab-btn').forEach(b => b.classList.remove('is-active'));
      container.querySelectorAll('.pdp-tab-pane').forEach(p => p.classList.remove('is-active'));
      
      tabBtn.classList.add('is-active');
      container.querySelector(`#${targetTab}`)?.classList.add('is-active');
    });
  });

  // Scroll to reviews link
  container.querySelector('#scroll-to-reviews')?.addEventListener('click', (e) => {
    e.preventDefault();
    container.querySelector('#reviews-tab-nav')?.click();
    container.querySelector('#pdp-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Write Review toggle & form
  const writeReviewBtn = container.querySelector('#write-review-btn');
  const reviewForm = container.querySelector('#write-review-form');
  const cancelReviewBtn = container.querySelector('#cancel-review-btn');
  const submitReviewBtn = container.querySelector('#submit-review-btn');

  if (writeReviewBtn && reviewForm) {
    writeReviewBtn.addEventListener('click', () => {
      sounds.playClick();
      reviewForm.style.display = reviewForm.style.display === 'none' ? 'block' : 'none';
    });
  }

  if (cancelReviewBtn && reviewForm) {
    cancelReviewBtn.addEventListener('click', () => {
      reviewForm.style.display = 'none';
    });
  }

  if (submitReviewBtn && reviewForm) {
    submitReviewBtn.addEventListener('click', () => {
      const name = container.querySelector('#rev-name')?.value.trim();
      const title = container.querySelector('#rev-headline')?.value.trim();
      const comment = container.querySelector('#rev-comment')?.value.trim();

      if (!name || !title || !comment) {
        ui.showToast({
          title: 'Missing Details',
          message: 'Please provide your name, headline, and comments.',
          type: 'warning'
        });
        return;
      }

      product.reviews.unshift({
        id: `rev-${Date.now()}`,
        author: name,
        rating: 5,
        date: 'Just now',
        verified: true,
        title,
        comment
      });

      product.reviewsCount++;

      ui.showToast({
        title: 'Review Published',
        message: 'Thank you for your valuable feedback!',
        type: 'success'
      });

      reviewForm.style.display = 'none';
      renderProductDetailPage(container, product.id);
      container.querySelector('#reviews-tab-nav')?.click();
    });
  }
}

/**
 * Quick View Modal Renderer
 */
export function renderQuickViewModal(productId) {
  const modalContent = document.getElementById('quick-view-modal-content');
  const product = store.state.products.find(p => p.id === productId);
  if (!modalContent || !product) return;

  const { currency } = store.state;
  const currentPriceObj = convertPrice(product.price, currency);

  modalContent.innerHTML = `
    <div class="quick-view-grid">
      <div class="quick-view-img-wrap">
        <img src="${product.heroImage}" alt="${product.name}" class="quick-view-img" />
      </div>
      <div class="quick-view-details">
        <div class="card-category">${product.category}</div>
        <h2 class="quick-view-title">${product.name}</h2>
        <div class="quick-view-price">${currentPriceObj.formatted}</div>
        <p class="quick-view-desc">${product.description}</p>
        
        <div class="quick-view-actions">
          <button class="btn btn-primary flex-1" id="quick-view-add-btn">
            Add to Cart
          </button>
          <button class="btn btn-secondary" id="quick-view-full-btn">
            View Full Specs
          </button>
        </div>
      </div>
    </div>
  `;

  modalContent.querySelector('#quick-view-add-btn')?.addEventListener('click', () => {
    store.addToCart(product);
    ui.closeModal('quick-view-modal');
    ui.showToast({
      title: 'Added to Cart',
      message: `${product.name} added to your cart.`,
      type: 'success',
      actionText: 'View Cart',
      onAction: () => ui.toggleDrawer('cart-drawer', true)
    });
  });

  modalContent.querySelector('#quick-view-full-btn')?.addEventListener('click', () => {
    ui.closeModal('quick-view-modal');
    store.setView('pdp', product.id);
  });

  ui.openModal('quick-view-modal');
}
