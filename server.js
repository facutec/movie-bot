const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const { Telegraf, Markup } = require("telegraf");
const uuid = require("uuid");
const sendToDialogflow = require("./utils/dialogflowClient");
const {handleSalirButton, handleReservaActions, handleMoreActions, handleBuscarHorarios, handleReservasActivas, handleCarteleraIntent, handleHorarioIntent, handleReservaIntent, handleHelpIntent, handleDespedidaIntent, handlePrecioCommand, handlePromocionesIntent} = require('./intents');
const { inactivityMiddleware } = require('./utils/inactivityMiddleware');
const handleQRScan = require('./utils/handleQRScan'); // Importa handleQRScan

const ContactarOperador = require('./utils/contactarOperador');
dotenv.config();

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);


// Inicializar el módulo para contactar al operador
const operatorId = process.env.OPERATOR_ID;

const contactarOperador = new ContactarOperador(bot, operatorId);



app.use(bodyParser.json());

// Middlewares
bot.use(inactivityMiddleware);

// Manejador global para capturar y loggear todos los callback data
bot.use(async (ctx, next) => {
  if (ctx.updateType === 'callback_query') {
    console.log('Callback data received:', ctx.callbackQuery.data);
    await ctx.answerCbQuery(); // Responder al callback para evitar el "loading" en Telegram
  }
  return next();
});

// Inicializa el bot de Telegram con el token desde el archivo .env
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
    
    /*debbugging logs para la terminal*/
    console.log("Intent detected:", intentName);
    console.log("Parameters received:", result.parameters.fields); 
    console.log("Parameters received:", JSON.stringify(result.parameters.fields, null, 2)); // Agregar esta línea para depuración

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
    } else if (intentName === "PeliculaEspecifica") {
      console.log("Parameters PeliculaEspecifica:", result.parameters.fields);
      console.log("");
      console.log("");
      console.log("");
      console.log("RESULT:", result);
      console.log("");
      console.log("");
      console.log("");
      const fields = result.parameters.fields;
      let nombrePelicula = null;

      // Verificar el parámetro 'pelicula'
      if (fields && fields.pelicula) {
        nombrePelicula = fields.pelicula.stringValue;
      }

      if (nombrePelicula) {
        await handleBuscarHorarios(ctx, nombrePelicula);
      } else {
        ctx.reply("Lo siento, no pude encontrar información sobre esa película.");
        await handleCarteleraIntent(ctx);
      }
    } else if(intentName === "Precio"){
      //TODO: Implementar la lógica para manejar el precio de las entradas
      await handlePrecioCommand(ctx);
      await handleMoreActions(ctx);
    } else if(intentName === "Promociones"){
      //TODO: Implementar la lógica para manejar las promociones
      await handlePromocionesIntent(ctx);
      await handleMoreActions(ctx);
    } else if(intentName === "Ubicacion"){
      //TODO: Implementar la lógica para manejar la ubicación del cine
      const urlDireccionCine = "https://maps.app.goo.gl/EfH2Jaq6cyndxTpQA";
      await ctx.replyWithHTML(`📍 Ubicación del Cine: <a href="${urlDireccionCine}">Ver en el mapa</a>`);
      await handleMoreActions(ctx);
    } else {
      ctx.reply(result.fulfillmentText);
    }
  } catch (error) {
    console.error("Error handling message: ", error);
    ctx.reply("Lo siento, hubo un error procesando tu mensaje.");
  }
});

//* Manejar los callbacks de los botones*//
bot.action("cartelera", async (ctx) => {
  console.log("Cartelera button pressed");
  await handleCarteleraIntent(ctx);
  await handleSalirButton(ctx);
});

bot.action("precio", async (ctx) => {
  console.log("Precio button pressed");
  await handlePrecioCommand(ctx);
  await handleMoreActions(ctx);
});

bot.action("help", async (ctx) => {
  console.log("Ayuda button pressed");
  await handleHelpIntent(ctx);
});
bot.action("promociones", async (ctx) => {
  console.log("PROMOCIONES button pressed");
  await handlePromocionesIntent(ctx);
  await handleMoreActions(ctx);
});

bot.action("misReservas", async (ctx) => {
  console.log("ReservasACTIVAS button pressed");
  await handleReservasActivas(ctx);
  await handleReservaActions(ctx);
});


//TODO: Implementar la lógica para buscar una película específica desde menu

bot.action("peliEspecifica", async (ctx) => {
  console.log("PeliEspecifica button pressed");
  await ctx.reply("Ingresa un mensaje como: ¿Qué horarios hay para 'nombre de la película'? ó ¿A qué hora dan 'nombre de la película'?");
});

// // Handle text messages when searching for a specific movie
// bot.on("text", async (ctx) => {
//   if (ctx.session.searchingSpecificMovie) {
//     const movieName = ctx.message.text;
//     await handleBuscarHorarios(ctx, movieName);
//     ctx.session.searchingSpecificMovie = false; // Reset the flag
//   }
// });

bot.action("despedida", async (ctx) => {
  console.log("Despedida button pressed");

  try {
    const sessionId = uuid.v4(); // Genera un ID de sesión único para cada usuario
    const result = await sendToDialogflow("despedida", sessionId); // Supongamos que el texto del intent es "despedida"

    await handleDespedidaIntent(ctx, result);
  } catch (error) {
    console.error("Error handling despedida action: ", error);
    ctx.reply("Lo siento, hubo un error procesando tu despedida.");
  }
});

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


bot.action("mapa", async (ctx) => {
  const urlDireccionCine = "https://maps.app.goo.gl/EfH2Jaq6cyndxTpQA";
  // const mapaCine = new MapaCine(urlDireccionCine);
  // const urlMapaCine = mapaCine.obtenerUrlMapa();
  ctx.replyWithHTML(`📍 Ubicación del Cine: <a href="${urlDireccionCine}">Ver en el mapa</a>`);
  // await handleHelpIntent(ctx);
  await handleMoreActions(ctx);
});

bot.action("operador", async (ctx) => {
  await contactarOperador.iniciarConversacionConOperador(ctx);
});

//TODO: Implementar la lógica para manejar el registro de usuarios y enviar al email la entrada
bot.action('add_email', async (ctx) => {
  const user = await registerUser(ctx);
});

bot.action('skip_email', async (ctx) => {
  const user = await registerUser(ctx);
});

// Middleware de Telegraf para Express
app.use(bot.webhookCallback('/bot'));


// Endpoint para escanear el QR
app.get('/scanqr', async (req, res) => {
  const { reservaId } = req.query; // Usamos req.query para obtener los parámetros en una solicitud GET
  if (!reservaId) {
    return res.status(400).send('Missing reservaId');
  }

  const ctx = {
    reply: (message) => {
      // Simula la función de respuesta de Telegram
      res.send(message);
    }
  };

  await handleQRScan(ctx, reservaId, bot);
  // No se debe responder dos veces
});



// Iniciar el servidor HTTP
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Establecer webhook
  const webhookUrl = `${process.env.BASE_URL}/bot`;
  await bot.telegram.setWebhook(webhookUrl);

  console.log('Webhook has been set');
});

module.exports = bot;
