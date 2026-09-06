/**
 * AURA LUXE - Central Reactive State Store
 * Handles persistent state for cart, wishlist, comparison, orders, currency, and theme.
 */

import { PRODUCTS, PROMO_CODES } from '../data/products.js';

class Store {
  constructor() {
    this.subscribers = new Map();
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    const savedCart = localStorage.getItem('aura_cart');
    const savedWishlist = localStorage.getItem('aura_wishlist');
    const savedCompare = localStorage.getItem('aura_compare');
    const savedCurrency = localStorage.getItem('aura_currency');
    const savedTheme = localStorage.getItem('aura_theme');
    const savedOrders = localStorage.getItem('aura_orders');
    const savedPromo = localStorage.getItem('aura_promo');
    const savedSearches = localStorage.getItem('aura_searches');
    const savedUser = localStorage.getItem('aura_user');
    const savedProducts = localStorage.getItem('aura_products');
    const savedPromoCodes = localStorage.getItem('aura_promo_codes');
    const savedAdminSession = localStorage.getItem('aura_admin_session');

    return {
      products: savedProducts ? JSON.parse(savedProducts) : PRODUCTS.map(p => ({
        ...p,
        stockCount: p.stockCount !== undefined ? p.stockCount : (p.stock !== undefined ? p.stock : 15),
        stock: p.stock !== undefined ? p.stock : (p.stockCount !== undefined ? p.stockCount : 15),
        inStock: p.inStock !== undefined ? p.inStock : ((p.stockCount ?? p.stock ?? 15) > 0)
      })),
      promoCodes: savedPromoCodes ? JSON.parse(savedPromoCodes) : PROMO_CODES,
      adminSession: savedAdminSession ? JSON.parse(savedAdminSession) : {
        isLoggedIn: false,
        name: 'Kwame Blankson',
        role: 'Chief Technology Officer & Administrator',
        email: 'admin@7thjune.com'
      },
      cart: savedCart ? JSON.parse(savedCart) : [
        {
          id: 'cart-init-1',
          productId: 'prod-001',
          name: 'ApexPro V3 Magnetic Hall-Effect Keyboard',
          price: 229,
          originalPrice: 269,
          heroImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85',
          selectedColor: 'Obsidian Black',
          selectedOption: '75% Compact Layout',
          quantity: 1
        }
      ],
      wishlist: savedWishlist ? JSON.parse(savedWishlist) : ['prod-002', 'prod-003'],
      compareList: savedCompare ? JSON.parse(savedCompare) : [],
      currency: (savedCurrency === 'GHS' || savedCurrency === 'USD') ? savedCurrency : 'GHS',
      theme: savedTheme || 'light',
      appliedPromo: savedPromo ? JSON.parse(savedPromo) : null,
      recentSearches: savedSearches ? JSON.parse(savedSearches) : ['hall effect keyboard', '8k mouse', 'monitor arm', 'desk mat'],
      orders: savedOrders ? JSON.parse(savedOrders) : [
        {
          orderId: '7TH-892419',
          date: 'Aug 18, 2026',
          status: 'In Transit',
          carrier: 'FedEx Express Courier',
          trackingNumber: 'FX-84920412A',
          items: [
            {
              name: 'ViperStrike Ultra 8K Wireless Gaming Mouse',
              selectedColor: 'Matte Stealth Black',
              selectedOption: 'Standard 8K Receiver Edition',
              quantity: 1,
              price: 149,
              heroImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=85'
            }
          ],
          subtotal: 149,
          discount: 0,
          shipping: 0,
          tax: 11.92,
          total: 160.92,
          shippingAddress: {
            fullName: 'Julian Vance',
            address: '742 Evergreen Terrace, Suite 400',
            city: 'San Francisco',
            state: 'CA',
            zip: '94107',
            country: 'United States',
            phone: '+233 24 555 7788'
          },
          paymentMethod: 'Mobile Money (MTN MoMo)',
          momoNetwork: 'MTN MoMo',
          momoPhone: '024 555 7788',
          momoTransactionId: 'MM-TX-984210',
          timeline: [
            { step: 'Order Placed', time: 'Aug 14, 10:30 AM', completed: true },
            { step: 'Handcrafted Assembly & QA', time: 'Aug 14, 04:15 PM', completed: true },
            { step: 'Dispatched from Zurich Vault', time: 'Aug 15, 08:00 AM', completed: true },
            { step: 'Out for Priority Delivery', time: 'In Progress (Estimated Today)', completed: false }
          ]
        }
      ],
      user: savedUser ? JSON.parse(savedUser) : {
        isLoggedIn: true,
        name: 'Julian Vance',
        email: 'julian.vance@7thjune.com',
        tier: '7th June Platinum VIP',
        points: 2450,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      },
      filters: {
        category: 'All Products',
        query: '',
        maxPrice: 5000,
        minRating: 0,
        inStockOnly: false,
        onSaleOnly: false,
        sortBy: 'featured',
        viewMode: 'grid' // 'grid' | 'list'
      },
      currentView: {
        page: 'catalog', // 'catalog' | 'pdp' | 'cart' | 'checkout' | 'account' | 'compare'
        productId: null
      },
      quickViewProductId: null
    };
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
    return () => this.subscribers.get(event).delete(callback);
  }

