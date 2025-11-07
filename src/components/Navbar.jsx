import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../hooks/useCart'; 

// Importación agrupada
import { ShoppingBagIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
    const { totals, user, signOut } = useCart();
    // totalItems es 0 por defecto si no hay carrito
    const totalItems = totals?.totalItems || 0; 

    const handleLogout = (e) => {
        e.preventDefault();
        signOut();
    };

    return (
        <nav className="bg-amber-100 shadow-lg sticky top-0 z-50">
            {/* Contenedor principal para W-FULL y Padding */}
            <div className="w-full px-4 sm:px-6 lg:px-8"> 
                {/* Contenido centrado y flexible */}
                <div className="flex justify-between items-center h-16 max-w-7xl mx-auto">
                    
                    {/* Logo / Título */}
                    <NavLink to="/" className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-serif font-bold text-amber-800">Dulce Hogar</span>
                        <span className="text-3xl ml-2" role="img" aria-label="Media Luna">
                            🌙 
                        </span>
                    </NavLink>

                    {/* Enlaces de Navegación Central (COMPACTADO EN MÓVIL) */}
                    {/* Se usa space-x-2 en móvil y space-x-4 en escritorio */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        
                        {/* 🟢 ENLACE INICIO: mx-1 en móvil, mx-4 en escritorio */}
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `text-amber-800 font-semibold hover:text-amber-900 mx-1 md:mx-4 transition-colors ${
                                    isActive ? 'border-b-2 border-amber-800 pb-1' : ''
                                }`
                            }
                        >
                            INICIO
                        </NavLink>
                        
                        {/* 🟢 ENLACE PRODUCTOS: mx-1 en móvil, mx-4 en escritorio */}
                        <NavLink 
                            to="/products" 
                            className={({ isActive }) => 
                                `text-amber-800 font-semibold hover:text-amber-900 mx-1 md:mx-4 transition-colors ${
                                    isActive ? 'border-b-2 border-amber-800 pb-1' : ''
                                }`
                            }
                        >
                            PRODUCTOS
                        </NavLink>
                        
                        {/* 🟢 ENLACE ADMIN: mx-1 en móvil, mx-4 en escritorio */}
                        {user && (
                            <NavLink 
                                to="/admin" 
                                className={({ isActive }) => 
                                    `text-amber-800 font-semibold hover:text-amber-900 mx-1 md:mx-4 transition-colors ${
                                        isActive ? 'border-b-2 border-amber-800 pb-1' : ''
                                    }`
                                }
                            >
                                ADMIN
                            </NavLink>
                        )}
                    </div>

                    {/* Íconos de Usuario y Carrito (COMPACTADO EN MÓVIL) */}
                    {/* Se usa space-x-2 en móvil y space-x-4 en escritorio */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        
                        {/* 🟢 Icono de Carrito: Usamos p-1 en móvil, p-2 en escritorio */}
                        <NavLink to="/cart" className="p-1 sm:p-2 relative rounded-full hover:bg-amber-200 transition-colors">
                            <ShoppingBagIcon className="h-6 w-6 text-amber-800" />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </NavLink>

                        {/* 🟢 Icono de Usuario / Login / Logout: Usamos p-1 en móvil, p-2 en escritorio */}
                        {user ? (
                            <button 
                                onClick={handleLogout} 
                                className="p-1 sm:p-2 rounded-full hover:bg-amber-200 transition-colors group"
                                title="Cerrar Sesión"
                            >
                                <ArrowRightOnRectangleIcon className="h-6 w-6 text-amber-800 group-hover:text-amber-900" />
                            </button>
                        ) : (
                            <NavLink to="/admin-login" className="p-1 sm:p-2 rounded-full hover:bg-amber-200 transition-colors">
                                <UserIcon className="h-6 w-6 text-amber-800" />
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;