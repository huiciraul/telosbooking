-- Añadir la columna ciudad_id a la tabla telos si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='telos' AND column_name='ciudad_id') THEN
        ALTER TABLE telos ADD COLUMN ciudad_id INTEGER;
        -- Opcional: Si quieres que los telos existentes se vinculen a una ciudad por nombre
        -- UPDATE telos t SET ciudad_id = c.id FROM ciudades c WHERE t.ciudad = c.nombre;
    END IF;
END
$$;

-- Cambiar el tipo de la columna rating a NUMERIC(2,1) si no es ya numérico
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='telos' AND column_name='rating' AND data_type NOT IN ('numeric', 'real', 'double precision', 'integer')) THEN
        ALTER TABLE telos ALTER COLUMN rating TYPE NUMERIC(2,1) USING rating::NUMERIC(2,1);
    END IF;
END
$$;

-- Añadir la clave foránea para ciudad_id si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_telos_ciudad_id') THEN
        ALTER TABLE telos ADD CONSTRAINT fk_telos_ciudad_id FOREIGN KEY (ciudad_id) REFERENCES ciudades(id) ON DELETE SET NULL;
    END IF;
END
$$;

-- Asegurar que provincia y pais existan y sean TEXT
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='telos' AND column_name='provincia') THEN
        ALTER TABLE telos ADD COLUMN provincia TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='telos' AND column_name='pais') THEN
        ALTER TABLE telos ADD COLUMN pais TEXT;
    END IF;
END
$$;
