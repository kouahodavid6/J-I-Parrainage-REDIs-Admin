// pages/Etudiants/Dashboard.js
import { useState } from 'react';
import { GraduationCap, Users, BookOpen, Plus, RefreshCw } from 'lucide-react';
import PageHeader from "../components/PageHeader";
import StatCard from "./components/StatCard";
import EtudiantModal from "../components/EtudiantModal";
import ConfirmationModal from "../components/ConfirmationModal";
import PasswordModal from "./components/PasswordModal";
import { useEtudiants } from '../../hooks/useEtudiants';
import { useSystem } from '../../hooks/useSystem';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [isEtudiantModalOpen, setIsEtudiantModalOpen] = useState(false);
    const [isReinitModalOpen, setIsReinitModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedClasse, setSelectedClasse] = useState(null);

    // Utilisation des hooks pour chaque classe
    const l1gi = useEtudiants('L1', 'GI');
    const l1miage = useEtudiants('L1', 'MIAGE');
    const l2gi = useEtudiants('L2', 'GI');
    const l2miage = useEtudiants('L2', 'MIAGE');

    // Utilisation du hook système
    const system = useSystem();

    // Calcul des totaux
    const totalEtudiants = 
        l1gi.etudiants.length + 
        l1miage.etudiants.length + 
        l2gi.etudiants.length + 
        l2miage.etudiants.length;

    // Fonction pour ajouter un étudiant avec sélection de classe
    const handleAddEtudiant = (classe = null) => {
        setSelectedClasse(classe);
        setIsEtudiantModalOpen(true);
    };

    // Gestion de la réinitialisation
    const handleOpenReinitModal = () => {
        setIsReinitModalOpen(true);
    };

    const handleConfirmReinit = () => {
        setIsReinitModalOpen(false);
        setIsPasswordModalOpen(true);
    };

    const handlePasswordSubmit = async (password) => {
        try {
            await system.reinitialiserPlateformeAsync(password);
            
            toast.success('Plateforme réinitialisée avec succès !', {
                duration: 5000,
            });
            
            // Recharger toutes les données
            handleRefetchAll();
            
            setIsPasswordModalOpen(false);
            
        } catch (error) {
            toast.error(error.message || 'Mot de passe incorrect');
        }
    };

    // Fonction de création d'étudiant
    const handleCreerEtudiant = async (variables, options) => {
        // Déterminer la classe appropriée pour l'étudiant
        const { niveau, filiere } = variables;
        
        // Sélectionner le bon hook en fonction du niveau et de la filière
        let mutation;
        
        if (niveau === 'L1' && filiere === 'GI') {
            mutation = l1gi.creerEtudiantAsync;
        } else if (niveau === 'L1' && filiere === 'MIAGE') {
            mutation = l1miage.creerEtudiantAsync;
        } else if (niveau === 'L2' && filiere === 'GI') {
            mutation = l2gi.creerEtudiantAsync;
        } else if (niveau === 'L2' && filiere === 'MIAGE') {
            mutation = l2miage.creerEtudiantAsync;
        } else {
            toast.error('Classe non reconnue');
            if (options?.onError) options.onError(new Error('Classe non reconnue'));
            return;
        }

        try {
            // Appeler la mutation appropriée
            await mutation(variables);
            
            toast.success('Étudiant créé avec succès !');
            
            if (options?.onSuccess) options.onSuccess();
            
        } catch (error) {
            console.error('Erreur création étudiant:', error);
            toast.error(error.message || 'Erreur lors de la création');
            if (options?.onError) options.onError(error);
        }
    };

    const handleModifierEtudiant = async (variables, options) => {
        // Logique de modification similaire
        if (options?.onSuccess) options.onSuccess();
    };

    // Gérer le rechargement des données après une action
    const handleRefetchAll = () => {
        l1gi.refetch();
        l1miage.refetch();
        l2gi.refetch();
        l2miage.refetch();
    };

    const handleModalClose = () => {
        setIsEtudiantModalOpen(false);
        setSelectedClasse(null);
    };

    const handleModalSuccess = () => {
        handleModalClose();
        handleRefetchAll();
    };

    return (
        <>
            <div className="space-y-6">
                <PageHeader 
                    title="Tableau de bord"
                    subtitle="Vue d'ensemble globale sur la plateforme"
                    buttonText="Ajouter étudiant"
                    onButtonClick={() => handleAddEtudiant(null)}
                    buttonIcon={Plus}
                    buttonVariant="blue"
                />

                {/* Actions rapides */}
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20">
                    <div className="mb-4">
                        <h2 className="text-white text-xl font-bold">Actions rapides</h2>
                        <p className="text-blue-300/60 text-sm">
                            Actions administratives pour gérer la plateforme
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => handleAddEtudiant(null)}
                            className="w-full p-4 rounded-xl border border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-500/5 transition-all duration-300 text-left group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                                    <Plus className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">Ajouter un étudiant</h3>
                                    <p className="text-blue-300/70 text-sm">
                                        Ajouter un nouvel étudiant dans une classe
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={handleOpenReinitModal}
                            disabled={system.isReinitialising}
                            className="w-full p-4 rounded-xl border border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-500/5 transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center">
                                    <RefreshCw className={`h-5 w-5 ${system.isReinitialising ? 'animate-spin' : ''}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">Réinitialiser la plateforme</h3>
                                    <p className="text-blue-300/70 text-sm">
                                        Cette action est irréversible
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Carte L1 GI - SANS bouton Ajouter */}
                    <StatCard
                        title="L1 Génie Informatique"
                        value={l1gi.etudiants.length.toString()}
                        icon={GraduationCap}
                        iconBgColor="from-blue-600 to-blue-500"
                        subtitle="Étudiants en L1 GI"
                        isLoading={l1gi.isLoading}
                        error={l1gi.error}
                    />
                    
                    {/* Carte L1 MIAGE - SANS bouton Ajouter */}
                    <StatCard
                        title="L1 MIAGE"
                        value={l1miage.etudiants.length.toString()}
                        icon={BookOpen}
                        iconBgColor="from-blue-600 to-blue-500"
                        subtitle="Étudiants en L1 MIAGE"
                        isLoading={l1miage.isLoading}
                        error={l1miage.error}
                    />
                    
                    {/* Carte L2 GI - SANS bouton Ajouter */}
                    <StatCard
                        title="L2 Génie Informatique"
                        value={l2gi.etudiants.length.toString()}
                        icon={GraduationCap}
                        iconBgColor="from-blue-600 to-blue-500"
                        subtitle="Étudiants en L2 GI"
                        isLoading={l2gi.isLoading}
                        error={l2gi.error}
                    />
                    
                    {/* Carte L2 MIAGE - SANS bouton Ajouter */}
                    <StatCard
                        title="L2 MIAGE"
                        value={l2miage.etudiants.length.toString()}
                        icon={BookOpen}
                        iconBgColor="from-blue-600 to-blue-500"
                        subtitle="Étudiants en L2 MIAGE"
                        isLoading={l2miage.isLoading}
                        error={l2miage.error}
                    />
                </div>

                {/* Carte Total Étudiants */}
                <StatCard
                    title="Total Étudiants"
                    value={totalEtudiants.toString()}
                    icon={Users}
                    iconBgColor="from-blue-600 to-blue-500"
                    subtitle="Sur toutes les classes"
                />
            </div>

            {/* Modal d'ajout d'étudiant */}
            <EtudiantModal
                isOpen={isEtudiantModalOpen}
                onClose={handleModalClose}
                etudiantToEdit={null}
                onSuccess={handleModalSuccess}
                niveau={selectedClasse?.niveau || 'L1'}
                filiere={selectedClasse?.filiere || 'GI'}
                onCreerEtudiant={handleCreerEtudiant}
                onModifierEtudiant={handleModifierEtudiant}
                isProcessing={l1gi.isCreating || l1gi.isUpdating}
            />

            {/* Modal de confirmation de réinitialisation */}
            <ConfirmationModal
                isOpen={isReinitModalOpen}
                onConfirm={handleConfirmReinit}
                onCancel={() => setIsReinitModalOpen(false)}
                isProcessing={system.isReinitialising}
                title="Réinitialisation de la plateforme"
                message="Êtes-vous sûr de vouloir réinitialiser la plateforme ?"
                description="Cette action supprimera TOUTES les données (étudiants, classes, etc.) et est IRRÉVERSIBLE. Seul le super administrateur peut effectuer cette action."
                confirmText="Oui, réinitialiser"
                cancelText="Annuler"
                confirmColor="red"
                icon={<RefreshCw className="h-5 w-5 text-red-400" />}
                iconBgColor="bg-red-500/20"
                size="lg"
            />

            {/* Modal de mot de passe */}
            <PasswordModal
                isOpen={isPasswordModalOpen}
                onConfirm={handlePasswordSubmit}
                onCancel={() => setIsPasswordModalOpen(false)}
                isProcessing={system.isReinitialising}
                title="Vérification super admin"
                message="Pour réinitialiser la plateforme, veuillez entrer le mot de passe super admin."
                confirmText="Réinitialiser"
                cancelText="Annuler"
                placeholder="Entrez le mot de passe super admin"
            />
        </>
    );
};

export default Dashboard;