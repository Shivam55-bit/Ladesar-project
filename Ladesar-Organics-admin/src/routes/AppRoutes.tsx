import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { DashboardOverviewPage } from '../pages/DashboardOverviewPage';
import { ProductsPage } from '../pages/ProductsPage';
import { OrdersPage } from '../pages/OrdersPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { CouponsPage } from '../pages/CouponsPage';
import { AiStudioPage } from '../pages/AiStudioPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { WebsiteAppearancePage } from '../pages/WebsiteAppearancePage';
import { UsersPage } from '../pages/UsersPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverviewPage />,
      },
      {
        path: 'appearance',
        element: <WebsiteAppearancePage />,
      },
      {
        path: 'customizer',
        element: <Navigate to="/appearance" replace />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'coupons',
        element: <CouponsPage />,
      },
      {
        path: 'marketing',
        element: <Navigate to="/coupons" replace />,
      },
      {
        path: 'ai-studio',
        element: <AiStudioPage />,
      },
      {
        path: 'audit-logs',
        element: <AuditLogsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
