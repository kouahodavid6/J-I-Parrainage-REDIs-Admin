// components/Toast/AppToaster.jsx
import { Toaster } from "react-hot-toast";
import { 
    CheckCircle, 
    XCircle, 
    Info,
    Loader2,
    X
} from "lucide-react";

const AppToaster = ({ 
  position = "top-right", 
  duration = 3000 
}) => {
  return (
    <Toaster
      position={position}
      reverseOrder={true}
      gutter={12}
      containerStyle={{
        zIndex: 9999,
      }}
      toastOptions={{
        duration,
        style: {
          padding: 0,
          background: 'transparent',
        },
      }}
    >
      {(t) => {
        // Styles selon le type
        const getStyles = (type) => {
          switch(type) {
            case 'success':
              return {
                icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                bgColor: "bg-green-50",
                textColor: "text-green-800",
                borderColor: "border-green-200",
                accentColor: "bg-green-500"
              };
            case 'error':
              return {
                icon: <XCircle className="w-5 h-5 text-red-600" />,
                bgColor: "bg-red-50",
                textColor: "text-red-800",
                borderColor: "border-red-200",
                accentColor: "bg-red-500"
              };
            case 'loading':
              return {
                icon: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />,
                bgColor: "bg-blue-50",
                textColor: "text-blue-800",
                borderColor: "border-blue-200",
                accentColor: "bg-blue-500"
              };
            default:
              return {
                icon: <Info className="w-5 h-5 text-purple-600" />,
                bgColor: "bg-purple-50",
                textColor: "text-purple-800",
                borderColor: "border-purple-200",
                accentColor: "bg-purple-500"
              };
          }
        };

        const styles = getStyles(t.type);

        return (
          <div
            className={`
              ${styles.bgColor}
              ${styles.borderColor}
              border
              rounded-xl
              shadow-lg
              overflow-hidden
              transition-all duration-300
              ${t.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
            style={{
              minWidth: '320px',
              maxWidth: '400px',
            }}
          >
            <div className="relative">
              {/* Accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.accentColor}`} />
              
              {/* Content */}
              <div className="flex items-center p-4 pl-5">
                {/* Icon */}
                <div className="mr-3">
                  {styles.icon}
                </div>
                
                {/* Message */}
                <div className="flex-1">
                  <p className={`font-medium text-sm ${styles.textColor}`}>
                    {t.message}
                  </p>
                </div>
                
                {/* Close button */}
                {t.type !== 'loading' && (
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Progress bar */}
              {t.type !== 'loading' && duration && (
                <div className={`h-0.5 ${styles.accentColor} transition-all duration-${duration}`} 
                  style={{ 
                    width: t.visible ? '100%' : '0%',
                    transitionDuration: `${t.duration || duration}ms`
                  }}
                />
              )}
            </div>
          </div>
        );
      }}
    </Toaster>
  );
};

export default AppToaster;