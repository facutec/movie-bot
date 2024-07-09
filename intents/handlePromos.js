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

    let response = `🎟️ Promociones de las Películas 🎟️\n\n`;

    // Iteramos sobre los documentos de la colección 'peliculas' para obtener las promociones
    peliculasSnapshot.forEach((doc) => {
      const peliculaData = doc.data();
      response += `🎬 ${peliculaData.nombre} 🎬\n`;
      response += `📅 Fecha: ${peliculaData.fecha}\n`;
      response += `🕒 Hora: ${peliculaData.hora}\n`;
      response += `💰 Precio: ${peliculaData.precio}\n`;
      response += `🎁 Promoción: ${peliculaData.promociones}\n\n`;
    });

    // Enviar la respuesta al usuario
    ctx.reply(response);
  } catch (err) {
    console.error("Error al obtener las promociones:", err);
    ctx.reply("Lo siento, ha ocurrido un error al obtener las promociones.");
  }
}

module.exports = handlePromocionesCommand;
