import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, MapPin, Mail, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) errs.password = 'Must include uppercase, lowercase, and number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await register(form);
    if (result.success) {
      toast.success('Account created! Welcome to SettelInn 🎉');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#e5e5e5]">
      <div className="w-full max-w-[1000px] bg-[#1a1a1a] rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* Left Side (Dark Content) */}
        <div className="w-full md:w-[55%] p-10 md:p-14 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 text-white text-[12px] font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Start Your Journey
            </div>
            
            <h1 className="text-[36px] md:text-[44px] leading-[1.1] font-bold mb-6 tracking-tight text-white">
              Create Your<br />Digital Future
            </h1>
            
            <p className="text-gray-200 text-[14px] leading-relaxed max-w-[340px] mb-12">
              Ready to launch your next adventure? Fill out the form or reach out directly to start a conversation about your travel needs and how we can help you grow.
            </p>
          </div>

          {/* Contact Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] text-gray-100 font-medium">+1(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] text-gray-100 font-medium">San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] text-gray-100 font-medium">hello@settelinn.com</span>
            </div>
          </div>
        </div>

        {/* Right Side (White Form) */}
        <div className="w-full md:w-[45%] p-4 md:p-6 flex items-stretch">
          <div className="w-full bg-white rounded-[24px] p-8 lg:p-10 flex flex-col justify-center">
             <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-[320px] mx-auto">
                <div>
                   <label className="text-[13px] font-semibold text-black/80 mb-1.5 block pl-1">Your Name</label>
                   <input 
                      type="text" 
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Name" 
                      className="w-full bg-[#f4f4f5] border-none rounded-[14px] py-3.5 px-5 text-black placeholder:text-gray-400 outline-none focus:bg-gray-200 transition-colors text-[14px] font-medium" 
                   />
                </div>

                <div>
                   <label className="text-[13px] font-semibold text-black/80 mb-1.5 block pl-1">Your Email</label>
                   <input 
                      type="email" 
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Email address" 
                      className="w-full bg-[#f4f4f5] border-none rounded-[14px] py-3.5 px-5 text-black placeholder:text-gray-400 outline-none focus:bg-gray-200 transition-colors text-[14px] font-medium" 
                   />
                </div>
                
                <div>
                   <label className="text-[13px] font-semibold text-black/80 mb-1.5 block pl-1">Your Password</label>
                   <div className="relative">
                     <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Password" 
                        className="w-full bg-[#f4f4f5] border-none rounded-[14px] py-3.5 pl-5 pr-12 text-black placeholder:text-gray-400 outline-none focus:bg-gray-200 transition-colors text-[14px] font-medium" 
                     />
                     <button 
                       type="button" 
                       onClick={() => setShowPassword(!showPassword)} 
                       className="absolute right-0 top-0 bottom-0 px-4 text-gray-500 hover:text-black transition-colors flex items-center justify-center"
                     >
                       {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                     </button>
                   </div>
                </div>

                {/* Role Selection */}
                <div>
                   <label className="text-[13px] font-semibold text-black/80 mb-1.5 block pl-1">Account Type</label>
                   <div className="flex gap-2">
                     <button
                       type="button"
                       onClick={() => setForm({ ...form, role: 'user' })}
                       className={`flex-1 py-2.5 rounded-[12px] text-[13px] font-bold transition-colors ${form.role === 'user' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f4f4f5] text-gray-500 hover:bg-gray-200'}`}
                     >
                       Book stays
                     </button>
                     <button
                       type="button"
                       onClick={() => setForm({ ...form, role: 'owner' })}
                       className={`flex-1 py-2.5 rounded-[12px] text-[13px] font-bold transition-colors ${form.role === 'owner' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f4f4f5] text-gray-500 hover:bg-gray-200'}`}
                     >
                       Host my home
                     </button>
                   </div>
                </div>

                {(errors.name || errors.email || errors.password) && (
                  <p className="text-[12px] font-bold text-red-600 pl-1 mt-1">
                    {errors.name || errors.email || errors.password}
                  </p>
                )}

                <div className="mt-2 flex items-center justify-between gap-5">
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="bg-[#1a1a1a] text-white pl-4 pr-6 py-3.5 rounded-full text-[14px] font-bold flex items-center gap-3 hover:bg-black transition-colors shadow-lg disabled:opacity-50"
                   >
                     <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                       <Send className="w-3.5 h-3.5 text-black -ml-0.5" />
                     </div>
                     {loading ? 'Submitting...' : 'Submit'}
                   </button>
                   
                   <Link to="/login" className="text-[13px] font-bold text-gray-500 hover:text-black hover:underline transition-colors">
                     Or Log In
                   </Link>
                </div>
             </form>
          </div>
        </div>

      </div>
    </div>
  );
}
