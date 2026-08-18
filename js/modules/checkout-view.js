/**
 * AURA LUXE - Multi-Step Checkout & Order Confirmation
 * 3-Step frictionless flow, 3D interactive card preview, instant order tracking, and invoice generator.
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';

export function renderCheckoutView(container) {
  const { cart, currency, appliedPromo, user } = store.state;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="checkout-empty-wrap animate-fade-in">
        <div class="container text-center">
          <h2>No Items to Checkout</h2>
          <p>Your luxury vault bag is currently empty.</p>
          <button class="btn btn-primary mt-4" id="empty-chk-catalog">Return to Flagship Collection</button>
        </div>
      </div>
    `;
    container.querySelector('#empty-chk-catalog')?.addEventListener('click', () => {
      store.setView('catalog');
    });
    return;
  }

  let currentStep = 1;
  const summary = store.getCartSummary();

  const formData = {
    email: user.email || 'julian.vance@auraconcept.com',
    fullName: user.name || 'Julian Vance',
    address: '742 Evergreen Terrace, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States',
    shippingMethod: 'FedEx White Glove Priority Courier',
    paymentMethod: 'Credit / Debit Card',
    cardNumber: '•••• •••• •••• 4242',
    cardName: 'JULIAN VANCE',
    cardExpiry: '08/29',
    cardCvv: '•••'
  };

  container.innerHTML = `
    <div class="checkout-page-wrapper animate-fade-in">
      <div class="container">
        
        <!-- Top Checkout Stepper Bar -->
        <div class="checkout-stepper-header">
          <div class="stepper-step is-active" id="step-node-1">
            <div class="step-num">1</div>
            <span class="step-label">Shipping & Contact</span>
          </div>
          <div class="stepper-connector"></div>
          <div class="stepper-step" id="step-node-2">
            <div class="step-num">2</div>
            <span class="step-label">Delivery Method</span>
          </div>
          <div class="stepper-connector"></div>
          <div class="stepper-step" id="step-node-3">
            <div class="step-num">3</div>
            <span class="step-label">Payment & Security</span>
          </div>
        </div>

        <!-- 2-Column Grid: Steps Left + Sticky Order Summary Right -->
        <div class="checkout-grid">
          
          <!-- Steps Left Panel -->
          <div class="checkout-steps-panel">
            
            <!-- STEP 1: Shipping & Contact -->
            <div class="checkout-step-content is-active" id="chk-step-1">
              <div class="step-header">
                <h3>Contact & Insured Delivery Address</h3>
                <p>Provide your delivery location for our insured white-glove logistics network.</p>
              </div>

              <div class="checkout-form">
                <div class="form-group">
                  <label>Email Address for Order Confirmation</label>
                  <input type="email" class="custom-input" id="chk-email" value="${formData.email}" placeholder="your.name@domain.com" required />
                </div>

                <div class="form-row">
                  <div class="form-group flex-1">
                    <label>Full Legal Name</label>
                    <input type="text" class="custom-input" id="chk-name" value="${formData.fullName}" placeholder="Julian Vance" required />
                  </div>
                  <div class="form-group flex-1">
                    <label>Phone Number (Courier Dispatch)</label>
                    <input type="tel" class="custom-input" id="chk-phone" value="+1 (415) 890-4321" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Street Address & Suite / Penthouse</label>
                  <input type="text" class="custom-input" id="chk-address" value="${formData.address}" placeholder="123 Luxury Blvd, Suite 800" required />
                </div>

                <div class="form-row">
                  <div class="form-group flex-2">
                    <label>City</label>
                    <input type="text" class="custom-input" id="chk-city" value="${formData.city}" placeholder="San Francisco" required />
                  </div>
                  <div class="form-group flex-1">
                    <label>State / Region</label>
                    <input type="text" class="custom-input" id="chk-state" value="${formData.state}" placeholder="CA" required />
                  </div>
                  <div class="form-group flex-1">
                    <label>Postal Code</label>
                    <input type="text" class="custom-input" id="chk-zip" value="${formData.zip}" placeholder="94107" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Country / Territory</label>
                  <select class="custom-select" id="chk-country">
                    <option value="United States" selected>United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Japan">Japan</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Ghana">Ghana</option>
                  </select>
                </div>

                <div class="step-actions">
                  <button class="btn btn-ghost" id="chk-back-to-bag">Back to Cart</button>
                  <button class="btn btn-primary btn-lg" id="chk-goto-step-2">
                    Continue to Delivery Method
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- STEP 2: Delivery Method -->
            <div class="checkout-step-content" id="chk-step-2" style="display: none;">
              <div class="step-header">
                <h3>Select Delivery Method</h3>
                <p>All tiers include tamper-proof titanium sealed containers and full transit insurance.</p>
              </div>

              <div class="shipping-tiers-list">
                
                <label class="shipping-tier-card is-selected" data-method="FedEx White Glove Priority Courier" data-cost="0">
                  <input type="radio" name="shipping_tier" checked />
                  <div class="tier-radio-custom"></div>
                  <div class="tier-info">
                    <div class="tier-title-row">
                      <strong class="tier-name">FedEx White Glove Priority Courier</strong>
                      <span class="tier-price">${summary.shipping === 0 ? 'FREE' : convertPrice(45, currency).formatted}</span>
                    </div>
                    <p class="tier-desc">Direct air dispatch from Zurich Vault. Arrives in 2-3 business days with biometric signature verification.</p>
                  </div>
                </label>

                <label class="shipping-tier-card" data-method="Same-Day Armored Courier (Metro Only)" data-cost="75">
                  <input type="radio" name="shipping_tier" />
                  <div class="tier-radio-custom"></div>
                  <div class="tier-info">
                    <div class="tier-title-row">
                      <strong class="tier-name">Same-Day Armored Courier</strong>
                      <span class="tier-price">${convertPrice(75, currency).formatted}</span>
                    </div>
                    <p class="tier-desc">Hand-delivered by private security specialist within 8 hours. Available in major metropolitan centers.</p>
                  </div>
                </label>

                <label class="shipping-tier-card" data-method="Swiss Vault Holding (Private Collection)" data-cost="0">
                  <input type="radio" name="shipping_tier" />
                  <div class="tier-radio-custom"></div>
                  <div class="tier-info">
                    <div class="tier-title-row">
                      <strong class="tier-name">Swiss Vault Allocation & Secure Custody</strong>
                      <span class="tier-price">COMPLIMENTARY</span>
                    </div>
                    <p class="tier-desc">Stored in climate-controlled Zurich vault until you request physical dispatch or concierge handover.</p>
                  </div>
                </label>

              </div>

              <div class="step-actions">
                <button class="btn btn-ghost" id="chk-back-step-1">Back to Shipping Info</button>
                <button class="btn btn-primary btn-lg" id="chk-goto-step-3">
                  Continue to Payment
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>

            <!-- STEP 3: Payment & 3D Interactive Card -->
            <div class="checkout-step-content" id="chk-step-3" style="display: none;">
              <div class="step-header">
                <h3>Encrypted Payment Gateway</h3>
                <p>256-bit quantum-resistant TLS encryption. Your payment is tokenized and secure.</p>
              </div>

              <!-- Payment Method Selector Tabs -->
              <div class="payment-tabs-nav">
                <button class="pay-tab-btn is-active" data-method="Credit Card">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Credit / Debit Card
                </button>
                <button class="pay-tab-btn" data-method="Apple Pay">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.1-1.92.98-3.05-1 .04-2.17.67-2.83 1.44-.58.67-1.1 1.77-.96 2.87 1.12.09 2.15-.46 2.81-1.26z"/></svg>
                  Apple Pay
                </button>
                <button class="pay-tab-btn" data-method="Crypto / Solana">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                  Solana / USDC
                </button>
              </div>

              <!-- Interactive 3D Card Preview -->
              <div class="interactive-card-showcase" id="card-3d-wrap">
                <div class="virtual-card">
                  <div class="virtual-card-chip">
                    <svg width="34" height="26" viewBox="0 0 34 26" fill="none"><rect width="34" height="26" rx="4" fill="#d4af37"/><path d="M0 9h34M0 17h34M12 0v26M22 0v26" stroke="#996515" stroke-width="1.5"/></svg>
                    <span class="card-contactless">)))</span>
                  </div>
                  <div class="virtual-card-number" id="preview-card-number">•••• •••• •••• 4242</div>
                  <div class="virtual-card-bottom">
                    <div class="virtual-card-holder">
                      <span class="v-label">CARDHOLDER</span>
                      <span class="v-val" id="preview-card-name">JULIAN VANCE</span>
                    </div>
                    <div class="virtual-card-expires">
                      <span class="v-label">EXPIRES</span>
                      <span class="v-val" id="preview-card-expiry">08/29</span>
                    </div>
                    <div class="virtual-card-logo">AURA NOIR</div>
                  </div>
                </div>
              </div>

              <!-- Credit Card Fields -->
              <div class="card-inputs-form">
                <div class="form-group">
                  <label>Card Number</label>
                  <input type="text" class="custom-input" id="input-card-number" placeholder="4242 •••• •••• 4242" maxlength="19" value="4242 8890 1204 4242" />
                </div>

                <div class="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" class="custom-input" id="input-card-name" placeholder="JULIAN VANCE" value="JULIAN VANCE" />
                </div>

                <div class="form-row">
                  <div class="form-group flex-1">
                    <label>Expiration (MM/YY)</label>
                    <input type="text" class="custom-input" id="input-card-expiry" placeholder="08/29" maxlength="5" value="08/29" />
                  </div>
                  <div class="form-group flex-1">
                    <label>Security CVV</label>
                    <input type="password" class="custom-input" id="input-card-cvv" placeholder="•••" maxlength="4" value="888" />
                  </div>
                </div>
              </div>

              <div class="step-actions">
                <button class="btn btn-ghost" id="chk-back-step-2">Back to Delivery</button>
                <button class="btn btn-primary btn-lg flex-1" id="chk-place-order-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>Authorize & Complete Purchase (${convertPrice(summary.total, currency).formatted})</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Sticky Order Summary Panel Right -->
          <div class="checkout-summary-panel">
            <div class="summary-card">
              <h3 class="summary-title">Vault Order Summary</h3>
              
              <!-- Items Preview List -->
              <div class="chk-items-preview">
                ${cart.map(item => `
                  <div class="chk-item-row">
                    <div class="chk-item-thumb">
                      <img src="${item.heroImage}" alt="${item.name}" />
                      <span class="chk-item-qty-badge">${item.quantity}</span>
                    </div>
                    <div class="chk-item-details">
                      <strong class="chk-name">${item.name}</strong>
                      <span class="chk-variant">${item.selectedColor || ''} ${item.selectedOption ? `• ${item.selectedOption}` : ''}</span>
                    </div>
                    <div class="chk-item-price">
                      ${convertPrice(item.price * item.quantity, currency).formatted}
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="summary-divider"></div>

              <!-- Promo Code Input in Checkout -->
              <div class="chk-promo-wrap">
                ${appliedPromo ? `
                  <div class="promo-active-chip">
                    <span><strong>${appliedPromo.code}</strong> (${appliedPromo.description})</span>
                    <button class="promo-remove-btn" id="chk-remove-promo">&times;</button>
                  </div>
                ` : `
                  <div class="promo-input-group">
                    <input type="text" class="custom-input custom-input-sm" id="chk-promo-input" placeholder="VIP Promo code" />
                    <button class="btn btn-secondary btn-sm" id="chk-apply-promo-btn">Apply</button>
                  </div>
                `}
              </div>

              <div class="summary-divider"></div>

              <!-- Cost breakdown -->
              <div class="chk-cost-breakdown">
                <div class="chk-cost-row">
                  <span>Subtotal</span>
                  <span>${convertPrice(summary.subtotal, currency).formatted}</span>
                </div>
                ${summary.discount > 0 ? `
                  <div class="chk-cost-row line-discount">
                    <span>Promo Discount</span>
                    <span>-${convertPrice(summary.discount, currency).formatted}</span>
                  </div>
                ` : ''}
                <div class="chk-cost-row">
                  <span>White Glove Logistics</span>
                  <span>${summary.shipping === 0 ? '<strong class="text-green">COMPLIMENTARY</strong>' : convertPrice(summary.shipping, currency).formatted}</span>
                </div>
                <div class="chk-cost-row">
                  <span>Estimated Tax & Duty</span>
                  <span>${convertPrice(summary.tax, currency).formatted}</span>
                </div>
                <div class="chk-cost-row total-row">
                  <span>Total Amount</span>
                  <span class="total-price">${convertPrice(summary.total, currency).formatted}</span>
                </div>
              </div>

              <!-- Trust Badges -->
              <div class="chk-trust-badges">
                <div class="trust-badge-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>256-Bit Encrypted Vault</span>
                </div>
                <div class="trust-badge-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>100% Insured Delivery</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  attachCheckoutEvents(container, formData);
}

function attachCheckoutEvents(container, formData) {
  const stepNode1 = container.querySelector('#step-node-1');
  const stepNode2 = container.querySelector('#step-node-2');
  const stepNode3 = container.querySelector('#step-node-3');

  const stepPane1 = container.querySelector('#chk-step-1');
  const stepPane2 = container.querySelector('#chk-step-2');
  const stepPane3 = container.querySelector('#chk-step-3');

  const goToStep = (step) => {
    sounds.playClick();
    [stepNode1, stepNode2, stepNode3].forEach((n, idx) => {
      n.classList.toggle('is-active', idx + 1 === step);
      n.classList.toggle('is-completed', idx + 1 < step);
    });

    stepPane1.style.display = step === 1 ? 'block' : 'none';
    stepPane2.style.display = step === 2 ? 'block' : 'none';
    stepPane3.style.display = step === 3 ? 'block' : 'none';

    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Step 1 to 2
  container.querySelector('#chk-goto-step-2')?.addEventListener('click', () => {
    const email = container.querySelector('#chk-email')?.value.trim();
    const name = container.querySelector('#chk-name')?.value.trim();
    const address = container.querySelector('#chk-address')?.value.trim();
    const city = container.querySelector('#chk-city')?.value.trim();

    if (!email || !name || !address || !city) {
      ui.showToast({
        title: 'Incomplete Address',
        message: 'Please complete all required contact and delivery fields.',
        type: 'warning'
      });
      return;
    }

    formData.email = email;
    formData.fullName = name;
    formData.address = address;
    formData.city = city;
    formData.state = container.querySelector('#chk-state')?.value || 'CA';
    formData.zip = container.querySelector('#chk-zip')?.value || '94107';
    formData.country = container.querySelector('#chk-country')?.value || 'United States';

    goToStep(2);
  });

  // Step 2 to 1 & 3
  container.querySelector('#chk-back-step-1')?.addEventListener('click', () => goToStep(1));
  container.querySelector('#chk-goto-step-3')?.addEventListener('click', () => goToStep(3));

  // Step 3 to 2
  container.querySelector('#chk-back-step-2')?.addEventListener('click', () => goToStep(2));

  // Back to Bag
  container.querySelector('#chk-back-to-bag')?.addEventListener('click', () => {
    ui.toggleDrawer('cart-drawer', true);
  });

  // Shipping Tiers
  container.querySelectorAll('.shipping-tier-card').forEach(card => {
    card.addEventListener('click', () => {
      sounds.playClick();
      container.querySelectorAll('.shipping-tier-card').forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      card.querySelector('input[type="radio"]').checked = true;
      formData.shippingMethod = card.dataset.method;
    });
  });

  // Interactive Card Realtime preview input bindings
  const cardNumberInput = container.querySelector('#input-card-number');
  const cardNameInput = container.querySelector('#input-card-name');
  const cardExpiryInput = container.querySelector('#input-card-expiry');

  const cardNumDisplay = container.querySelector('#preview-card-number');
  const cardNameDisplay = container.querySelector('#preview-card-name');
  const cardExpiryDisplay = container.querySelector('#preview-card-expiry');

  cardNumberInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = val;
    if (cardNumDisplay) cardNumDisplay.textContent = val || '•••• •••• •••• 4242';
  });

  cardNameInput?.addEventListener('input', (e) => {
    if (cardNameDisplay) cardNameDisplay.textContent = e.target.value.toUpperCase() || 'JULIAN VANCE';
  });

  cardExpiryInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    e.target.value = val;
    if (cardExpiryDisplay) cardExpiryDisplay.textContent = val || '08/29';
  });

  // Payment Tabs
  container.querySelectorAll('.pay-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sounds.playClick();
      container.querySelectorAll('.pay-tab-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      formData.paymentMethod = btn.dataset.method;
    });
  });

  // Promo Code in Checkout
  const promoInput = container.querySelector('#chk-promo-input');
  const promoBtn = container.querySelector('#chk-apply-promo-btn');
  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim();
      if (!code) return;
      const res = store.applyPromo(code);
      if (res.success) {
        ui.showToast({ title: 'Promo Activated', message: `${res.promo.description} discount applied!`, type: 'success' });
        renderCheckoutView(container);
      } else {
        ui.showToast({ title: 'Invalid Code', message: res.message, type: 'error' });
      }
    });
  }

  container.querySelector('#chk-remove-promo')?.addEventListener('click', () => {
    store.removePromo();
    renderCheckoutView(container);
  });

  // PLACE ORDER BUTTON
  const placeOrderBtn = container.querySelector('#chk-place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      // Show loading processing state
      sounds.playClick();
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `
        <span class="spinner-border"></span>
        <span>Securing Quantum Token & Placing Order...</span>
      `;

      setTimeout(() => {
        const order = store.createOrder({
          address: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country
          },
          shippingMethod: formData.shippingMethod,
          paymentMethod: formData.paymentMethod
        });

        sounds.playSuccess();
        renderOrderConfirmation(container, order);
      }, 1600);
    });
  }
}

/**
 * Order Confirmation & Real-Time Tracking Page
 */
