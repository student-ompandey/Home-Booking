import { MapPin, Globe, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors">
              <MapPin className="w-7 h-7 fill-rose-500 text-white" />
              <span className="text-xl font-bold tracking-tight">SettelInn</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mt-2">
              Discover and book the best places to stay around the world. We make finding your perfect home away from home easy and secure.
            </p>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">Support</h4>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Help Center</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Safety Information</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Cancellation Options</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact Us</Link>
          </div>

          {/* Hosting Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">Hosting</h4>
            <Link to="/add-room" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">List your property</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Hosting resources</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Community forum</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Host responsibility</Link>
          </div>

          {/* About Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">SettelInn</h4>
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About Us</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Careers</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Investors</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Terms & Privacy</Link>
          </div>
          
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-200 mb-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
            <span>© 2026 SettelInn, Inc.</span>
            <span className="hidden md:inline">•</span>
            <Link to="#" className="hover:text-gray-900 hover:underline">Privacy</Link>
            <span className="hidden md:inline">•</span>
            <Link to="#" className="hover:text-gray-900 hover:underline">Terms</Link>
            <span className="hidden md:inline">•</span>
            <Link to="#" className="hover:text-gray-900 hover:underline">Sitemap</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 font-medium text-gray-900">
              <button className="flex items-center gap-1 hover:underline">
                <Globe className="w-4 h-4" /> English (US)
              </button>
              <button className="flex items-center gap-1 hover:underline">
                <DollarSign className="w-4 h-4" /> USD
              </button>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
