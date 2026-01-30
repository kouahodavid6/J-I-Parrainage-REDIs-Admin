import axios from "axios";
import { API_URL } from "./config";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
    },
    timeout: 10000,
});

// Intercepteur pour ajouter le token automatiquement
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // NE PAS forcer Content-Type pour permettre multipart/form-data
        if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_data");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;