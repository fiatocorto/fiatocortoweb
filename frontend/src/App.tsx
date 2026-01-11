import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import AppLoader from './components/AppLoader';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import CalendarPage from './pages/CalendarPage';
import BookingPage from './pages/BookingPage';
import BookingDetailPage from './pages/BookingDetailPage';
import AccountPage from './pages/AccountPage';
import { Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactsPage from './pages/ContactsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTours from './pages/admin/AdminTours';
import AdminEditTour from './pages/admin/AdminEditTour';
import AdminCreateTour from './pages/admin/AdminCreateTour';
import AdminBookings from './pages/admin/AdminBookings';
import AdminBookingDetail from './pages/admin/AdminBookingDetail';
import AdminCalendar from './pages/admin/AdminCalendar';
import AdminQRScanner from './pages/admin/AdminQRScanner';
import AdminUsers from './pages/admin/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <NavBar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tours/:slug" element={<TourDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie" element={<CookiePolicyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route
            path="/booking/:tourId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/:section"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Navigate to="/account/bookings" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tours"
            element={
              <ProtectedRoute requireAdmin>
                <AdminTours />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tours/new"
            element={
              <ProtectedRoute requireAdmin>
                <AdminCreateTour />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tours/:id/edit"
            element={
              <ProtectedRoute requireAdmin>
                <AdminEditTour />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requireAdmin>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings/:id"
            element={
              <ProtectedRoute requireAdmin>
                <AdminBookingDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/calendar"
            element={
              <ProtectedRoute requireAdmin>
                <AdminCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/qr-scanner"
            element={
              <ProtectedRoute requireAdmin>
                <AdminQRScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

