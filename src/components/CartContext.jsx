import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, addDoc, collection } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth'; // Importar onAuthStateChanged
// 🛑 CORRECCIÓN CRÍTICA: Importamos useFirebase para obtener las instancias necesarias
import { useFirebase } from '../firebase/FirebaseContext'; 

// 🛑 CONSTANTES PARA EL DESCUENTO
const EXPO_DISCOUNT_CODE = 'EXPOSABERDESCUENTO';
const DISCOUNT_PERCENTAGE = 0.20; // 20%

// 1. Creación y EXPORTACIÓN del Contexto
export const CartContext = createContext();

// 2. Componente Proveedor (Provider)
// 🛑 ELIMINAMOS props: Ya NO se reciben db, auth, appId como props
export const CartProvider = ({ children }) => {
    // 🛑 OBTENEMOS LAS INSTANCIAS DE FIREBASE USANDO EL HOOK
    const { db, auth, appId } = useFirebase();

    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [userId, setUserId] = useState(null);
    const [discountApplied, setDiscountApplied] = useState(false);

    // Determina la ruta del documento del carrito para el usuario actual
    const getCartDocRef = useCallback((currentUserId) => {
        if (!db || !currentUserId) return null;
        // La ruta asume que el carrito es un documento único ('cart') dentro de la subcolección
        const cartCollectionPath = `/artifacts/${appId}/users/${currentUserId}/cart`;
        return doc(db, cartCollectionPath, 'items'); // Usamos 'items' como ID de documento para almacenar los artículos
    }, [db, appId]);

    // 3. Lógica de Autenticación y Carga Inicial del Carrito
    useEffect(() => {
        if (!auth || !db) return;
        
        // 3.1 Manejo de autenticación y setting de userId
        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            if (user) {
                const currentUserId = user.uid;
                setUserId(currentUserId);
                
                // 3.2 Listener de Firestore
                const cartRef = getCartDocRef(currentUserId);
                if (cartRef) {
                    const unsubscribeSnapshot = onSnapshot(cartRef, (docSnap) => {
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            // Asumimos que el documento del carrito guarda los items en un campo 'items'
                            setCartItems(data.items || []);
                            setDiscountApplied(data.discountApplied || false); 
                        } else {
                            setCartItems([]);
                            setDiscountApplied(false);
                            // Si el doc no existe, lo creamos vacío para establecer el listener
                            setDoc(cartRef, { items: [], discountApplied: false }, { merge: false });
                        }
                        setLoadingCart(false);
                    }, (error) => {
                        console.error("[CartContext] Error al escuchar el carrito:", error);
                        setLoadingCart(false);
                    });
                    
                    return () => unsubscribeSnapshot();
                }
            } else {
                setCartItems([]);
                setUserId(null); 
                setDiscountApplied(false);
                setLoadingCart(false);
            }
        });

        return () => unsubscribeAuth();
    }, [db, auth, appId, getCartDocRef]); 
    
    // NOTA: El array de dependencias [db, auth, appId, getCartDocRef] ahora funciona porque 
    // db, auth y appId son estables ya que vienen del FirebaseContext.

    // 4. Funciones de manipulación del Carrito
    
    // 4.1. Función de Escritura en Firestore (Actualizada para guardar el estado del descuento)
    const updateFirestoreCart = useCallback(async (newCartItems, currentDiscountApplied) => {
        if (!db || !userId) {
            console.error("[Firestore] FALLÓ: No se puede guardar. DB o userId no disponibles.");
            return;
        }
        const cartDocRef = getCartDocRef(userId);
        if (cartDocRef) {
            try {
                await setDoc(cartDocRef, { 
                    items: newCartItems,
                    discountApplied: currentDiscountApplied
                }, { merge: true });
                // console.log(`[Firestore] ✅ Carrito guardado para usuario: ${userId}`);
            } catch (e) {
                console.error("Error al actualizar el carrito en Firestore:", e);
                if (e.code === 'permission-denied') {
                    console.error("⛔ ¡POSIBLE ERROR DE REGLAS DE SEGURIDAD EN FIRESTORE!");
                }
            }
        }
    }, [db, userId, getCartDocRef]);
    
    // 🟢 FUNCIÓN: Registra la venta en una colección 'sales'
    const recordSale = useCallback(async (saleDetails) => {
        if (!db || !appId) {
            console.error("[Firestore] FALLÓ: No se puede registrar la venta. DB/appId no disponible.");
            return false;
        }
        
        try {
            // Colección centralizada para las ventas del administrador
            const salesCollectionRef = collection(db, `/artifacts/${appId}/sales`);
            
            await addDoc(salesCollectionRef, {
                ...saleDetails,
                userId: userId || auth.currentUser?.uid || 'anonymous', // Añadir un fallback si userId es null temporalmente
                timestamp: new Date().toISOString(), 
            });
            
            // Opcional: Limpiar el carrito después de la venta (se hace aquí para asegurar atomicidad o feedback)
            setCartItems([]);
            setDiscountApplied(false);
            await updateFirestoreCart([], false);

            console.log(`[Firestore] ✅ Venta registrada y carrito limpiado para usuario: ${userId}`);
            return true;
        } catch (e) {
            console.error("[Firestore] ❌ ERROR AL REGISTRAR LA VENTA. Mensaje:", e.message);
            return false;
        }
    }, [db, appId, userId, auth, updateFirestoreCart]);
    

    // ... (El resto de las funciones de manipulación del carrito se mantienen igual, 
    // ya que usan cartItems, updateFirestoreCart y discountApplied)
    
    const addItemToCart = useCallback((product, quantity = 1) => {
        if (!userId) {
            console.error("[addItemToCart] 🛑 ERROR: Usuario no autenticado. Debe iniciar sesión.");
            return; 
        }
        // ... (lógica de añadir/actualizar)
        const itemIndex = cartItems.findIndex(item => item.id === product.id);
        let newCartItems;
        if (itemIndex > -1) {
            newCartItems = cartItems.map((item, index) =>
                index === itemIndex
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newCartItems = [...cartItems, { ...product, quantity }];
        }
        setCartItems(newCartItems);
        updateFirestoreCart(newCartItems, discountApplied); 
    }, [cartItems, updateFirestoreCart, userId, discountApplied]);

    const removeItemFromCart = useCallback((productId) => {
        const newCartItems = cartItems.filter(item => item.id !== productId);
        setCartItems(newCartItems);
        updateFirestoreCart(newCartItems, discountApplied); 
    }, [cartItems, updateFirestoreCart, discountApplied]);

    const updateItemQuantity = useCallback((productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItemFromCart(productId);
            return;
        }
        const newCartItems = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(newCartItems);
        updateFirestoreCart(newCartItems, discountApplied); 
    }, [cartItems, updateFirestoreCart, removeItemFromCart, discountApplied]);


    // 🟢 FUNCIONES DE CÁLCULO (Se mantienen igual)
    const getSubtotal = useCallback(() => {
        const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        return parseFloat(subtotal.toFixed(2));
    }, [cartItems]);

    const getDiscountAmount = useCallback(() => {
        if (discountApplied) {
            const subtotal = getSubtotal();
            return parseFloat((subtotal * DISCOUNT_PERCENTAGE).toFixed(2));
        }
        return 0.00;
    }, [discountApplied, getSubtotal]);

    const getTotalPrice = useCallback(() => {
        const subtotal = getSubtotal();
        const discount = getDiscountAmount();
        return parseFloat((subtotal - discount).toFixed(2));
    }, [getSubtotal, getDiscountAmount]);


    // 🟢 FUNCIÓN DE DESCUENTO (Se mantiene igual)
    const applyDiscountCode = useCallback((code) => {
        if (code.toUpperCase() === EXPO_DISCOUNT_CODE) {
            setDiscountApplied(true);
            updateFirestoreCart(cartItems, true); 
            return { success: true, message: `¡Descuento del ${DISCOUNT_PERCENTAGE * 100}% aplicado!` };
        } else {
            setDiscountApplied(false);
            updateFirestoreCart(cartItems, false); 
            return { success: false, message: 'Código de descuento no válido.' };
        }
    }, [cartItems, updateFirestoreCart]);

    // 5. Valor del Contexto
    const value = {
        cartItems,
        loadingCart,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        getSubtotal, 
        getDiscountAmount, 
        getTotalPrice, 
        userId,
        discountApplied,
        applyDiscountCode,
        recordSale, 
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// 6. Hook personalizado
export const useCart = () => useContext(CartContext);