import { 
    Home,
    GraduationCap,
    ShieldUser, 
    Settings,
    Drum,
} from 'lucide-react';

export const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'sousadmins', label: 'Sous-Admins', icon: ShieldUser },
    { id: 'l1gi', label: 'Licence 1 GI', icon: GraduationCap },
    { id: 'l2gi', label: 'Licence 2 GI', icon: GraduationCap },
    { id: 'l1miage', label: 'Licence 1 MIAGE', icon: GraduationCap },
    { id: 'l2miage', label: 'Licence 2 MIAGE', icon: GraduationCap },
    { id: 'matching', label: 'Matching', icon: Drum },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
];