// components/MatchEtudiants.jsx
import { useState, useEffect } from 'react';
import { 
    RefreshCw, 
    Sparkles, 
    Users, 
    User, 
    UserCheck,
    Search, 
    AlertCircle,
    GraduationCap,
    ChevronDown,
    Mail,
    Phone,
    ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useParrainage } from '../../hooks/useParrainage';
import toast from 'react-hot-toast';

const ParticleAnimation = ({ isActive, onComplete }) => {
    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                onComplete();
            }, 3000); // Animation de 3 secondes

            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[10001] pointer-events-none">
            {/* Overlay */}
            <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
            
            {/* Particules */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 100 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-lg shadow-blue-400/50"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: 0,
                        }}
                        animate={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: [0, 1, 0.5, 1, 0],
                            rotate: [0, 180, 360, 180, 0],
                        }}
                        transition={{
                            duration: 3,
                            times: [0, 0.2, 0.5, 0.8, 1],
                            ease: "easeInOut",
                            repeat: 0,
                        }}
                    />
                ))}
            </div>

            {/* Message central */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    <div className="relative">
                        <motion.div
                            className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 flex items-center justify-center"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            <Sparkles className="h-16 w-16 text-blue-400" />
                        </motion.div>
                        
                        <motion.h3 
                            className="text-2xl font-bold text-white mb-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            Matching en cours...
                        </motion.h3>
                        
                        <motion.p 
                            className="text-blue-300/80 max-w-md mx-auto text-lg"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            Association des L1 avec leurs parrains L2
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const MatchEtudiants = () => {
    const [isAnimationActive, setIsAnimationActive] = useState(false);
    const [matricule, setMatricule] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState('');
    
    const {
        lancerMatchingAsync,
        isMatching,
        matchingError,
        matchingSuccess,
        rechercheParMatriculeAsync,
        isRecherche,
        rechercheError,
        isProcessing
    } = useParrainage();

    // Gérer le matching
    const handleLancerMatching = async () => {
        try {
            setIsAnimationActive(true);
            await lancerMatchingAsync();
        } catch (error) {
            toast.error(error.message || 'Erreur lors du matching');
        }
    };

    // Gérer la fin de l'animation
    const handleAnimationComplete = () => {
        setIsAnimationActive(false);
        if (matchingSuccess) {
            toast.success('Matching terminé avec succès !', {
                duration: 5000,
                icon: '🎉'
            });
        }
    };

    // Gérer la recherche par matricule
    const handleRecherche = async (e) => {
        e.preventDefault();
        if (!matricule.trim()) {
            setSearchError('Veuillez entrer un matricule');
            return;
        }

        setSearchResult(null);
        setSearchError('');

        try {
            const result = await rechercheParMatriculeAsync(matricule);
            setSearchResult(result);
        } catch (error) {
            setSearchError(error.message);
        }
    };

    // Réinitialiser la recherche
    const handleReset = () => {
        setMatricule('');
        setSearchResult(null);
        setSearchError('');
    };

    // Effets pour gérer les erreurs
    useEffect(() => {
        if (matchingError) {
            toast.error(matchingError.message || 'Erreur lors du matching');
        }
    }, [matchingError]);

    useEffect(() => {
        if (rechercheError) {
            setSearchError(rechercheError.message);
        }
    }, [rechercheError]);

    return (
        <>
            {/* Animation des particules */}
            <ParticleAnimation 
                isActive={isAnimationActive} 
                onComplete={handleAnimationComplete} 
            />

            <div className="space-y-8">
                {/* En-tête */}
                <div className="w-full bg-gradient-to-br from-blue-950/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Système de Parrainage - Administration
                            </h1>
                            <p className="text-blue-300/70">
                                Gestion du matching entre étudiants L1 et L2
                            </p>
                        </div>
                        
                        <button
                            onClick={handleLancerMatching}
                            disabled={isProcessing}
                            className="w-full lg:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-blue-500/30 group flex items-center justify-center gap-2"
                        >
                            <RefreshCw className={`h-5 w-5 ${isMatching ? 'animate-spin' : ''}`} />
                            <span>Lancer le matching automatique</span>
                        </button>
                    </div>
                </div>

                {/* Recherche par matricule - Pleine largeur */}
                <div className="w-full bg-gradient-to-br from-blue-950/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Search className="h-5 w-5 text-blue-400" />
                        Rechercher par matricule
                    </h2>
                    
                    <form onSubmit={handleRecherche}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-2">
                                    Matricule de l'étudiant
                                </label>
                                <input
                                    type="text"
                                    value={matricule}
                                    onChange={(e) => setMatricule(e.target.value.toUpperCase())}
                                    placeholder="Ex: 25INF00342S"
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-blue-400/30 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                    disabled={isProcessing}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={isProcessing || !matricule.trim()}
                                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                                >
                                    {isRecherche ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Recherche en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Search className="h-4 w-4" />
                                            <span>Rechercher cet étudiant</span>
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-4 py-3 rounded-xl border border-blue-400/20 text-blue-200 hover:bg-blue-500/10 transition-colors font-medium"
                                >
                                    Réinitialiser
                                </button>
                            </div>
                        </div>
                    </form>

                    {searchError && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <p className="text-sm">{searchError}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Résultats - Pleine largeur */}
                <div className="w-full">
                    {searchResult ? (
                        <div className="bg-gradient-to-br from-blue-950/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-blue-400/20 overflow-hidden">
                            {/* En-tête du résultat */}
                            <div className="p-6 border-b border-blue-400/20">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-white mb-1">
                                            Résultats pour {searchResult.etudiant?.matricule}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
                                                {searchResult.type} {searchResult.filiere}
                                            </span>
                                            <span className="text-blue-300/70 text-sm">
                                                {searchResult.type === 'L1' ? 'Étudiant en Licence 1' : 'Étudiant en Licence 2'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleReset}
                                        className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-300 hover:text-blue-200 transition-colors"
                                    >
                                        <ChevronDown className="h-5 w-5 transform rotate-180" />
                                    </button>
                                </div>
                            </div>

                            {/* Détails de l'étudiant */}
                            <div className="p-6">
                                {/* Étudiant */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <User className="h-5 w-5 text-blue-400" />
                                        Étudiant
                                    </h3>
                                    <div className="bg-slate-800/30 rounded-xl p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-blue-200/70 text-sm mb-1">Matricule</p>
                                                    <p className="text-white font-mono text-lg font-semibold">
                                                        {searchResult.etudiant?.matricule}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-blue-200/70 text-sm mb-1">Nom complet</p>
                                                    <p className="text-white text-lg font-semibold">
                                                        {searchResult.etudiant?.nom}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                {searchResult.etudiant?.email && (
                                                    <div>
                                                        <p className="text-blue-200/70 text-sm mb-1">Email</p>
                                                        <a 
                                                            href={`mailto:${searchResult.etudiant.email}`}
                                                            className="text-white hover:text-blue-300 transition-colors flex items-center gap-2"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                            {searchResult.etudiant.email}
                                                        </a>
                                                    </div>
                                                )}
                                                {searchResult.etudiant?.telephone && (
                                                    <div>
                                                        <p className="text-blue-200/70 text-sm mb-1">Téléphone</p>
                                                        <a 
                                                            href={`tel:${searchResult.etudiant.telephone}`}
                                                            className="text-white hover:text-blue-300 transition-colors flex items-center gap-2"
                                                        >
                                                            <Phone className="h-4 w-4" />
                                                            {searchResult.etudiant.telephone}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Parrain (pour L1) */}
                                {searchResult.type === 'L1' && searchResult.parrain && (
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <UserCheck className="h-5 w-5 text-green-400" />
                                                Parrain assigné
                                            </h3>
                                            <span className="px-3 py-1 bg-green-900/30 rounded-full text-xs text-green-200">
                                                L2 • {searchResult.filiere}
                                            </span>
                                        </div>
                                        <div className="bg-green-900/10 border border-green-400/20 rounded-xl p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-green-200/70 text-sm mb-1">Matricule</p>
                                                        <p className="text-white font-mono text-lg font-semibold">
                                                            {searchResult.parrain.matricule}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-green-200/70 text-sm mb-1">Nom complet</p>
                                                        <p className="text-white text-lg font-semibold">
                                                            {searchResult.parrain.nom}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    {searchResult.parrain.email && (
                                                        <div>
                                                            <p className="text-green-200/70 text-sm mb-1">Email</p>
                                                            <a 
                                                                href={`mailto:${searchResult.parrain.email}`}
                                                                className="text-white hover:text-green-300 transition-colors flex items-center gap-2"
                                                            >
                                                                <Mail className="h-4 w-4" />
                                                                {searchResult.parrain.email}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {searchResult.parrain.telephone && (
                                                        <div>
                                                            <p className="text-green-200/70 text-sm mb-1">Téléphone</p>
                                                            <a 
                                                                href={`tel:${searchResult.parrain.telephone}`}
                                                                className="text-white hover:text-green-300 transition-colors flex items-center gap-2"
                                                            >
                                                                <Phone className="h-4 w-4" />
                                                                {searchResult.parrain.telephone}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Filleuls (pour L2) */}
                                {searchResult.type === 'L2' && searchResult.filleuls && searchResult.filleuls.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <Users className="h-5 w-5 text-purple-400" />
                                                Filleuls ({searchResult.filleuls.length})
                                            </h3>
                                            <span className="px-3 py-1 bg-purple-900/30 rounded-full text-xs text-purple-200">
                                                L1 • {searchResult.filiere}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {searchResult.filleuls.map((filleul, index) => (
                                                <div 
                                                    key={filleul.id} 
                                                    className="bg-purple-900/10 border border-purple-400/20 rounded-xl p-4"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-purple-300 text-sm font-medium">Filleul #{index + 1}</span>
                                                        <span className="text-purple-200/70 text-xs">
                                                            {searchResult.filiere}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-purple-200/70 text-xs mb-1">Matricule</p>
                                                            <p className="text-white font-mono text-sm font-semibold">
                                                                {filleul.matricule}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-purple-200/70 text-xs mb-1">Nom</p>
                                                            <p className="text-white text-sm font-semibold">
                                                                {filleul.nom}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {filleul.email && (
                                                                <div>
                                                                    <p className="text-purple-200/70 text-xs mb-1">Email</p>
                                                                    <a 
                                                                        href={`mailto:${filleul.email}`}
                                                                        className="text-white hover:text-purple-300 transition-colors text-xs flex items-center gap-1"
                                                                    >
                                                                        <Mail className="h-3 w-3" />
                                                                        <span className="truncate">{filleul.email}</span>
                                                                    </a>
                                                                </div>
                                                            )}
                                                            {filleul.telephone && (
                                                                <div>
                                                                    <p className="text-purple-200/70 text-xs mb-1">Téléphone</p>
                                                                    <a 
                                                                        href={`tel:${filleul.telephone}`}
                                                                        className="text-white hover:text-purple-300 transition-colors text-xs flex items-center gap-1"
                                                                    >
                                                                        <Phone className="h-3 w-3" />
                                                                        {filleul.telephone}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Message si pas de parrain/filleuls */}
                                {(searchResult.type === 'L1' && !searchResult.parrain) && (
                                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-xl">
                                        <p className="text-yellow-300 text-center">
                                            Aucun parrain assigné pour cet étudiant L1
                                        </p>
                                    </div>
                                )}

                                {(searchResult.type === 'L2' && (!searchResult.filleuls || searchResult.filleuls.length === 0)) && (
                                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-xl">
                                        <p className="text-yellow-300 text-center">
                                            Aucun filleul assigné pour cet étudiant L2
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-blue-950/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 flex items-center justify-center">
                                <GraduationCap className="h-10 w-10 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                Recherche par matricule
                            </h3>
                            <p className="text-blue-300/70 mb-4">
                                Entrez un matricule pour voir le parrain (L1) ou les filleuls (L2)
                            </p>
                            <div className="text-sm text-blue-300/50">
                                <p className="mb-1">• Les L1 voient leur parrain L2</p>
                                <p>• Les L2 voient leurs filleuls L1</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Informations - Pleine largeur */}
                <div className="w-full bg-gradient-to-br from-blue-950/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-400" />
                        Comment fonctionne le système de matching
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-400 text-lg font-bold">1</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Lancer le matching</h4>
                                    <p className="text-blue-300/70 text-sm">
                                        Cliquez sur "Lancer le matching" pour associer automatiquement les étudiants L1 avec les L2 de la même filière.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-400 text-lg font-bold">2</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Algorithmes intelligents</h4>
                                    <p className="text-blue-300/70 text-sm">
                                        Le système répartit équitablement les L1 entre les L2 disponibles dans chaque filière.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-400 text-lg font-bold">3</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Recherche par matricule</h4>
                                    <p className="text-blue-300/70 text-sm">
                                        Entrez un matricule pour voir les associations (parrain pour L1, filleuls pour L2).
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-400 text-lg font-bold">4</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Types de résultats</h4>
                                    <p className="text-blue-300/70 text-sm">
                                        Pour les L1 : affichage du parrain assigné.<br/>
                                        Pour les L2 : liste des filleuls.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-400 text-lg font-bold">5</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Mise à jour automatique</h4>
                                    <p className="text-blue-300/70 text-sm">
                                        Les associations sont sauvegardées et peuvent être consultées à tout moment.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-400 text-lg font-bold">6</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Répartition équitable</h4>
                                    <p className="text-blue-300/70 text-sm">
                                        Chaque L2 reçoit environ le même nombre de filleuls pour garantir un accompagnement optimal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistiques (optionnel) */}
                {searchResult && (
                    <div className="w-full bg-gradient-to-br from-blue-950/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-400" />
                            Résumé de l'association
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-800/30 rounded-xl p-4">
                                <p className="text-blue-200/70 text-sm mb-1">Type d'étudiant</p>
                                <p className="text-white text-lg font-semibold">
                                    {searchResult.type === 'L1' ? 'Licence 1' : 'Licence 2'}
                                </p>
                            </div>
                            <div className="bg-slate-800/30 rounded-xl p-4">
                                <p className="text-blue-200/70 text-sm mb-1">Filière</p>
                                <p className="text-white text-lg font-semibold">
                                    {searchResult.filiere}
                                </p>
                            </div>
                            <div className="bg-slate-800/30 rounded-xl p-4">
                                <p className="text-blue-200/70 text-sm mb-1">
                                    {searchResult.type === 'L1' ? 'Parrain assigné' : 'Nombre de filleuls'}
                                </p>
                                <p className="text-white text-lg font-semibold">
                                    {searchResult.type === 'L1' 
                                        ? (searchResult.parrain ? '✅ Oui' : '❌ Non') 
                                        : searchResult.filleuls?.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MatchEtudiants;