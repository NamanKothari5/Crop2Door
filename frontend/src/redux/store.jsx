import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import { userAPI } from "./api/userApi";
import { userReducer } from "./reducer/userReducer";
import { productAPI } from "./api/productApi";
import { orderAPI } from "./api/orderApi";

export const store = configureStore({
    reducer: {
        cart: cartSlice,
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]:productAPI.reducer,
        [orderAPI.reducerPath]:orderAPI.reducer,
        [userReducer.name]: userReducer.reducer
    },
    middleware: (getDefaultMiddleware) =>
        [...getDefaultMiddleware(), userAPI.middleware,productAPI.middleware,orderAPI.middleware],
    devTools: true
})