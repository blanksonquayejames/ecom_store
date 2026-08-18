/**
 * AURA LUXE - AI Shopping Stylist & Concierge
 * Interactive AI assistant matching client requirements with curated catalog items.
 */

import { store } from './state.js';
import { convertPrice } from './currency.js';
import { ui } from './ui.js';
import { sounds } from './audio.js';

export function initAIStylist() {
  const modal = document.getElementById('ai-stylist-modal');
  const triggerBtn = document.getElementById('floating-ai-stylist-btn');
  const closeBtn = document.getElementById('ai-stylist-close-btn');

  if (!modal) return;

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      sounds.playClick();
      ui.openModal('ai-stylist-modal');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      ui.closeModal('ai-stylist-modal');
    });
  }

  setupChatInteractions();
}

function setupChatInteractions() {
  const messagesBox = document.getElementById('ai-chat-messages');
  const chatInput = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const chips = document.querySelectorAll('.ai-prompt-chip');

  if (!messagesBox || !chatInput) return;

  // Prompt chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.textContent.trim();
      handleUserMessage(prompt);
    });
  });

  // Send button
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const text = chatInput.value.trim();
      if (text) {
        handleUserMessage(text);
        chatInput.value = '';
      }
    });
  }

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = chatInput.value.trim();
      if (text) {
        handleUserMessage(text);
        chatInput.value = '';
      }
    }
  });

  function handleUserMessage(userText) {
    sounds.playClick();

    // Render user message
    const userMsgEl = document.createElement('div');
    userMsgEl.className = 'chat-bubble chat-user animate-slide-up';
    userMsgEl.innerHTML = `<div class="bubble-content">${escapeHtml(userText)}</div>`;
    messagesBox.appendChild(userMsgEl);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-bubble chat-ai typing-indicator-bubble';
    typingEl.innerHTML = `
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    messagesBox.appendChild(typingEl);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Generate intelligent AI response
    setTimeout(() => {
      if (typingEl.parentElement) {
        typingEl.parentElement.removeChild(typingEl);
      }
      const response = generateAIResponse(userText);
      renderAIMessage(response);
    }, 700);
  }

  function renderAIMessage({ text, recommendations = [] }) {
    sounds.playPop();
    const { currency } = store.state;
    const aiMsgEl = document.createElement('div');
    aiMsgEl.className = 'chat-bubble chat-ai animate-slide-up';

    let cardsHtml = '';
    if (recommendations.length > 0) {
      cardsHtml = `
        <div class="ai-recommendations-grid">
          ${recommendations.map(prod => `
            <div class="ai-rec-card">
              <img src="${prod.heroImage}" alt="${prod.name}" />
              <div class="ai-rec-info">
                <strong>${prod.name}</strong>
                <div class="ai-rec-price">${convertPrice(prod.price, currency).formatted}</div>
                <div class="ai-rec-actions">
                  <button class="btn btn-primary-sm ai-rec-add" data-id="${prod.id}">Add to Bag</button>
                  <button class="btn btn-ghost btn-sm ai-rec-view" data-id="${prod.id}">View</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    aiMsgEl.innerHTML = `
      <div class="ai-avatar-badge">✦ AURA CONCIERGE</div>
      <div class="bubble-content">${text}</div>
      ${cardsHtml}
    `;

    messagesBox.appendChild(aiMsgEl);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Rec card actions
    aiMsgEl.querySelectorAll('.ai-rec-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = store.state.products.find(p => p.id === btn.dataset.id);
        if (prod) {
          store.addToCart(prod);
          ui.showToast({
            title: 'Added to Bag',
            message: `${prod.name} added.`,
            type: 'success',
            actionText: 'View Bag',
            onAction: () => ui.toggleDrawer('cart-drawer', true)
          });
        }
      });
    });

    aiMsgEl.querySelectorAll('.ai-rec-view').forEach(btn => {
      btn.addEventListener('click', () => {
        ui.closeModal('ai-stylist-modal');
        store.setView('pdp', btn.dataset.id);
      });
    });
  }
}

function generateAIResponse(query) {
  const q = query.toLowerCase();
  const prods = store.state.products;

  if (q.includes('gift') || q.includes('under') || q.includes('budget') || q.includes('300') || q.includes('500')) {
    const recs = prods.filter(p => p.price <= 500).slice(0, 2);
    return {
      text: "I have curated these exceptional mastercraft pieces under $500. They make unforgettable gifts with bespoke luxury packaging included:",
      recommendations: recs
    };
  }

  if (q.includes('audio') || q.includes('sound') || q.includes('headphone') || q.includes('acoustic') || q.includes('music')) {
    const recs = prods.filter(p => p.category === 'Audio & Sound').slice(0, 2);
    return {
      text: "For true audiophile fidelity, I recommend our reference-grade planar magnetic headphones paired with the quantum DAC hub:",
      recommendations: recs
    };
  }

  if (q.includes('desk') || q.includes('workspace') || q.includes('keyboard') || q.includes('setup') || q.includes('living')) {
    const recs = prods.filter(p => p.category === 'Smart Living').slice(0, 2);
    return {
      text: "Here is the ultimate minimalist executive desk synergy, combining solid brass acoustic mechanical typing with Tuscan leather MagSafe fast charging:",
      recommendations: recs
    };
  }

  if (q.includes('spatial') || q.includes('glass') || q.includes('vision') || q.includes('vr') || q.includes('ar') || q.includes('tech')) {
    const recs = [prods.find(p => p.id === 'prod-001'), prods.find(p => p.id === 'prod-003')].filter(Boolean);
    return {
      text: "Our flagship spatial optics deliver dual 8K micro-OLED immersion in an aerospace titanium frame. Here are our premier cybernetic wearables:",
      recommendations: recs
    };
  }

  // General recommendation
  const recs = prods.filter(p => p.featured || p.isBestSeller).slice(0, 2);
  return {
    text: `Based on your interest in "${query}", I recommend our most acclaimed flagship selections handcrafted with uncompromising materials:`,
    recommendations: recs
  };
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
