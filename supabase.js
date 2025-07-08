// Configuración de Supabase - SIMPLE
// Importamos Supabase desde CDN
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js'

// Importar configuración directamente
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Funciones de autenticación
export const auth = {
  // Registrar usuario
  async signUp(email, password, name) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      })
      
      if (error) throw error
      
      // Crear perfil de usuario
      if (data.user) {
        try {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            name: name,
            email: email,
            user_type: 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          
          if (profileError) {
            console.error('Error al crear perfil:', profileError)
            // No lanzar error aquí, el usuario se creó correctamente
          } else {
            console.log('Perfil creado correctamente para:', name)
          }
        } catch (profileError) {
          console.error('Error inesperado al crear perfil:', profileError)
        }
      }
      
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Error al registrar usuario:', error)
      return { success: false, error: error.message }
    }
  },

  // Iniciar sesión
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      return { success: false, error: error.message }
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session?.user || null
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return null
    }
  },

  // Obtener perfil del usuario
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        // Si no existe el perfil, intentar crearlo
        if (error.code === 'PGRST116') {
          console.log('Perfil no encontrado, creando automáticamente...')
          return await this.createMissingProfile(userId)
        }
        throw error
      }
      
      return { success: true, profile: data }
    } catch (error) {
      console.error('Error al obtener perfil:', error)
      return { success: false, error: error.message }
    }
  },

  // Crear perfil faltante
  async createMissingProfile(userId) {
    try {
      // Obtener datos del usuario de auth
      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      const profileData = {
        id: userId,
        full_name: userData?.user?.user_metadata?.full_name || 'Usuario',
        avatar_url: userData?.user?.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()
      
      if (error) throw error
      
      console.log('Perfil creado automáticamente:', profileData.full_name)
      return { success: true, profile: data }
    } catch (error) {
      console.error('Error al crear perfil automáticamente:', error)
      return { success: false, error: error.message }
    }
  }
}

// Funciones de tours
export const tours = {
  // Obtener todos los tours
  async getTours() {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al obtener tours:', error)
      return []
    }
  },

  // Guardar rating de tour
  async saveTourRating(tourId, userId, rating, feedback) {
    try {
      const { data, error } = await supabase
        .from('tour_ratings')
        .insert({
          tour_id: tourId,
          user_id: userId,
          rating: rating,
          feedback: feedback,
          created_at: new Date().toISOString()
        })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al guardar rating:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener progreso del usuario
  async getUserProgress(userId) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          tours (
            title,
            description,
            type
          )
        `)
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al obtener progreso:', error)
      return []
    }
  },

  // Registrar/actualizar progreso del tour
  async updateTourProgress(userId, tourId, currentLocation, totalPoints, progress, completed = false) {
    try {
      const { data, error } = await supabase.rpc('upsert_user_progress', {
        p_user_id: userId,
        p_tour_id: tourId,
        p_current_location: currentLocation,
        p_total_points: totalPoints,
        p_progress: progress,
        p_completed: completed
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al actualizar progreso:', error)
      return { success: false, error: error.message }
    }
  },

  // Iniciar un tour
  async startTour(userId, tourId, totalPoints) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          tour_id: tourId,
          current_location: 1,
          total_points: totalPoints,
          progress: 0,
          completed: false,
          started_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,tour_id'
        })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al iniciar tour:', error)
      return { success: false, error: error.message }
    }
  },

  // Completar un tour
  async completeTour(userId, tourId, totalPoints) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          tour_id: tourId,
          current_location: totalPoints,
          total_points: totalPoints,
          progress: totalPoints,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,tour_id'
        })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al completar tour:', error)
      return { success: false, error: error.message }
    }
  },

  // Obtener estadísticas del usuario
  async getUserStats(userId) {
    try {
      // Obtener número de tours completados
      const { data: completedData, error: completedError } = await supabase
        .from('user_progress')
        .select('tour_id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('completed', true)
      
      if (completedError) throw completedError
      
      // Obtener puntuación media de los ratings del usuario
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('tour_ratings')
        .select('rating')
        .eq('user_id', userId)
      
      if (ratingsError) throw ratingsError
      
      let averageRating = 0
      if (ratingsData && ratingsData.length > 0) {
        const totalRating = ratingsData.reduce((sum, rating) => sum + rating.rating, 0)
        averageRating = Math.round((totalRating / ratingsData.length) * 10) / 10
      }
      
      return {
        completedTours: completedData ? completedData.length : 0,
        averageRating: averageRating
      }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      return {
        completedTours: 0,
        averageRating: 0
      }
    }
  },

  // Obtener favoritos del usuario
  async getUserFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error al obtener favoritos:', error)
      return []
    }
  },

  // Agregar tour a favoritos
  async addFavorite(userId, tourId) {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          tour_id: tourId
        })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al agregar favorito:', error)
      throw error
    }
  },

  // Eliminar tour de favoritos
  async removeFavorite(userId, tourId) {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('tour_id', tourId)
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error al eliminar favorito:', error)
      throw error
    }
  }
}

// Función para verificar y crear tablas necesarias
async function ensureTablesExist() {
  try {
    // Verificar si la tabla user_favorites existe
    const { data, error } = await supabase.rpc('check_table_exists', {
      table_name: 'user_favorites'
    })
    
    // Si la función RPC no existe, intentar crear la tabla directamente
    if (error && error.code === '42883') {
      console.log('Intentando crear tabla user_favorites...')
      
      // Crear la tabla usando una consulta SQL
      const { error: createError } = await supabase.rpc('create_favorites_table')
      
      if (createError) {
        console.error('Error al crear tabla:', createError)
        // Fallback: mostrar mensaje informativo
        console.log('Por favor, ejecuta el script add-favorites-table.sql en tu base de datos de Supabase')
      } else {
        console.log('Tabla user_favorites creada exitosamente')
      }
    }
  } catch (error) {
    console.error('Error verificando tablas:', error)
  }
}

// Escuchar cambios en la autenticación
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('Usuario autenticado:', session.user)
    // Dejar que script.js maneje el UI
    window.dispatchEvent(new CustomEvent('userSignedIn', { detail: session.user }))
  } else if (event === 'SIGNED_OUT') {
    console.log('Usuario desconectado')
    // Dejar que script.js maneje el UI
    window.dispatchEvent(new CustomEvent('userSignedOut'))
  }
})

// Exportar el cliente de Supabase por si se necesita
export { supabase }
