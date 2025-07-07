// Variables globales
let selectedTour = null;
let selectedTime = '1h';
let selectedAccessibility = [];
let currentPoint = 1;
let totalPoints = 5;
let currentRating = 0;
let tourStarted = false;
let isPremiumUser = false;
let userName = 'Ana';
let isNightMode = false;
let audioPlaying = false;
let audioProgress = 0;
let audioSpeed = 1;
let audioInterval;

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
function showProfile() {
    closePopup('user-popup');
    showNotification('Perfil de usuario - Próximamente disponible', 'info');
}

function showSettings() {
    closePopup('user-popup');
    showNotification('Configuración - Próximamente disponible', 'info');
}

function logout() {
    closePopup('user-popup');
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        showScreen('login-screen');
        toggleHeader(false);
        showNotification('Sesión cerrada correctamente', 'info');
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
}

// Función para seleccionar tour
function selectTour(tourType) {
    selectedTour = tourType;
    currentPoint = 1; // Reiniciar el contador
    showScreen('share-screen');
    showNotification(`Tour ${tourType} seleccionado`, 'success');
}

// Función para seleccionar tour teatralizado
function selectHumanTour(tourType) {
    showNotification(`¡Has seleccionado el tour "${tourType}"! Te redirigiremos a la página de reservas.`, 'info', 4000);
    // Aquí se redirigiría a un sistema de reservas real
}

// Siguiente punto en el tour
function nextPoint() {
    currentPoint++;
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
function initializeTour() {
    currentPoint = 1;
    audioProgress = 0;
    audioPlaying = false;
    
    const progressPercent = (currentPoint / totalPoints) * 100;
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
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

function submitRating() {
    if (currentRating === 0) {
        showNotification('Por favor, selecciona una puntuación antes de enviar', 'warning');
        return;
    }
    
    const feedback = document.getElementById('feedback');
    const feedbackText = feedback ? feedback.value : '';
    
    // Aquí se enviaría la valoración a la base de datos
    console.log('Rating submitted:', { rating: currentRating, feedback: feedbackText });
    
    showNotification(`¡Gracias por tu valoración de ${currentRating} estrellas! 🌟`, 'success');
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

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DrifTour App inicializada');
    
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
