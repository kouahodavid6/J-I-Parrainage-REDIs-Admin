// pages/Etudiants/L1GI.js
import { useState, useMemo, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import { 
    Search, 
    Filter, 
    Mail, 
    Phone, 
    Calendar,
    ArrowDownAZ, 
    X, 
    AlertCircle,
    Clock,
    ChevronDown,
    SortAsc,
    User,
    GraduationCap,
    Hash,
    Upload,
    Edit,
    Trash2,
    Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEtudiants } from "../../hooks/useEtudiants";
import ImportEtudiantModal from "../components/ImportEtudiantModal";
import EtudiantModal from "../components/EtudiantModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { toast } from "react-hot-toast";

const L1GI = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [etudiantModalOpen, setEtudiantModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedEtudiant, setSelectedEtudiant] = useState(null);
    const [etudiantToDelete, setEtudiantToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState("alphabetical");
    const itemsPerPage = 12;
    const filterRef = useRef(null);

    const { 
        etudiants, 
        isLoading, 
        error, 
        refetch,
        importerEtudiantsAsync,
        creerEtudiantAsync,
        modifierEtudiantAsync,
        supprimerEtudiantAsync,
        isImporting,
        isCreating,
        isUpdating,
        isDeleting
    } = useEtudiants('L1', 'GI');

    // Charger les préférences depuis localStorage
    useEffect(() => {
        const savedSearchTerm = localStorage.getItem('l1GI_searchTerm');
        const savedSortOption = localStorage.getItem('l1GI_sortOption');
        
        if (savedSearchTerm !== null) setSearchTerm(savedSearchTerm);
        if (savedSortOption !== null) setSortOption(savedSortOption);
    }, []);

    // Sauvegarder dans localStorage
    useEffect(() => {
        localStorage.setItem('l1GI_searchTerm', searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        localStorage.setItem('l1GI_sortOption', sortOption);
    }, [sortOption]);

    // Options de tri
    const sortOptions = [
        { id: 'alphabetical', label: 'A à Z', icon: SortAsc },
        { id: 'alphabetical-desc', label: 'Z à A', icon: ArrowDownAZ },
        { id: 'newest', label: 'Plus récents', icon: Clock },
        { id: 'oldest', label: 'Plus anciens', icon: Calendar },
    ];

    const getActiveIcon = () => {
        const option = sortOptions.find(opt => opt.id === sortOption);
        return option ? option.icon : Filter;
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleSortChange = (optionId) => {
        setSortOption(optionId);
        setIsFilterOpen(false);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSortOption('alphabetical');
        localStorage.removeItem('l1GI_searchTerm');
        localStorage.removeItem('l1GI_sortOption');
        setCurrentPage(1);
        toast.success('Filtres réinitialisés');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtrer et trier
    const filteredAndSortedEtudiants = useMemo(() => {
        let result = [...etudiants];

        // Filtrage
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(etudiant =>
                etudiant.nom?.toLowerCase().includes(searchLower) ||
                etudiant.matricule?.toLowerCase().includes(searchLower) ||
                etudiant.email?.toLowerCase().includes(searchLower) ||
                etudiant.telephone?.includes(searchTerm)
            );
        }

        // Tri selon l'option sélectionnée
        switch (sortOption) {
            case 'alphabetical':
                result.sort((a, b) => (a.nom || '').localeCompare(b.nom || ''));
                break;
            case 'alphabetical-desc':
                result.sort((a, b) => (b.nom || '').localeCompare(a.nom || ''));
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            default:
                result.sort((a, b) => (a.nom || '').localeCompare(b.nom || ''));
        }
        return result;
    }, [etudiants, searchTerm, sortOption]);

    useEffect(() => {
        const maxPage = Math.ceil(filteredAndSortedEtudiants.length / itemsPerPage);
        if (currentPage > maxPage && maxPage > 0) setCurrentPage(maxPage);
        if (filteredAndSortedEtudiants.length === 0) setCurrentPage(1);
    }, [filteredAndSortedEtudiants.length, currentPage]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedEtudiants.length / itemsPerPage);
    const paginatedEtudiants = filteredAndSortedEtudiants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handlers pour les modals
    const handleImportClick = () => {
        setImportModalOpen(true);
    };

    const handleAddEtudiantClick = () => {
        setSelectedEtudiant(null);
        setEtudiantModalOpen(true);
    };

    const handleEditEtudiant = (etudiant) => {
        setSelectedEtudiant(etudiant);
        setEtudiantModalOpen(true);
    };

    const handleDeleteEtudiant = (etudiant) => {
        setEtudiantToDelete(etudiant);
        setDeleteModalOpen(true);
    };

    // Import
    const handleImport = async (formData, options) => {
        try {
            const data = await importerEtudiantsAsync(formData);
            toast.success(`Importation réussie de ${data.length || 0} étudiants`);
            refetch();
            if (options?.onSuccess) options.onSuccess(data);
        } catch (error) {
            toast.error(error.message || 'Erreur lors de l\'importation');
            if (options?.onError) options.onError(error);
        }
    };

    // CRUD Étudiant
    const handleCreerEtudiant = async (variables, options) => {
        try {
            const data = await creerEtudiantAsync(variables);
            toast.success('Étudiant créé avec succès');
            refetch();
            if (options?.onSuccess) options.onSuccess(data);
        } catch (error) {
            toast.error(error.message || 'Erreur lors de la création');
            if (options?.onError) options.onError(error);
        }
    };

    const handleModifierEtudiant = async (variables, options) => {
        try {
            const data = await modifierEtudiantAsync(variables);
            toast.success('Étudiant modifié avec succès');
            refetch();
            if (options?.onSuccess) options.onSuccess(data);
        } catch (error) {
            toast.error(error.message || 'Erreur lors de la modification');
            if (options?.onError) options.onError(error);
        }
    };

    const handleSupprimerEtudiant = async () => {
        if (!etudiantToDelete) return;

        try {
            await supprimerEtudiantAsync(etudiantToDelete.id);
            toast.success('Étudiant supprimé avec succès');
            setDeleteModalOpen(false);
            setEtudiantToDelete(null);
            refetch();
        } catch (error) {
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    };

    const stats = useMemo(() => {
        const totalEtudiants = filteredAndSortedEtudiants.length;
        const avecEmail = filteredAndSortedEtudiants.filter(e => e.email).length;
        const avecTel = filteredAndSortedEtudiants.filter(e => e.telephone).length;
        
        return { 
            totalEtudiants, 
            avecEmail, 
            avecTel 
        };
    }, [filteredAndSortedEtudiants]);

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader 
                    title="L1 GI"
                    subtitle="Gestion des étudiants Licence 1 Génie Informatique"
                />
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-red-400" />
                        <div>
                            <p className="text-red-300 font-medium">Erreur de chargement</p>
                            <p className="text-red-400/80 text-sm mt-1">{error.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header avec boutons */}
                <PageHeader 
                    title="L1 GI"
                    subtitle="Gestion des étudiants en Licence 1 Génie Informatique"
                    buttonText="Importer étudiants"
                    onButtonClick={handleImportClick}
                    buttonIcon={Upload}
                    buttonVariant="blue"
                    secondaryButtonText="Ajouter étudiant"
                    onSecondaryButtonClick={handleAddEtudiantClick}
                    secondaryButtonIcon={Plus}
                />

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-blue-400/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-200/60 text-sm">Total Étudiants</p>
                                <div className="text-white text-2xl font-bold mt-1">
                                    {isLoading ? (
                                        <div className="h-8 w-20 bg-slate-800 rounded-lg animate-pulse"></div>
                                    ) : (
                                        stats.totalEtudiants
                                    )}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/10 border border-blue-400/30">
                                <User className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-blue-400/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-200/60 text-sm">Avec Email</p>
                                <div className="text-white text-2xl font-bold mt-1">
                                    {isLoading ? (
                                        <div className="h-8 w-20 bg-slate-800 rounded-lg animate-pulse"></div>
                                    ) : (
                                        stats.avecEmail
                                    )}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-600/20 to-emerald-500/10 border border-green-400/30">
                                <Mail className="h-6 w-6 text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-blue-400/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-200/60 text-sm">Avec Téléphone</p>
                                <div className="text-white text-2xl font-bold mt-1">
                                    {isLoading ? (
                                        <div className="h-8 w-20 bg-slate-800 rounded-lg animate-pulse"></div>
                                    ) : (
                                        stats.avecTel
                                    )}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-500/10 border border-purple-400/30">
                                <Phone className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indicateur de tri */}
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-blue-400/20 p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                                    <GraduationCap className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Liste des étudiants L1 GI</h3>
                                    <p className="text-blue-200/60 text-sm">
                                        {searchTerm ? (
                                            <>
                                                {filteredAndSortedEtudiants.length} résultat{filteredAndSortedEtudiants.length !== 1 ? 's' : ''} sur {etudiants.length}
                                            </>
                                        ) : (
                                            `${etudiants.length} étudiant${etudiants.length !== 1 ? 's' : ''} en L1 GI`
                                        )}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-blue-400/20">
                                <span className="text-xs text-blue-300/70">Trié par :</span>
                                <div className="flex items-center gap-1.5">
                                    {(() => {
                                        const Icon = getActiveIcon();
                                        return <Icon className="h-3 w-3 text-blue-400" />;
                                    })()}
                                    <span className="text-xs font-medium text-white">
                                        {sortOptions.find(opt => opt.id === sortOption)?.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contrôles de recherche et filtre */}
                <motion.div 
                    className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-blue-400/20 relative z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Barre de recherche */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/50" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher un étudiant par nom, matricule, email ou téléphone..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 bg-slate-800/50 border border-blue-400/30 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => handleSearchChange("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-blue-500/10 text-blue-300 hover:text-blue-200 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Menu déroulant de tri - Z-index augmenté */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border border-blue-400/30 rounded-xl text-white hover:border-blue-400 transition-colors min-w-[180px] w-full z-30"
                            >
                                <Filter className="h-5 w-5 text-blue-400/50" />
                                <span className="flex-1 text-left">
                                    {sortOptions.find(opt => opt.id === sortOption)?.label || 'Trier par'}
                                </span>
                                <ChevronDown className={`h-4 w-4 text-blue-400/50 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown menu avec z-index très élevé */}
                            <AnimatePresence>
                                {isFilterOpen && (
                                    <motion.div
                                        className="absolute top-full right-0 mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-blue-400/20 rounded-xl shadow-2xl shadow-blue-500/20 z-[9999] overflow-hidden"
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ zIndex: 9999 }}
                                    >
                                        {sortOptions.map((option) => {
                                            const Icon = option.icon;
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleSortChange(option.id)}
                                                    className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                                                        sortOption === option.id
                                                            ? 'bg-blue-500/20 text-blue-400 border-l-4 border-blue-500'
                                                            : 'text-blue-200 hover:bg-blue-500/10'
                                                    }`}
                                                >
                                                    <Icon className={`h-4 w-4 flex-shrink-0 ${option.id === 'alphabetical-desc' ? 'rotate-180' : ''}`} />
                                                    <span className="flex-1">{option.label}</span>
                                                    {sortOption === option.id && (
                                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Grille de cartes avec actions */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-blue-400/20">
                                <div className="animate-pulse space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-800"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-800 rounded"></div>
                                        <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : paginatedEtudiants.length === 0 ? (
                    <motion.div 
                        className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-12 border border-blue-400/20 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div 
                            className="w-20 h-20 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-6"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, type: "spring" }}
                        >
                            <GraduationCap className="h-8 w-8 text-blue-400" />
                        </motion.div>
                        {searchTerm ? (
                            <>
                                <motion.h3 
                                    className="text-white text-xl font-bold mb-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Aucun résultat trouvé
                                </motion.h3>
                                <motion.p 
                                    className="text-blue-200/60 mb-8 max-w-md mx-auto text-sm leading-relaxed"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Aucun étudiant ne correspond à votre recherche "<span className="text-blue-400 font-semibold">{searchTerm}</span>".
                                </motion.p>
                                <motion.button
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 hover:bg-blue-500/10 border border-blue-400/20 text-blue-200 hover:text-blue-100 rounded-xl transition-all duration-300 hover:scale-105 font-medium group"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    Réinitialiser les filtres
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <motion.h3 
                                    className="text-white text-xl font-bold mb-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Aucun étudiant enregistré
                                </motion.h3>
                                <motion.p 
                                    className="text-blue-200/60 mb-8 max-w-md mx-auto text-sm leading-relaxed"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Aucun étudiant n'a été importé en L1 GI. Importez un fichier Excel pour commencer.
                                </motion.p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <motion.button
                                        onClick={handleImportClick}
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl transition-all duration-300 hover:scale-105 font-medium group"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Upload className="h-5 w-5" />
                                        Importer des étudiants
                                    </motion.button>
                                    <motion.button
                                        onClick={handleAddEtudiantClick}
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 hover:bg-blue-500/10 border border-blue-400/20 text-blue-200 hover:text-blue-100 rounded-xl transition-all duration-300 hover:scale-105 font-medium group"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Plus className="h-5 w-5" />
                                        Ajouter un étudiant
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </motion.div>
                ) : (
                    <>
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            key={sortOption + searchTerm + currentPage}
                        >
                            {paginatedEtudiants.map((etudiant) => (
                                <motion.div 
                                    key={etudiant.id} 
                                    className="group bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.5,
                                                ease: "easeOut"
                                            }
                                        }
                                    }}
                                    layout
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                                                {etudiant.nom?.charAt(0).toUpperCase() || "E"}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-semibold truncate">
                                                {etudiant.nom}
                                            </h3>
                                            <p className="text-blue-300 text-xs mt-1 flex items-center gap-1">
                                                <Hash className="h-3 w-3" />
                                                {etudiant.matricule}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-5">
                                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/30">
                                            <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                            <p className="text-blue-200 text-sm truncate">
                                                {etudiant.email || <span className="text-blue-300/50">Non renseigné</span>}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/30">
                                            <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                            <p className="text-blue-200 text-sm">
                                                {etudiant.telephone || <span className="text-blue-300/50">Non renseigné</span>}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Section avec date et boutons en bas */}
                                    <div className="pt-4 border-t border-blue-400/20">
                                        <div className="flex items-center justify-between">
                                            {/* Date */}
                                            <div className="text-xs text-blue-300/70 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Ajouté le {new Date(etudiant.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                            
                                            {/* Boutons d'actions */}
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <motion.button
                                                    onClick={() => handleEditEtudiant(etudiant)}
                                                    className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                    title="Modifier"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDeleteEtudiant(etudiant)}
                                                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                    title="Supprimer"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {filteredAndSortedEtudiants.length > itemsPerPage && (
                            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-blue-400/20">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-blue-300/70">
                                        Page {currentPage} sur {totalPages} •{" "}
                                        {filteredAndSortedEtudiants.length} étudiants
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-xl border border-blue-400/20 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
                                        >
                                            <ChevronDown className="h-4 w-4 rotate-90" />
                                            Précédent
                                        </button>
                                        
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(totalPages, 3) }).map((_, idx) => {
                                                let pageNum;
                                                if (totalPages <= 3) {
                                                    pageNum = idx + 1;
                                                } else if (currentPage === 1) {
                                                    pageNum = idx + 1;
                                                } else if (currentPage === totalPages) {
                                                    pageNum = totalPages - 2 + idx;
                                                } else {
                                                    pageNum = currentPage - 1 + idx;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`w-10 h-10 rounded-xl border transition-all hover:scale-[1.05] active:scale-95 ${
                                                            currentPage === pageNum
                                                                ? "bg-gradient-to-r from-blue-600 to-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                                                : "border-blue-400/20 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400/30"
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-xl border border-blue-400/20 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
                                        >
                                            Suivant
                                            <ChevronDown className="h-4 w-4 -rotate-90" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal d'import */}
            <ImportEtudiantModal
                isOpen={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onImport={handleImport}
                isProcessing={isImporting}
                niveau="L1"
                filiere="GI"
                titre="Importer les étudiants L1 GI"
            />

            {/* Modal d'ajout/modification étudiant */}
            <EtudiantModal
                isOpen={etudiantModalOpen}
                onClose={() => setEtudiantModalOpen(false)}
                etudiantToEdit={selectedEtudiant}
                onSuccess={() => {
                    setEtudiantModalOpen(false);
                    setSelectedEtudiant(null);
                }}
                niveau="L1"
                filiere="GI"
                onCreerEtudiant={handleCreerEtudiant}
                onModifierEtudiant={handleModifierEtudiant}
                isProcessing={isCreating || isUpdating}
            />

            {/* Modal de suppression */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={handleSupprimerEtudiant}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setEtudiantToDelete(null);
                }}
                entityName={etudiantToDelete ? `l'étudiant ${etudiantToDelete.nom}` : "cet étudiant"}
                isDeleting={isDeleting}
            />
        </>
    );
};

export default L1GI;