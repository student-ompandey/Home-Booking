import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';
import { Heart, Menu, X, Bell, User, LogOut, Home, Shield, MessageCircle } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
        
        {/* Logo (Left) */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <span className="text-[18px] md:text-[20px] font-bold tracking-tight text-black">
            SettelInn
          </span>
        </Link>

        {/* Center Nav (Desktop only) */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-black/60">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <Link to="/rooms" className="hover:text-black transition-colors">Explore</Link>
          <Link to="/services" className="hover:text-black transition-colors">Services</Link>
          <Link to="/about" className="hover:text-black transition-colors">About</Link>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="px-5 py-2 text-[13px] font-bold text-black border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-5 py-2 text-[13px] font-bold text-white bg-black rounded-full hover:bg-black/80 transition-colors">
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 text-black/70 hover:text-black hover:bg-gray-100 transition-colors rounded-full">
                <Heart className="w-4.5 h-4.5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  className="relative p-2 text-black/70 hover:text-black hover:bg-gray-100 transition-colors rounded-full"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 mt-4 w-80 max-h-96 overflow-y-auto bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 animate-fade-in z-50">
                      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-black text-[14px]">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-[12px] font-medium text-black/60 hover:text-black underline">Mark all read</button>
                        )}
                      </div>
                      {notifications.length > 0 ? (
                        <div className="flex flex-col">
                          {notifications.map(n => (
                            <div key={n._id} onClick={() => markAsRead(n._id)} className={`px-5 py-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors flex items-start gap-3`}>
                              <div className="mt-1.5 shrink-0">
                                <div className={`w-2 h-2 rounded-full ${!n.isRead ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                              </div>
                              <div>
                                <p className={`text-[13px] ${!n.isRead ? 'text-black font-semibold' : 'text-black/60 font-medium'}`}>{n.message}</p>
                                <span className="text-[11px] text-black/40 mt-1 block">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-5 py-8 text-center text-black/40 text-[13px]">
                          No notifications right now
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative ml-1">
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <span className="text-white text-[12px] font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-4 w-56 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 animate-fade-in z-50">
                      <div className="px-5 py-3 border-b border-gray-100 mb-1">
                        <p className="text-[14px] font-semibold text-black truncate">{user?.name}</p>
                        <p className="text-[12px] text-black/60 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium text-black hover:bg-gray-50 transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      {isOwner && (
                        <Link to="/my-listings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium text-black hover:bg-gray-50 transition-colors">
                          <Home className="w-4 h-4" /> My Listings
                        </Link>
                      )}
                      <Link to="/chat" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium text-black hover:bg-gray-50 transition-colors">
                        <MessageCircle className="w-4 h-4" /> Messages
                      </Link>
                      {isAdmin && (
                        <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium text-blue-600 hover:bg-gray-50 transition-colors">
                          <Shield className="w-4 h-4" /> Admin
                        </a>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium text-red-600 hover:bg-gray-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Log out
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
          <button className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-4 animate-fade-in z-50">
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-[14px] font-semibold text-black hover:bg-gray-50 rounded-xl">Home</Link>
            <Link to="/rooms" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-[14px] font-semibold text-black hover:bg-gray-50 rounded-xl">Explore</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-[14px] font-semibold text-black hover:bg-gray-50 rounded-xl">Services</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-[14px] font-semibold text-black hover:bg-gray-50 rounded-xl">About</Link>
            
            <div className="border-t border-gray-100 my-2"></div>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-[14px] font-semibold text-black hover:bg-gray-50 rounded-xl">Profile</Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-[14px] font-semibold text-black hover:bg-gray-50 rounded-xl">Wishlists</Link>
                <Link to="/chat" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-[14px] font-semibold text-black hover:bg-gray-50 rounded-xl">Messages</Link>
                <button onClick={handleLogout} className="text-left px-4 py-3 text-[14px] font-semibold text-red-600 hover:bg-gray-50 rounded-xl">Log out</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-3 text-center text-[14px] font-bold text-black border border-gray-200 rounded-full hover:bg-gray-50">Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-full py-3 text-center text-[14px] font-bold text-white bg-black rounded-full hover:bg-black/80">Signup</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
