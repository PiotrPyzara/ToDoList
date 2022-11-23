const express = require('express');
const mongoose = require('mongoose');

const indexRouters = require('./routers/index');

const MONGODB_URI =
  'mongodb+srv://admin:vnUDPAUzwu1bQXcN@cluster0.x6il2.mongodb.net/todolist?retryWrites=true&w=majority';

const app = express();

app.use(indexRouters);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT | 3000);
  })
  .catch((err) => {
    console.log(err);
  });
