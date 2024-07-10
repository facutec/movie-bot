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


//TODO: Arreglar para añadir un botón de salir
async function handleSalirButton(ctx) {
  // Mensaje de despedida
  const message = "¿Deseas salir?";
  
  const buttons = Markup.inlineKeyboard([
    [Markup.button.callback("Salir", "despedida")]
  ]);
  
  // Enviar el mensaje con los botones
  await ctx.reply(message, buttons);
}

// async function handleReservasActivas(ctx) {
  
//   const message = "¿Deseas ver tus reservas activa?";
  
//   // Crear botones para confirmar y despedirse
//   const buttons = Markup.inlineKeyboard([
//     [Markup.button.callback("Sí, ver mis reservas", "misReservas")],
//     [Markup.button.callback("No, quiero hacer otra cosa", "help")],
//     [Markup.button.callback("No, adios!", "despedida")]
//   ]);
  
//   // Enviar el mensaje con los botones
//   await ctx.reply(message, buttons);
// }
module.exports = {handleMoreActions, handleReservaActions, handleSalirButton};
