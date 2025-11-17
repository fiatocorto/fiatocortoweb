import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { 
  LogOut, User, Calendar, Settings, Edit2, Save, X, 
  BarChart3, MapPin, Euro, Clock, CheckCircle2, AlertCircle,
  Bell, Shield, Lock, Mail, Phone, Globe, Heart, Star,
  TrendingUp, Users, FileText, CreditCard, QrCode, Eye
} from 'lucide-react';
import { format, isAfter, isBefore, differenceInDays } from 'date-fns';
import { it } from 'date-fns/locale';
import Modal from '../components/Modal';

type MenuItem = 'dashboard' | 'profile' | 'bookings' | 'settings' | 'logout';

export default function AccountPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const location = useLocation();
  
  // Determine active menu from URL
  const getActiveMenuFromUrl = (): MenuItem => {
    if (section && ['dashboard', 'profile', 'bookings', 'settings'].includes(section)) {
      return section as MenuItem;
    }
    // If no section or invalid section, default to dashboard
    if (location.pathname === '/account' || !section) {
      return 'dashboard';
    }
    return 'dashboard';
  };

  const [activeMenu, setActiveMenu] = useState<MenuItem>(getActiveMenuFromUrl());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    newsletter: true,
  });

  useEffect(() => {
    if (user) {
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      setFormData({
        firstName,
        lastName,
        email: user.email,
      });
      setOriginalData({
        firstName,
        lastName,
        email: user.email,
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Fetch bookings when navigating to bookings section if not already loaded
  useEffect(() => {
    if (activeMenu === 'bookings' && user && bookings.length === 0 && !loadingBookings) {
      fetchBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu]);

  // Update active menu when URL changes
  useEffect(() => {
    const menu = getActiveMenuFromUrl();
    setActiveMenu(menu);
    
    // Redirect /account to /account/dashboard
    if (location.pathname === '/account') {
      navigate('/account/dashboard', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, location.pathname]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      // Force to get only current user's bookings, even if admin
      const response = await api.get(`/api/bookings?userId=${user?.id}`);
      const bookingsData = response.data.bookings || [];
      console.log('Fetched bookings:', bookingsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateUser(formData.firstName, formData.lastName, formData.email);
      setOriginalData({ ...formData });
      setIsEditing(false);
      setMessage('Profilo aggiornato con successo');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Errore nell\'aggiornamento');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate statistics
  const stats = {
    totalBookings: bookings.length,
    upcomingBookings: bookings.filter(b => {
      if (!b.tour?.dateStart) return false;
      return isAfter(new Date(b.tour.dateStart), new Date()) && b.paymentStatus !== 'CANCELLED';
    }).length,
    totalSpent: bookings
      .filter(b => b.paymentStatus === 'PAID')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    completedBookings: bookings.filter(b => {
      if (!b.tour?.dateStart) return false;
      return isBefore(new Date(b.tour.dateStart), new Date()) && b.paymentStatus === 'PAID';
    }).length,
  };

  const upcomingBookings = bookings
    .filter(b => {
      if (!b.tour?.dateStart) return false;
      return isAfter(new Date(b.tour.dateStart), new Date()) && b.paymentStatus !== 'CANCELLED';
    })
    .sort((a, b) => new Date(a.tour.dateStart).getTime() - new Date(b.tour.dateStart).getTime())
    .slice(0, 3);

  const menuItems = [
    { id: 'dashboard' as MenuItem, label: 'Dashboard', icon: BarChart3 },
    { id: 'profile' as MenuItem, label: 'Profilo', icon: User },
    { id: 'bookings' as MenuItem, label: 'Prenotazioni', icon: Calendar },
    { id: 'settings' as MenuItem, label: 'Impostazioni', icon: Settings },
    { id: 'logout' as MenuItem, label: 'Disconnetti', icon: LogOut },
  ];

  const getInitials = () => {
    const first = formData.firstName?.[0] || '';
    const last = formData.lastName?.[0] || '';
    return (first + last).toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-accent/20 via-accent/10 to-transparent rounded-2xl p-8 border border-accent/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-title text-3xl font-bold mb-2">
                    Ciao, {formData.firstName || 'Utente'}! 👋
                  </h2>
                  <p className="text-muted text-lg">
                    Benvenuto nella tua area personale
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 text-accent text-4xl font-bold">
                  {getInitials()}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Calendar className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <p className="text-sm text-muted mb-1">Prenotazioni Totali</p>
                <p className="text-3xl font-bold">{stats.totalBookings}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <p className="text-sm text-muted mb-1">Prossime Escursioni</p>
                <p className="text-3xl font-bold">{stats.upcomingBookings}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Euro className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <p className="text-sm text-muted mb-1">Totale Speso</p>
                <p className="text-3xl font-bold">€{stats.totalSpent.toFixed(2)}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <p className="text-sm text-muted mb-1">Completate</p>
                <p className="text-3xl font-bold">{stats.completedBookings}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-title text-xl font-bold mb-4">Azioni Rapide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/tours"
                  className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
                >
                  <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Esplora Tour</p>
                    <p className="text-sm text-muted">Scopri nuove avventure</p>
                  </div>
                </Link>

                <Link
                  to="/calendar"
                  className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
                >
                  <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Calendario</p>
                    <p className="text-sm text-muted">Vedi date disponibili</p>
                  </div>
                </Link>

                            <Link
                              to="/account/bookings"
                              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group text-left"
                            >
                  <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">Le Mie Prenotazioni</p>
                    <p className="text-sm text-muted">Gestisci prenotazioni</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-title text-xl font-bold">Prossime Escursioni</h3>
                  <Link
                    to="/account/bookings"
                    className="text-accent hover:text-accent/80 font-medium text-sm"
                  >
                    Vedi tutte →
                  </Link>
                </div>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => {
                    const daysUntil = differenceInDays(new Date(booking.tour.dateStart), new Date());
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-accent/50 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                            <MapPin className="w-6 h-6 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">
                              {booking.tour?.title || 'Tour'}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-muted">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {format(new Date(booking.tour.dateStart), 'dd MMMM yyyy', { locale: it })}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {booking.adults + booking.children} {booking.adults + booking.children === 1 ? 'persona' : 'persone'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-xs text-muted mb-1">
                              {daysUntil === 0 ? 'Oggi' : daysUntil === 1 ? 'Domani' : `Tra ${daysUntil} giorni`}
                            </p>
                            <p className="font-bold text-accent">€{booking.totalPrice?.toFixed(2) || '0.00'}</p>
                          </div>
                          <Link
                            to={`/bookings/${booking.id}`}
                            className="px-4 py-2 bg-accent text-primary rounded-full font-medium hover:bg-accent/90 transition-colors"
                          >
                            Dettagli
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {stats.totalBookings === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-12 h-12 text-accent" />
                </div>
                <h3 className="font-title text-2xl font-bold mb-2">Nessuna prenotazione ancora</h3>
                <p className="text-muted mb-6">Inizia la tua avventura esplorando i nostri tour</p>
                <Link to="/tours" className="btn-primary inline-flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Esplora Tour</span>
                </Link>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-title text-2xl font-bold mb-2">Il Mio Profilo</h2>
                <p className="text-muted">Gestisci le informazioni del tuo account</p>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-6 py-3 text-accent hover:bg-accent/10 rounded-full transition-colors font-medium"
                >
                  <Edit2 className="w-5 h-5" />
                  <span>Modifica</span>
                </button>
              )}
            </div>

            {/* Avatar Section */}
            <div className="flex items-center space-x-6 mb-8 pb-8 border-b">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-4xl font-bold text-primary shadow-lg">
                {getInitials()}
              </div>
              <div>
                <h3 className="font-title text-xl font-bold mb-1">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-muted mb-2">{formData.email}</p>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                    Account verificato
                  </span>
                  {user?.role === 'CUSTOMER' && (
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                      Cliente
                    </span>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-accent" />
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-accent" />
                    Cognome
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-accent" />
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  required
                />
              </div>

              {message && (
                <div className={`p-4 rounded-xl flex items-center space-x-2 ${
                  message.includes('Errore') 
                    ? 'bg-red-50 text-red-800 border border-red-200' 
                    : 'bg-green-50 text-green-800 border border-green-200'
                }`}>
                  {message.includes('Errore') ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  <span>{message}</span>
                </div>
              )}

              {isEditing && (
                <div className="flex items-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-full text-primary hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <X className="w-4 h-4" />
                    <span>Annulla</span>
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Salvataggio...' : 'Salva modifiche'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-title text-2xl font-bold mb-2">Le Mie Prenotazioni</h2>
                  <p className="text-muted">Gestisci tutte le tue prenotazioni</p>
                </div>
                <Link to="/tours" className="btn-primary">
                  Nuova Prenotazione
                </Link>
              </div>

              {loadingBookings ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></div>
                  <p className="text-muted">Caricamento prenotazioni...</p>
                </div>
              ) : !bookings || bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-12 h-12 text-accent" />
                  </div>
                  <h3 className="font-title text-xl font-bold mb-2">Nessuna prenotazione trovata</h3>
                  <p className="text-muted mb-6">Inizia a prenotare le tue prime escursioni</p>
                  <Link to="/tours" className="btn-primary inline-flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Esplora Tour</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const isUpcoming = booking.tour?.dateStart && isAfter(new Date(booking.tour.dateStart), new Date());
                    const isPast = booking.tour?.dateStart && isBefore(new Date(booking.tour.dateStart), new Date());
                    
                    return (
                      <div
                        key={booking.id}
                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-accent/50 hover:shadow-lg transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-title text-xl font-bold mb-2">
                                  {booking.tour?.title || 'Tour'}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {booking.tour?.dateStart && format(new Date(booking.tour.dateStart), 'dd MMMM yyyy', { locale: it })}
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {booking.adults} adult{booking.adults !== 1 ? 'i' : 'o'}
                                    {booking.children > 0 && `, ${booking.children} bambin${booking.children !== 1 ? 'i' : 'o'}`}
                                  </span>
                                  <span className="flex items-center font-semibold text-primary">
                                    <Euro className="w-4 h-4 mr-1" />
                                    {booking.totalPrice?.toFixed(2) || '0.00'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  booking.paymentStatus === 'PAID' 
                                    ? 'bg-green-100 text-green-800' 
                                    : booking.paymentStatus === 'CANCELLED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {booking.paymentStatus === 'PAID' 
                                    ? 'Pagato' 
                                    : booking.paymentStatus === 'CANCELLED'
                                    ? 'Annullato'
                                    : 'In attesa'}
                                </span>
                                {isUpcoming && (
                                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    Prossimamente
                                  </span>
                                )}
                                {isPast && booking.paymentStatus === 'PAID' && (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                    Completata
                                  </span>
                                )}
                              </div>
                            </div>
                            {booking.createdAt && (
                              <p className="text-xs text-muted">
                                Prenotato il {format(new Date(booking.createdAt), 'dd MMMM yyyy', { locale: it })}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/bookings/${booking.id}`}
                              className="px-6 py-3 border-2 border-accent text-accent rounded-full hover:bg-accent hover:text-primary transition-colors font-semibold"
                            >
                              Dettagli
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="font-title text-2xl font-bold mb-2">Impostazioni</h2>
              <p className="text-muted mb-8">Gestisci le preferenze del tuo account</p>

              {/* Notifications */}
              <div className="mb-8 pb-8 border-b">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-accent" />
                  Notifiche
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">Notifiche Email</p>
                      <p className="text-sm text-muted">Ricevi aggiornamenti via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-muted">Ricevi le nostre newsletter</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.newsletter}
                        onChange={(e) => setSettings({ ...settings, newsletter: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium">Email Marketing</p>
                      <p className="text-sm text-muted">Ricevi offerte e promozioni</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.marketingEmails}
                        onChange={(e) => setSettings({ ...settings, marketingEmails: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Privacy & Security */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-accent" />
                  Privacy e Sicurezza
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/privacy"
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-accent" />
                      <span className="font-medium">Privacy Policy</span>
                    </div>
                    <Eye className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                  </Link>

                  <Link
                    to="/cookie"
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-accent" />
                      <span className="font-medium">Cookie Policy</span>
                    </div>
                    <Eye className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="font-semibold text-lg mb-4 text-red-600">Area Pericolosa</h3>
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-800 mb-4">
                  Le azioni seguenti sono permanenti e non possono essere annullate.
                </p>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 border-2 border-red-500 text-red-600 rounded-full hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Disconnetti Account</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Menu */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              {/* User Info */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-lg font-bold text-primary">
                    {getInitials()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{formData.firstName} {formData.lastName}</p>
                    <p className="text-xs text-muted truncate">{formData.email}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  
                  if (item.id === 'logout') {
                    return (
                      <button
                        key={item.id}
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-all text-primary hover:bg-gray-100"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                  
                  return (
                    <Link
                      key={item.id}
                      to={`/account/${item.id}`}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-full transition-all ${
                        isActive
                          ? 'bg-accent text-primary font-medium shadow-md'
                          : 'text-primary hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
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
