/**
 * AURA LUXE - Product Detail Page (PDP) & Quick View Controller
 * Full product exploration, multi-angle touch gallery, zoom lens, mobile sticky action bar, variants, reviews, and bundles.
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';
import { openAuthModal } from './auth-modal.js';

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

  // Compute Suggested Accessories (Synergy pairings + complementary products)
  const pairedIds = product.frequentlyBoughtTogether || [];
  const explicitPaired = pairedIds.map(id => store.state.products.find(p => p.id === id)).filter(Boolean);
  const sameCategory = store.state.products.filter(p => p.id !== product.id && p.category === product.category && !pairedIds.includes(p.id));
  const otherBestSellers = store.state.products.filter(p => p.id !== product.id && !pairedIds.includes(p.id) && (p.isBestSeller || p.featured));
  const suggestedProducts = Array.from(new Set([...explicitPaired, ...sameCategory, ...otherBestSellers])).slice(0, 4);

  const galleryList = product.gallery && product.gallery.length > 0 ? product.gallery : [product.heroImage];

  container.innerHTML = `
    <div class="pdp-wrapper animate-fade-in">
      <div class="container">
        
        <!-- Main Product Grid: Gallery Left + Configuration Right -->
        <div class="pdp-main-grid">
          
          <!-- Left: Gallery & Touch Zoom -->
          <div class="pdp-gallery-col">
            <!-- Thumbnail Strip (Sub-Images) on the Left -->
            ${galleryList.length > 1 ? `
              <div class="pdp-thumbnails-strip" id="pdp-thumbs-strip">
                ${galleryList.map((img, idx) => `
                  <button class="pdp-thumb-btn ${idx === 0 ? 'is-active' : ''}" data-img="${img}" data-idx="${idx}" aria-label="Product image ${idx + 1}">
                    <img src="${img}" alt="Thumbnail ${idx + 1}" loading="lazy" />
                  </button>
                `).join('')}
              </div>
            ` : ''}

            <!-- Main Product Image on the Right -->
            <div class="pdp-main-image-wrap" id="pdp-zoom-container">
              <img src="${currentImage}" alt="${product.name}" id="pdp-active-img" class="pdp-main-img" />
              <div class="pdp-zoom-lens" id="pdp-zoom-lens"></div>
              
              <div class="pdp-image-badges">
                ${product.isNew ? '<span class="badge badge-new">NEW EDITION</span>' : ''}
                ${discountPercent > 0 ? `<span class="badge badge-sale">-${discountPercent}% OFF</span>` : ''}
              </div>

              <!-- Mobile Photo Counter Pill -->
              <div class="pdp-mobile-img-counter" id="pdp-mobile-img-counter">
                1 / ${galleryList.length}
              </div>
            </div>
          </div>

          <!-- Right: Details, Variants & Purchase -->
          <div class="pdp-details-col">
            <h1 class="pdp-title">${product.name}</h1>

            <div class="pdp-meta-header">
              <div class="pdp-rating-row">
                <span class="stars">★★★★★</span>
                <span class="score">${product.rating.toFixed(2)}</span>
                <a href="#reviews-tab" class="reviews-link" id="scroll-to-reviews">(${product.reviewsCount} verified reviews)</a>
              </div>
            </div>

            <p class="pdp-tagline">${product.tagline}</p>

            <!-- Pricing Box -->
            <div class="pdp-price-card">
              <div class="pdp-price-box">
                <div class="pdp-current-price" id="pdp-price-display">${currentPriceObj.formatted}</div>
                ${originalPriceObj ? `<div class="pdp-original-price">${originalPriceObj.formatted}</div>` : ''}
                ${discountPercent > 0 ? `<div class="pdp-savings-pill">Save ${discountPercent}%</div>` : ''}
              </div>
              <div class="pdp-price-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Tax included. Fast courier delivery dispatched in 24 hours.</span>
              </div>
            </div>

            <p class="pdp-description">${product.description}</p>

            <!-- Micro Guarantee Highlights -->
            <div class="pdp-guarantee-badges">
              <div class="guarantee-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>6 Month Warranty</span>
              </div>
              <div class="guarantee-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                <span>7 Days Free Return</span>
              </div>
              <div class="guarantee-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                <span>Express Courier Dispatch</span>
              </div>
            </div>

            <!-- Quantity & Call-to-Action Buttons -->
            <div class="pdp-actions-row">
              <div class="pdp-qty-wrap">
                <button class="qty-btn" id="pdp-qty-minus" aria-label="Decrease quantity">−</button>
                <span class="qty-val" id="pdp-qty-val">1</span>
                <button class="qty-btn" id="pdp-qty-plus" aria-label="Increase quantity">+</button>
              </div>

              <button class="btn btn-primary btn-lg pdp-main-add-btn" id="pdp-add-cart-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span>Add to Cart</span>
              </button>

              <button class="btn btn-secondary btn-lg pdp-main-buy-btn" id="pdp-buy-now-btn">
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Detailed Specifications, Reviews & Delivery Tabs -->
        <div class="pdp-tabs-section" id="pdp-tabs-section">
          
          <div class="pdp-tabs-nav" role="tablist">
            <button class="pdp-tab-btn is-active" data-tab="tab-specs" role="tab" aria-selected="true" id="tab-btn-specs">
              <span class="tab-btn-icon">📐</span>
              <span class="tab-label-full">Technical Specifications</span>
              <span class="tab-label-short">Specs</span>
            </button>
            <button class="pdp-tab-btn" data-tab="tab-reviews" id="reviews-tab-nav" role="tab" aria-selected="false">
              <span class="tab-btn-icon">⭐</span>
              <span class="tab-label-full">Client Reviews (${product.reviewsCount})</span>
              <span class="tab-label-short">Reviews (${product.reviewsCount})</span>
            </button>
            <button class="pdp-tab-btn" data-tab="tab-shipping" role="tab" aria-selected="false" id="tab-btn-shipping">
              <span class="tab-btn-icon">🚚</span>
              <span class="tab-label-full">Shipping & Returns</span>
              <span class="tab-label-short">Shipping</span>
            </button>
          </div>

          <div class="pdp-tabs-content">
            
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

              <div class="features-highlight-box">
                <h4>Engineered Highlights & Features</h4>
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
                  <textarea class="custom-textarea" id="rev-comment" rows="3" placeholder="Describe the materials, performance, click feel, or sound..."></textarea>
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
                        ${rev.verified ? '<span class="verified-badge">✓ Verified Buyer</span>' : ''}
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
                  <h4>Express Insured Dispatch</h4>
                  <p>All items are securely packaged in shock-proof anti-static containers and dispatched via tracked express courier within 24 hours.</p>
                </div>
                <div class="shipping-card">
                  <div class="shipping-icon">🛡️</div>
                  <h4>6 Month Warranty</h4>
                  <p>Comprehensive 6-month warranty covering component craftsmanship, switch replacements, and hardware optimizations.</p>
                </div>
                <div class="shipping-card">
                  <div class="shipping-icon">🔄</div>
                  <h4>7 Days Free Return</h4>
                  <p>If you are not 100% satisfied with your accessory, return it within 7 days for a full refund or free replacement.</p>
                </div>
              </div>


            </div>

          </div>
        </div>

        <!-- Suggested Items & Frequently Paired Accessories Section -->
        ${suggestedProducts.length > 0 ? `
          <section class="pdp-suggested-section animate-fade-in" id="pdp-suggested-section">
            <div class="suggested-section-header">
              <div class="suggested-title-group">
                <h2 class="suggested-title">Suggested Accessories & Pairings</h2>
                <p class="suggested-subtitle">Complete your setup with frequently bought and complementary high-performance peripherals.</p>
              </div>
              <div class="suggested-header-nav">
                <button class="btn btn-secondary-sm" id="suggested-browse-all-btn">Browse All Peripherals &rarr;</button>
              </div>
            </div>

            <!-- Suggested Products Cards Grid -->
            <div class="suggested-products-grid" id="suggested-products-grid">
              ${suggestedProducts.map(item => {
    const itemPrice = convertPrice(item.price, currency);
    const itemOrigPrice = item.originalPrice ? convertPrice(item.originalPrice, currency) : null;
    const itemDiscount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

    return `
                  <div class="product-card suggested-product-card" data-id="${item.id}">
                    <div class="card-img-container suggested-img-wrap" data-nav-id="${item.id}">
                      <img src="${item.heroImage}" alt="${item.name}" class="product-img suggested-img" loading="lazy" />
                      ${itemDiscount > 0 ? `<span class="card-discount-pill">-${itemDiscount}%</span>` : ''}
                      <button class="card-quick-view-btn suggested-quick-view-btn" data-quickview="${item.id}" title="Quick View" aria-label="Quick View ${item.name}">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    </div>
                    <div class="card-content suggested-info">
                      <h3 class="card-title suggested-name" data-nav-id="${item.id}" title="${item.name}">${item.name}</h3>
                      <div class="card-rating-row suggested-stars">
                        <span class="card-stars">★★★★★</span>
                        <span class="card-rating-val">(${item.rating.toFixed(2)})</span>
                      </div>
                      <div class="card-divider"></div>
                      <div class="card-footer suggested-price-row">
                        <div class="card-price-wrap suggested-price">
                          <span class="card-price curr-price">${itemPrice.formatted}</span>
                          ${itemOrigPrice ? `<span class="card-original-price old-price">${itemOrigPrice.formatted}</span>` : ''}
                        </div>
                        <button class="btn-card-add suggested-add-btn" data-id="${item.id}" aria-label="Add ${item.name} to Cart">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                          </svg>
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                `;
  }).join('')}
            </div>
          </section>
        ` : ''}

      </div>

      <!-- Mobile Sticky Bottom Floating Action Bar -->
      <div class="pdp-mobile-sticky-bar" id="pdp-mobile-sticky-bar">
        <div class="sticky-bar-left">
          <img src="${currentImage}" alt="${product.name}" class="sticky-bar-thumb" id="sticky-bar-img" />
          <div class="sticky-bar-info">
            <span class="sticky-bar-title">${product.name}</span>
            <span class="sticky-bar-price" id="sticky-bar-price">${currentPriceObj.formatted}</span>
          </div>
        </div>
        <div class="sticky-bar-actions">
          <button class="btn btn-secondary sticky-bar-cart-btn" id="sticky-bar-add-btn" aria-label="Add to cart" title="Add to cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
          <button class="btn btn-primary sticky-bar-buy-btn" id="sticky-bar-buy-btn">
            <span>Buy Now</span>
          </button>
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
  // Breadcrumb navigation
  container.querySelector('#breadcrumb-home')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });

  container.querySelector('#breadcrumb-category')?.addEventListener('click', () => {
    sounds.playClick();
    if (product.category) {
      store.setFilter('category', product.category);
    }
    store.setView('catalog');
  });

  const activeImg = container.querySelector('#pdp-active-img');
  const stickyImg = container.querySelector('#sticky-bar-img');
  const counterEl = container.querySelector('#pdp-mobile-img-counter');
  const galleryImgs = product.gallery && product.gallery.length > 0 ? product.gallery : [product.heroImage];
  let currentGalleryIdx = 0;

  function updateGalleryIndex(idx) {
    currentGalleryIdx = (idx + galleryImgs.length) % galleryImgs.length;
    const newImg = galleryImgs[currentGalleryIdx];
    if (activeImg) activeImg.src = newImg;
    if (stickyImg) stickyImg.src = newImg;
    if (counterEl) counterEl.textContent = `${currentGalleryIdx + 1} / ${galleryImgs.length}`;

    const thumbsStrip = container.querySelector('#pdp-thumbs-strip');
    container.querySelectorAll('.pdp-thumb-btn').forEach((b, i) => {
      if (i === currentGalleryIdx) {
        b.classList.add('is-active');
        if (thumbsStrip) {
          b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
      } else {
        b.classList.remove('is-active');
      }
    });
  }

  // Thumbnails click sync
  container.querySelectorAll('.pdp-thumb-btn').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      updateGalleryIndex(idx);
    });
  });

  // Mobile Touch Swipe Gesture for Image Gallery (Smooth & non-blocking vertical scroll)
  const galleryWrap = container.querySelector('#pdp-zoom-container');
  if (galleryWrap) {
    let touchStartX = 0;
    let touchStartY = 0;
    let isHorizontalGesture = false;

    galleryWrap.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isHorizontalGesture = false;
    }, { passive: true });

    galleryWrap.addEventListener('touchmove', (e) => {
      if (!touchStartX || !touchStartY || e.touches.length !== 1) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - touchStartX;
      const deltaY = currentY - touchStartY;

      // If user is moving predominantly vertically, it's page scrolling - do not interfere
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isHorizontalGesture = false;
        return;
      }
      if (Math.abs(deltaX) > 25) {
        isHorizontalGesture = true;
      }
    }, { passive: true });

    galleryWrap.addEventListener('touchend', (e) => {
      if (!isHorizontalGesture || !touchStartX) return;
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;

      if (Math.abs(diffX) > 40 && galleryImgs.length > 1) {
        sounds.playClick();
        if (diffX < 0) {
          updateGalleryIndex(currentGalleryIdx + 1); // Swipe left -> Next
        } else {
          updateGalleryIndex(currentGalleryIdx - 1); // Swipe right -> Prev
        }
      }
      touchStartX = 0;
      touchStartY = 0;
      isHorizontalGesture = false;
    }, { passive: true });
  }



  // Option selection
  container.querySelectorAll('.pdp-option-btn').forEach(optBtn => {
    optBtn.addEventListener('click', () => {
      sounds.playClick();
      state.setSelectedOption(optBtn.dataset.option);
      const optNameEl = container.querySelector('#selected-option-name');
      if (optNameEl) optNameEl.textContent = optBtn.dataset.option;
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

  // Add to Cart Main Button
  const addCartBtn = container.querySelector('#pdp-add-cart-btn');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      sounds.playClick();
      store.addToCart(product, state.getSelectedColor(), state.getSelectedOption(), state.getQuantity());

      const origText = addCartBtn.innerHTML;
      addCartBtn.innerHTML = `✓ Added to Cart`;
      addCartBtn.classList.add('btn-added-state');
      setTimeout(() => {
        addCartBtn.innerHTML = origText;
        addCartBtn.classList.remove('btn-added-state');
      }, 1200);

      ui.showToast({
        title: 'Added to Cart',
        message: `${state.getQuantity()}x ${product.name} (${state.getSelectedColor()})`,
        type: 'success',
        actionText: 'View Cart',
        onAction: () => ui.toggleDrawer('cart-drawer', true)
      });
    });
  }

  // Mobile Sticky Bar Visibility on Scroll (Using high-performance IntersectionObserver)
  const stickyBar = container.querySelector('#pdp-mobile-sticky-bar');
  const mainBuyBtn = container.querySelector('#pdp-add-cart-btn');
  if (stickyBar && mainBuyBtn) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (window.innerWidth <= 768) {
            if (!entry.isIntersecting && entry.boundingClientRect.top < 100) {
              stickyBar.classList.add('is-visible');
            } else {
              stickyBar.classList.remove('is-visible');
            }
          } else {
            stickyBar.classList.remove('is-visible');
          }
        });
      }, {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
      });

      observer.observe(mainBuyBtn);
    } else {
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (window.innerWidth <= 768) {
              const btnRect = mainBuyBtn.getBoundingClientRect();
              if (btnRect.bottom < 100) {
                stickyBar.classList.add('is-visible');
              } else {
                stickyBar.classList.remove('is-visible');
              }
            }
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  }

  // Mobile Sticky Bar Add to Cart
  const stickyAddBtn = container.querySelector('#sticky-bar-add-btn');
  if (stickyAddBtn) {
    stickyAddBtn.addEventListener('click', () => {
      sounds.playClick();
      store.addToCart(product, state.getSelectedColor(), state.getSelectedOption(), state.getQuantity());
      stickyAddBtn.innerHTML = `✓ Added`;
      stickyAddBtn.classList.add('btn-added-state');
      setTimeout(() => {
        stickyAddBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span>Add to Cart</span>
        `;
        stickyAddBtn.classList.remove('btn-added-state');
      }, 1200);

      ui.showToast({
        title: 'Added to Cart',
        message: `${state.getQuantity()}x ${product.name} (${state.getSelectedColor()})`,
        type: 'success',
        actionText: 'View Cart',
        onAction: () => ui.toggleDrawer('cart-drawer', true)
      });
    });
  }

  // Mobile Sticky Bar Buy Now (Direct to Checkout)
  const stickyBuyBtn = container.querySelector('#sticky-bar-buy-btn');
  if (stickyBuyBtn) {
    stickyBuyBtn.addEventListener('click', () => {
      sounds.playClick();
      store.addToCart(product, state.getSelectedColor(), state.getSelectedOption(), state.getQuantity());

      const isLoggedIn = !!(store.state.user && store.state.user.isLoggedIn);
      if (!isLoggedIn) {
        ui.showToast({
          title: 'Sign In Required',
          message: 'Please sign in or create an account to proceed to checkout.',
          type: 'info'
        });
        openAuthModal('login', {
          redirectTo: 'checkout',
          notice: '<strong>Sign In Required:</strong> Please sign in or create an account to complete your purchase.'
        });
        return;
      }
      store.setView('checkout');
    });
  }

  // Buy Now (Direct to Checkout)
  const buyNowBtn = container.querySelector('#pdp-buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      sounds.playClick();
      store.addToCart(product, state.getSelectedColor(), state.getSelectedOption(), state.getQuantity());

      const isLoggedIn = !!(store.state.user && store.state.user.isLoggedIn);
      if (!isLoggedIn) {
        ui.showToast({
          title: 'Sign In Required',
          message: 'Please sign in or create an account to proceed to checkout.',
          type: 'info'
        });
        openAuthModal('login', {
          redirectTo: 'checkout',
          notice: '<strong>Sign In Required:</strong> Please sign in or create an account to complete your purchase.'
        });
        return;
      }
      store.setView('checkout');
    });
  }

  // Tabs Switching with Intelligent Scroll Anchoring & Responsive Handling
  const switchPdpTab = (targetTab) => {
    const tabsSection = container.querySelector('#pdp-tabs-section');
    container.querySelectorAll('.pdp-tab-btn').forEach(b => {
      const isMatch = b.dataset.tab === targetTab;
      b.classList.toggle('is-active', isMatch);
      b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
    container.querySelectorAll('.pdp-tab-pane').forEach(p => {
      p.classList.toggle('is-active', p.id === targetTab);
    });

    // Intelligent Scroll Anchoring:
    // If the tabs section top is scrolled above the screen or past the header,
    // smoothly anchor the tabs header right below the sticky site header!
    if (tabsSection) {
      const headerOffset = window.innerWidth <= 768 ? 116 : 90;
      const rect = tabsSection.getBoundingClientRect();
      if (rect.top < headerOffset - 10 || rect.top > window.innerHeight * 0.45) {
        const targetScrollY = window.pageYOffset + rect.top - headerOffset;
        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: 'smooth'
        });
      }
    }
  };

  container.querySelectorAll('.pdp-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      sounds.playClick();
      switchPdpTab(tabBtn.dataset.tab);
    });
  });


  // Scroll to reviews link
  container.querySelector('#scroll-to-reviews')?.addEventListener('click', (e) => {
    e.preventDefault();
    sounds.playClick();
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
      sounds.playClick();
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

      sounds.playSuccess();
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

  // Suggested Items Quick Add
  container.querySelectorAll('.suggested-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playClick();
      const targetId = btn.dataset.id;
      const targetProd = store.state.products.find(p => p.id === targetId);
      if (targetProd) {
        store.addToCart(targetProd);
        ui.showToast({
          title: 'Added to Cart',
          message: `${targetProd.name} added.`,
          type: 'success',
          actionText: 'View Cart',
          onAction: () => ui.toggleDrawer('cart-drawer', true)
        });
      }
    });
  });

  // Suggested Items Navigate to Product PDP
  container.querySelectorAll('[data-nav-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.suggested-quick-view-btn') || e.target.closest('.card-quick-view-btn') || e.target.closest('.suggested-add-btn') || e.target.closest('.btn-card-add')) return;
      sounds.playClick();
      const targetId = el.dataset.navId;
      if (targetId) {
        store.setView('pdp', targetId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Suggested Items Quick View
  container.querySelectorAll('.suggested-quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playClick();
      const targetId = btn.dataset.quickview;
      if (targetId) {
        store.setQuickView(targetId);
      }
    });
  });

  // Browse All Accessories CTA button
  container.querySelector('#suggested-browse-all-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
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
    sounds.playClick();
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
    sounds.playClick();
    ui.closeModal('quick-view-modal');
    store.setView('pdp', product.id);
  });

  ui.openModal('quick-view-modal');
}
