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
          <div className={`relative flex items-center pl-4 sm:pl-6 lg:pl-8 pr-16 overflow-hidden bg-[#0f172a] transition-all duration-300 ${isScrolled ? 'w-[300px]' : 'w-[400px]'}`}>
            <Link to="/" className="flex items-center relative z-10">
              <img 
                src="/resources/Completo Bianco.png" 
                alt="Fiato Corto" 
                className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'}`}
              />
          </Link>

          </div>
          )}

          {/* Right side: Two vertical rows */}
          <div className={`flex-1 flex flex-col ${isAdminRoute ? 'bg-accent ml-[300px]' : ''}`}>
            {/* Top Bar - Hidden when scrolled */}
            <div className={`hidden lg:flex justify-between items-center py-0.5 pr-4 sm:pr-6 lg:pr-8 border-b transition-all duration-300 ${isScrolled && !isAdminRoute ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'} ${isAdminRoute ? 'bg-accent border-accent/80 text-primary pl-4 sm:pl-6 lg:pl-8' : 'bg-[#1e293b] border-[#334155] text-white pl-4 sm:pl-6 lg:pl-8'}`}>
              {/* Contact boxes */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 pr-3 py-1.5 rounded-full text-sm">
                  <Mail className="w-4 h-4" />
                  <span>info@fiatocortoadventures.it</span>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm">
                  <Phone className="w-4 h-4" />
                  <span>+39 123 456 7890</span>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Sicilia</span>
                </div>
              </div>

              {/* Auth section */}
              <div className="flex items-center space-x-2">
                {user ? (
                  <>
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className={`px-4 py-2 rounded-full transition-colors text-sm ${isAdminRoute ? (isActive('/admin') ? 'text-primary font-semibold' : 'text-primary hover:text-primary/80') : (isActive('/admin') ? 'text-accent' : 'hover:text-accent')}`}
                      >
                        Gestisci
                      </Link>
                    )}
                    <AvatarMenu user={user} onLogout={handleLogout} />
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/login"
                      className={`px-4 py-2 rounded-full transition-colors text-sm ${isAdminRoute ? 'text-primary hover:text-primary/80' : 'hover:text-accent'}`}
                    >
                      Login
                    </Link>
                    <Link to="/register" className={`px-4 py-2 rounded-full transition-colors text-sm ${isAdminRoute ? 'text-primary hover:text-primary/80' : 'hover:text-accent'}`}>
                      Registrati
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Menu Bar - Hidden on admin routes */}
            {!isAdminRoute && (
            <div className={`hidden lg:flex justify-between items-center transition-all duration-300 pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-6 lg:pr-8 bg-white text-primary ${isScrolled ? 'py-3 shadow-md' : 'py-5'}`}>
              {/* Navigation menu */}
              <div className="flex-1 flex justify-start items-center space-x-6">
                <Link 
                  to="/" 
                  className={`nav-link-underline transition-colors font-medium text-base pb-1 ${isActive('/') ? 'text-accent active' : 'text-primary hover:text-accent'}`}
                >
                  Home
                </Link>
                <Link 
                  to="/tours" 
                  className={`nav-link-underline transition-colors font-medium text-base pb-1 ${isActive('/tours') ? 'text-accent active' : 'text-primary hover:text-accent'}`}
                >
                  Tour
                </Link>
                <Link 
                  to="/calendar" 
                  className={`nav-link-underline transition-colors font-medium text-base pb-1 ${isActive('/calendar') ? 'text-accent active' : 'text-primary hover:text-accent'}`}
                >
                  Calendario
                </Link>
                <Link 
                  to="/about" 
                  className={`nav-link-underline transition-colors font-medium text-base pb-1 ${isActive('/about') ? 'text-accent active' : 'text-primary hover:text-accent'}`}
                >
                  Chi siamo
                </Link>
                <Link 
                  to="/contacts" 
                  className={`nav-link-underline transition-colors font-medium text-base pb-1 ${isActive('/contacts') ? 'text-accent active' : 'text-primary hover:text-accent'}`}
                >
                  Contatti
                </Link>
              </div>

              {/* Right side: Cart + CTA */}
            <div className="flex items-center space-x-4">
                <div className="relative" ref={cartMenuRef}>
                  <button 
                    onClick={() => setCartMenuOpen(!cartMenuOpen)}
                    className="relative text-primary hover:text-accent transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      0
                    </span>
                  </button>

                  {/* Cart Dropdown Menu */}
                  {cartMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-4 z-[200] border border-gray-200">
                      <div className="px-6 py-8 text-center">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-primary font-medium mb-2">Il carrello è vuoto</p>
                        <p className="text-muted text-sm mb-6">Acquista un tour.</p>
                        <Link
                          to="/tours"
                          onClick={() => setCartMenuOpen(false)}
                          className="btn-primary inline-block"
                        >
                          Vai ai Tour
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/tours" className="btn-primary text-base px-12 py-3 font-medium">
                  Scopri
                  </Link>
                </div>
            </div>
            )}
          </div>

          {/* Mobile menu button - Hidden on admin routes */}
          {!isAdminRoute && (
          <button
            className="lg:hidden ml-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          )}
        </div>

        {/* Mobile menu - Hidden on admin routes */}
        {!isAdminRoute && mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-4 border-t border-white/10">
            {/* Mobile contacts */}
            <div className="space-y-2 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>info@fiatocorto.it</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>+39 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Sicilia</span>
              </div>
            </div>

            {/* Mobile navigation */}
            <div className="space-y-2">
            <Link
              to="/"
              className={`nav-link-underline block transition-colors py-2 ${isActive('/') ? 'text-accent active' : 'hover:text-accent'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/tours"
              className={`nav-link-underline block transition-colors py-2 ${isActive('/tours') ? 'text-accent active' : 'hover:text-accent'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tour
            </Link>
            <Link
              to="/calendar"
              className={`nav-link-underline block transition-colors py-2 ${isActive('/calendar') ? 'text-accent active' : 'hover:text-accent'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Calendario
            </Link>
            <Link
              to="/about"
              className={`nav-link-underline block transition-colors py-2 ${isActive('/about') ? 'text-accent active' : 'hover:text-accent'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Chi siamo
            </Link>
            <Link
              to="/contacts"
              className={`nav-link-underline block transition-colors py-2 ${isActive('/contacts') ? 'text-accent active' : 'hover:text-accent'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contatti
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`nav-link-underline block transition-colors py-2 ${isActive('/admin') ? 'text-accent active' : 'hover:text-accent'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            </div>

            {/* Mobile auth */}
            {!user && (
              <div className="space-y-2 pt-4 border-t border-white/10">
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-full hover:bg-white/10 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block btn-primary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrati
                </Link>
              </div>
            )}

            {/* Mobile CTA */}
            <div className="pt-4 border-t border-white/10">
              <Link
                to="/tours"
                className="block btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Scopri
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

