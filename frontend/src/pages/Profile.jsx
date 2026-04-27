import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadAPI, userAPI } from '../services/api';
import { User, Mail, Shield, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await uploadAPI.uploadImage(formData);
      const imageUrl = uploadRes.data.data.url;

      // 2. Update user profile
      const updateRes = await userAPI.updateProfile({ avatar: imageUrl });
      
      // 3. Update global auth state
      setUser(updateRes.data.data);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark mb-8">Your Profile</h1>
      <div className="bg-white border border-gray-border rounded-2xl p-8">
        <div className="flex items-center gap-6 mb-8">
          
          {/* Clickable Avatar */}
          <div className="relative group cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-100 shadow-sm relative">
              {uploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
              )}
              
              {/* Hover Overlay */}
              {!uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            
            {/* Hidden Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-dark">{user?.name}</h2>
            <span className="text-[12px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mt-1 inline-block">{user?.role}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-[#f8f8f9] rounded-xl border border-gray-100">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-[12px] font-bold tracking-widest uppercase text-gray-400">Full Name</p>
              <p className="text-[15px] font-bold text-black">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-[#f8f8f9] rounded-xl border border-gray-100">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-[12px] font-bold tracking-widest uppercase text-gray-400">Email</p>
              <p className="text-[15px] font-bold text-black">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-[#f8f8f9] rounded-xl border border-gray-100">
            <Shield className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-[12px] font-bold tracking-widest uppercase text-gray-400">Role</p>
              <p className="text-[15px] font-bold text-black capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
