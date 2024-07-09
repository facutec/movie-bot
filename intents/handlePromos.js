const db = require('../config/firebaseConfig');

async function handlePromocionesIntent(ctx) {
  try {
    console.log("handlePromocionesIntent called");

    // Cargar todas las películas y funciones en paralelo
    const [funcionesSnapshot, peliculasSnapshot] = await Promise.all([
      db.collection("funciones").get(),
      db.collection("peliculas").get()
    ]);

    if (funcionesSnapshot.empty) {
      ctx.reply("Lo siento, no hay funciones disponibles en este momento.");
      return;
    }

    if (peliculasSnapshot.empty) {
      ctx.reply("Lo siento, no hay películas disponibles en este momento.");
      return;
    }

    const peliculasMap = new Map();

    // Crear un mapa de películas con sus datos y promociones
    peliculasSnapshot.forEach((doc) => {
      peliculasMap.set(doc.id, { ...doc.data(), promociones: new Set() });
    });

    funcionesSnapshot.forEach((doc) => {
      const funcionData = doc.data();
      const peliculaId = funcionData.peliculaId;

      if (peliculasMap.has(peliculaId)) {
        const pelicula = peliculasMap.get(peliculaId);
        funcionData.funciones.forEach((funcion) => {
          pelicula.promociones.add(funcion.promociones); // Usar Set para evitar duplicados
        });
      }
    });

    let response = `🎟️ Promociones de las Películas 🎟️\n\n`;

    // Construir la respuesta
    peliculasMap.forEach((pelicula, peliculaId) => {
      response += `🎬 ${pelicula.nombre} 🎬\n`;
      response += `💰 Precio: ${pelicula.precio}\n`;
      response += "🎉 Promociones:\n";
      pelicula.promociones.forEach((promocion) => {
        response += `🎉 ${promocion}\n`;
      });
      response += "\n";
    });

    // Enviar la respuesta al usuario
    ctx.reply(response);
  } catch (error) {
    console.error("Error al obtener la cartelera:", error);
    ctx.reply("Lo siento, ha ocurrido un error inesperado.");
  }
}

module.exports = handlePromocionesIntent;
