// ====================================================
// Orders — Checkout, order history, and tracking
// ====================================================

/**
 * Render checkout page.
 */
function renderCheckout() {
  const container = document.getElementById('checkoutContent');
  if (!container) return;

  if (!requireAuth()) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state fade-in">
        <div class="empty-state-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out.</p>
        <a href="index.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="checkout-layout fade-in">
      <div>
        <div class="checkout-section">
          <h2>📦 Shipping Address</h2>
          <form id="checkoutForm">
            <div class="form-group">
              <label class="form-label" for="fullName">Full Name</label>
              <input type="text" class="form-control" id="fullName" name="fullName" placeholder="John Doe" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="address">Address</label>
              <input type="text" class="form-control" id="address" name="address" placeholder="123 Main Street, Apt 4" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="city">City</label>
                <input type="text" class="form-control" id="city" name="city" placeholder="New York" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="postalCode">Postal Code</label>
                <input type="text" class="form-control" id="postalCode" name="postalCode" placeholder="10001" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="country">Country</label>
              <input type="text" class="form-control" id="country" name="country" placeholder="United States" required>
            </div>
            
            <hr style="border: 0; height: 1px; background: var(--border-glass); margin: var(--space-xl) 0;">
            
            <h2 style="margin-bottom: var(--space-md);">💳 Payment Method</h2>
            <div style="background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.3); padding: var(--space-md); border-radius: var(--radius-sm); margin-bottom: var(--space-lg);">
              <p style="color: var(--accent-purple); font-size: 0.9rem; margin-bottom: var(--space-sm);">Dummy Payment Sandbox Enabled</p>
              <div class="form-group">
                <label class="form-label" for="cardNumber">Card Number</label>
                <input type="text" class="form-control" id="cardNumber" name="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="expiry">Expiry (MM/YY)</label>
                  <input type="text" class="form-control" id="expiry" name="expiry" placeholder="12/25" maxlength="5" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="cvc">CVC</label>
                  <input type="text" class="form-control" id="cvc" name="cvc" placeholder="123" maxlength="3" required>
                </div>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary btn-lg btn-block" id="placeOrderBtn">
              Place Order — ${formatPrice(total)}
            </button>
          </form>
        </div>
      </div>
      
      <div>
        <div class="cart-summary glass-card" style="transform: none;">
          <h3>Order Review</h3>
          <div class="order-review-items">
            ${cart.map(item => `
              <div class="order-review-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="order-review-item-info">
                  <div class="order-review-item-name">${item.name}</div>
                  <div class="order-review-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="order-review-item-price">${formatPrice(item.price * item.quantity)}</div>
              </div>
            `).join('')}
          </div>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? '<span style="color: var(--accent-teal);">Free</span>' : formatPrice(shipping)}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span class="amount">${formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Form submission
  document.getElementById('checkoutForm').addEventListener('submit', handlePlaceOrder);
}

/**
 * Handle place order.
 */
