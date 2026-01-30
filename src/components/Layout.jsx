import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../pages/components/Sidebar';
import Navbar from '../pages/components/Navbar'

// Mapping des routes
const routeMap = {
  dashboard: '/dashboard',
  sousadmins: '/sousadmins',
  l1gi: '/l1gi',
  l2gi: '/l2gi',
  l1miage: '/l1miage',
  l2miage: '/l2miage',
  matching: '/matching',
  parametres: '/parametres',
};

// Fonction pour déterminer l'item actif
const getActiveItemFromPath = (pathname) => {
  const path = pathname.split('/')[1];
  return Object.keys(routeMap).find(key => routeMap[key] === `/${path}`) || 'dashboard';
};

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem = getActiveItemFromPath(location.pathname);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleItemClick = (itemId) => {
    const route = routeMap[itemId] || '/dashboard';
    navigate(route);

    // Fermer la sidebar sur mobile après un clic
    if (window.innerWidth < 1024) {
      closeMobileSidebar();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar fixe */}
      <Navbar 
        toggleSidebar={toggleMobileSidebar}
        isSidebarOpen={isMobileSidebarOpen}
      />

      {/* Conteneur principal avec sidebar et contenu côte à côte */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar 
          activeItem={activeItem} 
          onItemClick={handleItemClick}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
        />

        {/* Contenu principal */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] ml-0 lg:ml-56">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;