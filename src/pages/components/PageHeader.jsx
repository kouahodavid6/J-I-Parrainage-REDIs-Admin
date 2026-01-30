// components/PageHeader/PageHeader.jsx
import { Plus } from 'lucide-react';

const PageHeader = ({ 
    title, 
    subtitle, 
    buttonText, 
    onButtonClick,
    buttonIcon = Plus,
    buttonVariant = "primary" 
}) => {
    const buttonStyles = {
        primary: "bg-[#ff7a00] hover:bg-[#ff8800] text-white hover:shadow-[#ff7a00]/30",
        secondary: "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white hover:shadow-gray-800/30",
        danger: "bg-red-600 hover:bg-red-700 text-white hover:shadow-red-600/30"
    };

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
                        className={`
                            w-full sm:w-auto
                            px-4 sm:px-6 
                            py-2.5 sm:py-3 
                            rounded-xl font-medium 
                            transition-all duration-300 
                            hover:scale-105 hover:shadow-lg 
                            flex items-center justify-center gap-2
                            ${buttonStyles[buttonVariant]}
                        `}
                    >
                        <IconComponent size={18} className="sm:size-5 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                            {buttonText}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PageHeader;