import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, MapPin, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admins/dashboard/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminSidebar />
        <div className="ml-[300px] p-8 text-center">
          <p className="text-muted">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminSidebar />
      <div className="ml-[300px] p-8">
        <h1 className="font-title text-4xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Totale Tour</p>
                <p className="text-3xl font-bold">{stats?.totalTours || 0}</p>
              </div>
              <MapPin className="w-12 h-12 text-accent opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Prenotazioni Oggi</p>
                <p className="text-3xl font-bold">{stats?.todayBookings || 0}</p>
              </div>
              <Calendar className="w-12 h-12 text-accent opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Totale Prenotazioni</p>
                <p className="text-3xl font-bold">{stats?.totalBookings || 0}</p>
              </div>
              <Users className="w-12 h-12 text-accent opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Incassi Totali</p>
                <p className="text-3xl font-bold">
                  €{stats?.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-accent opacity-50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/tours"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="font-title text-2xl font-bold mb-2">Gestisci Tour</h2>
            <p className="text-muted mb-4">Crea e modifica le escursioni</p>
            <div className="flex items-center text-accent">
              Vai ai tour <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          <Link
            to="/admin/bookings"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="font-title text-2xl font-bold mb-2">Gestisci Prenotazioni</h2>
            <p className="text-muted mb-4">Visualizza e gestisci tutte le prenotazioni</p>
            <div className="flex items-center text-accent">
              Vai alle prenotazioni <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

