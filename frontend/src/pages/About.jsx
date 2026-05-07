import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Star, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-[#f8f8f9] min-h-screen text-black pb-32">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-48">
        
        {/* Simple Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
           <div className="w-full md:w-[60%]">
             <div className="flex gap-4 items-start mb-6">
                <div className="w-1 h-8 bg-rose-500 rounded-full"></div>
                <p className="text-sm font-bold tracking-widest uppercase text-rose-500 mt-1">OUR STORY</p>
             </div>
             <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
               Redefining the <br className="hidden md:block"/>
               <span className="text-rose-500">Standard</span> of Living.
             </h1>
           </div>
           
           <div className="w-full md:w-[35%] pt-4 md:pt-16">
              <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">
                At SettelInn, we believe that finding a home shouldn't be a compromise. We curate extraordinary living spaces that blend architectural beauty with everyday comfort.
              </p>
              <Link to="/rooms" className="inline-flex items-center gap-3 px-8 py-4 bg-rose-500 rounded-full text-sm font-bold text-white hover:bg-rose-600 transition-colors shadow-sm group">
                 Explore Properties 
                 <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
        </div>

        {/* Bento-Box Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 h-[800px]">
           <div className="md:col-span-2 relative rounded-3xl overflow-hidden shadow-sm group">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" alt="Interior Architecture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white">
                 <h3 className="text-3xl font-bold mb-2 text-white">Curated Spaces</h3>
                 <p className="text-base text-white/80 font-medium max-w-sm">Every property in our collection is strictly verified for quality, safety, and design.</p>
              </div>
           </div>
           
           <div className="flex flex-col gap-6">
              <div className="h-1/2 relative rounded-3xl overflow-hidden shadow-sm group">
                 <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" alt="Modern Living" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="h-1/2 relative rounded-3xl overflow-hidden shadow-sm bg-rose-50 p-10 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500 border border-rose-100">
                 <Shield className="w-12 h-12 text-rose-500" />
                 <div>
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Trust & Safety</h3>
                   <p className="text-sm text-gray-600 font-medium">Bank-level encryption and rigorous background checks on all hosts.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Mission Footer Section */}
        <div className="bg-white rounded-3xl p-12 md:p-20 shadow-sm border border-gray-100 flex flex-col items-center text-center">
           <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-8 max-w-3xl leading-tight">
             Building the future of residential real estate.
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl border-t border-gray-100 pt-16">
              <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                   <Users className="w-8 h-8" />
                 </div>
                 <h4 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h4>
                 <p className="text-sm text-gray-500 font-medium">Verified Users</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                   <CheckCircle2 className="w-8 h-8" />
                 </div>
                 <h4 className="text-2xl font-bold text-gray-900 mb-2">10,000+</h4>
                 <p className="text-sm text-gray-500 font-medium">Successful Bookings</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                   <Star className="w-8 h-8" />
                 </div>
                 <h4 className="text-2xl font-bold text-gray-900 mb-2">4.9/5</h4>
                 <p className="text-sm text-gray-500 font-medium">Average Rating</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
