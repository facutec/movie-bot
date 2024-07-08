require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const uuid = require("uuid");
const sendToDialogflow = require("./utils/dialogflowClient");
const { handleCarteleraIntent, handleHorarioIntent, handleReservaIntent, handleHelpIntent, handleDespedidaIntent, handlePrecioCommand } = require('./intents'); // Importa todos los manejadores de intent de un solo lugar
const { inactivityMiddleware } = require('./utils/inactivityMiddleware');

// Inicializa el bot de Telegram con el token desde el archivo .env
const bot = new Telegraf(process.env.BOT_TOKEN);

//Middlewares
bot.use(inactivityMiddleware);

// Manejador global para capturar y loggear todos los callback data
bot.use(async (ctx, next) => {
  if (ctx.updateType === 'callback_query') {
    console.log('Callback data received:', ctx.callbackQuery.data);
    await ctx.answerCbQuery(); // Responder al callback para evitar el "loading" en Telegram
  }
  return next();
});

// Manejar el inicio de la conversación
bot.start(async (ctx) => {
  const userName = ctx.from.first_name; 
  const personalizedGreeting = `¡Hola ${userName}! Bienvenido a Cine Mercedes Digital. Un gusto. ¿En qué puedo ayudarte? 🤖`;
  ctx.reply(personalizedGreeting);
  await handleHelpIntent(ctx);
});

// Manejar los mensajes de texto
bot.on("text", async (ctx) => {
  console.log("Text received:", ctx.message.text);
  const sessionId = uuid.v4(); // Genera un ID de sesión único para cada usuario

  try {
    const result = await sendToDialogflow(ctx.message.text, sessionId);
    const intentName = result.intent.displayName; //nombre del INTENT de Dialogflow
    console.log("Intent detected:", intentName);

    /* Manejo de acciones según Intent */
    if (intentName === "Funciones") {
      await handleCarteleraIntent(ctx);
    } else if (intentName === "SaludoInicial") {
      const userName = ctx.from.first_name;
      const saludoPersonalizado = result.fulfillmentText.replace("[nombre_usuario]", userName);
      ctx.reply(saludoPersonalizado);
      await handleHelpIntent(ctx);
    } else if (intentName === "help") {
      await handleHelpIntent(ctx);
    } else if (intentName === "Despedida") {
      await handleDespedidaIntent(ctx, result);
    } else {
      ctx.reply(result.fulfillmentText);
    }
  } catch (error) {
    // Manejo de errores en caso de fallos
    console.error("Error handling message: ", error);
    ctx.reply("Lo siento, hubo un error procesando tu mensaje.");
  }
});



//* Manejar los callbacks de los botones*//
bot.action("cartelera", async (ctx) => {
  console.log("Cartelera button pressed");
  await handleCarteleraIntent(ctx);
});

bot.action("precio", async (ctx) => {
  console.log("Precio button pressed");
  await handlePrecioCommand(ctx);
});

// bot.action("misReservas", async (ctx) => {
//   console.log("Mis Reservas button pressed");
//   await handleReservasActivas(ctx);
// });

bot.action("help", async (ctx) => {
  console.log("Ayuda button pressed");
  await handleHelpIntent(ctx);
});

bot.action("despedida", async (ctx) => {
  console.log("Despedida button pressed");
  await handleDespedidaIntent(ctx);
});




// Manejar los callbacks de los botones de películas
bot.action(/pelicula_(.*)/, async (ctx) => {
  const peliculaId = ctx.match[1]; // Obtiene el ID de la película del callback data
  await handleHorarioIntent(ctx, peliculaId);
});

bot.action(/horario_(.*)_(.*)_(.*)/, async (ctx) => {
  const peliculaId = ctx.match[1]; // Captura el primer grupo (ID de la película)
  const hora = ctx.match[2];       // Captura el segundo grupo (hora de la función)
  const fecha = ctx.match[3];      // Captura el tercer grupo (fecha de la función)
  
  // Aquí puedes manejar lo que quieras hacer cuando el usuario selecciona un horario
  await handleReservaIntent(ctx, peliculaId, hora, fecha);
});


bot.action('add_email', async (ctx) => {
  const user = await registerUser(ctx);
});

bot.action('skip_email', async (ctx) => {
  const user = await registerUser(ctx);
});




// Inicia el bot y maneja posibles errores
bot.launch().then(() => {
  console.log('Bot started successfully');
}).catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1); // Salir del proceso si el bot no puede iniciarse
});

// Maneja las señales de terminación del proceso para detener el bot correctamente
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = bot;
