-- Insertar TODOS los tours de DrifTour en Supabase
-- Este script agrega todos los tours que estaban en el HTML

-- Primero, limpiar tours existentes si quieres empezar desde cero
-- DELETE FROM tours WHERE id IS NOT NULL;

-- Tours Clásicos
INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour Simple', 'Descubre los 5 lugares más emblemáticos de Bilbao con explicaciones detalladas.', 'simple', 0.00, 30, 'easy', '[
  {"name": "Casco Viejo - Siete Calles", "lat": 43.2567, "lng": -2.9234, "description": "El corazón histórico de la ciudad"},
  {"name": "Puente de San Antón", "lat": 43.2562, "lng": -2.9251, "description": "El puente histórico de Bilbao"},
  {"name": "Catedral de Santiago", "lat": 43.2565, "lng": -2.9240, "description": "La catedral principal de Bilbao"},
  {"name": "Plaza Nueva", "lat": 43.2569, "lng": -2.9245, "description": "El corazón social del Casco Viejo"},
  {"name": "Mercado de la Ribera", "lat": 43.2558, "lng": -2.9248, "description": "El mercado más grande de Europa"}
]', false);

INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour Aventura', 'Resuelve pistas y descubre lugares secretos en una experiencia gamificada única.', 'adventure', 0.00, 60, 'medium', '[
  {"name": "Casco Viejo - Siete Calles", "lat": 43.2567, "lng": -2.9234, "description": "Encuentra la primera pista en la calle más antigua"},
  {"name": "Teatro Arriaga", "lat": 43.2571, "lng": -2.9252, "description": "Encuentra la entrada secreta"},
  {"name": "Puente del Arenal", "lat": 43.2575, "lng": -2.9260, "description": "Resuelve el enigma del puente"},
  {"name": "Ayuntamiento", "lat": 43.2580, "lng": -2.9265, "description": "Descifra el código histórico"},
  {"name": "Estación de Abando", "lat": 43.2634, "lng": -2.9243, "description": "La pista final te espera"}
]', false);

INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour Histórico', 'Camina junto a Miguel de Unamuno y descubre la historia profunda de cada rincón.', 'historic', 0.00, 90, 'easy', '[
  {"name": "Universidad de Deusto", "lat": 43.2701, "lng": -2.9501, "description": "Donde estudió Unamuno"},
  {"name": "Biblioteca Foral", "lat": 43.2589, "lng": -2.9267, "description": "Templo del conocimiento"},
  {"name": "Puente de La Salve", "lat": 43.2688, "lng": -2.9394, "description": "La conexión con el futuro"},
  {"name": "Museo Guggenheim", "lat": 43.2687, "lng": -2.9343, "description": "Arte contemporáneo"},
  {"name": "Palacio Euskalduna", "lat": 43.2705, "lng": -2.9426, "description": "Cultura y tradición"}
]', false);

-- Tours Temáticos
INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour BBK Live', 'Escanea el código QR de tu entrada y disfruta de este Tour completamente gratis!', 'themed', 0.00, 120, 'easy', '[
  {"name": "Kobetamendi", "lat": 43.2890, "lng": -2.9567, "description": "Recinto del BBK Live"},
  {"name": "Metro Kobeta", "lat": 43.2885, "lng": -2.9570, "description": "Acceso principal"},
  {"name": "Zona de Camping", "lat": 43.2895, "lng": -2.9575, "description": "Área de acampada"},
  {"name": "Escenario Principal", "lat": 43.2892, "lng": -2.9572, "description": "Donde ocurre la magia"},
  {"name": "Food Court", "lat": 43.2888, "lng": -2.9568, "description": "Zona gastronómica"}
]', false);

INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour Aste Nagusia', 'Sigue a Marijaia y conoce la historia de las fiestas más famosas con tus amig@s.', 'themed', 15.00, 90, 'easy', '[
  {"name": "Arenal", "lat": 43.2575, "lng": -2.9260, "description": "Corazón de las fiestas"},
  {"name": "Txosnas del Arenal", "lat": 43.2573, "lng": -2.9258, "description": "Casetas tradicionales"},
  {"name": "Teatro Arriaga", "lat": 43.2571, "lng": -2.9252, "description": "Cultura festiva"},
  {"name": "Casco Viejo", "lat": 43.2567, "lng": -2.9234, "description": "Fiesta tradicional"},
  {"name": "Ayuntamiento", "lat": 43.2580, "lng": -2.9265, "description": "Balcón de Marijaia"}
]', false);

INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour FANT', 'Escanea tu entrada del FANT para vivir este exclusivo tour de terror por las calles de Bilbao!', 'themed', 0.00, 100, 'medium', '[
  {"name": "Palacio Euskalduna", "lat": 43.2705, "lng": -2.9426, "description": "Sede del festival"},
  {"name": "Casco Viejo de Noche", "lat": 43.2567, "lng": -2.9234, "description": "Calles misteriosas"},
  {"name": "Catedral de Santiago", "lat": 43.2565, "lng": -2.9240, "description": "Sombras del pasado"},
  {"name": "Puente de San Antón", "lat": 43.2562, "lng": -2.9251, "description": "Leyendas urbanas"},
  {"name": "Teatro Arriaga", "lat": 43.2571, "lng": -2.9252, "description": "Fantasmas del teatro"}
]', false);

INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour Txikitero', 'La historia de los bares y pintxos más emblemáticos de Bilbao. ¡Delicioso!', 'themed', 25.00, 120, 'easy', '[
  {"name": "Casco Viejo", "lat": 43.2567, "lng": -2.9234, "description": "Inicio de la ruta gastronómica"},
  {"name": "Plaza Nueva", "lat": 43.2569, "lng": -2.9245, "description": "Bares tradicionales"},
  {"name": "Calle Jardines", "lat": 43.2570, "lng": -2.9242, "description": "Pintxos modernos"},
  {"name": "Calle Ledesma", "lat": 43.2568, "lng": -2.9238, "description": "Txikiteo auténtico"},
  {"name": "Mercado de la Ribera", "lat": 43.2558, "lng": -2.9248, "description": "Productos locales"}
]', false);

-- Tours Teatralizados
INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour Medieval', 'Revive la fundación de Bilbao con actores caracterizados como comerciantes medievales del siglo XIV', 'theatrical', 20.00, 120, 'medium', '[
  {"name": "Casco Viejo - Siete Calles", "lat": 43.2567, "lng": -2.9234, "description": "Fundación de la villa"},
  {"name": "Puente de San Antón", "lat": 43.2562, "lng": -2.9251, "description": "Ruta comercial medieval"},
  {"name": "Plaza Nueva", "lat": 43.2569, "lng": -2.9245, "description": "Mercado medieval"},
  {"name": "Catedral de Santiago", "lat": 43.2565, "lng": -2.9240, "description": "Fe y comercio"},
  {"name": "Ribera del Nervión", "lat": 43.2560, "lng": -2.9250, "description": "Puerto medieval"}
]', true);

INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour Carlista', 'Sumérgete en las batallas del siglo XIX con soldados carlistas y liberales en las calles de Bilbao', 'theatrical', 18.00, 110, 'medium', '[
  {"name": "Casco Viejo", "lat": 43.2567, "lng": -2.9234, "description": "Resistencia en las calles"},
  {"name": "Puente del Arenal", "lat": 43.2575, "lng": -2.9260, "description": "Punto estratégico"},
  {"name": "Ayuntamiento", "lat": 43.2580, "lng": -2.9265, "description": "Cuartel general"},
  {"name": "Teatro Arriaga", "lat": 43.2571, "lng": -2.9252, "description": "Refugio cultural"},
  {"name": "Estación de Abando", "lat": 43.2634, "lng": -2.9243, "description": "Llegada del progreso"}
]', true);

INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour Industrial', 'Conoce a los magnates del hierro y obreros que transformaron Bilbao en la Manchester del Norte', 'theatrical', 22.00, 130, 'medium', '[
  {"name": "Altos Hornos", "lat": 43.2945, "lng": -2.9876, "description": "Corazón industrial"},
  {"name": "Puente de Vizcaya", "lat": 43.3230, "lng": -3.0175, "description": "Maravilla industrial"},
  {"name": "Abandoibarra", "lat": 43.2698, "lng": -2.9456, "description": "Transformación urbana"},
  {"name": "Muelle de la Merced", "lat": 43.2567, "lng": -2.9280, "description": "Comercio del hierro"},
  {"name": "Ensanche", "lat": 43.2612, "lng": -2.9345, "description": "Crecimiento urbano"}
]', true);

INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour Unamuno', 'Pasea con Miguel de Unamuno y otros intelectuales vascos por la Bilbao de principios del siglo XX', 'theatrical', 16.00, 100, 'easy', '[
  {"name": "Universidad de Deusto", "lat": 43.2701, "lng": -2.9501, "description": "Cátedra de Unamuno"},
  {"name": "Biblioteca Foral", "lat": 43.2589, "lng": -2.9267, "description": "Templo del saber"},
  {"name": "Café Iruña", "lat": 43.2625, "lng": -2.9287, "description": "Tertulia intelectual"},
  {"name": "Ateneo", "lat": 43.2634, "lng": -2.9245, "description": "Debate y cultura"},
  {"name": "Parque Doña Casilda", "lat": 43.2654, "lng": -2.9378, "description": "Paseos filosóficos"}
]', true);

-- Verificar que todos los tours se han insertado correctamente
SELECT title, type, price, is_premium 
FROM tours 
ORDER BY type, price;

-- Mostrar conteo por tipo
SELECT type, COUNT(*) as cantidad
FROM tours 
GROUP BY type
ORDER BY type;
