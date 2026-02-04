// Global state
let cart = [];
let organizations = [];
let currentItems = [];

// DOM Elements
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const orgSelect = document.getElementById('org-select');
const itemsContainer = document.getElementById('items-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const submitOrderBtn = document.getElementById('submit-order-btn');
const confirmationModal = document.getElementById('confirmation-modal');
const closeModalBtn = document.getElementById('close-modal');
const newOrderBtn = document.getElementById('new-order-btn');
const userNameEl = document.getElementById('user-name');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
// We won't manage adminBtn here anymore; profile.html will handle admin link visibility

// Utility
function formatPrice(price) {
  return '$' + parseFloat(price).toFixed(2);
}

function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
      errorMessage.classList.add('hidden');
    }, 5000);
  }
}

function showSuccess(message) {
  if (successMessage) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 5000);
  }
}

// Check authentication status and adjust UI / redirects
async function checkAuth() {
  try {
    const res = await fetch('/api/check-auth');
    const data = await res.json();

    const path = window.location.pathname;

    if (data.authenticated) {
      // Set user name in header if present
      if (userNameEl) {
        userNameEl.textContent = data.user.name || data.user.email;
      }

      // If user is on login page and already logged in, send to profile
      if (path === '/') {
        window.location.href = '/profile.html';
      }
    } else {
      // Not authenticated:
      // If on a protected page (order or admin or profile), send to login
      if (path === '/order.html' || path === '/admin.html' || path === '/profile.html') {
        window.location.href = '/';
      }
    }
  } catch (err) {
    console.error('Auth check failed:', err);
  }
}

// Login
async function handleLogin(email, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        // Go to profile after login
        window.location.href = '/profile.html';
      }, 1000);
    } else {
      showError(data.error || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('An error occurred. Please try again.');
  }
}

// Logout
async function handleLogout() {
  try {
    const response = await fetch('/api/logout', { method: 'POST' });
    if (response.ok) {
      window.location.href = '/';
    }
  } catch (err) {
    console.error('Logout error:', err);
  }
}

