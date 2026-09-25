/**
 * AURA LUXE - Multi-Step Checkout & Order Confirmation
 * 3-Step frictionless flow, 3D interactive card preview, instant order tracking, and invoice generator.
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';
import { showOrderReceiptModal } from './account-view.js';
import { openAuthModal } from './auth-modal.js';

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

  const isLoggedIn = Boolean(user && user.isLoggedIn);
  if (!isLoggedIn) {
    renderCheckoutAuthGate(container, cart, currency);
    return;
  }

  let currentStep = 1;
  const summary = store.getCartSummary();

  const defaultAddr = (user.addresses && user.addresses.find(a => a.isDefault)) || (user.addresses && user.addresses[0]) || null;

  const formData = {
    email: user.email || 'julian.vance@7thjune.com',
    fullName: user.name || 'Julian Vance',
    phone: defaultAddr?.phone || user.phone || '+233 24 555 7788',
    address: defaultAddr ? defaultAddr.address : '7th June Tech Tower, Suite 400',
    city: defaultAddr ? defaultAddr.city : 'Accra',
    state: defaultAddr ? (defaultAddr.region || defaultAddr.state || 'Greater Accra') : 'Greater Accra',
    zip: defaultAddr ? (defaultAddr.zip || '00233') : '00233',
    country: defaultAddr ? defaultAddr.country : 'Ghana',
    shippingMethod: 'FedEx White Glove Priority Courier',
    paymentMethod: 'Mobile Money',
    momoNetwork: 'MTN MoMo',
    momoPhone: defaultAddr?.phone || user.phone || '024 555 7788',
    momoAccountName: user.name || 'Kwame Blankson'
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

        <!-- Mobile Expandable Order Summary Accordion Bar (Visible on mobile <= 992px) -->
        <div class="checkout-mobile-summary-bar" id="chk-mobile-summary-toggle">
          <div class="mobile-summary-left">
            <span class="mobile-summary-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </span>
            <span class="mobile-summary-text">
              <span id="mobile-summary-label">Show order summary</span>
              <svg class="summary-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </div>
          <span class="mobile-summary-total">${convertPrice(summary.total, currency).formatted}</span>
        </div>

        <div class="checkout-mobile-summary-drawer" id="chk-mobile-summary-drawer" style="display: none;">
          <div class="chk-items-preview">
            ${cart.map(item => `
              <div class="chk-item-row">
                <div class="chk-item-thumb">
                  <img src="${item.heroImage}" alt="${item.name}" />
                  <span class="chk-item-qty-badge">${item.quantity}</span>
                </div>
                <div class="chk-item-details">
                  <strong class="chk-name">${item.name}</strong>
                  <span class="chk-variant">${item.selectedColor && item.selectedColor !== 'Default' ? item.selectedColor : ''} ${item.selectedOption ? `• ${item.selectedOption}` : ''}</span>
                </div>
                <div class="chk-item-price">
                  ${convertPrice(item.price * item.quantity, currency).formatted}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="summary-divider"></div>

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
        </div>

        <!-- 2-Column Grid: Steps Left + Sticky Order Summary Right -->
        <div class="checkout-grid">
          
          <!-- Steps Left Panel -->
          <div class="checkout-steps-panel">
            
            <!-- STEP 1: Shipping & Contact -->
            <div class="checkout-step-content is-active" id="chk-step-1">
              <div class="step-header">
                <h3>Contact & Insured Delivery Address</h3>
              </div>

              ${user.addresses && user.addresses.length > 0 ? `
                <div class="chk-saved-addresses-box mb-4">
                  <div class="chk-saved-addr-label">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>Saved Delivery Addresses (${user.name}):</span>
                  </div>
                  <div class="chk-saved-addr-chips">
                    ${user.addresses.map((a, i) => `
                      <button type="button" class="chk-addr-chip ${a.isDefault ? 'is-active' : ''}" data-addr-id="${a.id}">
                        <span class="chk-chip-title">${a.type || 'Destination ' + (i+1)}</span>
                        <span class="chk-chip-detail">${a.address}, ${a.city}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

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
                    <label>Phone Number</label>
                    <input type="tel" class="custom-input" id="chk-phone" value="${formData.phone}" placeholder="+233 24 555 7788" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Street Address & Suite / Penthouse</label>
                  <input type="text" class="custom-input" id="chk-address" value="${formData.address}" placeholder="123 Luxury Blvd, Suite 800" required />
                </div>

                <div class="form-row">
                  <div class="form-group flex-2">
                    <label>City</label>
                    <input type="text" class="custom-input" id="chk-city" value="${formData.city}" placeholder="Accra" required />
                  </div>
                  <div class="form-group flex-1">
                    <label>State / Region</label>
                    <input type="text" class="custom-input" id="chk-state" value="${formData.state}" placeholder="Greater Accra" required />
                  </div>
                  <div class="form-group flex-1">
                    <label>Postal Code</label>
                    <input type="text" class="custom-input" id="chk-zip" value="${formData.zip}" placeholder="00233" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Country / Territory</label>
                  <select class="custom-select" id="chk-country">
                    <option value="Ghana" ${formData.country === 'Ghana' ? 'selected' : ''}>Ghana</option>
                    <option value="United States" ${formData.country === 'United States' ? 'selected' : ''}>United States</option>
                    <option value="United Kingdom" ${formData.country === 'United Kingdom' ? 'selected' : ''}>United Kingdom</option>
                    <option value="Germany" ${formData.country === 'Germany' ? 'selected' : ''}>Germany</option>
                    <option value="Switzerland" ${formData.country === 'Switzerland' ? 'selected' : ''}>Switzerland</option>
                    <option value="Japan" ${formData.country === 'Japan' ? 'selected' : ''}>Japan</option>
                    <option value="Canada" ${formData.country === 'Canada' ? 'selected' : ''}>Canada</option>
                    <option value="Australia" ${formData.country === 'Australia' ? 'selected' : ''}>Australia</option>
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

            <!-- STEP 3: Payment (Mobile Money Gateway Only) -->
            <div class="checkout-step-content" id="chk-step-3" style="display: none;">
              <div class="step-header">
                <div class="momo-exclusive-pill">
                  <span class="momo-live-dot"></span>
                  <span>GHANA MOBILE MONEY (MOMO) GATEWAY</span>
                </div>
                <h3>Secure Mobile Money Authorization</h3>
                <p>Fast, encrypted mobile payment directly from your smartphone wallet. Select your network below.</p>
              </div>

              <!-- Dedicated Mobile Money (MoMo) Panel -->
              <div class="payment-method-panel is-active" id="panel-momo">
                <div class="momo-form-card">
                  <div class="momo-network-select-group">
                    <label>Select Mobile Money Network</label>
                    <div class="momo-network-pills">
                      <label class="momo-network-pill is-selected">
                        <input type="radio" name="momo-network" value="MTN MoMo" checked />
                        <span class="momo-pill-logo">🟡 MTN</span>
                        <span class="momo-pill-title">MTN Mobile Money</span>
                      </label>
                      <label class="momo-network-pill">
                        <input type="radio" name="momo-network" value="Telecel Cash" />
                        <span class="momo-pill-logo">🔴 Telecel</span>
                        <span class="momo-pill-title">Telecel Cash</span>
                      </label>
                      <label class="momo-network-pill">
                        <input type="radio" name="momo-network" value="AT Money" />
                        <span class="momo-pill-logo">🔵 AT</span>
                        <span class="momo-pill-title">AT Money</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-group mt-3">
                    <label>Mobile Money Phone Number (Ghana)</label>
                    <div class="phone-input-wrap">
                      <span class="phone-prefix">🇬🇭 +233</span>
                      <input type="tel" class="custom-input" id="input-momo-phone" placeholder="024 123 4567" value="${formData.momoPhone || '024 555 7788'}" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Registered Account Name</label>
                    <input type="text" class="custom-input" id="input-momo-name" placeholder="Kwame Blankson" value="${formData.momoAccountName || formData.fullName || 'Kwame Blankson'}" />
                  </div>

                  <div class="momo-instructions-box">
                    <div class="momo-instruct-icon">📲</div>
                    <div class="momo-instruct-text">
                      <strong>Instant Push USSD Authorization</strong>
                      <p>When you click Authorize, a secure prompt is sent instantly to your phone. Enter your 4-digit MoMo PIN to verify and complete the payment.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="step-actions">
                <button class="btn btn-ghost" id="chk-back-step-2">Back to Delivery</button>
                <button class="btn btn-primary btn-lg flex-1" id="chk-place-order-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>Authorize MoMo Payment (${convertPrice(summary.total, currency).formatted})</span>
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
                      <span class="chk-variant">${item.selectedColor && item.selectedColor !== 'Default' ? item.selectedColor : ''} ${item.selectedOption ? `• ${item.selectedOption}` : ''}</span>
                    </div>
                    <div class="chk-item-price">
                      ${convertPrice(item.price * item.quantity, currency).formatted}
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Cost breakdown -->
              <div class="chk-cost-breakdown">
                <div class="chk-cost-row">
                  <span>Subtotal</span>
                  <span>${convertPrice(summary.subtotal, currency).formatted}</span>
                </div>
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

  // Address Chips Selection
  container.querySelectorAll('.chk-addr-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      sounds.playClick();
      const addrId = chip.dataset.addrId;
      const addr = (store.state.user?.addresses || []).find(a => a.id === addrId);
      if (!addr) return;

      container.querySelectorAll('.chk-addr-chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const nameInput = container.querySelector('#chk-name');
      const phoneInput = container.querySelector('#chk-phone');
      const addrInput = container.querySelector('#chk-address');
      const cityInput = container.querySelector('#chk-city');
      const stateInput = container.querySelector('#chk-state');
      const zipInput = container.querySelector('#chk-zip');
      const countrySelect = container.querySelector('#chk-country');

      if (nameInput) nameInput.value = addr.fullName || store.state.user?.name || '';
      if (phoneInput) phoneInput.value = addr.phone || store.state.user?.phone || '';
      if (addrInput) addrInput.value = addr.address || '';
      if (cityInput) cityInput.value = addr.city || '';
      if (stateInput) stateInput.value = addr.region || addr.state || '';
      if (zipInput) zipInput.value = addr.zip || '00233';
      if (countrySelect && addr.country) countrySelect.value = addr.country;
    });
  });

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
    formData.phone = container.querySelector('#chk-phone')?.value.trim() || formData.phone;
    formData.address = address;
    formData.city = city;
    formData.state = container.querySelector('#chk-state')?.value || 'Greater Accra';
    formData.zip = container.querySelector('#chk-zip')?.value || '00233';
    formData.country = container.querySelector('#chk-country')?.value || 'Ghana';

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

  // Mobile Order Summary Accordion Toggle
  const mobileSummaryToggle = container.querySelector('#chk-mobile-summary-toggle');
  const mobileSummaryDrawer = container.querySelector('#chk-mobile-summary-drawer');
  const mobileSummaryLabel = container.querySelector('#mobile-summary-label');
  if (mobileSummaryToggle && mobileSummaryDrawer) {
    mobileSummaryToggle.addEventListener('click', () => {
      sounds.playClick();
      const isCurrentlyOpen = mobileSummaryDrawer.style.display !== 'none';
      mobileSummaryDrawer.style.display = isCurrentlyOpen ? 'none' : 'block';
      mobileSummaryToggle.classList.toggle('is-open', !isCurrentlyOpen);
      if (mobileSummaryLabel) {
        mobileSummaryLabel.textContent = isCurrentlyOpen ? 'Show order summary' : 'Hide order summary';
      }
    });
  }

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


  // Mobile Money Network Pills
  container.querySelectorAll('.momo-network-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      sounds.playClick();
      container.querySelectorAll('.momo-network-pill').forEach(p => p.classList.remove('is-selected'));
      pill.classList.add('is-selected');
      const radio = pill.querySelector('input[name="momo-network"]');
      if (radio) {
        radio.checked = true;
        formData.momoNetwork = radio.value;
      }
    });
  });

  // PLACE ORDER BUTTON (MoMo Gateway)
  const placeOrderBtn = container.querySelector('#chk-place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      sounds.playClick();

      const selectedNetworkRadio = container.querySelector('input[name="momo-network"]:checked');
      const selectedNetwork = selectedNetworkRadio ? selectedNetworkRadio.value : (formData.momoNetwork || 'MTN MoMo');
      const phoneInput = container.querySelector('#input-momo-phone');
      const momoPhone = phoneInput ? phoneInput.value.trim() : (formData.momoPhone || '024 555 7788');
      const nameInput = container.querySelector('#input-momo-name');
      const momoName = nameInput ? nameInput.value.trim() : (formData.momoAccountName || formData.fullName || 'Kwame Blankson');

      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `
        <span class="spinner-border"></span>
        <span>Sending ${selectedNetwork} USSD prompt to +233 ${momoPhone}...</span>
      `;

      setTimeout(() => {
        const order = store.createOrder({
          address: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            phone: `+233 ${momoPhone}`
          },
          shippingMethod: formData.shippingMethod,
          paymentMethod: `Mobile Money (${selectedNetwork})`,
          momoNetwork: selectedNetwork,
          momoPhone: momoPhone,
          momoAccountName: momoName
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
                      <div class="confirm-variant-tag">${item.selectedColor && item.selectedColor !== 'Default' ? `${item.selectedColor} • ` : ''}Qty: ${item.quantity}</div>
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
                    <span>Promo Discount</span>
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
                ${order.shippingAddress.phone ? `<p class="dest-phone">Phone: ${order.shippingAddress.phone}</p>` : ''}
              </div>

              <div class="meta-divider"></div>

              <h3>Payment Method</h3>
              <div class="momo-confirmation-tag">
                <span class="momo-tag-icon">📲</span>
                <div class="momo-tag-details">
                  <strong>${order.paymentMethod || 'Mobile Money (MTN MoMo)'}</strong>
                  <span class="momo-status-tag">Status: <strong>PAID & VERIFIED</strong></span>
                  ${order.momoTransactionId ? `<small class="momo-ref-tag">MoMo Ref: ${order.momoTransactionId}</small>` : ''}
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

  // View & Print Digital Receipt
  container.querySelector('#print-invoice-btn')?.addEventListener('click', () => {
    sounds.playClick();
    showOrderReceiptModal(order);
  });

  // Account Hub
  container.querySelector('#view-account-hub-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('account', null, { tab: 'orders' });
  });

  // Return to Catalog
  container.querySelector('#return-catalog-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });
}

/**
  * Checkout Authentication Gate for Unauthenticated Shoppers
  */
