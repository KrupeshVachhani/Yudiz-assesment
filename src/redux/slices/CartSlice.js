import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0
  },
  reducers: {
    addToCart(state, action) {
        const newItem = action.payload;
        const existingItemIndex = state.items.findIndex(
          item => item.id === newItem.id && item.selectedColor === (newItem.selectedColor || 'default')
        );
        
        if (existingItemIndex === -1) {
            state.items.push({
                ...newItem,
                selectedColor: newItem.selectedColor || 'default',
                quantity: 1
            });
        } else {
            state.items[existingItemIndex].quantity++;
        }
        
        state.totalQuantity++;
        state.totalAmount += newItem.price;
    },
    removeFromCart(state, action) {
      const { id, selectedColor } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.id === id && item.selectedColor === (selectedColor || 'default')
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
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    }
  },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer