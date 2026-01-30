// hooks/useParrainage.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parrainageService } from '../services/parrainage.service';

export const parrainageKeys = {
    all: ['parrainage'],
    matching: () => [...parrainageKeys.all, 'matching'],
    matricule: (matricule) => [...parrainageKeys.all, 'matricule', matricule],
};

export const useParrainage = () => {
    const queryClient = useQueryClient();

    // MUTATION: Lancer le matching
    const matchingMutation = useMutation({
        mutationFn: parrainageService.lancerMatching,
        onSuccess: () => {
            // Invalider les queries de parrainage
            queryClient.invalidateQueries({ queryKey: parrainageKeys.all });
        },
    });

    // MUTATION: Rechercher par matricule
    const matriculeMutation = useMutation({
        mutationFn: parrainageService.getParrainageParMatricule,
    });

    return {
        // Matching
        lancerMatching: matchingMutation.mutate,
        lancerMatchingAsync: matchingMutation.mutateAsync,
        isMatching: matchingMutation.isPending,
        matchingError: matchingMutation.error,
        matchingSuccess: matchingMutation.isSuccess,

        // Recherche par matricule
        rechercheParMatricule: matriculeMutation.mutate,
        rechercheParMatriculeAsync: matriculeMutation.mutateAsync,
        isRecherche: matriculeMutation.isPending,
        rechercheError: matriculeMutation.error,
        rechercheData: matriculeMutation.data,
        rechercheSuccess: matriculeMutation.isSuccess,

        // États combinés
        isProcessing: matchingMutation.isPending || matriculeMutation.isPending,
    };
};