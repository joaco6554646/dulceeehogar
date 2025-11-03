import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Asegúrate de que este path sea correcto para tu proyecto:
import { useCart } from '../components/CartContext'; 
import LoadingSpinner from '../components/LoadingSpinner';

// 🛑 NUEVA CONSTANTE: Alias de Mercado Pago
const MP_ALIAS = 'joamarengo88';

// Componente CouponInput sin cambios (lo dejaremos igual)
const CouponInput = ({ applyDiscountCode, discountApplied }) => {
    const [couponCode, setCouponCode] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = applyDiscountCode(couponCode);
        setMessage(result.message);
        setTimeout(() => setMessage(''), 5000); // Limpiar mensaje después de 5 segundos
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 mb-4 p-4 border rounded-xl bg-white shadow-sm">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Código de Descuento (20% OFF)</h3>
            <div className="flex space-x-2">
                <input
                    type="text"
                    placeholder="EXPOSABERDESCUENTO"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
                <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                    disabled={discountApplied}
                >
                    {discountApplied ? 'APLICADO' : 'Aplicar'}
                </button>
            </div>
            {message && (
                <p className={`mt-2 text-sm ${discountApplied ? 'text-green-600 font-medium' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </form>
    );
};


const CartPage = () => {
    const navigate = useNavigate();
    
    // 🛑 IMPORTAR recordSale
    const { 
        cartItems, 
        removeItemFromCart, 
        updateItemQuantity, 
        getSubtotal, 
        getDiscountAmount, 
        getTotalPrice, 
        applyDiscountCode, 
        discountApplied, 
        recordSale, // 🛑 Función para registrar la venta
        loadingCart 
    } = useCart();
    
    // 🛑 Modificar el mensaje inicial para que sea informativo del alias
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState(`¡Importante! Pagarás a nuestro alias de Mercado Pago: ${MP_ALIAS}`);

    // Placeholder para el ícono de Mercado Pago (sin cambios)
    const MercadoPagoIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="24" height="24" className="inline-block mr-2">
            <path fill="#009ee3" d="M128 0C57.3 0 0 57.3 0 128v256c0 70.7 57.3 128 128 128h384c70.7 0 128-57.3 128-128V128c0-70.7-57.3-128-128-128H128zm300.9 337.5c-43.2 21.6-96.1 19.4-137.9-.6-41.8-20-72.2-56.1-85-98.8-12.8-42.7-5.5-89.9 17.3-128.5 22.8-38.6 60.1-66.2 102.7-77.9 42.7-11.7 87.5-6 128.4 17.3 35 19.4 62.4 47.9 78.4 81.3-19.4 0-38.6 0-57.7 0-14.4 0-26.6-8.6-32.2-22.3-5.7-13.6-1-29.4 12.5-35.1 13.5-5.7 29.3-.9 35 12.7 5.7 13.6 1 29.4-12.5 35.1 5.7 13.5 1 29.3-12.7 35-13.6 5.7-29.4.9-35.1-12.6-5.7-13.5-1-29.3 12.6-35 13.6-5.7 29.4-.9 35.1 12.6 1.9 4.4 3.4 9 4.6 13.7 17.6 1.4 35.4 2.1 53.4 2.1-1.9 39.5-20 74.5-50.6 96.8-27.1 19.7-59.2 27.6-91 23.9zm-97.7-160c-26.1 0-47.3 21.2-47.3 47.3s21.2 47.3 47.3 47.3 47.3-21.2 47.3-47.3-21.2-47.3-47.3-47.3z" />
        </svg>
    );

    // 🛑 FUNCIÓN DE PAGO MODIFICADA PARA REGISTRAR LA VENTA
    const handleCheckout = () => {
        setIsCheckoutLoading(true);
        setCheckoutMessage(`Procesando pago...`);

        const totalFinal = getTotalPrice();
        
        // Simulación del proceso de pago (3 segundos)
        setTimeout(async () => {
            
            // 🛑 1. PREPARAR Y REGISTRAR LA VENTA EN FIRESTORE
            const saleDetails = {
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                subtotal: getSubtotal(),
                discountAmount: getDiscountAmount(),
                totalPaid: totalFinal,
                paymentMethod: `Mercado Pago (Alias: ${MP_ALIAS})`, // Incluye el alias
            };
            
            await recordSale(saleDetails); // 🛑 Llama a la función del contexto para el registro en Firestore

            // 🛑 2. ACTUALIZAR EL MENSAJE DE ÉXITO FINAL
            setCheckoutMessage(
                `✅ ¡Pago Simulado Exitoso! Monto: $${totalFinal.toFixed(2)}. Tu venta ha sido registrada. Por favor, realiza la transferencia al alias: ${MP_ALIAS}`
            );
            setIsCheckoutLoading(false);
            
            // Nota: Podrías añadir aquí la función clearCart() si quieres vaciar el carrito automáticamente.

        }, 3000);
    };

    // ... (Manejo de estados de carga y carrito vacío sin cambios) ...
    if (loadingCart) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <LoadingSpinner />
                <p className='ml-2 text-lg text-gray-600'>Cargando carrito...</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
                <span className="text-6xl mb-4 text-amber-500" role="img" aria-label="Empty Cart">🛒</span>
                <h1 className="text-3xl font-bold text-gray-800">Tu carrito está vacío.</h1>
                <p className="text-lg text-gray-600 mt-2">¡Añade algunos deliciosos productos!</p>
                <button
                    onClick={() => navigate('/products')}
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-200"
                >
                    Ir a la tienda
                </button>
            </div>
        );
    }
    // ... (Fin de manejo de estados) ...

    return (
        <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen">
            <h1 className="text-4xl font-extrabold text-amber-900 mb-8 border-b pb-4">Tu Carrito de Compras</h1>

            {/* Mensaje de Pago/Alias */}
            {checkoutMessage && (
                // Cambié el color a azul si no es un mensaje de éxito/error.
                <div className={`bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-xl relative mb-6`} role="alert">
                    <p className="font-bold">Información de Pago</p>
                    <p className="text-sm">{checkoutMessage}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna de Artículos del Carrito (2/3) - Sin cambios en esta sección */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-xl shadow-md transition duration-150 hover:shadow-lg">
                            {/* ... (Detalles del Producto y controles de cantidad) ... */}
                            <img
                                src={`https://placehold.co/80x80/ffe0b2/9c27b0?text=${item.name.slice(0, 1)}`}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg mr-4 border border-amber-200"
                            />
                            <div className="flex-grow">
                                <p className="text-lg font-bold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.description}</p>
                                <p className="text-md font-semibold text-red-600 mt-1">${item.price.toFixed(2)} c/u</p>
                            </div>
                            <div className="flex items-center space-x-2 mr-4">
                                <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-full disabled:opacity-50 transition">-</button>
                                <span className="text-lg font-medium w-6 text-center">{item.quantity}</span>
                                <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-1 px-3 rounded-full transition">+</button>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-extrabold text-amber-900">${(item.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => removeItemFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm mt-1 transition">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Columna de Resumen del Pago (1/3) */}
                <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl shadow-xl sticky top-20 h-fit">
                    <h2 className="text-2xl font-bold text-amber-900 mb-4 border-b pb-3">Resumen del Pedido</h2>
                    
                    <CouponInput 
                        applyDiscountCode={applyDiscountCode} 
                        discountApplied={discountApplied} 
                    />

                    <div className="space-y-3 text-gray-700 mt-4">
                        <div className="flex justify-between text-lg">
                            <span>Subtotal:</span>
                            <span className="font-medium">${getSubtotal().toFixed(2)}</span> 
                        </div>
                        <div className={`flex justify-between text-lg ${discountApplied ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                            <span>Descuento (20%):</span>
                            <span>
                                {discountApplied ? `-${getDiscountAmount().toFixed(2)}` : '$0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-gray-200">
                            <span className="text-2xl font-extrabold text-gray-900">Total:</span>
                            <span className="text-2xl font-extrabold text-gray-900">${getTotalPrice().toFixed(2)}</span>
                        </div>
                    </div>

                    {/* 🛑 LÍNEA DEL ALIAS DE MERCADO PAGO */}
                    <p className="text-sm text-gray-500 mt-6 mb-3 text-center">
                        Para pagar, realiza la transferencia a este alias de Mercado Pago: <strong className="text-gray-700 font-extrabold">{MP_ALIAS}</strong>
                    </p>

                    {/* Botón de Pago con Mercado Pago */}
                    <button
                        onClick={handleCheckout}
                        disabled={isCheckoutLoading || cartItems.length === 0}
                        className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white transition duration-150 ${
                            isCheckoutLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300'
                        } ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isCheckoutLoading ? (
                            <>
                                <LoadingSpinner size="sm" color="white" />
                                <span className='ml-2'>Procesando y registrando venta...</span>
                            </>
                        ) : (
                            <>
                                <MercadoPagoIcon />
                                Pagar con Mercado Pago
                            </>
                        )}
                    </button>

                    {cartItems.length === 0 && (
                               <p className="text-sm text-red-500 mt-2 text-center">
                                    Añade productos para pagar.
                               </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;