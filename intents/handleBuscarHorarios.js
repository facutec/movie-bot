const { Markup } = require('telegraf');
const BuscadorPeliculas = require('../utils/buscadorPeliculas');
const handleHorarioIntent = require('./handleHorarioIntent');
const buscadorPeliculas = new BuscadorPeliculas();

async function handleBuscarHorarios(ctx, nombrePelicula) {
  console.log("handleBuscarHorarios called for nombrePelicula:", nombrePelicula);

  try {
    await buscadorPeliculas.cargarPeliculas();
    const pelicula = buscadorPeliculas.buscarPelicula(nombrePelicula);

    if (!pelicula) {
      ctx.reply("Lo siento, no encontré la película que mencionaste. ¿Te refieres a alguna de estas?");
      
      const botonesPeliculas = buscadorPeliculas.peliculas.map(p => 
        Markup.button.callback(p.nombre, `pelicula_${p.id}`)
      );
      ctx.reply("Selecciona una película:", Markup.inlineKeyboard(botonesPeliculas, { columns: 1 }));
    } else {
      await handleHorarioIntent(ctx, pelicula.id);
    }
  } catch (err) {
    console.error("Error al buscar los horarios:", err);
    ctx.reply("Lo siento, ha ocurrido un error al buscar los horarios.");
  }
}

module.exports = handleBuscarHorarios;
