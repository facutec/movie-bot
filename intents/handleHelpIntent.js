const { Markup } = require("telegraf");

async function handleHelpIntent(ctx) {
  // Mensaje de ayuda con los comandos disponibles
  const helpMessage = `
  ✨ ¡Bienvenido a Cine Mercedes Digital! 🎬

      Selecciona una de las siguientes opciones para obtener más información:

  🤖 *Nota:* Soy un bot y estoy aquí para ayudarte, pero a veces puedo cometer errores. ¡Gracias por tu paciencia!
  `;

// Crear botones para cada opción
const botonesAyuda = [
  [Markup.button.callback("Consultar Cartelera 🎥", "cartelera")],
  [Markup.button.callback("Precio Entradas 💰", "precio")],
  [Markup.button.callback("Promociones 💸", "promociones")],
  [Markup.button.callback("Mis Reservas 📅", "misReservas")],
  [Markup.button.callback("Ubicación del Cine 📍", "mapa")],
  [Markup.button.callback("Buscar Peli Específica 🔍", "peliEspecifica")],
  [Markup.button.callback("Mostrar Ayuda 🆘", "help")],
  [Markup.button.callback("Hablar con un operador 📞", "operador")],
  [Markup.button.callback("Finalizar Conversación 👋", "despedida")]
];

  // Enviar el mensaje de ayuda con los botones
  await ctx.reply(helpMessage);
  await ctx.reply("Elige una opción:", Markup.inlineKeyboard(botonesAyuda));
}

module.exports = handleHelpIntent;
