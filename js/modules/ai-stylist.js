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

  if (q.includes('gift') || q.includes('under') || q.includes('budget') || q.includes('100') || q.includes('150')) {
    const recs = prods.filter(p => p.price <= 150).slice(0, 2);
    return {
      text: "Here are top-tier high-performance computer accessories under $150, delivering unbeatable value and build quality for any battle station or office desk:",
      recommendations: recs
    };
  }

  if (q.includes('keyboard') || q.includes('switch') || q.includes('keycap') || q.includes('type') || q.includes('mechanical')) {
    const recs = prods.filter(p => p.category === 'Keyboards & Keycaps').slice(0, 2);
    return {
      text: "For ultimate typing acoustics and competitive gaming speed, I recommend our Hall-Effect magnetic Rapid Trigger keyboards and ultra-thick PBT keycaps:",
      recommendations: recs
    };
  }

  if (q.includes('mouse') || q.includes('mice') || q.includes('aim') || q.includes('fps') || q.includes('sensor')) {
    const recs = prods.filter(p => p.category === 'Mice & Precision').slice(0, 2);
    return {
      text: "For pixel-precise tracking and competitive aiming, check out our 49g magnesium alloy 8K wireless mouse and ergonomic precision mice:",
      recommendations: recs
    };
  }

  if (q.includes('audio') || q.includes('sound') || q.includes('headset') || q.includes('mic') || q.includes('microphone')) {
    const recs = prods.filter(p => p.category === 'Audio & Headsets').slice(0, 2);
    return {
      text: "For pinpoint spatial audio and broadcast-grade streaming clarity, here are our flagship planar magnetic gaming headsets and USB-C condenser studio mics:",
      recommendations: recs
    };
  }

  if (q.includes('monitor') || q.includes('mount') || q.includes('arm') || q.includes('screen') || q.includes('light')) {
    const recs = prods.filter(p => p.category === 'Monitors & Mounts').slice(0, 2);
    return {
      text: "To elevate your display ergonomics and eliminate desk clutter, these heavy-duty gas spring dual monitor arms and glare-free monitor lightbars are perfect:",
      recommendations: recs
    };
  }

  if (q.includes('desk') || q.includes('mat') || q.includes('dock') || q.includes('hub') || q.includes('setup') || q.includes('stream')) {
    const recs = [prods.find(p => p.id === 'prod-005'), prods.find(p => p.id === 'prod-006')].filter(Boolean);
    return {
      text: "Here is the ultimate workstation desk foundation, combining our 16-in-1 Thunderbolt 4 docking station with military-grade Cordura desk pads:",
      recommendations: recs
    };
  }

  // General recommendation
  const recs = prods.filter(p => p.featured || p.isBestSeller).slice(0, 2);
  return {
    text: `Based on your request for "${query}", here are our highest-rated flagship computer accessories engineered for maximum precision and performance:`,
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
