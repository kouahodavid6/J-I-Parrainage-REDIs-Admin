// services/system.service.js
import axiosInstance from "../api/axiosInstance";

// Réinitialiser la plateforme
const reinitialiserPlateforme = async (password) => {
    try {
        const response = await axiosInstance.post('/api/reinitialiser', {
            password
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
    }
};

export const systemService = {
    reinitialiserPlateforme
};