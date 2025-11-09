import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AvatarMenu from './AvatarMenu';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img 
              src="/resources/Bianco.png" 
              alt="Fiato Corto" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/tours" className="hover:text-accent transition-colors">
              Tour
            </Link>
            <Link to="/calendar" className="hover:text-accent transition-colors">
              Calendario
            </Link>
            {user && (
              <>
                <Link to="/bookings" className="hover:text-accent transition-colors">
                  Le mie prenotazioni
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="hover:text-accent transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
            <div className="flex items-center space-x-4">
              <button className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
              {user ? (
                <AvatarMenu user={user} onLogout={handleLogout} />
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Registrati
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/tours"
              className="block hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tour
            </Link>
            <Link
              to="/calendar"
              className="block hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Calendario
            </Link>
            {user && (
              <>
                <Link
                  to="/bookings"
                  className="block hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Le mie prenotazioni
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="block hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
            {!user && (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
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
          </div>
        )}
      </div>
    </nav>
  );
}

