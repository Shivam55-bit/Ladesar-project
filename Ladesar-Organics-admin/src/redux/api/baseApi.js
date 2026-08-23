import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our base API with authentication logic
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Update with actual backend URL
    prepareHeaders: (headers, { getState }) => {
      // If we have a token in state, let's assume that we should be passing it.
      const token = getState().auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Define tag types for caching and invalidation
  tagTypes: ['User', 'Product', 'Order', 'Category', 'Inventory'],
  endpoints: () => ({}), // Endpoints will be injected from other slices
});
