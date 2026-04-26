import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark mb-8">Your Profile</h1>
      <div className="bg-white border border-gray-border rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-dark rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark">{user?.name}</h2>
            <span className="text-xs font-medium uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">{user?.role}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-light rounded-xl">
            <User className="w-5 h-5 text-gray-warm" />
            <div>
              <p className="text-xs text-gray-warm">Full Name</p>
              <p className="text-sm font-medium text-dark">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-light rounded-xl">
            <Mail className="w-5 h-5 text-gray-warm" />
            <div>
              <p className="text-xs text-gray-warm">Email</p>
              <p className="text-sm font-medium text-dark">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-light rounded-xl">
            <Shield className="w-5 h-5 text-gray-warm" />
            <div>
              <p className="text-xs text-gray-warm">Role</p>
              <p className="text-sm font-medium text-dark capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
