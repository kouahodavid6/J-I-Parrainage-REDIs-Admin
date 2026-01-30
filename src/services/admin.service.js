import axiosInstance from "../api/axiosInstance";

const updateInfo = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/update/info', formData, {
            timeout: 30000
        });
        
        if (!response.data.success) {
            throw new Error(response.data.message || "Échec de la mise à jour");
        }
        
        return response.data;
    } catch (error) {
        let errorMessage = "Erreur lors de la mise à jour des informations";
        
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.status === 400) {
            errorMessage = "Données invalides";
        } else if (error.response?.status === 401) {
            errorMessage = "Non autorisé";
        } else if (error.response?.status === 500) {
            errorMessage = "Erreur serveur, veuillez réessayer";
        } else if (error.request) {
            errorMessage = "Pas de réponse du serveur. Vérifiez votre connexion";
        }
        
        throw new Error(errorMessage);
    }
};

const changePassword = async (passwordData) => {
    try {
        const response = await axiosInstance.post('/api/change/password', passwordData, {
            timeout: 15000
        });
        
        if (!response.data.success) {
            throw new Error(response.data.message || "Échec du changement de mot de passe");
        }
        
        return response.data;
    } catch (error) {
        let errorMessage = "Erreur lors du changement de mot de passe";
        
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.status === 401) {
            errorMessage = "Ancien mot de passe incorrect";
        } else if (error.response?.status === 400) {
            errorMessage = "Données invalides";
        }
        
        throw new Error(errorMessage);
    }
};

export const adminService = {
    updateInfo,
    changePassword
};