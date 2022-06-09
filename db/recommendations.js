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

module.exports = {
  createRecommendation,
};
