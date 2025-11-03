import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 🟢 1. IMPORTAR EL PLUGIN PWA
import { VitePWA } from 'vite-plugin-pwa'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    
    // 🟢 2. CONFIGURACIÓN DEL PLUGIN PWA
    VitePWA({
      registerType: 'autoUpdate', // El Service Worker se actualizará automáticamente
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Archivos estáticos a cachear
      manifest: {
        name: 'Dulce Hogar PWA', // Nombre de la aplicación
        short_name: 'DulceHogar', // Nombre corto para el ícono de inicio
        description: 'La mejor panadería en línea.',
        theme_color: '#FEE300', // Color principal de la aplicación
        background_color: '#ffffff', // Color de fondo al iniciar
        display: 'standalone', // Modo de visualización (se comporta como una app nativa)
        start_url: '/', // Ruta de inicio
        icons: [
          {
            src: '/pwa-192x192.png', // Los iconos deben ir en la carpeta public
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      // 🟢 Opcional: Configuración para cachear datos de Firestore
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
            {
              urlPattern: ({ url }) => url.origin === 'https://firestore.googleapis.com',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'firestore-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
                },
              },
            },
        ],
      },
    })
  ],
});
