import { useEffect, useState } from 'react';
import LoadingSpinner from "./LoadingSpinner";

const AuthInitializer = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Nettoyage du localStorage si le token est "undefined"
        const token = localStorage.getItem('admin_token');
        const adminData = localStorage.getItem('admin_data');
        
        if (token === "undefined") {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_data');
        }
        
        if (adminData && adminData === "undefined") {
            localStorage.removeItem('admin_data');
        }
        
        // Marquer comme initialisé
        setIsInitialized(true);
    }, []);

    // Afficher un loader pendant l'initialisation
    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return children;
};

export default AuthInitializer;