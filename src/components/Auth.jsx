import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart'; 
// Eliminada la línea: import PropTypes from 'prop-types';

/**
 * Componente de formulario de autenticación para clientes y administradores.
 * Utiliza el hook useCart (que maneja Firebase Auth) para iniciar sesión/registro.
 */
const Auth = ({ isAdmin = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // El estado de isLogin define si el formulario es de Iniciar Sesión o Registrarse
    const [isLogin, setIsLogin] = useState(true); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const { signIn, signUp, user } = useCart(); 
    const navigate = useNavigate();

    // 1. Redirección de usuario ya logueado
    // Redirige al administrador
    if (user && user.email === 'admin@dulcehogar.com' && isAdmin) {
        navigate('/admin/dashboard');
        return null;
    }
    // Redirige a clientes
    if (user && !isAdmin) {
         navigate('/');
         return null;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            setLoading(false);
            return;
        }
        
        // Evita que un cliente se registre accidentalmente como admin si está en la vista de admin
        if (!isLogin && isAdmin && email !== 'admin@dulcehogar.com') {
             setError('Solo se permite el registro con el correo específico del administrador.');
             setLoading(false);
             return;
        }

        try {
            if (isLogin) {
                // Intenta iniciar sesión
                await signIn(email, password);
            } else {
                // Intenta registrarse
                await signUp(email, password);
            }
        } catch (err) {
            console.error("Firebase Auth Error:", err);

            // Mapeo de mensajes de error de Firebase
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Credenciales incorrectas. El usuario o la contraseña no coinciden.');
            } else if (err.code === 'auth/email-already-in-use') {
                 setError('Este email ya está registrado. Intenta iniciar sesión.');
            } else {
                setError(`Error de autenticación: ${err.message.split('(')[0] || 'Error desconocido'}.`);
            }
        } finally {
            setLoading(false);
        }
    };

    const title = isAdmin ? 
        (isLogin ? "Acceso de Administrador 🔑" : "Registro de Administrador") :
        (isLogin ? "Iniciar Sesión Cliente" : "Crear Cuenta Cliente");

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl border border-amber-200">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">{title}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        placeholder="ejemplo@correo.com"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Mínimo 6 caracteres"
                        required
                        disabled={loading}
                    />
                </div>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                
                <button
                    type="submit"
                    className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-300 shadow-md disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : isLogin ? 'Ingresar' : 'Registrarme'}
                </button>
            </form>

            <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-4 w-full text-sm text-amber-900 hover:underline transition duration-300"
                disabled={loading}
            >
                {isLogin ? 
                    "¿No tienes cuenta? Regístrate aquí." : 
                    "¿Ya tienes cuenta? Inicia sesión."
                }
            </button>
        </div>
    );
};

// Eliminada la sección: Auth.propTypes = { ... };

export default Auth;
