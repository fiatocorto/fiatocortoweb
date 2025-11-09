import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/Modal';

export default function AdminTours() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);

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
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-title text-4xl font-bold">Gestione Tour</h1>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
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
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tours.map((tour) => (
                  <tr key={tour.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={tour.coverImage}
                          alt={tour.title}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <p className="font-medium">{tour.title}</p>
                          <p className="text-sm text-muted">{tour.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      €{tour.priceAdult} / €{tour.priceChild}
                    </td>
                    <td className="px-6 py-4">{tour.language}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingTour(tour)}
                          className="text-accent hover:text-accent/80"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tour.id)}
                          className="text-red-600 hover:text-red-800"
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

        <Modal
          isOpen={showCreateModal || editingTour !== null}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTour(null);
          }}
          title={editingTour ? 'Modifica Tour' : 'Crea Nuovo Tour'}
          size="xl"
        >
          <TourForm
            tour={editingTour}
            onSuccess={() => {
              setShowCreateModal(false);
              setEditingTour(null);
              fetchTours();
            }}
          />
        </Modal>
      </div>
    </div>
  );
}

function TourForm({ tour, onSuccess }: { tour: any; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    slug: tour?.slug || '',
    description: tour?.description || '',
    priceAdult: tour?.priceAdult || 0,
    priceChild: tour?.priceChild || 0,
    language: tour?.language || 'Italiano',
    itinerary: tour?.itinerary || '',
    durationValue: tour?.durationValue || 1,
    durationUnit: tour?.durationUnit || 'ore',
    coverImage: tour?.coverImage || '',
    images: tour?.images ? JSON.parse(tour.images) : [],
    includes: tour?.includes ? JSON.parse(tour.includes) : [],
    excludes: tour?.excludes ? JSON.parse(tour.excludes) : [],
    terms: tour?.terms || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (tour) {
        await api.put(`/api/tours/${tour.id}`, formData);
      } else {
        await api.post('/api/tours', formData);
      }
      onSuccess();
    } catch (error) {
      alert('Errore nel salvataggio');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Titolo *</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Slug *</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Descrizione *</label>
        <textarea
          className="w-full px-4 py-2 border border-muted rounded-lg"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Prezzo Adulto *</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.priceAdult}
            onChange={(e) =>
              setFormData({ ...formData, priceAdult: parseFloat(e.target.value) })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Prezzo Bambino *</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.priceChild}
            onChange={(e) =>
              setFormData({ ...formData, priceChild: parseFloat(e.target.value) })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Lingua *</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Immagine Copertina *</label>
        <input
          type="url"
          className="w-full px-4 py-2 border border-muted rounded-lg"
          value={formData.coverImage}
          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Itinerario *</label>
        <textarea
          className="w-full px-4 py-2 border border-muted rounded-lg"
          rows={4}
          value={formData.itinerary}
          onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Durata Valore *</label>
          <input
            type="number"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.durationValue}
            onChange={(e) =>
              setFormData({ ...formData, durationValue: parseInt(e.target.value) })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Durata Unità *</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.durationUnit}
            onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Termini e Condizioni</label>
        <textarea
          className="w-full px-4 py-2 border border-muted rounded-lg"
          rows={3}
          value={formData.terms}
          onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onSuccess} className="btn-outline">
          Annulla
        </button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Salvataggio...' : tour ? 'Aggiorna' : 'Crea'}
        </button>
      </div>
    </form>
  );
}

