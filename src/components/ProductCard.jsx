import React from 'react';
import { useCart } from '../hooks/useCart';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product }) => {
    const { addItemToCart, userId } = useCart();
    
    // Simulación de una oferta del 10% en Criollos
    const isSpecialOffer = product.name === 'Criollos';
    const discountRate = 0.10;
    
    // Cálculo de precio
    const originalPrice = product.price;
    const discountedPrice = isSpecialOffer ? originalPrice * (1 - discountRate) : originalPrice;

    // 🟢 NUEVA LÓGICA: URL de fallback (usaremos la que usaste en AdminProducts)
    const FALLBACK_IMAGE_URL = 'https://placehold.co/600x400/CCCCCC/333333?text=Sin+Imagen';

    // Determinar si el usuario está (aproximadamente) logueado
    const isUserLoggedIn = !!userId;

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition duration-500 border border-amber-200">
            
            {/* 🛑 CORRECCIÓN CLAVE: Usar la etiqueta <img> con la URL de Firestore */}
            <div className="h-48 overflow-hidden">
                <img
                    // 1. Usar la URL de Firestore. Si está vacía, usar el fallback.
                    src={product.imageURL || FALLBACK_IMAGE_URL}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    // 2. Añadir la lógica de fallback por si la imagen falla al cargar
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = FALLBACK_IMAGE_URL; 
                    }}
                />
            </div>
            {/* FIN DE LA CORRECCIÓN */}
            
            <div className="p-5">
                <h3 className="text-2xl font-bold text-amber-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description || 'La mejor calidad, recién horneado para ti.'}</p>
                
                {/* Visualización de Precios y Descuento */}
                <div className="flex items-end justify-between mb-4">
                    {isSpecialOffer ? (
                        <>
                            <span className="text-xl font-bold text-red-600">${discountedPrice.toFixed(2)}</span>
                            <span className="text-sm line-through text-gray-500 ml-2">${originalPrice.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="text-2xl font-bold text-amber-800">${originalPrice.toFixed(2)}</span>
                    )}
                </div>

                {/* Temporizador para Oferta Especial */}
                {isSpecialOffer && (
                    <div className="mb-4">
                        <p className="text-sm text-red-500 font-semibold">¡Oferta Especial!</p>
                    </div>
                )}
                
                {/* Botón de Agregar al Carrito */}
                <button
                    onClick={() => {
                        if (!isUserLoggedIn) {
                            console.log('Debes iniciar sesión para agregar productos al carrito.');
                            return;
                        }
                        addItemToCart(product);
                    }}
                    className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition duration-300 shadow-md flex items-center justify-center disabled:opacity-50"
                    disabled={!isUserLoggedIn}
                >
                    <ShoppingBagIcon className="w-5 h-5 mr-2" />
                    {isUserLoggedIn ? 'Agregar al Carrito' : 'Inicia Sesión para Comprar'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;