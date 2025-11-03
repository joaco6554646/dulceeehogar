import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

// --- IMPORTAR FIREBASE DESDE CONFIG ---
import { db, auth } from './firebase/config';

// 🛑 NUEVA IMPORTACIÓN: FirebaseProvider para centralizar db, auth, appId
import { FirebaseProvider } from './firebase/FirebaseContext'; 
import { CartProvider } from './components/CartContext';

// 🟢 COMPONENTES DE ESTRUCTURA
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 

// 🟢 PÁGINAS Y COMPONENTES
import LandingPage from './pages/LandingPage';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminProducts from './pages/AdminProducts';
import LoadingSpinner from './components/LoadingSpinner';


// VARIABLES GLOBALES DEL ENTORNO (NO MODIFICAR)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Componente Wrapper para proteger rutas de administrador
const AdminWrapper = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Usamos la instancia global 'auth' importada de config
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return isAuthenticated ? children : <Navigate to="/admin-login" />;
};


const App = () => {
    const [authReady, setAuthReady] = useState(false);

    // 1. Autenticación Inicial
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (e) {
                console.error("Error al iniciar sesión anónima o con token:", e);
                if (auth && auth.currentUser === null) {
                    await signInAnonymously(auth);
                }
            } finally {
                setAuthReady(true);
            }
        };

        initializeAuth();
    }, []); 

    if (!authReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <Router>
            {/* 🛑 PUNTO CRÍTICO: Envuelve toda la app con el proveedor de Firebase 
                y le pasa las instancias una sola vez. */}
            <FirebaseProvider db={db} appId={appId} auth={auth}>

                {/* 🛑 CartProvider ya NO necesita props de Firebase, los obtiene con useFirebase. */}
                <CartProvider>
                    
                    <div className="flex flex-col min-h-screen">
                        
                        <Navbar />
                        
                        <main className="flex-grow pt-16">
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                
                                {/* 🛑 ProductList ya NO necesita db/appId como props */}
                                <Route path="/products" element={<ProductList />} /> 
                                
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/admin-login" element={<AdminLogin />} /> 

                                {/* Rutas de Admin Protegidas */}
                                <Route path="/admin/dashboard" element={
                                    <AdminWrapper><AdminDashboard /></AdminWrapper>
                                } />
                                
                                {/* 🛑 AdminProducts ya NO necesita db/appId como props */}
                                <Route path="/admin/products" element={
                                    <AdminWrapper><AdminProducts /></AdminWrapper>
                                } />
                                
                                <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
                            </Routes>
                        </main>
                        
                        <Footer />

                    </div>
                    
                </CartProvider>
            
            </FirebaseProvider>
        </Router>
    );
};
export default App;