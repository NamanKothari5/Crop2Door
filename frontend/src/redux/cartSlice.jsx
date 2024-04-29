import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("cart")) ?? [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const index = state.findIndex((i) => i.name === action.payload.name);
      if (index !== -1)
        state[index] = {
          ...state[index],
          quantity: Number(state[index].quantity) + Number(action.payload.quantity),
        };
      else state.push(action.payload);
    },
    deleteFromCart(state, action) {
      return state.filter((item) => item.name != action.payload.name);
    },
    deleteAllCart(state) {
      return state.filter((item) => false);
    },
    updateCart(state, action) {
      return state.map((item) => {
        if (item.name === action.payload.name) {
          return { ...item, quantity: action.payload.quantity };
        } else return item;
      });
    },
  },
});

export const { addToCart, deleteFromCart, deleteAllCart,updateCart } = cartSlice.actions;

export default cartSlice.reducer;
