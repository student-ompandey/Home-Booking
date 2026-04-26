import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';
import { Heart, Menu, X, Plus, User, LogOut, Home, Shield, Bell, MessageCircle } from 'lucide-react';
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
  };

  return (
    <nav className="sticky top-0 z-50 glass-heavy border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Settel<span className="text-gradient">Inn</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/rooms" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5">
              Explore
            </Link>

            {isOwner && (
              <Link to="/add-room" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5">
                <Plus className="w-4 h-4" /> List Room
              </Link>
            )}

            <Link to="/wishlist" className="relative p-2 text-gray-300 hover:text-primary transition-colors rounded-full hover:bg-primary/10">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(124,58,237,0.8)]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2">
                {/* Messages */}
                <Link to="/chat" className="relative p-2 text-gray-300 hover:text-secondary transition-colors rounded-full hover:bg-secondary/10">
                  <MessageCircle className="w-5 h-5" />
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                    className="relative p-2 text-gray-300 hover:text-accent transition-colors rounded-full hover:bg-accent/10"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0B0F19] shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                    )}
                  </button>

                  {notifOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                      <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto glass rounded-xl shadow-2xl border border-white/10 py-2 animate-fade-in z-50">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                          <h3 className="font-semibold text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs text-primary hover:text-primary-light">Mark all read</button>
                          )}
                        </div>
                        {notifications.length > 0 ? (
                          <div className="flex flex-col">
                            {notifications.map(n => (
                              <div key={n._id} onClick={() => markAsRead(n._id)} className={`px-4 py-3 border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-primary/10' : ''}`}>
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5">
                                    <div className={`w-2 h-2 rounded-full ${!n.isRead ? 'bg-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]' : 'bg-transparent'}`}></div>
                                  </div>
                                  <div>
                                    <p className={`text-sm ${!n.isRead ? 'text-white font-medium' : 'text-gray-400'}`}>{n.message}</p>
                                    <span className="text-[10px] text-gray-500 mt-1 block">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500 text-sm">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            No notifications yet
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 px-2.5 py-1.5 border border-white/10 rounded-full hover:border-white/20 hover:bg-white/5 transition-all"
                  >
                    <Menu className="w-4 h-4 text-gray-300" />
                    <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-2xl border border-white/10 py-2 animate-fade-in z-50">
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-sm font-semibold text-white">{user?.name}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        {isOwner && (
                          <Link to="/my-listings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                            <Home className="w-4 h-4" /> My Listings
                          </Link>
                        )}
                        {isAdmin && (
                          <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-medium hover:bg-primary/10 transition-colors">
                            <Shield className="w-4 h-4" /> Admin Dashboard
                          </a>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-full transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="btn-gradient px-5 py-2 text-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2 text-gray-300 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-heavy border-t border-white/10 animate-fade-in absolute w-full">
          <div className="px-4 py-3 space-y-1">
            <Link to="/rooms" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5">Explore Rooms</Link>
            <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5">Wishlist ({wishlist.length})</Link>
            {isOwner && (
              <Link to="/add-room" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5">List a Room</Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5">Profile</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-gray-300 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white">Log in</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 btn-gradient text-center px-4 py-2.5 text-sm rounded-lg">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
