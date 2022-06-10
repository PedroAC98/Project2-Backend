const { generateError } = require('../helpers');
const { getConnection } = require('./db');

const createRecommendation = async (
  userId,
  title,
  category,
  place,
  leadin,
  text,
  image
) => {
  let connection;

  try {
    connection = await getConnection();
    const [result] = await connection.query(
      `
          INSERT INTO recommendations (user_id, title, category, place, leadin, text, image, votes)
          VALUES(?,?,?,?,?,?,?, 0) 
          `,
      [userId, title, category, place, leadin, text, image]
    );
    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const getRecommendationById = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    const [recommendation] = await connection.query(
      `
        SELECT * FROM recommendations WHERE id = ?
      `,
      [id]
    );
    if (recommendation.length === 0) {
      throw generateError(`Recommendation with id: ${id} no existe.`);
    }
    return recommendation[0];
  } finally {
    if (connection) connection.release();
  }
};

const deleteRecommendationById = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `
        DELETE FROM recommendations WHERE id = ?
      `,
      [id]
    );
  } finally {
    if (connection) connection.release();
  }
};

const getAllRecommendations = async (category, place) => {
  let connection;
  try {
    connection = await getConnection();
    let recommendations;
    if (category || place) {
      [recommendations] = await connection.query(
        `
          SELECT * FROM recommendations 
          WHERE category LIKE ? ||
          place LIKE ?
          ORDER BY votes DESC
        `,
        [`%${category}%`, `%${place}%`]
      );
    } else {
      [recommendations] = await connection.query(
        `
          SELECT * FROM recommendations
          ORDER BY votes DESC
        `
      );
    }
    return recommendations;
  } finally {
    if (connection) connection.release();
  }
};

const getVotesValueById = async (id) => {
  let connection;
  try {
    connection = await getConnection();
    const [votesValue] = await connection.query(
      `
      SELECT votes FROM recommendations WHERE id = ? 
    `,
      [id]
    );
    return votesValue[0].votes;
  } finally {
    if (connection) connection.release();
  }
};

const voteRecommendationById = async (id) => {
  let connection;
  try {
    const votesValue = await getVotesValueById(id);
    connection = await getConnection();
    await connection.query(
      `
      UPDATE recommendations
      SET votes = ${votesValue + 1}
      WHERE id = ?
    `,
      [id]
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createRecommendation,
  getRecommendationById,
  deleteRecommendationById,
  getAllRecommendations,
  voteRecommendationById,
};
