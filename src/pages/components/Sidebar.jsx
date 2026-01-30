import { useEffect } from 'react';
import { menuItems } from '../../data/data';

const Sidebar = ({ 
    activeItem, 
    onItemClick, 
    isMobileOpen, 
    onCloseMobile
}) => {
    // Fermer le menu mobile quand on clique à l'extérieur sur mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isMobileOpen) {
                onCloseMobile();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileOpen, onCloseMobile]);

    return (
        <>
            {/* Overlay mobile */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={onCloseMobile}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed top-16 left-0 h-[calc(100vh-4rem)] bg-slate-900/95 backdrop-blur-xl border-r border-blue-400/20 z-30 
                    flex flex-col transition-all duration-300 overflow-hidden
                    ${isMobileOpen ? 'translate-x-0 w-56' : '-translate-x-full'}
                    lg:translate-x-0 lg:w-56
                `}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* Menu items */}
                <nav className="flex-1 flex flex-col gap-1 w-full px-3 py-4 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.id;

                        return (
                            <div key={item.id} className="relative">
                                <button
                                    onClick={() => {
                                        onItemClick(item.id);
                                        if (isMobileOpen) onCloseMobile();
                                    }}
                                    className={`
                                        group relative w-full h-12 rounded-xl flex items-center gap-3 px-3 transition-all duration-300
                                        ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                                            : 'text-blue-200 hover:text-white hover:bg-blue-500/10'
                                        }
                                    `}
                                >
                                    <div className="relative z-10 flex items-center">
                                        <Icon
                                            size={20}
                                            className={`
                                                transition-all duration-300
                                                ${isActive ? 'text-white' : 'group-hover:text-white'}
                                            `}
                                        />
                                        
                                        <span className={`
                                            ml-3 text-sm font-medium whitespace-nowrap transition-all duration-300
                                            ${isActive ? 'text-white' : 'group-hover:text-white'}
                                        `}>
                                            {item.label}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;