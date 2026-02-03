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

// Utility Functions
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

// Check authentication status
async function checkAuth() {
  try {
    const response = await fetch('/api/check-auth');
    const data = await response.json();
    
    if (data.authenticated) {
      if (userNameEl) {
        userNameEl.textContent = data.user.name || data.user.email;
      }
      if (window.location.pathname === '/') {
        window.location.href = '/order.html';
      }
    } else {
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
}

// Login functionality
async function handleLogin(email, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/order.html';
      }, 1000);
    } else {
      showError(data.error || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('An error occurred. Please try again.');
  }
}

// Logout functionality
async function handleLogout() {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST'
    });

    if (response.ok) {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Load organizations
async function loadOrganizations() {
  try {
    const response = await fetch('/api/organizations');
    
    if (!response.ok) {
      throw new Error('Failed to load organizations');
    }

    organizations = await response.json();
    
    // Populate organization dropdown
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
  if (!orgId) {
    itemsContainer.innerHTML = '<p class="placeholder-text">Please select an organization to view available items</p>';
    currentItems = [];
    return;
  }

  try {
    itemsContainer.innerHTML = '<div class="spinner"></div>';
    
    const response = await fetch(`/api/organizations/${orgId}/items`);
    
    if (!response.ok) {
      throw new Error('Failed to load items');
    }

    currentItems = await response.json();
    renderItems();
  } catch (error) {
    console.error('Error loading items:', error);
    showError('Failed to load items');
    itemsContainer.innerHTML = '<p class="placeholder-text">Failed to load items. Please try again.</p>';
  }
}

// Render items grid
function renderItems() {
  if (!currentItems || currentItems.length === 0) {
    itemsContainer.innerHTML = '<p class="placeholder-text">No items available for this organization</p>';
    return;
  }

  itemsContainer.innerHTML = currentItems.map(item => `
    <div class="item-card" data-item-id="${item.id}">
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
  `).join('');

  // Add event listeners to add-to-cart buttons
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

  // Validation
  if (!variantId) {
    showError('Please select a size');
    return;
  }

  if (quantity < 1 || quantity > 99) {
    showError('Quantity must be between 1 and 99');
    return;
  }

  // Find variant details
  const selectedOption = variantSelect.options[variantSelect.selectedIndex];
  const unitPrice = parseFloat(selectedOption.dataset.price);
  const sizeText = selectedOption.text.split(' (')[0];

  // Add to cart
  const cartItem = {
    cartItemId: Date.now(), // Unique ID for cart item
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
  if (cart.length === 0) {
    showError('Your cart is empty');
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
      headers: {
        'Content-Type': 'application/json'
      },
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
      // Show confirmation modal
      document.getElementById('confirmation-order-id').textContent = `#${data.order_id}`;
      document.getElementById('confirmation-total').textContent = formatPrice(data.total_amount);
      confirmationModal.classList.remove('hidden');
      
      // Clear cart
      cart = [];
      updateCartDisplay();
    } else {
      showError(data.error || 'Failed to submit order');
    }
  } catch (error) {
    console.error('Order submission error:', error);
    showError('An error occurred while submitting your order');
  } finally {
    submitOrderBtn.disabled = false;
    submitOrderBtn.textContent = 'Submit Order';
  }
}

// Close modal and start new order
function closeConfirmationModal() {
  confirmationModal.classList.add('hidden');
  orgSelect.value = '';
  itemsContainer.innerHTML = '<p class="placeholder-text">Please select an organization to view available items</p>';
  currentItems = [];
}

// Initialize app
function init() {
  // Check authentication
  checkAuth();

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      handleLogin(email, password);
    });
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Organization selection
  if (orgSelect) {
    orgSelect.addEventListener('change', (e) => {
      loadItems(e.target.value);
    });
  }

  // Submit order button
  if (submitOrderBtn) {
    submitOrderBtn.addEventListener('click', submitOrder);
  }

  // Modal controls
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeConfirmationModal);
  }

  if (newOrderBtn) {
    newOrderBtn.addEventListener('click', closeConfirmationModal);
  }

  // Load organizations if on order page
  if (orgSelect) {
    loadOrganizations();
  }
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Make removeFromCart available globally
window.removeFromCart = removeFromCart;