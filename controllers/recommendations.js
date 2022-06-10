const Joi = require('@hapi/joi');
const { generateError, createPathIfNotExists } = require('../helpers');
const sharp = require('sharp');
const path = require('path');
const {
  createRecommendation,
  getRecommendationById,
  deleteRecommendationById,
  getAllRecommendations,
  voteRecommendationById,
} = require('../db/recommendations');

const newRecommendationController = async (req, res, next) => {
  try {
    const { title, category, place, leadin, text } = req.body;
    console.log(req.files);
    const schema = Joi.object().keys({
      title: Joi.string().max(20).required(),
      category: Joi.string().max(20).required(),
      place: Joi.string().max(20).required(),
      leadin: Joi.string().max(50).required(),
      text: Joi.string().max(500).required(),
    });

    const validation = schema.validate(req.body);

    let imageFileName;

    if (validation.error) {
      throw generateError(validation.error, 400);
    }
    if (!req.files || !req.files.image) {
      throw generateError('Debes enviar una imagen', 400);
    }

    // Creo el path del directorio uploads
    const uploadsDir = path.join(__dirname, '../uploads');

    // Creo el directorio si no existe
    await createPathIfNotExists(uploadsDir);

    // Procesar la imagen
    const image = sharp(req.files.image.data);
    image.resize(1000);

    // Guardo la imagen con un nombre aleatorio en el directorio uploads
    imageFileName = `${req.files.image.md5}.jpg`;
    await image.toFile(path.join(uploadsDir, imageFileName));

    const id = await createRecommendation(
      req.userId,
      title,
      category,
      place,
      leadin,
      text,
      imageFileName
    );

    res.send({
      status: 'Ok ',
      message: `Recommendation created with id:${id} `,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRecommendationsController = async (req, res, next) => {
  try {
    const { category, place } = req.query;
    const recommendations = await getAllRecommendations(category, place);

    res.send({
      status: 'Ok ',
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleRecommendationController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recommendation = await getRecommendationById(id);
    res.send({
      status: 'Ok ',
      data: recommendation,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecommendationController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recommendation = await getRecommendationById(id);
    if (req.userId !== recommendation.user_id) {
      throw generateError(
        'You are trying to delete a recommendation that isnt yours',
        401
      );
    }
    await deleteRecommendationById(id);
    res.send({
      status: 'Ok',
      message: `Recommendation with id: ${id} deleted`,
    });
  } catch (error) {
    next(error);
  }
};

const voteRecommendationController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await voteRecommendationById(id);
    res.send({
      status: 'Ok',
      message: `Recommendation with id: ${id} voted`,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  newRecommendationController,
  getSingleRecommendationController,
  deleteRecommendationController,
  getAllRecommendationsController,
  voteRecommendationController,
};
