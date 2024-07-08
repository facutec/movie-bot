const inactivityTimers = new Map();

const handleInactivityAfterFarewell = (ctx) => {
  const chatId = ctx.chat.id;

  // Resetea el temporizador de inactividad cuando el usuario envía un mensaje
  if (inactivityTimers.has(chatId)) {
    clearTimeout(inactivityTimers.get(chatId));
  }

  // Establece un nuevo temporizador de inactividad
  const timer = setTimeout(() => {
    ctx.reply("¡Hasta luego!");
    inactivityTimers.delete(chatId);
  }, 100); 

  inactivityTimers.set(chatId, timer);
};

const handleDespedidaIntent = async (ctx, result) => {
  ctx.reply(result.fulfillmentText);
  handleInactivityAfterFarewell(ctx); // Iniciar temporizador después de la despedida
};

module.exports = handleDespedidaIntent;
