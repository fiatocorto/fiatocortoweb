import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List } from 'lucide-react';
import api from '../utils/api';
import TourGrid from '../components/TourGrid';

export default function ToursPage() {
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    language: '',
    minPrice: '',
    maxPrice: '',
    date: searchParams.get('date') || '',
  });

  useEffect(() => {
    fetchTours();
  }, [filters]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.destination) params.destination = filters.destination;
      if (filters.language) params.language = filters.language;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.date) params.date = filters.date;

      const response = await api.get('/api/tours', { params });
      setTours(response.data.tours);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-title text-4xl font-bold mb-8">Tutte le Escursioni</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Cerca destinazione..."
            className="px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            value={filters.destination}
            onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
          />
          <select
            className="px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            value={filters.language}
            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          >
            <option value="">Tutte le lingue</option>
            <option value="Italiano">Italiano</option>
            <option value="English">English</option>
          </select>
          <input
            type="number"
            placeholder="Prezzo min"
            className="px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Prezzo max"
            className="px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      {/* View mode toggle */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted">{tours.length} escursioni trovate</p>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-accent text-primary' : 'bg-white text-muted'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-accent text-primary' : 'bg-white text-muted'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tours */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted">Caricamento...</p>
        </div>
      ) : tours.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted">Nessuna escursione trovata</p>
        </div>
      ) : (
        <TourGrid tours={tours} viewMode={viewMode} />
      )}
    </div>
  );
}

