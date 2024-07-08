const express = require('express');
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');
const handleQRScan = require('./utils/handleQRScan.js'); // Importa la función de escaneo QR

require('dotenv').config();

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(bodyParser.json());

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
    console.error("Error handling message: ", error);
    ctx.reply("Lo siento, hubo un error procesando tu mensaje.");
  }
});

// Middleware de Telegraf para Express
app.use(bot.webhookCallback('/bot'));

// Endpoint para escanear el QR
app.get('/scanqr', async (req, res) => {
  const { reservaId } = req.query;
  if (!reservaId) {
    return res.status(400).send('Missing reservaId');
  }

  const ctx = {
    reply: (message) => {
      // Simula la función de respuesta de Telegram
      res.send(message);
    }
  };

  await handleQRScan(ctx, reservaId);
});

// Iniciar el servidor HTTP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  bot.launch().then(() => {
    console.log('Bot started successfully');
  }).catch((error) => {
    console.error('Failed to start bot:', error);
    process.exit(1); // Salir del proceso si el bot no puede iniciarse
  });
});
