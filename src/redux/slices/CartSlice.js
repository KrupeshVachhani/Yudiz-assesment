import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      return {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
      };
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error("Error loading cart from localStorage:", err);
    return {
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem("cart", serializedCart);
  } catch (err) {
    console.error("Error saving cart to localStorage:", err);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const { id, selectedColor, quantity } = newItem;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === id && item.selectedColor === (selectedColor || "default")
      );

      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity <= 10) {
          existingItem.quantity = newQuantity;
          state.totalQuantity += quantity;
          state.totalAmount += newItem.price * quantity;
        } else {
          const addedQuantity = 10 - existingItem.quantity;
          existingItem.quantity = 10;
          state.totalQuantity += addedQuantity;
          state.totalAmount += newItem.price * addedQuantity;
        }
      } else {
        state.items.push({
          ...newItem,
          selectedColor: selectedColor || "default",
          quantity: quantity,
        });
        state.totalQuantity += quantity;
        state.totalAmount += newItem.price * quantity;
      }

      saveCartToStorage(state);
    },

    removeFromCart(state, action) {
      const { id, selectedColor } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === id && item.selectedColor === (selectedColor || "default")
      );

      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex];
        if (existingItem.quantity === 1) {
          state.items.splice(existingItemIndex, 1);
        } else {
          existingItem.quantity--;
        }
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;

        saveCartToStorage(state);
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;

      saveCartToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Utility function to get cart items (can be used in cart page)
export const getCartItems = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      return [];
    }
    const cart = JSON.parse(serializedCart);
    return cart.items || [];
  } catch (err) {
    console.error("Error getting cart items from localStorage:", err);
    return [];
  }
};
