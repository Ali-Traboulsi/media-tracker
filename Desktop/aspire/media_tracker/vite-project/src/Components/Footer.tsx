
function Footer() {
  return (
    <footer className="bg-[#f0f0f0]  dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col justify-center items-center gap-8 md:flex-row ">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
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
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Advanced inventory management system for modern businesses.
            </p>
         
          </div>


          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#29b093] dark:text-[#e0f11f] uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <svg className="h-4 w-4 mt-0.5 text-[#29b093] dark:text-[#e0f11f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  mohamad.abdelrahman60@outlook.com
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="h-4 w-4 mt-0.5 text-[#29b093] dark:text-[#e0f11f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  +961 81 059 460
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="h-4 w-4 mt-0.5 text-[#29b093] dark:text-[#e0f11f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Beirut, Sin El Fil
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8  pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-center items-center">
          <p className="text-gray-500 dark:text-gray-500 text-xs text-center">
            &copy; {new Date().getFullYear()} Mohamad Abdel Rahman. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;