// Versión de la aplicación para forzar refresco
export const APP_VERSION = 'v8.0.0';
export const LAST_UPDATE = new Date().toISOString();
export const BUILD_ID = Math.random().toString(36).substring(2, 15);

// Este archivo ayuda a forzar recarga en GitHub Pages
console.log(`DrifTour ${APP_VERSION} | Build: ${BUILD_ID} | Updated: ${LAST_UPDATE}`);
