/**
 * AURA LUXE - Product Specification Comparison Engine
 * Floating persistent compare bar + Side-by-side multi-item comparator modal.
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';

export function initCompareTray() {
  const tray = document.getElementById('compare-tray');
  if (!tray) return;

  renderCompareTray();

  store.subscribe('compare_updated', () => {
    renderCompareTray();
  });

  store.subscribe('currency_changed', () => {
    renderCompareTray();
  });
}

export function renderCompareTray() {
  const tray = document.getElementById('compare-tray');
  if (!tray) return;

  const { compareList, products, currency } = store.state;

  if (compareList.length === 0) {
    tray.classList.remove('is-active');
    return;
  }

  tray.classList.add('is-active');

  const items = compareList.map(id => products.find(p => p.id === id)).filter(Boolean);

  tray.innerHTML = `
    <div class="compare-tray-inner">
      <div class="compare-tray-info">
        <span class="compare-tray-title">Comparing <strong>${items.length}/4</strong> Items</span>
        <button class="compare-clear-btn" id="compare-clear-btn">Clear All</button>
      </div>

      <div class="compare-tray-thumbnails">
        ${items.map(item => `
          <div class="compare-thumb-pill">
            <img src="${item.heroImage}" alt="${item.name}" />
            <span class="thumb-name">${item.name}</span>
            <button class="compare-thumb-remove" data-id="${item.id}">&times;</button>
          </div>
        `).join('')}
      </div>

      <div class="compare-tray-actions">
        <button class="btn btn-primary btn-sm" id="compare-open-modal-btn">
          Compare Specifications
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  `;

  // Attach events
  tray.querySelector('#compare-clear-btn')?.addEventListener('click', () => {
    sounds.playClick();
    store.clearCompare();
  });

  tray.querySelectorAll('.compare-thumb-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playClick();
      store.toggleCompare(btn.dataset.id);
    });
  });

  tray.querySelector('#compare-open-modal-btn')?.addEventListener('click', () => {
    renderCompareModal();
    ui.openModal('compare-modal');
  });
}

export function renderCompareModal() {
  const modalContent = document.getElementById('compare-modal-content');
  if (!modalContent) return;

  const { compareList, products, currency } = store.state;
  const items = compareList.map(id => products.find(p => p.id === id)).filter(Boolean);

  if (items.length === 0) {
    modalContent.innerHTML = '<p class="text-center py-5">No products currently selected for comparison.</p>';
    return;
  }

  // Collect all unique spec keys
  const allSpecKeys = Array.from(new Set(
    items.flatMap(item => Object.keys(item.specs || {}))
  ));

  modalContent.innerHTML = `
    <div class="compare-table-wrapper">
      <div class="compare-table-header">
        <h2>Side-by-Side Model Comparison</h2>
        <p>Analyze technical architecture, acoustic profiles, and engineering specifications.</p>
      </div>

      <div class="compare-table-scroll">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="spec-col-header">Specification</th>
              ${items.map(item => `
                <th class="product-col-header">
                  <div class="comp-prod-top">
                    <img src="${item.heroImage}" alt="${item.name}" class="comp-prod-img" />
                    <strong class="comp-prod-title">${item.name}</strong>
                    <div class="comp-prod-price">${convertPrice(item.price, currency).formatted}</div>
                    <button class="btn btn-primary-sm mt-2 comp-add-btn" data-id="${item.id}">Add to Bag</button>
                  </div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="spec-label">Category</td>
              ${items.map(item => `<td>${item.category}</td>`).join('')}
            </tr>
            <tr>
              <td class="spec-label">Rating</td>
              ${items.map(item => `<td>★ ${item.rating.toFixed(2)} (${item.reviewsCount} reviews)</td>`).join('')}
            </tr>
            <tr>
              <td class="spec-label">Stock Status</td>
              ${items.map(item => `<td><span class="text-green">✓ ${item.stock} in Zurich Vault</span></td>`).join('')}
            </tr>
            ${allSpecKeys.map(key => `
              <tr>
                <td class="spec-label">${key}</td>
                ${items.map(item => `
                  <td>${item.specs && item.specs[key] ? item.specs[key] : '—'}</td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  modalContent.querySelectorAll('.comp-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prod = products.find(p => p.id === btn.dataset.id);
      if (prod) {
        store.addToCart(prod);
        ui.closeModal('compare-modal');
        ui.showToast({
          title: 'Added to Bag',
          message: `${prod.name} added to your bag.`,
          type: 'success',
          actionText: 'View Bag',
          onAction: () => ui.toggleDrawer('cart-drawer', true)
        });
      }
    });
  });
}
