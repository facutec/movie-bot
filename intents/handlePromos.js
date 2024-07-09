const db = require('../config/firebaseConfig');
const { Markup } = require('telegraf');

async function handlePromocionesCommand(ctx) {
  try {
    console.log("handlePromocionesCommand called");

    // Obtenemos la QuerySnapshot de la colección 'peliculas'
    const peliculasSnapshot = await db.collection("peliculas").get();

    if (peliculasSnapshot.empty) {
      ctx.reply("Lo siento, no hay películas disponibles en este momento.");
      return;
    }

    // Crear un mapa para almacenar los detalles de las películas
    const peliculasMap = new Map();
    peliculasSnapshot.forEach((doc) => {
      peliculasMap.set(doc.id, doc.data());
    });

    // Obtenemos la QuerySnapshot de la colección 'funciones'
    const funcionesSnapshot = await db.collection("funciones").get();

    if (funcionesSnapshot.empty) {
      ctx.reply("Lo siento, no hay funciones disponibles en este momento.");
      return;
    }

    let response = `🎟️ Promociones de las Películas 🎟️\n\n`;

    // Iteramos sobre los documentos de la colección 'funciones' para obtener las promociones
    funcionesSnapshot.forEach((doc) => {
      const funcionData = doc.data();
      const peliculaId = funcionData.peliculaId; // Asumiendo que hay un campo para relacionar con la colección 'peliculas'
      const peliculaData = peliculasMap.get(peliculaId);

      if (peliculaData) {
        response += `🎬 ${peliculaData.nombre} 🎬\n`;
        response += `📅 Fecha: ${funcionData.fecha}\n`;
        response += `🕒 Hora: ${funcionData.hora}\n`;
        response += `💰 Precio: ${peliculaData.precio}\n`;
        response += `🎁 Promoción: ${funcionData.promociones || 'Sin promociones disponibles'}\n\n`;
      }
    });

    // Enviar la respuesta al usuario
    ctx.reply(response);
  } catch (err) {
    console.error("Error al obtener las promociones:", err);
    ctx.reply("Lo siento, ha ocurrido un error al obtener las promociones.");
  }
}

module.exports = handlePromocionesCommand;
