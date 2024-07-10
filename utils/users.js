const db = require('../config/firebaseConfig');

class Users {
  // Verificar si el usuario está registrado
  async checkUserRegistered(userId) {
    const userSnapshot = await db.collection("usuarios").doc(userId).get();
    return userSnapshot.exists ? userSnapshot.data() : null;
  }

  // Registrar un nuevo usuario
  async registerUser(userCtx) {
    const newUser = {
      userId: userCtx.id.toString(),
      nombre: userCtx.first_name,  // Asumiendo que el nombre de Telegram se usará como nombre
      telegramId: userCtx.id.toString(),  // ID de Telegram
      email: "",  // Dejar vacío o pedir al usuario que proporcione un email
      reservas: [],  // Inicializar con un arreglo vacío
      hablaOperador: false // Inicializar el atributo hablaOperador
    };

    await db.collection("usuarios").doc(newUser.userId).set(newUser);
    return newUser;
  }

  // Actualizar el estado del usuario
  async updateUsuarioEstado(userId, estado) {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('User ID is required and must be a non-empty string');
    }

    const userRef = db.collection('usuarios').doc(userId);

    try {
      await userRef.update({ hablaOperador: estado });
      console.log(`Estado actualizado para el usuario ${userId}: ${estado}`);
    } catch (error) {
      console.error(`Error actualizando estado para el usuario ${userId}: `, error);
    }
  }
}

module.exports = new Users();
