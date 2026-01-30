import { useState, useEffect, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';

const ImportEtudiantModal = (props) => {
    const {
        isOpen,
        onClose,
        onImport,
        isProcessing = false,
        // niveau,
        // filiere,
        titre = "Importer des étudiants"
    } = props;
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [errors, setErrors] = useState({});
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const dropAreaRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedFile(null);
            setFileName('');
            setErrors({});
            setDragActive(false);
        }
    }, [isOpen]);

    const validateFile = (file) => {
        const newErrors = {};
        
        if (!file) {
            newErrors.file = 'Veuillez sélectionner un fichier';
            return newErrors;
        }

        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validExtensions.includes(fileExtension)) {
            newErrors.file = 'Format de fichier non supporté. Utilisez .xlsx, .xls ou .csv';
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            newErrors.file = 'Le fichier ne doit pas dépasser 10MB';
        }

        return newErrors;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileErrors = validateFile(file);
            if (Object.keys(fileErrors).length === 0) {
                setSelectedFile(file);
                setFileName(file.name);
                setErrors({});
            } else {
                setErrors(fileErrors);
                setSelectedFile(null);
                setFileName('');
            }
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const fileErrors = validateFile(file);
            
            if (Object.keys(fileErrors).length === 0) {
                setSelectedFile(file);
                setFileName(file.name);
                setErrors({});
            } else {
                setErrors(fileErrors);
                setSelectedFile(null);
                setFileName('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            setErrors({ file: 'Veuillez sélectionner un fichier' });
            return;
        }

        const fileErrors = validateFile(selectedFile);
        if (Object.keys(fileErrors).length > 0) {
            setErrors(fileErrors);
            return;
        }

        // Créer FormData comme dans l'exemple
        const formData = new FormData();
        formData.append('fichier', selectedFile);

        onImport(formData, {
            onSuccess: (data) => {
                toast.success(`Importation réussie de ${data.length || 0} étudiants`);
                handleClose();
            },
            onError: (error) => {
                toast.error(error.message || 'Erreur lors de l\'importation');
            },
        });
    };

    const handleClose = () => {
        if (!isProcessing) {
            setSelectedFile(null);
            setFileName('');
            setErrors({});
            setDragActive(false);
            onClose();
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleClose}
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div 
                        className="relative z-[10000] bg-slate-900/95 backdrop-blur-xl rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-blue-400/20 overflow-hidden"
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className="flex justify-between items-start p-6 border-b border-blue-400/20">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/20 mt-1 flex-shrink-0">
                                    <Upload className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-bold text-white truncate">
                                        {titre}
                                    </h3>
                                    <p className="text-blue-300 text-sm mt-1">
                                        Importez un fichier Excel contenant la liste des étudiants
                                    </p>
                                </div>
                            </div>
                            {!isProcessing && (
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-300 hover:text-blue-200 transition-colors flex-shrink-0 ml-2"
                                    aria-label="Fermer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Zone de dépôt de fichier */}
                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-3">
                                            Fichier Excel *
                                        </label>
                                        <div
                                            ref={dropAreaRef}
                                            onClick={triggerFileInput}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`
                                                relative cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                                                ${dragActive 
                                                    ? 'border-blue-400 bg-blue-500/10' 
                                                    : selectedFile 
                                                        ? 'border-green-500/50 bg-green-500/5' 
                                                        : 'border-blue-400/30 bg-slate-800/30 hover:border-blue-400/50 hover:bg-slate-800/50'
                                                }
                                            `}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".xlsx,.xls,.csv"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                disabled={isProcessing}
                                            />
                                            
                                            <div className="space-y-4">
                                                <div className="flex justify-center">
                                                    <div className={`
                                                        p-3 rounded-full flex items-center justify-center
                                                        ${selectedFile 
                                                            ? 'bg-green-500/20 text-green-400' 
                                                            : 'bg-blue-500/20 text-blue-400'
                                                        }
                                                    `}>
                                                        {selectedFile ? (
                                                            <CheckCircle className="h-8 w-8" />
                                                        ) : (
                                                            <FileSpreadsheet className="h-8 w-8" />
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    {selectedFile ? (
                                                        <>
                                                            <p className="text-white font-medium truncate">{fileName}</p>
                                                            <p className="text-blue-300 text-sm">
                                                                {(selectedFile.size / 1024).toFixed(1)} KB
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-white font-medium">
                                                                Glissez-déposez votre fichier ici
                                                            </p>
                                                            <p className="text-blue-300 text-sm">
                                                                ou cliquez pour sélectionner
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                                
                                                <p className="text-blue-300/60 text-xs">
                                                    Formats acceptés: .xlsx, .xls, .csv (max 10MB)
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {errors.file && (
                                            <div className="mt-3 flex items-start gap-2 text-red-400 text-sm">
                                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                <span>{errors.file}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-8">
                                    {!isProcessing && (
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-blue-400/20 text-blue-200 hover:bg-blue-500/10 transition-colors font-medium text-sm sm:text-base hover:scale-[1.02] active:scale-95"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isProcessing || !selectedFile}
                                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm sm:text-base shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader className="h-4 w-4 animate-spin flex-shrink-0" />
                                                <span className="whitespace-nowrap">Importation...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 flex-shrink-0" />
                                                <span className="whitespace-nowrap">Importer les étudiants</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImportEtudiantModal;