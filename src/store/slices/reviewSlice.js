import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  selectedProductReviews: [],
  userReviews: []
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    addReview: (state, action) => {
      state.reviews.push(action.payload);
      state.userReviews.push(action.payload);
    },
    updateReview: (state, action) => {
      const index = state.reviews.findIndex(r => r.Id === action.payload.Id);
      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
      const userIndex = state.userReviews.findIndex(r => r.Id === action.payload.Id);
      if (userIndex !== -1) {
        state.userReviews[userIndex] = action.payload;
      }
    },
    deleteReview: (state, action) => {
      state.reviews = state.reviews.filter(r => r.Id !== action.payload);
      state.userReviews = state.userReviews.filter(r => r.Id !== action.payload);
    },
    setSelectedProductReviews: (state, action) => {
      state.selectedProductReviews = action.payload;
    },
    setUserReviews: (state, action) => {
      state.userReviews = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setError,
  setReviews,
  addReview,
  updateReview,
  deleteReview,
  setSelectedProductReviews,
  setUserReviews,
  clearError
} = reviewSlice.actions;

export default reviewSlice.reducer;