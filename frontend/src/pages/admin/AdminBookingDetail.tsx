import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, DollarSign, CheckCircle, Clock, XCircle, Save, User, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminBookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state for booking
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // Form state for user
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/api/bookings/${id}`);
      const bookingData = response.data.booking;
      setBooking(bookingData);
      
      // Set form values
      setPaymentStatus(bookingData.paymentStatus);
      setAdults(bookingData.adults);
      setChildren(bookingData.children);
      setNotes(bookingData.notes || '');
      
      // Set user form values
      setUserName(bookingData.user?.name || '');
      setUserEmail(bookingData.user?.email || '');
    } catch (error: any) {
      console.error('Failed to fetch booking:', error);
      if (error.response?.status === 404) {
        setError('Prenotazione non trovata');
      } else if (error.response?.status === 403) {
        setError('Accesso negato');
      } else {
        setError('Errore nel caricamento della prenotazione');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBooking = async () => {
    if (!booking || !id) return;

    setSaving(true);
    setSuccessMessage(null);
    setError(null);

    try {
      const response = await api.put(`/api/bookings/${id}`, {
        paymentStatus,
        adults,
        children,
        notes: notes || null,
      });
      
      setBooking(response.data.booking);
      setSuccessMessage('Prenotazione aggiornata con successo');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Failed to update booking:', error);
      setError(error.response?.data?.error || 'Errore nell\'aggiornamento della prenotazione');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUser = async () => {
    if (!booking?.user?.id) return;

    setSaving(true);
    setSuccessMessage(null);
    setError(null);

    try {
      // Split name into firstName and lastName
      const nameParts = userName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await api.put(`/api/admin/users/${booking.user.id}`, {
        firstName,
        lastName,
        email: userEmail,
      });
      
      // Reload booking to get updated user data
      await fetchBooking();
      setSuccessMessage('Dati cliente aggiornati con successo');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Failed to update user:', error);
      setError(error.response?.data?.error || 'Errore nell\'aggiornamento dei dati cliente');
    } finally {
      setSaving(false);
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pagato';
      case 'PENDING':
        return 'In attesa di pagamento';
      case 'CANCELLED':
        return 'Annullato';
      case 'REFUNDED':
        return 'Rimborsato';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div>
        <AdminSidebar />
        <div className="ml-[300px] p-8 text-center">
          <p className="text-muted">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div>
        <AdminSidebar />
        <div className="ml-[300px] p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/admin/bookings" className="text-accent hover:text-accent/80">
            Torna alla lista prenotazioni
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div>
      <AdminSidebar />
      <div className="ml-[300px] p-8">
        {/* Success/Error messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/admin/bookings" 
            className="inline-flex items-center text-muted hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alla lista
          </Link>
          <h1 className="font-title text-4xl font-bold text-primary">Dettaglio Prenotazione</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary">Informazioni Prenotazione</h2>
              <button
                onClick={handleSaveBooking}
                disabled={saving}
                className="px-4 py-2 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Salvataggio...' : 'Salva'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Tour Info */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Tour</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{booking.tour?.title || 'Tour non trovato'}</p>
                  {booking.tour?.dateStart && (
                    <p className="text-sm text-muted mt-1">
                      {format(new Date(booking.tour.dateStart), 'dd MMMM yyyy', { locale: it })}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Stato Pagamento <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                >
                  <option value="PENDING">In attesa di pagamento</option>
                  <option value="PAID">Pagato</option>
                  <option value="CANCELLED">Annullato</option>
                  <option value="REFUNDED">Rimborsato</option>
                </select>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(paymentStatus)}`}>
                    {getPaymentStatusLabel(paymentStatus)}
                  </span>
                </div>
              </div>

              {/* Participants */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                  Adulti <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Bambini
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              {/* Total Price */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Totale</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-bold text-lg">
                    {(() => {
                      const calculatedTotal = booking.tour?.priceAdult && booking.tour?.priceChild
                        ? (adults * booking.tour.priceAdult) + (children * booking.tour.priceChild)
                        : booking.totalPrice;
                      return calculatedTotal === 0 ? 'Free' : `€${calculatedTotal.toFixed(2)}`;
                    })()}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {booking.tour?.priceAdult && booking.tour?.priceChild && (
                      <>
                        {adults} × €{booking.tour.priceAdult.toFixed(2)} + {children} × €{booking.tour.priceChild.toFixed(2)}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Note</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Note aggiuntive sulla prenotazione..."
                />
              </div>

              {/* Booking Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted">Data prenotazione</p>
                    <p className="font-medium">
                      {format(new Date(booking.createdAt), 'dd MMMM yyyy HH:mm', { locale: it })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">QR Code</p>
                    <p className="font-mono text-xs">{booking.qrCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary">Dati Cliente</h2>
              <button
                onClick={handleSaveUser}
                disabled={saving}
                className="px-4 py-2 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Salvataggio...' : 'Salva'}
              </button>
            </div>

            <div className="space-y-6">
              {/* User Name */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    placeholder="Nome e cognome"
                  />
                </div>
              </div>

              {/* User Email */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* User ID */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <p className="text-muted">ID Utente</p>
                  <p className="font-mono text-xs mt-1">{booking.user?.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

