import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from '../../components/Modal';

export default function AdminTours() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
                      €{tour.priceAdult} / €{tour.priceChild}
                    </td>
                    <td className="px-6 py-4">{tour.language}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/tours/${tour.id}/edit`}
                          className="text-accent hover:text-accent/80"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
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
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
          }}
          title="Crea Nuovo Tour"
          size="xl"
        >
          <TourForm
            tour={null}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchTours();
            }}
          />
        </Modal>
      </div>
    </div>
  );
}

function TourForm({ tour, onSuccess }: { tour: any; onSuccess: () => void }) {
  // Helper to format date for input
  const formatDateForInput = (date: string | Date | null | undefined) => {
    if (!date) {
      // Default to tomorrow at 9:00 AM if no date provided
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow.toISOString().slice(0, 16);
    }
    const d = new Date(date);
    return d.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  // Helper to get default end date (start date + duration)
  const getDefaultEndDate = (startDate: string, durationValue: number, durationUnit: string) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    if (durationUnit === 'ore') {
      start.setHours(start.getHours() + durationValue);
    } else if (durationUnit === 'giorni') {
      start.setDate(start.getDate() + durationValue);
    }
    return start.toISOString().slice(0, 16);
  };

  const defaultStartDate = formatDateForInput(tour?.dateStart);
  const defaultEndDate = tour?.dateEnd 
    ? formatDateForInput(tour.dateEnd) 
    : getDefaultEndDate(defaultStartDate, tour?.durationValue || 1, tour?.durationUnit || 'ore');

  const [formData, setFormData] = useState({
    title: tour?.title || '',
    description: tour?.description || '',
    priceAdult: tour?.priceAdult || 0,
    priceChild: tour?.priceChild || 0,
    language: tour?.language || 'Italiano',
    itinerary: tour?.itinerary || '',
    durationValue: tour?.durationValue || 1,
    durationUnit: tour?.durationUnit || 'ore',
    coverImage: tour?.coverImage || '',
    images: tour?.images ? (typeof tour.images === 'string' ? JSON.parse(tour.images) : tour.images) : [],
    includes: tour?.includes ? (typeof tour.includes === 'string' ? JSON.parse(tour.includes) : tour.includes) : [],
    excludes: tour?.excludes ? (typeof tour.excludes === 'string' ? JSON.parse(tour.excludes) : tour.excludes) : [],
    terms: tour?.terms || '',
    maxSeats: tour?.maxSeats || 20,
    difficulty: tour?.difficulty || '',
    isMultiDay: tour?.isMultiDay || false,
    dateStart: defaultStartDate,
    dateEnd: defaultEndDate,
    gallery: tour?.gallery || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const addArrayItem = (field: 'images' | 'includes' | 'excludes', value: string = '') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], value],
    });
  };

  const updateArrayItem = (field: 'images' | 'includes' | 'excludes', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const removeArrayItem = (field: 'images' | 'includes' | 'excludes', index: number) => {
    const newArray = formData[field].filter((_: any, i: number) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

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
          <label className="block text-sm font-medium mb-2">Prezzo Bambino</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.priceChild}
            onChange={(e) =>
              setFormData({ ...formData, priceChild: parseFloat(e.target.value) || 0 })
            }
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
        <label className="block text-sm font-medium mb-2">Copertina</label>
        <input
          type="url"
          className="w-full px-4 py-2 border border-muted rounded-lg"
          value={formData.coverImage}
          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Itinerario</label>
        <textarea
          className="w-full px-4 py-2 border border-muted rounded-lg"
          rows={4}
          value={formData.itinerary}
          onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Data Inizio *</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.dateStart}
            onChange={(e) => setFormData({ ...formData, dateStart: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Data Fine *</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.dateEnd}
            onChange={(e) => setFormData({ ...formData, dateEnd: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Posti Massimi *</label>
          <input
            type="number"
            min="1"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.maxSeats}
            onChange={(e) => setFormData({ ...formData, maxSeats: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Difficoltà</label>
          <select
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          >
            <option value="">Seleziona difficoltà</option>
            <option value="Facile">Facile</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Difficile">Difficile</option>
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isMultiDay}
            onChange={(e) => setFormData({ ...formData, isMultiDay: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Tour Multi-Giorno</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Galleria Immagini (URL separati da virgola)</label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-muted rounded-lg"
          value={formData.gallery}
          onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
          placeholder="url1, url2, url3..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Immagini Aggiuntive</label>
        {formData.images.length === 0 ? (
          <button
            type="button"
            onClick={() => addArrayItem('images')}
            className="text-sm text-accent hover:text-accent/80 mb-2"
          >
            + Aggiungi immagine
          </button>
        ) : (
          <>
            {formData.images.map((image: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  className="flex-1 px-4 py-2 border border-muted rounded-lg"
                  value={image}
                  onChange={(e) => updateArrayItem('images', index, e.target.value)}
                  placeholder="URL immagine"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('images', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('images')}
              className="text-sm text-accent hover:text-accent/80"
            >
              + Aggiungi immagine
            </button>
          </>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Cosa Include</label>
        {formData.includes.length === 0 ? (
          <button
            type="button"
            onClick={() => addArrayItem('includes')}
            className="text-sm text-accent hover:text-accent/80 mb-2"
          >
            + Aggiungi elemento
          </button>
        ) : (
          <>
            {formData.includes.map((item: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-muted rounded-lg"
                  value={item}
                  onChange={(e) => updateArrayItem('includes', index, e.target.value)}
                  placeholder="Es: Guida esperta, Pranzo al sacco..."
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('includes', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('includes')}
              className="text-sm text-accent hover:text-accent/80"
            >
              + Aggiungi elemento
            </button>
          </>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Cosa Non Include</label>
        {formData.excludes.length === 0 ? (
          <button
            type="button"
            onClick={() => addArrayItem('excludes')}
            className="text-sm text-accent hover:text-accent/80 mb-2"
          >
            + Aggiungi elemento
          </button>
        ) : (
          <>
            {formData.excludes.map((item: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-muted rounded-lg"
                  value={item}
                  onChange={(e) => updateArrayItem('excludes', index, e.target.value)}
                  placeholder="Es: Bevande, Equipaggiamento personale..."
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('excludes', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('excludes')}
              className="text-sm text-accent hover:text-accent/80"
            >
              + Aggiungi elemento
            </button>
          </>
        )}
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

