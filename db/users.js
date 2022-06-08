const { getConnection } = require('./db');
const bcrypt = require('bcrypt');
const { generateError } = require('../helpers');

const createUser = async (email, password) => {
  let connection;

  try {
    // Conectamos con la base de datos
    connection = await getConnection();
    // Buscamos un usuario con el email que le pasamos
    const [user] = await connection.query(
      `
        SELECT * FROM users WHERE email = ?
          `,
      [email]
    );
    // Si existe, lanzamos error de que solo puede haber un usuario con el mismo email
    if (user.length > 0) {
      throw generateError('Ya existe un usuario con ese email', 409);
    }
    // Si no existe, encriptamos la password
    const passwordHash = await bcrypt.hash(password, 6);

    // Creamos el user en la base de datos
    const [newUser] = await connection.query(
      `
        INSERT INTO users (email, password) VALUES(?,?)
        `,
      [email, passwordHash]
    );

    //Devolvemos la id de ese user
    return newUser.insertId;
    // Cerramos la conexión con la base de datos
  } finally {
    if (connection) connection.release();
  }
};
module.exports = {
  createUser,
};
