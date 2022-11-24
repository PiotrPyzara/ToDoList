const express = require('express');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const indexRouters = require('./routers/index');

const MONGODB_URI =
  'mongodb+srv://admin:vnUDPAUzwu1bQXcN@cluster0.x6il2.mongodb.net/todolist?retryWrites=true&w=majority';

const app = express();

// view engine set
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(indexRouters);

// error handler
app.use('/500', errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', { pageTitle: 'Error!' });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT | 3000);
  })
  .catch((err) => {
    console.log(err);
  });
