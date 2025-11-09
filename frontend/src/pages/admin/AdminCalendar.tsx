import AdminSidebar from '../../components/admin/AdminSidebar';
import CalendarPage from '../CalendarPage';

export default function AdminCalendar() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <CalendarPage />
      </div>
    </div>
  );
}

