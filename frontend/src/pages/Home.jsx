import { Link } from 'react-router-dom';
import { Search, Building2, Home as HomeIcon, Users, Star, Heart, Share2, MapPin, Camera, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
  { icon: Building2, label: 'Apartments', type: 'apartment' },
  { icon: HomeIcon, label: 'PG / Hostels', type: 'pg' },
  { icon: Users, label: 'Shared Rooms', type: 'double' },
  { icon: Star, label: 'Suites', type: 'suite' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('Buy');

  return (
    <div className="bg-[#f8f8f9] min-h-screen text-black font-sans pb-20">
      
      {/* Massive Bento-Box Hero Section */}
      <section className="pt-28 md:pt-36 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 min-h-[800px] lg:h-[calc(100vh-140px)]">
          
          {/* Left Column: Architectural Image Card */}
          <div className="w-full lg:w-[45%] h-[600px] lg:h-full relative rounded-[32px] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" 
              alt="Modern Architecture" 
              className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-1000 group-hover:scale-105"
            />
            
            {/* Action Icons (Top Left) */}
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md rounded-full py-5 px-3 flex flex-col gap-5 items-center shadow-sm">
              <Heart className="w-4 h-4 text-black hover:text-gray-500 cursor-pointer transition-colors" />
              <Share2 className="w-4 h-4 text-black hover:text-gray-500 cursor-pointer transition-colors" />
              <MapPin className="w-4 h-4 text-black hover:text-gray-500 cursor-pointer transition-colors" />
              <Camera className="w-4 h-4 text-black hover:text-gray-500 cursor-pointer transition-colors" />
            </div>

            {/* Category Circles (Top Right) */}
            <div className="absolute top-6 right-6 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <Building2 className="w-4 h-4 text-black" />
              </div>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <HomeIcon className="w-4 h-4 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <Building2 className="w-4 h-4 text-black" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <HomeIcon className="w-4 h-4 text-black" />
              </div>
            </div>

            {/* Floating Label: Serenity Sanctuary */}
            <div className="absolute top-[35%] left-[8%] flex items-center gap-3">
               <div className="bg-white/40 backdrop-blur-md border border-white/20 text-white text-[13px] font-semibold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                  Serenity Sanctuary
               </div>
               <div className="w-2.5 h-2.5 rounded-full bg-black/80 ring-4 ring-black/20"></div>
            </div>

            {/* Floating Label: Bandung, West Java */}
            <div className="absolute top-[52%] right-[15%] flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full bg-black/80 ring-4 ring-black/20"></div>
               <div className="bg-white/40 backdrop-blur-md border border-white/20 text-white text-[13px] font-semibold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                  Bandung, West Java
               </div>
            </div>

            {/* Floating Label: Price */}
            <div className="absolute bottom-[28%] left-[25%] flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full bg-black/80 ring-4 ring-black/20"></div>
               <div className="bg-white/40 backdrop-blur-md border border-white/20 text-white text-[13px] font-semibold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                  $ 1051350.00
               </div>
            </div>

            {/* Floating Search Widget */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-[24px] p-4 lg:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex flex-col gap-4">
               {/* Tabs */}
               <div className="flex gap-2">
                 {['Buy', 'Sell', 'Rent'].map(tab => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`flex items-center gap-2 px-5 py-2 rounded-[12px] text-[13px] font-bold transition-all ${activeTab === tab ? 'bg-[#1a1a1a] text-white shadow-md' : 'bg-transparent text-gray-500 hover:bg-gray-100'}`}
                   >
                     {tab === 'Buy' && <Star className="w-3.5 h-3.5" />}
                     {tab === 'Sell' && <HomeIcon className="w-3.5 h-3.5" />}
                     {tab === 'Rent' && <Building2 className="w-3.5 h-3.5" />}
                     {tab}
                   </button>
                 ))}
               </div>
               
               {/* Inputs */}
               <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                  <div className="flex-1 w-full">
                     <p className="text-[12px] font-bold text-black mb-1">Property Type</p>
                     <p className="text-[13px] text-gray-500 truncate">Select Property Type</p>
                  </div>
                  <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>
                  <div className="flex-1 w-full">
                     <p className="text-[12px] font-bold text-black mb-1">Location</p>
                     <p className="text-[13px] text-gray-500 truncate">ex. Ambon City, Maluku</p>
                  </div>
                  <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>
                  <div className="flex-1 w-full">
                     <p className="text-[12px] font-bold text-black mb-1">Price</p>
                     <p className="text-[13px] text-gray-500 truncate">Minimum - Maximum</p>
                  </div>
                  <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
                     <button className="w-full md:w-12 h-12 bg-black text-white rounded-[16px] flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg">
                        <Search className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Typography & Stats */}
          <div className="w-full lg:w-[55%] h-full flex flex-col justify-between py-4 lg:py-6 pl-0 lg:pl-6">
            
            {/* Header Row */}
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-start pt-2">
                 <div className="w-[2px] h-14 bg-black rounded-full"></div>
                 <p className="text-[16px] lg:text-[18px] font-semibold leading-snug text-gray-600 max-w-[140px]">Unlock the Door to Your Future.</p>
              </div>
              <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-[16px] shadow-sm border border-gray-100">
                 <div className="flex flex-col items-center pl-1 pr-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mb-0.5" />
                    <span className="text-[13px] font-bold text-black">5.0</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                   <img src="https://i.pravatar.cc/150?img=32" alt="Agent" className="w-full h-full object-cover" />
                 </div>
              </div>
            </div>

            {/* Main Typography */}
            <div className="relative mt-16 mb-16 lg:mt-0 lg:mb-0">
              <p className="text-gray-400 font-bold text-[12px] tracking-[0.2em] uppercase mb-6 pl-1">DISCOVER</p>
              
              {/* Star SVG Top Right */}
              <svg className="absolute top-0 right-[15%] w-10 h-10 text-black hidden md:block" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>

              <h1 className="text-[52px] sm:text-[64px] lg:text-[76px] xl:text-[84px] leading-[1.05] font-bold tracking-tight text-black">
                Experience <br/>
                <span className="inline-block bg-[#1a1a1a] text-white px-6 lg:px-8 pt-1 pb-3 rounded-full align-middle my-1 shadow-lg border border-black/10">Excellence</span> in <br/>
                Every Square Foot.
              </h1>

              {/* Star SVG Bottom Left */}
              <svg className="absolute -bottom-10 left-[10%] w-6 h-6 text-black hidden md:block" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
            </div>

            {/* Bottom Stats Row */}
            <div className="flex flex-wrap lg:flex-nowrap items-end justify-between gap-6">
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-auto">
                  <div className="bg-white rounded-[24px] p-6 lg:p-8 w-full md:w-[160px] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform cursor-pointer">
                    <h3 className="text-[28px] lg:text-[32px] font-bold text-black mb-1">500+</h3>
                    <p className="text-[12px] text-gray-500 font-medium leading-tight">Happy<br/>Customers</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-[24px] p-6 lg:p-8 w-full md:w-[160px] shadow-xl hover:-translate-y-1 transition-transform cursor-pointer">
                    <h3 className="text-[28px] lg:text-[32px] font-bold text-white mb-1">200+</h3>
                    <p className="text-[12px] text-gray-400 font-medium leading-tight">Property<br/>Collection</p>
                  </div>
                  <div className="bg-white rounded-[24px] p-6 lg:p-8 w-full md:w-[160px] shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform cursor-pointer">
                    <h3 className="text-[28px] lg:text-[32px] font-bold text-black mb-1">1000+</h3>
                    <p className="text-[12px] text-gray-500 font-medium leading-tight">Year of<br/>Experience</p>
                  </div>
               </div>
               
               {/* Arrows */}
               <div className="flex gap-3 shrink-0 ml-auto pb-2">
                  <button className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors">
                    <ChevronLeft className="w-6 h-6 ml-0.5" />
                  </button>
                  <button className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors">
                    <ChevronRight className="w-6 h-6 mr-0.5" />
                  </button>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Re-styled Categories Section (Moved Below Fold) */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-24 mt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
           <div>
             <div className="flex gap-4 items-start mb-6">
                <div className="w-[2px] h-8 bg-black rounded-full"></div>
                <p className="text-[13px] font-bold tracking-widest uppercase text-gray-400 mt-1">CATEGORIES</p>
             </div>
             <h2 className="text-[40px] md:text-[56px] font-bold tracking-tight text-black leading-tight">
               Find your next <span className="inline-block bg-[#1a1a1a] text-white px-6 pt-1 pb-2 rounded-full align-middle shadow-lg border border-black/10 -mt-2">Stay</span>
             </h2>
           </div>
           
           <Link to="/rooms" className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-200 rounded-full text-[14px] font-bold text-black hover:bg-black hover:text-white transition-colors shadow-sm mb-2">
             Explore All <ChevronRight className="w-4 h-4" />
           </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.type}
              to={`/rooms?roomType=${cat.type}`}
              className="flex flex-col items-center justify-center gap-6 p-12 rounded-[32px] bg-white border border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-gray-100 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-20 h-20 rounded-full bg-[#f8f8f9] flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:scale-110 transition-all duration-500 relative z-10 shadow-sm border border-gray-100">
                 <cat.icon className="w-8 h-8 text-black group-hover:text-white transition-colors duration-300" />
              </div>
              
              <div className="text-center relative z-10 mt-2">
                <span className="text-[20px] font-bold text-black block">{cat.label}</span>
                <div className="h-0 opacity-0 group-hover:h-6 group-hover:opacity-100 transition-all duration-300 overflow-hidden mt-2">
                  <span className="text-[13px] text-gray-500 font-semibold">View Collection →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
