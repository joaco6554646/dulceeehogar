import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// 🟢 CORRECCIÓN: La ruta ahora apunta a la ubicación real: src/firebase/config.jsx
import { db } from '../firebase/config.js'; 

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Si la instancia de la base de datos no está disponible, salimos
        if (!db) {
            console.error("Firestore database instance is not available.");
            setLoading(false);
            return;
        }

        const productsCollection = collection(db, "products");
        // Opcional: ordenar por nombre, si el campo existe
        const q = query(productsCollection, orderBy("name", "asc")); 

        // onSnapshot escucha los cambios en tiempo real
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id, // Usamos el ID de Firestore como ID del producto
                ...doc.data()
            }));
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products from Firestore: ", error);
            setLoading(false);
        });

        // La función de retorno se ejecuta al desmontar el componente para limpiar el listener
        return () => unsubscribe();
    }, []);

    return { products, loading };
};