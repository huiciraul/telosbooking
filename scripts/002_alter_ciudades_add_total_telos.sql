-- Añadir la columna total_telos a la tabla ciudades si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ciudades' AND column_name='total_telos') THEN
        ALTER TABLE ciudades ADD COLUMN total_telos INTEGER DEFAULT 0;
    END IF;
END
$$;
