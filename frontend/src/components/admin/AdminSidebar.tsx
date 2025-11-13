import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  ShoppingBag,
  Users,
  QrCode,
  Settings,
} from 'lucide-react';

export default function AdminSidebar() {
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

  return (
    <div className="w-[400px] bg-primary text-white min-h-screen pl-4 sm:pl-6 lg:pl-8 pr-32 py-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
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

