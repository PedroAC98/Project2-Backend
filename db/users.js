const { getConnection } = require('./db');
const bcrypt = require('bcrypt');
const { generateError } = require('../helpers');

// Devuelve la información de un user por su id

const getUserById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        SELECT id, username, created_at FROM users WHERE id = ?
      `,
      [id]
    );
    console.log(result);
    if (result.length === 0) {
      throw generateError('No hay ningún usuario con esa id', 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const createUser = async (email, password, username) => {
  let connection;

  try {
    // Conectamos con la base de datos
    connection = await getConnection();
    // Buscamos un usuario con el email que le pasamos
    const [user] = await connection.query(
      `
        SELECT * FROM users WHERE email = ? OR username = ? 
          `,
      [email, username]
    );
    // Si existe, lanzamos error de que solo puede haber un usuario con el mismo email
    if (user.length > 0) {
      throw generateError(
        'Ya existe un usuario con ese email o ese nombre de usuario',
        409
      );
    }
    // Si no existe, encriptamos la password
    const passwordHash = await bcrypt.hash(password, 6);

    // Creamos el user en la base de datos
    const [newUser] = await connection.query(
      `
        INSERT INTO users (email, password,username) VALUES(?,?,?)
        `,
      [email, passwordHash, username]
    );

    //Devolvemos la id de ese user
    return newUser.insertId;
    // Cerramos la conexión con la base de datos
  } finally {
    if (connection) connection.release();
  }
};

const getUserByEmail = async (email) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        SELECT * FROM users WHERE email = ?
      `,
      [email]
    );
    console.log(result);
    if (result.length === 0) {
      throw generateError('No hay ningún usuario con ese email', 404);
    }
    return result[0];
  } finally {
    if (connection) connection.release();
  }
};
module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};
