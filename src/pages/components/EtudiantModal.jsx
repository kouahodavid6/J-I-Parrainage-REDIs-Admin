import { useState, useEffect, useRef, useCallback } from 'react';
import { X, User, Loader, Mail, Phone, Hash, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';

const EtudiantModal = ({ 
    isOpen, 
    onClose, 
    etudiantToEdit = null,
    onSuccess,
    niveau,
    filiere,
    onCreerEtudiant,
    onModifierEtudiant,
    isProcessing = false
}) => {
    const [formData, setFormData] = useState({
        matricule: '',
        nom: '',
        telephone: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const formRef = useRef(null);
    const firstInputRef = useRef(null);

    const handleClose = useCallback(() => {
        if (!isProcessing) {
            setFormData({
                matricule: '',
                nom: '',
                telephone: '',
                email: ''
            });
            setErrors({});
            onClose();
        }
    }, [isProcessing, onClose]);

    const validateForm = useCallback(() => {
        const newErrors = {};
        
        if (!formData.matricule.trim()) {
            newErrors.matricule = 'Le matricule est requis';
        }
        
        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom est requis';
        }
        
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }
        
        if (formData.telephone && !/^[0-9+\s-]{8,}$/.test(formData.telephone)) {
            newErrors.telephone = 'Numéro de téléphone invalide';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        
        if (!validateForm()) {
            const firstError = Object.keys(errors)[0];
            if (firstError && formRef.current) {
                const input = formRef.current.querySelector(`[name="${firstError}"]`);
                if (input) {
                    input.focus();
                }
            }
            return;
        }

        // Préparer les données au format JSON
        const jsonData = {
            matricule: formData.matricule,
            nom: formData.nom,
            telephone: formData.telephone || '',
            email: formData.email || ''
        };

        if (etudiantToEdit) {
            onModifierEtudiant({
                id: etudiantToEdit.id,
                ...jsonData
            }, {
                onSuccess: () => {
                    toast.success('Étudiant modifié avec succès');
                    onSuccess?.();
                    handleClose();
                },
                onError: (error) => {
                    toast.error(error.message || 'Erreur lors de la modification');
                },
            });
        } else {
            onCreerEtudiant({
                niveau: niveau.toLowerCase(),
                filiere: filiere.toLowerCase(),
                ...jsonData
            }, {
                onSuccess: () => {
                    toast.success('Étudiant créé avec succès');
                    onSuccess?.();
                    handleClose();
                },
                onError: (error) => {
                    toast.error(error.message || 'Erreur lors de la création');
                },
            });
        }
    }, [validateForm, errors, formData, etudiantToEdit, onModifierEtudiant, onCreerEtudiant, niveau, filiere, onSuccess, handleClose]);

    useEffect(() => {
        if (isOpen) {
            if (etudiantToEdit) {
                setFormData({
                    matricule: etudiantToEdit.matricule || '',
                    nom: etudiantToEdit.nom || '',
                    telephone: etudiantToEdit.telephone || '',
                    email: etudiantToEdit.email || ''
                });
            } else {
                setFormData({
                    matricule: '',
                    nom: '',
                    telephone: '',
                    email: ''
                });
            }
            setErrors({});
            
            setTimeout(() => {
                if (firstInputRef.current) {
                    firstInputRef.current.focus();
                }
            }, 100);
        }
    }, [isOpen, etudiantToEdit]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen && !isProcessing) {
                handleClose();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isProcessing, handleClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    if (!isOpen) return null;

    const isEditMode = !!etudiantToEdit;
    const modalTitle = isEditMode ? 'Modifier l\'étudiant' : 'Nouvel étudiant';
    const submitButtonText = isEditMode ? 'Modifier' : 'Créer';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
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
                        className="relative z-[10000] bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl w-full max-w-lg sm:max-w-2xl mx-auto shadow-2xl border border-blue-400/20 overflow-hidden m-2 sm:m-0"
                        initial={{ scale: 0.9, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div className="flex justify-between items-start p-4 sm:p-6 pb-3 sm:pb-4 border-b border-blue-400/20">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/20 mt-1 flex-shrink-0">
                                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 id="modal-title" className="text-lg sm:text-xl font-bold text-white truncate">
                                        {modalTitle}
                                    </h3>
                                </div>
                            </div>
                            {!isProcessing && (
                                <button
                                    onClick={handleClose}
                                    className="p-1.5 sm:p-2 rounded-lg hover:bg-blue-500/10 text-blue-300 hover:text-blue-200 transition-colors flex-shrink-0 ml-2"
                                    aria-label="Fermer"
                                >
                                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            )}
                        </div>

                        <div className="p-4 sm:p-6">
                            <form ref={formRef} onSubmit={handleSubmit}>
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                                        {/* Matricule */}
                                        <div className="space-y-2">
                                            <label htmlFor="matricule" className="block text-xs sm:text-sm font-medium text-blue-200">
                                                Matricule *
                                            </label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400/60" />
                                                <input
                                                    ref={firstInputRef}
                                                    id="matricule"
                                                    type="text"
                                                    name="matricule"
                                                    value={formData.matricule}
                                                    onChange={handleChange}
                                                    className={`w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-slate-800/50 border ${errors.matricule ? 'border-red-500/50 focus:border-red-500' : 'border-blue-400/30'} rounded-lg sm:rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm sm:text-base`}
                                                    placeholder="Ex: 23INF005678"
                                                    disabled={isProcessing}
                                                    aria-invalid={!!errors.matricule}
                                                    aria-describedby={errors.matricule ? "matricule-error" : undefined}
                                                />
                                            </div>
                                            {errors.matricule && (
                                                <div id="matricule-error" className="mt-1 sm:mt-2 flex items-start gap-2 text-red-400 text-xs sm:text-sm">
                                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                                                    <span>{errors.matricule}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Nom */}
                                        <div className="space-y-2">
                                            <label htmlFor="nom" className="block text-xs sm:text-sm font-medium text-blue-200">
                                                Nom complet *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400/60" />
                                                <input
                                                    id="nom"
                                                    type="text"
                                                    name="nom"
                                                    value={formData.nom}
                                                    onChange={handleChange}
                                                    className={`w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-slate-800/50 border ${errors.nom ? 'border-red-500/50 focus:border-red-500' : 'border-blue-400/30'} rounded-lg sm:rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm sm:text-base`}
                                                    placeholder="John Doe"
                                                    disabled={isProcessing}
                                                    aria-invalid={!!errors.nom}
                                                    aria-describedby={errors.nom ? "nom-error" : undefined}
                                                />
                                            </div>
                                            {errors.nom && (
                                                <div id="nom-error" className="mt-1 sm:mt-2 flex items-start gap-2 text-red-400 text-xs sm:text-sm">
                                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                                                    <span>{errors.nom}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-blue-200">
                                                Email *
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400/60" />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-slate-800/50 border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-blue-400/30'} rounded-lg sm:rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm sm:text-base`}
                                                    placeholder="etudiant@gmail.com"
                                                    disabled={isProcessing}
                                                    aria-invalid={!!errors.email}
                                                    aria-describedby={errors.email ? "email-error" : undefined}
                                                />
                                            </div>
                                            {errors.email && (
                                                <div id="email-error" className="mt-1 sm:mt-2 flex items-start gap-2 text-red-400 text-xs sm:text-sm">
                                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                                                    <span>{errors.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Téléphone */}
                                        <div className="space-y-2">
                                            <label htmlFor="telephone" className="block text-xs sm:text-sm font-medium text-blue-200">
                                                Téléphone *
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400/60" />
                                                <input
                                                    id="telephone"
                                                    type="tel"
                                                    name="telephone"
                                                    value={formData.telephone}
                                                    onChange={handleChange}
                                                    className={`w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-slate-800/50 border ${errors.telephone ? 'border-red-500/50 focus:border-red-500' : 'border-blue-400/30'} rounded-lg sm:rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-sm sm:text-base`}
                                                    placeholder="0102030405"
                                                    disabled={isProcessing}
                                                    aria-invalid={!!errors.telephone}
                                                    aria-describedby={errors.telephone ? "telephone-error" : undefined}
                                                />
                                            </div>
                                            {errors.telephone && (
                                                <div id="telephone-error" className="mt-1 sm:mt-2 flex items-start gap-2 text-red-400 text-xs sm:text-sm">
                                                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                                                    <span>{errors.telephone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Indicateur des champs obligatoires */}
                                    <div className="pt-3 sm:pt-4">
                                        <p className="text-xs sm:text-sm text-blue-300/70">
                                            <span className="text-red-400">*</span> Tous les champs sont obligatoires
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-blue-400/20">
                                    {!isProcessing && (
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="w-full sm:w-auto sm:flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl border border-blue-400/20 text-blue-200 hover:bg-blue-500/10 transition-colors font-medium text-sm sm:text-base hover:scale-[1.02] active:scale-95"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full sm:w-auto sm:flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm sm:text-base shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 sm:gap-3 hover:scale-[1.02] active:scale-95"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin flex-shrink-0" />
                                                <span className="whitespace-nowrap">
                                                    {isEditMode ? 'Modification...' : 'Création...'}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                                <span className="whitespace-nowrap">{submitButtonText}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EtudiantModal;