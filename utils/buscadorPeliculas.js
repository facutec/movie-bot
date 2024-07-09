const Fuse = require('fuse.js'); // Importa la librería Fuse.js para realizar búsquedas difusas
const db = require('../config/firebaseConfig'); 

class BuscadorPeliculas {
  constructor() {
    this.peliculas = []; 
  }

  //películas desde la colección "peliculas" en Firestore
  async cargarPeliculas() {
    const peliculasSnapshot = await db.collection("peliculas").get(); 

    // Mapea los documentos del snapshot para obtener un array de objetos de películas con sus datos y su ID
    this.peliculas = peliculasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Método para buscar una película por nombre usando Fuse.js para realizar búsquedas difusas
  buscarPelicula(nombre) {
    const fuse = new Fuse(this.peliculas, { // Crea una nueva instancia de Fuse.js con las películas cargadas
        
      keys: ['nombre'], // Indica que las búsquedas se realizarán en la propiedad 'nombre' de las películas
      includeScore: true, // Incluye el puntaje de similitud en los resultados
      threshold: 0.4 // Ajusta el umbral para determinar qué tan estricta es la búsqueda (menor valor = más estricto)
    });

    const resultados = fuse.search(nombre); // Realiza la búsqueda difusa con el nombre proporcionado
    return resultados.length ? resultados[0].item : null; // Devuelve la primera película encontrada o null si no hay resultados
  }
}

module.exports = BuscadorPeliculas; 
