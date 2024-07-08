const db = require('../config/firebaseConfig');
const { Markup } = require('telegraf');


// Función asíncrona para manejar el 'intent' de Cartelera
async function handleCarteleraIntent(ctx) {
  try {
    console.log("handleCarteleraIntent called");

    // Obtenemos la QuerySnapshot de la colección 'funciones'
    const funcionesSnapshot = await db.collection("funciones").get();

    // console.log(funcionesSnapshot);
    if (funcionesSnapshot.empty) {
      ctx.reply("Lo siento, no hay funciones disponibles en este momento.");
      return;
    }

   
    /* Comenzamos a mensaje */
    let response = ""; 
    const peliculas = {}; // Objeto donde almacenaremos las películas que están en cartelera

    // Iteramos sobre los documentos de la colección 'funciones' para obtener la DATA
    for (const doc of funcionesSnapshot.docs) {
      const funcionData = doc.data();
      const peliculaId = funcionData.peliculaId;

      // Si la película NO ha sido agregada al resultado:
      if (!peliculas[peliculaId]) {
        // Obtenemos los datos de la colección 'peliculas' según el ID
        const peliculaDoc = await db.collection("peliculas").doc(peliculaId).get();

        // Si la película existe, construimos el objeto peliculas
        if (peliculaDoc.exists) {
          peliculas[peliculaId] = peliculaDoc.data(); // Obtenemos la información de la película
          peliculas[peliculaId].horarios = []; // Asignamos una propiedad 'horarios' vacía para añadir los horarios del mismo
        }
      }

      // Añadir los horarios a la película correspondiente
      funcionData.funciones.forEach((funcion) => {
        peliculas[peliculaId].horarios.push({
          fecha: funcion.fecha,
          hora: funcion.hora,
        });
      });
    }

    // Construcción del mensaje con emojis
    response += "🎥 Cartelera de Cine 🎥\n\n";
    for (const peliculaId in peliculas) {
      const pelicula = peliculas[peliculaId];
      response += `🎬 ${pelicula.nombre} 🎬\n`;
      // response += `📽️ ${pelicula.sinopsis}\n`;
      response += `\n\n`;
      response += `🎞️ Duración: ${pelicula.duracion} minutos\n`;
      response += `💰 Precio: ${pelicula.precio}\n\n`;
      response += "🕒 Horarios:\n";
      pelicula.horarios.forEach((horario) => {
        response += `📅 ${horario.fecha} a las ${horario.hora}\n`;
      });
      response += "\n";
    }
    response += "\n ¿Desear reservar una función? Selecciona una película: \n\n";

    /*Construcción del teclado inline con botones*/
    const botonesPeliculas = [];
    for (const peliculaId in peliculas) {
      const pelicula = peliculas[peliculaId];
      botonesPeliculas.push(
        Markup.button.callback(pelicula.nombre, `pelicula_${peliculaId}`)
      );
    }

    // Responde al usuario con la cartelera completa y el teclado inline
    ctx.reply(response, Markup.inlineKeyboard(botonesPeliculas, { columns: 1 }));
  } catch (err) {
    console.error("Error al obtener las funciones:", err);
    ctx.reply("Lo siento, ha ocurrido un error al obtener las funciones.");
  }
}

// Exporta la función handleCarteleraIntent para que pueda ser utilizada en otros archivos
module.exports = handleCarteleraIntent;
