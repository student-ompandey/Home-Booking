import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Home, Users, Clock, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminAPI.getStats();
        setStats(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    );
  }

  const cards = [
    { label: 'Total Rooms', value: stats?.totalRooms, icon: Home, color: 'bg-blue-500', link: '/admin/rooms' },
    { label: 'Pending Approval', value: stats?.pendingRooms, icon: Clock, color: 'bg-amber-500', link: '/admin/rooms?status=pending' },
    { label: 'Approved', value: stats?.approvedRooms, icon: CheckCircle, color: 'bg-green-500', link: '/admin/rooms?status=approved' },
    { label: 'Rejected', value: stats?.rejectedRooms, icon: XCircle, color: 'bg-red-500', link: '/admin/rooms?status=rejected' },
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'bg-purple-500', link: '/admin/users' },
    { label: 'Total Owners', value: stats?.totalOwners, icon: BarChart3, color: 'bg-indigo-500', link: '/admin/users?role=owner' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
        <p className="text-sm text-gray-warm mt-1">Overview of the SettelInn platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link key={card.label} to={card.link}
            className="bg-white rounded-2xl border border-gray-border p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <card.icon className="w-5.5 h-5.5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-dark">{card.value ?? 0}</p>
            <p className="text-sm text-gray-warm mt-1">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
