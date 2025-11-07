// 1. Asume que importas el 'user' (o el objeto de autenticación) del contexto
import { useAuth } from '../contexts/AuthContext'; 

export const useSales = () => {
    const { user, db, appId } = useFirebase(); // O usa useAuth() y combina los estados
    // ...

    useEffect(() => {
        // 🟢 NUEVA CONDICIÓN DE PROTECCIÓN
        if (!user || !db || !appId) { // Espera explícitamente a que el usuario exista
            // Si el componente AdminDashboard no usa 'user', esto no será suficiente.
            // La mejor práctica es que useSales obtenga el estado de autenticación.
            setLoading(false);
            return;
        }

        // ... Lógica de Firestore con onSnapshot (ahora garantizado que el usuario está logueado)
        // ...

    }, [user, db, appId]); // Agrega 'user' como dependencia
    
    // ...
};