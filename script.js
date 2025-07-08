// Importar funciones de Supabase
import { auth, tours } from './supabase.js';
// import { stripe, createPaymentSession } from './stripe.js'; // Comentado por ahora

// Variables globales
let selectedTour = null;
let selectedTourId = null; // ID real del tour de Supabase
let selectedTime = '1h';
let selectedAccessibility = [];
let currentPoint = 1;
let totalPoints = 5;
let currentRating = 0;
let tourStarted = false;
let isPremiumUser = false;
let userName = 'Usuario/a';
let isNightMode = false;
let audioPlaying = false;
let audioProgress = 0;
let audioSpeed = 1;
let audioInterval;

// Sistema de historial de navegación
let navigationHistory = [];
const maxHistorySize = 10;

// Mapeo de tipos de tour a IDs de Supabase
let tourTypeToIdMap = {}

// Sistema de notificaciones
function showNotification(message, type = 'success', duration = 3000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => container.removeChild(notification), 400);
    }, duration);
}

// Toggle modo nocturno
function toggleNightMode() {
    isNightMode = !isNightMode;
    const body = document.body;
    const container = document.getElementById('main-container');
    const nightModeIcon = document.getElementById('night-mode-icon');
    const nightModeText = document.getElementById('night-mode-text');
    
    if (isNightMode) {
        body.classList.add('night-mode');
        container.classList.add('night-mode');
        if (nightModeIcon) nightModeIcon.textContent = '☀️';
        if (nightModeText) nightModeText.textContent = 'Modo Diurno';
        showNotification('Modo nocturno activado', 'info');
    } else {
        body.classList.remove('night-mode');
        container.classList.remove('night-mode');
        if (nightModeIcon) nightModeIcon.textContent = '🌙';
        if (nightModeText) nightModeText.textContent = 'Modo Nocturno';
        showNotification('Modo día activado', 'info');
    }
}

// Controles de audio
function toggleAudio() {
    const btn = document.getElementById('audio-btn');
    audioPlaying = !audioPlaying;
    
    if (audioPlaying) {
        btn.textContent = '⏸️';
        btn.classList.add('playing');
        startAudioProgress();
        showNotification('Reproduciendo audio explicativo', 'info', 2000);
    } else {
        btn.textContent = '▶️';
        btn.classList.remove('playing');
        stopAudioProgress();
    }
}

function startAudioProgress() {
    audioInterval = setInterval(() => {
        audioProgress += (1 / audioSpeed);
        if (audioProgress >= 100) {
            audioProgress = 100;
            stopAudioProgress();
            document.getElementById('audio-btn').textContent = '▶️';
            document.getElementById('audio-btn').classList.remove('playing');
            showNotification('Audio completado', 'success', 2000);
        }
        updateAudioDisplay();
    }, 50);
}

function stopAudioProgress() {
    if (audioInterval) {
        clearInterval(audioInterval);
        audioInterval = null;
    }
}

function updateAudioDisplay() {
    const progressBar = document.getElementById('audio-progress');
    const timeDisplay = document.getElementById('audio-time');
    progressBar.style.width = audioProgress + '%';
    
    const currentTime = Math.floor((audioProgress / 100) * 60); // Asumiendo 60 segundos por explicación
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function changeSpeed() {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(audioSpeed);
    audioSpeed = speeds[(currentIndex + 1) % speeds.length];
    document.getElementById('speed-btn').textContent = `${audioSpeed}x`;
    showNotification(`Velocidad: ${audioSpeed}x`, 'info', 1500);
}

function skipExplanation() {
    stopAudioProgress();
    audioProgress = 100;
    updateAudioDisplay();
    document.getElementById('audio-btn').textContent = '▶️';
    document.getElementById('audio-btn').classList.remove('playing');
    showNotification('Explicación omitida', 'warning', 2000);
}

function showFunFacts() {
    // No mostrar curiosidades en el Tour Aventura para evitar spoilers
    if (selectedTour === 'adventure') {
        showNotification('🔍 ¡Sigue las pistas para descubrir los secretos por ti mismo!', 'info', 3000);
        return;
    }
    
    const facts = {
        1: "💡 ¿Sabías que las Siete Calles originales eran: Somera, Artecalle, Tendería, Belostikale, Carnicería Vieja, Barrencalle y Barrencalle Barrena? Cada una tenía su propio gremio artesanal.",
        2: "💡 El Guggenheim tiene más de 33,000 placas de titanio y ninguna es igual a otra. El edificio cambia de color según la luz del día.",
        3: "💡 Juan Crisóstomo Arriaga compuso su única ópera 'Los esclavos felices' a los 13 años. Mozart del Norte lo llamaban.",
        4: "💡 La Catedral de Santiago fue construída sobre un antiguo templo romano. En sus criptas se han encontrado restos arqueológicos fascinantes.",
        5: "💡 El Mercado de la Ribera aparece en el Libro Guinness como el mercado cubierto más grande de Europa con sus 10,000 metros cuadrados."
    };
    
    showNotification(facts[currentPoint] || "💡 ¡Lugar fascinante lleno de historia!", 'info', 5000);
}

// Función para mostrar/ocultar la cabecera
function toggleHeader(show) {
    const header = document.getElementById('app-header');
    if (show) {
        header.style.display = 'flex';
    } else {
        header.style.display = 'none';
    }
}

// Función para actualizar el estado del usuario
function updateUserStatus() {
    const userNameEl = document.getElementById('user-name');
    const userTypeEl = document.getElementById('user-type');
    const premiumBtn = document.getElementById('premium-btn');
    
    if (userNameEl) userNameEl.textContent = userName;
    
    if (isPremiumUser) {
        if (userTypeEl) userTypeEl.textContent = '(Premium)';
        if (premiumBtn) {
            premiumBtn.textContent = 'Premium ✓';
            premiumBtn.classList.add('premium-user');
        }
    } else {
        if (userTypeEl) userTypeEl.textContent = '(Gratuito)';
        if (premiumBtn) {
            premiumBtn.textContent = 'Hazte Premium';
            premiumBtn.classList.remove('premium-user');
        }
    }
}

// Función para mostrar popups
function showPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) popup.classList.add('active');
}

// Función para cerrar popups
function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) popup.classList.remove('active');
}

// Función para manejar click en el menú de usuario
function toggleUserMenu() {
    showPopup('user-popup');
}

// Función para manejar click en el botón premium
function togglePremiumPopup() {
    if (!isPremiumUser) {
        showPopup('premium-popup');
    } else {
        showNotification('¡Ya eres usuario Premium! Disfruta de todas las ventajas 🎉', 'success');
    }
}

