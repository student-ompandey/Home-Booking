import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_BADGE = {
  user: 'bg-blue-100 text-blue-700',
  owner: 'bg-purple-100 text-purple-700',
  admin: 'bg-red-100 text-red-700',
};

export default function AdminUsers() {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (roleFilter) params.role = roleFilter;
      const { data } = await adminAPI.getUsers(params);
      setUsers(data.data);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, page]);

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'block' : 'unblock';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    
    setActionLoading(id);
    try {
      await adminAPI.toggleUserStatus(id);
      toast.success(`User ${action}ed successfully`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Users</h1>
          <p className="text-sm text-gray-warm mt-1">{pagination.total ?? 0} total users</p>
        </div>
        <div className="flex gap-2">
          {['', 'user', 'owner', 'admin'].map((r) => (
            <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize ${roleFilter === r ? 'bg-dark text-white border-dark' : 'border-gray-border text-gray-warm hover:border-dark'}`}>
              {r || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-border">
                  <th className="text-left px-4 py-3 font-semibold text-gray-warm">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-warm">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-warm">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-warm hidden md:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-warm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-border">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-dark rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-medium text-dark">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-warm">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${u.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive !== false ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-warm text-xs hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleToggleStatus(u._id, u.isActive !== false)}
                          disabled={actionLoading === u._id}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                            u.isActive !== false 
                              ? 'text-red-500 hover:bg-red-50' 
                              : 'text-emerald-500 hover:bg-emerald-50'
                          }`}
                          title={u.isActive !== false ? 'Block User' : 'Unblock User'}
                        >
                          {u.isActive !== false ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="p-2 rounded-lg border border-gray-border hover:bg-gray-light disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-warm px-3">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage(page + 1)} disabled={!pagination.hasNext} className="p-2 rounded-lg border border-gray-border hover:bg-gray-light disabled:opacity-30 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
