const pageSections = {
    menu: document.getElementById('menu-page'),
    cart: document.getElementById('cart-page'),
    checkout: document.getElementById('checkout-page'),
};
const menuGrid = document.getElementById('menu-grid');
const cartCountElement = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMessage = document.getElementById('empty-cart-message');
const orderSummary = document.getElementById('order-summary');
const subtotalElement = document.getElementById('subtotal');
const totalPriceElement = document.getElementById('total-price');
const cartSummaryItemsElement = document.getElementById('cart-summary-items');
const summaryItemsElement = document.getElementById('summary-items');
const checkoutTotalPriceElement = document.getElementById('checkout-total-price');
const successModal = document.getElementById('success-modal');
const modalContent = document.getElementById('modal-content');
const modalOrderDetails = document.getElementById('modal-order-details');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const toastElement = document.getElementById('toast');

/**
 * Switches the visible page section (menu, cart, or checkout).
 * @param {string} pageKey - The key of the page to show (menu, cart, checkout).
 */
export function showPage(pageKey) {
    Object.values(pageSections).forEach(section => section.classList.add('hidden'));
    if (pageSections[pageKey]) {
        pageSections[pageKey].classList.remove('hidden');
    }
    backToMenuBtn.classList.toggle('hidden', pageKey === 'menu');
}

/**
 * Updates the number on the shopping cart icon in the header.
 * @param {Array} cart - The current cart array.
 */
export function updateCartIcon(cart) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update mobile cart count if it exists
    const mobileCartCount = document.getElementById('mobile-cart-count');
    if (mobileCartCount) {
        mobileCartCount.textContent = totalItems;
    }
}

/**
 * Renders the menu items on the menu page.
 * @param {Array} menu - The full menu data array.
 */
export function renderMenu(menu) {
    menuGrid.innerHTML = ''; // Clear existing menu to prevent duplicates
    
    menu.forEach(item => {
        const menuItemHTML = `
            <div class="menu-card bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
                <div class="relative">
                    <img src="${item.image}" alt="${item.name}" class="menu-image w-full h-48 object-cover transition-all duration-500">
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-lg font-bold text-gray-800">${item.name}</h3>
                        <span class="bg-yellow-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-md">৳${item.price}</span>
                    </div>
                    
                    <p class="text-gray-600 text-sm mb-3">Delicious ${item.name.toLowerCase()} prepared with authentic spices.</p>
                    
                    <button class="add-to-cart-btn w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors" data-item-id="${item.id}">
                        <i class="fas fa-cart-plus"></i> <span class="btn-text">Add to Cart</span>
                    </button>
                </div>
            </div>
        `;
        menuGrid.innerHTML += menuItemHTML;
    });
}

/**
 * Renders the items in the cart page, including totals.
 * @param {Array} cart - The current cart array.
 */
export function renderCart(cart) {
    const checkoutBtn = document.getElementById('proceed-to-checkout-btn');
    cartItemsContainer.innerHTML = ''; // Clear old cart items

    if (cart.length === 0) {
        cartItemsContainer.appendChild(emptyCartMessage);
        emptyCartMessage.style.display = 'block';
        orderSummary.style.display = 'none';
    } else {
        emptyCartMessage.style.display = 'none';
        orderSummary.style.display = 'block';
        cart.forEach(item => {
            const cartItemHTML = `
                <div class="flex items-center justify-between border-b py-4">
                    <div class="flex items-center gap-4">
                        <input type="checkbox" class="item-selector w-5 h-5" data-item-id="${item.id}" ${item.selected ? 'checked' : ''}>
                        <div>
                            <p class="font-bold text-lg text-gray-800">${item.name}</p>
                            <p class="text-gray-500">৳${item.price}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center border rounded-md">
                            <button class="quantity-change-btn px-3 py-1 text-gray-600 hover:bg-gray-100" data-item-id="${item.id}" data-change="-1">-</button>
                            <input type="number" value="${item.quantity}" class="quantity-input w-12 text-center font-semibold" data-item-id="${item.id}">
                            <button class="quantity-change-btn px-3 py-1 text-gray-600 hover:bg-gray-100" data-item-id="${item.id}" data-change="1">+</button>
                        </div>
                        <p class="font-bold w-20 text-right">৳${(item.price * item.quantity)}</p>
                        <button class="remove-from-cart-btn text-gray-400 hover:text-red-500 transition-colors" data-item-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
    }
    
    // Update cart summary items in the sidebar
    cartSummaryItemsElement.innerHTML = '';
    const selectedItems = cart.filter(item => item.selected);
    
    selectedItems.forEach(item => {
        cartSummaryItemsElement.innerHTML += `
            <div class="flex justify-between py-1">
                <span>${item.name} × ${item.quantity}</span>
                <span>৳${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    // If no selected items, show a message
    if (selectedItems.length === 0) {
        cartSummaryItemsElement.innerHTML = '<p class="text-gray-500 text-center py-2">No items selected</p>';
    }
    
    // Calculate and display totals for selected items only
    const subtotal = cart.reduce((sum, item) => item.selected ? sum + (item.price * item.quantity) : sum, 0);
    
    subtotalElement.textContent = `৳${subtotal.toFixed(2)}`;
    totalPriceElement.textContent = `৳${subtotal.toFixed(2)}`;
    
    // Disable checkout if no items are selected
    const hasSelectedItems = selectedItems.length > 0;
    checkoutBtn.disabled = !hasSelectedItems;
}

/**
 * Renders the final summary on the checkout page.
 * @param {Array} cart - The current cart array.
 */
export function renderCheckoutSummary(cart) {
    summaryItemsElement.innerHTML = '';
    cart.forEach(item => {
        if (item.selected) {
            summaryItemsElement.innerHTML += `
                <div class="flex justify-between items-center text-gray-600 py-2">
                    <span>${item.name} <span class="text-sm">x ${item.quantity}</span></span>
                    <span class="font-medium">৳${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        }
    });
    const total = cart.reduce((sum, item) => item.selected ? sum + (item.price * item.quantity) : sum, 0);
    checkoutTotalPriceElement.textContent = `৳${total.toFixed(2)}`;
}

/**
 * Displays the "Order Confirmed" modal.
 * @param {FormData} formData - The submitted form data.
 * @param {Array} cart - The current cart array.
 */
export function showSuccessModal(formData, cart) {
    successModal.style.display = 'flex';
    setTimeout(() => modalContent.classList.remove('scale-95', 'opacity-0'), 10);
}

/**
 * Hides the success modal.
 */
export function closeModal() {
    successModal.style.display = 'none';
    modalContent.classList.add('scale-95', 'opacity-0');
}

/**
 * Shows feedback when item is added to cart by changing the button text and color
 * @param {HTMLElement} button - The button that was clicked
 */
export function showToast(button) {
    if (!button) return;
    
    // Save original button state
    const btnText = button.querySelector('.btn-text');
    const originalText = btnText.textContent;
    const originalClasses = button.className;
    
    // Change button appearance
    button.className = 'add-to-cart-btn bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2';
    btnText.textContent = 'Added!';
    
    // Revert back after delay
    setTimeout(() => {
        button.className = originalClasses;
        btnText.textContent = originalText;
    }, 2000);
}

