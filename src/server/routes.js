const users = require('./controllers/user');

module.exports = (app) => {
  app.get('/users/notes', users.getCards),
  app.post('/users/notes', users.saveCard)
};
