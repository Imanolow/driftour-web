-- Ver qué columnas tiene realmente la tabla tours
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tours' 
ORDER BY ordinal_position;

-- Ver algunos datos de ejemplo
SELECT * FROM tours LIMIT 2;
