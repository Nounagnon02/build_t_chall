import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageTransition from './components/common/PageTransition';
import LoadingScreen from './components/common/LoadingScreen';
import Chatbot from './components/chatbot/Chatbot';
import CursorGlow from './components/common/CursorGlow';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Configurateur = lazy(() => import('./pages/Configurateur'));
const Budget = lazy(() => import('./pages/Budget'));
const Moodboard = lazy(() => import('./pages/Moodboard'));
const BookingFlow = lazy(() => import('./pages/BookingFlow'));
const Appointment = lazy(() => import('./pages/Appointment'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PalettePreview = lazy(() => import('./pages/PalettePreview'));
const Contact = lazy(() => import('./pages/Contact'));
const Legal = lazy(() => import('./pages/Legal'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const InvitationDemo = lazy(() => import('./pages/InvitationDemo'));

// Client pages
const ClientDashboard = lazy(() => import('./pages/client/Dashboard'));
const ClientChecklist = lazy(() => import('./pages/client/Checklist'));
const ClientBudget = lazy(() => import('./pages/client/Budget'));
const ClientGuests = lazy(() => import('./pages/client/Guests'));
const ClientDocuments = lazy(() => import('./pages/client/Documents'));
const ClientMessages = lazy(() => import('./pages/client/Messages'));
const ClientAlbum = lazy(() => import('./pages/client/Album'));
const ClientSettings = lazy(() => import('./pages/client/Settings'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminClients = lazy(() => import('./pages/admin/Clients'));
const AdminContent = lazy(() => import('./pages/admin/Content'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));
const AdminLeads = lazy(() => import('./pages/admin/Leads'));

// Protected route
import ProtectedRoute from './router/ProtectedRoute';
import AdminRoute from './router/AdminRoute';

function AppContent() {
  const location = useLocation();
  const isInvitationDemo = location.pathname === '/invitation-demo';

  return (
    <div className="flex flex-col min-h-screen">
      {!isInvitationDemo && <Header />}
      <main id="main-content" className="flex-grow">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingScreen />}>
            <Routes location={location} key={location.pathname}>
              {/* Public pages */}
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
              <Route path="/services/:slug" element={<PageTransition><Services /></PageTransition>} />
              <Route path="/galerie" element={<PageTransition><Gallery /></PageTransition>} />
              <Route path="/galerie/:style" element={<PageTransition><Gallery /></PageTransition>} />
              <Route path="/quiz-style" element={<PageTransition><Quiz /></PageTransition>} />
              <Route path="/configurateur" element={<PageTransition><Configurateur /></PageTransition>} />
              <Route path="/simulateur-budget" element={<PageTransition><Budget /></PageTransition>} />
              <Route path="/moodboard" element={<PageTransition><Moodboard /></PageTransition>} />
              <Route path="/mon-projet" element={<PageTransition><BookingFlow /></PageTransition>} />
              <Route path="/rendez-vous" element={<PageTransition><Appointment /></PageTransition>} />
              <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
              <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
              <Route path="/temoignages" element={<PageTransition><Testimonials /></PageTransition>} />
              <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
              <Route path="/palettes" element={<PageTransition><PalettePreview /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/mentions-legales" element={<PageTransition><Legal /></PageTransition>} />
              <Route path="/a-propos" element={<PageTransition><About /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/inscription" element={<PageTransition><Register /></PageTransition>} />
              <Route path="/invitation-demo" element={<InvitationDemo />} />

              {/* Client routes */}
              <Route path="/client" element={<ProtectedRoute><PageTransition><ClientDashboard /></PageTransition></ProtectedRoute>} />
              <Route path="/client/checklist" element={<ProtectedRoute><PageTransition><ClientChecklist /></PageTransition></ProtectedRoute>} />
              <Route path="/client/budget" element={<ProtectedRoute><PageTransition><ClientBudget /></PageTransition></ProtectedRoute>} />
              <Route path="/client/invites" element={<ProtectedRoute><PageTransition><ClientGuests /></PageTransition></ProtectedRoute>} />
              <Route path="/client/documents" element={<ProtectedRoute><PageTransition><ClientDocuments /></PageTransition></ProtectedRoute>} />
              <Route path="/client/messagerie" element={<ProtectedRoute><PageTransition><ClientMessages /></PageTransition></ProtectedRoute>} />
              <Route path="/client/album" element={<ProtectedRoute><PageTransition><ClientAlbum /></PageTransition></ProtectedRoute>} />
              <Route path="/client/parametres" element={<ProtectedRoute><PageTransition><ClientSettings /></PageTransition></ProtectedRoute>} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
              <Route path="/admin/clients" element={<AdminRoute><PageTransition><AdminClients /></PageTransition></AdminRoute>} />
              <Route path="/admin/contenu" element={<AdminRoute><PageTransition><AdminContent /></PageTransition></AdminRoute>} />
              <Route path="/admin/statistiques" element={<AdminRoute><PageTransition><AdminAnalytics /></PageTransition></AdminRoute>} />
              <Route path="/admin/leads" element={<AdminRoute><PageTransition><AdminLeads /></PageTransition></AdminRoute>} />

              {/* 404 */}
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      {!isInvitationDemo && <Footer />}
      {!isInvitationDemo && <Chatbot />}
      {!isInvitationDemo && <CursorGlow />}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
