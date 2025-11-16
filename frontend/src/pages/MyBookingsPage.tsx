import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import QRBadge from '../components/QRBadge';
import Modal from '../components/Modal';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string, requestRefund: boolean) => {
    if (!confirm('Sei sicuro di voler cancellare questa prenotazione?')) {
      return;
    }

    try {
      await api.delete(`/api/bookings/${bookingId}`, {
        params: { requestRefund: requestRefund.toString() },
      });
      fetchBookings();
    } catch (error) {
      alert('Errore nella cancellazione');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-muted">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-title text-4xl font-bold mb-8">Le Mie Prenotazioni</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted mb-4">Nessuna prenotazione trovata</p>
          <Link to="/tours" className="btn-primary">
            Esplora Tour
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="font-title text-xl font-bold mb-2">
                    {booking.tour?.title || booking.tour?.tour?.title || 'Tour'}
                  </h3>
                  <div className="space-y-1 text-sm text-muted">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {booking.tour?.dateStart && format(new Date(booking.tour.dateStart), 'dd MMMM yyyy', {
                        locale: it,
                      })}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {booking.adults} adulti
                      {booking.children > 0 && `, ${booking.children} bambini`}
                    </div>
                  </div>
                  <div className="mt-3">
                    <span
                      className={`badge ${
                        booking.paymentStatus === 'PAID'
                          ? 'badge-success'
                          : booking.paymentStatus === 'CANCELLED'
                          ? 'badge-danger'
                          : 'badge-muted'
                      }`}
                    >
                      {booking.paymentStatus === 'PAID'
                        ? 'Pagato'
                        : booking.paymentStatus === 'CANCELLED'
                        ? 'Cancellato'
                        : 'In attesa'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                  <div className="text-right mb-2">
                    <p className="text-2xl font-bold text-accent">
                      €{(booking.totalPrice || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/bookings/${booking.id}`}
                      className="btn-outline text-sm"
                    >
                      Dettagli
                    </Link>
                    {booking.paymentStatus !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancel(booking.id, true)}
                        className="btn-outline text-sm text-red-600 hover:border-red-600"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Cancella
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        title="QR Code Prenotazione"
      >
        {selectedBooking && (
          <div className="flex flex-col items-center">
            <QRBadge qrCode={selectedBooking.qrCode} />
            <p className="mt-4 text-sm text-muted text-center">
              Mostra questo QR code al check-in dell'escursione
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

