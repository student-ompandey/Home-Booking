import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, Menu, X, Plus, User, LogOut, Home } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, isOwner, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-dark transition-colors">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dark">
              Settel<span className="text-primary">Inn</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/rooms" className="px-4 py-2 text-sm font-medium text-gray-warm hover:text-dark transition-colors rounded-full hover:bg-gray-light">
              Explore
            </Link>

            {isOwner && (
              <Link to="/add-room" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-warm hover:text-dark transition-colors rounded-full hover:bg-gray-light">
                <Plus className="w-4 h-4" /> List Room
              </Link>
            )}

            <Link to="/wishlist" className="relative p-2 text-gray-warm hover:text-primary transition-colors rounded-full hover:bg-red-50">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-border rounded-full hover:shadow-md transition-shadow"
                >
                  <Menu className="w-4 h-4 text-gray-warm" />
                  <div className="w-7 h-7 bg-dark rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-border py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-border">
                        <p className="text-sm font-semibold text-dark">{user?.name}</p>
                        <p className="text-xs text-gray-warm">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark hover:bg-gray-light transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      {isOwner && (
                        <Link to="/my-rooms" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark hover:bg-gray-light transition-colors">
                          <Home className="w-4 h-4" /> My Rooms
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-dark hover:bg-gray-light rounded-full transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-border bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link to="/rooms" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-dark rounded-lg hover:bg-gray-light">Explore Rooms</Link>
            <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-dark rounded-lg hover:bg-gray-light">Wishlist ({wishlist.length})</Link>
            {isOwner && (
              <Link to="/add-room" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-dark rounded-lg hover:bg-gray-light">List a Room</Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-dark rounded-lg hover:bg-gray-light">Profile</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 text-sm font-medium border border-gray-border rounded-lg hover:bg-gray-light">Log in</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
