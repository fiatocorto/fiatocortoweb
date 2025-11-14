import AdminSidebar from '../../components/admin/AdminSidebar';
import CalendarPage from '../CalendarPage';

export default function AdminCalendar() {
  return (
    <div>
      <AdminSidebar />
      <div className="ml-[300px]">
        <CalendarPage />
      </div>
    </div>
  );
}

