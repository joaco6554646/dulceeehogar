import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl max-w-sm mx-auto">
      {/* Icono de Spin (usando una clase simple de Tailwind/CSS) */}
      <div 
        className="w-10 h-10 border-4 border-t-4 border-amber-500 border-t-transparent rounded-full animate-spin"
        role="status"
      >
        <span className="sr-only">Cargando...</span>
      </div>
      
      {/* Mensaje */}
      <p className="mt-4 text-lg font-semibold text-amber-700">
        Cargando Contenido...
      </p>
      <p className="text-sm text-gray-500">
        Verificando estado de la aplicación.
      </p>
    </div>
  );
};

export default LoadingSpinner;