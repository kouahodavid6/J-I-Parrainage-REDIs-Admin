import { Link } from 'react-router-dom';
import { Home, Network, Server, Database, Cpu, Code2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white px-4 relative overflow-hidden">
            {/* Effets de fond décoratifs - style particules */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-400/10 rounded-full blur-2xl"></div>
            </div>

            {/* Particules animées */}
            {Array.from({ length: 12 }, (_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: 0.4,
                    }}
                />
            ))}

            <motion.div 
                className="max-w-md text-center relative z-10 py-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Icône REDIs */}
                <motion.div 
                    className="flex justify-center mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                >
                    <div className="bg-gradient-to-br from-blue-950/60 to-slate-900/60 backdrop-blur-sm p-6 rounded-3xl border border-blue-400/30 shadow-xl shadow-blue-500/10">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-2">
                            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                                <img 
                                    src="/LogoParainageREDIs.jpg" 
                                    alt="Logo Parrainage REDIs" 
                                    className="w-full h-full object-contain rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Code erreur */}
                <motion.h1 
                    className="text-8xl font-black mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
                >
                    404
                </motion.h1>

                {/* Titre */}
                <motion.h2 
                    className="text-3xl font-bold mb-3 text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Page non trouvée
                </motion.h2>

                {/* Message */}
                <motion.p 
                    className="mb-8 text-blue-200/70 text-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    Oups ! Il semble que cette page ait été déplacée ou n'existe plus dans notre système. 
                    Revenons à votre espace administrateur ensemble.
                </motion.p>

                {/* Bouton de retour */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <Link
                        to="/dashboard"
                        className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3.5 px-10 rounded-xl transition-all duration-300 shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1"
                    >
                        <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Retour au Dashboard
                    </Link>
                </motion.div>

                {/* Message secondaire */}
                <motion.div 
                    className="mt-6 text-sm text-blue-300/60 flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <Shield className="h-4 w-4 text-blue-400" />
                    Revenez à nous administrateur ! 💻
                </motion.div>
            </motion.div>

            {/* Décorations bas de page - icônes tech */}
            <div className="absolute bottom-10 left-10 opacity-20">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg p-1.5">
                    <Server className="h-full w-full text-blue-300" />
                </div>
            </div>
            <div className="absolute bottom-20 right-10 opacity-20">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg p-1">
                    <Database className="h-full w-full text-blue-300" />
                </div>
            </div>

            {/* Éléments décoratifs supplémentaires tech */}
            <div className="absolute top-10 right-16 opacity-15">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-2">
                    <Cpu className="h-full w-full text-blue-300" />
                </div>
            </div>
            
            <div className="absolute top-20 left-16 opacity-15">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg p-1.5">
                    <Code2 className="h-full w-full text-blue-300" />
                </div>
            </div>
            
            <div className="absolute bottom-32 left-20 opacity-15">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg p-1">
                    <Network className="h-full w-full text-blue-300" />
                </div>
            </div>
            
            <div className="absolute top-32 right-20 opacity-15">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-2">
                    <Shield className="h-full w-full text-blue-300" />
                </div>
            </div>

            {/* Logo REDIs en décoratif */}
            <div className="absolute bottom-10 right-20 opacity-10">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-white font-bold text-xs">REDIs</span>
                </div>
            </div>

            {/* Cercles décoratifs */}
            <div className="absolute top-40 left-10 opacity-10">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
            
            <div className="absolute bottom-40 right-16 opacity-10">
                <div className="w-6 h-6 bg-cyan-400 rounded-full"></div>
            </div>

            {/* Ligne de code décorative */}
            <div className="absolute top-44 left-1/4 opacity-5 font-mono text-xs">
                <code>404: PageNotFoundError();</code>
            </div>
        </div>
    );
};

export default NotFound;