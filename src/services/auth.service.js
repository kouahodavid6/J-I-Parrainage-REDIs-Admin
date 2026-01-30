import axiosInstance from "../api/axiosInstance";

const login = async (credentials) => {
    try {
        const response = await axiosInstance.post('/api/login', credentials);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur de connexion au serveur");
    }
};

export const authService = {
    login
};