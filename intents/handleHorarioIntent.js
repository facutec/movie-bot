const db = require('../config/firebaseConfig');
const { Markup } = require('telegraf');

// Función asíncrona para manejar la selección de horarios de una película
async function handleHorarioIntent(ctx, peliculaId) {
  console.log("handleHorarioIntent called for peliculaId:", peliculaId);

  try {
    // Obtenemos el documento de la película seleccionada
    const peliculaDoc = await db.collection("peliculas").doc(peliculaId).get();
    
    if (!peliculaDoc.exists) {
      ctx.reply("Lo siento, no se encontró la película seleccionada.");
      return;
    }

    // Obtenemos la información de las funciones de la película
    const funcionesSnapshot = await db.collection("funciones")
      .where("peliculaId", "==", peliculaId)
      .get();

    if (funcionesSnapshot.empty) {
      ctx.reply("Lo siento, no hay funciones disponibles para esta película.");
      return;
    }

    let response = `Horarios disponibles para 🎬 ${peliculaDoc.data().nombre} 🎬:\n\n`;
    response += "📽️ Sinopsis: 📽️\n\n";
    response += `    ${peliculaDoc.data().sinopsis}\n\n`;
    const botonesHorarios = [];

    // Iteramos sobre las funciones y construimos los botones solo para los horarios con asientos disponibles
    funcionesSnapshot.forEach((doc) => {
      const funcion = doc.data();
      funcion.funciones.forEach((horario) => {
        if (horario.asientosDisponibles > 0) {
          response += `📅 *${horario.hora} (${horario.fecha})* - Asientos disponibles: ${horario.asientosDisponibles}\n`;
          botonesHorarios.push(
            Markup.button.callback(`${horario.hora} (${horario.fecha})`, `horario_${peliculaId}_${horario.hora}_${horario.fecha}`)
          );
        }
      });
    });

    if (botonesHorarios.length === 0) {
      ctx.reply("Lo siento, no hay horarios disponibles para esta película.");
      return;
    }

    // Responde al usuario con los horarios disponibles y el teclado inline
    ctx.reply(response, Markup.inlineKeyboard(botonesHorarios, { columns: 1 }));
  } catch (err) {
    console.error("Error al obtener los horarios:", err);
    ctx.reply("Lo siento, ha ocurrido un error al obtener los horarios.");
  }
}

// Exporta la función handleHorarioIntent para que pueda ser utilizada en otros archivos
module.exports = handleHorarioIntent;
