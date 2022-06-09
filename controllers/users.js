const { createUser, getUserById, getUserByEmail } = require('../db/users');
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const newUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(20).required(),
    });
    const validation = schema.validate(req.body);
    console.log(validation.error);
    if (validation.error) {
      throw generateError('Debes enviar un email y una password validos', 400);
    }

    const id = await createUser(email, password);
    res.send({
      status: 'ok',
      message: `Usuario creado con la id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(20).required(),
    });
    const validation = schema.validate(req.body);
    console.log(validation.error);
    if (validation.error) {
      throw generateError('Debes enviar un email y una password validos', 400);
    }
    // Recogemos los datos del usuario con ese email
    const user = await getUserByEmail(email);

    // Compruebo que las password coinciden
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError('La contraseña no coincide', 401);
    }
    // Creo el token
    const payload = { id: user.id };

    //Firmo le token

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '30d',
    });

    // Envio el token
    res.send({
      status: 'ok',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUserController,
  getUserController,
  loginController,
};
