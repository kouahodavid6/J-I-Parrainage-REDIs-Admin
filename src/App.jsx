import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import AppToaster from "./components/AppToaster";
import AuthInitializer from "./components/AuthInitializer";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";

import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import SousAdmins from "./pages/SousAdmins/SousAdmins";
import L1GI from './pages/L1GI/L1GI';
import L2GI from './pages/L2GI/L2GI';
import L1MIAGE from './pages/L1MIAGE/L1MIAGE';
import L2MIAGE from './pages/L2MIAGE/L2MIAGE';
import MatchEtudiants from './pages/MatchEtudiants/MatchEtudiants';
import Parametres from "./pages/Parametres/Parametres";

import { useAuth } from "./hooks/useAdmin";

// Configuration de TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// 🔒 Route protégée
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-[#ff7a00] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// 🔓 Route publique
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-[#ff7a00] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Layout wrapper pour les pages protégées
const LayoutWrapper = ({ children }) => (
  <Layout>{children}</Layout>
);

// Configuration des routes protégées
const protectedRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/sousadmins", element: <SousAdmins /> },
  { path: "/l1gi", element: <L1GI /> },
  { path: "/l2gi", element: <L2GI /> },
  { path: "/l1miage", element: <L1MIAGE /> },
  { path: "/l2miage", element: <L2MIAGE /> },
  { path: "/matching", element: <MatchEtudiants /> },
  { path: "/parametres", element: <Parametres /> }
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Toaster principal */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#ff7a00',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Router>
        <div className="min-h-screen bg-gray-900">
          <AppToaster />
          
          <AuthInitializer>
            <Routes>
              {/* Route publique */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Redirection racine */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Routes protégées avec Layout */}
              {protectedRoutes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute>
                      <LayoutWrapper>
                        {element}
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
              ))}

              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthInitializer>
        </div>
      </Router>
      
      {/* Devtools pour TanStack Query (seulement en développement) */}
      {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}

export default App;