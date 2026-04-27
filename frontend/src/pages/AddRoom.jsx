import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI, uploadAPI } from '../services/api';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import LocationPicker from '../components/rooms/LocationPicker';

const ROOM_TYPES = ['single', 'double', 'suite', 'apartment', 'hostel', 'pg'];
const AMENITY_OPTIONS = ['wifi', 'ac', 'kitchen', 'parking', 'tv', 'geyser', 'laundry', 'gym', 'security', 'furnished'];

export default function AddRoom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [form, setForm] = useState({
    title: '', price: '', location: '', description: '', roomType: 'apartment', amenities: [], images: [],
    coordinates: { lat: 28.6139, lng: 77.2090 } // Default Delhi
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.title || form.title.length < 3) errs.title = 'Title must be at least 3 characters';
    if (!form.price || form.price <= 0) errs.price = 'Enter a valid price';
    if (!form.location) errs.location = 'Location is required';
    if (!form.description || form.description.length < 10) errs.description = 'Description must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

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
      setLoadingImage(true);
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadAPI.uploadImage(formData);
      setForm((prev) => ({ ...prev, images: [...prev.images, res.data.data.url] }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setLoadingImage(false);
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      await roomAPI.create(payload);
      toast.success('Room listed successfully! 🎉');
      navigate('/my-rooms');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-2xl font-bold text-dark mb-2">List a New Room</h1>
      <p className="text-sm text-gray-warm mb-8">Fill in the details to publish your room on SettelInn.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Room Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., Cozy Studio near Metro" className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.title ? 'border-red-400' : 'border-gray-border'}`} />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        {/* Price + Type */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Price (₹/month)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="8500" className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.price ? 'border-red-400' : 'border-gray-border'}`} />
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Room Type</label>
            <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border border-gray-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
              {ROOM_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Location Name</label>
          <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g., Andheri West, Mumbai" className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.location ? 'border-red-400' : 'border-gray-border'}`} />
          {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
        </div>

        {/* Map Coordinates */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Pin Exact Location</label>
          <p className="text-xs text-gray-warm mb-3">Click on the map to set the exact location of your room.</p>
          <LocationPicker 
            position={form.coordinates} 
            onChange={(coords) => setForm({ ...form, coordinates: coords })} 
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4} placeholder="Describe the room, nearby landmarks, rules, etc."
            className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${errors.description ? 'border-red-400' : 'border-gray-border'}`} />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((a) => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors capitalize ${form.amenities.includes(a) ? 'bg-primary/10 border-primary text-primary' : 'border-gray-border text-gray-warm hover:border-gray-warm'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-dark mb-2">Images</label>
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm active:scale-95">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            
            {loadingImage ? (
              <div className="w-24 h-24 border-2 border-gray-100 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mb-1 text-black" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-black">Uploading</span>
              </div>
            ) : (
              <label className="w-24 h-24 border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-black transition-colors cursor-pointer active:scale-95">
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </label>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? 'Publishing...' : <><Plus className="w-4 h-4" /> Publish Room</>}
        </button>
      </form>
    </div>
  );
}
