import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Home, Users, LogOut, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/rooms', icon: Home, label: 'Rooms' },
  { to: '/admin/users', icon: Users, label: 'Users' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-slate-700">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold">Settel<span className="text-primary">Inn</span></span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/admin' && location.pathname.startsWith(item.to));
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold">Admin</span>
        <div className="flex gap-2">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className={`p-2 rounded-lg ${location.pathname === item.to ? 'bg-primary' : 'hover:bg-slate-800'}`}>
              <item.icon className="w-4.5 h-4.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:p-8 p-4 pt-16 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