  notify(event, payload) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => cb(payload, this.state));
    }
    if (this.subscribers.has('*')) {
      this.subscribers.get('*').forEach(cb => cb({ event, payload }, this.state));
    }
  }

  // --- Cart Actions ---
  addToCart(product, selectedColor = null, selectedOption = null, quantity = 1) {
    const color = selectedColor || (product.colors && product.colors[0] ? product.colors[0].name : 'Default');
    const option = selectedOption || (product.storageOptions && product.storageOptions[0] ? product.storageOptions[0] : 'Standard');
    const heroImg = (product.colors && product.colors.find(c => c.name === color))?.img || product.heroImage;

    const existingIndex = this.state.cart.findIndex(
      item => item.productId === product.id && item.selectedColor === color && item.selectedOption === option
    );

    if (existingIndex > -1) {
      this.state.cart[existingIndex].quantity += quantity;
    } else {
      this.state.cart.push({
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        heroImage: heroImg,
        selectedColor: color,
        selectedOption: option,
        quantity
      });
    }

    this.saveCart();
    this.notify('cart_updated', this.state.cart);
    return true;
  }

  updateCartQuantity(cartItemId, quantity) {
    const item = this.state.cart.find(i => i.id === cartItemId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(cartItemId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.notify('cart_updated', this.state.cart);
      }
    }
  }

  removeFromCart(cartItemId) {
    const removedItem = this.state.cart.find(i => i.id === cartItemId);
    this.state.cart = this.state.cart.filter(i => i.id !== cartItemId);
    this.saveCart();
    this.notify('cart_updated', this.state.cart);
    return removedItem;
  }

  clearCart() {
    this.state.cart = [];
    this.saveCart();
    this.notify('cart_updated', this.state.cart);
  }

  saveCart() {
    localStorage.setItem('aura_cart', JSON.stringify(this.state.cart));
  }

  getCartSubtotal() {
    return this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getCartCount() {
    return this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartSummary() {
    const subtotal = this.getCartSubtotal();
    let discount = 0;
    let freeShipping = subtotal >= 500;

    if (this.state.appliedPromo) {
      if (this.state.appliedPromo.discountPercent) {
        discount = (subtotal * this.state.appliedPromo.discountPercent) / 100;
      }
      if (this.state.appliedPromo.freeShipping) {
        freeShipping = true;
      }
    }

    const shipping = (subtotal > 0 && !freeShipping) ? 45 : 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.08; // 8% estimated tax
    const total = taxableAmount + shipping + tax;

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      freeShippingThreshold: 500,
      freeShippingProgress: Math.min(100, (subtotal / 500) * 100),
      amountNeededForFreeShipping: Math.max(0, 500 - subtotal)
    };
  }

  // --- Promo Code Actions ---
  applyPromo(code) {
    const cleanCode = code.trim().toUpperCase();
    const codes = this.state.promoCodes || PROMO_CODES;
    if (codes[cleanCode]) {
      this.state.appliedPromo = { code: cleanCode, ...codes[cleanCode] };
      localStorage.setItem('aura_promo', JSON.stringify(this.state.appliedPromo));
      this.notify('promo_applied', this.state.appliedPromo);
      return { success: true, promo: this.state.appliedPromo };
    }
    return { success: false, message: 'Invalid promo code.' };
  }

  removePromo() {
    this.state.appliedPromo = null;
    localStorage.removeItem('aura_promo');
    this.notify('promo_applied', null);
  }

  // --- Wishlist Actions ---
  toggleWishlist(productId) {
    const idx = this.state.wishlist.indexOf(productId);
    let added = false;
    if (idx > -1) {
      this.state.wishlist.splice(idx, 1);
    } else {
      this.state.wishlist.push(productId);
      added = true;
    }
    localStorage.setItem('aura_wishlist', JSON.stringify(this.state.wishlist));
    this.notify('wishlist_updated', { wishlist: this.state.wishlist, productId, added });
    return added;
  }

  isInWishlist(productId) {
    return this.state.wishlist.includes(productId);
  }

  // --- Comparison Tray Actions ---
  toggleCompare(productId) {
    const idx = this.state.compareList.indexOf(productId);
    if (idx > -1) {
      this.state.compareList.splice(idx, 1);
    } else {
      if (this.state.compareList.length >= 4) {
        return { success: false, message: 'You can compare maximum 4 products at once.' };
      }
      this.state.compareList.push(productId);
    }
    localStorage.setItem('aura_compare', JSON.stringify(this.state.compareList));
    this.notify('compare_updated', this.state.compareList);
    return { success: true, compareList: this.state.compareList };
  }

  isInCompare(productId) {
    return this.state.compareList.includes(productId);
  }

  clearCompare() {
    this.state.compareList = [];
    localStorage.setItem('aura_compare', JSON.stringify(this.state.compareList));
    this.notify('compare_updated', this.state.compareList);
  }

  // --- Currency & Theme ---
  setCurrency(currencyCode) {
    this.state.currency = currencyCode;
    localStorage.setItem('aura_currency', currencyCode);
    this.notify('currency_changed', currencyCode);
  }

  setTheme(theme) {
    this.state.theme = theme;
    localStorage.setItem('aura_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify('theme_changed', theme);
  }

  toggleTheme() {
    const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }

  // --- Order Placement ---
  createOrder(orderData) {
    const summary = this.getCartSummary();
    const orderId = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      carrier: orderData.shippingMethod || 'FedEx Luxury Courier',
      trackingNumber: `FX-${Math.floor(10000000 + Math.random() * 90000000)}B`,
      items: [...this.state.cart],
      subtotal: summary.subtotal,
      discount: summary.discount,
      shipping: summary.shipping,
      tax: summary.tax,
      total: summary.total,
      shippingAddress: orderData.address,
      paymentMethod: orderData.paymentMethod || 'Mobile Money (MTN MoMo)',
      momoNetwork: orderData.momoNetwork || 'MTN MoMo',
      momoPhone: orderData.momoPhone || '',
      momoTransactionId: `MM-${Math.floor(10000000 + Math.random() * 90000000)}`,
      timeline: [
        { step: 'Order Placed & Verified', time: 'Just now', completed: true },
        { step: 'Aura Artisan Vault Allocation', time: 'In Progress', completed: false },
        { step: 'White Glove Courier Dispatch', time: 'Estimated 24-48 hours', completed: false },
        { step: 'Delivery at Concierge', time: 'Estimated 3-4 business days', completed: false }
      ]
    };

    this.state.orders.unshift(newOrder);
    localStorage.setItem('aura_orders', JSON.stringify(this.state.orders));

    // Award loyalty points (1 point per dollar)
    this.state.user.points += Math.floor(summary.total);

    this.clearCart();
    this.notify('order_created', newOrder);
    return newOrder;
  }

  // --- User Authentication ---
  setUser(userData) {
    this.state.user = { ...this.state.user, isLoggedIn: true, ...userData };
    localStorage.setItem('aura_user', JSON.stringify(this.state.user));
    this.notify('user_updated', this.state.user);
  }

  logout() {
    this.state.user = {
      isLoggedIn: false,
      name: 'Guest Shopper',
      email: 'guest@7thjune.com',
      tier: 'Guest Account',
      points: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
    };
    localStorage.removeItem('aura_user');
    this.notify('user_updated', this.state.user);
  }

  // --- Navigation & View Controller ---
  setView(page, productId = null) {
    this.state.currentView = { page, productId };
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify('view_changed', this.state.currentView);
  }

  setQuickView(productId) {
    this.state.quickViewProductId = productId;
    this.notify('quick_view_changed', productId);
  }

  // --- Filters & Search ---
  setFilter(key, value) {
    this.state.filters[key] = value;
    this.notify('filters_updated', this.state.filters);
  }

  resetFilters() {
    this.state.filters = {
      category: 'All Products',
      query: '',
      maxPrice: 5000,
      minRating: 0,
      inStockOnly: false,
      onSaleOnly: false,
      sortBy: 'featured',
      viewMode: this.state.filters.viewMode
    };
    this.notify('filters_updated', this.state.filters);
  }

  addRecentSearch(query) {
    if (!query || !query.trim()) return;
    const clean = query.trim();
    this.state.recentSearches = [clean, ...this.state.recentSearches.filter(s => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    localStorage.setItem('aura_searches', JSON.stringify(this.state.recentSearches));
    this.notify('searches_updated', this.state.recentSearches);
  }

  // --- Admin Portal & Catalog Management ---
  setAdminSession(isLoggedIn, adminData = {}) {
    this.state.adminSession = {
      ...this.state.adminSession,
      isLoggedIn,
      ...adminData
    };
    localStorage.setItem('aura_admin_session', JSON.stringify(this.state.adminSession));
    this.notify('admin_session_changed', this.state.adminSession);
  }

  addProduct(productData) {
    const id = `prod-${String(Date.now()).slice(-5)}`;
    const initialStock = Number(productData.stockCount || productData.stock) || 15;
    const newProduct = {
      id,
      rating: 5.0,
      reviewCount: 1,
      stockCount: initialStock,
      stock: initialStock,
      inStock: initialStock > 0,
      colors: [{ name: 'Obsidian Black', hex: '#18181b', img: productData.heroImage || '' }],
      storageOptions: ['Standard Edition'],
      specs: {},
      featured: false,
      badge: 'NEW',
      gallery: productData.heroImage ? [productData.heroImage] : [],
      ...productData
    };
    this.state.products.unshift(newProduct);
    localStorage.setItem('aura_products', JSON.stringify(this.state.products));
    this.notify('products_updated', this.state.products);
    return newProduct;
  }

  updateProduct(productId, updatedFields) {
    const idx = this.state.products.findIndex(p => p.id === productId);
    if (idx > -1) {
      this.state.products[idx] = { ...this.state.products[idx], ...updatedFields };
      if (typeof updatedFields.stockCount !== 'undefined' || typeof updatedFields.stock !== 'undefined') {
        const sc = Number(updatedFields.stockCount !== undefined ? updatedFields.stockCount : updatedFields.stock);
        this.state.products[idx].stockCount = sc;
        this.state.products[idx].stock = sc;
        this.state.products[idx].inStock = sc > 0;
      }
      localStorage.setItem('aura_products', JSON.stringify(this.state.products));
      this.notify('products_updated', this.state.products);
      return this.state.products[idx];
    }
    return null;
  }

  deleteProduct(productId) {
    this.state.products = this.state.products.filter(p => p.id !== productId);
    localStorage.setItem('aura_products', JSON.stringify(this.state.products));
    this.notify('products_updated', this.state.products);
  }

  adjustProductStock(productId, delta) {
    const prod = this.state.products.find(p => p.id === productId);
    if (prod) {
      const current = Number(prod.stockCount !== undefined ? prod.stockCount : (prod.stock !== undefined ? prod.stock : 0));
      const next = Math.max(0, current + delta);
      prod.stockCount = next;
      prod.stock = next;
      prod.inStock = next > 0;
      localStorage.setItem('aura_products', JSON.stringify(this.state.products));
      this.notify('products_updated', this.state.products);
      return prod;
    }
    return null;
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.state.orders.find(o => o.orderId === orderId);
    if (order) {
      order.status = newStatus;
      if (order.timeline) {
        if (newStatus === 'Delivered') {
          order.timeline.forEach(t => t.completed = true);
        } else if (newStatus === 'In Transit') {
          if (order.timeline[0]) order.timeline[0].completed = true;
          if (order.timeline[1]) order.timeline[1].completed = true;
          if (order.timeline[2]) order.timeline[2].completed = true;
          if (order.timeline[3]) order.timeline[3].completed = false;
        } else if (newStatus === 'Processing') {
          if (order.timeline[0]) order.timeline[0].completed = true;
          if (order.timeline[1]) order.timeline[1].completed = false;
          if (order.timeline[2]) order.timeline[2].completed = false;
          if (order.timeline[3]) order.timeline[3].completed = false;
        }
      }
      localStorage.setItem('aura_orders', JSON.stringify(this.state.orders));
      this.notify('orders_updated', this.state.orders);
      return order;
    }
    return null;
  }

  addPromoCode(code, promoData) {
    const cleanCode = code.trim().toUpperCase();
    this.state.promoCodes[cleanCode] = { ...promoData };
    localStorage.setItem('aura_promo_codes', JSON.stringify(this.state.promoCodes));
    this.notify('promos_updated', this.state.promoCodes);
    return this.state.promoCodes[cleanCode];
  }

  deletePromoCode(code) {
    const cleanCode = code.trim().toUpperCase();
    if (this.state.promoCodes[cleanCode]) {
      delete this.state.promoCodes[cleanCode];
      localStorage.setItem('aura_promo_codes', JSON.stringify(this.state.promoCodes));
      this.notify('promos_updated', this.state.promoCodes);
      return true;
    }
    return false;
  }

  updateCustomerPoints(delta) {
    if (this.state.user) {
      this.state.user.points = Math.max(0, (this.state.user.points || 0) + delta);
      localStorage.setItem('aura_user', JSON.stringify(this.state.user));
      this.notify('user_updated', this.state.user);
    }
  }

  resetStoreData() {
    this.state.products = PRODUCTS.map(p => ({
      ...p,
      stockCount: p.stockCount !== undefined ? p.stockCount : (p.stock !== undefined ? p.stock : 15),
      stock: p.stock !== undefined ? p.stock : (p.stockCount !== undefined ? p.stockCount : 15),
      inStock: p.inStock !== undefined ? p.inStock : ((p.stockCount ?? p.stock ?? 15) > 0)
    }));
    this.state.promoCodes = { ...PROMO_CODES };
    localStorage.removeItem('aura_products');
    localStorage.removeItem('aura_promo_codes');
    this.notify('products_updated', this.state.products);
    this.notify('promos_updated', this.state.promoCodes);
  }
}

export const store = new Store();
