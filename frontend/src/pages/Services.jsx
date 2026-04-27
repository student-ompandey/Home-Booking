import { Link } from 'react-router-dom';
import { Building2, Key, Paintbrush, Plane, ShieldCheck, Sparkles } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Key className="w-8 h-8 text-black" />,
      title: "Property Management",
      description: "End-to-end management of your luxury real estate, from tenant screening to maintenance, ensuring your asset is protected.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: <Paintbrush className="w-8 h-8 text-black" />,
      title: "Interior Curation",
      description: "Bespoke interior design services to elevate your property to our strict premium standards before listing.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-black" />,
      title: "Concierge Services",
      description: "24/7 dedicated support for our high-net-worth guests, handling reservations, transport, and special requests.",
      image: "https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: <Building2 className="w-8 h-8 text-black" />,
      title: "Corporate Housing",
      description: "Tailored long-term lease solutions for corporate executives requiring premium, fully-furnished residences.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="bg-[#f8f8f9] min-h-screen text-black pb-32">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-48">
        
        {/* Massive Editorial Header */}
        <div className="mb-20 flex flex-col items-center text-center">
           <div className="flex gap-4 items-center justify-center mb-6">
              <div className="w-12 h-[2px] bg-black rounded-full"></div>
              <p className="text-[13px] font-bold tracking-widest uppercase text-gray-400 mt-0.5">OUR EXPERTISE</p>
              <div className="w-12 h-[2px] bg-black rounded-full"></div>
           </div>
           <h1 className="text-[48px] md:text-[76px] font-bold tracking-tight text-black leading-tight max-w-4xl mx-auto">
             Elevating the <br className="hidden md:block"/>
             <span className="inline-block bg-[#1a1a1a] text-white px-8 pt-1 pb-3 rounded-full align-middle shadow-lg border border-black/10 mt-2 md:mt-0">Experience</span>
           </h1>
           <p className="text-[18px] text-gray-500 font-medium max-w-2xl mx-auto mt-8">
             Beyond simply connecting you with premium properties, SettelInn offers a suite of exclusive services designed to guarantee peace of mind.
           </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-[40px] overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2">
               <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                 <img src={service.image} alt={service.title} className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-700" />
               </div>
               <div className="w-full md:w-3/5 p-10 md:p-12 flex flex-col justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 border border-gray-100">
                    {service.icon}
                  </div>
                  <h3 className="text-[28px] font-bold text-black mb-4">{service.title}</h3>
                  <p className="text-[15px] text-gray-500 font-medium leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <Link to="/contact" className="inline-flex items-center gap-2 text-[14px] font-bold text-black hover:text-gray-500 transition-colors uppercase tracking-wider group/link">
                    Learn More 
                    <ArrowRightIcon className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
          ))}
        </div>

        {/* Global Network CTA */}
        <div className="bg-[#1a1a1a] rounded-[40px] p-12 md:p-20 shadow-2xl flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
           
           <div className="relative z-10 w-full md:w-3/5 text-center md:text-left mb-10 md:mb-0">
             <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
               <ShieldCheck className="w-6 h-6 text-white" />
               <span className="text-[13px] font-bold tracking-widest uppercase text-white/60">Quality Assured</span>
             </div>
             <h2 className="text-[36px] md:text-[48px] font-bold tracking-tight text-white mb-6 leading-tight">
               Ready to upgrade your standard of living?
             </h2>
             <p className="text-[16px] text-white/70 font-medium max-w-lg mx-auto md:mx-0">
               Join thousands of discerning individuals who trust SettelInn for their housing needs.
             </p>
           </div>
           
           <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
             <Link to="/rooms" className="px-8 py-4 bg-white text-black text-[15px] font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg text-center">
               Explore Properties
             </Link>
             <Link to="/contact" className="px-8 py-4 bg-white/10 text-white border border-white/20 text-[15px] font-bold rounded-full hover:bg-white/20 transition-colors text-center backdrop-blur-md">
               Contact Sales
             </Link>
           </div>
        </div>

      </div>
    </div>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}
