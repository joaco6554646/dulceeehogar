import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
// 🛑 CORRECCIÓN DE RUTA: 
// La importación correcta debe apuntar al hook que provee db y appId,
// que debería estar en tu FirebaseContext dedicado.
import { useFirebase } from '../firebase/FirebaseContext'; 

export const useSales = () => {
    // Aquí usamos el hook que ahora sí está exportado desde FirebaseContext
    const { db, appId } = useFirebase(); 
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!db || !appId) {
            setLoading(false);
            setError("Error: Conexión a Firebase o ID de aplicación no disponible.");
            return;
        }

        // 1. Definir la ruta de la colección de ventas
        const salesCollectionPath = `/artifacts/${appId}/sales`;
        const salesRef = collection(db, salesCollectionPath);
        
        // 2. Crear una consulta para obtener las últimas 100 ventas, ordenadas por timestamp
        // NOTA: Asegúrate de que los documentos de venta tengan un campo 'timestamp'.
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
                    // Se asume que tu recordSale en CartContext guarda el timestamp
                    ...doc.data()
                }));
                setSales(fetchedSales);
                setLoading(false);
                setError(null);
            }, 
            (err) => {
                console.error("[useSales] Error al cargar ventas:", err);
                setError("Error al cargar datos de ventas. Revisa las reglas de Firestore.");
                setLoading(false);
            }
        );

        // 4. Limpiar la suscripción
        return () => unsubscribe();
    }, [db, appId]);

    // 5. Función para calcular las métricas (sin cambios)
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