import { Link } from 'react-router-dom';
import { Calendar, Activity } from 'lucide-react';

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
  tourDates?: Array<{
    availableSeats?: number;
    capacityMax: number;
    dateStart?: string;
  }>;
}

interface CardTourProps {
  tour: Tour;
  variant?: 'default' | 'compact';
}

export default function CardTour({ tour, variant = 'default' }: CardTourProps) {
  const minAvailableSeats = tour.tourDates
    ? Math.min(...tour.tourDates.map((d) => d.availableSeats ?? d.capacityMax))
    : 0;

  const getSeatsBadgeClass = () => {
    if (minAvailableSeats === 0) return 'badge-danger';
    if (minAvailableSeats <= 10) return 'badge-danger';
    return 'badge-accent';
  };

  const isCompact = variant === 'compact';

  // Get the next available date
  const getNextDate = () => {
    if (!tour.tourDates || tour.tourDates.length === 0) return null;
    
    const now = new Date();
    const futureDates = tour.tourDates
      .filter(d => d.dateStart && new Date(d.dateStart) >= now)
      .sort((a, b) => {
        const dateA = a.dateStart ? new Date(a.dateStart) : new Date(0);
        const dateB = b.dateStart ? new Date(b.dateStart) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });
    
    return futureDates.length > 0 ? futureDates[0].dateStart : null;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data da definire';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const nextDate = getNextDate();

  if (isCompact) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
                {minAvailableSeats === 0
                  ? 'Esaurito'
                  : `${minAvailableSeats} posti`}
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
                  €{tour.priceAdult}
                </span>
                <span className="text-xs text-muted ml-1">a persona</span>
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
    <div 
      className="rounded-2xl transition-transform duration-300 hover:-translate-y-2"
    >
      <div className="card rounded-2xl overflow-hidden">
        <Link 
          to={`/tours/${tour.slug}`} 
          className="block"
        >
          <div className="relative overflow-hidden rounded-t-2xl">
            <img
              src={tour.coverImage}
              alt={tour.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className={`badge ${getSeatsBadgeClass()}`}>
                {minAvailableSeats === 0
                  ? 'Esaurito'
                  : `${minAvailableSeats} posti`}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-title text-xl font-bold mb-2 line-clamp-1">{tour.title}</h3>
            <p className="text-sm text-muted mb-3 line-clamp-2">{tour.description}</p>
            <div className="flex items-center justify-between text-sm text-muted mb-3">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(nextDate)}
                </span>
                <span className="flex items-center">
                  <Activity className="w-4 h-4 mr-1" />
                  {tour.difficulty || 'N/A'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-accent">
                €{tour.priceAdult}
              </span>
              <span className="text-sm text-muted">a persona</span>
            </div>
          </div>
        </Link>
        <Link 
          to={`/tours/${tour.slug}`}
          className="block bg-accent text-white text-center py-3 px-4 rounded-full hover:bg-accent/90 transition-colors font-semibold mx-4 mb-4"
        >
          Esplora
        </Link>
      </div>
    </div>
  );
}

