import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { useFirebase } from '../firebase/FirebaseContext'; // Asumimos que esta importación es correcta.

export const useSales = () => {
    // 🛑 Nota: La importación de useAuth ha sido eliminada. 
    // Asumimos que useFirebase devuelve { user, db, appId }
    const { user, db, appId } = useFirebase(); 
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 🟢 PROTECCIÓN: Esperar a que el usuario, DB y ID de App estén definidos.
        if (!user || !db || !appId) { 
            // Esto evita el error de permisos de Firebase al cargarse.
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // 1. Definir la ruta de la colección de ventas (ruta correcta ya incluida)
        const salesCollectionPath = `artifacts/${appId}/public/data/sales`; 
        const salesRef = collection(db, salesCollectionPath);
        
        // 2. Crear una consulta
        const salesQuery = query(
            salesRef,
            orderBy("timestamp", "desc"), 
            limit(100)
        );

        // 3. Suscribirse a los cambios en tiempo real
        const unsubscribe = onSnapshot(salesQuery, 
            (snapshot) => {
                const fetchedSales = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSales(fetchedSales);
                setLoading(false);
                setError(null);
            }, 
            (err) => {
                console.error("[useSales] Error al cargar ventas:", err);
                setError("Error al cargar datos de ventas. Asegúrate de estar logueado como Admin y verifica los índices de Firestore.");
                setLoading(false);
            }
        );

        // 4. Limpiar la suscripción
        return () => unsubscribe();

    }, [user, db, appId]); // Dependencias. user garantiza que se recargue al iniciar sesión.

    // 5. Función para calcular las métricas (Asumo que esta lógica está completa)
    const getSalesMetrics = () => {
        const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalPaid || 0), 0);
        const totalSalesCount = sales.length;

        const productCounts = sales.flatMap(sale => sale.items)
            .reduce((acc, item) => {
                acc[item.name] = (acc[item.name] || 0) + item.quantity;
                return acc;
            }, {});

        const topProducts = Object.entries(productCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5)
            .map(([name, quantity]) => ({ name, quantity }));

        return {
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            totalSalesCount,
            topProducts,
        };
    };

    return { sales, loading, error, getSalesMetrics };
};