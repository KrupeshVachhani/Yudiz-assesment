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
      
      // Handle case where selectedColor might be a hex value from the product.colors array
      const colorToUse = selectedColor || (newItem.colors && newItem.colors.length > 0 ? newItem.colors[0] : "default");
      
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === id && item.selectedColor === colorToUse
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
          if (addedQuantity > 0) {
            existingItem.quantity = 10;
            state.totalQuantity += addedQuantity;
            state.totalAmount += newItem.price * addedQuantity;
          }
        }
      } else {
        // Check if the product has available stock before adding
        const stockLimit = newItem.stock !== undefined ? Math.min(10, newItem.stock) : 10;
        const finalQuantity = Math.min(quantity, stockLimit);
        
        state.items.push({
          id: newItem.id,
          title: newItem.title,
          price: newItem.price,
          image_url: newItem.image_url,
          category: newItem.category,
          description: newItem.description,
          selectedColor: colorToUse,
          quantity: finalQuantity,
          stock: newItem.stock
        });
        
        state.totalQuantity += finalQuantity;
        state.totalAmount += newItem.price * finalQuantity;
      }

      saveCartToStorage(state);
    },

    removeFromCart(state, action) {
      const { id, selectedColor } = action.payload;
      const colorToUse = selectedColor || "default";
      
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === id && item.selectedColor === colorToUse
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

    removeItemCompletely(state, action) {
      const { id, selectedColor } = action.payload;
      const colorToUse = selectedColor || "default";
      
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === id && item.selectedColor === colorToUse
      );

      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex];
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items.splice(existingItemIndex, 1);
        
        saveCartToStorage(state);
      }
    },

    updateItemQuantity(state, action) {
      const { id, selectedColor, quantity } = action.payload;
      const colorToUse = selectedColor || "default";
      
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === id && item.selectedColor === colorToUse
      );

      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex];
        // const quantityDifference = quantity - existingItem.quantity;
        
        // Ensure quantity doesn't exceed stock or max limit (10)
        const stockLimit = existingItem.stock !== undefined ? Math.min(10, existingItem.stock) : 10;
        const newQuantity = Math.min(Math.max(1, quantity), stockLimit);
        
        state.totalQuantity += (newQuantity - existingItem.quantity);
        state.totalAmount += existingItem.price * (newQuantity - existingItem.quantity);
        existingItem.quantity = newQuantity;
        
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

export const { 
  addToCart, 
  removeFromCart, 
  removeItemCompletely, 
  updateItemQuantity, 
  clearCart 
} = cartSlice.actions;

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