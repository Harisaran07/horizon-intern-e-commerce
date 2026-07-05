// ====================================================
// Profile — Edit Personal Details
// ====================================================

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  loadUserProfile();

  const form = document.getElementById('profileForm');
  if (form) {
    form.addEventListener('submit', handleProfileUpdate);
  }
});

async function loadUserProfile() {
  try {
    const data = await api.get('/auth/me');
    const form = document.getElementById('profileForm');
    if (form && data) {
      form.name.value = data.name;
      form.email.value = data.email;
    }
  } catch (error) {
    showToast('Failed to load profile data', 'error');
  }
}

async function handleProfileUpdate(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = document.getElementById('updateBtn');
  
  const nameInput = form.name;
  const emailInput = form.email;
  const passwordInput = form.password;
  const confirmPasswordInput = form.confirmPassword;
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Utilize the clearFieldError and showFieldError from auth.js if available
  if (typeof clearFieldError === 'function') {
    clearFieldError(nameInput);
    clearFieldError(emailInput);
    clearFieldError(passwordInput);
    clearFieldError(confirmPasswordInput);
  }

  let hasError = false;

  if (!name || name.length < 3) {
    if (typeof showFieldError === 'function') showFieldError(nameInput, 'Name must be at least 3 characters');
    else showToast('Name must be at least 3 characters', 'error');
    hasError = true;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (typeof showFieldError === 'function') showFieldError(emailInput, 'Please enter a valid email');
    else showToast('Please enter a valid email', 'error');
    hasError = true;
  }

  if (password && password.length < 6) {
    if (typeof showFieldError === 'function') showFieldError(passwordInput, 'Password must be at least 6 characters');
    else showToast('Password must be at least 6 characters', 'error');
    hasError = true;
  }

  if (password && password !== confirmPassword) {
    if (typeof showFieldError === 'function') showFieldError(confirmPasswordInput, 'Passwords do not match');
    else showToast('Passwords do not match', 'error');
    hasError = true;
  }

  if (hasError) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  const updateData = { name, email };
  if (password) updateData.password = password;

  try {
    const data = await api.put('/auth/profile', updateData);
    
    // Update local storage
    saveAuth(data);
    
    showToast('Profile updated successfully!', 'success');
    
    // Re-render navbar to show new name if changed
    renderNavbar();
    
    // Clear passwords
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Changes';
  }
}
