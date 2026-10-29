import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GuestDashboard from './pages/GuestDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import InvoicePage from './pages/InvoicePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="hotels" element={<HotelsPage />} />
            <Route path="hotels/:id" element={<HotelDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="invoice/:id" element={<InvoicePage />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Guest Portal */}
            <Route
              path="guest"
              element={
                <ProtectedRoute allowedRoles={['guest', 'admin']}>
                  <GuestDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="guest/services"
              element={
                <ProtectedRoute allowedRoles={['guest', 'admin']}>
                  <GuestDashboard />
                </ProtectedRoute>
              }
            />

            {/* Staff Portal */}
            <Route
              path="staff"
              element={
                <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="staff/housekeeping"
              element={
                <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="staff/services"
              element={
                <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />

            {/* Hotel Manager Portal */}
            <Route
              path="manager"
              element={
                <ProtectedRoute allowedRoles={['manager', 'admin']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="manager/inventory"
              element={
                <ProtectedRoute allowedRoles={['manager', 'admin']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Platform Administrator Portal */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/hotels"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/audit"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
