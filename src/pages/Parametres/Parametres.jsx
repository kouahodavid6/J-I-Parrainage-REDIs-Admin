import { useState, useEffect, useRef } from 'react';
import PageHeader from "../components/PageHeader";
import { 
    User, 
    Mail, 
    Phone, 
    Lock, 
    Save, 
    Eye, 
    EyeOff, 
    Shield, 
    CheckCircle, 
    AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useAdminProfile, useUpdateInfo, useChangePassword } from "../../hooks/useAdmin";

// Schéma de validation pour le profil
const profileSchema = z.object({
    nom: z.string()
        .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
        .max(100, { message: "Le nom ne peut pas dépasser 100 caractères" })
        .trim(),
    email: z.string()
        .email({ message: "Adresse email invalide" })
        .trim()
        .toLowerCase(),
    telephone: z.string()
        .min(10, { message: "Le numéro de téléphone doit contenir au moins 10 chiffres" })
        .max(15, { message: "Le numéro de téléphone ne peut pas dépasser 15 chiffres" })
        .regex(/^[0-9+\s-]+$/, { message: "Numéro de téléphone invalide" })
        .trim(),
});

// Schéma de validation pour le mot de passe
const passwordSchema = z.object({
    ancien_password: z.string()
        .min(1, { message: "L'ancien mot de passe est requis" }),
    nouveau: z.string()
        .min(8, { message: "Le nouveau mot de passe doit contenir au moins 8 caractères" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, { 
            message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&#)" 
        }),
    confirmation: z.string()
        .min(1, { message: "La confirmation est requise" })
}).refine((data) => data.nouveau === data.confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmation"],
});

