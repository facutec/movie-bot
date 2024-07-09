const db = require('../config/firebaseConfig');

async function handlePromocionesIntent(ctx) {

  try {
    console.log("handlePromocionesIntent called");

      const funcionesSnapshot = await db.collection("funciones").get();
      const peliculasSnapshot = await db.collection("peliculas").get();

      if (funcionesSnapshot.empty) {
        ctx.reply("Lo siento, no hay funciones disponibles en este momento.");
        return;
      }

      if (peliculasSnapshot.empty) {
        ctx.reply("Lo siento, no hay películas disponibles en este momento.");
        return;
      }
    

      
      const peliculas = {};

      for (const doc of funcionesSnapshot.docs) {
        const funcionData = doc.data();
        const peliculaId = funcionData.peliculaId;

        if (!peliculas[peliculaId]) {
          const peliculaDoc = await db.collection("peliculas").doc(peliculaId).get();

          if (peliculaDoc.exists) {
            peliculas[peliculaId] = peliculaDoc.data();
            peliculas[peliculaId].horarios = [];
            peliculas[peliculaId].promociones = [];
          }
        }

        funcionData.funciones.forEach((funcion) => {
          peliculas[peliculaId].horarios.push({
            fecha: funcion.fecha,
            hora: funcion.hora,
          });
          peliculas[peliculaId].promociones.push({
            promociones: funcion.promociones,
          });
        });


        let response = `🎟️ Promociones de las Películas 🎟️\n\n`;

        for (const peliculaId in peliculas) {
          const pelicula = peliculas[peliculaId];
          response += `🎬 ${pelicula.nombre} 🎬\n`;
          response += `\n\n`;
          response += `💰 Precio: ${pelicula.precio}\n\n`;
          response += "\n";
          response += "🎉 Promociones:\n";
          pelicula.promociones.forEach((promocion) => {
            response += `🎉 ${promocion.promociones}\n`;
          });
        }
        
        // Enviar la respuesta al usuario
        ctx.reply(response);
      }
  } catch (error) {
    console.error("Error al obtener la cartelera:", error);
    ctx.reply("Lo siento, ha ocurrido un error inesperado.");
  }
}

module.exports = handlePromocionesIntent;