import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { CheckCircle, XCircle, Trash2, Eye, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_BADGE = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminRooms() {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await adminAPI.getRooms(params);
      setRooms(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, [statusFilter, page]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await adminAPI.approveRoom(id);
      toast.success('Room approved ✓');
      fetchRooms();
    } catch { toast.error('Failed to approve'); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (id) => {
    const reason = prompt('Rejection reason (optional):');
    setActionLoading(id);
    try {
      await adminAPI.rejectRoom(id, reason || '');
      toast.success('Room rejected');
      fetchRooms();
    } catch { toast.error('Failed to reject'); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this room?')) return;
    setActionLoading(id);
    try {
      await adminAPI.deleteRoom(id);
      toast.success('Room deleted');
      fetchRooms();
    } catch { toast.error('Failed to delete'); }
    finally { setActionLoading(null); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">Manage Rooms</h1>
          <p className="text-sm text-gray-warm mt-1">{pagination.total ?? 0} total rooms</p>
        </div>
        <div className="flex gap-2">
          {['', 'pending', 'approved', 'rejected'].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize ${statusFilter === s ? 'bg-dark text-white border-dark' : 'border-gray-border text-gray-warm hover:border-dark'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 text-gray-warm">No rooms found</div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-border">
                    <th className="text-left px-4 py-3 font-semibold text-gray-warm">Room</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-warm hidden md:table-cell">Owner</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-warm">Price</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-warm">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-warm hidden lg:table-cell">Date</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-warm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-border">
                  {rooms.map((room) => (
                    <tr key={room._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={room.images?.[0] || `https://placehold.co/48x48/F7F7F7/717171?text=${room.roomType?.charAt(0)}`}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-light shrink-0" alt="" />
                          <div className="min-w-0">
                            <p className="font-medium text-dark truncate max-w-[200px]">{room.title}</p>
                            <p className="text-xs text-gray-warm truncate">{room.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-dark text-sm">{room.owner?.name}</p>
                        <p className="text-xs text-gray-warm">{room.owner?.email}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-dark">₹{room.price?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${STATUS_BADGE[room.status]}`}>
                          {room.status === 'pending' && <Clock className="w-3 h-3" />}
                          {room.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {room.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {room.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-warm text-xs hidden lg:table-cell">
                        {new Date(room.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {room.status !== 'approved' && (
                            <button onClick={() => handleApprove(room._id)} disabled={actionLoading === room._id}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-40" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {room.status !== 'rejected' && (
                            <button onClick={() => handleReject(room._id)} disabled={actionLoading === room._id}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-40" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(room._id)} disabled={actionLoading === room._id}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(page - 1)} disabled={!pagination.hasPrev}
                className="p-2 rounded-lg border border-gray-border hover:bg-gray-light disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-warm px-3">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage(page + 1)} disabled={!pagination.hasNext}
                className="p-2 rounded-lg border border-gray-border hover:bg-gray-light disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
