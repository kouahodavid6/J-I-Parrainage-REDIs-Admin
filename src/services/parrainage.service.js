// services/parrainage.service.js
import axiosInstance from "../api/axiosInstance";

// Lancer le matching automatique
const lancerMatching = async () => {
    try {
        const response = await axiosInstance.get('/api/matching/run');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du matching');
    }
};

// Voir parrain ou filleuls par matricule
const getParrainageParMatricule = async (matricule) => {
    try {
        const response = await axiosInstance.get(`/api/parrainage/matricule/${matricule}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération');
    }
};

export const parrainageService = {
    lancerMatching,
    getParrainageParMatricule
};