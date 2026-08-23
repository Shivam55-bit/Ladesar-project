import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';

// Initial empty auth slice reducer (to be populated later)
const authReducer = (state = { user: null, token: null }, action) => {
  switch(action.type) {
    case 'auth/login':
      return { ...state, ...action.payload };
    case 'auth/logout':
      return { user: null, token: null };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add the generated reducer as a specific top-level slice
    [baseApi.reducerPath]: baseApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
