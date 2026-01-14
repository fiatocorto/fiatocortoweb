import { Link } from 'react-router-dom';
import { Calendar, Activity, ArrowRight, User, Droplet } from 'lucide-react';

interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  priceAdult: number;
  language: string;
  durationValue: number;
  durationUnit: string;
  difficulty?: string;
  dateStart?: string;
  dateEnd?: string;
  availableSeats?: number;
}

interface CardTourProps {
  tour: Tour;
  variant?: 'default' | 'compact';
  viewMode?: 'grid' | 'list';
}

// Helper function to format price
const formatPrice = (price: number | string | null | undefined): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (numPrice === 0 || numPrice === null || numPrice === undefined || isNaN(numPrice)) {
    return 'Free';
  }
  return `€${numPrice}`;
};

export default function CardTour({ tour, variant = 'default', viewMode = 'grid' }: CardTourProps) {
  const availableSeats = tour.availableSeats ?? 0;

  const getSeatsBadgeClass = () => {
    if (availableSeats === 0) return 'badge-danger';
    if (availableSeats <= 10) return 'badge-danger';
    return 'badge-accent';
  };

  const getDifficultyDrops = () => {
    switch (tour.difficulty) {
      case 'Facile':
        return 1;
      case 'Medio-Facile':
        return 2;
      case 'Intermedio':
        return 3;
      case 'Medio-Difficile':
        return 4;
      case 'Difficile':
        return 5;
      default:
        return 0;
    }
  };

  const isCompact = variant === 'compact';
  const isListView = viewMode === 'list';

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Data da definire';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const nextDate = tour.dateStart;

  // List view layout: foto quadrata a sinistra, dettagli a destra (per entrambi i variant)
  if (isListView) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-sm">
        <Link 
          to={`/tours/${tour.slug}`} 
          className="block"
        >
          <div className="flex items-stretch">
            {/* Foto a sinistra - riquadro quadrato che riempie l'altezza */}
            <div className="relative flex-shrink-0 w-48 sm:w-56 md:w-64" style={{ aspectRatio: '1 / 1', minHeight: '100%' }}>
              <img
                src={tour.coverImage}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`badge text-[10px] sm:text-xs ${getSeatsBadgeClass()}`}>
                  {availableSeats === 0
                    ? 'Esaurito'
                    : `${availableSeats} posti`}
                </span>
              </div>
            </div>
            
            {/* Dettagli a destra */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-title text-base sm:text-lg font-bold mb-2 line-clamp-1 text-primary">{tour.title}</h3>
                <p className="text-xs sm:text-sm text-muted mb-3 line-clamp-2">{tour.description}</p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    {formatDate(nextDate)}
                  </span>
                  <span className="flex items-center">
                    <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    {tour.difficulty || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <div>
                  <span className="text-lg sm:text-xl font-bold text-accent">
                    {formatPrice(tour.priceAdult)}
                  </span>
                  {tour.priceAdult !== 0 && tour.priceAdult !== null && tour.priceAdult !== undefined && (
                    <span className="text-xs sm:text-sm text-muted ml-1">a persona</span>
                  )}
                </div>
                <span className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
                  Dettagli →
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  if (isCompact) {
    
    // Grid view layout: image on top, content below
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1">
        <Link 
          to={`/tours/${tour.slug}`} 
          className="block"
        >
          <div className="relative overflow-hidden">
            <img
              src={tour.coverImage}
              alt={tour.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className={`badge ${getSeatsBadgeClass()}`}>
                {availableSeats === 0
                  ? 'Esaurito'
                  : `${availableSeats} posti`}
              </span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-title text-lg font-bold mb-2 line-clamp-1 text-primary">{tour.title}</h3>
            <p className="text-sm text-muted mb-4 line-clamp-2">{tour.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted mb-4">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {formatDate(nextDate)}
              </span>
              <span className="flex items-center">
                <Activity className="w-3.5 h-3.5 mr-1" />
                {tour.difficulty || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <span className="text-xl font-bold text-accent">
                  {formatPrice(tour.priceAdult)}
                </span>
                {tour.priceAdult !== 0 && tour.priceAdult !== null && tour.priceAdult !== undefined && (
                  <span className="text-xs text-muted ml-1">a persona</span>
                )}
              </div>
              <span className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
                Dettagli →
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className="card overflow-hidden border border-gray-200/50 transition-transform duration-300 hover:-translate-y-3" style={{ borderRadius: '2rem' }}>
        
        <Link 
          to={`/tours/${tour.slug}`} 
          className="block relative"
        >
          <img
            src={tour.coverImage}
            alt={tour.title}
            className="w-full h-full object-cover aspect-[4/5]"
          />
          {/* Difficoltà in alto a sinistra */}
          {tour.difficulty && (
            <div className="absolute top-3 sm:top-4 md:top-5 left-3 sm:left-4 md:left-5 z-10">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="bg-accent text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                  {tour.difficulty}
                </span>
                {/* Gocce difficoltà */}
                {getDifficultyDrops() > 0 && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: getDifficultyDrops() }).map((_, index) => (
                      <Droplet key={index} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="white" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Posti disponibili in alto a destra */}
          <div className="absolute top-3 sm:top-4 md:top-5 right-3 sm:right-4 md:right-5 z-10">
            <div className="flex items-center gap-2 sm:gap-2.5 drop-shadow-lg" style={{ filter: 'drop-shadow(0 1px 8px rgba(0, 0, 0, 0.9))' }}>
              <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              <span className="text-white text-sm sm:text-base md:text-lg font-semibold" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                {availableSeats === 0 ? 'Esaurito' : `${availableSeats} posti`}
              </span>
            </div>
          </div>
          {/* Overlay con titolo e freccia */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
            <div className="flex flex-col gap-2 sm:gap-3">
              {/* Data sopra il titolo */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <span className="text-white text-sm sm:text-base font-medium" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                  {formatDate(nextDate)}
                </span>
              </div>
              <div className="flex items-end justify-between gap-3 sm:gap-4">
                <h3 className="font-title text-lg sm:text-xl md:text-2xl font-bold text-white line-clamp-3 flex-1" style={{ fontFamily: 'Nohemi, sans-serif' }}>
                  {tour.title}
                </h3>
                <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent flex-shrink-0" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