// Load organizations
async function loadOrganizations() {
  if (!orgSelect) return;
  try {
    const response = await fetch('/api/organizations');
    if (!response.ok) throw new Error('Failed');

    organizations = await response.json();
    orgSelect.innerHTML = '<option value="">-- Choose an organization --</option>';
    organizations.forEach(org => {
      const option = document.createElement('option');
      option.value = org.id;
      option.textContent = org.name;
      orgSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading organizations:', error);
    showError('Failed to load organizations');
  }
}

// Load items for selected organization
async function loadItems(orgId) {
  if (!itemsContainer) return;

  if (!orgId) {
    itemsContainer.innerHTML = '<p class="placeholder-text">Please select an organization to view available items</p>';
    currentItems = [];
    return;
  }

  try {
    itemsContainer.innerHTML = '<div class="spinner"></div>';
    const response = await fetch(`/api/organizations/${orgId}/items`);
    if (!response.ok) throw new Error('Failed to load items');

    currentItems = await response.json();
    renderItems();
  } catch (error) {
    console.error('Error loading items:', error);
    showError('Failed to load items');
    itemsContainer.innerHTML = '<p class="placeholder-text">Failed to load items. Please try again.</p>';
  }
}

// Render items grid (with image or placeholder)
function renderItems() {
  if (!itemsContainer) return;

  if (!currentItems || currentItems.length === 0) {
    itemsContainer.innerHTML = '<p class="placeholder-text">No items available for this organization</p>';
    return;
  }

  itemsContainer.innerHTML = currentItems.map(item => {
    const hasImage = item.image_url && item.image_url.trim() !== '';
    const imgHtml = hasImage
      ? `<img src="${item.image_url}" alt="${item.name}"
               class="item-thumb"
               style="width:120px;height:120px;object-fit:cover;border-radius:8px;margin-bottom:0.5rem;">`
      : `<div class="item-thumb-placeholder"
               style="width:120px;height:120px;border-radius:8px;
                      background:#e5e7eb;margin-bottom:0.5rem;"></div>`;

    return `
      <div class="item-card" data-item-id="${item.id}">
        ${imgHtml}
        <h3 class="item-name">${item.name}</h3>
        <p class="item-description">${item.description || ''}</p>
        <p class="item-price">${formatPrice(item.base_price)}</p>
        
        <div class="item-controls">
          <div>
            <label>Size:</label>
            <select class="item-variant" data-item-id="${item.id}">
              <option value="">Select size</option>
              ${item.variants.map(variant => 
                `<option value="${variant.id}" data-price="${item.base_price + variant.additional_price}">
                  ${variant.size}${variant.color ? ' - ' + variant.color : ''} 
                  ${variant.additional_price > 0 ? '(+$' + variant.additional_price.toFixed(2) + ')' : ''}
                </option>`
              ).join('')}
            </select>
          </div>
          
          <div>
            <label>Quantity:</label>
            <input type="number" class="item-quantity" data-item-id="${item.id}" 
                   min="1" value="1" max="99">
          </div>
          
          ${item.allow_name ? `
            <div>
              <label>Name (optional):</label>
              <input type="text" class="item-custom-name" data-item-id="${item.id}" 
                     placeholder="Enter name" maxlength="20">
            </div>
          ` : ''}
          
          ${item.allow_number ? `
            <div>
              <label>Number (optional):</label>
              <input type="text" class="item-custom-number" data-item-id="${item.id}" 
                     placeholder="Enter number" maxlength="5">
            </div>
          ` : ''}
          
          <button class="add-to-cart-btn" data-item-id="${item.id}">Add to Order</button>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', handleAddToCart);
  });
}

// Add item to cart
function handleAddToCart(event) {
  const button = event.target;
  const itemId = parseInt(button.dataset.itemId);
  const item = currentItems.find(i => i.id === itemId);
  if (!item) {
    showError('Item not found');
    return;
  }

  const variantSelect = document.querySelector(`.item-variant[data-item-id="${itemId}"]`);
  const quantityInput = document.querySelector(`.item-quantity[data-item-id="${itemId}"]`);
  const customNameInput = document.querySelector(`.item-custom-name[data-item-id="${itemId}"]`);
  const customNumberInput = document.querySelector(`.item-custom-number[data-item-id="${itemId}"]`);

  const variantId = parseInt(variantSelect.value);
  const quantity = parseInt(quantityInput.value);
  const customName = customNameInput ? customNameInput.value.trim() : null;
  const customNumber = customNumberInput ? customNumberInput.value.trim() : null;

  if (!variantId) {
    showError('Please select a size');
    return;
  }
  if (quantity < 1 || quantity > 99) {
    showError('Quantity must be between 1 and 99');
    return;
  }

  const selectedOption = variantSelect.options[variantSelect.selectedIndex];
  const unitPrice = parseFloat(selectedOption.dataset.price);
  const sizeText = selectedOption.text.split(' (')[0];

  const cartItem = {
    cartItemId: Date.now(),
    item_id: itemId,
    variant_id: variantId,
    qty: quantity,
    custom_name: customName,
    custom_number: customNumber,
    unit_price: unitPrice,
    line_total: unitPrice * quantity,
    item_name: item.name,
    size_text: sizeText
  };

  cart.push(cartItem);
  updateCartDisplay();
  showSuccess('Item added to cart');
}

// Update cart display
function updateCartDisplay() {
  if (!cartItemsContainer || !cartTotalEl || !submitOrderBtn) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="placeholder-text">Your cart is empty</p>';
    cartTotalEl.textContent = '$0.00';
    submitOrderBtn.disabled = true;
    return;
  }

  cartItemsContainer.innerHTML = cart.map(cartItem => `
    <div class="cart-item" data-cart-item-id="${cartItem.cartItemId}">
      <div class="cart-item-header">
        <span class="cart-item-name">${cartItem.item_name}</span>
        <button class="btn btn-danger" onclick="removeFromCart(${cartItem.cartItemId})">Remove</button>
      </div>
      <div class="cart-item-details">
        Size: ${cartItem.size_text}<br>
        Qty: ${cartItem.qty}
        ${cartItem.custom_name ? `<br>Name: ${cartItem.custom_name}` : ''}
        ${cartItem.custom_number ? `<br>Number: ${cartItem.custom_number}` : ''}
      </div>
      <div class="cart-item-total">
        ${formatPrice(cartItem.line_total)}
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.line_total, 0);
  cartTotalEl.textContent = formatPrice(total);
  submitOrderBtn.disabled = false;
}

// Remove item from cart
function removeFromCart(cartItemId) {
  cart = cart.filter(item => item.cartItemId !== cartItemId);
  updateCartDisplay();
}

// Submit order
async function submitOrder() {
  if (!cart.length) {
    showError('Your cart is empty');
    return;
  }
  if (!orgSelect) {
    showError('Organization selection not found');
    return;
  }

  const orgId = parseInt(orgSelect.value);
  if (!orgId) {
    showError('Please select an organization');
    return;
  }

  try {
    submitOrderBtn.disabled = true;
    submitOrderBtn.textContent = 'Submitting...';

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organization_id: orgId,
        items: cart.map(item => ({
          item_id: item.item_id,
          variant_id: item.variant_id,
          qty: item.qty,
          custom_name: item.custom_name,
          custom_number: item.custom_number
        }))
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      if (document.getElementById('confirmation-order-id')) {
        document.getElementById('confirmation-order-id').textContent = `#${data.order_id}`;
      }
      if (document.getElementById('confirmation-total')) {
        document.getElementById('confirmation-total').textContent = formatPrice(data.total_amount);
      }
      if (confirmationModal) {
        confirmationModal.classList.remove('hidden');
      }
      cart = [];
      updateCartDisplay();
    } else {
      showError(data.error || 'Failed to submit order');
    }
  } catch (err) {
    console.error('Order submission error:', err);
    showError('An error occurred while submitting your order');
  } finally {
    if (submitOrderBtn) {
      submitOrderBtn.disabled = false;
      submitOrderBtn.textContent = 'Submit Order';
    }
  }
}

// Close modal and reset order view
function closeConfirmationModal() {
  if (confirmationModal) {
    confirmationModal.classList.add('hidden');
  }
  if (orgSelect && itemsContainer) {
    orgSelect.value = '';
    itemsContainer.innerHTML = '<p class="placeholder-text">Please select an organization to view available items</p>';
    currentItems = [];
  }
}

// Initialize
function init() {
  checkAuth();

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      handleLogin(email, password);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }

  if (orgSelect) {
    orgSelect.addEventListener('change', (e) => {
      loadItems(e.target.value);
    });
    loadOrganizations();
  }

  if (submitOrderBtn) {
    submitOrderBtn.addEventListener('click', submitOrder);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeConfirmationModal);
  }
  if (newOrderBtn) {
    newOrderBtn.addEventListener('click', closeConfirmationModal);
  }
}

document.addEventListener('DOMContentLoaded', init);
window.removeFromCart = removeFromCart;
