// components/PageHeader/PageHeader.jsx
import { Plus } from 'lucide-react';

const PageHeader = ({ 
    title, 
    subtitle, 
    buttonText, 
    onButtonClick,
    buttonIcon = Plus
}) => {
    const IconComponent = buttonIcon;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Section titre */}
            <div className="flex-1 min-w-0">
                <h1 className="text-white text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 truncate">
                    {title}
                </h1>
                <p className="text-gray-400 text-sm sm:text-base line-clamp-2">
                    {subtitle}
                </p>
            </div>
            
            {/* Bouton - s'adapte selon l'écran */}
            {buttonText && (
                <div className="flex-shrink-0">
                    <button 
                        onClick={onButtonClick}
                        className="
                            w-full sm:w-auto
                            px-5 sm:px-6 
                            py-3 sm:py-3
                            rounded-lg font-medium 
                            bg-blue-600 hover:bg-blue-500
                            text-white
                            transition-colors duration-200
                            flex items-center justify-center gap-2
                        "
                    >
                        <IconComponent 
                            size={18} 
                            className="sm:size-4 flex-shrink-0" 
                        />
                        <span className="whitespace-nowrap text-sm sm:text-base font-medium">
                            {buttonText}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PageHeader;