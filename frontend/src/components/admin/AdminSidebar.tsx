import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  ShoppingBag,
  Users,
  QrCode,
  Settings,
  X,
} from 'lucide-react';

type AdminSidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
};

export default function AdminSidebar({ isOpen = false, onClose, onNavigate }: AdminSidebarProps) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/tours', icon: MapPin, label: 'Tour' },
    { path: '/admin/calendar', icon: Calendar, label: 'Calendario' },
    { path: '/admin/bookings', icon: ShoppingBag, label: 'Prenotazioni' },
    { path: '/admin/users', icon: Users, label: 'Utenti' },
    { path: '/admin/qr-scanner', icon: QrCode, label: 'QR Scanner' },
    { path: '/admin/settings', icon: Settings, label: 'Impostazioni' },
  ];

  const handleNavigate = () => {
    onNavigate?.();
    onClose?.();
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-[280px] bg-primary text-white pl-4 sm:pl-6 lg:pl-8 pr-8 py-4 z-50 pt-20 transition-transform duration-200 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <button
        className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Chiudi menu admin"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Logo */}
      <Link to="/" className="flex items-center mb-12" onClick={handleNavigate}>
        <img 
          src="/resources/Bianco.png" 
          alt="Fiato Corto" 
          className="h-12 w-auto object-contain"
        />
      </Link>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavigate}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-accent text-primary'
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

