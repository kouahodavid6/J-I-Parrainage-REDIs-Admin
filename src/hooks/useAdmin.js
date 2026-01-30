import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service'
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

export const useLogin = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            if (data.success && data.data) {
                const { token, ...adminData } = data.data;
                
                // Stocker le token
                if (token) {
                    localStorage.setItem('admin_token', token);
                }
                
                // Stocker les données admin
                localStorage.setItem('admin_data', JSON.stringify(adminData));
                
                // Mettre en cache React Query
                queryClient.setQueryData(['adminProfile'], adminData);
                
                toast.success(data.message || 'Connexion réussie !');
            }
        },
        onError: (error) => {
            toast.error(error.message || "Erreur de connexion");
        }
    });
    
    return {
        login: mutation.mutateAsync,
        isLoggingIn: mutation.isPending,
        loginError: mutation.error
    };
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    
    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        queryClient.removeQueries();
        queryClient.clear();
        window.location.href = '/login';
    };
    
    return { logout };
};

export const useAdminProfile = () => {
    return useQuery({
        queryKey: ['adminProfile'],
        queryFn: async () => {
            const adminData = localStorage.getItem('admin_data');
            if (!adminData) {
                return null;
            }
            
            try {
                const parsedData = JSON.parse(adminData);
                return parsedData;
            } catch (error) {
                console.error('Erreur parsing admin data:', error);
                return null;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
};

export const useAuth = () => {
    const { data: admin, isLoading } = useAdminProfile();
    const token = localStorage.getItem('admin_token');
    
    return {
        isAuthenticated: !!token && !!admin,
        admin,
        isLoading: isLoading && !!token,
        hasToken: !!token
    };
};

export const useUpdateInfo = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: adminService.updateInfo,
        onSuccess: (data) => {
            if (data.success && data.data) {
                // Mettre à jour localStorage
                localStorage.setItem('admin_data', JSON.stringify(data.data));
                
                // Mettre à jour React Query cache
                queryClient.setQueryData(['adminProfile'], data.data);
                
                toast.success(data.message || 'Informations mises à jour avec succès');
            } else {
                toast.error(data.message || 'Erreur lors de la mise à jour');
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Erreur lors de la mise à jour des informations');
        }
    });
    
    return {
        updateInfo: mutation.mutateAsync,
        isUpdatingInfo: mutation.isPending,
        updateInfoError: mutation.error
    };
};

export const useChangePassword = () => {
    const mutation = useMutation({
        mutationFn: adminService.changePassword,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || 'Mot de passe changé avec succès');
            } else {
                toast.error(data.message || 'Erreur lors du changement de mot de passe');
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Erreur lors du changement de mot de passe');
        }
    });
    
    return {
        changePassword: mutation.mutateAsync,
        isChangingPassword: mutation.isPending,
        changePasswordError: mutation.error
    };
};