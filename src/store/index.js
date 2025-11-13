import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import reviewReducer from "./slices/reviewSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    review: reviewReducer,
  },
});