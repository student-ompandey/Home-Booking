import { Link } from 'react-router-dom';
import { Building2, Key, Paintbrush, Plane, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

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
        
        {/* Simple Header */}
        <div className="mb-20 flex flex-col items-center text-center">
           <div className="flex gap-4 items-center justify-center mb-6">
              <div className="w-12 h-1 bg-rose-500 rounded-full"></div>
              <p className="text-sm font-bold tracking-widest uppercase text-rose-500 mt-0.5">OUR EXPERTISE</p>
              <div className="w-12 h-1 bg-rose-500 rounded-full"></div>
           </div>
           <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight max-w-4xl mx-auto">
             Elevating the <br className="hidden md:block"/>
             <span className="text-rose-500">Experience</span>
           </h1>
           <p className="text-[18px] text-gray-500 font-medium max-w-2xl mx-auto mt-8">
             Beyond simply connecting you with premium properties, SettelInn offers a suite of exclusive services designed to guarantee peace of mind.
           </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row group hover:shadow-md transition-all duration-500 hover:-translate-y-1">
               <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                 <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               </div>
               <div className="w-full md:w-3/5 p-10 md:p-12 flex flex-col justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-wider group/link">
                    Learn More 
                    <ArrowRightIcon className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
          ))}
        </div>

        {/* Light CTA Section */}
        <div className="bg-white rounded-3xl p-10 md:p-16 lg:p-20 shadow-sm border border-gray-100 relative overflow-hidden text-center">
           
           <div className="relative z-10 flex flex-col items-center justify-center">
             
               {/* Badge */}
               <div className="inline-flex items-center gap-3 mb-6">
                 <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                   <ShieldCheck className="w-4 h-4" />
                   <span className="text-xs font-bold tracking-widest uppercase">Quality Assured</span>
                 </div>
               </div>

               <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                 Ready to upgrade your <span className="text-rose-500">standard of living</span>?
               </h2>

               <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg mb-10">
                 Join thousands of discerning individuals who trust SettelInn for their housing needs.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                 <Link 
                   to="/rooms" 
                   className="px-8 py-4 text-sm font-bold rounded-xl text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-sm inline-flex items-center justify-center gap-2 group"
                 >
                   Explore Properties
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </Link>

                 <Link 
                   to="/contact" 
                   className="px-8 py-4 text-sm font-bold rounded-xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
                 >
                   Contact Sales
                 </Link>
               </div>
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
