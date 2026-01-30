import { useState, useEffect, useRef } from 'react';
import { X, UserPlus, Loader, Mail, Phone, User, Lock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';

const SousAdminModal = (props) => {
    const {
        isOpen, 
        onClose, 
        onCreateSousAdmin,
        isProcessing = false
    } = props;
    
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const formRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setNom('');
            setEmail('');
            setTelephone('');
            setPassword('');
            setErrors({});
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!nom.trim()) {
            newErrors.nom = 'Le nom est requis';
        }
        
        if (!email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email invalide';
        }
        
        if (!telephone.trim()) {
            newErrors.telephone = 'Le téléphone est requis';
        }

        if (!password.trim()) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const sousAdminData = {
            nom: nom.trim(),
            email: email.trim(),
            telephone: telephone.trim(),
            password: password
        };

        onCreateSousAdmin(sousAdminData, {
            onSuccess: () => {
                handleClose();
            },
            onError: (error) => {
                toast.error(error.message || 'Erreur lors de la création');
            },
        });
    };

    const handleClose = () => {
        if (!isProcessing) {
            setNom('');
            setEmail('');
            setTelephone('');
            setPassword('');
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleClose}
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div 
                        className="relative z-[10000] bg-slate-900/95 backdrop-blur-xl rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-blue-400/20 overflow-hidden"
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className="flex justify-between items-start p-6 border-b border-blue-400/20">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/20 mt-1 flex-shrink-0">
                                    <UserPlus className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-bold text-white truncate">
                                        Nouveau Sous-Admin
                                    </h3>
                                    <p className="text-blue-300 text-sm mt-1">
                                        Ajoutez un nouveau sous-administrateur
                                    </p>
                                </div>
                            </div>
                            {!isProcessing && (
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-300 hover:text-blue-200 transition-colors flex-shrink-0 ml-2"
                                    aria-label="Fermer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <div className="p-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <form ref={formRef} onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {/* Nom */}
                                    <div>
                                        <label htmlFor="nom" className="block text-sm font-medium text-blue-200 mb-2">
                                            Nom complet *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/50" />
                                            <input
                                                type="text"
                                                id="nom"
                                                value={nom}
                                                onChange={(e) => {
                                                    setNom(e.target.value);
                                                    if (errors.nom) setErrors(prev => ({ ...prev, nom: '' }));
                                                }}
                                                className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border ${errors.nom ? 'border-red-500/50' : 'border-blue-400/30'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-white placeholder-blue-300/40 text-sm`}
                                                placeholder="Ex: Kouaho David"
                                                disabled={isProcessing}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                        {errors.nom && (
                                            <p className="mt-1 text-sm text-red-400">{errors.nom}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                                            Email *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/50" />
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                                }}
                                                className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border ${errors.email ? 'border-red-500/50' : 'border-blue-400/30'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-white placeholder-blue-300/40 text-sm`}
                                                placeholder="Ex: sousadmin@example.com"
                                                disabled={isProcessing}
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Téléphone */}
                                    <div>
                                        <label htmlFor="telephone" className="block text-sm font-medium text-blue-200 mb-2">
                                            Téléphone *
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/50" />
                                            <input
                                                type="tel"
                                                id="telephone"
                                                value={telephone}
                                                onChange={(e) => {
                                                    setTelephone(e.target.value);
                                                    if (errors.telephone) setErrors(prev => ({ ...prev, telephone: '' }));
                                                }}
                                                className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border ${errors.telephone ? 'border-red-500/50' : 'border-blue-400/30'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-white placeholder-blue-300/40 text-sm`}
                                                placeholder="Ex: 0171136261"
                                                disabled={isProcessing}
                                                required
                                            />
                                        </div>
                                        {errors.telephone && (
                                            <p className="mt-1 text-sm text-red-400">{errors.telephone}</p>
                                        )}
                                    </div>

                                    {/* Mot de passe */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                                            Mot de passe *
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/50" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                                                }}
                                                className={`w-full pl-10 pr-10 py-3 bg-slate-800/50 border ${errors.password ? 'border-red-500/50' : 'border-blue-400/30'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-white placeholder-blue-300/40 text-sm`}
                                                placeholder="Minimum 6 caractères"
                                                disabled={isProcessing}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-200 transition-colors"
                                                disabled={isProcessing}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
                                    {!isProcessing && (
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-blue-400/20 text-blue-200 hover:bg-blue-500/10 transition-colors font-medium text-sm sm:text-base hover:scale-[1.02] active:scale-95"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm sm:text-base shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader className="h-4 w-4 animate-spin flex-shrink-0" />
                                                <span className="whitespace-nowrap">Création...</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4 flex-shrink-0" />
                                                <span className="whitespace-nowrap">Créer sous-admin</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Style pour cacher la scrollbar */}
                        <style jsx>{`
                            div[class*="p-6"]::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SousAdminModal;