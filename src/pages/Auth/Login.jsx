import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";

import Input from "../../components/Input";
import { useLogin } from "../../hooks/useAdmin";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { login, isLoggingIn } = useLogin();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.email || !form.password) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        try {
            await login(form);
            // Le toast de succès est déjà géré dans le hook useLogin
            navigate("/dashboard");
        } catch (error) {
            // L'erreur est déjà gérée dans le hook
            console.error("Erreur de connexion", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 relative overflow-hidden p-4">
            {/* Arrière-plan avec particules */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900/50 to-blue-950/30">
                {Array.from({ length: 15 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: 0.3,
                        }}
                    />
                ))}
            </div>

            {/* Overlay pour effet de profondeur */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

            {/* Points lumineux décoratifs */}
            <div className="absolute top-20 right-10 w-6 h-6 bg-blue-400 rounded-full animate-pulse opacity-20"></div>
            <div className="absolute bottom-32 left-10 w-4 h-4 bg-cyan-300 rounded-full animate-pulse delay-500 opacity-20"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-300 rounded-full animate-pulse delay-1000 opacity-20"></div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-400/20 p-10 rounded-3xl shadow-2xl shadow-blue-500/10 w-full max-w-md relative z-10">
                {/* En-tête avec badge */}
                <div className="text-center mb-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-1">
                            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                                <img 
                                    src="/LogoParainageREDIs.jpg" 
                                    alt="Logo Parrainage REDIs" 
                                    className="w-20 h-20 object-contain rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-white mt-2">
                        REDIs
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 text-2xl mt-2">
                            Dashboard Admin
                        </span>
                    </h1>
                    <p className="text-blue-200/60 text-sm mt-1">
                        Panel de gestion du système de parrainage
                    </p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-blue-200 font-medium text-sm flex items-center gap-1">
                            Email Administrateur
                            <span className="text-cyan-400 ml-1">*</span>
                        </label>
                        <Input 
                            type="email" 
                            name="email" 
                            placeholder="admin@gmail.com"
                            value={form.email} 
                            onChange={handleChange}
                            required
                            disabled={isLoggingIn}
                            className="bg-slate-800/50 border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20 text-white placeholder-blue-300/40 disabled:opacity-50 rounded-xl"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-blue-200 font-medium text-sm flex items-center gap-1">
                            Mot de passe
                            <span className="text-cyan-400 ml-1">*</span>
                        </label>
                        <Input 
                            type="password" 
                            name="password" 
                            placeholder="********"
                            value={form.password} 
                            onChange={handleChange}
                            required
                            disabled={isLoggingIn}
                            className="bg-slate-800/50 border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20 text-white placeholder-blue-300/40 disabled:opacity-50 rounded-xl"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="group w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-3"
                    >
                        {isLoggingIn ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Authentification...
                            </>
                        ) : (
                            <>
                                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                                Accéder au Dashboard
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;