import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import blogReducer from './blogSlice';
import commentReducer from './commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    comments: commentReducer
  }
});