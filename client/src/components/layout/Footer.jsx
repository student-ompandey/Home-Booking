import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-light border-t border-gray-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-dark">
                Settel<span className="text-primary">Inn</span>
              </span>
            </Link>
            <p className="text-sm text-gray-warm leading-relaxed">
              Find your perfect stay. Browse rooms, apartments, and PGs across India.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-dark mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/rooms" className="text-sm text-gray-warm hover:text-primary transition-colors">All Rooms</Link></li>
              <li><Link to="/rooms?roomType=apartment" className="text-sm text-gray-warm hover:text-primary transition-colors">Apartments</Link></li>
              <li><Link to="/rooms?roomType=pg" className="text-sm text-gray-warm hover:text-primary transition-colors">PG / Hostels</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-dark mb-3">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-warm hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-warm hover:text-primary transition-colors">Safety Info</a></li>
              <li><a href="#" className="text-sm text-gray-warm hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-warm">© 2026 SettelInn. All rights reserved.</p>
          <p className="text-xs text-gray-warm">Made with ❤️ by Om Pandey</p>
        </div>
      </div>
    </footer>
  );
}
