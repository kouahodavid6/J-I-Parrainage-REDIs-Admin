// hooks/useSystem.js
import { useMutation } from '@tanstack/react-query';
import { systemService } from '../services/system.service';

export const systemKeys = {
    all: ['system'],
    reinitialisation: () => [...systemKeys.all, 'reinitialisation'],
};

export const useSystem = () => {
    // MUTATION: Réinitialiser la plateforme
    const reinitialiserMutation = useMutation({
        mutationFn: systemService.reinitialiserPlateforme,
        onSuccess: () => {
            // Ici vous pourriez invalider d'autres queries si nécessaire
            console.log('Réinitialisation réussie');
        },
        onError: (error) => {
            console.error('Erreur de réinitialisation:', error);
        }
    });

    return {
        // Réinitialisation
        reinitialiserPlateforme: reinitialiserMutation.mutate,
        reinitialiserPlateformeAsync: reinitialiserMutation.mutateAsync,
        isReinitialising: reinitialiserMutation.isPending,
        reinitialisationError: reinitialiserMutation.error,
        
        // États combinés
        isProcessing: reinitialiserMutation.isPending,
    };
};