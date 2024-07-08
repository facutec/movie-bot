const inactivityTimers = new Map();

module.exports = async (ctx, next) => {
  const chatId = ctx.chat.id;

  // Resetea el temporizador de inactividad cuando el usuario envía un mensaje
  if (inactivityTimers.has(chatId)) {
    clearTimeout(inactivityTimers.get(chatId));
  }

  // Establece un nuevo temporizador de inactividad
  const timer = setTimeout(async () => {
    ctx.reply("¿Sigues ahí? Si no respondes, finalizaré la conversación.");

    // Espera 30 segundos para la respuesta del usuario
    const waitForResponse = setTimeout(() => {
      ctx.reply("No recibí respuesta. ¡Hasta luego!");
      inactivityTimers.delete(chatId);
    }, 30000); // 30 segundos

    inactivityTimers.set(chatId, waitForResponse);
  }, 300000); // 5 minutos

  inactivityTimers.set(chatId, timer);

  await next();
};
