const LoadingSpinner = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <div className="text-white text-lg">Chargement...</div>
            </div>
        </div>
    );
}

export default LoadingSpinner;