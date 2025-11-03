import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/config.js'; 

// 🛑 Nuevas Importaciones Necesarias
import { useSales } from '../hooks/useSales'; // Importamos el hook que hicimos antes
import LoadingSpinner from '../components/LoadingSpinner'; // Importamos el spinner

// Definición del email del administrador
const ADMIN_EMAIL = 'admin@dulcehogar.com';

// 🛑 NUEVO COMPONENTE: Panel que consume las estadísticas de ventas
const SalesStatisticsPanel = ({ sales, loading, error, getSalesMetrics }) => {
    
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-green-500 flex items-center justify-center h-full min-h-[250px]">
                <LoadingSpinner />
                <p className='ml-2 text-gray-600'>Cargando estadísticas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 p-6 rounded-2xl shadow-lg border-t-4 border-red-600 h-full min-h-[250px]">
                <h3 className="text-xl font-bold text-red-800 mb-2">Error de Carga</h3>
                <p className="text-sm text-red-700">{error}</p>
            </div>
        );
    }

    const metrics = getSalesMetrics();
    
    // Formatear la fecha de la última venta
    const lastSaleDate = sales.length > 0 
        ? new Date(sales[0].timestamp).toLocaleString('es-AR')
        : 'N/A';

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-green-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Estadísticas de Ventas 📊</h2>
            <p className="text-gray-600 mb-4">Análisis de ventas y productos más populares.</p>
            
            <div className="space-y-3 pt-2">
                <p className="text-lg font-semibold">Ventas Totales: <span className="text-2xl text-green-700 font-extrabold">{metrics.totalSalesCount}</span></p>
                <p className="text-lg font-semibold border-t pt-2">Ingresos Totales (Simulados): <span className="text-2xl text-green-700 font-extrabold">${metrics.totalRevenue.toFixed(2)}</span></p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2">Top 5 Productos:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                    {metrics.topProducts.map((p, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{p.name}</span>
                            <span className="font-bold text-amber-700">{p.quantity} uds.</span>
                        </li>
                    ))}
                    {metrics.topProducts.length === 0 && <li>Aún no hay ventas registradas.</li>}
                </ul>
                <p className="text-xs text-gray-500 mt-4">Última Venta: {lastSaleDate}</p>
            </div>
        </div>
    );
};


const AdminDashboard = () => {
    // El manejo de estados y efectos de autenticación se mantiene igual.
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // 🛑 Consumir el hook de ventas aquí
    const { sales, loading: loadingSales, error: errorSales, getSalesMetrics } = useSales();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false);
            setUser(currentUser);

            if (currentUser && currentUser.email === ADMIN_EMAIL) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    // 1. Mostrar estado de carga mientras se verifica Firebase
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-medium text-gray-600">Verificando acceso...</p>
            </div>
        );
    }

    // 2. Mostrar acceso denegado si no es administrador (y no está cargando)
    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-red-50 p-4">
                <span className="text-6xl text-red-600 mb-4" role="img" aria-label="stop">🛑</span>
                <h1 className="text-3xl font-bold text-red-800">Acceso Denegado</h1>
                <p className="text-xl text-red-600 mt-2">Solo para administradores.</p>
                <button 
                    onClick={() => navigate('/admin')}
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition duration-200"
                >
                    Volver al Login
                </button>
            </div>
        );
    }

    // 3. Mostrar el contenido del Dashboard si es administrador
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-lg mb-8">
                <h1 className="text-4xl font-extrabold text-amber-900">Panel de Administración</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 text-lg">Bienvenido, {user?.email}</span>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. Tarjeta de Gestión de Productos */}
                <div 
                    onClick={() => navigate('/admin/products')}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-t-4 border-amber-500"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Productos</h2>
                    <p className="text-gray-600">Agregar, editar o eliminar artículos de panadería.</p>
                    <span className="text-5xl block mt-4 text-amber-600" role="img" aria-label="Baguette">🥖</span>
                </div>

                {/* 2. Tarjeta de Pedidos (Simulado) - Se mantiene el placeholder simple */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-gray-400">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedidos Pendientes</h2>
                    <p className="text-gray-600">Ver y procesar las últimas órdenes de los clientes.</p>
                    <span className="text-5xl block mt-4 text-gray-500" role="img" aria-label="Receipt">🧾</span>
                    <p className="text-xs text-gray-400 mt-2">Funcionalidad no implementada en esta demo.</p>
                </div>

                {/* 🛑 3. Tarjeta de Estadísticas (REEMPLAZADA) */}
                <SalesStatisticsPanel 
                    sales={sales}
                    loading={loadingSales}
                    error={errorSales}
                    getSalesMetrics={getSalesMetrics}
                />
            </main>
        </div>
    );
};

export default AdminDashboard;