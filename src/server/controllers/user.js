const db = require('../db');

const getCards = (request, response) => {
  console.log("request params", request.params);
  console.log("request body", request.body);
  db.userDB.getCards(request.params, (error, queryResults) => {
    if (error) {
      console.error(error);
    } else {
      response.send(queryResults);
    }
  })
}

const saveCard = (request, response) => {
  db.userDB.saveCard(request.params.id, (error, queryResults) => {
    if (error) {
      console.error(error);
    } else {
      response.send("ok");
    }
  })
}



module.exports = {
  getCards,
  saveCard
}