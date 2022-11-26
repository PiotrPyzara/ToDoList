//config
require('dotenv').config();

const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const indexRouters = require('./routers/index');

const app = express();

// view engine set
app.set('view engine', 'ejs');
app.set('views', 'views');

// serving static file in /public middleware
app.use(express.static(path.join(__dirname, 'public')));

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

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
