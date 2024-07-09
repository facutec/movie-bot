const db = require('../config/firebaseConfig');

async function handleReservasActivas(ctx) {
  try {
    console.log("handleReservasActivas called");

    // Obtener el ID del usuario desde el contexto de Telegram
    const userId = ctx.from.id.toString();

    // Consultar las reservas activas del usuario (comprada = false)
    const reservasSnapshot = await db.collection("reservas")
      .where("userId", "==", userId)
      .where("comprada", "==", false)
      .get();

    if (reservasSnapshot.empty) {
      ctx.reply("No tienes reservas activas en este momento.");
      return;
    }

    let response = `🎟️ Tus Reservas Activas 🎟️\n\n`;

    // Iterar sobre las reservas y construir la respuesta
    reservasSnapshot.forEach((doc) => {
      const reserva = doc.data();
      response += `🎬 Película ID: ${reserva.peliculaId}\n`;
      response += `📅 Fecha: ${reserva.funcion.fecha}\n`;
      response += `🕒 Hora: ${reserva.funcion.hora}\n`;
      response += `⏳ Caducidad: ${reserva.caducidad}\n`;
      response += `📍 Reserva ID: ${reserva.reservaId}\n\n`;
    });

    // Enviar la respuesta al usuario
    ctx.reply(response);
  } catch (err) {
    console.error("Error al obtener las reservas activas:", err);
    ctx.reply("Lo siento, hubo un error al obtener tus reservas activas.");
  }
}

module.exports = handleReservasActivas;