// Funciones del menú de usuario
async function showProfile() {
    closePopup('user-popup');
    
    // Obtener datos del usuario actual
    const currentUser = await auth.getCurrentUser();
    
    if (currentUser) {
        const userEmail = currentUser.email;
        const userCreated = new Date(currentUser.created_at).toLocaleDateString('es-ES');
        
        // Obtener estadísticas del usuario
        const stats = await getUserStats(currentUser.id);
        
        // Crear el contenido del perfil
        const profileContent = `
            <div style="text-align: center; padding: 20px;">
                <h3>👤 Mi Perfil</h3>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 15px 0;">
                    <p><strong>Nombre:</strong> ${userName}</p>
                    <p><strong>Email:</strong> ${userEmail}</p>
                    <p><strong>Miembro desde:</strong> ${userCreated}</p>
                </div>
                <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin: 15px 0;">
                    <p><strong>🎯 Tours Completados:</strong> ${stats.completedTours}</p>
                    <p><strong>⭐ Puntuación Media:</strong> ${stats.averageRating}/5</p>
                </div>
                <button onclick="closeCustomPopup()" class="tour-btn" style="margin-top: 15px;">Cerrar</button>
            </div>
        `;
        
        // Crear popup personalizado
        createCustomPopup('Perfil de Usuario', profileContent);
    } else {
        showNotification('Error al obtener datos del usuario', 'error');
    }
}

function showSettings() {
    closePopup('user-popup');
    showNotification('Configuración - Próximamente disponible', 'info');
}

function logout() {
    closePopup('user-popup');
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Usar Supabase para cerrar sesión
        auth.signOut().then(result => {
            if (result.success) {
                showScreen('login-screen');
                toggleHeader(false);
                showNotification('Sesión cerrada correctamente', 'info');
            } else {
                showNotification('Error al cerrar sesión', 'error');
            }
        });
    }
}

// Función para simular diferentes usuarios (solo para desarrollo)
function simulateUser(userType) {
    if (userType === 'premium') {
        userName = 'María';
        isPremiumUser = true;
    } else {
        userName = 'Ana';
        isPremiumUser = false;
    }
    updateUserStatus();
}

// Función para suscribirse a Premium
function subscribeToPremium() {
    isPremiumUser = true;
    updateUserStatus();
    closePopup('premium-popup');
    showNotification('¡Bienvenido a Premium! 🎉\nYa puedes disfrutar de todas las ventajas', 'success', 4000);
}

function showScreen(screenId) {
    // Obtener pantalla actual antes del cambio
    const currentScreen = document.querySelector('.screen.active');
    const currentScreenId = currentScreen ? currentScreen.id : null;
    
    // Agregar al historial (excepto si es la misma pantalla o volvemos atrás)
    if (currentScreenId && currentScreenId !== screenId) {
        navigationHistory.push(currentScreenId);
        // Limitar tamaño del historial
        if (navigationHistory.length > maxHistorySize) {
            navigationHistory.shift();
        }
    }
    
    // Ocultar todas las pantallas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Mostrar la pantalla seleccionada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // Mostrar/ocultar cabecera según la pantalla
    const screensWithoutHeader = ['login-screen', 'register-screen'];
    if (screensWithoutHeader.includes(screenId)) {
        toggleHeader(false);
    } else {
        toggleHeader(true);
        updateUserStatus();
    }
    
    // Resetear rating cuando se muestre la pantalla de valoración
    if (screenId === 'rating-screen') {
        currentRating = 0;
        updateRatingButtons();
    }
    
    console.log('Navegando a:', screenId, 'Historial:', navigationHistory);
}

// Función para ir atrás en el historial
function goBack() {
    if (navigationHistory.length > 0) {
        const previousScreen = navigationHistory.pop();
        // Navegar sin agregar al historial
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        
        const targetScreen = document.getElementById(previousScreen);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
        
        // Manejar cabecera
        const screensWithoutHeader = ['login-screen', 'register-screen'];
        if (screensWithoutHeader.includes(previousScreen)) {
            toggleHeader(false);
        } else {
            toggleHeader(true);
            updateUserStatus();
        }
        
        console.log('Volviendo a:', previousScreen, 'Historial restante:', navigationHistory);
    } else {
        // Si no hay historial, ir al mapa principal
        showScreen('map-screen');
    }
}

// Hacer las funciones accesibles globalmente para onclick
window.showScreen = showScreen;
window.goBack = goBack;
window.closePopup = closePopup;
window.closeCustomPopup = closeCustomPopup;
window.showProfile = showProfile;
window.showTourHistory = showTourHistory;
window.showFavorites = showFavorites;
window.toggleFavorite = toggleFavorite;
window.toggleNightMode = toggleNightMode;
window.showSettings = showSettings;
window.logout = logout;
window.subscribeToPremium = subscribeToPremium;
window.selectTour = selectTour;
window.selectHumanTour = selectHumanTour;
window.copyLink = copyLink;
window.initializeTour = initializeTour;
window.nextPoint = nextPoint;
window.revealLocation = revealLocation;
window.toggleAudio = toggleAudio;
window.skipExplanation = skipExplanation;
window.changeSpeed = changeSpeed;
window.showFunFacts = showFunFacts;
window.selectRating = selectRating;
window.submitRating = submitRating;
window.shareOn = shareOn;

// Función para seleccionar tour
function selectTour(tourType) {
    // Tours temáticos - próximamente
    if (tourType === 'themed') {
        showNotification('🎭 Próximamente... Estamos preparando tours temáticos especiales para ti', 'info', 4000);
        return;
    }
    
    // Tours teatralizados - reservas con guías humanos
    if (tourType === 'theatrical') {
        showNotification('🎨 Redirigiendo a página de reservas... Tours con guías humanos disponibles', 'info', 4000);
        // Aquí se redirigiría a un sistema de reservas real
        setTimeout(() => {
            showNotification('📞 Contáctanos para reservar tu tour teatralizado', 'info', 3000);
        }, 4000);
        return;
    }
    
    // Tours normales (simple, adventure, historic)
    selectedTour = tourType;
    selectedTourId = tourTypeToIdMap[tourType] || null;
    currentPoint = 1; // Reiniciar el contador
    showScreen('share-screen');
    
    // Mensaje según el tipo de tour
    const tourMessages = {
        'simple': 'Tour Simple seleccionado - ¡GRATIS! 🏛️',
        'adventure': 'Tour Aventura seleccionado - ¡GRATIS! 🔍',
        'historic': 'Tour Histórico seleccionado - Con actores reales 👨‍🎓'
    };
    
    showNotification(tourMessages[tourType] || `Tour ${tourType} seleccionado`, 'success');
    
    console.log('Tour seleccionado:', tourType, 'ID:', selectedTourId);
}

// Función para seleccionar tour teatralizado
function selectHumanTour(tourType) {
    showNotification(`¡Has seleccionado el tour "${tourType}"! Te redirigiremos a la página de reservas.`, 'info', 4000);
    // Aquí se redirigiría a un sistema de reservas real
}

