import React from "react";
// import { useCart } from "../hooks/useCart"; // ⚠️ Dejamos la nota de que no es necesaria si solo lee productos.
import ProductCard from "../components/ProductCard"; 
// 🟢 Importamos el hook para leer datos de Firebase Firestore
import { useProducts } from "../hooks/useProducts"; 
// 🟢 Asegúrate de tener un componente LoadingSpinner para la carga
import LoadingSpinner from "../components/LoadingSpinner"; 


const ProductList = () => {
    
    // ❌ ELIMINAMOS LA LISTA ESTATICA 'products'
    // const products = [ ... ];

    // 🟢 USAMOS EL HOOK PARA OBTENER LOS PRODUCTOS Y EL ESTADO DE CARGA DESDE FIRESTORE
    const { products, loading } = useProducts(); 

    // 1. Mostrar estado de carga
    if (loading) {
         return (
             <div className="flex justify-center items-center h-screen">
                 <LoadingSpinner />
                 <p className="ml-2 text-lg text-amber-800">Cargando nuestro menú...</p>
             </div>
         );
    }
    
    // 2. Manejar el caso de que no haya productos en Firestore
    if (products.length === 0) {
        return (
            <div className="container mx-auto p-8 text-center bg-amber-50 shadow-md rounded-lg mt-10">
                <h1 className="text-3xl font-bold text-amber-900 mb-4">¡Menú Vacío!</h1>
                <p className="text-gray-700">No hemos encontrado ningún producto en la base de datos.</p>
                <p className="text-gray-500 mt-2">Por favor, agréguelos desde el panel de administración o verifique la colección "products" en Firebase.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-extrabold text-center text-amber-900 mb-8">Nuestro Menú</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    // Mapeamos los productos obtenidos de Firebase
                    <ProductCard key={product.id} product={product} /> 
                ))}
            </div>
        </div>
    );
};

export default ProductList;