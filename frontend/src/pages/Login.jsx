import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, MapPin } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gray-50 pt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors">
            <MapPin className="w-8 h-8 fill-rose-500 text-white" />
            <span className="text-2xl font-bold tracking-tight">SettelInn</span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Welcome back</h1>
        <p className="text-center text-gray-500 text-sm mb-8">Log in to manage your bookings and account.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1.5 block">Email address</label>
            <input 
              type="email" 
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" 
              className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm font-medium" 
            />
            {errors.email && <p className="text-xs font-bold text-red-500 mt-1.5">{errors.email}</p>}
          </div>
          
          <div>
            <label className="text-sm font-bold text-gray-700 mb-1.5 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" 
                className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm font-medium" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-0 top-0 bottom-0 px-4 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs font-bold text-red-500 mt-1.5">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-rose-500 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">Don't have an account? </span>
            <Link to="/signup" className="text-sm font-bold text-rose-500 hover:text-rose-600 hover:underline transition-colors">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
