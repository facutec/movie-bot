const db = require('../config/firebaseConfig');
const { Markup } = require('telegraf');

async function handlePrecioCommand(ctx) {
  try {
    console.log("handlePrecioCommand called");

    // Obtenemos la QuerySnapshot de la colección 'peliculas'
    const peliculasSnapshot = await db.collection("peliculas").get();

    if (peliculasSnapshot.empty) {
      ctx.reply("Lo siento, no hay películas disponibles en este momento.");
      return;
    }

    let response = `💰 Precios de las Películas 💰\n\n`;

    // Iteramos sobre los documentos de la colección 'peliculas' para obtener los precios
    peliculasSnapshot.forEach((doc) => {
      const peliculaData = doc.data();
      response += `🎬 ${peliculaData.nombre} 🎬\n`;
      response += `💰 Precio: ${peliculaData.precio}\n\n`;
    });

    // Agregar un botón para ver la cartelera
    response += "Para ver la cartelera y las promociones, haz clic en el botón a continuación.";

    // Construcción del teclado inline con botones
    const botones = [
      Markup.button.callback("Ver Horarios y Promociones", "")
    ];

    ctx.reply(response, Markup.inlineKeyboard(botones, { columns: 1 }));
  } catch (err) {
    console.error("Error al obtener los precios:", err);
    ctx.reply("Lo siento, ha ocurrido un error al obtener los precios.");
  }
}

module.exports = handlePrecioCommand;
