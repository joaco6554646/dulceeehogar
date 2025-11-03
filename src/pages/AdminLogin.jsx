import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Asegúrate de importar signInWithEmailAndPassword correctamente desde firebase/auth
import { signInWithEmailAndPassword } from 'firebase/auth'; 
// CORRECCIÓN: Asumo que la ruta correcta es '../firebase/config' si tienes un archivo 'config.js' dentro de la carpeta 'firebase'.
// Si tu archivo se llama 'firebase.js', cámbialo a: import { auth } from '../firebase/firebase';
import { auth } from '../firebase/config'; // Importa la instancia de auth

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Utiliza la función correcta de Firebase: signInWithEmailAndPassword
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Admin logueado con éxito:", userCredential.user.uid);
            
            // REDIRECCIONAR: Si el login es exitoso, navega al dashboard.
            navigate('/admin/dashboard'); 

        } catch (error) {
            console.error("Error de autenticación:", error);
            // Mostrar un mensaje de error más amigable
            let errorMessage = "Error de autenticación. Verifica tu email y contraseña.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "Credenciales incorrectas.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Formato de email inválido.";
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-t-4 border-amber-600">
                <div className="text-center mb-8">
                    <span className="text-5xl" role="img" aria-label="Key">🔑</span>
                    <h2 className="text-3xl font-extrabold text-amber-900 mt-2">Acceso de Administrador</h2>
                    <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales de administrador.</p>
                </div>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-amber-500 focus:border-amber-500 text-base"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-amber-500 focus:border-amber-500 text-base"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white transition duration-150 ${
                            isLoading 
                                ? 'bg-amber-400 cursor-not-allowed' 
                                : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300'
                        }`}
                    >
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                {/* Esta opción de registro es solo un placeholder, no funcional en el admin */}
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        ¿No tienes cuenta? <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-amber-600 hover:text-amber-500">Regístrate aquí.</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
