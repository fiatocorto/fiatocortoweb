import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminTours() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await api.get('/api/tours');
      setTours(response.data.tours);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo tour?')) {
      return;
    }

    try {
      await api.delete(`/api/tours/${id}`);
      fetchTours();
    } catch (error) {
      alert('Errore nell\'eliminazione');
    }
  };

  return (
    <div>
      <AdminSidebar />
      <div className="ml-[300px] p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-title text-4xl font-bold">Gestione Tour</h1>
          <button onClick={() => navigate('/admin/tours/new')} className="btn-primary">
            <Plus className="w-5 h-5 inline mr-2" />
            Crea Nuovo Tour
          </button>
        </div>

        {loading ? (
          <p className="text-muted">Caricamento...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Prezzo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Lingua
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Difficoltà
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Posti disponibili
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tours.map((tour) => (
                  <tr key={tour.id}>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/tours/${tour.id}/edit`}
                        className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <img
                          src={tour.coverImage}
                          alt={tour.title}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <p className="font-medium">{tour.title}</p>
                          <p className="text-sm text-muted">{tour.slug}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {tour.priceAdult === 0 ? 'Free' : `€${tour.priceAdult}`} / {tour.priceChild === 0 ? 'Free' : `€${tour.priceChild}`}
                    </td>
                    <td className="px-6 py-4">{tour.language}</td>
                    <td className="px-6 py-4">
                      {tour.difficulty || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        tour.availableSeats === 0 
                          ? 'text-red-600' 
                          : tour.availableSeats <= 10 
                          ? 'text-yellow-600' 
                          : 'text-green-600'
                      }`}>
                        {tour.availableSeats ?? tour.maxSeats ?? 0} / {tour.maxSeats ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/tours/${tour.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          title="Visualizza nel frontend"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/admin/tours/${tour.id}/edit`}
                          className="text-accent hover:text-accent/80"
                          title="Modifica"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tour.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Elimina"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
