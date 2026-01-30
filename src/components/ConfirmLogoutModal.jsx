import { LogOut, X, Shield, AlertTriangle } from "lucide-react";
import { useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => (document.body.style.overflow = '');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: { 
            scale: 0.95,
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Overlay */}
                    <motion.div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                        variants={overlayVariants}
                    />
                    
                    {/* Modal */}
                    <motion.div 
                        className="relative z-[10000] bg-slate-900/95 backdrop-blur-xl border border-blue-400/20 rounded-2xl w-full max-w-[95vw] sm:max-w-md mx-auto shadow-2xl shadow-blue-500/10"
                        variants={modalVariants}
                    >
                        {/* En-tête */}
                        <div className="flex justify-between items-start p-4 sm:p-6 border-b border-blue-400/10">
                            <div className="flex items-start gap-3">
                                <motion.div
                                    className="p-2 rounded-xl bg-blue-500/10 mt-1 flex-shrink-0"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                >
                                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                                </motion.div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base sm:text-lg font-bold text-white truncate">
                                        Confirmer la déconnexion
                                    </h3>
                                    <p className="text-blue-200/60 text-xs sm:text-sm mt-1">
                                        Sécurité du compte administrateur
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="p-1 sm:p-2 rounded-lg hover:bg-blue-500/10 text-blue-300 hover:text-blue-200 transition-colors flex-shrink-0 ml-2"
                                aria-label="Fermer"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            </motion.button>
                        </div>
                        
                        {/* Contenu */}
                        <div className="p-4 sm:p-6">
                            <div className="text-center mb-4 sm:mb-6">
                                <motion.div
                                    className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                >
                                    <LogOut className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                                </motion.div>
                                <h4 className="text-base sm:text-lg font-semibold text-white mb-2 px-2">
                                    Êtes-vous sûr de vouloir vous déconnecter ?
                                </h4>
                                <p className="text-blue-200/60 text-xs sm:text-sm px-1">
                                    Vous serez redirigé vers la page de connexion et devrez vous réauthentifier pour accéder au dashboard.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <motion.button
                                    onClick={onClose}
                                    className="flex-1 py-2 sm:py-3 rounded-xl border border-blue-400/20 text-blue-200 hover:bg-blue-500/10 transition-colors font-medium text-sm sm:text-base"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Annuler
                                </motion.button>
                                <motion.button
                                    onClick={handleConfirm}
                                    className="flex-1 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 transition-all font-medium text-sm sm:text-base shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Se déconnecter
                                </motion.button>
                            </div>
                        </div>

                        {/* Pied de page */}
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-blue-400/10 bg-blue-500/5 rounded-b-2xl">
                            <div className="flex items-center justify-center gap-2">
                                <Shield className="h-3 w-3 text-blue-400 flex-shrink-0" />
                                <p className="text-xs text-blue-300/70 text-center">
                                    Votre session sera sécurisée
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmLogoutModal;