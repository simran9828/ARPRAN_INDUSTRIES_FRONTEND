import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import WhatsAppButton from './components/WhatsAppButton';
import ProductModal from './components/ProductModal';
import BlogModal from './components/BlogModal';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CMSProvider, useCMS } from './context/CMSContext';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import ServiceDetailPage from './pages/ServiceDetailPage';

// Admin CMS Pages & Route Guard
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Client Auth & Dashboard Pages
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import UserProtectedRoute from './components/UserProtectedRoute';
import NotFoundPage from './components/NotFoundPage';
import { getRouteRobotsDirective, resolveUnmatchedRoute } from './utils/seoRouting';

/**
 * DynamicRedirectOrHome helper component
 * Matches incoming paths against active CMS redirect rules before showing a not-found page.
 */
function DynamicRedirectOrHome() {
  const location = useLocation();
  const cms = useCMS();
  const redirects = cms?.redirects || [];

  const route = resolveUnmatchedRoute(location.pathname, redirects);

  if (route.type === 'cms-redirect') {
    if (route.external) {
      window.location.href = route.targetUrl;
      return null;
    }
    return <Navigate to={route.targetUrl} replace />;
  }

  if (route.type === 'legacy-service') {
    return <ServiceDetailPage serviceSlugOverride={route.serviceSlug} />;
  }

  return <NotFoundPage />;
}

/**
 * ServiceSlugRedirect helper component
 * Redirects any legacy /services/:slug route directly to /products/:slug
 */
function ServiceSlugRedirect() {
  const { serviceSlug } = useParams();
  return <Navigate to={`/products/${serviceSlug || ''}`} replace />;
}

/**
 * ScrollToTop helper component
 * Automatically scrolls window to top upon route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * AppContent Wrapper
 * Renders public header/footer only when outside of /admin routes
 */
function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const location = useLocation();
  const { services: cmsServices } = useCMS();

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', getRouteRobotsDirective(location.pathname, cmsServices));
  }, [location.pathname, cmsServices]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased font-sans selection:bg-[#0A4E9B] selection:text-white">

      {/* Universal Top Bar & Luxury Navbar (Only for public website) */}
      {!isAdminRoute && <Navbar />}

      {/* Routes */}
      <main className="flex-1">
        <Routes>
          {/* Public Website Routes */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenProduct={(prod) => setSelectedProduct(prod)}
                onOpenBlog={(blog) => setSelectedBlog(blog)}
              />
            }
          />
          <Route
            path="/about"
            element={<AboutPage />}
          />
          <Route
            path="/products"
            element={
              <ProductsPage
                onOpenProduct={(prod) => setSelectedProduct(prod)}
              />
            }
          />
          <Route
            path="/finishes"
            element={<Navigate to="/products" replace />}
          />
          <Route
            path="/blog"
            element={
              <BlogPage
                onOpenBlog={(blog) => setSelectedBlog(blog)}
              />
            }
          />
          <Route
            path="/contact"
            element={<ContactPage />}
          />
          <Route
            path="/products/:categorySlug"
            element={
              <ServiceDetailPage
                onOpenProduct={(prod) => setSelectedProduct(prod)}
              />
            }
          />
          {/* Auto-redirect legacy /services paths to unified /products */}
          <Route
            path="/services"
            element={<Navigate to="/products" replace />}
          />
          <Route
            path="/services/:serviceSlug"
            element={<ServiceSlugRedirect />}
          />
          {/* Client Authentication & Protected Portal Routes */}
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/signup"
            element={<SignupPage />}
          />
          <Route
            path="/dashboard"
            element={
              <UserProtectedRoute>
                <UserDashboardPage />
              </UserProtectedRoute>
            }
          />

          {/* Secure Admin Portal Routes */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          {/* Dynamic Redirects & Fallback Route */}
          <Route
            path="*"
            element={
              <DynamicRedirectOrHome />
            }
          />
        </Routes>
      </main>

      {/* Universal Footer & Floating AI Concierge / WhatsApp (Public only) */}
      {!isAdminRoute && (
        <>
          <Footer />
          <ChatBot />
          <WhatsAppButton />
        </>
      )}

      {/* Global Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {selectedBlog && (
        <BlogModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CMSProvider>
          <ScrollToTop />
          <AppContent />
        </CMSProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
