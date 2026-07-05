// ====================================================
// App — Shared navbar, toast system, and init
// ====================================================

/**
 * Render the navbar with auth-aware links.
 */
function renderNavbar() {
  const user = getUser();
  const cartCount = getCartCount();
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  navbar.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <a href="index.html" class="navbar-brand">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#brand-gradient)"/>
            <path d="M8 16h16M12 10l-4 6 4 6M20 10l4 6-4 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="brand-gradient" x1="0" y1="0" x2="32" y2="32">
                <stop stop-color="#FFD700"/>
                <stop offset="1" stop-color="#CC9900"/>
              </linearGradient>
            </defs>
          </svg>
          Shopverse
        </a>
        
        <button class="navbar-toggle" id="navbarToggle" aria-label="Toggle menu">☰</button>
        
        <ul class="navbar-links" id="navbarLinks">
          <li><a href="index.html" class="${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">Shop</a></li>
          <li>
            <a href="cart.html" class="cart-link ${currentPage === 'cart.html' ? 'active' : ''}">
              🛒 Cart
              ${cartCount > 0 ? `<span class="cart-badge" id="cartBadge">${cartCount}</span>` : ''}
            </a>
          </li>
          ${user ? `
            <li class="profile-menu" id="profileMenu">
              <div class="profile-avatar" id="profileAvatar">
                ${user.name.charAt(0).toUpperCase()}
              </div>
              <div class="profile-dropdown">
                <div style="padding: 10px 20px;">
                  <div style="font-weight: 600; color: var(--text-primary);">${user.name}</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">${user.email || ''}</div>
                </div>
                <div class="divider"></div>
                <a href="profile.html">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Personal Details
                </a>
                <a href="orders.html">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                  My Orders
                </a>
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  Help & Support
                </a>
                <div class="divider"></div>
                <a href="#" id="logoutBtn" style="color: #ef4444;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  Logout
                </a>
              </div>
            </li>
          ` : `
            <li><a href="login.html" class="${currentPage === 'login.html' ? 'active' : ''}">Login</a></li>
            <li>
              <a href="register.html" class="btn btn-primary btn-sm ${currentPage === 'register.html' ? 'active' : ''}">
                Sign Up
              </a>
            </li>
          `}
        </ul>
      </div>
    </nav>
  `;

  // Mobile menu toggle
  const toggle = document.getElementById('navbarToggle');
  const links = document.getElementById('navbarLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Profile dropdown toggle
  const profileAvatar = document.getElementById('profileAvatar');
  const profileMenu = document.getElementById('profileMenu');
  if (profileAvatar && profileMenu) {
    profileAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!profileMenu.contains(e.target)) {
        profileMenu.classList.remove('open');
      }
    });
  }

  // Logout handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
      showToast('Logged out successfully', 'info');
      window.location.href = 'index.html';
    });
  }
}

/**
 * Toast notification system.
 */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${icons[type] || icons.info}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto-remove after animation
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**
 * Generate star rating HTML.
 */
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/**
 * Format currency.
 */
function formatPrice(price) {
  return `₹${price.toFixed(2)}`;
}

/**
 * Loading skeleton for product cards.
 */
function renderSkeletons(count = 8) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="product-card">
        <div class="skeleton skeleton-image"></div>
        <div class="product-card-body">
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
          <div style="display:flex;justify-content:space-between;margin-top:1rem;">
            <div class="skeleton" style="width:60px;height:24px;"></div>
            <div class="skeleton" style="width:80px;height:34px;"></div>
          </div>
        </div>
      </div>
    `;
  }
  return html;
}

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
});
