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

    // Consultar los detalles de la película
    const peliculaDoc = await db.collection("peliculas").doc(reserva.peliculaId).get();
    if (!peliculaDoc.exists) {
      console.error(`Película con ID ${reserva.peliculaId} no encontrada.`);
      continue;
    }
    const pelicula = peliculaDoc.data(); // Obtener los datos de la película

    const caducidad = new Date(reserva.caducidad);// Convertir la fecha de caducidad a un objeto Date
    const horaCaducidad = caducidad.toTimeString().split(' ')[0].substring(0, 5);// Obtener solo la hora

    response += `🎬 Película: ${pelicula.nombre}\n`;
    response += `📅 Fecha: ${reserva.funcion.fecha}\n`;
    response += `🕒 Hora: ${reserva.funcion.hora}\n`;
    response += `⏳ Caducidad: ${horaCaducidad}\n`;
    response += `📍 Dirección: \n\n`;

    // Generar el código QR con la información de la reserva y una URL de escaneo
    const qrData = `${process.env.BASE_URL}/scanqr?reservaId=${reserva.reservaId}`;
    const qrCode = await QRCode.toBuffer(qrData);

    // Responder al usuario con la confirmación, el QR y opciones
    await ctx.replyWithPhoto({ source: qrCode }, {
      caption: `Reserva ID: ${reserva.reservaId}\n\n Presenta este código QR en la entrada.`
    });
  }

    const urlDireccionCine = "https://maps.app.goo.gl/EfH2Jaq6cyndxTpQA";
    const mapaCine = new MapaCine(urlDireccionCine);
    const urlMapaCine = mapaCine.obtenerUrlMapa();
    response += `📍 Ubicación del Cine: [Ver en el mapa](${urlMapaCine})\n\n`;

    // Enviar la respuesta al usuario
    ctx.reply(response);
  } catch (err) {
    console.error("Error al obtener las reservas activas:", err);
    ctx.reply("Lo siento, hubo un error al obtener tus reservas activas.");
  }
}

module.exports = handleReservasActivas;