async function handlePlaceOrder(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = document.getElementById('placeOrderBtn');

  const shippingAddress = {
    fullName: form.fullName.value.trim(),
    address: form.address.value.trim(),
    city: form.city.value.trim(),
    postalCode: form.postalCode.value.trim(),
    country: form.country.value.trim()
  };

  const paymentInfo = {
    cardNumber: form.cardNumber.value.trim(),
    expiry: form.expiry.value.trim(),
    cvc: form.cvc.value.trim()
  };

  // Validate Address
  for (const [key, value] of Object.entries(shippingAddress)) {
    if (!value) {
      showToast('Please fill in all shipping fields', 'error');
      return;
    }
  }

  // Validate Dummy Payment
  if (paymentInfo.cardNumber.replace(/\s/g, '').length < 15) {
    showToast('Please enter a valid card number', 'error');
    form.cardNumber.focus();
    return;
  }
  if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiry)) {
    showToast('Expiry must be MM/YY', 'error');
    form.expiry.focus();
    return;
  }
  if (paymentInfo.cvc.length < 3) {
    showToast('Invalid CVC', 'error');
    form.cvc.focus();
    return;
  }

  const cart = getCart();
  const items = cart.map(item => ({
    product: item._id,
    quantity: item.quantity
  }));

  submitBtn.disabled = true;
  submitBtn.textContent = 'Placing order...';

  try {
    const order = await api.post('/orders', { items, shippingAddress });

    // Clear cart
    clearCart();

    // Show success
    const container = document.getElementById('checkoutContent');
    container.innerHTML = `
      <div class="success-card glass-card fade-in" style="transform: none;">
        <div class="success-icon">✓</div>
        <h2 style="margin-bottom: var(--space-md);">Order Placed Successfully!</h2>
        <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>
        <div style="background: var(--bg-glass); padding: var(--space-md); border-radius: var(--radius-sm); margin-bottom: var(--space-xl); border: var(--border-glass);">
          <div style="color: var(--text-muted); font-size: 0.85rem;">Order ID</div>
          <div style="font-family: monospace; font-size: 0.95rem; color: var(--accent-purple);">${order._id}</div>
        </div>
        <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
          <a href="orders.html" class="btn btn-primary">Track My Order</a>
          <a href="index.html" class="btn btn-secondary">Continue Shopping</a>
        </div>
      </div>
    `;

    renderNavbar();
  } catch (error) {
    showToast(error.message, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place Order';
  }
}

/**
 * Load and render order history.
 */
async function loadOrders() {
  const container = document.getElementById('ordersContent');
  if (!container) return;

  if (!requireAuth()) return;

  container.innerHTML = `
    <div class="section-header">
      <h1>My Orders</h1>
      <p>Track and manage your orders</p>
    </div>
    <div style="text-align: center; padding: var(--space-2xl);">
      <div class="skeleton" style="width: 100%; height: 120px; margin-bottom: var(--space-md);"></div>
      <div class="skeleton" style="width: 100%; height: 120px; margin-bottom: var(--space-md);"></div>
    </div>
  `;

  try {
    const orders = await api.get('/orders');

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="section-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>
        <div class="empty-state fade-in">
          <div class="empty-state-icon">📦</div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <a href="index.html" class="btn btn-primary">Start Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="section-header fade-in">
        <h1>My Orders</h1>
        <p>${orders.length} order${orders.length !== 1 ? 's' : ''} placed</p>
      </div>
      <div class="orders-list stagger-in">
        ${orders.map(order => renderOrderCard(order)).join('')}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="section-header">
        <h1>My Orders</h1>
      </div>
      <div class="empty-state">
        <div class="empty-state-icon">😕</div>
        <h2>Unable to load orders</h2>
        <p>${error.message}</p>
        <button class="btn btn-primary" onclick="loadOrders()">Try Again</button>
      </div>
    `;
  }
}

/**
 * Render a single order card.
 */
function renderOrderCard(order) {
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = statuses.indexOf(order.status);

  return `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <div class="order-id">Order #${order._id.slice(-8).toUpperCase()}</div>
          <div class="order-date">${date}</div>
        </div>
        <div style="display: flex; align-items: center; gap: var(--space-md);">
          <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
          <span class="order-total">${formatPrice(order.totalAmount)}</span>
        </div>
      </div>
      
      <div class="order-card-body">
        <div class="order-items-preview">
          ${order.items.map(item => `
            <div class="order-item-thumb" title="${item.name}">
              <img src="${item.image}" alt="${item.name}">
            </div>
          `).join('')}
          <div style="display: flex; align-items: center; color: var(--text-muted); font-size: 0.85rem; padding-left: var(--space-sm);">
            ${order.items.length} item${order.items.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div class="status-timeline">
          ${statuses.map((status, i) => {
            let stepClass = '';
            if (i < currentIndex) stepClass = 'completed';
            else if (i === currentIndex) stepClass = 'completed active';

            return `
              <div class="timeline-step ${stepClass}">
                <div class="timeline-dot">
                  ${i <= currentIndex ? '✓' : (i + 1)}
                </div>
                <div class="timeline-label">${status}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
