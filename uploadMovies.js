const db = require('./config/firebaseConfig');

const movies = [
  { 
    nombre: "Película A", 
    horarios: ["10:00", "12:00", "15:00"],
    sinopsis: "Sinopsis de la Película A"
  },
  { 
    nombre: "Película B", 
    horarios: ["11:00", "13:00", "16:00"],
    sinopsis: "Sinopsis de la Película B"
  }
];

movies.forEach(async (movie) => {
  await db.collection('cartelera').doc(movie.nombre).set(movie);
  console.log(`Película ${movie.nombre} subida a Firestore.`);
});
