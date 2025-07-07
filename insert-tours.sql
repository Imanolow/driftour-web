-- Insertar tours de ejemplo en Supabase
-- Ve a SQL Editor en tu dashboard y ejecuta este código

INSERT INTO tours (title, description, type, price, duration, locations, is_premium) VALUES
('Tour Simple', 'Descubre los 5 lugares más emblemáticos de Bilbao con explicaciones detalladas.', 'simple', 0.00, 30, '[
  {"name": "Casco Viejo - Siete Calles", "lat": 43.2567, "lng": -2.9234, "description": "El corazón histórico de la ciudad"},
  {"name": "Catedral de Santiago", "lat": 43.2564, "lng": -2.9254, "description": "La catedral principal de Bilbao"},
  {"name": "Plaza Nueva", "lat": 43.2563, "lng": -2.9241, "description": "La plaza principal del Casco Viejo"},
  {"name": "Mercado de la Ribera", "lat": 43.2558, "lng": -2.9248, "description": "El mercado más grande de Europa"},
  {"name": "Puente de San Antón", "lat": 43.2562, "lng": -2.9251, "description": "El puente histórico de Bilbao"}
]', false),

('Tour Aventura', 'Resuelve pistas y descubre lugares secretos en una experiencia gamificada única.', 'adventure', 0.00, 60, '[
  {"name": "Casco Viejo - Siete Calles", "lat": 43.2567, "lng": -2.9234, "description": "Encuentra la primera pista en la calle más antigua"},
  {"name": "Plaza de Unamuno", "lat": 43.2565, "lng": -2.9240, "description": "Descifra el mensaje oculto en la estatua"},
  {"name": "Iglesia de San Nicolás", "lat": 43.2569, "lng": -2.9243, "description": "Busca el símbolo secreto en la fachada"},
  {"name": "Arenal", "lat": 43.2570, "lng": -2.9250, "description": "Resuelve el acertijo del jardín"},
  {"name": "Teatro Arriaga", "lat": 43.2571, "lng": -2.9252, "description": "Encuentra la entrada secreta"}
]', false),

('Tour Histórico', 'Camina junto a Miguel de Unamuno y descubre la historia profunda de cada rincón.', 'historic', 0.00, 90, '[
  {"name": "Universidad de Deusto", "lat": 43.2701, "lng": -2.9501, "description": "Donde estudió Unamuno"},
  {"name": "Casco Viejo", "lat": 43.2567, "lng": -2.9234, "description": "El Bilbao medieval"},
  {"name": "Gran Vía", "lat": 43.2630, "lng": -2.9350, "description": "La modernización de la ciudad"},
  {"name": "Palacio de la Diputación", "lat": 43.2633, "lng": -2.9348, "description": "El poder político"},
  {"name": "Puente de La Salve", "lat": 43.2688, "lng": -2.9394, "description": "La conexión con el futuro"}
]', false),

('Tour Medieval', 'Revive la fundación de Bilbao con actores caracterizados como comerciantes medievales del siglo XIV', 'theatrical', 20.00, 120, '[
  {"name": "Casco Viejo - Siete Calles", "lat": 43.2567, "lng": -2.9234, "description": "El nacimiento de la villa"},
  {"name": "Iglesia de Santiago", "lat": 43.2564, "lng": -2.9254, "description": "El primer templo"},
  {"name": "Plaza Nueva", "lat": 43.2563, "lng": -2.9241, "description": "El mercado medieval"},
  {"name": "Puente de San Antón", "lat": 43.2562, "lng": -2.9251, "description": "La conexión comercial"}
]', true),

('Tour Txikitero', 'La historia de los bares y pintxos más emblemáticos de Bilbao. ¡Delicioso!', 'themed', 25.00, 180, '[
  {"name": "Calle Ledesma", "lat": 43.2565, "lng": -2.9238, "description": "La calle de los pintxos"},
  {"name": "Plaza Nueva", "lat": 43.2563, "lng": -2.9241, "description": "Terrazas tradicionales"},
  {"name": "Calle Jardines", "lat": 43.2566, "lng": -2.9245, "description": "Bares centenarios"},
  {"name": "Mercado de la Ribera", "lat": 43.2558, "lng": -2.9248, "description": "Productos frescos"}
]', true);
