import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedbackReducer from './slices/feedbackSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    feedback: feedbackReducer,
  },
});

export default store; 