import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms from './pages/admin/AdminRooms';
import AdminUsers from './pages/admin/AdminUsers';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Redirect root to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Admin Layout */}
          <Route element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Routes>
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontSize: '14px', borderRadius: '12px' } }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
