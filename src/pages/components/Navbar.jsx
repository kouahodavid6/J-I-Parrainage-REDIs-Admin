import { Bell, Settings, User, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useLogout } from '../../hooks/useAdmin';
import ConfirmLogoutModal from '../../components/ConfirmLogoutModal';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const location = useLocation();
    
    const { admin, isAuthenticated } = useAuth();
    const { logout } = useLogout();

    // Fermer le menu mobile quand la route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const openLogoutModal = () => {
        setIsLogoutModalOpen(true);
        closeMobileMenu();
    };

    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    const handleConfirmLogout = () => {
        logout();
    };

    // Si non authentifié, ne pas afficher la navbar
    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-xl border-b border-blue-400/20 z-40 px-4 sm:px-6 flex items-center justify-between">
                {/* Section gauche */}
                <div className="flex items-center gap-4">
                    {/* Bouton menu mobile */}
                    <button 
                        className="lg:hidden w-10 h-10 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-blue-400/20"
                        onClick={toggleSidebar}
                        aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    >
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                    {/* Logo et nom */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
                            <img 
                                src="/LogoParainageREDIs.jpg" 
                                alt="REDIs Parrainage" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-white font-bold text-lg">REDIs<span className="text-blue-400">Parrainage</span></h1>
                            <p className="text-blue-200/60 text-xs">Admin Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Navigation desktop */}
                <div className="hidden lg:flex items-center gap-3">
                    {/* Bouton Paramètres */}
                    <Link to="/parametres">
                        <button 
                            className="w-10 h-10 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-blue-400/20"
                            aria-label="Paramètres"
                        >
                            <Settings size={18} />
                        </button>
                    </Link>

                    {/* Bouton déconnexion desktop */}
                    <button 
                        className="w-10 h-10 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-blue-400/20"
                        onClick={openLogoutModal}
                        aria-label="Déconnexion"
                    >
                        <LogOut size={18} />
                    </button>

                    <div className="w-px h-6 bg-blue-400/20 mx-2" />

                    {/* Profil admin */}
                    <Link 
                        to="/parametres" 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-500/10 transition-all duration-300 group border border-blue-400/20"
                        aria-label="Mon profil"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center overflow-hidden">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-white text-sm font-medium group-hover:text-blue-300 transition-colors">
                                {admin?.nom || "Admin"}
                            </p>
                            <p className="text-blue-200/60 text-xs truncate max-w-[150px]">
                                {admin?.email || "admin@redis.iua"}
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Version mobile compacte */}
                <div className="flex lg:hidden items-center gap-2">
                    <button 
                        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-blue-500/10 transition-all duration-300 border border-blue-400/20"
                        onClick={toggleMobileMenu}
                        aria-label="Menu utilisateur"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center overflow-hidden">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Menu mobile overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-30 lg:hidden">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeMobileMenu}
                        aria-label="Fermer le menu"
                    />
                    
                    <div className="absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-blue-400/20 animate-in slide-in-from-top-2 duration-300">
                        <div className="p-4 space-y-4">
                            {/* Informations admin */}
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-400/20">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center overflow-hidden">
                                    <User className="w-7 h-7 text-white" />
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">
                                        {admin?.nom || "Admin"}
                                    </p>
                                    <p className="text-blue-200/60 text-xs truncate">
                                        {admin?.email || "admin@redis.iua"}
                                    </p>
                                    <p className="text-blue-300/70 text-xs mt-1">
                                        Administrateur
                                    </p>
                                </div>
                            </div>

                            {/* Lien Paramètres mobile */}
                            <Link to="/parametres" onClick={closeMobileMenu}>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/10 text-blue-200 hover:text-white transition-all duration-300 active:scale-95 border border-blue-400/20">
                                    <Settings size={18} />
                                    <span>Paramètres</span>
                                </button>
                            </Link>

                            <div className="pt-4 border-t border-blue-400/20">
                                <button 
                                    className="w-full flex items-center gap-3 p-3 text-blue-200 hover:text-white text-sm transition-colors duration-300 hover:bg-blue-500/10 rounded-lg active:scale-95 border border-blue-400/20"
                                    onClick={openLogoutModal}
                                >
                                    <LogOut size={18} />
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmation de déconnexion */}
            <ConfirmLogoutModal 
                isOpen={isLogoutModalOpen}
                onClose={closeLogoutModal}
                onConfirm={handleConfirmLogout}
            />
        </>
    );
};

export default Navbar;