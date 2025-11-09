import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import QRBadge from '../components/QRBadge';

export default function BookingPage() {
  const { tourDateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tourDate, setTourDate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    adults: 1,
    children: 0,
    paymentMethod: 'ONSITE' as 'ONSITE' | 'CARD_STUB',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(() => {
    fetchTourDate();
  }, [tourDateId]);

  const fetchTourDate = async () => {
    try {
      const response = await api.get(`/api/tour-dates?tourId=${tourDateId}`);
      const dates = response.data.tourDates;
      const date = dates.find((d: any) => d.id === tourDateId);
      if (date) {
        setTourDate(date);
      }
    } catch (error) {
      console.error('Failed to fetch tour date:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!tourDate) return 0;
    const priceAdult = tourDate.priceOverride || tourDate.tour.priceAdult;
    const priceChild = tourDate.tour.priceChild;
    return booking.adults * priceAdult + booking.children * priceChild;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post('/api/bookings', {
        tourDateId,
        ...booking,
      });
      setBookingResult(response.data);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Errore nella prenotazione');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-muted">Caricamento...</p>
      </div>
    );
  }

  if (!tourDate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-muted">Data tour non trovata</p>
      </div>
    );
  }

  if (bookingResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="font-title text-3xl font-bold mb-4">
            Prenotazione Confermata!
          </h1>
          <p className="text-muted mb-6">
            La tua prenotazione è stata creata con successo. Riceverai una conferma via email.
          </p>
          <div className="flex justify-center mb-6">
            <QRBadge qrCode={bookingResult.qrToken} />
          </div>
          <div className="space-y-2 mb-6">
            <p className="text-sm text-muted">
              <strong>Codice prenotazione:</strong> {bookingResult.booking.id}
            </p>
            <p className="text-sm text-muted">
              <strong>Totale:</strong> €{bookingResult.booking.totalPrice.toFixed(2)}
            </p>
          </div>
          <div className="flex space-x-4 justify-center">
            <button onClick={() => navigate('/bookings')} className="btn-primary">
              Le mie prenotazioni
            </button>
            <button onClick={() => navigate('/tours')} className="btn-secondary">
              Altri tour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const availableSeats = tourDate.availableSeats || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-title text-4xl font-bold mb-8">Conferma Prenotazione</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="font-title text-2xl font-bold mb-4">
              {tourDate.tour.title}
            </h2>
            <div className="space-y-3 text-muted">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {format(new Date(tourDate.dateStart), 'dd MMMM yyyy HH:mm', {
                  locale: it,
                })}
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {tourDate.tour.language}
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {availableSeats} posti disponibili
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="font-title text-2xl font-bold mb-6">Dettagli Prenotazione</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Numero Adulti
                </label>
                <input
                  type="number"
                  min="1"
                  max={availableSeats}
                  className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  value={booking.adults}
                  onChange={(e) =>
                    setBooking({ ...booking, adults: parseInt(e.target.value) || 1 })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Numero Bambini
                </label>
                <input
                  type="number"
                  min="0"
                  max={availableSeats - booking.adults}
                  className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  value={booking.children}
                  onChange={(e) =>
                    setBooking({ ...booking, children: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Metodo di Pagamento
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-accent/5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONSITE"
                    checked={booking.paymentMethod === 'ONSITE'}
                    onChange={(e) =>
                      setBooking({ ...booking, paymentMethod: e.target.value as any })
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Paga in loco</div>
                    <div className="text-sm text-muted">
                      Pagherai al momento dell'escursione
                    </div>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-accent/5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD_STUB"
                    checked={booking.paymentMethod === 'CARD_STUB'}
                    onChange={(e) =>
                      setBooking({ ...booking, paymentMethod: e.target.value as any })
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Paga online (Stub)</div>
                    <div className="text-sm text-muted">
                      Pagamento con carta - disponibile a breve
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Note (opzionale)
              </label>
              <textarea
                className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
                value={booking.notes}
                onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                placeholder="Allergie, richieste speciali, ecc."
              />
            </div>

            <button
              type="submit"
              disabled={submitting || booking.adults + booking.children > availableSeats}
              className="btn-primary w-full"
            >
              {submitting ? 'Conferma in corso...' : 'Conferma Prenotazione'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h3 className="font-bold mb-4">Riepilogo</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted">Adulti x{booking.adults}</span>
                <span>
                  €
                  {(
                    booking.adults *
                    (tourDate.priceOverride || tourDate.tour.priceAdult)
                  ).toFixed(2)}
                </span>
              </div>
              {booking.children > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Bambini x{booking.children}</span>
                  <span>
                    €{(booking.children * tourDate.tour.priceChild).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Totale</span>
                <span className="text-accent">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

