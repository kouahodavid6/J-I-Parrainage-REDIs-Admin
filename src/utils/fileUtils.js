export const urlToFile = async (url, filename, mimeType) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: mimeType || blob.type });
    } catch (error) {
        console.error('Erreur lors de la conversion URL -> File:', error);
        throw new Error('Impossible de charger le fichier existante');
    }
};