// Siguiente punto en el tour
async function nextPoint() {
    currentPoint++;
    
    // Registrar progreso del tour en Supabase Y LocalStorage
    const currentUser = await auth.getCurrentUser();
    if (currentUser && selectedTourId) {
        try {
            const completed = currentPoint > totalPoints;
            const progress = completed ? totalPoints : currentPoint - 1;
            
            // Guardar en localStorage como backup
            const localProgress = JSON.parse(localStorage.getItem('tour_progress') || '[]');
            const existingIndex = localProgress.findIndex(p => p.user_id === currentUser.id && p.tour_id === selectedTourId);
            
            const progressData = {
                user_id: currentUser.id,
                tour_id: selectedTourId,
                current_point: currentPoint,
                total_points: totalPoints,
                progress: progress,
                completed: completed,
                last_updated: new Date().toISOString()
            };
            
            if (existingIndex >= 0) {
                localProgress[existingIndex] = progressData;
            } else {
                localProgress.push(progressData);
            }
            
            localStorage.setItem('tour_progress', JSON.stringify(localProgress));
            console.log('Progreso guardado localmente:', progressData);
            
            if (completed) {
                // Completar el tour
                const result = await tours.completeTour(currentUser.id, selectedTourId, totalPoints);
                if (result.success) {
                    console.log('Tour completado y registrado en Supabase');
                }
            } else {
                // Actualizar progreso
                const result = await tours.updateTourProgress(
                    currentUser.id, 
                    selectedTourId, 
                    currentPoint, 
                    totalPoints, 
                    progress, 
                    false
                );
                if (result.success) {
                    console.log('Progreso actualizado en Supabase');
                }
            }
        } catch (error) {
            console.error('Error al actualizar progreso del tour:', error);
            showNotification('Progreso guardado localmente', 'info', 2000);
        }
    }
    
    if (currentPoint > totalPoints) {
        showScreen('rating-screen');
        showNotification('¡Tour completado! 🎉', 'success');
        return;
    }

    // Reset audio
    audioProgress = 0;
    audioPlaying = false;
    stopAudioProgress();
    const audioBtn = document.getElementById('audio-btn');
    if (audioBtn) {
        audioBtn.textContent = '▶️';
        audioBtn.classList.remove('playing');
    }
    updateAudioDisplay();

    const progressPercent = (currentPoint / totalPoints) * 100;
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
    
    showNotification(`Punto ${currentPoint} de ${totalPoints}`, 'info', 2000);
    
    // Contenido de los tours
    const tourDescriptions = {
        simple: {
            1: "🏛️ **El Casco Viejo de Bilbao - Las Siete Calles Originales**\n\nFundado en 1300 por Don Diego López de Haro V, el Casco Viejo es el núcleo original de Bilbao. Las famosas 'Zazpi Kaleak' (Siete Calles en euskera) eran: Somera, Artecalle, Tendería, Belostikale, Carnicería Vieja, Barrencalle y Barrencalle Barrena.\n\nCada calle albergaba gremios específicos: los herreros en Somera, los comerciantes de telas en Tendería, y los carniceros en Carnicería Vieja. Sus soportales de piedra protegían las mercancías de la lluvia atlántica.\n\n🔍 **Detalles arquitectónicos**: Observa los escudos heráldicos en las fachadas, que narran historias de familias nobles y comerciantes prósperos que construyeron la riqueza de Bilbao.",
            
            2: "🏛️ **Museo Guggenheim Bilbao - La Maravilla de Titanio**\n\nInaugurado en 1997, este coloso de 24,000 metros cuadrados revolucionó Bilbao. Frank Gehry utilizó tecnología aeroespacial para diseñar sus curvas imposibles, revestidas con 33,000 placas únicas de titanio que nunca se oxidan.\n\nEl 'efecto Guggenheim' transformó Bilbao de ciudad industrial a metrópoli cultural, atrayendo un millón de visitantes anuales. Su silueta evoca un barco, honrando el pasado marítimo de la ciudad.\n\n🎨 **Obra destacada**: 'Puppy' de Jeff Koons custodia la entrada con sus 70,000 flores que cambian según la estación, convirtiéndose en símbolo viviente de la renovación urbana.",
            
            3: "🎭 **Teatro Arriaga - El Templo de las Artes Vascas**\n\nInaugurado en 1890, este teatro neorenacentista rinde homenaje a Juan Crisóstomo Arriaga (1806-1826), el 'Mozart vasco' que compuso sinfonías a los 15 años. Su fachada imita la Ópera de París, con esculturas alegóricas de la Música y la Poesía.\n\nSu interior, decorado en rojos y dorados, ha visto actuar a Sarah Bernhardt, María Callas y Plácido Domingo. Los frescos del techo narran la mitología vasca: Mari, la diosa madre, y Sugaar, el señor de las tormentas.\n\n🎼 **Curiosidad musical**: Su órgano Steinway de 1885 aún funciona perfectamente y se usa en conciertos especiales navideños.",
            
            4: "⛪ **Catedral de Santiago - Guardian Espiritual de Bilbao**\n\nErigida en el siglo XIV sobre un templo románico anterior, esta catedral gótica custodia las reliquias de Santiago el Mayor. Su torre de 64 metros domina el skyline del Casco Viejo desde hace 600 años.\n\nSantiago es patrón de Bilbao y España. Su festividad (25 julio) marca la 'Aste Nagusia', la semana grande bilbaína. En las criptas reposan nobles medievales y obispos que forjaron la identidad cristiana de Vizcaya.\n\n🔔 **Las campanas**: Sus cinco campanas anuncian las horas desde 1483. La mayor, 'María', pesa 3 toneladas y su tañido se escucha hasta la ría, guiando a marineros perdidos en la niebla atlántica.",
            
            5: "🍎 **Mercado de la Ribera - Catedral Gastronómica**\n\nConstruido en 1929 en estilo Art Déco, es el mercado cubierto más grande de Europa según el Libro Guinness. Sus 10,000 m² albergan 65 puestos que exhiben lo mejor del mar Cantábrico y los valles vascos.\n\nAquí convergen pescadores de Bermeo, ganaderos de Gorbea y hortelanos de Álava. Los 'neskatillas' (jóvenes vendedoras) ofrecen txakoli del año, queso idiazábal curado en cuevas y besugo de anzuelo.\n\n👨‍🍳 **Gastronomía**: Este templo culinario abastece a los mejores restaurantes con estrellas Michelin. Sus productos frescos son la base de la revolución gastronómica vasca que conquistó el mundo."
        },
        adventure: {
            1: "🔍 **Pista Inicial - El Origen de las Siete**\n\nEn el año 1300, un noble vizcaíno fundó un pueblo comercial junto al río. Siete calles paralelas formaron su corazón, cada una especializada en un oficio diferente. Los mercaderes llegaban por mar y tierra para intercambiar hierro vasco por lana castellana y pescado cantábrico.\n\n🕵️ **Tu misión**: Encuentra el lugar donde estas siete arterias cobran vida. Busca las piedras más antiguas, los soportales que protegían las mercancías, y los escudos que narran historias de hace 700 años.\n\n💡 **Pista adicional**: En una de estas calles, los herreros forjaban las mejores armas de Europa. Su nombre aún recuerda su ubicación 'superior' respecto al río...",
            
            2: "🔍 **Segunda Pista - La Nave Que No Navega**\n\nUn visionario arquitecto del siglo XX soñó con formas que bailaran con la luz atlántica. Utilizó 33,000 piezas metálicas únicas para crear una embarcación terrestre que transformó una ciudad industrial en capital cultural mundial.\n\n🎨 **Tu desafío**: Localiza esta maravilla contemporánea cuyas curvas imposibles desafían la gravedad. Un perro gigante de flores custodia su entrada, y en su interior, el arte contemporáneo dialoga con la innovación tecnológica.\n\n⚡ **Pista clave**: Su creador empleó los mismos programas que Boeing usa para diseñar aviones. El 'efecto' que lleva su nombre cambió Bilbao para siempre...",
            
            3: "🔍 **Tercera Pista - El Palacio del Joven Genio**\n\nUn músico prodigioso nacido en estas tierras compuso sinfonías a los 15 años y murió en París a los 19, llevándose consigo el secreto de melodías que nunca conoceremos. Un palacio de las artes lleva su nombre y custodia su memoria.\n\n🎭 **Tu búsqueda**: Encuentra este templo neorenacentista donde resonaron las voces más ilustres de Europa. Sarah Bernhardt lloró aquí, y María Callas hizo vibrar sus muros. Su fachada imita la ópera más famosa del mundo.\n\n🎼 **Pista musical**: Lo llamaban el 'Mozart del Norte'. Su apellido vasco significa 'lugar pedregoso'. El teatro que honra su memoria abrió sus puertas cuando la Torre Eiffel ya dominaba París...",
            
            4: "🔍 **Cuarta Pista - El Protector de las Alturas**\n\nDesde hace seis siglos, una torre gótica se alza como guardián silencioso de la villa. En su interior, el patrón de España y de esta ciudad bendice a peregrinos que siguen un camino milenario hacia el fin del mundo conocido.\n\n⛪ **Tu peregrinaje**: Asciende hasta donde las campanas medievales marcan el tiempo desde 1483. La mayor pesa tres toneladas y su voz guía a marineros perdidos en la niebla cantábrica.\n\n🔔 **Pista sagrada**: Cada 25 de julio, toda la ciudad celebra a este santo soldado. Su festividad marca la semana más importante del año bilbaíno. Su nombre también designa una ruta europea de peregrinación...",
            
            5: "🔍 **Quinta Pista - El Encuentro de Sabores**\n\nDonde el mar besa a la tierra, donde los valles abrazan a los montes, se alza un templo gastronómico que el Libro Guinness reconoce como el más grande de su tipo en Europa. Aquí convergen los tesoros culinarios de tres provincias.\n\n🍽️ **Tu destino final**: Localiza este edificio Art Déco de 1929 donde 65 comerciantes exhiben lo mejor del Cantábrico y los valles vascos. Las 'neskatillas' ofrecen productos que alimentan a restaurantes con estrellas Michelin.\n\n🏆 **Pista definitiva**: Sus 10,000 metros cuadrados de superficie lo convierten en récord mundial. Su ubicación 'ribereña' le da nombre, y en sus puestos nació la revolución gastronómica que conquistó el planeta..."
        },
        historic: {
            1: "👨‍🎓 **Miguel de Unamuno te saluda desde la eternidad**\n\n'Queridos caminantes del tiempo, soy Miguel de Unamuno, y estas piedras que pisáis fueron testigo de mis pasos juveniles. El Casco Viejo late con el corazón de la auténtica Bilbao, donde cada adoquín es un verso de nuestra intrahistoria.'\n\n📚 **Reflexión unamuniana**: 'Aquí, en estas Siete Calles, aprendí que la tradición no es ceniza muerta, sino brasa viva que enciende el alma de los pueblos. Los comerciantes medievales que transitaron estos soportales tejían, sin saberlo, el destino de una nación.'\n\n✍️ **Mensaje del filósofo**: 'Observad los escudos heráldicos: cada uno narra una epopeya familiar. Como escribí alguna vez: \"Los pueblos que olvidan su historia están condenados a repetir sus errores\". Estas calles son páginas vivas de nuestro ser colectivo.'",
            
            2: "👨‍🎓 **Unamuno contempla la modernidad**\n\n'Desde mi eterno descanso contemplo esta maravilla moderna que transformó mi Bilbao. El Guggenheim es la prueba viviente de que nuestra tierra no teme al futuro, sino que lo abraza sin renunciar a su esencia.'\n\n🏛️ **Meditación del sabio**: 'Frank Gehry ha logrado lo que yo siempre prediqué: que la tradición sea sedimento fértil de la innovación. Estas curvas imposibles dialogan con nuestros montes eternos, y este titanio refleja la luz atlántica que bañó mi juventud.'\n\n💭 **Filosofía unamuniana**: 'Como escribí: \"La tradición es la sustancia de la historia\". Este museo demuestra que Bilbao no museifica su pasado, sino que lo proyecta hacia horizontes inexplorados. ¡Qué orgulloso me siento de esta metamorfosis!'",
            
            3: "👨‍🎓 **Unamuno evoca al genio musical**\n\n'¡Ah, el Teatro Arriaga! Aquí resonaron mis versos y los de tantos hermanos en las letras. Este templo de las artes lleva el nombre de nuestro Mozart vasco, Juan Crisóstomo Arriaga, genio que nos dejó demasiado pronto para la gloria eterna.'\n\n🎼 **Homenaje del rector**: 'Arriaga compuso a los 15 años lo que otros no logran en una vida entera. Su sinfonía en Re menor rivalizaba con las de Beethoven. ¡Qué no habría dado la humanidad por tenerlo 50 años más entre nosotros!'\n\n🎭 **Reflexión cultural**: 'En este escenario he visto llorar a Sarah Bernhardt y he escuchado a María Callas hacer temblar los cristales. El arte es el lenguaje universal que hermana a los pueblos más diversos. Aquí, Bilbao habla al mundo en esperanto estético.'",
            
            4: "👨‍🎓 **Unamuno y el camino de Santiago**\n\n'La Catedral de Santiago nos recuerda que Bilbao siempre fue paso de peregrinos del alma. Como yo mismo escribí: \"Se hace camino al andar\", y estos viajeros espirituales han hecho de nuestra ciudad un punto de encuentro de culturas y fe.'\n\n⛪ **Meditación espiritual**: 'Desde hace seis siglos, estas campanas góticas marcan no solo las horas del día, sino los latidos del alma colectiva vasca. Santiago, patrón de España, protege desde aquí a quienes buscan sentido en el peregrinar.'\n\n🕊️ **Filosofía del camino**: 'He predicado que \"solo se posee lo que se comparte\". Esta catedral comparte con el mundo la hospitalidad vasca, el recogimiento cristiano y la belleza gótica que eleva el espíritu hacia lo trascendente. ¡Benditos sean los que caminan buscando!'",
            
            5: "👨‍🎓 **Unamuno celebra la gastronomía vasca**\n\n'El Mercado de la Ribera es el alma gastronómica de Bilbao, donde se encuentra la esencia genuina de nuestra tierra: el mar cantábrico y los verdes valles vascos unidos en perfecta armonía culinaria que alimenta cuerpo y espíritu.'\n\n🍽️ **Elogio del filósofo**: 'Aquí convergen pescadores de Bermeo, ganaderos de Gorbea y hortelanos de Álava. Sus productos son poemas comestibles que narran la generosidad de esta tierra bendita. ¡Qué universidad más sabrosa que este mercado!'\n\n🏆 **Legado cultural**: 'De estos puestos nacieron los cocineros que conquistaron el mundo con nuestra gastronomía. Como siempre dije: \"El pueblo que come bien, piensa bien\". Este templo culinario es cátedra de identidad, tradición y excelencia vasca. ¡Salud y buenos alimentos!'"
        }
    };
    
    const tourTitles = {
        simple: {
            1: "🏛️ Casco Viejo - Siete Calles",
            2: "🏛️ Museo Guggenheim Bilbao",
            3: "🎭 Teatro Arriaga",
            4: "⛪ Catedral de Santiago",
            5: "🍎 Mercado de la Ribera"
        },
        adventure: {
            1: "🔍 Ubicación Misteriosa #1",
            2: "🔍 Ubicación Misteriosa #2", 
            3: "🔍 Ubicación Misteriosa #3",
            4: "🔍 Ubicación Misteriosa #4",
            5: "🔍 Ubicación Misteriosa #5"
        },
        historic: {
            1: "👨‍🎓 Unamuno en el Casco Viejo",
            2: "👨‍🎓 Unamuno y el Guggenheim",
            3: "👨‍🎓 Unamuno en el Teatro Arriaga",
            4: "👨‍🎓 Unamuno y Santiago",
            5: "👨‍🎓 Unamuno en La Ribera"
        }
    };
    
    // Actualizar mapa con animación
    const tourMap = document.querySelector('.tour-map');
    if (tourMap) {
        tourMap.style.opacity = '0.5';
        tourMap.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            tourMap.innerHTML = `
                <iframe 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-2.9534%2C43.2539%2C-2.9094%2C43.2759&layer=mapnik&marker=43.2627%2C-2.9253"
                    width="100%" 
                    height="150" 
                    style="border: none; border-radius: 12px;"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
                <div style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); padding: 5px 10px; border-radius: 15px; font-size: 12px;">
                    📍 Bilbao
                </div>
                <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">
                    Punto ${currentPoint} de ${totalPoints}
                </div>
            `;
            
            tourMap.style.opacity = '1';
            tourMap.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Actualizar contenido con animación
    const titleElement = document.getElementById('tour-title');
    const descElement = document.getElementById('tour-description');
    
    if (titleElement && descElement) {
        titleElement.style.opacity = '0';
        descElement.style.opacity = '0';
        
        setTimeout(() => {
            if (selectedTour && tourTitles[selectedTour] && tourDescriptions[selectedTour]) {
                titleElement.textContent = tourTitles[selectedTour][currentPoint];
                descElement.innerHTML = tourDescriptions[selectedTour][currentPoint].replace(/\n/g, '<br>');
            }
            
            titleElement.style.opacity = '1';
            descElement.style.opacity = '1';
        }, 300);
    }
    
    // Mostrar/ocultar elementos según el tipo de tour
    const adventureActions = document.getElementById('adventure-actions');
    const nextBtn = document.getElementById('next-btn');
    
    if (selectedTour === 'adventure') {
        if (adventureActions) adventureActions.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'none';
    } else {
        if (adventureActions) adventureActions.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'block';
    }
}

// Función para revelar ubicación en modo aventura
function revealLocation() {
    const revealDescriptions = {
        1: "¡Muy bien! Has encontrado el Casco Viejo. El Casco Viejo de Bilbao, conocido como Siete Calles, es el corazón histórico de la ciudad. Sus calles empedradas guardan siglos de historia mercantil y tradición vasca.",
        2: "¡Excelente! Has llegado al Museo Guggenheim. Diseñado por Frank Gehry, este museo con forma de barco es una obra maestra de la arquitectura contemporánea. Sus curvas de titanio reflejan la luz del sol creando un espectáculo visual único.",
        3: "¡Perfecto! Has encontrado el Teatro Arriaga. Inaugurado en 1890, es el principal teatro de Bilbao. Su fachada neoclásica y su interior decorado al estilo francés lo convierten en una joya arquitectónica.",
        4: "¡Fantástico! Has llegado a la Catedral de Santiago. Esta construcción gótica del siglo XIV es donde el patrón de Bilbao protege a sus habitantes. Su torre campanario es uno de los símbolos más reconocibles de la ciudad.",
        5: "¡Increíble! Has encontrado el Mercado de la Ribera. Uno de los mercados cubiertos más grandes de Europa, con su arquitectura Art Déco de 1929 alberga más de 60 puestos con lo mejor de la gastronomía vasca."
    };
    
    const revealTitles = {
        1: "🏛️ Casco Viejo - Siete Calles",
        2: "🏛️ Museo Guggenheim Bilbao", 
        3: "🎭 Teatro Arriaga",
        4: "⛪ Catedral de Santiago",
        5: "🍎 Mercado de la Ribera"
    };
    
    // Revelar el título real del lugar
    const titleElement = document.getElementById('tour-title');
    const descElement = document.getElementById('tour-description');
    
    if (titleElement) {
        titleElement.textContent = revealTitles[currentPoint];
    }
    
    if (descElement) {
        descElement.innerHTML = `
            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #4CAF50;">
                <strong>🎉 ¡Muy bien!</strong> Has encontrado el lugar correcto.
            </div>
            ${revealDescriptions[currentPoint]}
        `;
    }

    const adventureActions = document.getElementById('adventure-actions');
    const nextBtn = document.getElementById('next-btn');
    
    if (adventureActions) adventureActions.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'block';
    
    showNotification('¡Ubicación revelada!', 'success');
}

// Sistema de valoración
function selectRating(rating) {
    currentRating = rating;
    updateRatingButtons();
    showNotification(`Valoración: ${rating} estrellas`, 'info');
}

function updateRatingButtons() {
    const buttons = document.querySelectorAll('.rating-btn');
    buttons.forEach((btn, index) => {
        if (index + 1 === currentRating) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// Función para inicializar el tour
async function initializeTour() {
    currentPoint = 1;
    audioProgress = 0;
    audioPlaying = false;
    
    const progressPercent = (currentPoint / totalPoints) * 100;
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
    
    // Registrar el inicio del tour en Supabase
    const currentUser = await auth.getCurrentUser();
    if (currentUser && selectedTourId) {
        try {
            const result = await tours.startTour(currentUser.id, selectedTourId, totalPoints);
            if (result.success) {
                console.log('Tour iniciado y registrado en Supabase');
            }
        } catch (error) {
            console.error('Error al registrar inicio del tour:', error);
        }
    }
    
    const tourDescriptions = {
        simple: {
            1: "El Casco Viejo de Bilbao, conocido como Siete Calles, es el corazón histórico de la ciudad. Sus calles empedradas guardan siglos de historia mercantil y tradición vasca. Fundado en 1300, estas calles fueron el núcleo comercial que dio origen a la gran villa de Bilbao."
        },
        adventure: {
            1: "🔍 Primera pista: Busca el lugar donde nacieron las siete calles que fundaron Bilbao. Sus piedras guardan más de 700 años de historia..."
        },
        historic: {
            1: "Queridos visitantes, soy Miguel de Unamuno. Estas calles que pisáis fueron testigos de mi juventud. El Casco Viejo late con el corazón de la auténtica Bilbao, donde cada piedra es un verso de nuestra historia."
        }
    };
    
    const initTitles = {
        simple: {
            1: "🏛️ Casco Viejo - Siete Calles"
        },
        adventure: {
            1: "🔍 Ubicación Misteriosa #1"
        },
        historic: {
            1: "🏛️ Casco Viejo - Siete Calles"
        }
    };
    
    const tourMap = document.querySelector('.tour-map');
    if (tourMap) {
        tourMap.innerHTML = `
            <iframe 
                src="https://www.openstreetmap.org/export/embed.html?bbox=-2.9534%2C43.2539%2C-2.9094%2C43.2759&layer=mapnik&marker=43.2627%2C-2.9253"
                width="100%" 
                height="150" 
                style="border: none; border-radius: 12px;"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
            <div style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); padding: 5px 10px; border-radius: 15px; font-size: 12px;">
                📍 Bilbao
            </div>
            <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">
                Punto ${currentPoint} de ${totalPoints}
            </div>
        `;
    }

    const titleElement = document.getElementById('tour-title');
    const descElement = document.getElementById('tour-description');
    
    if (titleElement && selectedTour && initTitles[selectedTour]) {
        titleElement.textContent = initTitles[selectedTour][currentPoint];
    }
    
    if (descElement && selectedTour && tourDescriptions[selectedTour]) {
        descElement.textContent = tourDescriptions[selectedTour][currentPoint];
    }
    
    // Mostrar/ocultar elementos según el tipo de tour
    const adventureActions = document.getElementById('adventure-actions');
    const nextBtn = document.getElementById('next-btn');
    
    if (selectedTour === 'adventure') {
        if (adventureActions) adventureActions.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'none';
    } else {
        if (adventureActions) adventureActions.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'block';
    }
    
    showNotification('Tour iniciado', 'success');
}

async function submitRating() {
    if (currentRating === 0) {
        showNotification('Por favor, selecciona una puntuación antes de enviar', 'warning');
        return;
    }
    
    const feedback = document.getElementById('feedback');
    const feedbackText = feedback ? feedback.value : '';
    
    // Guardar rating en Supabase si hay usuario autenticado
    try {
        const user = await auth.getCurrentUser();
        if (user && selectedTourId) {
            // Usar el ID real del tour de Supabase
            const result = await tours.saveTourRating(selectedTourId, user.id, currentRating, feedbackText);
            
            if (result.success) {
                showNotification(`¡Gracias por tu valoración de ${currentRating} estrellas! 🌟`, 'success');
            } else {
                console.error('Error al guardar rating:', result.error);
                showNotification('Error al guardar valoración, pero gracias por tu feedback', 'warning');
            }
        } else {
            // Usuario no autenticado o tour no seleccionado
            showNotification(`¡Gracias por tu valoración de ${currentRating} estrellas! 🌟`, 'success');
        }
    } catch (error) {
        console.error('Error al procesar rating:', error);
        showNotification(`¡Gracias por tu valoración de ${currentRating} estrellas! 🌟`, 'success');
    }
}

function shareOn(platform) {
    const messages = {
        facebook: '¡Acabo de completar un increíble tour por Bilbao con DrifTour! 🏛️ #FreeTour #Bilbao',
        twitter: '¡Descubriendo Bilbao con @DrifTour! 🌟 Una experiencia única #FreeTour #Bilbao',
        instagram: '📍 Bilbao | DrifTour experience ✨ #DrifTour #Bilbao #Turismo #Culture'
    };
    
    showNotification(`Compartiendo en ${platform}`, 'info', 2500);
    console.log(`Compartiendo: ${messages[platform]}`);
}

function copyLink() {
    const link = 'https://driftour.app/tour/bilbao/12345';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
            showNotification('¡Enlace copiado al portapapeles! 📋', 'success');
        }).catch(() => {
            showNotification('Enlace: ' + link, 'info', 4000);
        });
    } else {
        // Fallback para navegadores sin soporte de clipboard API
        showNotification('Enlace: ' + link, 'info', 4000);
    }
}

// Función para cargar tours desde Supabase
async function loadToursFromSupabase() {
    try {
        const toursData = await tours.getTours();
        if (toursData && toursData.length > 0) {
            console.log('Tours cargados desde Supabase:', toursData);
            updateToursDisplay(toursData);
            showNotification(`${toursData.length} tours cargados desde la base de datos 🎉`, 'success', 2000);
        } else {
            console.log('No se encontraron tours, usando tours estáticos');
            showNotification('Usando tours de ejemplo', 'info', 2000);
        }
    } catch (error) {
        console.error('Error al cargar tours:', error);
        showNotification('Error al cargar tours, usando ejemplos locales', 'warning', 3000);
    }
}

// Función para actualizar la visualización de tours
function updateToursDisplay(toursData) {
    const tourSections = {
        clasicos: document.querySelector('.tour-section.clasicos .tour-options'),
        tematicos: document.querySelector('.tour-section.tematicos .tour-options'),
        teatralizados: document.querySelector('.tour-section.teatralizados .tour-options')
    };
    
    // Limpiar todas las secciones para cargar tours desde Supabase
    Object.values(tourSections).forEach(section => {
        if (section) section.innerHTML = '';
    });
    
    // Clasificar tours por tipo
    toursData.forEach(tour => {
        const tourCard = createTourCard(tour);
        
        switch(tour.type) {
            case 'simple':
            case 'adventure':
            case 'historic':
                if (tourSections.clasicos) {
                    tourSections.clasicos.appendChild(tourCard);
                    console.log('Tour clásico agregado:', tour.title);
                }
                break;
            case 'themed':
                if (tourSections.tematicos) {
                    tourSections.tematicos.appendChild(tourCard);
                    console.log('Tour temático agregado:', tour.title);
                }
                break;
            case 'theatrical':
                if (tourSections.teatralizados) {
                    tourSections.teatralizados.appendChild(tourCard);
                    console.log('Tour teatralizado agregado:', tour.title);
                }
                break;
        }
    });
    
    // Actualizar favoritos después de cargar tours
    updateFavoritesUI();
}

// Función para crear una tarjeta de tour
function createTourCard(tour) {
    const card = document.createElement('div');
    card.className = 'tour-card';
    card.dataset.tour = tour.id || tour.type;
    
    const price = tour.price === 0 ? 'Gratis' : `${tour.price}€`;
    const isPremium = tour.is_premium ? '⭐' : '';
    const isFavorite = userFavorites.has(tour.id || tour.type);
    
    card.innerHTML = `
        <div class="tour-header">
            <h3>${getTypeIcon(tour.type)} ${tour.title} ${isPremium}</h3>
            <div class="tour-header-right">
                <span class="tour-price">${price}</span>
                <button class="favorite-btn" onclick="toggleFavorite('${tour.id || tour.type}')" 
                        style="background: none; border: none; font-size: 20px; cursor: pointer; margin-left: 10px; color: ${isFavorite ? '#dc3545' : '#6c757d'};">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
        </div>
        <p>${tour.description}</p>
        <button class="tour-btn" onclick="selectTour('${tour.type}')">Seleccionar</button>
    `;
    
    return card;
}

// Función para obtener el icono según el tipo de tour
function getTypeIcon(type) {
    const icons = {
        simple: '🏛️',
        adventure: '🔍',
        historic: '👨‍🎓',
        themed: '🎭',
        theatrical: '🎨'
    };
    return icons[type] || '📍';
}

// Función para crear popup personalizado
function createCustomPopup(title, content) {
    // Remover popup existente si existe
    const existingPopup = document.getElementById('custom-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Crear nuevo popup
    const popup = document.createElement('div');
    popup.id = 'custom-popup';
    popup.className = 'popup-overlay';
    popup.style.display = 'flex';
    popup.style.zIndex = '10000';
    
    popup.innerHTML = `
        <div class="popup-content" style="max-width: 400px; width: 90%;">
            <div class="popup-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="closeCustomPopup()">×</button>
            </div>
            <div class="popup-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Cerrar al hacer clic fuera del popup
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closeCustomPopup();
        }
    });
}

// Función para cerrar popup personalizado
function closeCustomPopup() {
    const popup = document.getElementById('custom-popup');
    if (popup) {
        popup.remove();
    }
}

// Función para obtener estadísticas del usuario
async function getUserStats(userId) {
    try {
        const stats = await tours.getUserStats(userId);
        return stats;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return {
            completedTours: 0,
            averageRating: 0
        };
    }
}

// Función para mostrar historial de tours
async function showTourHistory() {
    closePopup('user-popup');
    
    const currentUser = await auth.getCurrentUser();
    
    if (!currentUser) {
        showNotification('Inicia sesión para ver tu historial', 'warning');
        return;
    }
    
    try {
        const progress = await tours.getUserProgress(currentUser.id);
        const allTours = await tours.getTours();
        
        if (progress.length === 0) {
            const content = `
                <div style="text-align: center; padding: 20px;">
                    <h3>📚 Historial de Tours</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0;">
                        <p>🎯 Aún no has completado ningún tour.</p>
                        <p>¡Explora Bilbao y empieza tu aventura!</p>
                    </div>
                    <button onclick="closeCustomPopup()" class="tour-btn">Cerrar</button>
                </div>
            `;
            
            createCustomPopup('Historial de Tours', content);
            return;
        }
        
        let historyContent = '<div style="max-height: 400px; overflow-y: auto;">';
        
        for (const item of progress) {
            // Buscar información del tour
            const tourInfo = allTours.find(t => t.id === item.tour_id);
            const tourName = tourInfo ? tourInfo.title : `Tour ${item.tour_id}`;
            
            const startedDate = new Date(item.started_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const completedDate = item.completed_at ? 
                new Date(item.completed_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }) : null;
            
            const progressPercent = item.total_points > 0 ? 
                Math.round((item.progress / item.total_points) * 100) : 0;
            
            const isCompleted = item.completed;
            const statusIcon = isCompleted ? '✅' : '⏳';
            const statusText = isCompleted ? 'Completado' : 'En progreso';
            const statusColor = isCompleted ? '#28a745' : '#ffc107';
            const bgColor = isCompleted ? '#e8f5e8' : '#fff3cd';
            
            historyContent += `
                <div style="background: ${bgColor}; padding: 15px; border-radius: 10px; margin: 10px 0; border-left: 4px solid ${statusColor};">
                    <h4 style="margin: 0 0 10px 0; color: #333;">${statusIcon} ${tourName}</h4>
                    <p style="margin: 5px 0; color: #666;"><strong>Progreso:</strong> ${progressPercent}% (${item.progress}/${item.total_points} puntos)</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Estado:</strong> ${statusText}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Iniciado:</strong> ${startedDate}</p>
                    ${completedDate ? `<p style="margin: 5px 0; color: #666;"><strong>Completado:</strong> ${completedDate}</p>` : ''}
                </div>
            `;
        }
        
        historyContent += '</div>';
        
        const fullContent = `
            <div style="text-align: center; padding: 20px;">
                <h3>📚 Historial de Tours</h3>
                ${historyContent}
                <button onclick="closeCustomPopup()" class="tour-btn" style="margin-top: 15px;">Cerrar</button>
            </div>
        `;
        
        createCustomPopup('Historial de Tours', fullContent);
        
    } catch (error) {
        console.error('Error al obtener historial:', error);
        showNotification('Error al cargar el historial', 'error');
    }
}

// Sistema de favoritos
let userFavorites = new Set();

// Función para obtener favoritos del usuario
async function loadUserFavorites() {
    const currentUser = await auth.getCurrentUser();
    if (!currentUser) return;
    
    try {
        const favorites = await tours.getUserFavorites(currentUser.id);
        userFavorites = new Set(favorites.map(f => f.tour_id));
        
        // Actualizar UI de tours estáticos
        initializeStaticFavorites();
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
        if (error.message && error.message.includes('user_favorites')) {
            console.warn('⚠️ Tabla user_favorites no existe. Ejecuta add-favorites-table.sql en Supabase');
        }
    }
}

// Función para alternar favorito
async function toggleFavorite(tourId) {
    const currentUser = await auth.getCurrentUser();
    if (!currentUser) {
        showNotification('Inicia sesión para guardar favoritos', 'warning');
        return;
    }
    
    try {
        if (userFavorites.has(tourId)) {
            await tours.removeFavorite(currentUser.id, tourId);
            userFavorites.delete(tourId);
            showNotification('Tour eliminado de favoritos', 'info');
        } else {
            await tours.addFavorite(currentUser.id, tourId);
            userFavorites.add(tourId);
            showNotification('Tour agregado a favoritos ⭐', 'success');
        }
        
        // Actualizar UI de favoritos
        updateFavoritesUI();
    } catch (error) {
        console.error('Error al actualizar favorito:', error);
        if (error.message && error.message.includes('user_favorites')) {
            showNotification('⚠️ Tabla favoritos no configurada. Contacta al administrador', 'warning');
        } else {
            showNotification('Error al actualizar favorito', 'error');
        }
    }
}

// Función para mostrar favoritos
async function showFavorites() {
    closePopup('user-popup');
    
    const currentUser = await auth.getCurrentUser();
    if (!currentUser) {
        showNotification('Inicia sesión para ver tus favoritos', 'warning');
        return;
    }
    
    try {
        const favorites = await tours.getUserFavorites(currentUser.id);
        
        if (favorites.length === 0) {
            const content = `
                <div style="text-align: center; padding: 20px;">
                    <h3>⭐ Mis Favoritos</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0;">
                        <p>❤️ Aún no tienes tours favoritos.</p>
                        <p>¡Marca como favorito los tours que más te gusten!</p>
                    </div>
                    <button onclick="closeCustomPopup()" class="tour-btn">Cerrar</button>
                </div>
            `;
            
            createCustomPopup('Mis Favoritos', content);
            return;
        }
        
        let favoritesContent = '<div style="max-height: 400px; overflow-y: auto;">';
        
        for (const favorite of favorites) {
            const addedDate = new Date(favorite.created_at).toLocaleDateString('es-ES');
            
            favoritesContent += `
                <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin: 10px 0; border-left: 4px solid #ffc107;">
                    <h4 style="margin: 0 0 10px 0;">⭐ Tour ${favorite.tour_id}</h4>
                    <p><strong>Agregado:</strong> ${addedDate}</p>
                    <button onclick="toggleFavorite('${favorite.tour_id}')" class="tour-btn" style="background: #dc3545; margin-top: 10px;">
                        Eliminar de favoritos
                    </button>
                </div>
            `;
        }
        
        favoritesContent += '</div>';
        
        const fullContent = `
            <div style="text-align: center; padding: 20px;">
                <h3>⭐ Mis Favoritos</h3>
                ${favoritesContent}
                <button onclick="closeCustomPopup()" class="tour-btn" style="margin-top: 15px;">Cerrar</button>
            </div>
        `;
        
        createCustomPopup('Mis Favoritos', fullContent);
        
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        showNotification('Error al cargar favoritos', 'error');
    }
}

// Función para actualizar la UI de favoritos
function updateFavoritesUI() {
    const tourCards = document.querySelectorAll('.tour-card');
    
    tourCards.forEach(card => {
        const tourId = card.dataset.tour;
        const favoriteBtn = card.querySelector('.favorite-btn');
        
        if (favoriteBtn && tourId) {
            if (userFavorites.has(tourId)) {
                favoriteBtn.innerHTML = '❤️';
                favoriteBtn.style.color = '#dc3545';
            } else {
                favoriteBtn.innerHTML = '🤍';
                favoriteBtn.style.color = '#6c757d';
            }
        }
    });
}

// Función para inicializar favoritos (ya no necesaria con tours dinámicos)
function initializeStaticFavorites() {
    // Esta función ya no es necesaria ya que todos los tours se cargan desde Supabase
    // y se inicializan automáticamente en updateToursDisplay()
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DrifTour App inicializada');
    
    // Cargar mapeo de tipos de tour a IDs
    loadTourTypeMapping();
    
    // Configurar event listeners para la cabecera
    const userInfo = document.getElementById('user-info');
    const premiumBtn = document.getElementById('premium-btn');
    
    if (userInfo) {
        userInfo.addEventListener('click', toggleUserMenu);
    }
    
    if (premiumBtn) {
        premiumBtn.addEventListener('click', togglePremiumPopup);
    }
    
    // Cerrar popups al hacer click fuera de ellos
    document.querySelectorAll('.popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closePopup(overlay.id);
            }
        });
    });
    
    // Configurar filtros de tiempo
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedTime = this.dataset.time;
            showNotification(`Duración seleccionada: ${selectedTime}`, 'info', 1500);
        });
    });

    // Configurar opciones de accesibilidad
    document.querySelectorAll('.accessibility-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const accessibility = this.dataset.accessibility;
            if (selectedAccessibility.includes(accessibility)) {
                selectedAccessibility = selectedAccessibility.filter(a => a !== accessibility);
                showNotification(`${accessibility} desactivado`, 'info', 1500);
            } else {
                selectedAccessibility.push(accessibility);
                showNotification(`${accessibility} activado`, 'success', 1500);
            }
        });
    });
    
    // Modo diurno por defecto
    isNightMode = false;
    document.body.classList.remove('night-mode');
    const container = document.getElementById('main-container');
    if (container) {
        container.classList.remove('night-mode');
    }
    
    const nightModeIcon = document.getElementById('night-mode-icon');
    const nightModeText = document.getElementById('night-mode-text');
    if (nightModeIcon) nightModeIcon.textContent = '🌙';
    if (nightModeText) nightModeText.textContent = 'Modo Nocturno';
    
    // Actualizar estado inicial del usuario
    updateUserStatus();
    
    // Cargar tours desde Supabase
    loadToursFromSupabase();
    
    // Cargar favoritos del usuario
    loadUserFavorites();
    
    // Event listeners para eventos de autenticación de Supabase
    window.addEventListener('userSignedIn', function(event) {
        const user = event.detail;
        userName = user.user_metadata?.name || 'Usuario';
        updateUserStatus();
        showNotification(`¡Bienvenido ${userName}! 🎉`, 'success');
        
        // Cargar favoritos del usuario
        loadUserFavorites();
        
        // Mostrar pantalla principal si estamos en login
        if (document.getElementById('login-screen').classList.contains('active')) {
            showScreen('map-screen');
        }
    });
    
    window.addEventListener('userSignedOut', function() {
        userName = 'Invitado';
        updateUserStatus();
        showNotification('Sesión cerrada', 'info');
        showScreen('login-screen');
    });
    
    // Event listeners para botones de login y registro
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', async function() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                showNotification('Por favor, completa todos los campos', 'warning');
                return;
            }
            
            // Intentar iniciar sesión con Supabase
            const result = await auth.signIn(email, password);
            if (result.success) {
                showNotification('¡Bienvenido! 🎉', 'success');
                showScreen('map-screen');
            } else {
                showNotification('Error al iniciar sesión: ' + result.error, 'error');
            }
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', async function() {
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            
            if (!name || !email || !password) {
                showNotification('Por favor, completa todos los campos', 'warning');
                return;
            }
            
            // Intentar registrar con Supabase
            const result = await auth.signUp(email, password, name);
            if (result.success) {
                showNotification('¡Cuenta creada! Revisa tu email para confirmar', 'success');
                showScreen('login-screen');
            } else {
                showNotification('Error al crear cuenta: ' + result.error, 'error');
            }
        });
    }
    
    if (registerLink) {
        registerLink.addEventListener('click', () => showScreen('register-screen'));
    }
    
    if (loginLink) {
        loginLink.addEventListener('click', () => showScreen('login-screen'));
    }
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido a DrifTour! 🎉', 'info', 3000);
    }, 1000);
    
    // Agregar efectos de hover mejorados
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    // Detectar si estamos en GitHub Pages o local
    const isGitHubPages = location.hostname === 'imanolow.github.io';
    const basePath = isGitHubPages ? '/driftour-web' : '';
    const swPath = `${basePath}/service-worker.js`;
    
    navigator.serviceWorker.register(swPath)
      .then((registration) => {
        console.log('SW registrado con éxito: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} else if (location.protocol === 'http:') {
  console.log('Service Worker no registrado (requiere HTTPS)');
}

// Función para cargar el mapeo de tipos de tour a IDs
async function loadTourTypeMapping() {
    try {
        const allTours = await tours.getTours();
        tourTypeToIdMap = {};
        
        for (const tour of allTours) {
            tourTypeToIdMap[tour.type] = tour.id;
        }
        
        console.log('Mapeo de tours cargado:', tourTypeToIdMap);
    } catch (error) {
        console.error('Error al cargar mapeo de tours:', error);
    }
}
