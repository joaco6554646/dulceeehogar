import { useContext } from 'react';
// ⚠️ Importa la constante CartContext desde el archivo del Provider
import { CartContext } from '../components/CartContext'; 

// Este es el hook que los componentes como ProductCard y CartPage usan
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        // Asegura que el hook solo se use dentro de CartProvider
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};