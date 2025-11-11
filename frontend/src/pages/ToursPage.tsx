import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List } from 'lucide-react';
import api from '../utils/api';
import TourGrid from '../components/TourGrid';
import Footer from '../components/Footer';

type SortOption = 'alphabetical' | 'temporal' | 'price-asc' | 'price-desc' | 'recommended';

export default function ToursPage() {
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    language: '',
    minPrice: '',
    maxPrice: '',
    difficulty: '',
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

  const sortedTours = useMemo(() => {
    const toursCopy = [...tours];
    
    switch (sortBy) {
      case 'alphabetical':
        return toursCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'temporal':
        return toursCopy.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // Più recenti prima
        });
      case 'price-asc':
        return toursCopy.sort((a, b) => a.priceAdult - b.priceAdult);
      case 'price-desc':
        return toursCopy.sort((a, b) => b.priceAdult - a.priceAdult);
      case 'recommended':
      default:
        // Per ora manteniamo l'ordine originale, ma potremmo implementare una logica più complessa
        return toursCopy;
    }
  }, [tours, sortBy]);

  const filteredTours = useMemo(() => {
    return sortedTours.filter(tour => {
      // Filtro difficoltà (placeholder per quando verrà aggiunto al database)
      if (filters.difficulty && tour.difficulty && tour.difficulty !== filters.difficulty) {
        return false;
      }
      
      // Filtro prezzo minimo
      if (filters.minPrice && tour.priceAdult < parseFloat(filters.minPrice)) {
        return false;
      }
      
      // Filtro prezzo massimo
      if (filters.maxPrice && tour.priceAdult > parseFloat(filters.maxPrice)) {
        return false;
      }
      
      return true;
    });
  }, [sortedTours, filters.difficulty, filters.minPrice, filters.maxPrice]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="font-title text-4xl font-bold mb-8">Tutte le Escursioni</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Colonna sinistra - Filtri */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-title text-xl font-bold">Filtri</h2>
                <button
                  onClick={() => setFilters({
                    destination: '',
                    language: '',
                    minPrice: '',
                    maxPrice: '',
                    difficulty: '',
                    date: '',
                  })}
                  className="text-xs text-muted hover:text-accent transition-colors "
                >
                  Reimposta
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Cerca
                  </label>
                  <input
                    type="text"
                    placeholder="Cerca destinazione..."
                    className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    value={filters.destination}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Prezzo minimo
                  </label>
                  <input
                    type="number"
                    placeholder="€"
                    className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Prezzo massimo
                  </label>
                  <input
                    type="number"
                    placeholder="€"
                    className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Difficoltà
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  >
                    <option value="">Tutte</option>
                    <option value="Facile">Facile</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Colonna destra - Escursioni */}
          <div className="lg:col-span-3">
            {/* Controlli: conteggio, visualizzazione e ordinamento */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Pulsanti visualizzazione */}
                <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-accent text-primary' 
                        : 'bg-transparent text-muted hover:bg-gray-100'
                    }`}
                    aria-label="Vista griglia"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-accent text-primary' 
                        : 'bg-transparent text-muted hover:bg-gray-100'
                    }`}
                    aria-label="Vista lista"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Ordinamento */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted whitespace-nowrap">
                    Ordina per:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white text-sm"
                  >
                    <option value="recommended">Consigliate</option>
                    <option value="alphabetical">Ordine alfabetico</option>
                    <option value="temporal">Ordine temporale</option>
                    <option value="price-asc">Prezzo crescente</option>
                    <option value="price-desc">Prezzo decrescente</option>
                  </select>
                </div>
              </div>
              
              <p className="text-muted font-medium">
                {filteredTours.length} escursioni trovate
              </p>
            </div>

            {/* Tours */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted">Caricamento...</p>
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted">Nessuna escursione trovata</p>
              </div>
            ) : (
              <TourGrid tours={filteredTours} viewMode={viewMode} variant="compact" />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

