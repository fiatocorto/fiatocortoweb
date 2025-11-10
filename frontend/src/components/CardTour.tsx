import { Link } from 'react-router-dom';
import { Clock, MapPin, Users } from 'lucide-react';

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
  tourDates?: Array<{
    availableSeats?: number;
    capacityMax: number;
  }>;
}

interface CardTourProps {
  tour: Tour;
}

export default function CardTour({ tour }: CardTourProps) {
  const minAvailableSeats = tour.tourDates
    ? Math.min(...tour.tourDates.map((d) => d.availableSeats ?? d.capacityMax))
    : 0;

  const getSeatsBadgeClass = () => {
    if (minAvailableSeats === 0) return 'badge-danger';
    if (minAvailableSeats <= 10) return 'badge-danger';
    return 'badge-accent';
  };

  return (
    <div 
      className="rounded-2xl transition-transform duration-300 hover:-translate-y-2"
    >
    <Link 
      to={`/tours/${tour.slug}`} 
      className="card rounded-2xl block"
    >
      <div className="relative overflow-hidden rounded-t-2xl">
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
      <div className="p-4">
        <h3 className="font-title text-xl font-bold mb-2 line-clamp-1">{tour.title}</h3>
        <p className="text-sm text-muted mb-3 line-clamp-2">{tour.description}</p>
        <div className="flex items-center justify-between text-sm text-muted mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {tour.durationValue} {tour.durationUnit}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {tour.language}
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
    </div>
  );
}

