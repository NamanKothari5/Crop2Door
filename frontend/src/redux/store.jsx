import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import { userAPI } from "./api/userApi";
import { userReducer } from "./reducer/userReducer";
import { productAPI } from "./api/productApi";

export const store = configureStore({
    reducer: {
        cart: cartSlice,
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]:productAPI.reducer,
        [userReducer.name]: userReducer.reducer
    },
    middleware: (getDefaultMiddleware) =>
        [...getDefaultMiddleware(), userAPI.middleware,productAPI.middleware],
    devTools: true
})