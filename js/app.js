import * as Cart from './cart.js';
import * as UI from './ui.js';

// --- DATA ---
// The menu data is the only data we need to keep here.
const menu = [
    { id: 1, name: 'Kacchi Biryani', price: 350, image: 'img/biriyani.jpeg' },
    { id: 2, name: 'Beef Bhuna', price: 280, image: 'img/beef_bhuna.jpeg' },
    { id: 3, name: 'Chicken Tikka', price: 220, image: 'img/chicken_tikka.jpeg' },
    { id: 4, name: 'Mutton Rezala', price: 320, image: 'img/mutton_rezala.jpeg' },
    { id: 5, name: 'Fish Curry', price: 180, image: 'img/fish_curry.jpeg' },
    { id: 6, name: 'Plain Naan', price: 30, image: 'img/plain_nun.jpeg' },
    { id: 7, name: 'Butter Naan', price: 40, image: 'img/butter_naan.jpeg' },
    { id: 8, name: 'Mixed Vegetables', price: 120, image: 'img/mixed_vegetables.jpeg' },
    { id: 9, name: 'Dal', price: 100, image: 'img/dal.jpeg' },
    { id: 10, name: 'Fried Chicken', price: 250, image: 'img/fried_chicken.jpeg' },
    { id: 11, name: 'Iced Coffee', price: 120, image: 'img/iced_coffe.jpeg' },
    { id: 12, name: 'Jilapi', price: 50, image: 'img/jilapi.jpeg' },
];


function setupEventListeners() {
    // Listen for clicks on navigation links in the header.
    document.querySelector('header').addEventListener('click', (e) => {
        const navLink = e.target.closest('.nav-link');
        if (navLink) {
            e.preventDefault();
            const page = navLink.dataset.page;
            UI.showPage(page);
            // When we show a page, we need to make sure its content is up-to-date.
            if (page === 'cart') UI.renderCart(Cart.getCart());
            if (page === 'checkout') UI.renderCheckoutSummary(Cart.getCart());
        }
    });

    // Listen for clicks on "Add to Cart" buttons on the menu.
    document.getElementById('menu-grid').addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            const itemId = parseInt(addToCartBtn.dataset.itemId);
            Cart.addToCart(itemId, menu); // Update data
            UI.updateCartIcon(Cart.getCart()); // Update UI
            UI.showToast(addToCartBtn); // Show button feedback
        }
    });

    // Listen for clicks inside the cart items container (for updating quantity or removing).
    document.getElementById('cart-items-container').addEventListener('click', (e) => {
        const button = e.target.closest('.quantity-change-btn, .remove-from-cart-btn');
        if (!button) return;

        const itemId = parseInt(button.dataset.itemId);
        if (button.classList.contains('quantity-change-btn')) {
            const change = parseInt(button.dataset.change);
            const currentQuantity = Cart.getCart().find(item => item.id === itemId).quantity;
            Cart.updateItemQuantity(itemId, currentQuantity + change);
        } else if (button.classList.contains('remove-from-cart-btn')) {
            Cart.removeItemFromCart(itemId);
        }
        // After updating the data, redraw the cart and update the icon.
        UI.renderCart(Cart.getCart());
        UI.updateCartIcon(Cart.getCart());
    });
    
    // Listen for direct input changes on the quantity field and item selection in the cart.
    document.getElementById('cart-items-container').addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const itemId = parseInt(e.target.dataset.itemId);
            const newQuantity = parseInt(e.target.value);
            Cart.updateItemQuantity(itemId, newQuantity);
            // After updating the data, redraw the cart and update the icon.
            UI.renderCart(Cart.getCart());
            UI.updateCartIcon(Cart.getCart());
        } else if (e.target.classList.contains('item-selector')) {
            const itemId = parseInt(e.target.dataset.itemId);
            const selected = e.target.checked;
            Cart.updateItemSelection(itemId, selected);
            UI.renderCart(Cart.getCart());
        }
    });

    // Listen for click on the "Proceed to Checkout" button.
    document.getElementById('proceed-to-checkout-btn').addEventListener('click', () => {
        UI.showPage('checkout');
        UI.renderCheckoutSummary(Cart.getCart());
    });

    // Listen for the final order submission.
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        UI.showSuccessModal(formData, Cart.getCart());
    });

    // Listen for "Start New Order" button
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        Cart.clearSelectedItems();
        document.getElementById('checkout-form').reset();
        UI.closeModal();
        UI.updateCartIcon(Cart.getCart());
        UI.showPage('menu');
    });
}


function initialize() {
    UI.renderMenu(menu);
    UI.updateCartIcon(Cart.getCart());
    
    // Check for URL parameters to show cart directly
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam === 'cart') {
        UI.showPage('cart');
        UI.renderCart(Cart.getCart());
    } else {
        UI.showPage('menu');
    }
    
    setupEventListeners();
}
// Start the app once the entire HTML page is loaded
document.addEventListener('DOMContentLoaded', initialize);
