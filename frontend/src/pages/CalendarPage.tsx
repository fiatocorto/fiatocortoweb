import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import api from '../utils/api';
import Modal from '../components/Modal';
import Footer from '../components/Footer';

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
    <>
      <div className="bg-white -mt-20">
      {/* Hero Section con Immagine */}
      <section className="relative h-[33vh] flex items-center justify-center text-white overflow-hidden">
        {/* Immagine Background */}
        <img
          src="/resources/cammarata.jpg"
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
            Calendario escursioni
          </h1>
        </div>
      </section>
      
      <div className="w-full py-8 sm:py-12 md:py-16" style={{ backgroundColor: '#f5f3ec' }}>
        <div className="w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative inline-block mb-8 sm:mb-10 md:mb-12">
          <div className="absolute w-3/4 h-4 sm:h-6 md:h-8 top-4 sm:top-6 md:top-8 left-0" style={{ backgroundColor: '#fee6c3' }}></div>
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold relative" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
            Le nostre attività
          </h2>
        </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="font-title text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>
            {format(currentDate, 'MMMM yyyy', { locale: it })}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={prevMonth} 
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-accent hover:bg-accent/10 text-gray-600 hover:text-accent transition-colors flex items-center justify-center"
            >
              ←
            </button>
            <button 
              onClick={nextMonth} 
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-accent hover:bg-accent/10 text-gray-600 hover:text-accent transition-colors flex items-center justify-center"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map((day) => (
            <div key={day} className="text-center font-bold text-gray-600 py-2 sm:py-3 text-sm sm:text-base" style={{ fontFamily: 'Nohemi, sans-serif' }}>
              {day}
            </div>
          ))}

          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 sm:h-28 md:h-32" />
          ))}

          {days.map((day) => {
            const tours = getToursForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`h-24 sm:h-28 md:h-32 border-2 rounded-2xl p-2 sm:p-3 text-left transition-all duration-200 ${
                  !isCurrentMonth ? 'text-gray-400 border-gray-200' : ''
                } ${
                  isToday 
                    ? 'border-accent bg-accent/10 shadow-md scale-105' 
                    : 'border-gray-200 hover:border-accent hover:bg-accent/5 hover:shadow-sm'
                } ${
                  tours.length > 0 && isCurrentMonth ? 'bg-accent/10 border-accent/50' : ''
                }`}
              >
                <div className={`font-medium text-sm sm:text-base ${isToday ? 'text-accent font-bold' : 'text-gray-700'}`} style={{ fontFamily: 'Nohemi, sans-serif' }}>
                  {format(day, 'd')}
                </div>
                {tours.length > 0 && isCurrentMonth && (
                  <div className="mt-1 sm:mt-2">
                    <span className="inline-block bg-accent text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                      {tours.length} {tours.length === 1 ? 'tour' : 'tour'}
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
        <div className="space-y-3">
          {dayTours.map((tour) => (
            <Link
              key={tour.id}
              to={`/tours/${tour.slug}`}
              onClick={() => setSelectedDay(null)}
              className="block border-2 border-gray-200 rounded-2xl p-4 sm:p-5 hover:border-accent hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
            >
              <h3 className="font-bold text-lg sm:text-xl mb-2 hover:text-accent transition-colors" style={{ fontFamily: 'Nohemi, sans-serif', color: '#1c1a18' }}>{tour.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3">
                {format(new Date(tour.dateStart), 'HH:mm', { locale: it })} -{' '}
                {tour.dateEnd
                  ? format(new Date(tour.dateEnd), 'HH:mm', { locale: it })
                  : 'Fine'}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-accent font-bold text-lg sm:text-xl">
                  {tour.priceAdult === 0 ? 'Gratis' : `€${tour.priceAdult}`}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    tour.availableSeats === 0
                      ? 'bg-red-100 text-red-700'
                      : tour.availableSeats <= 10
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
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
      </div>
      <Footer />
    </>
  );
}

