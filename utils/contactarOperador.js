const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

class ContactarOperador {
  constructor(bot, operatorId) {
    this.bot = bot;
    this.operatorId = operatorId;
  }

  async updateUsuarioEstado(userId, estado) {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('User ID is required and must be a non-empty string');
    }

    const userRef = firestore.collection('usuarios').doc(userId);

    try {
      await userRef.update({ hablaOperador: estado });
      console.log(`Estado actualizado para el usuario ${userId}: ${estado}`);
    } catch (error) {
      console.error(`Error actualizando estado para el usuario ${userId}: `, error);
    }
  }

  async notificarOperador(ctx) {
    const userId = ctx.from.id.toString();
    const userName = ctx.from.first_name;
    const userLastName = ctx.from.last_name || '';

    const message = `El usuario ${userName} ${userLastName} (${userId}) necesita asistencia.`;

    try {
      await this.bot.telegram.sendMessage(this.operatorId, message);
      console.log('Operador notificado.');
    } catch (error) {
      console.error('Error notificando al operador: ', error);
    }
  }

  async iniciarConversacionConOperador(ctx) {
    const userId = ctx.from.id.toString();
    await this.updateUsuarioEstado(userId, true);
    await ctx.reply("📞 Hablando con un operador... \n\nPor favor, espera un momento.");
    await this.notificarOperador(ctx);
  }

  async finalizarConversacionConOperador(ctx) {
    const userId = ctx.from.id.toString();
    await this.updateUsuarioEstado(userId, false);
    await ctx.reply("La conversación con el operador ha finalizado. ¿En qué más puedo ayudarte?");
  }
}

module.exports = ContactarOperador;
