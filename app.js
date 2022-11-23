const express = require('express');
const mongoose = require('mongoose');

const MONGODB_URI =
  'mongodb+srv://admin:vnUDPAUzwu1bQXcN@cluster0.x6il2.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT | 3000);
  })
  .catch((err) => {
    console.log(err);
  });
