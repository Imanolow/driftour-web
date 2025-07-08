// Configuración de Supabase - DETECCIÓN AUTOMÁTICA DE ENTORNO
// ⚠️  Este archivo detecta automáticamente si está en local o GitHub Pages

// Detectar entorno
const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const isGitHubPages = location.hostname === 'imanolow.github.io';

// Configuración según entorno
export const SUPABASE_URL = 'https://qqudzwtcpwodtejamnjr.supabase.co'

// Para local: intentar importar config.local.js (si existe)
// Para GitHub Pages: usar clave temporal (DEBE ROTARSE)
export const SUPABASE_ANON_KEY = isLocal 
  ? 'WILL_BE_LOADED_FROM_CONFIG_LOCAL' // Se sobrescribirá por config.local.js
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxdWR6d3RjcHdvZHRlamFtbmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODI3NjIsImV4cCI6MjA2NzQ1ODc2Mn0.xJEmY2wjPKGbbqKF0zCmHc2ai829I2LIw99ZDom2GEs' // TEMPORAL - ROTAR INMEDIATAMENTE

// Para Stripe (cuando esté listo):
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_tu-clave-de-stripe-aqui'
