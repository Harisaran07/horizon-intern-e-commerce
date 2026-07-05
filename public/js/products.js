// ====================================================
// Products — Fetch, render, filter, and detail page
// ====================================================

let allProducts = [];
let currentCategory = 'All';
let searchQuery = '';

/**
 * Fetch and render product listing.
 */
async function loadProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  // Show skeletons while loading
  grid.innerHTML = renderSkeletons(8);

  try {
    allProducts = await api.get('/products');
    renderProductGrid();
  } catch (error) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-state-icon">😕</div>
        <h2>Unable to load products</h2>
        <p>${error.message}</p>
        <button class="btn btn-primary" onclick="loadProducts()">Try Again</button>
      </div>
    `;
  }
}

/**
 * Render filtered product grid.
 */
function renderProductGrid() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  let filtered = allProducts;

  // Category filter
  if (currentCategory !== 'All') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-state-icon">🔍</div>
        <h2>No products found</h2>
        <p>Try adjusting your search or filter to find what you're looking for.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <div class="product-card" onclick="viewProduct('${product._id}')">
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-card-category">${product.category}</div>
      </div>
      <div class="product-card-body">
        <div class="product-card-name">${product.name}</div>
        <div class="product-card-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="review-count">(${product.numReviews})</span>
        </div>
        <div class="product-card-footer">
          <div class="product-card-price">${formatPrice(product.price)}</div>
          <button class="btn-add-cart" onclick="handleAddToCart(event, '${product._id}')" id="addBtn-${product._id}">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Add stagger animation
  grid.classList.add('stagger-in');
}

/**
 * Handle add to cart from product grid.
 */
function handleAddToCart(event, productId) {
  event.stopPropagation();
  const product = allProducts.find(p => p._id === productId);
  if (product) {
    addToCart(product);
    const btn = document.getElementById(`addBtn-${productId}`);
    if (btn) {
      btn.textContent = '✓ Added';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.classList.remove('added');
      }, 1500);
    }
  }
}

/**
 * Navigate to product detail page.
 */
function viewProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
}

/**
 * Set category filter.
 */
function setCategory(category) {
  currentCategory = category;

  // Update active chip
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.category === category);
  });

  renderProductGrid();
}

/**
 * Handle search input.
 */
function handleSearch(e) {
  searchQuery = e.target.value;
  renderProductGrid();
}

/**
 * Reset all filters.
 */
function resetFilters() {
  currentCategory = 'All';
  searchQuery = '';

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.category === 'All');
  });

  renderProductGrid();
}

// ── Product Detail Page ──

/**
 * Load and render single product detail.
 */
async function loadProductDetail() {
  const container = document.getElementById('productDetail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const product = await api.get(`/products/${productId}`);
    renderProductDetail(product);
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">😕</div>
        <h2>Product not found</h2>
        <p>${error.message}</p>
        <a href="index.html" class="btn btn-primary">Back to Shop</a>
      </div>
    `;
  }
}

/**
 * Render product detail page content.
 */
function renderProductDetail(product) {
  const container = document.getElementById('productDetail');
  if (!container) return;

  let stockStatus, stockClass;
  if (product.stock === 0) {
    stockStatus = 'Out of Stock';
    stockClass = 'out-of-stock';
  } else if (product.stock <= 5) {
    stockStatus = `Only ${product.stock} left`;
    stockClass = 'low-stock';
  } else {
    stockStatus = 'In Stock';
    stockClass = 'in-stock';
  }

  container.innerHTML = `
    <div class="breadcrumb fade-in">
      <a href="index.html">Shop</a>
      <span class="separator">›</span>
      <a href="index.html?category=${encodeURIComponent(product.category)}">${product.category}</a>
      <span class="separator">›</span>
      <span>${product.name}</span>
    </div>
    
    <div class="product-detail fade-in">
      <div class="product-detail-image glass-card" style="transform:none;padding:0;">
        <img src="${product.image}" alt="${product.name}">
      </div>
      
      <div class="product-detail-info">
        <span class="product-detail-category">${product.category}</span>
        <h1 class="product-detail-name">${product.name}</h1>
        
        <div class="product-card-rating" style="margin-bottom: var(--space-lg);">
          <span class="stars" style="font-size: 1.1rem;">${renderStars(product.rating)}</span>
          <span class="review-count" style="font-size: 0.9rem;">${product.rating} (${product.numReviews} reviews)</span>
        </div>
        
        <div class="product-detail-price">${formatPrice(product.price)}</div>
        
        <p class="product-detail-description">${product.description}</p>
        
        <div class="product-detail-meta">
          <div class="meta-item">
            <div class="meta-item-label">Availability</div>
            <div class="meta-item-value">
              <span class="stock-badge ${stockClass}">● ${stockStatus}</span>
            </div>
          </div>
          <div class="meta-item">
            <div class="meta-item-label">Category</div>
            <div class="meta-item-value">${product.category}</div>
          </div>
          <div class="meta-item">
            <div class="meta-item-label">Rating</div>
            <div class="meta-item-value">${product.rating}/5</div>
          </div>
        </div>
        
        ${product.stock > 0 ? `
          <div class="quantity-selector">
            <span style="color: var(--text-secondary); font-weight: 500;">Quantity:</span>
            <button class="quantity-btn" id="qtyMinus">−</button>
            <span class="quantity-value" id="qtyValue">1</span>
            <button class="quantity-btn" id="qtyPlus">+</button>
          </div>
          
          <button class="btn btn-primary btn-lg" id="addToCartDetail" style="width: 100%;">
            Add to Cart — ${formatPrice(product.price)}
          </button>
        ` : `
          <button class="btn btn-secondary btn-lg" disabled style="width: 100%;">
            Out of Stock
          </button>
        `}
      </div>
    </div>
  `;

  // Quantity controls
  if (product.stock > 0) {
    let qty = 1;
    const qtyValue = document.getElementById('qtyValue');
    const addBtn = document.getElementById('addToCartDetail');

    document.getElementById('qtyMinus').addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        qtyValue.textContent = qty;
        addBtn.textContent = `Add to Cart — ${formatPrice(product.price * qty)}`;
      }
    });

    document.getElementById('qtyPlus').addEventListener('click', () => {
      if (qty < product.stock) {
        qty++;
        qtyValue.textContent = qty;
        addBtn.textContent = `Add to Cart — ${formatPrice(product.price * qty)}`;
      }
    });

    addBtn.addEventListener('click', () => {
      addToCart(product, qty);
      addBtn.textContent = '✓ Added to Cart!';
      addBtn.style.background = 'var(--gradient-secondary)';
      setTimeout(() => {
        addBtn.textContent = `Add to Cart — ${formatPrice(product.price * qty)}`;
        addBtn.style.background = '';
      }, 2000);
    });
  }
}
