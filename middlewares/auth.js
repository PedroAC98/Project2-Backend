const { generateError } = require('../helpers');
const jwt = require('jsonwebtoken');
const authUser = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw generateError('Falta la cabecera de Autorizacion', 401);
    }

    // Comprobamos que el token es correcto
    let token;

    try {
      token = jwt.verify(authorization, process.env.SECRET);
    } catch {
      throw generateError('Token incorrecto', 401);
    }

    // Metemos la informacion del token en la request para usarla en el controlador
    req.userId = token.id;
    // Pasamos al controlador
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
};
