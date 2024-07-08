const db = require('../config/firebaseConfig');
const { v4: uuidv4 } = require('uuid');
const { Markup } = require('telegraf');
const QRCode = require('qrcode');
const { FieldValue, Timestamp } = require('firebase-admin/firestore');
const dotenv = require('dotenv');
dotenv.config();

// Función para verificar si el usuario está registrado
async function checkUserRegistered(userId) {
  const userSnapshot = await db.collection("usuarios").doc(userId).get();
  return userSnapshot.exists ? userSnapshot.data() : null;
}

// Función para registrar un nuevo usuario
async function registerUser(userCtx) {
  const newUser = {
    userId: userCtx.id.toString(),
    nombre: userCtx.first_name,  // Asumiendo que el nombre de Telegram se usará como nombre
    telegramId: userCtx.id.toString(),  // ID de Telegram
    email: "",  // Dejar vacío o pedir al usuario que proporcione un email
    reservas: []  // Inicializar con un arreglo vacío
  };

  await db.collection("usuarios").doc(newUser.userId).set(newUser);
  return newUser;
}


// Función asíncrona para manejar la reserva
async function handleReservaIntent(ctx, peliculaId, hora, fecha) {
  console.log(`Reserva intent: peliculaId=${peliculaId}, hora=${hora}, fecha=${fecha}`);

  try {
    // Comprobar si el usuario está registrado
    const userId = ctx.from.id.toString();
    let user = await checkUserRegistered(userId);
  
    if (!user) {
      // Registra al usuario si no está en la base de datos y asigna el usuario registrado
      user = await registerUser(ctx.from);
    }

    // Verificar si el usuario ya tiene 2 reservas activas
    if (user.reservas.length >= 2) {
      ctx.reply("Lo siento, ya has alcanzado el límite máximo de 2 reservas activas.");
      return;
    }

    // Obtener el documento de la función específica
    const funcionesSnapshot = await db.collection("funciones")
      .where("peliculaId", "==", peliculaId)
      .get();

    if (funcionesSnapshot.empty) {
      ctx.reply("Lo siento, no se encontró la función seleccionada.");
      return;
    }

    // Si coincide la hora y fecha de la función con la seleccionada por el usuario
    let funcionData;
    funcionesSnapshot.forEach(doc => {
      const data = doc.data();
      data.funciones.forEach(funcion => {
        if (funcion.hora === hora && funcion.fecha === fecha) {
          funcionData = funcion;
        }
      });
    });

    if (!funcionData || funcionData.asientosDisponibles <= 0) {
      ctx.reply("Lo siento, no hay asientos disponibles para esta función.");
      return;
    }

    // Crear una nueva reserva
    const userName = user.nombre;
    const reservaId = `reserva_de_${userName}_${userId}_${peliculaId}_${Timestamp.now().seconds}`;
    const caducidad = new Date(new Date(`${funcionData.fecha} ${funcionData.hora}`).getTime() - 30 * 60000).toISOString();

    const reserva = {
      reservaId,
      userId,
      peliculaId,
      funcion: {
        hora,
        fecha
      },
      timestamp: new Date().toISOString(),
      caducidad
    };

    // Guardar la reserva en Firestore
    await db.collection("reservas").doc(reservaId).set(reserva);

    // Actualizar el número de asientos disponibles
    const funcionesActualizadas = funcionesSnapshot.docs[0].data().funciones.map(funcion => {
      if (funcion.hora === hora && funcion.fecha === fecha) {
        return {
          ...funcion,
          asientosDisponibles: funcion.asientosDisponibles - 1
        };
      }
      return funcion;
    });

    // Actualizar el documento JSON en Firestore de la función específica
    await db.collection("funciones").doc(funcionesSnapshot.docs[0].id).update({
      funciones: funcionesActualizadas
    });

    // Añadir la reservaId al array de reservas del usuario
    await db.collection("usuarios").doc(userId).update({
      reservas: FieldValue.arrayUnion(reservaId)
    });

    // Generar el código QR con la información de la reserva y una URL de escaneo
    const qrData = `${process.env.BASE_URL}/scanqr?reservaId=${reservaId}`;
    const qrCode = await QRCode.toBuffer(qrData);

    // Responder al usuario con la confirmación, el QR y opciones
    await ctx.replyWithPhoto({ source: qrCode }, {
      caption: `Reserva realizada con éxito.\nGracias ${userName} por confiar en nuestro servicio\n\n ¡Disfruta de la película! 🎬🥳`
    });
    await ctx.reply('RECUERDA: Presenta el QR en la entrada para ingresar a la función. \nTienes hasta 30 minutos antes del comienzo de la función para hacerlo.');
    await ctx.reply(
      '¿Deseas realizar otra acción o finalizar la conversación?',
      Markup.inlineKeyboard([
        Markup.button.callback('Realizar otra acción', 'help'),
        Markup.button.callback('Finalizar', 'despedida')
      ])
    );
  } catch (err) {
    console.error("Error al realizar la reserva:", err);
    ctx.reply("Lo siento, hubo un error al realizar la reserva.");
  }
}


module.exports = handleReservaIntent;
