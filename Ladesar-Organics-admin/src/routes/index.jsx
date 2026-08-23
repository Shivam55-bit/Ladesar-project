import React from 'react';
import Login from '../modules/auth/pages/Login';

const Dashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p>Welcome to Ladesar Organics Admin.</p></div>;
const Products = () => <div className="p-6"><h1 className="text-2xl font-bold">Products Management</h1></div>;
const Orders = () => <div className="p-6"><h1 className="text-2xl font-bold">Orders Management</h1></div>;

export const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    // TODO: Add ProtectedRoute wrapper here
    element: <Dashboard />,
  },
  {
    path: '/products',
    // TODO: Add ProtectedRoute wrapper here
    element: <Products />,
  },
  {
    path: '/orders',
    // TODO: Add ProtectedRoute wrapper here
    element: <Orders />,
  },
  {
    path: '*',
    element: <div className="p-6"><h1 className="text-2xl font-bold">404 - Page Not Found</h1></div>
  }
];
