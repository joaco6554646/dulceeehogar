import React, { createContext, useContext } from 'react';
// 🛑 CORRECCIÓN: ELIMINAMOS TODAS LAS IMPORTACIONES de config.js.
// El componente App.jsx nos pasa las instancias como props.

const FirebaseContext = createContext(null);

// Hook de consumo para usar en useSales, CartContext, ProductList, etc.
export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === null) {
        throw new Error('useFirebase debe ser usado dentro de un FirebaseProvider');
    }
    return context;
};

// Proveedor que recibe las instancias como props desde App.jsx
// 🛑 Recibimos db, appId, y auth como props.
export const FirebaseProvider = ({ children, db, appId, auth }) => {
    // El valor proporcionado incluye todas las instancias necesarias
    const contextValue = { db, appId, auth }; 

    return (
        <FirebaseContext.Provider value={contextValue}>
            {children}
        </FirebaseContext.Provider>
    );
};