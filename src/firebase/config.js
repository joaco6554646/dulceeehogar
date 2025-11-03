import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 1. --- Credenciales REALES (tomadas de tu consola) ---
const manualFirebaseConfig = {
    apiKey: "AIzaSyAv57fX1NfXxiKTJPsIlNIwMZUbUZv7B9s", 
    authDomain: "dulcehogar-959f8.firebaseapp.com", 
    projectId: "dulcehogar-959f8", 
    storageBucket: "dulcehogar-959f8.appspot.com", 
    messagingSenderId: "144082820765", 
    appId: "1:144082820765:web:06a0018e4978f630ecbe74", 
};

// Lógica para usar las credenciales inyectadas si estás en Canvas, o las manuales si no
const firebaseConfig = Object.keys(manualFirebaseConfig).some(key => manualFirebaseConfig[key].startsWith('AIzaSy') || manualFirebaseConfig[key].startsWith('1:'))
  ? manualFirebaseConfig
  : JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : JSON.stringify(manualFirebaseConfig));


// 2. Controla la doble inicialización (evita el error 'duplicate-app')
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp(); // Recupera la instancia existente
}

// 3. Exportar los servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const firebaseApp = app;
