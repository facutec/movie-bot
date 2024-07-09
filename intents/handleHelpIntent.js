const { Markup } = require("telegraf");

async function handleHelpIntent(ctx) {
  // Mensaje de ayuda con los comandos disponibles
  const helpMessage = `
  Aquí tienes las opciones disponibles:
  /cartelera - Consultar la cartelera
  /precio - Consultar precio de las entradas
  /misReservas - Ver mis reservas activas
  /ayuda - Mostrar esta ayuda
  /despedida - Finalizar la conversación
  `;

  // Crear botones para cada opción
  const botonesAyuda = [
    [Markup.button.callback("Consultar Cartelera", "cartelera")],
    [Markup.button.callback("Precio Entradas", "precio")],
    [Markup.button.callback("Promociones", "promociones")],
    [Markup.button.callback("Mis reservas", "misReservas")],
    [Markup.button.callback("Mostrar Ayuda", "help")],
    [Markup.button.callback("Finalizar Conversación", "despedida")]
  ];

  // Enviar el mensaje de ayuda con los botones
  await ctx.reply(helpMessage);
  await ctx.reply("Elige una opción:", Markup.inlineKeyboard(botonesAyuda));
}

module.exports = handleHelpIntent;
