import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Eye, MoreVertical, Copy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/Modal';

export default function AdminTours() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  const handleDeleteClick = (tour: any) => {
    setTourToDelete({ id: tour.id, title: tour.title });
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!tourToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/api/tours/${tourToDelete.id}`);
      fetchTours();
      setShowDeleteModal(false);
      setTourToDelete(null);
    } catch (error) {
      alert('Errore nell\'eliminazione');
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await api.post(`/api/tours/${id}/duplicate`);
      fetchTours();
      setOpenMenuId(null);
      // Opzionale: navigare al tour duplicato
      // navigate(`/admin/tours/${response.data.tour.id}/edit`);
    } catch (error) {
      alert('Errore nella duplicazione del tour');
    }
  };

  const toggleMenu = (tourId: string) => {
    setOpenMenuId(openMenuId === tourId ? null : tourId);
  };

  // Chiudi il menu quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div>
      <AdminSidebar />
      <div className="ml-[300px] p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-title text-4xl font-bold">Gestione Tour</h1>
          <button onClick={() => navigate('/admin/tours/new')} className="btn-primary">
            <Plus className="w-5 h-5 inline mr-2" />
            Crea nuovo tour
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
                      <div className="relative" ref={(el) => (menuRefs.current[tour.id] = el)}>
                        <button
                          onClick={() => toggleMenu(tour.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          title="Menu azioni"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {openMenuId === tour.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <Link
                                to={`/tours/${tour.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpenMenuId(null)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-3" />
                                Visualizza
                              </Link>
                              <Link
                                to={`/admin/tours/${tour.id}/edit`}
                                onClick={() => setOpenMenuId(null)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Edit className="w-4 h-4 mr-3" />
                                Modifica
                              </Link>
                              <button
                                onClick={() => handleDuplicate(tour.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Copy className="w-4 h-4 mr-3" />
                                Duplica
                              </button>
                              <button
                                onClick={() => handleDeleteClick(tour)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Elimina
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            if (!deleting) {
              setShowDeleteModal(false);
              setTourToDelete(null);
            }
          }}
          title="Conferma Eliminazione"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-muted">
              Sei sicuro di voler eliminare il tour <strong>"{tourToDelete?.title}"</strong>?
              <br />
              Questa azione non può essere annullata.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTourToDelete(null);
                }}
                className="px-4 py-2 rounded-full border border-gray-300 text-primary hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                Annulla
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Eliminazione...' : 'Elimina'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
