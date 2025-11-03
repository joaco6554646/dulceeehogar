import React from 'react';
import { NavLink } from 'react-router-dom';
// Se usa Cog6ToothIcon para el ícono de administración
import { Cog6ToothIcon, StarIcon } from '@heroicons/react/24/outline'; 

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-amber-50">
            
            {/* -------------------- 1. SECCIÓN PRINCIPAL / HERO -------------------- */}
            <header className="pt-20 pb-24 text-center bg-amber-100/50">
                
                {/* 🌙 Ícono y Título Grande */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <span className="text-6xl mb-2" role="img" aria-label="Media Luna">
                        🌙 
                    </span>
                    <h1 className="text-5xl font-serif font-extrabold text-amber-900 leading-tight">
                        Dulce Hogar
                    </h1>
                    <p className="text-lg text-amber-700 italic mt-2">
                        El sabor de lo casero, horneado con amor.
                    </p>
                </div>

            </header>

            {/* -------------------- 2. SECCIÓN DE PRODUCTOS Y ADMIN -------------------- */}
            <section className="py-20 text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-4">
                    Descubre Nuestros Productos Artesanales
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-10">
                    Desde el clásico pan de masa madre hasta nuestras tortas de celebración, todo está preparado fresco cada mañana.
                </p>

                {/* 🟢 BOTONES: SOLO ÁREA DE ADMINISTRACIÓN */}
                <div className="flex justify-center mt-10">
                    
                    {/* Botón: Área de Administración (Se mantiene para el login de admin) */}
                    <NavLink 
                        to="/admin-login" // Ruta para el login de administración
                        className="flex items-center justify-center px-8 py-3 border border-amber-700 text-base font-medium rounded-md text-amber-800 bg-white hover:bg-amber-50 transition-colors shadow-md"
                    >
                        Área de Administración
                        <Cog6ToothIcon className="h-5 w-5 ml-2 text-amber-700" />
                    </NavLink>

                </div>
            </section>
            
            {/* -------------------- 3. COMPROMISO CON LA CALIDAD -------------------- */}
            <section className="bg-amber-200/40 py-16 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h3 className="text-3xl font-serif font-bold text-amber-900 mb-4 flex items-center justify-center">
                        <StarIcon className="w-8 h-8 mr-3 text-yellow-600" />
                        Compromiso con la Calidad
                    </h3>
                    <p className="text-xl text-gray-700">
                        Usamos ingredientes locales y frescos, sin conservantes. ¡La verdadera panadería de barrio!
                    </p>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;