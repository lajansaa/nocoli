const db = require('../db');

const formatDate = (date) => {
    const currentDate = new Date(date);
    const day = currentDate.getDate().toString().padStart(2, '0');
    const monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear()
    return day + ' ' + month + ' ' + year;
  }

const todayDate = formatDate(Date.now());

const getCardsByDate = (request, response) => {
  db.userDB.getCardsByDate(request.params, (error, queryResults) => {
    if (error) {
      console.error(error);
    } else {
      obj = {};
      queryResults.forEach((card) => {
        formattedDate = formatDate(card.created_at);
        if (!(formattedDate in obj)) {
          obj[formattedDate] = [card];
        } else {
          obj[formattedDate].push(card);
        }
      })
      const emptyCard = {'id': null,
                          'user_id': 1,
                          'tags': 'others',
                          'notes': undefined
                         };
      if (!(todayDate in obj)) {
        obj[todayDate] = [emptyCard]
      } else {
        obj[todayDate].push(emptyCard);
      }
      response.send(obj);
    }
  })
}

const getCardsByTags = (request, response) => {
  db.userDB.getCardsByTags(request.params, (error, queryResults) => {
    if (error) {
      console.error(error);
    } else {
      obj = {};
      queryResults.forEach((card) => {
        formattedDate = formatDate(card.created_at);
        if (!(formattedDate in obj)) {
          obj[formattedDate] = [card];
        } else {
          obj[formattedDate].push(card);
        }
      })
      const emptyCard = {'id': null,
                          'user_id': 1,
                          'tags': 'others',
                          'notes': undefined
                         };
      if (!(todayDate in obj)) {
        obj[todayDate] = [emptyCard]
      } else {
        obj[todayDate].push(emptyCard);
      }
      response.send(obj);
    }
  })
}

const saveCard = (request, response) => {
  db.userDB.saveCard(request.body, (status) => {
    response.send("ok");
  })
}

const deleteCard = (request, response) => {
  console.log("came to delete controller", request.body)
  db.userDB.deleteCard(request.body, (error, queryResults) => {
    response.send("ok");
  })
}

const getTags = (request, response) => {
  db.userDB.getTags(request.params, (error, queryResults) => {
    if (error) {
      console.error(error);
    } else {
      response.send(queryResults);
    }
  })
}

module.exports = {
  getCardsByDate,
  getCardsByTags,
  saveCard,
  deleteCard,
  getTags
}