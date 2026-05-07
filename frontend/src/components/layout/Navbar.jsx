import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';
import { Heart, Menu, X, Bell, User, LogOut, Home, Shield, MessageCircle, MapPin } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function Navbar() {
  const { user, isAuthenticated, isOwner, isAdmin, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setProfileOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo (Left) */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 text-rose-500 hover:text-rose-600 transition-colors">
          <MapPin className="w-8 h-8 fill-rose-500 text-white" />
          <span className="text-2xl font-bold tracking-tight">SettelInn</span>
        </Link>

        {/* Center Nav (Desktop only) */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600">
          <Link to="/" className="hover:text-rose-500 transition-colors">Home</Link>
          <Link to="/rooms" className="hover:text-rose-500 transition-colors">Find a Room</Link>
          <Link to="/services" className="hover:text-rose-500 transition-colors">Services</Link>
          <Link to="/about" className="hover:text-rose-500 transition-colors">About Us</Link>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="px-4 py-2 text-[15px] font-semibold text-gray-700 hover:text-rose-500 transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="px-5 py-2.5 text-[15px] font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors shadow-sm">
                Sign up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-rose-500 hover:bg-gray-50 transition-colors rounded-full">
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  className={`relative p-2 rounded-full transition-colors ${notifOpen ? 'bg-gray-100 text-rose-500' : 'text-gray-600 hover:bg-gray-50 hover:text-rose-500'}`}
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 mt-3 w-80 max-h-[400px] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 text-[15px]">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-[13px] font-medium text-rose-500 hover:text-rose-600">Mark all read</button>
                        )}
                      </div>
                      {notifications.length > 0 ? (
                        <div className="flex flex-col">
                          {notifications.map(n => (
                            <div key={n._id} onClick={() => markAsRead(n._id)} className={`px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors flex items-start gap-3`}>
                              <div className="mt-1 shrink-0">
                                <div className={`w-2.5 h-2.5 rounded-full ${!n.isRead ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                              </div>
                              <div>
                                <p className={`text-[14px] leading-snug ${!n.isRead ? 'text-gray-900 font-semibold' : 'text-gray-600 font-medium'}`}>{n.message}</p>
                                <span className="text-[12px] font-medium text-gray-400 mt-1 block">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500 font-medium text-[14px]">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center hover:shadow-md transition-shadow"
                >
                  <span className="text-gray-700 text-[15px] font-bold uppercase">
                    {user?.name?.charAt(0)}
                  </span>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 mb-2">
                        <p className="text-[15px] font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-[13px] font-medium text-gray-500 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        <User className="w-5 h-5 text-gray-400" /> My Profile
                      </Link>
                      {isOwner && (
                        <Link to="/my-listings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                          <Home className="w-5 h-5 text-gray-400" /> My Listings
                        </Link>
                      )}
                      <Link to="/chat" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        <MessageCircle className="w-5 h-5 text-gray-400" /> Messages
                      </Link>
                      {isAdmin && (
                        <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                          <Shield className="w-5 h-5 text-blue-500" /> Admin Dashboard
                        </a>
                      )}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-5 h-5 text-red-500" /> Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 pt-2 pb-6 flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="px-3 py-3 text-[16px] font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Home</Link>
            <Link to="/rooms" onClick={() => setMobileOpen(false)} className="px-3 py-3 text-[16px] font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Find a Room</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)} className="px-3 py-3 text-[16px] font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Services</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="px-3 py-3 text-[16px] font-medium text-gray-900 hover:bg-gray-50 rounded-lg">About Us</Link>
            
            <div className="border-t border-gray-100 my-2"></div>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-3 py-3 text-[16px] font-medium text-gray-900 hover:bg-gray-50 rounded-lg">My Profile</Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="px-3 py-3 text-[16px] font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Wishlists</Link>
                <Link to="/chat" onClick={() => setMobileOpen(false)} className="px-3 py-3 text-[16px] font-medium text-gray-900 hover:bg-gray-50 rounded-lg">Messages</Link>
                <button onClick={handleLogout} className="text-left px-3 py-3 text-[16px] font-medium text-red-600 hover:bg-red-50 rounded-lg">Log out</button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-3 px-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-3 text-center text-[15px] font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Log in</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-full py-3 text-center text-[15px] font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-600">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
