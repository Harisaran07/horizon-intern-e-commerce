// ====================================================
// Cart — localStorage-based cart management
// ====================================================

const CART_KEY = 'Shopverse_cart';

/**
 * Get cart items from localStorage.
 */
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart items to localStorage.
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/**
 * Get total item count in cart.
 */
function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Get cart subtotal.
 */
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Add item to cart.
 */
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item._id === product._id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart`, 'success');
}

/**
 * Remove item from cart.
 */
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item._id !== productId);
  saveCart(cart);
}

/**
 * Update item quantity in cart.
 */
function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item._id === productId);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    item.quantity = quantity;
    saveCart(cart);
  }
}

/**
 * Clear entire cart.
 */
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

/**
 * Update cart badge in navbar.
 */
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const count = getCartCount();

  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  } else if (count > 0) {
    // Re-render navbar to show new badge
    renderNavbar();
  }
}

/**
 * Render the cart page.
 */
function renderCartPage() {
  const cartContent = document.getElementById('cartContent');
  if (!cartContent) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-state fade-in">
        <div class="empty-state-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet. Start shopping to fill it up!</p>
        <a href="index.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  cartContent.innerHTML = `
    <div class="cart-layout fade-in">
      <div class="cart-items">
        <h2 style="margin-bottom: var(--space-lg);">Shopping Cart (${getCartCount()} items)</h2>
        ${cart.map(item => `
          <div class="cart-item" data-id="${item._id}">
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-actions">
              <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="handleCartQuantity('${item._id}', ${item.quantity - 1})">−</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" onclick="handleCartQuantity('${item._id}', ${item.quantity + 1})">+</button>
              </div>
              <div style="font-weight: 600; min-width: 80px; text-align: right;">
                ${formatPrice(item.price * item.quantity)}
              </div>
              <button class="cart-item-remove" onclick="handleRemoveItem('${item._id}')" title="Remove item">
                🗑️
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="cart-summary glass-card" style="transform: none;">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>${shipping === 0 ? '<span style="color: var(--accent-teal);">Free</span>' : formatPrice(shipping)}</span>
        </div>
        ${shipping > 0 ? `
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-md);">
            Free shipping on orders over $100
          </div>
        ` : ''}
        <div class="summary-row total">
          <span>Total</span>
          <span class="amount">${formatPrice(total)}</span>
        </div>
        <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top: var(--space-lg);" id="checkoutBtn">
          Proceed to Checkout
        </a>
      </div>
    </div>
  `;

  // Checkout button auth check
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      if (!isAuthenticated()) {
        e.preventDefault();
        showToast('Please login to proceed to checkout', 'error');
        window.location.href = 'login.html?redirect=checkout.html';
      }
    });
  }
}

function handleCartQuantity(productId, newQty) {
  updateCartQuantity(productId, newQty);
  renderCartPage();
}

function handleRemoveItem(productId) {
  removeFromCart(productId);
  renderCartPage();
  showToast('Item removed from cart', 'info');
}
