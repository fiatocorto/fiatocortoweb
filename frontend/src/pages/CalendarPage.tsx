import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../utils/api';
import Modal from '../components/Modal';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tours, setTours] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [dayTours, setDayTours] = useState<any[]>([]);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await api.get('/api/tours');
      setTours(response.data.tours);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getToursForDay = (day: Date) => {
    return tours.filter((tour) => {
      const tourDate = new Date(tour.dateStart);
      return isSameDay(tourDate, day);
    });
  };

  const handleDayClick = (day: Date) => {
    const tours = getToursForDay(day);
    if (tours.length > 0) {
      setSelectedDay(day);
      setDayTours(tours);
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[25vh] sm:h-[27vh] md:h-[30vh] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/resources/IMG_5093.JPEG)',
            backgroundPosition: 'center center',
          }}
        >
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: 'linear-gradient(rgb(15 23 42 / 0%), rgb(0 21 67 / 65%))'
            }} 
          />
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold mb-3 sm:mb-4 px-4">
            Calendario escursioni
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto px-4">
            Scopri tutte le escursioni disponibili e prenota la tua prossima avventura
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
          <div className="absolute bg-yellow-100 w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0"></div>
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative">
            Le nostre attività
          </h2>
        </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-title text-2xl font-bold">
            {format(currentDate, 'MMMM yyyy', { locale: it })}
          </h2>
          <div className="flex space-x-2">
            <button onClick={prevMonth} className="btn-outline">
              ←
            </button>
            <button onClick={nextMonth} className="btn-outline">
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map((day) => (
            <div key={day} className="text-center font-bold text-muted py-2">
              {day}
            </div>
          ))}

          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24" />
          ))}

          {days.map((day) => {
            const tours = getToursForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`h-24 border rounded-lg p-2 text-left transition-colors ${
                  !isCurrentMonth ? 'text-muted/50' : ''
                } ${isToday ? 'border-accent bg-accent/10' : 'border-muted hover:border-accent'} ${
                  tours.length > 0 ? 'bg-accent/5' : ''
                }`}
              >
                <div className="font-medium">{format(day, 'd')}</div>
                {tours.length > 0 && (
                  <div className="mt-1">
                    <span className="badge badge-accent text-xs">
                      {tours.length} tour
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        title={selectedDay ? format(selectedDay, 'dd MMMM yyyy', { locale: it }) : ''}
      >
        <div className="space-y-4">
          {dayTours.map((tour) => (
            <Link
              key={tour.id}
              to={`/tours/${tour.slug}`}
              onClick={() => setSelectedDay(null)}
              className="block border rounded-lg p-4 hover:border-accent transition-all cursor-pointer"
            >
              <h3 className="font-bold text-lg mb-2 hover:text-accent transition-colors">{tour.title}</h3>
              <p className="text-sm text-muted mb-2">
                {format(new Date(tour.dateStart), 'HH:mm', { locale: it })} -{' '}
                {tour.dateEnd
                  ? format(new Date(tour.dateEnd), 'HH:mm', { locale: it })
                  : 'Fine'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-accent font-bold">
                  {tour.priceAdult === 0 ? 'Free' : `€${tour.priceAdult}`}
                </span>
                <span
                  className={`badge ${
                    tour.availableSeats === 0
                      ? 'badge-danger'
                      : tour.availableSeats <= 10
                      ? 'badge-danger'
                      : 'badge-success'
                  }`}
                >
                  {tour.availableSeats === 0
                    ? 'Esaurito'
                    : `${tour.availableSeats} posti`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Modal>
      </div>
    </div>
  );
}

