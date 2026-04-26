import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Home } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(form);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-light px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-dark">Welcome back</h1>
            <p className="text-sm text-gray-warm mt-1">Log in to your SettelInn account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.email ? 'border-red-400' : 'border-gray-border'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 pr-10 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.password ? 'border-red-400' : 'border-gray-border'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-warm hover:text-dark">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-warm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
