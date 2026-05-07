import { Link, useNavigate } from 'react-router-dom';
import { Search, Building2, Home as HomeIcon, Users, Star, MapPin, ChevronRight, ShieldCheck, Sparkles, Clock, Heart } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
  { icon: Building2, label: 'Apartments', type: 'apartment', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800' },
  { icon: HomeIcon, label: 'Villas', type: 'villa', img: 'https://images.unsplash.com/photo-1613490908236-0ed71ca2cebb?auto=format&fit=crop&q=80&w=800' },
  { icon: Users, label: 'PG / Shared', type: 'pg', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800' },
  { icon: Star, label: 'Suites', type: 'suite', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800' },
];

const FEATURED_ROOMS = [
  { id: '1', title: 'Minimalist Studio in Manhattan', location: 'New York, USA', price: 250, rating: 4.9, img: 'https://images.unsplash.com/photo-1502672260266-1c1ea5250831?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'Luxury Villa with Private Pool', location: 'Bali, Indonesia', price: 850, rating: 5.0, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Modern Apartment Downtown', location: 'London, UK', price: 320, rating: 4.8, img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'Cozy Mountain Cabin', location: 'Aspen, Colorado', price: 400, rating: 4.7, img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('Rent');
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans pb-20">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center justify-center min-h-[600px] md:min-h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000" 
            alt="Beautiful Home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
            Find a place you'll love to stay
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 font-medium">
            Discover thousands of apartments, villas, and suites around the world.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl md:rounded-full p-4 shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full px-4 border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1 text-left">Location</label>
              <input type="text" placeholder="Where are you going?" className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 outline-none" />
            </div>
            <div className="flex-1 w-full px-4">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1 text-left">Property Type</label>
              <select className="w-full text-sm font-medium text-gray-900 outline-none bg-transparent cursor-pointer">
                <option value="">Any Type</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="pg">PG / Shared</option>
              </select>
            </div>
            <div className="w-full md:w-auto shrink-0 mt-2 md:mt-0">
              <button 
                onClick={() => navigate('/rooms')} 
                className="w-full md:w-auto px-8 py-3.5 bg-rose-500 text-white font-bold rounded-xl md:rounded-full flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors shadow-md"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EXPLORE CATEGORIES ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore Categories</h2>
          <p className="text-gray-500 text-lg">Browse properties by their specific types.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.type}
              to={`/rooms?roomType=${cat.type}`}
              className="group block relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                <cat.icon className="w-6 h-6 mb-2" />
                <h3 className="text-xl font-bold">{cat.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Places</h2>
              <p className="text-gray-500 text-lg">Handpicked places for your next stay.</p>
            </div>
            <Link to="/rooms" className="hidden md:flex items-center gap-1 text-rose-500 font-semibold hover:text-rose-600">
              View All <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {FEATURED_ROOMS.map((room) => (
               <div 
                  key={room.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-lg transition-shadow group cursor-pointer border border-gray-100"
                  onClick={() => navigate('/rooms')}
               >
                 <div className="w-full h-56 overflow-hidden relative">
                    <img src={room.img} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white text-gray-400 hover:text-rose-500 transition-colors shadow-sm">
                      <Heart className="w-5 h-5" />
                    </button>
                 </div>
                 <div className="p-5">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="text-lg font-bold text-gray-900 leading-tight truncate mr-2">{room.title}</h3>
                     <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 shrink-0">
                       <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                       {room.rating}
                     </div>
                   </div>
                   <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                     <MapPin className="w-4 h-4" /> {room.location}
                   </p>
                   <p className="text-lg font-bold text-gray-900">${room.price} <span className="text-sm font-normal text-gray-500">/night</span></p>
                 </div>
               </div>
             ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/rooms" className="inline-flex items-center gap-2 text-rose-500 font-semibold border border-rose-200 px-6 py-3 rounded-xl hover:bg-rose-50">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Book With Us</h2>
          <p className="text-gray-500 text-lg">We provide the best experience from start to finish.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Bookings</h3>
            <p className="text-gray-500 leading-relaxed">Your payments are protected, and every host is verified to ensure your safety and comfort.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Assured</h3>
            <p className="text-gray-500 leading-relaxed">We maintain high standards. Every property meets our strict cleanliness and quality guidelines.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
            <p className="text-gray-500 leading-relaxed">Our dedicated customer support team is always available to assist you at any time.</p>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-rose-50 rounded-3xl p-10 md:p-16 flex flex-col items-center text-center border border-rose-100">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to host your property?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Join thousands of hosts earning extra income by listing their spaces on SettelInn. It's free and easy to get started.</p>
          <button onClick={() => navigate('/add-room')} className="px-8 py-4 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors shadow-md">
            Become a Host
          </button>
        </div>
      </section>

    </div>
  );
}
