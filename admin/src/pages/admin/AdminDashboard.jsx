import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Home, Users, Clock, CheckCircle, XCircle, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getAnalytics()
        ]);
        setStats(statsRes.data.data);
        setAnalytics(analyticsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'bg-indigo-500', bg: 'bg-indigo-50', link: '/admin/users' },
    { label: 'Total Rooms', value: stats?.totalRooms, icon: Home, color: 'bg-emerald-500', bg: 'bg-emerald-50', link: '/admin/rooms' },
    { label: 'Pending Approvals', value: stats?.pendingRooms, icon: Clock, color: 'bg-amber-500', bg: 'bg-amber-50', link: '/admin/rooms?status=pending' },
    { label: 'Total Bookings', value: stats?.totalBookings, icon: Calendar, color: 'bg-violet-500', bg: 'bg-violet-50', link: '/admin/bookings' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Platform overview, analytics, and recent activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <Link key={card.label} to={card.link} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${card.color}`}></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-bold text-slate-800">{card.value ?? 0}</p>
              <p className="text-sm text-slate-500 font-medium mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Analytics Charts */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Line Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-800">User Growth</h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.userGrowth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Room Uploads Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Home className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-slate-800">Room Uploads</h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.roomUploads} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="rooms" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Room Types Pie Chart & Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Room Type Distribution</h2>
              <div className="h-64 w-full flex items-center justify-center relative">
                {analytics.roomTypes.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.roomTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.roomTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-400 text-sm">No data available</p>
                )}
                
                {/* Custom Legend */}
                {analytics.roomTypes.length > 0 && (
                  <div className="absolute top-0 right-0 space-y-2">
                    {analytics.roomTypes.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="capitalize">{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h2>
              <div className="flex-1 overflow-y-auto space-y-4">
                {/* Mocking recent activities since Notifications might not be globally shared for admin */}
                <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-800"><span className="font-semibold">New User Registration</span></p>
                    <p className="text-xs text-slate-500 mt-0.5">A new user joined the platform.</p>
                    <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-800"><span className="font-semibold">Room Approved</span></p>
                    <p className="text-xs text-slate-500 mt-0.5">Admin approved a new PG listing.</p>
                    <p className="text-[10px] text-slate-400 mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-800"><span className="font-semibold">Room Pending</span></p>
                    <p className="text-xs text-slate-500 mt-0.5">Owner uploaded a new property.</p>
                    <p className="text-[10px] text-slate-400 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