export function renderOrderConfirmation(container, order) {
  const { currency } = store.state;

  container.innerHTML = `
    <div class="order-confirmation-wrapper animate-fade-in">
      <div class="container">
        
        <!-- Confirmation Hero Card -->
        <div class="confirmation-hero-card">
          <div class="confirmation-success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span class="confirmation-tag">VAULT ORDER CONFIRMED</span>
          <h1 class="confirmation-title">Thank You, ${order.shippingAddress.fullName}</h1>
          <p class="confirmation-sub">
            Your bespoke order has been registered in our Zurich Vault. An encrypted confirmation certificate has been sent to your email.
          </p>

          <div class="confirmation-id-box">
            <div class="order-id-label">ORDER REFERENCE</div>
            <div class="order-id-code">${order.orderId}</div>
            <div class="order-carrier-badge">Carrier: ${order.carrier} • Tracking: <strong>${order.trackingNumber}</strong></div>
          </div>
        </div>

        <!-- Real-Time Delivery Tracking Stepper -->
        <div class="tracking-stepper-card">
          <h3 class="tracking-card-title">Live Vault Dispatch Timeline</h3>
          
          <div class="tracking-timeline-bar">
            ${order.timeline.map((step, idx) => `
              <div class="timeline-step ${step.completed ? 'is-completed' : (idx === 1 ? 'is-current' : '')}">
                <div class="timeline-dot">
                  ${step.completed ? '✓' : idx + 1}
                </div>
                <div class="timeline-info">
                  <strong class="timeline-title">${step.step}</strong>
                  <span class="timeline-time">${step.time}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Order Items & Invoice Details -->
        <div class="confirmation-details-grid">
          
          <!-- Items Purchased -->
          <div class="confirmation-items-col">
            <div class="card-box">
              <h3>Items in Shipment</h3>
              <div class="confirm-items-list">
                ${order.items.map(item => `
                  <div class="confirm-item-row">
                    <img src="${item.heroImage}" alt="${item.name}" class="confirm-item-img" />
                    <div class="confirm-item-details">
                      <strong>${item.name}</strong>
                      <div class="confirm-variant-tag">${item.selectedColor || ''} • Qty: ${item.quantity}</div>
                    </div>
                    <div class="confirm-item-price">
                      ${convertPrice(item.price * item.quantity, currency).formatted}
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="confirm-pricing-summary">
                <div class="summary-line">
                  <span>Subtotal</span>
                  <span>${convertPrice(order.subtotal, currency).formatted}</span>
                </div>
                ${order.discount > 0 ? `
                  <div class="summary-line line-discount">
                    <span>VIP Promo Discount</span>
                    <span>-${convertPrice(order.discount, currency).formatted}</span>
                  </div>
                ` : ''}
                <div class="summary-line">
                  <span>Insured Shipping</span>
                  <span>${order.shipping === 0 ? '<strong class="text-green">COMPLIMENTARY</strong>' : convertPrice(order.shipping, currency).formatted}</span>
                </div>
                <div class="summary-line">
                  <span>Tax & Import Duty</span>
                  <span>${convertPrice(order.tax, currency).formatted}</span>
                </div>
                <div class="summary-line line-total">
                  <span>Grand Total</span>
                  <span class="total-number">${convertPrice(order.total, currency).formatted}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Destination & Invoice Generator -->
          <div class="confirmation-meta-col">
            
            <div class="card-box">
              <h3>Delivery Destination</h3>
              <div class="dest-address-block">
                <p><strong>${order.shippingAddress.fullName}</strong></p>
                <p>${order.shippingAddress.address}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
                <p>${order.shippingAddress.country}</p>
              </div>

              <div class="meta-divider"></div>

              <h3>Aura Loyalty Points Awarded</h3>
              <div class="loyalty-award-badge">
                <span class="award-icon">✦</span>
                <div>
                  <strong>+${Math.floor(order.total)} Aura Privilege Points</strong>
                  <span>Credited to your Platinum Concierge account.</span>
                </div>
              </div>
            </div>

            <!-- Actions: Print Invoice, Order History, Return to Store -->
            <div class="confirm-actions-box">
              <button class="btn btn-primary w-100" id="print-invoice-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Download Encrypted Invoice (PDF)
              </button>
              <button class="btn btn-secondary w-100" id="view-account-hub-btn">
                View in Account Hub
              </button>
              <button class="btn btn-ghost w-100" id="return-catalog-btn">
                Continue Exploring Collection
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  `;

  // Print Invoice simulation
  container.querySelector('#print-invoice-btn')?.addEventListener('click', () => {
    window.print();
  });

  // Account Hub
  container.querySelector('#view-account-hub-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('account');
  });

  // Return to Catalog
  container.querySelector('#return-catalog-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });
}
