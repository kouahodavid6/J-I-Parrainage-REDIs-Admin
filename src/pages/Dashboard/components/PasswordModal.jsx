// components/PasswordModal.jsx
import { useState, useEffect, useRef } from 'react';
import { X, Key, Lock, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordModal = ({
    isOpen,
    onConfirm,
    onCancel,
    isProcessing = false,
    title = "Vérification requise",
    message = "Veuillez entrer le mot de passe super admin pour continuer",
    confirmText = "Valider",
    cancelText = "Annuler",
    placeholder = "Mot de passe super admin"
}) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const passwordInputRef = useRef(null);

    // Focus sur l'input quand le modal s'ouvre
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (passwordInputRef.current) {
                    passwordInputRef.current.focus();
                }
            }, 100);
            
            // Réinitialiser le formulaire
            setPassword('');
            setError('');
        }
    }, [isOpen]);

    // Gestion de la touche Escape
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isOpen && !isProcessing) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, isProcessing, onCancel]);

    // Gestion de la touche Entrée
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isProcessing && password.trim()) {
            handleConfirm();
        }
    };

    const handleConfirm = () => {
        if (!password.trim()) {
            setError('Le mot de passe est requis');
            return;
        }
        onConfirm(password);
    };

    const handleChange = (e) => {
        setPassword(e.target.value);
        if (error) setError('');
    };

    if (!isOpen) return null;

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
                        onClick={onCancel}
                        style={{ cursor: 'pointer' }}
                    />
                    
                    {/* Modal */}
                    <div 
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                        onClick={onCancel}
                        style={{ cursor: 'pointer' }}
                    >
                        <motion.div
                            className="max-w-md w-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-blue-400/20 shadow-2xl shadow-blue-500/10 overflow-hidden"
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
                                    <div className="p-2 rounded-lg bg-red-500/20">
                                        <Lock className="h-5 w-5 text-red-400" />
                                    </div>
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
                                <p className="text-blue-200 text-base mb-2">
                                    {message}
                                </p>
                                <p className="text-blue-200/60 text-sm mb-6">
                                    Cette action est irréversible et supprimera toutes les données de la plateforme.
                                </p>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-blue-200">
                                        Mot de passe super admin
                                    </label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
                                        <input
                                            ref={passwordInputRef}
                                            type="password"
                                            value={password}
                                            onChange={handleChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder={placeholder}
                                            disabled={isProcessing}
                                            className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border ${
                                                error ? 'border-red-500/50' : 'border-blue-400/30'
                                            } rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                        />
                                    </div>
                                    {error && (
                                        <div className="flex items-center gap-1 text-red-400 text-sm">
                                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                            <span>{error}</span>
                                        </div>
                                    )}
                                </div>
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
                                        onClick={handleConfirm}
                                        disabled={isProcessing || !password.trim()}
                                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader className="h-4 w-4 animate-spin flex-shrink-0" />
                                                <span>Vérification...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-4 w-4 flex-shrink-0" />
                                                <span>{confirmText}</span>
                                            </>
                                        )}
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

export default PasswordModal;