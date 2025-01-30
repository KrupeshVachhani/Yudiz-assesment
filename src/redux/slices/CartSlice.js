import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const { id, selectedColor, quantity } = newItem;

      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === id && item.selectedColor === (selectedColor || 'default')
      );

      if (existingItemIndex !== -1) {
        // If the item already exists, update its quantity
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        // Ensure the total quantity does not exceed 10
        if (newQuantity <= 10) {
          existingItem.quantity = newQuantity;
          state.totalQuantity += quantity;
          state.totalAmount += newItem.price * quantity;
        } else {
          // If the total exceeds 10, set it to the maximum allowed (10)
          const addedQuantity = 10 - existingItem.quantity;
          existingItem.quantity = 10;
          state.totalQuantity += addedQuantity;
          state.totalAmount += newItem.price * addedQuantity;
        }
      } else {
        // If the item does not exist, add it to the cart
        state.items.push({
          ...newItem,
          selectedColor: selectedColor || 'default',
          quantity: quantity,
        });
        state.totalQuantity += quantity;
        state.totalAmount += newItem.price * quantity;
      }
    },

    removeFromCart(state, action) {
      const { id, selectedColor } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === id && item.selectedColor === (selectedColor || 'default')
      );

      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex];

        if (existingItem.quantity === 1) {
          // If the quantity is 1, remove the item from the cart
          state.items.splice(existingItemIndex, 1);
        } else {
          // Otherwise, decrement the quantity
          existingItem.quantity--;
        }

        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;