import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for user's preferred color scheme
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (window.matchMedia('(prefers-color-scheme: dark)').matches && 
             localStorage.getItem('darkMode') !== 'false');
    }
    return false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  return (
    <nav className="bg-[#f0f0f0] sticky top-0 z-50 dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-[#29b093] dark:bg-[#e0f11f] flex items-center justify-center transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white dark:text-[#121212]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#29b093] dark:text-[#e0f11f] transition-colors duration-300">
              MediaTracker
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <Link 
                to="/" 
                className="relative px-1 py-2 text-gray-700 dark:text-gray-300 hover:text-[#29b093] dark:hover:text-[#e0f11f] font-medium transition-colors duration-200 group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#29b093] dark:bg-[#e0f11f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
              <Link 
                to="/items" 
                className="relative px-1 py-2 text-gray-700 dark:text-gray-300 hover:text-[#29b093] dark:hover:text-[#e0f11f] font-medium transition-colors duration-200 group"
              >
                Media
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#29b093] dark:bg-[#e0f11f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
              <Link 
                to="/analytics" 
                className="relative px-1 py-2 text-gray-700 dark:text-gray-300 hover:text-[#29b093] dark:hover:text-[#e0f11f] font-medium transition-colors duration-200 group"
              >
                Insights
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#29b093] dark:bg-[#e0f11f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 cursor-pointer rounded-full bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-400 hover:text-white dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              
              <button className="px-4 py-2 rounded-md bg-[#29b093] cursor-pointer dark:bg-[#e0f11f] text-white dark:text-[#121212] font-medium hover:opacity-90 transition-opacity duration-200 shadow-sm">
                New Entry
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-[#29b093] dark:hover:text-[#e0f11f] focus:outline-none transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
          <div className="px-2 pt-2 pb-4 space-y-2">
            <Link 
              to="/items" 
              className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-[#29b093] dark:hover:text-[#e0f11f] transition-colors duration-200"
            >
              Inventory
            </Link>
            <Link 
              to="/items/new" 
              className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-[#29b093] dark:hover:text-[#e0f11f] transition-colors duration-200"
            >
              Add Item
            </Link>
            <Link 
              to="/analytics" 
              className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-[#29b093] dark:hover:text-[#e0f11f] transition-colors duration-200"
            >
              Insights
            </Link>
            <button className="w-full mt-2 px-4 py-2 rounded-md bg-[#29b093] dark:bg-[#e0f11f] text-white dark:text-[#121212] font-medium hover:opacity-90 transition-opacity duration-200">
              New Entry
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;