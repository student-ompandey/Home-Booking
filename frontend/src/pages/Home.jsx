import { Link } from 'react-router-dom';
import { Search, Shield, Star, ArrowRight, Building2, Home as HomeIcon, Users, MapPin } from 'lucide-react';
import SearchBar from '../components/rooms/SearchBar';

const CATEGORIES = [
  { icon: Building2, label: 'Apartments', type: 'apartment', color: 'bg-secondary/10 text-secondary border-secondary/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]' },
  { icon: HomeIcon, label: 'PG / Hostels', type: 'pg', color: 'bg-primary/10 text-primary border-primary/20 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]' },
  { icon: Users, label: 'Shared Rooms', type: 'double', color: 'bg-accent/10 text-accent border-accent/20 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
  { icon: Star, label: 'Suites', type: 'suite', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]' },
];

const FEATURES = [
  { icon: Search, title: 'Easy Search', desc: 'Find rooms by city, price range, and room type in seconds with our lightning-fast search engine.' },
  { icon: Shield, title: 'Verified Listings', desc: 'All rooms are strictly verified by our team for quality assurance and tenant safety.' },
  { icon: Star, title: 'Best Prices', desc: 'Compare prices effortlessly and lock in the most affordable premium stays near you.' },
];

export default function Home() {
  return (
    <div className="bg-[#0B0F19] min-h-screen text-[#E5E7EB] font-sans selection:bg-primary/30 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Futuristic Background Gradients & Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute top-[30%] -right-[10%] w-[40%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 border border-secondary/20 rounded-full mb-8 animate-fade-in shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Trusted by 10,000+ Users
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] animate-fade-in font-heading tracking-tight">
              Find Your Perfect <br className="hidden sm:block" />
              <span className="text-gradient">Premium Stay</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in font-medium leading-relaxed">
              Browse verified rooms, luxury apartments, and premium PGs across India. Experience the future of home booking.
            </p>
            <div className="mt-12 max-w-2xl mx-auto animate-fade-in">
              <SearchBar className="transform hover:-translate-y-1 transition-transform duration-300" />
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold text-gray-400 animate-fade-in">
              <span className="flex items-center gap-1.5 glass px-4 py-2 rounded-full border-white/5"><Star className="w-4 h-4 fill-accent text-accent" /> 4.9 Rating</span>
              <span className="flex items-center gap-1.5 glass px-4 py-2 rounded-full border-white/5"><MapPin className="w-4 h-4 text-secondary" /> 500+ Cities</span>
              <span className="flex items-center gap-1.5 glass px-4 py-2 rounded-full border-white/5"><Shield className="w-4 h-4 text-primary" /> 24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-tight mb-2">Browse by Category</h2>
            <p className="text-gray-400 font-medium">Find exactly what you're looking for</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.type}
              to={`/rooms?roomType=${cat.type}`}
              className="group flex flex-col items-center gap-4 p-8 rounded-[2rem] glass border border-white/10 hover:bg-white/5 transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`p-4 rounded-2xl border ${cat.color} transition-all duration-300 group-hover:scale-110`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <span className="text-[15px] font-bold text-gray-200 group-hover:text-white transition-colors">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 bg-black/20 border-y border-white/5 backdrop-blur-sm mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-tight mb-4">Why SettelInn?</h2>
            <p className="text-gray-400 text-lg font-medium">The most advanced platform for your next stay.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] group">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-heading">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 glass-heavy shadow-[0_0_50px_rgba(124,58,237,0.2)]">
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-50"></div>
          
          <div className="relative z-10 p-12 sm:p-20 text-center flex flex-col items-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 font-heading tracking-tight">Own a premium property?</h2>
            <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto font-medium">
              List your room on SettelInn and reach thousands of verified tenants looking for high-quality stays.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 px-8 py-4 btn-gradient text-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
