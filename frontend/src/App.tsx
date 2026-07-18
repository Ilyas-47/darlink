import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/shared/PageTransition';
import Navbar from './components/shared/Navbar';
import Home from './pages/shared/Home';
import AuthPage from './pages/shared/AuthPage';
import PropertyDetailPage from './pages/shared/PropertyDetailPage';
import RegionDetailPage from './pages/shared/RegionDetailPage';
import DestinationsPage from './pages/shared/DestinationsPage';
import CommunityPage from './pages/shared/CommunityPage';
import HostPage from './pages/host/HostPage';
import UserProfilePage from './pages/shared/UserProfilePage';
import HostRegistrationPage from './pages/host/HostRegistrationPage';
import AdminPage from './pages/admin/AdminPage';
import BookingPage from './pages/shared/BookingPage';
import AboutPage from './pages/shared/AboutPage';
import LegalPage from './pages/shared/LegalPage';
import Footer from './components/shared/Footer';
import { useEffect } from 'react';

function App() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin') || location.pathname.startsWith('/host');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="app-layout">
      {!hideLayout && <Navbar />}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
            <Route path="/property/:id" element={<PageTransition><PropertyDetailPage /></PageTransition>} />
            <Route path="/property" element={<Navigate to="/destinations" replace />} />
            <Route path="/booking/:id" element={<PageTransition><BookingPage /></PageTransition>} />
            <Route path="/region/:name" element={<PageTransition><RegionDetailPage /></PageTransition>} />
            <Route path="/destinations" element={<PageTransition><DestinationsPage /></PageTransition>} />
            <Route path="/community" element={<PageTransition><CommunityPage /></PageTransition>} />
            <Route path="/host" element={<PageTransition><HostPage /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><UserProfilePage /></PageTransition>} />
            <Route path="/host-register" element={<PageTransition><HostRegistrationPage /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/legal" element={<PageTransition><LegalPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!hideLayout && <Footer />}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
