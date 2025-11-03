import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config'; // Asegúrate de que esta ruta sea correcta: '../firebase/config'
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { PencilIcon, TrashIcon, PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        id: '',
        name: '',
        description: '',
        price: 0, // Inicializar como número
        imageURL: '',
        // 🛑 ELIMINADO: category ya no existe aquí
    });
    const [error, setError] = useState(null);

    // 1. CARGA DE DATOS (READ)
    useEffect(() => {
        const productsCollection = collection(db, 'products'); 
        
        const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Limpieza y estandarización del precio a número
            const cleanedProducts = productsData.map(p => ({
                ...p,
                price: typeof p.price === 'number' ? p.price : parseFloat(p.price || '0')
            }));
            
            setProducts(cleanedProducts);
            setLoading(false);
            setError(null);
        }, (err) => {
            console.error("Error al cargar productos:", err);
            setError("Error al cargar productos. Revisa la consola y las reglas de seguridad de Firestore.");
            setLoading(false);
        });

        // Limpieza de la suscripción
        return () => unsubscribe();
    }, []);

    // 2. Manejo del Modal (Editar/Agregar)
    const openModal = (product = null) => {
        if (product) {
            setIsEditing(true);
            setCurrentProduct(product);
        } else {
            setIsEditing(false);
            // 🛑 Eliminado 'category: '' de la inicialización de nuevo producto
            setCurrentProduct({ id: '', name: '', description: '', price: 0, imageURL: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // 🛑 Eliminado 'category: '' al cerrar el modal
        setCurrentProduct({ id: '', name: '', description: '', price: 0, imageURL: '' });
        setError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    // 3. Crear/Actualizar Producto (CREATE/UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // 🛑 CORRECCIÓN CLAVE: La validación ahora solo necesita Nombre y Precio.
        if (!currentProduct.name || currentProduct.price <= 0) {
            setError('Nombre y Precio (mayor a cero) son campos obligatorios.');
            return;
        }

        const productData = {
            name: currentProduct.name,
            description: currentProduct.description || 'Sin descripción.',
            price: parseFloat(currentProduct.price),
            imageURL: currentProduct.imageURL || 'https://placehold.co/600x400/CCCCCC/333333?text=Sin+Imagen',
            // 🛑 ELIMINADO: category ya no se guarda en Firestore.
            createdAt: serverTimestamp(), 
        };

        try {
            if (isEditing) {
                // Actualizar (UPDATE)
                const productRef = doc(db, 'products', currentProduct.id);
                // Usamos setDoc con { merge: true } para actualizar campos existentes
                await setDoc(productRef, productData, { merge: true }); 
                console.log('Producto actualizado:', currentProduct.id);
            } else {
                // Crear (CREATE)
                const newProductRef = collection(db, 'products');
                const newDoc = await addDoc(newProductRef, productData);
                // Guardamos el ID de Firestore dentro del documento para referencia futura
                await setDoc(newDoc, { id: newDoc.id }, { merge: true }); 
                console.log('Producto agregado con ID:', newDoc.id);
            }
            closeModal();
        } catch (err) {
            console.error('Error al guardar producto:', err);
            setError('Error al guardar el producto. Revisa la consola para más detalles (Ej. Problema de conexión o reglas de Firestore).');
        }
    };

    // 4. Eliminar Producto (DELETE)
    const handleDelete = async (productId, productName) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${productName}"? Esta acción es irreversible.`)) {
            try {
                const productRef = doc(db, 'products', productId);
                await deleteDoc(productRef);
                console.log('Producto eliminado:', productId);
            } catch (err) {
                console.error('Error al eliminar producto:', err);
                setError('Error al eliminar el producto.');
            }
        }
    };

    // Manejo de estados de carga y error en la UI
    if (loading) return <div className="p-4 text-center text-gray-500">Cargando gestión de productos...</div>;
    if (error && !isModalOpen) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-400 rounded-lg">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-amber-900">Gestión de Productos ({products.length})</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white font-medium rounded-xl shadow-lg hover:bg-red-700 transition duration-150 transform hover:scale-105"
                >
                    <PlusCircleIcon className="h-6 w-6" />
                    <span>Agregar Producto</span>
                </button>
            </div>

            {/* Listado de Productos en Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full p-10 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                        Aún no hay productos cargados. ¡Empieza por agregar el primero!
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-200">
                            <div className="h-40 overflow-hidden">
                                <img 
                                    src={product.imageURL} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = "https://placehold.co/400x250/FEE300/8B5E00?text=Dulce+Hogar"; 
                                    }} 
                                />
                            </div>
                            
                            <div className="p-5 flex-grow">
                                {/* 🛑 ELIMINADO: Ya no se renderiza la etiqueta de categoría */}
                                <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{product.description}</p>
                            </div>
                            
                            <div className="flex justify-between items-center p-5 pt-0 border-t border-gray-100">
                                <p className="text-2xl font-extrabold text-red-600">${product.price.toFixed(2)}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openModal(product)}
                                        className="p-3 text-blue-600 hover:text-white hover:bg-blue-600 transition duration-200 rounded-full border border-blue-600"
                                        title="Editar Producto"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id, product.name)}
                                        className="p-3 text-red-600 hover:text-white hover:bg-red-600 transition duration-200 rounded-full border border-red-600"
                                        title="Eliminar Producto"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal para Agregar/Editar Producto */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-3xl w-full max-w-lg p-8 relative transform transition-all duration-300 scale-100">
                        <h3 className="text-2xl font-bold mb-6 text-amber-900 border-b pb-2">
                            {isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                        </h3>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
                            <XCircleIcon className="h-8 w-8" />
                        </button>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Mostrar error dentro del modal */}
                            {error && (
                                <div className="text-red-700 text-sm p-3 bg-red-100 border border-red-500 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Campos del formulario (Ya no incluye 'category') */}
                            {['name', 'description', 'price', 'imageURL'].map((field) => (
                                <div key={field}>
                                    <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                                        {field.replace('URL', ' URL')}
                                    </label>
                                    <input
                                        type={field === 'price' ? 'number' : (field === 'imageURL' ? 'url' : 'text')}
                                        step={field === 'price' ? '0.01' : null}
                                        name={field}
                                        id={field}
                                        value={currentProduct[field]}
                                        onChange={handleChange}
                                        // 'description' y 'imageURL' no son requeridos. 'name' y 'price' sí lo son.
                                        required={field !== 'description' && field !== 'imageURL'} 
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 border"
                                    />
                                </div>
                            ))}

                            <div className="flex justify-end space-x-3 pt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition"
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Agregar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;