import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ShoppingBag, Euro, Filter, ArrowUpDown } from 'lucide-react';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterTour, setFilterTour] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  // Sort
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchBookings();
    fetchTours();
  }, []);
  
  const fetchTours = async () => {
    try {
      const response = await api.get('/api/tours');
      setTours(response.data.tours || []);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    }
  };

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

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...bookings];
    
    // Apply filters
    if (filterTour) {
      filtered = filtered.filter(booking => booking.tour?.id === filterTour);
    }
    
    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      filtered = filtered.filter(booking => {
        if (!booking.tour?.dateStart) return false;
        const bookingDate = new Date(booking.tour.dateStart);
        return format(bookingDate, 'yyyy-MM-dd') === format(filterDateObj, 'yyyy-MM-dd');
      });
    }
    
    if (filterStatus) {
      filtered = filtered.filter(booking => booking.paymentStatus === filterStatus);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'alphabetical':
          const nameA = a.user?.name || '';
          const nameB = b.user?.name || '';
          comparison = nameA.localeCompare(nameB, 'it');
          break;
        case 'price':
          comparison = (a.totalPrice || 0) - (b.totalPrice || 0);
          break;
        case 'date':
          const dateA = a.tour?.dateStart ? new Date(a.tour.dateStart).getTime() : 0;
          const dateB = b.tour?.dateStart ? new Date(b.tour.dateStart).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'status':
          const statusOrder = { 'PAID': 1, 'PENDING': 2, 'CANCELLED': 3, 'REFUNDED': 4 };
          comparison = (statusOrder[a.paymentStatus as keyof typeof statusOrder] || 99) - 
                       (statusOrder[b.paymentStatus as keyof typeof statusOrder] || 99);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [bookings, filterTour, filterDate, filterStatus, sortBy, sortOrder]);

  // Calculate statistics based on filtered bookings
  const stats = useMemo(() => {
    const totalBookings = filteredAndSortedBookings.length;
    const totalRevenue = filteredAndSortedBookings
      .filter(booking => booking.paymentStatus === 'PAID')
      .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    return {
      totalBookings,
      totalRevenue,
    };
  }, [filteredAndSortedBookings]);
  
  const handleResetFilters = () => {
    setFilterTour('');
    setFilterDate('');
    setFilterStatus('');
    setSortBy('date');
    setSortOrder('desc');
  };


  return (
    <div>
      <AdminSidebar />
      <div className="ml-[300px] p-8">
        <h1 className="font-title text-4xl font-bold mb-8">Gestione Prenotazioni</h1>

        {loading ? (
          <p className="text-muted">Caricamento...</p>
        ) : (
          <>
            {/* Filters and Sort */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-primary">Filtri e Ordinamento</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Filter by Tour */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Filtra per Tour</label>
                  <select
                    value={filterTour}
                    onChange={(e) => setFilterTour(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                  >
                    <option value="">Tutti i tour</option>
                    {tours.map((tour) => (
                      <option key={tour.id} value={tour.id}>
                        {tour.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Filter by Date */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Filtra per Data</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                  />
                </div>
                
                {/* Filter by Status */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Filtra per Stato</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                  >
                    <option value="">Tutti gli stati</option>
                    <option value="PENDING">In attesa di pagamento</option>
                    <option value="PAID">Pagato</option>
                    <option value="CANCELLED">Annullato</option>
                    <option value="REFUNDED">Rimborsato</option>
                  </select>
                </div>
                
                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Ordina per</label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none"
                    >
                      <option value="date">Data</option>
                      <option value="alphabetical">Ordine alfabetico</option>
                      <option value="price">Prezzo</option>
                      <option value="status">Stato</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      title={sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {(filterTour || filterDate || filterStatus || sortBy !== 'date' || sortOrder !== 'desc') && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Reset filtri
                </button>
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">Totale Prenotazioni</p>
                    <p className="text-3xl font-bold text-primary">{stats.totalBookings}</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-full">
                    <ShoppingBag className="w-8 h-8 text-accent" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted mb-1">Totale Entrate</p>
                    <p className="text-3xl font-bold text-primary">
                      €{stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-full">
                    <Euro className="w-8 h-8 text-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
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
                {filteredAndSortedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted">
                      Nessuna prenotazione trovata
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{booking.user.name}</p>
                        <p className="text-sm text-muted">{booking.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{booking.tour?.title || 'Tour non trovato'}</td>
                    <td className="px-6 py-4">
                      {booking.tour?.dateStart && format(new Date(booking.tour.dateStart), 'dd MMM yyyy', {
                        locale: it,
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {booking.adults} adulti
                      {booking.children > 0 && `, ${booking.children} bambini`}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {booking.totalPrice === 0 ? 'Free' : `€${booking.totalPrice.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.paymentStatus === 'PAID' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.paymentStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : booking.paymentStatus === 'REFUNDED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus === 'PAID' 
                          ? 'Pagato' 
                          : booking.paymentStatus === 'CANCELLED'
                          ? 'Annullato'
                          : booking.paymentStatus === 'REFUNDED'
                          ? 'Rimborsato'
                          : 'In attesa di pagamento'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                        className="text-accent hover:underline text-sm"
                      >
                        Dettagli
                      </button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

