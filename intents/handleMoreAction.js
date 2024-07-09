const { Markup } = require("telegraf");

async function handleMoreActions(ctx) {
  // Mensaje preguntando si desea realizar otra acción
  const message = "¿Deseas realizar otra acción?";

  // Crear botones para confirmar y despedirse
  const buttons = Markup.inlineKeyboard([
    [Markup.button.callback("Sí, quiero hacer otra cosa", "help")],
    [Markup.button.callback("No, adios!", "despedida")]
  ]);

  // Enviar el mensaje con los botones
  await ctx.reply(message, buttons);
}

async function handleReservaActions(ctx) {
  const message = "¿Deseas realizar una reserva?";

  
  const buttons = Markup.inlineKeyboard([
    [Markup.button.callback("Sí, quiero reservar", "cartelera")],
    [Markup.button.callback("No, adios!", "despedida")]
  ]);

  // Enviar el mensaje con los botones
  await ctx.reply(message, buttons);
}

async function handleSalirButton(ctx) {
  
  const buttons = Markup.inlineKeyboard([
    [Markup.button.callback("Salir", "despedida")]
  ]);

  // Enviar el mensaje con los botones
  await ctx.reply(buttons);
}

module.exports = {handleMoreActions, handleReservaActions, handleSalirButton};
