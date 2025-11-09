import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { LogOut, LayoutDashboard, User, Calendar, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import Modal from '../components/Modal';

type MenuItem = 'details' | 'dashboard' | 'bookings' | 'settings' | 'logout';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<MenuItem>('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeMenu === 'bookings' && user?.role === 'CUSTOMER') {
      fetchBookings();
    }
  }, [activeMenu, user]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await api.get('/api/bookings');
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Note: Backend doesn't have update user endpoint yet, this is a placeholder
      setMessage('Funzionalità in sviluppo');
      // await api.put('/api/users/me', formData);
    } catch (error) {
      setMessage('Errore nell\'aggiornamento');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'details' as MenuItem, label: 'Dettagli account', icon: User },
    ...(user?.role === 'ADMIN' ? [{ id: 'dashboard' as MenuItem, label: 'Dashboard', icon: LayoutDashboard }] : []),
    ...(user?.role === 'CUSTOMER' ? [{ id: 'bookings' as MenuItem, label: 'Le mie prenotazioni', icon: Calendar }] : []),
    { id: 'settings' as MenuItem, label: 'Impostazioni', icon: Settings },
    { id: 'logout' as MenuItem, label: 'Disconnetti', icon: LogOut },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'details':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-title text-2xl font-bold mb-6">Dettagli Account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-muted rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-muted rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.includes('Errore') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {message}
                </div>
              )}

              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Salvataggio...' : 'Salva Modifiche'}
              </button>
            </form>
          </div>
        );

      case 'dashboard':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-title text-2xl font-bold mb-6">Dashboard Admin</h2>
            <p className="text-muted mb-6">Accedi alla dashboard amministrativa per gestire tour, prenotazioni e utenti.</p>
            <Link to="/admin" className="btn-primary inline-flex items-center space-x-2">
              <LayoutDashboard className="w-5 h-5" />
              <span>Vai alla Dashboard</span>
            </Link>
          </div>
        );

      case 'bookings':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-title text-2xl font-bold mb-6">Le Mie Prenotazioni</h2>
            {loadingBookings ? (
              <p className="text-muted">Caricamento...</p>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted mb-4">Nessuna prenotazione trovata</p>
                <Link to="/tours" className="btn-primary">
                  Esplora Tour
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-title text-xl font-bold mb-2">
                      {booking.tourDate?.tour?.title || 'Tour'}
                    </h3>
                    <div className="space-y-1 text-sm text-muted mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {booking.tourDate?.dateStart && format(new Date(booking.tourDate.dateStart), 'dd MMMM yyyy HH:mm', {
                          locale: it,
                        })}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Prezzo totale: €{booking.totalPrice?.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.paymentStatus === 'PAID' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.paymentStatus === 'PAID' ? 'Pagato' : 'In attesa di pagamento'}
                        </span>
                      </div>
                    </div>
                    <Link 
                      to={`/tours/${booking.tourDate?.tour?.slug}`}
                      className="text-accent hover:underline text-sm"
                    >
                      Vedi dettagli tour →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-title text-2xl font-bold mb-6">Impostazioni</h2>
            <p className="text-muted">Le impostazioni saranno disponibili a breve.</p>
          </div>
        );

      case 'logout':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-title text-2xl font-bold mb-6">Disconnetti</h2>
            <p className="text-muted mb-6">Sei sicuro di voler disconnetterti dal tuo account?</p>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-full border-2 border-red-500 text-red-600 font-medium hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Disconnetti</span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-title text-4xl font-bold mb-8">Il Mio Account</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Menu */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'logout') {
                        setShowLogoutModal(true);
                      } else {
                        setActiveMenu(item.id);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-colors ${
                      isActive
                        ? 'bg-accent text-primary font-medium'
                        : 'text-primary hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Conferma Disconnessione"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted">Sei sicuro di voler disconnetterti dal tuo account?</p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 rounded-full border border-gray-300 text-primary hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={() => {
                setShowLogoutModal(false);
                handleLogout();
              }}
              className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnetti</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