function renderCheckoutAuthGate(container, cart, currency) {
  const summary = store.getCartSummary();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  container.innerHTML = `
    <div class="checkout-auth-gate-wrapper animate-fade-in">
      <div class="container" style="max-width: 660px; margin: 2.5rem auto; padding: 0 1.25rem;">
        
        <div class="mb-3">
          <button class="btn btn-ghost btn-sm" id="chk-gate-back-btn">
            &larr; Return to Storefront Collection
          </button>
        </div>

        <div class="checkout-auth-card">
          <div class="auth-gate-icon-badge">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          
          <span class="auth-gate-kicker">7TH JUNE COMPUTERS • CLIENT IDENTITY & DISPATCH</span>
          <h2 class="auth-gate-title">Sign In or Register to Checkout</h2>
          <p class="auth-gate-sub">
            To protect high-value hardware purchases, provide end-to-end white glove delivery tracking, and apply exclusive VIP rewards, please sign in or create an account to proceed.
          </p>

          <!-- Order Summary Card -->
          <div class="chk-auth-cart-snippet">
            <div class="snippet-info">
              <span class="snippet-count"><strong>${totalItems}</strong> item${totalItems > 1 ? 's' : ''} reserved in your bag</span>
              <span class="snippet-note">Tamper-proof insured packaging included</span>
            </div>
            <div class="snippet-total">
              ${convertPrice(summary.total, currency).formatted}
            </div>
          </div>

          <!-- Primary Actions -->
          <div class="auth-gate-actions">
            <button class="btn btn-primary btn-lg w-100" id="chk-gate-signin-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Sign In to Your Account
            </button>
            <button class="btn btn-secondary btn-lg w-100" id="chk-gate-register-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Create VIP Account (+500 Pts)
            </button>
          </div>

          <!-- VIP Quick Demo Sign In -->
          <div class="auth-demo-divider mt-4">
            <span>OR 1-CLICK INSTANT ACCESS</span>
          </div>
          <div class="auth-demo-buttons">
            <button type="button" class="btn btn-outline btn-sm w-100" id="chk-gate-demo-julian">
              👑 Instant Sign In as Julian Vance (VIP Member)
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach Events
  container.querySelector('#chk-gate-back-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.setView('catalog');
  });

  container.querySelector('#chk-gate-signin-btn')?.addEventListener('click', () => {
    sounds.playClick();
    openAuthModal('login', {
      redirectTo: 'checkout',
      notice: '<strong>Sign In Required:</strong> Please sign in to complete your purchase.'
    });
  });

  container.querySelector('#chk-gate-register-btn')?.addEventListener('click', () => {
    sounds.playClick();
    openAuthModal('register', {
      redirectTo: 'checkout',
      notice: '<strong>Registration:</strong> Create your 7th June account to complete your purchase.'
    });
  });

  container.querySelector('#chk-gate-demo-julian')?.addEventListener('click', () => {
    sounds.playSuccess();
    const user = {
      isLoggedIn: true,
      role: 'customer',
      name: 'Julian Vance',
      email: 'julian.vance@7thjune.com',
      phone: '+233 24 555 7788',
      tier: 'Platinum Titan VIP',
      points: 3450,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      addresses: [
        {
          id: 'addr-1',
          type: 'Primary Office (Ghana)',
          fullName: 'Julian Vance',
          address: '7th June Tech Tower, Suite 400',
          city: 'Accra',
          region: 'Airport Residential Area',
          country: 'Ghana',
          phone: '+233 24 555 7788',
          isDefault: true
        },
        {
          id: 'addr-2',
          type: 'Secondary Dispatch (USA)',
          fullName: 'Julian Vance',
          address: '742 Evergreen Terrace, Suite 800',
          city: 'San Francisco',
          region: 'CA 94107',
          country: 'United States',
          phone: '+1 (415) 890-4321',
          isDefault: false
        }
      ]
    };
    store.setUser(user);
    ui.showToast({
      title: 'Welcome back, Julian!',
      message: 'Signed in as Julian Vance. Saved delivery addresses loaded.',
      type: 'success'
    });
    renderCheckoutView(container);
  });
}
