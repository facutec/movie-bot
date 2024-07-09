const db = require('../config/firebaseConfig');
const QRCode = require('qrcode');
const dotenv = require('dotenv');
dotenv.config();

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
    for (const doc of reservasSnapshot.docs) {
      const reserva = doc.data();
      response += `🎬 Película ID: ${reserva.peliculaId}\n`;
      response += `📅 Fecha: ${reserva.funcion.fecha}\n`;
      response += `🕒 Hora: ${reserva.funcion.hora}\n`;
      response += `⏳ Caducidad: ${reserva.caducidad}\n`;
      response += `📍 Reserva ID: ${reserva.reservaId}\n\n`;

      // Generar el código QR con la información de la reserva y una URL de escaneo
      const qrData = `${process.env.BASE_URL}/scanqr?reservaId=${reserva.reservaId}`;
      const qrCode = await QRCode.toBuffer(qrData);

      // Responder al usuario con la confirmación, el QR y opciones
      await ctx.replyWithPhoto({ source: qrCode }, {
        caption: `Reserva ID: ${reserva.reservaId}\n\n Presenta este código QR en la entrada.`
      });
    }

    // Enviar la respuesta al usuario
    ctx.reply(response);
  } catch (err) {
    console.error("Error al obtener las reservas activas:", err);
    ctx.reply("Lo siento, hubo un error al obtener tus reservas activas.");
  }
}

module.exports = handleReservasActivas;
