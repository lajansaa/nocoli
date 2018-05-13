const db = require('../db');

const getCards = (request, response) => {
  db.userDB.getCards(request.params, (error, queryResults) => {
    if (error) {
      console.error(error);
    } else {
      response.send(queryResults);
    }
  })
}

const saveCard = (request, response) => {
  console.log(request.body);
  db.userDB.saveCard(request.body, (status) => {
    response.send("ok");
  })
}



module.exports = {
  getCards,
  saveCard
}