import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Users, ArrowLeft, CheckCircle, Clock, XCircle, X } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import QRBadge from '../components/QRBadge';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/api/bookings/${id}`);
      setBooking(response.data.booking);
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

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pagato';
      case 'PENDING':
        return 'In attesa di pagamento';
      case 'CANCELLED':
        return 'Annullato';
      default:
        return status;
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelBooking = async () => {
    if (!booking || !id) return;

    setCancelling(true);
    try {
      await api.put(`/api/bookings/${id}`, {
        paymentStatus: 'CANCELLED',
      });
      // Ricarica i dati della prenotazione
      await fetchBooking();
      setShowCancelModal(false);
      alert('Prenotazione annullata con successo. I posti sono stati resi disponibili.');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Errore nell\'annullamento della prenotazione');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-muted">Caricamento...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error || 'Prenotazione non trovata'}</p>
          <Link to="/account" className="btn-primary">
            Torna alle prenotazioni
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header con link indietro */}
        <div className="mb-6">
          <Link
            to="/bookings"
            className="inline-flex items-center text-muted hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alle prenotazioni
          </Link>
        </div>

        {/* Card principale */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="font-title text-4xl font-bold mb-8">Dettagli Prenotazione</h1>

          <div className="space-y-6">
            {/* ID Prenotazione */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-primary">ID Prenotazione</span>
                <span className="text-lg font-mono font-bold text-accent">{booking.id}</span>
              </div>
            </div>

            {/* Nome account */}
            {booking.user?.name && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">Prenotato da</span>
                  <span className="text-lg font-bold text-accent">{booking.user.name}</span>
                </div>
              </div>
            )}

            {/* Titolo del tour */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-title text-2xl font-bold">{booking.tour?.title || 'Tour'}</h2>
              {/* Link al tour */}
              {booking.tour?.slug && (
                <Link
                  to={`/tours/${booking.tour.slug}`}
                  className="px-4 py-2 bg-accent text-primary rounded-full hover:bg-accent/90 transition-colors font-semibold text-sm"
                >
                  Pagina del tour
                </Link>
              )}
            </div>

            {/* Data del tour */}
            <div className="flex items-center text-muted">
              <Calendar className="w-5 h-5 mr-2" />
              <span>
                {booking.tour?.dateStart && format(new Date(booking.tour.dateStart), 'dd MMMM yyyy', { locale: it })}
                {booking.tour?.dateEnd && !isSameDay(new Date(booking.tour.dateStart), new Date(booking.tour.dateEnd)) && (
                  <> - {format(new Date(booking.tour.dateEnd), 'dd MMMM yyyy', { locale: it })}</>
                )}
              </span>
            </div>

            {/* Data acquisto */}
            {booking.createdAt && (
              <div className="flex items-center text-muted">
                <Calendar className="w-5 h-5 mr-2" />
                <span>
                  Data acquisto: {format(new Date(booking.createdAt), 'dd MMMM yyyy HH:mm', { locale: it })}
                </span>
              </div>
            )}

            {/* Numero adulti e bambini */}
            <div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-muted" />
                <span className="text-muted">Adulti: <strong className="text-primary">{booking.adults}</strong></span>
              </div>
              {/* <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-muted" />
                <span className="text-muted">Bambini: <strong className="text-primary">{booking.children}</strong></span>
              </div> */}
            </div>

            {/* Prezzo totale */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-primary">Prezzo totale</span>
                <span className="text-2xl font-bold text-accent">
                  {booking.totalPrice === 0 ? 'Free' : `€${booking.totalPrice.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Stato pagamento */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getPaymentStatusIcon(booking.paymentStatus)}
                  <span className="text-lg font-semibold text-primary">Stato</span>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                  {getPaymentStatusLabel(booking.paymentStatus)}
                </span>
              </div>
            </div>

            {/* Codice QR */}
            {booking.qrCode && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-primary mb-4">Codice QR</h3>
                <div className="flex justify-center">
                  <QRBadge qrCode={booking.qrCode} />
                </div>
              </div>
            )}

            {/* Pulsante Annulla prenotazione */}
            {booking.paymentStatus !== 'CANCELLED' && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full px-6 py-3 border-2 border-red-500 rounded-full hover:bg-red-50 transition-colors font-semibold text-red-600"
                >
                  <X className="w-5 h-5 inline mr-2" />
                  Annulla prenotazione
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal conferma annullamento */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Conferma Annullamento"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted">
            Sei sicuro di voler annullare questa prenotazione? I posti occupati verranno resi disponibili per il tour.
          </p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 rounded-full border border-gray-300 text-primary hover:bg-gray-50 transition-colors"
              disabled={cancelling}
            >
              Annulla
            </button>
            <button
              onClick={handleCancelBooking}
              disabled={cancelling}
              className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? 'Annullamento...' : 'Conferma Annullamento'}
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

