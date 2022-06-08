const { createUser } = require('../db/users');
const { generateError } = require('../helpers');
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

module.exports = {
  newUserController,
};
