import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Search, X, Filter } from 'lucide-react';
import api from '../utils/api';
import TourGrid from '../components/TourGrid';
import Footer from '../components/Footer';

type SortOption = 'alphabetical' | 'temporal' | 'price-asc' | 'price-desc' | 'recommended';

export default function ToursPage() {
  const [searchParams] = useSearchParams();
  const [tours, setTours] = useState<any[]>([]);
  const [suggestedTours, setSuggestedTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    language: '',
    costType: '', // 'free' or 'paid'
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
    setError(null);
    setSuggestedTours([]);
    try {
      const params: any = {};
      if (filters.destination) params.destination = filters.destination;
      if (filters.language) params.language = filters.language;
      if (filters.costType) params.costType = filters.costType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.date) params.date = filters.date;

      // Check if we have active filters
      const hasActiveFilters = !!(filters.destination || filters.language || filters.costType || filters.minPrice || filters.maxPrice || filters.date || filters.difficulty);
      if (hasActiveFilters) {
        setHasSearched(true);
      }

      const response = await api.get('/api/tours', { params });
      console.log('Tours response:', response.data);
      // Se la risposta è valida, anche se vuota, non è un errore
      if (response.data && Array.isArray(response.data.tours)) {
        setTours(response.data.tours);
        
        // Se non ci sono risultati ma c'è una destinazione, cerca tour solo per nome
        if (response.data.tours.length === 0 && filters.destination) {
          const suggestedParams: any = {
            destination: filters.destination
          };
          try {
            const suggestedResponse = await api.get('/api/tours', { params: suggestedParams });
            if (suggestedResponse.data && Array.isArray(suggestedResponse.data.tours)) {
              setSuggestedTours(suggestedResponse.data.tours);
            }
          } catch (suggestedError) {
            console.error('Failed to fetch suggested tours:', suggestedError);
          }
        }
      } else {
        setTours([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch tours:', error);
      // Mostra errore solo se è un vero errore (non 200/201)
      if (error.response?.status && error.response.status >= 400) {
        setError(error.response?.data?.error || 'Errore nel caricamento dei tour');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        setError('Impossibile connettersi al server. Verifica che il backend sia in esecuzione.');
      } else {
        // Per altri errori, non mostrare messaggio di errore se la risposta è valida
        setError(null);
      }
      setTours([]);
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
      <div className="bg-white -mt-20">
      {/* Hero Section con Immagine */}
      <section className="relative h-[33vh] flex items-center justify-center text-white overflow-hidden">
        {/* Immagine Background */}
        <img
          src="/resources/28088.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        {/* Overlay verde scuro per leggibilità */}
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            backgroundImage: 'linear-gradient(rgb(0 0 0 / 50%), rgb(0 28 11 / 80%))'
          }} 
        />
        
        {/* Contenuto centrato */}
        <div className="relative z-20 text-center px-4 sm:px-6 md:px-8">
          <div className="flex justify-center items-center mb-4 sm:mb-5 md:mb-6">
            <img 
              src="/resources/Icona Gialla.png" 
              alt="" 
              className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
            />
          </div>
          <h1 className="text-[72px] font-medium mb-4 sm:mb-6 md:mb-8" style={{ fontFamily: 'Nohemi, sans-serif' }}>
            Scopri le nostre<br />escursioni
          </h1>
        </div>
      </section>
      
      <div className="w-full py-8 sm:py-12 md:py-16" style={{ backgroundColor: '#f5f3ec' }}>
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="relative inline-block">
            <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
            <h1 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
              Tutte le Escursioni
            </h1>
          </div>
          
          {/* Filtri a destra */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
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
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
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
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            {/* Cerca */}
            <div className="relative flex items-center">
              {searchExpanded ? (
                <div className="flex items-center border-b-2 border-gray-300 focus-within:border-accent transition-colors outline-none">
                  <input
                    type="text"
                    placeholder="Cerca escursione"
                    className="w-48 px-2 py-1.5 bg-transparent focus:outline-none focus:ring-0 border-0 text-sm transition-all duration-300"
                    value={filters.destination}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                    onBlur={() => {
                      if (!filters.destination) {
                        setSearchExpanded(false);
                      }
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = 'none';
                      e.target.style.boxShadow = 'none';
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchExpanded(false);
                      setFilters({ ...filters, destination: '' });
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="p-2 text-gray-600 hover:text-accent transition-colors"
                  aria-label="Cerca"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Icona Filtri */}
            <button
              onClick={() => setFiltersModalOpen(true)}
              className="p-2 text-gray-600 hover:text-accent transition-colors relative"
              aria-label="Filtri"
            >
              <Filter className="w-5 h-5" />
              {(filters.costType || filters.difficulty) && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
              )}
            </button>
            
            {/* Ordinamento */}
            <div className="flex items-center gap-2 flex-1 lg:flex-initial min-w-[120px] sm:min-w-[150px]">
              <label className="text-sm text-gray-600 whitespace-nowrap font-medium hidden sm:inline">
                Ordina per:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-white text-sm transition-colors cursor-pointer"
              >
                <option value="recommended">Consigliate</option>
                <option value="alphabetical">Ordine alfabetico</option>
                <option value="temporal">Ordine temporale</option>
                <option value="price-asc">Prezzo crescente</option>
                <option value="price-desc">Prezzo decrescente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Colonna escursioni */}
        <div className="w-full">
            {/* Conteggio */}
            <p className="text-sm sm:text-base text-muted font-medium mb-4 sm:mb-6">
              {filteredTours.length} escursioni trovate
            </p>

            {/* Tours */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted">Caricamento...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchTours}
                  className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Riprova
                </button>
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="py-12">
                {filters.destination && filters.date ? (
                  <>
                    <div className="text-center mb-8">
                      <p className="text-muted mb-4">
                        Non è stato trovato nessun tour che corrisponde ai criteri di ricerca. Prova a cambiare i criteri e cerca di nuovo.
                      </p>
                      <button
                        onClick={() => {
                          setFilters({
                            destination: '',
                            language: '',
                            costType: '',
                            minPrice: '',
                            maxPrice: '',
                            difficulty: '',
                            date: '',
                          });
                          setHasSearched(false);
                        }}
                        className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Rimuovi filtri
                      </button>
                    </div>
                    {suggestedTours.length > 0 && (
                      <div className="mt-12">
                        <h3 className="text-xl font-bold mb-6">Altrimenti, ti potrebbero interessare</h3>
                        <TourGrid tours={suggestedTours} viewMode={viewMode} variant="default" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-muted mb-4">
                      {(hasSearched || filters.destination || filters.language || filters.costType || filters.minPrice || filters.maxPrice || filters.date || filters.difficulty)
                        ? 'Nessuna escursione trovata con i filtri selezionati. Prova a modificare i criteri di ricerca.'
                        : 'Nessun tour disponibile al momento.'}
                    </p>
                    {(hasSearched || filters.destination || filters.language || filters.costType || filters.minPrice || filters.maxPrice || filters.date || filters.difficulty) && (
                      <button
                        onClick={() => {
                          setFilters({
                            destination: '',
                            language: '',
                            costType: '',
                            minPrice: '',
                            maxPrice: '',
                            difficulty: '',
                            date: '',
                          });
                          setHasSearched(false);
                        }}
                        className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Rimuovi filtri
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <TourGrid tours={filteredTours} viewMode={viewMode} variant="default" />
            )}
          </div>
        </div>
        </div>
      </div>
      
      {/* Modale Filtri */}
      {filtersModalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setFiltersModalOpen(false)}
          />
          {/* Modale */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
                  Filtri
                </h2>
                <button
                  onClick={() => setFiltersModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Chiudi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Contenuto */}
              <div className="space-y-6">
                {/* Costo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-white text-sm transition-colors cursor-pointer"
                    value={filters.costType}
                    onChange={(e) => {
                      const newCostType = e.target.value;
                      setFilters({ 
                        ...filters, 
                        costType: newCostType,
                        minPrice: '',
                        maxPrice: ''
                      });
                    }}
                  >
                    <option value="">Tutti i costi</option>
                    <option value="free">Gratuito</option>
                    <option value="paid">A pagamento</option>
                  </select>
                </div>
                
                {/* Difficoltà */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficoltà
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-white text-sm transition-colors cursor-pointer"
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  >
                    <option value="">Tutte le difficoltà</option>
                    <option value="Facile">Facile</option>
                    <option value="Medio-Facile">Medio-Facile</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Medio-Difficile">Medio-Difficile</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setFilters({
                      ...filters,
                      costType: '',
                      difficulty: '',
                    });
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFiltersModalOpen(false)}
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
                >
                  Applica
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      <Footer />
    </>
  );
}

