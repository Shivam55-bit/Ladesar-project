import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { AppRoutes } from './routes/AppRoutes.tsx';

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </AuthProvider>
  );
}
