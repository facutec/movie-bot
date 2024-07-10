const db = require('../config/firebaseConfig');
const Users = require('./users');

class ContactarOperador {
  constructor(bot) {
    this.bot = bot;
    this.db = db; // Usamos la instancia de Firestore exportada
  }

  async notificarOperador(ctx) {
    const userId = ctx.from.id.toString();
    const userName = ctx.from.first_name;
    const userLastName = ctx.from.last_name || '';

    const message = `El usuario ${userName} ${userLastName} (${userId}) necesita asistencia.`;

    try {
      // Obtener el ID del operador de Firestore
      const operadorRef = this.db.collection('operadores').doc('default');
      const operadorDoc = await operadorRef.get();
      const operatorId = operadorDoc.data().telegramId;

      // Enviar mensaje privado al operador
      await this.bot.telegram.sendMessage(operatorId, message);
      console.log('Operador notificado.');
    } catch (error) {
      console.error('Error notificando al operador: ', error);
    }
  }

  async iniciarConversacionConOperador(ctx) {
    const userId = ctx.from.id.toString();
    
    // Verificar si el usuario está registrado
    let user = await Users.checkUserRegistered(userId);
    if (!user) {
      // Registra al usuario si no está en la base de datos
      user = await Users.registerUser(ctx.from);
    }

    await Users.updateUsuarioEstado(userId, true);
    await ctx.reply("📞 Hablando con un operador... \n\nPor favor, espera un momento.");
    await this.notificarOperador(ctx);
  }

  async finalizarConversacionConOperador(ctx) {
    const userId = ctx.from.id.toString();
    await Users.updateUsuarioEstado(userId, false);
    await ctx.reply("La conversación con el operador ha finalizado. ¿En qué más puedo ayudarte?");
  }
}

module.exports = ContactarOperador;