const Parametres = () => {
    // États pour les formulaires
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    
    // Références
    const profileFormRef = useRef(null);
    
    // Hooks personnalisés
    const { data: admin, isLoading: isLoadingProfile } = useAdminProfile();
    const { updateInfo, isUpdatingInfo, updateInfoError } = useUpdateInfo();
    const { changePassword, isChangingPassword, changePasswordError } = useChangePassword();

    // Formulaires
    const { 
        register: registerProfile, 
        handleSubmit: handleSubmitProfile, 
        formState: { errors: profileErrors, isDirty: isProfileDirty },
        reset: resetProfile,
        trigger: triggerProfile
    } = useForm({
        resolver: zodResolver(profileSchema),
        mode: 'onChange',
        reValidateMode: 'onChange'
    });

    const { 
        register: registerPassword, 
        handleSubmit: handleSubmitPassword, 
        formState: { errors: passwordErrors, isDirty: isPasswordDirty, isValid: isPasswordValid },
        reset: resetPassword,
        watch: watchPassword,
        trigger: triggerPassword,
        clearErrors: clearPasswordErrors
    } = useForm({
        resolver: zodResolver(passwordSchema),
        mode: 'onChange',
        reValidateMode: 'onChange'
    });

    // Suivre la valeur du champ "nouveau" mot de passe
    const nouveauPassword = watchPassword('nouveau') || '';
    const confirmationPassword = watchPassword('confirmation') || '';

    // Calculer la force du mot de passe
    useEffect(() => {
        const password = nouveauPassword;
        let strength = 0;
        
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[@$!%*?&#]/.test(password)) strength += 1;
        
        setPasswordStrength(strength);
    }, [nouveauPassword]);

    // Pré-remplir le formulaire de profil quand les données sont chargées
    useEffect(() => {
        if (admin && !isLoadingProfile) {
            resetProfile({
                nom: admin.nom || '',
                email: admin.email || '',
                telephone: admin.telephone || ''
            }, {
                keepDefaultValues: false,
                keepDirty: false
            });
        }
    }, [admin, isLoadingProfile, resetProfile]);

    // Vérifier si le formulaire de profil a des modifications
    const hasProfileChanges = () => {
        if (!admin || isLoadingProfile) return false;
        
        const hasFormChanges = isProfileDirty;
        
        return hasFormChanges;
    };

    // Soumission du formulaire de profil
    const onSubmitProfile = async (data) => {
        // Valider le formulaire
        const isValid = await triggerProfile();
        if (!isValid) {
            toast.error("Veuillez corriger les erreurs dans le formulaire", {
                duration: 4000
            });
            return;
        }

        try {
            const profileData = {
                nom: data.nom.trim(),
                email: data.email.trim(),
                telephone: data.telephone.trim()
            };
            
            const result = await updateInfo(profileData);
            
            // Réinitialiser après succès
            if (result.success) {
                // Le reset se fait automatiquement dans le hook
            }
            
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
        }
    };

    // Soumission du formulaire de mot de passe
    const onSubmitPassword = async (data) => {
        // Valider le formulaire
        const isValid = await triggerPassword();
        if (!isValid) {
            toast.error("Veuillez corriger les erreurs dans le formulaire", {
                duration: 4000
            });
            return;
        }

        try {
            const passwordData = {
                ancien_password: data.ancien_password,
                nouveau: data.nouveau
            };
            
            const result = await changePassword(passwordData);
            
            // Réinitialiser après succès
            if (result.success) {
                resetPassword();
                setPasswordStrength(0);
                clearPasswordErrors();
            }
            
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
        }
    };

    // Fonctions pour la force du mot de passe
    const getPasswordStrengthLabel = () => {
        if (!nouveauPassword) return '';
        if (passwordStrength === 0) return 'Très faible';
        if (passwordStrength === 1) return 'Faible';
        if (passwordStrength === 2) return 'Moyen';
        if (passwordStrength === 3) return 'Bon';
        if (passwordStrength === 4) return 'Fort';
        if (passwordStrength === 5) return 'Très fort';
        return '';
    };

    const getPasswordStrengthColor = () => {
        if (!nouveauPassword) return 'bg-gray-800';
        if (passwordStrength <= 1) return 'bg-red-500';
        if (passwordStrength === 2) return 'bg-orange-500';
        if (passwordStrength === 3) return 'bg-yellow-500';
        if (passwordStrength === 4) return 'bg-green-500';
        if (passwordStrength === 5) return 'bg-emerald-600';
        return 'bg-gray-800';
    };

    const getPasswordStrengthWidth = () => {
        if (!nouveauPassword) return '0%';
        return `${(passwordStrength / 5) * 100}%`;
    };

    const getPasswordStrengthTextColor = () => {
        if (!nouveauPassword) return 'text-blue-300/50';
        if (passwordStrength <= 1) return 'text-red-400';
        if (passwordStrength === 2) return 'text-orange-400';
        if (passwordStrength === 3) return 'text-yellow-400';
        if (passwordStrength === 4) return 'text-green-400';
        if (passwordStrength === 5) return 'text-emerald-400';
        return 'text-blue-300/50';
    };

    // Squelette de chargement
    if (isLoadingProfile) {
        return (
            <div className="space-y-6">
                <PageHeader 
                    title="Paramètres"
                    subtitle="Gérez vos informations personnelles"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, index) => (
                        <div key={index} className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-blue-400/20 p-6 animate-pulse">
                            <div className="h-6 bg-blue-900/30 rounded w-1/3 mb-4"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-blue-900/30 rounded w-full"></div>
                                <div className="h-4 bg-blue-900/30 rounded w-4/5"></div>
                                <div className="h-10 bg-blue-900/30 rounded-xl mt-6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader 
                title="Paramètres"
                subtitle="Gérez vos informations personnelles"
            />

            {/* Section principale */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Formulaire de modification de profil */}
                <motion.div 
                    className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-blue-400/20 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                            <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Profil Administrateur</h3>
                            <p className="text-blue-200/60 text-sm">Modifiez vos informations personnelles</p>
                        </div>
                    </div>

                    {/* Formulaire */}
                    <form ref={profileFormRef} onSubmit={handleSubmitProfile(onSubmitProfile)}>
                        <div className="space-y-4">
                            {/* Nom */}
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Nom complet *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
                                    <input
                                        type="text"
                                        {...registerProfile('nom')}
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border ${
                                            profileErrors.nom ? 'border-red-500/50' : 'border-blue-400/30'
                                        } rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                        placeholder="Votre nom complet"
                                        disabled={isUpdatingInfo}
                                    />
                                </div>
                                {profileErrors.nom && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                        {profileErrors.nom.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Adresse email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
                                    <input
                                        type="email"
                                        {...registerProfile('email')}
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border ${
                                            profileErrors.email ? 'border-red-500/50' : 'border-blue-400/30'
                                        } rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                        placeholder="votre@email.com"
                                        disabled={isUpdatingInfo}
                                    />
                                </div>
                                {profileErrors.email && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                        {profileErrors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Téléphone */}
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Numéro de téléphone *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
                                    <input
                                        type="tel"
                                        {...registerProfile('telephone')}
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border ${
                                            profileErrors.telephone ? 'border-red-500/50' : 'border-blue-400/30'
                                        } rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                        placeholder="+237 6XX XX XX XX"
                                        disabled={isUpdatingInfo}
                                    />
                                </div>
                                {profileErrors.telephone && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                        {profileErrors.telephone.message}
                                    </p>
                                )}
                            </div>

                            {/* Indicateur de modifications */}
                            {hasProfileChanges() && (
                                <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                                    <p className="text-sm text-blue-300 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Vous avez des modifications non sauvegardées
                                    </p>
                                </div>
                            )}

                            {/* Bouton de soumission */}
                            <button
                                type="submit"
                                disabled={isUpdatingInfo || !hasProfileChanges()}
                                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95"
                            >
                                {isUpdatingInfo ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Mise à jour en cours...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        {hasProfileChanges() ? 'Enregistrer les modifications' : 'Aucune modification'}
                                    </>
                                )}
                            </button>
                            
                            {/* Message d'erreur global */}
                            {updateInfoError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mt-4">
                                    <p className="text-sm text-red-400 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        {updateInfoError.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </motion.div>

                {/* Formulaire de changement de mot de passe */}
                <motion.div 
                    className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-blue-400/20 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                            <Shield className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Sécurité</h3>
                            <p className="text-blue-200/60 text-sm">Changez votre mot de passe</p>
                        </div>
                    </div>

                    {/* Indicateur de force du mot de passe */}
                    {nouveauPassword && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-blue-200/80">Force du mot de passe</span>
                                <span className={`text-xs font-medium ${getPasswordStrengthTextColor()}`}>
                                    {getPasswordStrengthLabel()}
                                </span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                    style={{ width: getPasswordStrengthWidth() }}
                                ></div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`h-3 w-3 ${
                                        nouveauPassword.length >= 8 
                                            ? 'text-green-400' 
                                            : 'text-blue-300/30'
                                    }`} />
                                    <span className={`text-xs ${
                                        nouveauPassword.length >= 8 
                                            ? 'text-green-400' 
                                            : 'text-blue-200/60'
                                    }`}>
                                        Minimum 8 caractères
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`h-3 w-3 ${
                                        /[a-z]/.test(nouveauPassword)
                                            ? 'text-green-400' 
                                            : 'text-blue-300/30'
                                    }`} />
                                    <span className={`text-xs ${
                                        /[a-z]/.test(nouveauPassword)
                                            ? 'text-green-400' 
                                            : 'text-blue-200/60'
                                    }`}>
                                        Au moins une minuscule
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`h-3 w-3 ${
                                        /[A-Z]/.test(nouveauPassword)
                                            ? 'text-green-400' 
                                            : 'text-blue-300/30'
                                    }`} />
                                    <span className={`text-xs ${
                                        /[A-Z]/.test(nouveauPassword)
                                            ? 'text-green-400' 
                                            : 'text-blue-200/60'
                                    }`}>
                                        Au moins une majuscule
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`h-3 w-3 ${
                                        /\d/.test(nouveauPassword)
                                            ? 'text-green-400' 
                                            : 'text-blue-300/30'
                                    }`} />
                                    <span className={`text-xs ${
                                        /\d/.test(nouveauPassword)
                                            ? 'text-green-400' 
                                            : 'text-blue-200/60'
                                    }`}>
                                        Au moins un chiffre
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`h-3 w-3 ${
                                        /[@$!%*?&#]/.test(nouveauPassword)
                                            ? 'text-green-400' 
                                            : 'text-blue-300/30'
                                    }`} />
                                    <span className={`text-xs ${
                                        /[@$!%*?&#]/.test(nouveauPassword)
                                            ? 'text-green-400' 
                                            : 'text-blue-200/60'
                                    }`}>
                                        Au moins un caractère spécial (@$!%*?&#)
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                        <div className="space-y-4">
                            {/* Ancien mot de passe */}
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Ancien mot de passe *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        {...registerPassword('ancien_password')}
                                        className={`w-full pl-10 pr-10 py-3 bg-slate-800/50 border ${
                                            passwordErrors.ancien_password ? 'border-red-500/50' : 'border-blue-400/30'
                                        } rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                        placeholder="Votre ancien mot de passe"
                                        disabled={isChangingPassword}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-200 transition-colors"
                                        disabled={isChangingPassword}
                                    >
                                        {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordErrors.ancien_password && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                        {passwordErrors.ancien_password.message}
                                    </p>
                                )}
                            </div>

                            {/* Nouveau mot de passe */}
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Nouveau mot de passe *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        {...registerPassword('nouveau')}
                                        className={`w-full pl-10 pr-10 py-3 bg-slate-800/50 border ${
                                            passwordErrors.nouveau ? 'border-red-500/50' : 'border-blue-400/30'
                                        } rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                        placeholder="Votre nouveau mot de passe"
                                        disabled={isChangingPassword}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-200 transition-colors"
                                        disabled={isChangingPassword}
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordErrors.nouveau && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                        {passwordErrors.nouveau.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirmation du mot de passe */}
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Confirmer le nouveau mot de passe *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...registerPassword('confirmation')}
                                        className={`w-full pl-10 pr-10 py-3 bg-slate-800/50 border ${
                                            passwordErrors.confirmation ? 'border-red-500/50' : 'border-blue-400/30'
                                        } rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                        placeholder="Confirmez votre nouveau mot de passe"
                                        disabled={isChangingPassword}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-200 transition-colors"
                                        disabled={isChangingPassword}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordErrors.confirmation && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                                        {passwordErrors.confirmation.message}
                                    </p>
                                )}
                            </div>

                            {/* Vérification de correspondance */}
                            {nouveauPassword && confirmationPassword && (
                                <div className={`p-3 rounded-lg ${
                                    nouveauPassword === confirmationPassword 
                                        ? 'bg-green-500/10 border border-green-500/20' 
                                        : 'bg-red-500/10 border border-red-500/20'
                                }`}>
                                    <p className={`text-sm flex items-center gap-2 ${
                                        nouveauPassword === confirmationPassword 
                                            ? 'text-green-400' 
                                            : 'text-red-400'
                                    }`}>
                                        {nouveauPassword === confirmationPassword ? (
                                            <>
                                                <CheckCircle className="h-4 w-4" />
                                                Les mots de passe correspondent
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="h-4 w-4" />
                                                Les mots de passe ne correspondent pas
                                            </>
                                        )}
                                    </p>
                                </div>
                            )}

                            {/* Bouton de soumission */}
                            <button
                                type="submit"
                                disabled={isChangingPassword || !isPasswordDirty || !isPasswordValid}
                                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Changement en cours...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="h-4 w-4" />
                                        Changer le mot de passe
                                    </>
                                )}
                            </button>
                            
                            {/* Message d'erreur global */}
                            {changePasswordError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mt-4">
                                    <p className="text-sm text-red-400 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        {changePasswordError.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </motion.div>

                {/* Informations de sécurité */}
                <div className="p-6 border border-blue-400/20 rounded-xl">
                    <h4 className="text-blue-200 font-medium mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        Conseils de sécurité
                    </h4>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                            <span className="text-blue-200/70 text-sm">Utilisez un mot de passe unique que vous n'utilisez nulle part ailleurs</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                            <span className="text-blue-200/70 text-sm">Changez votre mot de passe régulièrement (tous les 3 mois)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                            <span className="text-blue-200/70 text-sm">Ajoutez des caractères spéciaux (@$!%*?&#) pour renforcer la sécurité</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                            <span className="text-blue-200/70 text-sm">Ne partagez jamais votre mot de passe avec qui que ce soit</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Parametres;