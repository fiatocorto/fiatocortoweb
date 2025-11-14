import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await api.put(`/api/bookings/${id}`, { paymentStatus: status });
      fetchBookings();
    } catch (error) {
      alert('Errore nell\'aggiornamento');
    }
  };

  return (
    <div>
      <AdminSidebar />
      <div className="ml-[300px] p-8">
        <h1 className="font-title text-4xl font-bold mb-8">Gestione Prenotazioni</h1>

        {loading ? (
          <p className="text-muted">Caricamento...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Partecipanti
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Totale
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Stato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{booking.user.name}</p>
                        <p className="text-sm text-muted">{booking.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{booking.tour.tour.title}</td>
                    <td className="px-6 py-4">
                      {format(new Date(booking.tour.dateStart), 'dd MMM yyyy HH:mm', {
                        locale: it,
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {booking.adults} adulti
                      {booking.children > 0 && `, ${booking.children} bambini`}
                    </td>
                    <td className="px-6 py-4 font-bold">€{booking.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.paymentStatus}
                        onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                        className="px-3 py-1 border border-muted rounded-lg text-sm"
                      >
                        <option value="PENDING">In attesa</option>
                        <option value="PAID">Pagato</option>
                        <option value="CANCELLED">Cancellato</option>
                        <option value="REFUNDED">Rimborsato</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-accent hover:underline text-sm">
                        Dettagli
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

