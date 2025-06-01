-- Insert cities
INSERT INTO ciudades (id, nombre, slug) VALUES 
('ciudad_1', 'Buenos Aires', 'buenos-aires'),
('ciudad_2', 'Córdoba', 'cordoba'),
('ciudad_3', 'Rosario', 'rosario'),
('ciudad_4', 'Mendoza', 'mendoza'),
('ciudad_5', 'La Plata', 'la-plata'),
('ciudad_6', 'Mar del Plata', 'mar-del-plata')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample telos
INSERT INTO telos (id, nombre, slug, direccion, ciudad, precio, telefono, servicios, descripcion, rating) VALUES 
('telo_1', 'Hotel Palermo', 'hotel-palermo', 'Av. Santa Fe 3000', 'Buenos Aires', 3500, '011-4555-1234', ARRAY['WiFi', 'Estacionamiento', 'Hidromasaje'], 'Moderno hotel en el corazón de Palermo', 4.5),
('telo_2', 'Albergue Villa Crespo', 'albergue-villa-crespo', 'Corrientes 4500', 'Buenos Aires', 2800, '011-4777-5678', ARRAY['WiFi', 'Aire Acondicionado'], 'Cómodo albergue en Villa Crespo', 4.2),
('telo_3', 'Motel Belgrano', 'motel-belgrano', 'Cabildo 2200', 'Buenos Aires', 4200, '011-4888-9012', ARRAY['Estacionamiento', 'Jacuzzi', 'TV Cable'], 'Elegante motel en Belgrano', 4.7),
('telo_4', 'Hotel Córdoba Centro', 'hotel-cordoba-centro', 'San Martín 150', 'Córdoba', 2500, '0351-422-3456', ARRAY['WiFi', 'Frigobar'], 'Hotel céntrico en Córdoba', 4.0),
('telo_5', 'Albergue Rosario', 'albergue-rosario', 'Pellegrini 1200', 'Rosario', 2200, '0341-455-7890', ARRAY['WiFi', 'Estacionamiento'], 'Albergue moderno en Rosario', 4.3)
ON CONFLICT (slug) DO NOTHING;
