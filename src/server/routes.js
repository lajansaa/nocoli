const users = require('./controllers/user');

module.exports = (app) => {
  app.get('/users/:user_id/cards/date/', users.getCardsByDate),
  app.get('/users/:user_id/cards/tags/:tags', users.getCardsByTags),
  app.post('/users/:user_id/cards', users.saveCard),
  app.delete('/users/:user_id/cards', users.deleteCard),
  app.get('/users/:user_id/tags', users.getTags)
};
