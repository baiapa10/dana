const express = require('express');
const session = require('express-session');
const routes = require('./routes');
const helpers = require('./helpers/format');
const { User } = require('./models');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'very-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(async (req, res, next) => {
  try {
    const sessionUser = req.session.currentUser;
    let currentUser = null;

    if (sessionUser?.id) {
      const latestUser = await User.findByPk(sessionUser.id, {
        attributes: ['id', 'name', 'email', 'role']
      });

      if (latestUser) {
        currentUser = latestUser.get({ plain: true });
        req.session.currentUser = { id: currentUser.id };
      }
    }

    req.currentUser = currentUser;
    res.locals.currentUser = currentUser;
    res.locals.helpers = helpers;
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
