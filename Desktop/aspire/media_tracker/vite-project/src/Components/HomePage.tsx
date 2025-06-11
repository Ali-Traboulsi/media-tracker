export default function HomePage() {
  return (
    <div className={`min-h-screen flex flex-col`}>
      <main className="flex-grow bg-[#f0f0f0] dark:bg-[#121212] transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="relative z-10 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] dark:from-[#ff9e9e] dark:to-[#6fffe8]">
                  My Media Vault
                </span>
                <br />
                Track Your Personal Collection
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                Organize your movies, books, games, and music in one place. 
                Never forget what you own—or what you want next.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#features"
                  className="px-8 py-3 rounded-md bg-[#ff6b6b] dark:bg-[#6fffe8] text-white dark:text-[#121212] font-medium hover:opacity-90 transition-opacity duration-200 shadow-lg text-center"
                >
                  Start Cataloging
                </a>
                <a
                  href="/demo"
                  className="px-8 py-3 rounded-md dark:bg-[#121212] text-[#ff6b6b] dark:text-[#6fffe8] border border-[#ff6b6b] dark:border-[#6fffe8] font-medium hover:bg-[#ff6b6b] hover:text-white dark:hover:bg-[#6fffe8] dark:hover:text-[#121212] transition-colors duration-200 shadow-sm text-center"
                >
                  See Demo
                </a>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-5">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')]"></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white dark:bg-[#121212] transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Why Use My Media Vault?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                The ultimate tool for collectors, geeks, and hobbyists.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  ),
                  title: "Movies & TV Shows",
                  description: "Catalog your physical and digital media with custom tags."
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ),
                  title: "Books & Comics",
                  description: "Track reading progress and organize by series or genre."
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: "Games & Consoles",
                  description: "Log playtime, completion status, and wishlist items."
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  ),
                  title: "Music & Vinyl",
                  description: "Sort by artist, album, or release year."
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  ),
                  title: "Custom Categories",
                  description: "Add anything—figures, posters, or rare collectibles."
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  title: "Private & Secure",
                  description: "Your collection stays yours—no ads, no data mining."
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-[#333]"
                >
                  <div className="text-[#ff6b6b] dark:text-[#6fffe8] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}