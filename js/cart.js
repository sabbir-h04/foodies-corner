// This file is a simple "data manager". Its only job is to manage the shopping cart data.
// It doesn't touch the HTML or what the user sees.

/**
 * Retrieves the cart array from the browser's local storage.
 * If no cart exists, it returns an empty array.
 * @returns {Array} The cart array.
 */
export function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

/**
 * Saves the provided cart array to the browser's local storage.
 * @param {Array} cart - The cart array to save.
 */
export function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Adds an item to the cart or increments its quantity if it already exists.
 * @param {number} itemId - The ID of the item to add.
 * @param {Array} menu - The full menu array to find the item details.
 */
export function addToCart(itemId, menu) {
    const cart = getCart();
    const itemToAdd = menu.find(item => item.id === itemId);
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...itemToAdd, quantity: 1, selected: true });
    }
    
    saveCart(cart);
}

/**
 * Updates the quantity of a specific item in the cart.
 * If the new quantity is zero or less, the item is removed.
 * @param {number} itemId - The ID of the item to update.
 * @param {number} newQuantity - The new quantity for the item.
 */
export function updateItemQuantity(itemId, newQuantity) {
    let cart = getCart();
    const itemInCart = cart.find(item => item.id === itemId);

    if (itemInCart) {
        if (newQuantity > 0) {
            itemInCart.quantity = newQuantity;
        } else {
            // If quantity is 0 or less, remove the item from the cart.
            cart = cart.filter(item => item.id !== itemId);
        }
    }
    saveCart(cart);
}

/**
 * Removes an item completely from the cart, regardless of its quantity.
 * @param {number} itemId - The ID of the item to remove.
 */
export function removeItemFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
}

/**
 * Empties the entire cart. Used after a successful checkout.
 */
export function clearCart() {
    localStorage.removeItem('cart');
}

/**
 * Removes only the items that are marked as selected from the cart.
 * Leaves unselected items intact.
 */
export function clearSelectedItems() {
    const remainingItems = getCart().filter(item => !item.selected);
    saveCart(remainingItems);
}

/**
 * Updates the selection status of an item in the cart
 * @param {number} itemId - The ID of the item to update
 * @param {boolean} selected - Whether the item should be selected or not
 */
export function updateItemSelection(itemId, selected) {
    const cart = getCart();
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.selected = selected;
        saveCart(cart);
    }
}
