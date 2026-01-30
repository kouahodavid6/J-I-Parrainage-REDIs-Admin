import axiosInstance from "../api/axiosInstance";

// Ajouter un sous-admin
const createSousAdmin = async (sousAdminData) => {
    try {
        const response = await axiosInstance.post("/api/ajout/sous/admin", sousAdminData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de l'ajout du sous-admin");
    }
}

// Récupérer la liste des sous-admins
const getSousAdmins = async () => {
    try {
        const response = await axiosInstance.get("/api/liste/admin"); // CORRIGÉ
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération des sous-admins");
    }
}

// Récupérer un sous-admin par ID
const getSousAdminById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/admin/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération du sous-admin");
    }
}

// Supprimer un sous-admin
const deleteSousAdmin = async (id) => {
    try {
        const response = await axiosInstance.post(`/api/delete/admin/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression du sous-admin");
    }
}

export const sousAdminsService = {
    createSousAdmin,
    getSousAdmins,
    getSousAdminById,
    deleteSousAdmin
}