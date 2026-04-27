import { Copyright } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-hairline-gray overflow-hidden pt-20">
      <div className="max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16 relative">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 mb-20 gap-10">
          
          {/* Left: Subtle Links */}
          <div className="flex flex-col gap-6 w-full md:w-1/3">
            <div className="flex gap-8 text-[14px] font-semibold text-ink-black tracking-tight">
              <Link to="/rooms" className="hover:opacity-60 transition-opacity">Explore</Link>
              <Link to="/about" className="hover:opacity-60 transition-opacity">About</Link>
              <Link to="/contact" className="hover:opacity-60 transition-opacity">Contact</Link>
            </div>
            <div className="flex gap-8 text-[14px] font-semibold text-ash-gray tracking-tight">
              <a href="#" className="hover:text-ink-black transition-colors">Twitter</a>
              <a href="#" className="hover:text-ink-black transition-colors">Instagram</a>
              <a href="#" className="hover:text-ink-black transition-colors">LinkedIn</a>
            </div>
          </div>

          {/* Center: Tagline */}
          <div className="w-full md:w-1/3 flex justify-center text-center">
            <h2 className="text-[28px] md:text-[32px] leading-[1.1] font-semibold text-ink-black tracking-tight max-w-[300px]">
              The ultimate home booking experience.
            </h2>
          </div>

          {/* Right: Copyright Icon */}
          <div className="w-full md:w-1/3 flex justify-start md:justify-end">
            <Copyright className="w-12 h-12 md:w-16 md:h-16 text-ink-black stroke-[1.5]" />
          </div>
          
        </div>

        {/* Bottom Section: MASSIVE Typography */}
        <div className="w-full flex justify-center relative -mb-[4%] md:-mb-[6%] lg:-mb-[8%] pointer-events-none select-none">
          <h1 className="text-[24vw] leading-[0.75] font-black text-ink-black tracking-tighter whitespace-nowrap">
            SettelInn
          </h1>
        </div>

      </div>
    </footer>
  );
}
