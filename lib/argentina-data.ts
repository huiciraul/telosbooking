// Datos de provincias y capitales de Argentina
export const provinciasArgentina = [
  {
    nombre: "Buenos Aires",
    capital: "La Plata",
    ciudadesImportantes: ["Mar del Plata", "Bahía Blanca", "Tandil", "Quilmes", "La Matanza"],
  },
  {
    nombre: "Ciudad Autónoma de Buenos Aires",
    capital: "Buenos Aires",
    ciudadesImportantes: ["Palermo", "Recoleta", "San Telmo", "Belgrano", "Caballito"],
  },
  {
    nombre: "Catamarca",
    capital: "San Fernando del Valle de Catamarca",
    ciudadesImportantes: ["Santa María", "Andalgalá", "Tinogasta"],
  },
  {
    nombre: "Chaco",
    capital: "Resistencia",
    ciudadesImportantes: ["Barranqueras", "Presidencia Roque Sáenz Peña", "Villa Ángela"],
  },
  {
    nombre: "Chubut",
    capital: "Rawson",
    ciudadesImportantes: ["Comodoro Rivadavia", "Trelew", "Puerto Madryn", "Esquel"],
  },
  {
    nombre: "Córdoba",
    capital: "Córdoba",
    ciudadesImportantes: ["Villa Carlos Paz", "Río Cuarto", "Villa María", "San Francisco"],
  },
  {
    nombre: "Corrientes",
    capital: "Corrientes",
    ciudadesImportantes: ["Goya", "Mercedes", "Curuzú Cuatiá", "Santo Tomé"],
  },
  {
    nombre: "Entre Ríos",
    capital: "Paraná",
    ciudadesImportantes: ["Concordia", "Gualeguaychú", "Concepción del Uruguay", "Colón"],
  },
  {
    nombre: "Formosa",
    capital: "Formosa",
    ciudadesImportantes: ["Clorinda", "Pirané", "Las Lomitas"],
  },
  {
    nombre: "Jujuy",
    capital: "San Salvador de Jujuy",
    ciudadesImportantes: ["San Pedro de Jujuy", "Palpalá", "Libertador General San Martín"],
  },
  {
    nombre: "La Pampa",
    capital: "Santa Rosa",
    ciudadesImportantes: ["General Pico", "Toay", "Eduardo Castex"],
  },
  {
    nombre: "La Rioja",
    capital: "La Rioja",
    ciudadesImportantes: ["Chilecito", "Aimogasta", "Chamical"],
  },
  {
    nombre: "Mendoza",
    capital: "Mendoza",
    ciudadesImportantes: ["San Rafael", "Godoy Cruz", "Guaymallén", "Luján de Cuyo"],
  },
  {
    nombre: "Misiones",
    capital: "Posadas",
    ciudadesImportantes: ["Oberá", "Eldorado", "Puerto Iguazú", "Apóstoles"],
  },
  {
    nombre: "Neuquén",
    capital: "Neuquén",
    ciudadesImportantes: ["San Martín de los Andes", "Villa La Angostura", "Zapala"],
  },
  {
    nombre: "Río Negro",
    capital: "Viedma",
    ciudadesImportantes: ["Bariloche", "Cipolletti", "General Roca", "El Bolsón"],
  },
  {
    nombre: "Salta",
    capital: "Salta",
    ciudadesImportantes: ["San Ramón de la Nueva Orán", "Tartagal", "Cafayate"],
  },
  {
    nombre: "San Juan",
    capital: "San Juan",
    ciudadesImportantes: ["Rawson", "Rivadavia", "Chimbas", "Santa Lucía"],
  },
  {
    nombre: "San Luis",
    capital: "San Luis",
    ciudadesImportantes: ["Villa Mercedes", "Merlo", "Juana Koslay"],
  },
  {
    nombre: "Santa Cruz",
    capital: "Río Gallegos",
    ciudadesImportantes: ["Caleta Olivia", "El Calafate", "Puerto Deseado"],
  },
  {
    nombre: "Santa Fe",
    capital: "Santa Fe",
    ciudadesImportantes: ["Rosario", "Rafaela", "Venado Tuerto", "Reconquista"],
  },
  {
    nombre: "Santiago del Estero",
    capital: "Santiago del Estero",
    ciudadesImportantes: ["La Banda", "Termas de Río Hondo", "Frías"],
  },
  {
    nombre: "Tierra del Fuego",
    capital: "Ushuaia",
    ciudadesImportantes: ["Río Grande", "Tolhuin"],
  },
  {
    nombre: "Tucumán",
    capital: "San Miguel de Tucumán",
    ciudadesImportantes: ["Yerba Buena", "Tafí Viejo", "Concepción", "Aguilares"],
  },
]

// Función para obtener todas las ciudades importantes de Argentina
export function obtenerTodasLasCiudades() {
  const ciudades: { nombre: string; provincia: string }[] = []

  // Agregar todas las capitales
  provinciasArgentina.forEach((provincia) => {
    ciudades.push({
      nombre: provincia.capital,
      provincia: provincia.nombre,
    })

    // Agregar ciudades importantes
    provincia.ciudadesImportantes.forEach((ciudad) => {
      ciudades.push({
        nombre: ciudad,
        provincia: provincia.nombre,
      })
    })
  })

  return ciudades
}

// Función para obtener solo las capitales de provincias
export function obtenerCapitales() {
  return provinciasArgentina.map((provincia) => ({
    nombre: provincia.capital,
    provincia: provincia.nombre,
  }))
}
