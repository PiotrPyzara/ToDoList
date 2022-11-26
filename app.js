//config
require('dotenv').config();

const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const errorController = require('./controllers/error');

const indexRouters = require('./routers/index');

// app express init
const app = express();

// store session in mongodb
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});

// view engine set
app.set('view engine', 'ejs');
app.set('views', 'views');

// serving static file in /public middleware
app.use(express.static(path.join(__dirname, 'public')));

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// session middleware
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// csrf middleware
const csrfProtection = csrf();
app.use(csrfProtection);

// csrf local middleware
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routers index
app.use(indexRouters);

// error handler
app.use('/500', errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', { pageTitle: 'Error!' });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
