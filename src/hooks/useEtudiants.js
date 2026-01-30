import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { etudiantsService } from '../services/etudiants.service';

// Clés de query pour TanStack Query
export const etudiantKeys = {
    all: ['etudiants'],
    lists: () => [...etudiantKeys.all, 'list'],
    list: (niveau, filiere, filters) => [...etudiantKeys.lists(), niveau, filiere, { filters }],
    details: () => [...etudiantKeys.all, 'detail'],
    detail: (id) => [...etudiantKeys.details(), id],
};

export const useEtudiants = (niveau, filiere) => {
    const queryClient = useQueryClient();

    // Déterminer la fonction de service basée sur niveau et filière
    const getServiceFunction = () => {
        if (niveau === 'L1' && filiere === 'GI') return etudiantsService.getL1GI;
        if (niveau === 'L1' && filiere === 'MIAGE') return etudiantsService.getL1MIAGE;
        if (niveau === 'L2' && filiere === 'GI') return etudiantsService.getL2GI;
        if (niveau === 'L2' && filiere === 'MIAGE') return etudiantsService.getL2MIAGE;
        return () => Promise.resolve([]);
    };

    const importServiceFunction = () => {
        if (niveau === 'L1' && filiere === 'GI') return etudiantsService.importerL1GI;
        if (niveau === 'L1' && filiere === 'MIAGE') return etudiantsService.importerL1MIAGE;
        if (niveau === 'L2' && filiere === 'GI') return etudiantsService.importerL2GI;
        if (niveau === 'L2' && filiere === 'MIAGE') return etudiantsService.importerL2MIAGE;
        return () => Promise.resolve({});
    };

    // QUERY: Récupérer les étudiants
    const etudiantsQuery = useQuery({
        queryKey: etudiantKeys.list(niveau, filiere),
        queryFn: getServiceFunction(),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
    });

    // MUTATION: Importer des étudiants
    const importerEtudiantsMutation = useMutation({
        mutationFn: importServiceFunction(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: etudiantKeys.list(niveau, filiere) });
            return data;
        },
    });

    // MUTATION: Créer un étudiant
    const creerEtudiantMutation = useMutation({
        mutationFn: etudiantsService.creerEtudiant,
        onSuccess: (newEtudiant, variables) => {
            // Invalider le cache pour rafraîchir la liste
            queryClient.invalidateQueries({ queryKey: etudiantKeys.list(variables.niveau, variables.filiere) });
        },
    });

    // MUTATION: Modifier un étudiant
    const modifierEtudiantMutation = useMutation({
        mutationFn: etudiantsService.modifierEtudiant,
        onSuccess: (updatedEtudiant, variables) => {
            queryClient.invalidateQueries({ queryKey: etudiantKeys.list(niveau, filiere) });
            queryClient.invalidateQueries({ queryKey: etudiantKeys.detail(variables.id) });
        },
    });

    // MUTATION: Supprimer un étudiant
    const supprimerEtudiantMutation = useMutation({
        mutationFn: etudiantsService.supprimerEtudiant,
        onSuccess: (_, id) => {
            queryClient.setQueryData(etudiantKeys.list(niveau, filiere), (old = []) => {
                return old.filter(etudiant => etudiant.id !== id);
            });
            queryClient.invalidateQueries({ queryKey: etudiantKeys.list(niveau, filiere) });
        },
    });

    return {
        // Données et état
        etudiants: etudiantsQuery.data || [],
        isLoading: etudiantsQuery.isLoading,
        error: etudiantsQuery.error,
        refetch: etudiantsQuery.refetch,

        // Import
        importerEtudiants: importerEtudiantsMutation.mutate,
        importerEtudiantsAsync: importerEtudiantsMutation.mutateAsync,
        isImporting: importerEtudiantsMutation.isPending,
        importError: importerEtudiantsMutation.error,

        // CRUD Étudiant
        creerEtudiant: creerEtudiantMutation.mutate,
        creerEtudiantAsync: creerEtudiantMutation.mutateAsync,
        isCreating: creerEtudiantMutation.isPending,
        createError: creerEtudiantMutation.error,

        modifierEtudiant: modifierEtudiantMutation.mutate,
        modifierEtudiantAsync: modifierEtudiantMutation.mutateAsync,
        isUpdating: modifierEtudiantMutation.isPending,
        updateError: modifierEtudiantMutation.error,

        supprimerEtudiant: supprimerEtudiantMutation.mutate,
        supprimerEtudiantAsync: supprimerEtudiantMutation.mutateAsync,
        isDeleting: supprimerEtudiantMutation.isPending,
        deleteError: supprimerEtudiantMutation.error,

        // États combinés
        isProcessing: importerEtudiantsMutation.isPending || 
                        creerEtudiantMutation.isPending || 
                        modifierEtudiantMutation.isPending || 
                        supprimerEtudiantMutation.isPending,
    };
};