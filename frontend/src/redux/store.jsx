import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import { userAPI } from "./api/userApi";
import { userReducer } from "./reducer/userReducer";


export const store = configureStore({
    reducer: {
        cart: cartSlice,
        [userAPI.reducerPath]: userAPI.reducer,
        [userReducer.name]: userReducer.reducer
    },
    middleware: (getDefaultMiddleware) =>
        [...getDefaultMiddleware(), userAPI.middleware],
    devTools: true
})