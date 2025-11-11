import CardTour from './CardTour';

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

interface TourGridProps {
  tours: Tour[];
  viewMode?: 'grid' | 'list';
  variant?: 'default' | 'compact';
}

export default function TourGrid({ tours, viewMode = 'grid', variant = 'default' }: TourGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {tours.map((tour) => (
          <CardTour key={tour.id} tour={tour} variant={variant} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <CardTour key={tour.id} tour={tour} variant={variant} />
      ))}
    </div>
  );
}

