import { Link } from 'react-router-dom';
import { Search, Shield, Star, ArrowRight, Building2, Home as HomeIcon, Users } from 'lucide-react';
import SearchBar from '../components/rooms/SearchBar';

const CATEGORIES = [
  { icon: Building2, label: 'Apartments', type: 'apartment', color: 'bg-blue-50 text-blue-600' },
  { icon: HomeIcon, label: 'PG / Hostels', type: 'pg', color: 'bg-green-50 text-green-600' },
  { icon: Users, label: 'Shared Rooms', type: 'double', color: 'bg-purple-50 text-purple-600' },
  { icon: Star, label: 'Suites', type: 'suite', color: 'bg-amber-50 text-amber-600' },
];

const FEATURES = [
  { icon: Search, title: 'Easy Search', desc: 'Find rooms by city, price range, and room type in seconds.' },
  { icon: Shield, title: 'Verified Listings', desc: 'All rooms are verified by our team for quality assurance.' },
  { icon: Star, title: 'Best Prices', desc: 'Compare prices and find the most affordable stays near you.' },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wide text-primary bg-primary/10 rounded-full mb-6 animate-fade-in">
              🏠 TRUSTED BY 10,000+ USERS
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in">
              Find Your Perfect
              <span className="text-primary"> Stay</span>
            </h1>
            <p className="mt-5 text-lg text-slate-300 max-w-xl mx-auto animate-fade-in">
              Browse verified rooms, apartments, and PGs across India. Book your next home with confidence.
            </p>
            <div className="mt-8 max-w-xl mx-auto animate-fade-in">
              <SearchBar />
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-400 animate-fade-in">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 Rating</span>
              <span>•</span>
              <span>500+ Cities</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-dark mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.type}
              to={`/rooms?roomType=${cat.type}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-border hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className={`p-3 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-dark">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-dark mb-2">Why SettelInn?</h2>
          <p className="text-gray-warm mb-10">Everything you need to find and book your next stay.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">{f.title}</h3>
                <p className="text-sm text-gray-warm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Own a property?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            List your room on SettelInn and reach thousands of potential tenants.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-full hover:bg-gray-light transition-colors"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
