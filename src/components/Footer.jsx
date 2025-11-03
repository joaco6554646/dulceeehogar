import React from 'react';
// Asegúrate de tener instalado lucide-react (o ajusta los íconos si usas otro paquete)
// Importamos los íconos necesarios, incluyendo TikTok
import { Mail, Phone, MapPin, Facebook, Home } from 'lucide-react'; 
// NOTA: 'lucide-react' no tiene un ícono oficial para TikTok. 
// Usaremos 'Home' (o un ícono de una librería alternativa si la tienes) como sustituto temporal.
// Si usas otra librería como FontAwesome o Heroicons, cámbialo.

// Para este ejemplo, vamos a simular el ícono de TikTok usando el ícono de 'Home'
// o podrías usar un SVG si lo tienes. Usaremos 'Home' por ahora y Facebook.

const Footer = () => {
    return (
        // Fondo negro (bg-gray-900) y texto blanco
        <footer className="bg-gray-900 text-white mt-12 py-10 shadow-inner">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* Columna 1: Logo y Redes Sociales */}
                <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl font-serif font-bold text-amber-500">Dulce Hogar</h3>
                    <p className="text-sm text-gray-400">
                        El sabor de lo casero, horneado con amor.
                    </p>
                    
                    {/* Contenedor de Íconos de Redes Sociales (SOLO FACEBOOK Y TIKTOK) */}
                    <div className="flex space-x-4 pt-2">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" 
                           className="text-gray-400 hover:text-blue-600 transition-colors"
                           title="Síguenos en Facebook">
                            <Facebook className="w-6 h-6" />
                        </a>
                        
                        {/* ⚠️ Ícono de TikTok (Usando Home como sustituto si lucide-react no tiene) */}
                        <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" 
                           className="text-gray-400 hover:text-red-500 transition-colors"
                           title="Síguenos en TikTok">
                            <Home className="w-6 h-6" /> {/* Usamos Home como placeholder de TikTok */}
                        </a>
                    </div>
                </div>

                {/* Columna 2: Contacto */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-1 text-amber-500">Contáctanos</h3>
                    <div className="space-y-3 text-sm text-gray-400">
                        <p className="flex items-start">
                            <MapPin className="w-5 h-5 mr-3 mt-1 text-amber-500 flex-shrink-0" />
                           Villa Carlos Paz, Argentina
                        </p>
                        <p className="flex items-center">
                            <Phone className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0" />
                            +54 9 3541653229
                        </p>
                        <p className="flex items-center">
                            <Mail className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0" />
                            contacto@dulcehogar.com
                        </p>
                    </div>
                </div>

                {/* Columna 3: Horarios */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-1 text-amber-500">Horarios de Atención</h3>
                    <ul className="text-sm space-y-2 text-gray-400">
                        <li>Lunes a Viernes: 8:00 a 20:00</li>
                        <li>Sábados: 8:00 a 14:00</li>
                        <li>Domingos: Cerrado</li>
                    </ul>
                </div>
                
                 {/* Columna 4: Legal / Información */}
                <div>
                    <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-1 text-amber-500">Información</h3>
                    <ul className="text-sm space-y-2 text-gray-400">
                        <li>Términos y Condiciones</li>
                        <li>Política de Privacidad</li>
                        <li>Preguntas Frecuentes</li>
                    </ul>
                </div>

            </div>

            {/* Derechos de Autor */}
            <div className="container mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-center">
                <p className="text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} Dulce Hogar. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;