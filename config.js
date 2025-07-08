// Configuración de Supabase - USAR VARIABLES DE ENTORNO
// ⚠️  ESTE ARCHIVO NO DEBE CONTENER CLAVES REALES

export const SUPABASE_URL = 'https://qqudzwtcpwodtejamnjr.supabase.co'
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE'

// Para Stripe (cuando esté listo):
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'YOUR_STRIPE_KEY_HERE'
