// ====================================================
// Auth — Login, Register, and Token Management
// ====================================================

/**
 * Get stored user info.
 */
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Get stored token.
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Check if user is authenticated.
 */
function isAuthenticated() {
  return !!getToken();
}

/**
 * Save user info and token after login/register.
 */
function saveAuth(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({
    _id: data._id,
    name: data.name,
    email: data.email
  }));
}

/**
 * Logout — clear auth data.
 */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Require auth — redirect to login if not authenticated.
 */
function requireAuth() {
  if (!isAuthenticated()) {
    showToast('Please login to continue', 'error');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/**
 * Show inline form error.
 */
function showFieldError(input, message) {
  clearFieldError(input);
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error';
  errorDiv.textContent = message;
  input.parentNode.appendChild(errorDiv);
  input.style.borderColor = '#ef4444';
}

/**
 * Clear inline form error.
 */
function clearFieldError(input) {
  const existing = input.parentNode.querySelector('.form-error');
  if (existing) existing.remove();
  input.style.borderColor = '';
}

/**
 * Handle login form submission.
 */
async function handleLogin(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const emailInput = form.email;
  const passwordInput = form.password;
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  clearFieldError(emailInput);
  clearFieldError(passwordInput);

  let hasError = false;

  if (!email) {
    showFieldError(emailInput, 'Email is required');
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError(emailInput, 'Please enter a valid email');
    hasError = true;
  }

  if (!password) {
    showFieldError(passwordInput, 'Password is required');
    hasError = true;
  }

  if (hasError) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';

  try {
    const data = await api.post('/auth/login', { email, password });
    saveAuth(data);
    showToast(`Welcome back, ${data.name}!`, 'success');

    const redirect = new URLSearchParams(window.location.search).get('redirect');
    setTimeout(() => {
      window.location.href = redirect || 'index.html';
    }, 500);
  } catch (error) {
    showToast(error.message, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In';
  }
}

/**
 * Handle register form submission.
 */
async function handleRegister(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const nameInput = form.name;
  const emailInput = form.email;
  const passwordInput = form.password;
  const confirmPasswordInput = form.confirmPassword;
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  clearFieldError(nameInput);
  clearFieldError(emailInput);
  clearFieldError(passwordInput);
  clearFieldError(confirmPasswordInput);

  let hasError = false;

  if (!name) {
    showFieldError(nameInput, 'Full Name is required');
    hasError = true;
  } else if (name.length < 3) {
    showFieldError(nameInput, 'Name must be at least 3 characters');
    hasError = true;
  }

  if (!email) {
    showFieldError(emailInput, 'Email is required');
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError(emailInput, 'Please enter a valid email');
    hasError = true;
  }

  if (!password) {
    showFieldError(passwordInput, 'Password is required');
    hasError = true;
  } else if (password.length < 6) {
    showFieldError(passwordInput, 'Password must be at least 6 characters');
    hasError = true;
  }

  if (!confirmPassword) {
    showFieldError(confirmPasswordInput, 'Please confirm your password');
    hasError = true;
  } else if (password !== confirmPassword) {
    showFieldError(confirmPasswordInput, 'Passwords do not match');
    hasError = true;
  }

  if (hasError) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating account...';

  try {
    const data = await api.post('/auth/register', { name, email, password });
    saveAuth(data);
    showToast(`Welcome, ${data.name}! Account created successfully.`, 'success');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
  } catch (error) {
    showToast(error.message, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
  }
}
