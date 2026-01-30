import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sousAdminsService } from "../services/sousAdmins.service";

export const sousAdminKeys = {
    all: ['sousAdmins'],
    lists: () => [...sousAdminKeys.all, 'list'],
    list: (filters) => [...sousAdminKeys.lists(), { filters }],
    details: () => [...sousAdminKeys.all, 'detail'],
    detail: (id) => [...sousAdminKeys.details(), id],
};

export const useSousAdmins = (filters = {}) => {
    const queryClient = useQueryClient();

    // Requête pour la liste
    const sousAdminsQuery = useQuery({
        queryKey: sousAdminKeys.list(filters),
        queryFn: sousAdminsService.getSousAdmins,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        select: (data) => data.data || [],
    });

    // Hook pour récupérer un sous-admin spécifique
    const useSousAdminById = (id) => {
        return useQuery({
            queryKey: sousAdminKeys.detail(id),
            queryFn: () => sousAdminsService.getSousAdminById(id),
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
            select: (data) => data.data,
        });
    };

    // Mutation pour l'ajout
    const createSousAdminMutation = useMutation({
        mutationFn: (sousAdminData) => sousAdminsService.createSousAdmin(sousAdminData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: sousAdminKeys.lists() });
            return data;
        },
    });

    // Mutation pour la suppression
    const deleteSousAdminMutation = useMutation({
        mutationFn: (id) => sousAdminsService.deleteSousAdmin(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: sousAdminKeys.lists() });
            
            const previousSousAdmins = queryClient.getQueryData(sousAdminKeys.lists());
            
            queryClient.setQueryData(sousAdminKeys.lists(), (old = []) =>
                old.filter(admin => admin.id !== id)
            );
            
            return { previousSousAdmins };
        },
        onError: (err, id, context) => {
            console.error('Erreur suppression sous-admin:', err);
            
            if (context?.previousSousAdmins) {
                queryClient.setQueryData(sousAdminKeys.lists(), context.previousSousAdmins);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: sousAdminKeys.lists() });
        }
    });

    return {
        // Données et état
        sousAdmins: sousAdminsQuery.data || [],
        isLoading: sousAdminsQuery.isLoading,
        isFetching: sousAdminsQuery.isFetching,
        error: sousAdminsQuery.error,
        refetch: sousAdminsQuery.refetch,

        // Récupération par ID
        useSousAdminById,

        // Ajout
        createSousAdmin: createSousAdminMutation.mutate,
        createSousAdminAsync: createSousAdminMutation.mutateAsync,
        isCreating: createSousAdminMutation.isPending,
        createError: createSousAdminMutation.error,

        // Suppression
        deleteSousAdmin: deleteSousAdminMutation.mutate,
        deleteSousAdminAsync: deleteSousAdminMutation.mutateAsync,
        isDeleting: deleteSousAdminMutation.isPending,
        deleteError: deleteSousAdminMutation.error,

        // Utilitaires
        queryClient
    };
};