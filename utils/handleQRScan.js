const db = require('../config/firebaseConfig');
const { FieldValue } = require('firebase-admin/firestore');

async function handleQRScan(ctx, reservaId) {
  try {
    // Verificar que la reserva exista
    const reservaSnapshot = await db.collection('reservas').doc(reservaId).get();
    if (!reservaSnapshot.exists) {
      await ctx.reply('Reserva no encontrada');
      return;
    }

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

    // Eliminar la última reserva del array de reservas del usuario
    const userSnapshot = await db.collection('usuarios').doc(reserva.userId).get();
    if (userSnapshot.exists) {
      const userData = userSnapshot.data();
      const reservasActualizadas = userData.reservas.filter(id => id !== reservaId);
      await db.collection('usuarios').doc(reserva.userId).update({
        reservas: reservasActualizadas
      });
    }

    await ctx.reply('Reserva marcada como comprada exitosamente');
  } catch (err) {
    console.error('Error al manejar el escaneo del QR:', err);
    await ctx.reply('Error interno del servidor');
  }
}

module.exports = handleQRScan;
