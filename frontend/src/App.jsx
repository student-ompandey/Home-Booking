import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import AddRoom from './pages/AddRoom';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import MyListings from './pages/MyListings';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <WishlistProvider>
            <Routes>
              {/* Public + User Layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/rooms/:id" element={<RoomDetail />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/add-room" element={<ProtectedRoute ownerOnly><AddRoom /></ProtectedRoute>} />
                <Route path="/my-listings" element={<ProtectedRoute ownerOnly><MyListings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/chat/:chatId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              </Route>
            </Routes>
            <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontSize: '14px', borderRadius: '12px' } }} />
          </WishlistProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
