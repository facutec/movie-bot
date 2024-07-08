const db = require('../config/firebaseConfig');
const { FieldValue } = require('firebase-admin/firestore');

async function handleQRScan(ctx, reservaId, bot) {
  try {
    // Verificar que la reserva exista
    const reservaSnapshot = await db.collection('reservas').doc(reservaId).get();
    if (!reservaSnapshot.exists) {
      await ctx.reply('Reserva no encontrada');
      return;
    }

    // Verificar si la reserva ya fue comprada
    const reserva = reservaSnapshot.data();
    if (reserva.comprada) {
      await ctx.reply('Reserva ya marcada como comprada');
      return;
    }

    // Marcar la reserva como comprada
    await db.collection('reservas').doc(reservaId).update({
      comprada: true,
      compraTimestamp: new Date().toISOString()
    });

    // Eliminar la reserva del array de reservas del usuario
    const userSnapshot = await db.collection('usuarios').doc(reserva.userId).get();
    if (userSnapshot.exists) {
      const userData = userSnapshot.data();
      const reservasActualizadas = userData.reservas.filter(id => id !== reservaId);
      const reservasAntes = userData.reservas.length;

      await db.collection('usuarios').doc(reserva.userId).update({
        reservas: reservasActualizadas
      });

      const userSnapshotDespues = await db.collection('usuarios').doc(reserva.userId).get();
      const reservasDespues = userSnapshotDespues.data().reservas.length;

      // Verificar que el número de reservas ha disminuido en 1
      if (reservasDespues === reservasAntes - 1) {
        // Verificar que el bot está definido
        if (bot && bot.telegram && bot.telegram.sendMessage) {
          // Enviar un mensaje al usuario a través del bot de Telegram
          await bot.telegram.sendMessage(userData.telegramId, 'Tu reserva ha sido marcada como comprada exitosamente. ¡Disfruta de la película! 🎬🥳');
        } else {
          console.error('Error: El bot no está definido correctamente');
        }
      } else {
        console.error('Error: La reserva no se eliminó correctamente del array de reservas del usuario');
      }
    }

    await ctx.reply('Reserva marcada como comprada exitosamente');
  } catch (err) {
    console.error('Error al manejar el escaneo del QR:', err);
    await ctx.reply('Error interno del servidor');
  }
}

module.exports = handleQRScan;
