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
          INSERT INTO recommendations (user_id, title, category, place, leadin, text, image)
          VALUES(?,?,?,?,?,?,?) 
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
        SELECT  U.username AS CreatedBy, R.id, R.user_id,R.title, R.category, R.place, R.leadin, R.text,R.image, SUM(IFNULL(V.value=1,0)) AS likes, R.created_at
        FROM recommendations R
        LEFT JOIN votes V
        ON R.id = V.recommendation_id
        LEFT JOIN users U
        ON R.user_id = U.id
        GROUP BY R.id

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

const getAllRecommendations = async (category, place, votes) => {
  let connection;
  try {
    connection = await getConnection();
    let recommendations;
    if ((category || place) && votes !== 'yes') {
      [recommendations] = await connection.query(
        `
        SELECT  U.username AS CreatedBy, R.id, R.user_id,R.title, R.category, R.place, R.leadin, R.text,R.image, SUM(IFNULL(V.value=1,0)) AS likes, R.created_at
        FROM recommendations R
        LEFT JOIN votes V
        ON R.id = V.recommendation_id
        LEFT JOIN users U
        ON R.user_id = U.id
        WHERE category LIKE ? ||
        place LIKE ?
        GROUP BY R.id
        ORDER BY created_at DESC
        `,
        [`%${category}%`, `%${place}%`]
      );
    } else if ((category || place) && votes === 'yes') {
      [recommendations] = await connection.query(
        `
        SELECT  U.username AS CreatedBy, R.id, R.user_id,R.title, R.category, R.place, R.leadin, R.text,R.image, SUM(IFNULL(V.value=1,0)) AS likes, R.created_at
        FROM recommendations R
        LEFT JOIN votes V
        ON R.id = V.recommendation_id
        LEFT JOIN users U
        ON R.user_id = U.id
        WHERE category LIKE ? ||
        place LIKE ?
        GROUP BY R.id
        ORDER BY likes DESC
        `,
        [`%${category}%`, `%${place}%`]
      );
    } else if (!category && !place && votes !== 'yes') {
      [recommendations] = await connection.query(
        `
          SELECT  U.username AS CreatedBy, R.id, R.user_id,R.title, R.category, R.place, R.leadin, R.text,R.image, SUM(IFNULL(V.value=1,0)) AS likes, R.created_at
        FROM recommendations R
        LEFT JOIN votes V
        ON R.id = V.recommendation_id
        LEFT JOIN users U
        ON R.user_id = U.id
        GROUP BY R.id
        ORDER BY created_at DESC
        `
      );
    } else if (!category && !place && votes === 'yes') {
      [recommendations] = await connection.query(
        `
        SELECT  U.username AS CreatedBy, R.id, R.user_id,R.title, R.category, R.place, R.leadin, R.text,R.image, SUM(IFNULL(V.value=1,0)) AS likes, R.created_at
        FROM recommendations R
        LEFT JOIN votes V
        ON R.id = V.recommendation_id
        LEFT JOIN users U
        ON R.user_id = U.id
        GROUP BY R.id
        ORDER BY likes DESC
        `
      );
    }
    return recommendations;
  } finally {
    if (connection) connection.release();
  }
};

const voteRecommendationById = async (idUser, idRecommendation) => {
  let connection;
  try {
    connection = await getConnection();
    //Comprobamos si existe la recomendacion que queremos votar
    const [recommendations] = await connection.query(
      `
    SELECT value FROM votes WHERE user_id = ? AND recommendation_id = ?`,
      [idUser, idRecommendation]
    );
    if (recommendations.length < 1) {
      await connection.query(
        `
      INSERT INTO votes (user_id, recommendation_id) VALUES (?, ?)`,
        [idUser, idRecommendation]
      );
      return true;
    } else {
      await connection.query(
        `
      UPDATE votes SET value = ? WHERE user_id = ? and recommendation_id = ?`,
        [!recommendations[0].value, idUser, idRecommendation]
      );
      return !recommendations[0].value;
    }
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
