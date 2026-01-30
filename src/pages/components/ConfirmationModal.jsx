import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';

const ConfirmationModal = ({
    isOpen,
    onConfirm,
    onCancel,
    isProcessing = false,
    title = "Confirmation",
    message = "Êtes-vous sûr de vouloir effectuer cette action ?",
    description = "",
    confirmText = "Confirmer",
    cancelText = "Annuler",
    confirmColor = "blue", // blue, red, green
    icon,
    iconBgColor = "bg-blue-500/20",
    size = "md", // sm, md, lg
    closeOnBackdropClick = true
}) => {
    const modalRef = useRef(null);

    // Gestion de la fermeture avec la touche Escape
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isOpen && !isProcessing) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, isProcessing, onCancel]);

    // Gestion du clic en dehors du modal
    const handleBackdropClick = (event) => {
        if (closeOnBackdropClick && 
            !isProcessing && 
            modalRef.current && 
            !modalRef.current.contains(event.target)) {
            onCancel();
        }
    };

    if (!isOpen) return null;

    const getConfirmButtonClasses = () => {
        const baseClasses = "flex-1 py-3 px-4 rounded-xl text-white transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95";
        
        switch (confirmColor) {
            case 'red':
                return `${baseClasses} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/30`;
            case 'green':
                return `${baseClasses} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-green-500/30`;
            case 'blue':
            default:
                return `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/30`;
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'max-w-sm';
            case 'lg':
                return 'max-w-lg';
            case 'md':
            default:
                return 'max-w-md';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleBackdropClick}
                        style={{ cursor: 'pointer' }}
                    />
                    
                    {/* Modal */}
                    <div 
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                        onClick={handleBackdropClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <motion.div
                            ref={modalRef}
                            className={`${getSizeClasses()} w-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-blue-400/20 shadow-2xl shadow-blue-500/10 overflow-hidden`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: 'default' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-blue-400/20">
                                <div className="flex items-center gap-3">
                                    {icon && (
                                        <div className={`p-2 rounded-lg ${iconBgColor}`}>
                                            {icon}
                                        </div>
                                    )}
                                    <h3 className="text-white font-bold text-lg">
                                        {title}
                                    </h3>
                                </div>
                                <button
                                    onClick={onCancel}
                                    disabled={isProcessing}
                                    className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-300 hover:text-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Fermer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <p className="text-blue-200 text-base mb-4">
                                    {message}
                                </p>
                                {description && (
                                    <p className="text-blue-200/60 text-sm mb-6">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-blue-500/5 border-t border-blue-400/20">
                                <div className="flex gap-3">
                                    <button
                                        onClick={onCancel}
                                        disabled={isProcessing}
                                        className="flex-1 py-3 px-4 rounded-xl border border-blue-400/20 text-blue-200 hover:bg-blue-500/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={isProcessing}
                                        className={getConfirmButtonClasses()}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;