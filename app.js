const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./utils/database');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// setting session
const myStore = new SequelizeStore({
  db: sequelize
});
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: myStore
}));

myStore.sync();

const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

const errorController = require('./controllers/error');

// setting body-parser
const parser = require('body-parser');
app.use(parser.urlencoded({ extended: false }));

// setting static path 
app.use(express.static(path.join(__dirname, 'public')));

// setting view engine
app.set('view engine', 'pug');
app.set('views', 'views');

// setting routers
app.use(shopRouter);
app.use(authRouter);

// error handle
app.use(errorController.get404);

sequelize.sync()
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })

