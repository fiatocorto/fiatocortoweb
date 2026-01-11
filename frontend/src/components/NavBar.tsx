import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolled = true; // Sempre in stato "scrolled" per dimensioni fisse

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className={`${isAdminRoute ? 'bg-accent' : 'bg-primary'} text-white shadow-lg z-[100] transition-all duration-300 ${!isAdminRoute ? 'fixed top-0 left-0 right-0 shadow-xl h-20' : 'relative h-20'}`}>
      <div className="w-full">
        <div className="flex items-stretch">
          {/* Logo Section - Hidden on admin routes */}
          {!isAdminRoute && (
          <div className={`relative flex items-center pl-4 sm:pl-6 md:pl-6 lg:pl-8 pr-4 sm:pr-6 md:pr-8 lg:pr-16 py-2 sm:py-3 md:py-4 overflow-hidden bg-[#0f172a] transition-all duration-300 w-[200px] sm:w-[250px] md:w-[300px]`}>
            <Link to="/" className="flex items-center relative z-10 w-full">
              <img 
                src="/resources/Bianco.png" 
                alt="Fiato Corto" 
                className="w-auto max-w-full object-contain transition-all duration-300 h-10 sm:h-12 md:h-14"
              />
          </Link>

          </div>
          )}

          {/* Right side: Menu Bar */}
          <div className={`flex-1 flex flex-col ${isAdminRoute ? 'bg-accent' : ''}`}>
            {/* Menu Bar - Hidden on admin routes */}
            {!isAdminRoute && (
            <div className={`hidden lg:flex justify-between items-center transition-all duration-300 pl-2 sm:pl-4 md:pl-6 lg:pl-8 pr-2 sm:pr-4 md:pr-6 lg:pr-8 bg-white text-primary py-4 sm:py-5 shadow-md`}>
              {/* Navigation menu */}
              <div className="flex-1 flex justify-start items-center space-x-3 sm:space-x-4 md:space-x-6">
                <Link 
                  to="/" 
                  className={`nav-link-underline transition-colors font-medium text-sm sm:text-base pb-1 ${isActive('/') ? 'text-accent active' : 'text-primary hover:text-accent'}`}
                >
                  Home
                </Link>
                <Link 
                  to="/tours" 
                  className={`nav-link-underline transition-colors font-medium text-sm sm:text-base pb-1 ${isActive('/tours') ? 'text-accent active' : 'text-primary hover:text-accent'}`}
                >
                  Escursioni
                </Link>
                <Link 
                  to="/calendar" 
                  className={`nav-link-underline transition-colors font-medium text-sm sm:text-base pb-1 ${isActive('/calendar') ? 'text-accent active' : 'text-primary hover:text-accent'}`}
                >
                  Calendario
                </Link>
                <Link 
                  to="/about" 
                  className={`nav-link-underline transition-colors font-medium text-sm sm:text-base pb-1 ${isActive('/about') ? 'text-accent active' : 'text-primary hover:text-accent'}`}
                >
                  Chi siamo
                </Link>
                <Link 
                  to="/contacts" 
                  className={`nav-link-underline transition-colors font-medium text-sm sm:text-base pb-1 ${isActive('/contacts') ? 'text-accent active' : 'text-primary hover:text-accent'}`}
                >
                  Contatti
                </Link>
              </div>

              {/* Right side: Account + Admin + Auth + CTA */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                {user ? (
                  <>
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors text-sm sm:text-base font-medium ${isActive('/admin') ? 'text-accent' : 'text-primary hover:text-accent'}`}
                      >
                        Gestisci
                      </Link>
                    )}
                    <Link to="/account" className="btn-primary text-sm sm:text-base px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-2.5 md:py-3 font-medium">
                      Il mio account
                      </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors text-sm sm:text-base font-medium text-primary hover:text-accent"
                    >
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary text-sm sm:text-base px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-2.5 md:py-3 font-medium">
                      Registrati
                      </Link>
                  </>
                )}
                </div>
            </div>
            )}
          </div>

          {/* Mobile menu button - Hidden on admin routes */}
          {!isAdminRoute && (
          <button
            className="lg:hidden ml-auto p-2 sm:p-3 mr-2 sm:mr-4 text-white hover:text-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>
          )}
        </div>

        {/* Mobile menu - Hidden on admin routes */}
        {!isAdminRoute && mobileMenuOpen && (
          <div className="lg:hidden py-4 sm:py-6 space-y-3 sm:space-y-4 border-t border-white/10 px-4 sm:px-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Mobile navigation */}
            <div className="space-y-1 sm:space-y-2">
            <Link
              to="/"
              className={`nav-link-underline block transition-colors py-2 sm:py-2.5 text-sm sm:text-base font-medium ${isActive('/') ? 'text-accent active' : 'hover:text-accent'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/tours"
              className={`nav-link-underline block transition-colors py-2 sm:py-2.5 text-sm sm:text-base font-medium ${isActive('/tours') ? 'text-accent active' : 'hover:text-accent'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Escursioni
            </Link>
            <Link
              to="/calendar"
              className={`nav-link-underline block transition-colors py-2 sm:py-2.5 text-sm sm:text-base font-medium ${isActive('/calendar') ? 'text-accent active' : 'hover:text-accent'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Calendario
            </Link>
            <Link
              to="/about"
              className={`nav-link-underline block transition-colors py-2 sm:py-2.5 text-sm sm:text-base font-medium ${isActive('/about') ? 'text-accent active' : 'hover:text-accent'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Chi siamo
            </Link>
            <Link
              to="/contacts"
              className={`nav-link-underline block transition-colors py-2 sm:py-2.5 text-sm sm:text-base font-medium ${isActive('/contacts') ? 'text-accent active' : 'hover:text-accent'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contatti
            </Link>
            </div>

            {/* Admin link - after navigation */}
            {user && user.role === 'ADMIN' && (
              <div className="pt-2 sm:pt-3 border-t border-white/10">
                <Link
                  to="/admin"
                  className={`nav-link-underline block transition-colors py-2 sm:py-2.5 text-sm sm:text-base font-medium ${isActive('/admin') ? 'text-accent active' : 'hover:text-accent'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gestisci
                </Link>
              </div>
            )}

            {/* Mobile auth */}
            {user ? (
              <div className="pt-3 sm:pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 flex-1 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent text-sm sm:text-base font-semibold">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-xs sm:text-sm font-medium">{user.name || 'Utente'}</p>
                      <p className="text-white/70 text-xs">{user.email}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs sm:text-sm text-white/70 hover:text-accent transition-colors ml-2"
                  >
                    Esci
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-white/10">
                <Link
                  to="/login"
                  className="block px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:bg-white/10 transition-colors text-center text-sm sm:text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block btn-primary text-center text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrati
                </Link>
              </div>
            )}

            {/* Mobile CTA */}
            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <Link
                to="/tours"
                className="block btn-primary text-center text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                Scopri le Escursioni
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

