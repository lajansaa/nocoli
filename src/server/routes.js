const users = require('./controllers/user');

module.exports = (app) => {
  app.get('/users/:user_id/notes/:date', users.getCards),
  app.post('/users/:user_id/notes', users.saveCard)
};
