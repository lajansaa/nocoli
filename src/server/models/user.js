module.exports = (dbPool) => {
  const updateTags = (tags, cardId, callback) => {
    const tagsArr = tags.split(',');
    tagsArr.forEach((tag) => {
      const getTagIdString = `WITH S AS (SELECT id
                                         FROM tags
                                         WHERE name = '${tag.trim()}'
                                        ),
                                  I AS (INSERT INTO tags (name)
                                        SELECT '${tag.trim()}'
                                        WHERE NOT EXISTS (SELECT 1 FROM S)
                                        RETURNING id
                                       )
                              SELECT id
                              FROM I
                              UNION ALL

                              SELECT id
                              FROM S;`
      dbPool.query(getTagIdString, (err, results) => {
        const tagId = results.rows[0].id;
        const insertCardsTags = `DELETE FROM cards_tags WHERE card_id = ${cardId}; INSERT INTO cards_tags (card_id, tag_id) VALUES (${cardId}, ${tagId});`
        dbPool.query(insertCardsTags, (err2) => {
          if (err2) {
            console.error(err2);
          }
        })
      })
    })
  }

  return {
    getCardsByDate: (payload, callback) => {
      console.log("model");
      const queryString = `SELECT
                               C.id,
                               C.user_id,
                               STRING_AGG(T.name, ', ') AS tags,
                               C.notes,
                               C.created_at::DATE,
                               C.updated_at::DATE
                           FROM cards C
                           JOIN cards_tags CT ON C.id = CT.card_id
                           JOIN tags T ON CT.tag_id = T.id
                           WHERE C.user_id = ${payload.user_id}
                           GROUP BY 1,2,4,5,6
                           ORDER BY C.created_at;`
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, results.rows);
        }
      })
    },

    getCardsByTags: (payload, callback) => {
      console.log(payload.tags);
      const queryString = `SELECT
                               C.id,
                               C.user_id,
                               STRING_AGG(T.name, ', ') AS tags,
                               C.notes,
                               C.created_at::DATE,
                               C.updated_at::DATE
                           FROM cards C
                           JOIN cards_tags CT ON C.id = CT.card_id
                           JOIN tags T ON CT.tag_id = T.id
                           WHERE C.user_id = ${payload.user_id}
                             AND T.id IN (${payload.tags})
                           GROUP BY 1,2,4,5,6
                           ORDER BY C.created_at;`
      console.log(queryString);                          
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, results.rows);
        }
      })
    },

    saveCard: (payload, callback) => {
      let queryString;
      if (payload.cardId == null) {
        queryString = `INSERT INTO cards (notes, user_id) VALUES ('${payload.notes}', ${payload.userId}) RETURNING id;`;
      } else {
        queryString = `UPDATE cards SET notes='${payload.notes}' WHERE id = ${payload.cardId} RETURNING id;`;
      }
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          updateTags(payload.tags, results.rows[0].id, (status) => {
            callback(status);
          })
        } 
      })
    },

    deleteCard: (payload, callback) => {
      let queryString = `DELETE FROM cards WHERE id = ${payload.cardId}; DELETE FROM cards_tags WHERE card_id = ${payload.cardId};`
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, results);
        } 
      })
    },

    getTags: (payload, callback) => {
      let queryString = `SELECT DISTINCT
                             2 AS index, T.id, T.name
                         FROM cards C
                         JOIN cards_tags CT ON C.id = CT.card_id
                         JOIN tags T ON CT.tag_id = T.id
                         WHERE C.user_id = ${payload.user_id}
                         UNION 
                         SELECT 1, 0, 'None'
                         ORDER BY 1,3;`
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, results.rows);
        }
      })                   
    }

  }
}