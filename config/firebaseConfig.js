const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();


const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();
  
/*
/ async function importCollection(collectionName, dataFilePath) {
//   // Obtiene una referencia a la colección en Firestore
//   const collectionRef = db.collection(collectionName);
  
//   // Lee el archivo JSON y lo parsea a un objeto JavaScript
//   const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

//   // Recorre cada entrada en el objeto data
//   for (const [docId, docData] of Object.entries(data)) {
//       // Crea o actualiza un documento en Firestore con docId como ID del documento
//       // y docData como el contenido del documento
//       await collectionRef.doc(docId).set(docData);
//   }
// }

  
//   // async function populateFirestore() {
  //   try {
  //   //   await importCollection('usuarios', path.join(__dirname, 'usuarios.json'));
  //   //   console.log('Colección usuarios importada.');
  
  //     await importCollection('peliculas', path.join(__dirname, 'peliculas.json'));
  //     console.log('Colección peliculas importada.');
  
  //     await importCollection('funciones', path.join(__dirname, 'funciones.json'));
  //     console.log('Colección funciones importada.');
  
  //   //   await importCollection('reservas', path.join(__dirname, 'reservas.json'));
  //   //   console.log('Colección reservas importada.');
  
  //     console.log('Base de datos poblada con datos ficticios.');
  //   } catch (error) {
  //     console.error('Error poblando la base de datos:', error);
  //   }
  // }
  
  // populateFirestore(); */


module.exports = db;