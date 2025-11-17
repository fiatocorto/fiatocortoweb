import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AvatarMenu from './AvatarMenu';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartMenuOpen, setCartMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartMenuRef = useRef<HTMLDivElement>(null);

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartMenuRef.current && !cartMenuRef.current.contains(event.target as Node)) {
        setCartMenuOpen(false);
      }
    };

    if (cartMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartMenuOpen]);

  // Handle scroll to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <nav className={`${isAdminRoute ? 'bg-accent' : 'bg-primary'} text-white shadow-lg z-[100] transition-all duration-300 ${isScrolled && !isAdminRoute ? 'fixed top-0 left-0 right-0 shadow-xl' : 'relative'} ${isAdminRoute ? 'relative' : ''}`}>
      <div className="w-full">
        <div className="flex items-stretch">
          {/* Logo Section - Hidden on admin routes */}
          {!isAdminRoute && (
          <div className={`relative flex items-center pl-4 sm:pl-6 md:pl-6 lg:pl-8 pr-4 sm:pr-6 md:pr-8 lg:pr-16 py-2 sm:py-3 md:py-4 overflow-hidden bg-[#0f172a] transition-all duration-300 ${isScrolled ? 'w-[200px] sm:w-[250px] md:w-[300px]' : 'w-[200px] sm:w-[300px] md:w-[350px] lg:w-[400px]'}`}>
            <Link to="/" className="flex items-center relative z-10 w-full">
              <img 
                src="/resources/Completo Bianco.png" 
                alt="Fiato Corto" 
                className={`w-auto max-w-full object-contain transition-all duration-300 ${isScrolled ? 'h-10 sm:h-12 md:h-14' : 'h-12 sm:h-14 md:h-16 lg:h-20'}`}
              />
          </Link>

          </div>
          )}

          {/* Right side: Two vertical rows */}
          <div className={`flex-1 flex flex-col ${isAdminRoute ? 'bg-accent' : ''}`}>
            {/* Top Bar - Hidden when scrolled, only visible on desktop */}
            <div className={`hidden lg:flex justify-between items-center py-0.5 pr-4 sm:pr-6 lg:pr-8 border-b transition-all duration-300 ${isScrolled && !isAdminRoute ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'} ${isAdminRoute ? 'bg-accent border-accent/80 text-primary pl-4 sm:pl-6 lg:pl-8' : 'bg-[#1e293b] border-[#334155] text-white pl-4 sm:pl-6 lg:pl-8'}`}>
              {/* Contact boxes */}
              <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
                <div className="flex items-center space-x-1 pr-2 sm:pr-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden lg:inline">info@fiatocortoadventures.it</span>
                  <span className="lg:hidden">info@fiatocorto.it</span>
                </div>
                <div className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xl:inline">+39 123 456 7890</span>
                  <span className="xl:hidden">+39 123 456</span>
                </div>
                <div className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Sicilia</span>
                </div>
              </div>

              {/* Auth section */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {user ? (
                  <>
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full transition-colors text-xs sm:text-sm ${isAdminRoute ? (isActive('/admin') ? 'text-primary font-semibold' : 'text-primary hover:text-primary/80') : (isActive('/admin') ? 'text-accent' : 'hover:text-accent')}`}
                      >
                        <span className="hidden sm:inline">Gestisci</span>
                        <span className="sm:hidden">Admin</span>
                      </Link>
                    )}
                    <AvatarMenu user={user} onLogout={handleLogout} />
                  </>
                ) : (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Link
                      to="/login"
                      className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full transition-colors text-xs sm:text-sm ${isAdminRoute ? 'text-primary hover:text-primary/80' : 'hover:text-accent'}`}
                    >
                      Login
                    </Link>
                    <Link to="/register" className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full transition-colors text-xs sm:text-sm ${isAdminRoute ? 'text-primary hover:text-primary/80' : 'hover:text-accent'}`}>
                      <span className="hidden sm:inline">Registrati</span>
                      <span className="sm:hidden">Reg.</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Menu Bar - Hidden on admin routes */}
            {!isAdminRoute && (
            <div className={`hidden lg:flex justify-between items-center transition-all duration-300 pl-2 sm:pl-4 md:pl-6 lg:pl-8 pr-2 sm:pr-4 md:pr-6 lg:pr-8 bg-white text-primary ${isScrolled ? 'py-4 sm:py-5 shadow-md' : 'py-5 sm:py-6 md:py-7'}`}>
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
                  Tour
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

              {/* Right side: Cart + CTA */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                <div className="relative" ref={cartMenuRef}>
                  <button 
                    onClick={() => setCartMenuOpen(!cartMenuOpen)}
                    className="relative text-primary hover:text-accent transition-colors flex items-center justify-center p-1"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-accent text-primary text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      0
                    </span>
                  </button>

                  {/* Cart Dropdown Menu */}
                  {cartMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-xl py-4 z-[200] border border-gray-200">
                      <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
                        <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                        <p className="text-primary font-medium mb-2 text-sm sm:text-base">Il carrello è vuoto</p>
                        <p className="text-muted text-xs sm:text-sm mb-4 sm:mb-6">Acquista un tour.</p>
                        <Link
                          to="/tours"
                          onClick={() => setCartMenuOpen(false)}
                          className="btn-primary inline-block text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                        >
                          Vai ai Tour
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/tours" className="btn-primary text-sm sm:text-base px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-2.5 md:py-3 font-medium">
                  <span className="hidden xl:inline">Scopri</span>
                  <span className="xl:hidden">Tour</span>
                  </Link>
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
              Tour
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
                Scopri i Tour
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

