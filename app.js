const express = require('express');
const mongoose = require('mongoose');

const indexRouters = require('./routers/index');

const MONGODB_URI =
  'mongodb+srv://admin:vnUDPAUzwu1bQXcN@cluster0.x6il2.mongodb.net/todolist?retryWrites=true&w=majority';

const app = express();

// view engine set
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(indexRouters);

app.use((req, res, next) => {
  res.status(404).render('404');
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT | 3000);
  })
  .catch((err) => {
    console.log(err);
  });
