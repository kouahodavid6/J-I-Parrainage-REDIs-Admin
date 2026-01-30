import axiosInstance from "../api/axiosInstance";

// Créer un étudiant
const creerEtudiant = async ({ niveau, filiere, formData }) => {
    try {
        const response = await axiosInstance.post(`/api/etudiant/${niveau}/${filiere}/ajouter`, formData);
        return response.data.etudiant;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'étudiant');
    }
}

// Modifier un étudiant
const modifierEtudiant = async ({ id, formData }) => {
    try {
        const response = await axiosInstance.post(`/api/etudiant/${id}/modifier`, formData);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification de l\'étudiant');
    }
}

// Supprimer un étudiant
const supprimerEtudiant = async (id) => {
    try {
        const response = await axiosInstance.post(`/api/etudiant/${id}/supprimer`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'étudiant');
    }
}

// L1 GI
const importerL1GI = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/enregistrer/l1/gi', formData);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de l'importation L1 GI");
    }
}

const getL1GI = async () => {
    try {
        const response = await axiosInstance.get('/api/liste/l1/gi');
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération L1 GI");
    }
}

// L1 MIAGE
const importerL1MIAGE = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/enregistrer/l1/miage', formData);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de l'importation L1 MIAGE");
    }
}

const getL1MIAGE = async () => {
    try {
        const response = await axiosInstance.get('/api/liste/l1/miage');
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération L1 MIAGE");
    }
}

// L2 GI
const importerL2GI = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/enregistrer/l2/gi', formData);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de l'importation L2 GI");
    }
}

const getL2GI = async () => {
    try {
        const response = await axiosInstance.get('/api/liste/l2/gi');
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération L2 GI");
    }
}

// L2 MIAGE
const importerL2MIAGE = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/enregistrer/l2/miage', formData);
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de l'importation L2 MIAGE");
    }
}

const getL2MIAGE = async () => {
    try {
        const response = await axiosInstance.get('/api/liste/l2/miage');
        return response.data.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération L2 MIAGE");
    }
}

export const etudiantsService = {
    // CRUD Étudiant
    creerEtudiant,
    modifierEtudiant,
    supprimerEtudiant,
    
    // L1 GI
    importerL1GI,
    getL1GI,
    
    // L1 MIAGE
    importerL1MIAGE,
    getL1MIAGE,
    
    // L2 GI
    importerL2GI,
    getL2GI,
    
    // L2 MIAGE
    importerL2MIAGE,
    getL2MIAGE
}