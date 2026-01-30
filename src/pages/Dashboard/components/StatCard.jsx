// pages/Etudiants/components/StatCard.js
import { motion } from 'framer-motion';

const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    iconBgColor = 'from-blue-600 to-blue-500',
    isLoading = false,
    error = null,
    isClickable = false,
    onClick,
    showActionButton = false,
    onActionClick,
    actionText = "Ajouter",
    actionIcon: ActionIcon
}) => {
    const CardContent = () => (
        <div className={`bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20 transition-all duration-300 group
            ${isClickable ? 'hover:border-blue-400/40 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer' : ''}
        `}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* Titre */}
                    <p className="text-blue-200/60 text-sm font-medium mb-2">{title}</p>
                    
                    {/* Affichage avec différents états */}
                    {isLoading ? (
                        <div className="animate-pulse">
                            <div className="h-8 w-24 bg-slate-800 rounded mb-2"></div>
                            <div className="h-3 w-32 bg-slate-800 rounded"></div>
                        </div>
                    ) : error ? (
                        <div>
                            <h3 className="text-red-500 text-2xl font-bold mb-3">Erreur</h3>
                            <p className="text-red-400 text-sm">
                                {error?.message || 'Impossible de charger'}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-white text-3xl font-bold mb-2">
                                {value}
                            </h3>
                            
                            {/* Sous-titre */}
                            {subtitle && (
                                <p className="text-blue-300/70 text-sm">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Icône */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${iconBgColor} flex items-center justify-center shadow-lg 
                    shadow-blue-500/20 ${isClickable ? 'group-hover:scale-110 transition-transform duration-300' : ''}`}
                >
                    <Icon size={24} className="text-white" />
                </div>
            </div>

            {/* Bouton d'action (optionnel) */}
            {showActionButton && onActionClick && !isLoading && !error && (
                <div className="mt-4 pt-4 border-t border-blue-400/20">
                    <button
                        onClick={onActionClick}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20 text-blue-300 hover:text-blue-200 transition-all duration-300 text-sm font-medium"
                    >
                        {ActionIcon && <ActionIcon className="h-4 w-4" />}
                        {actionText}
                    </button>
                </div>
            )}
        </div>
    );

    // Si cliquable, wrapper avec motion.div
    if (isClickable) {
        return (
            <motion.div 
                onClick={onClick}
                className="relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <CardContent />
            </motion.div>
        );
    }

    // Sinon, retourne juste le contenu
    return <CardContent />;
};

export default StatCard;