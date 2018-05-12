
module.exports = (dbPool) => {
  return {
    getCards: (user, callback) => {
      const queryString = `SELECT * FROM cards WHERE id = 1;`
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, results.rows[0]);
        }
      })
    },

    saveCard: (payload, callback) => {
      if (payload.cardId == null) {
        const queryString = `INSERT INTO cards (tags, notes, user_id) VALUES (${payload.tags}, ${payload.notes}, ${payload.user_id})`;
      } else {
        const queryString = `UPDATE cards SET tags=${payload.tags}, notes=${payload.notes} WHERE id = ${cardId};`;
      }

      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(results);
        } 
      })
    }
  }
}