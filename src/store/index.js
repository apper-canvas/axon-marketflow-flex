import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import reviewReducer from "./slices/reviewSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    review: reviewReducer,
  },
});