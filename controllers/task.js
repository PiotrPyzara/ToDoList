const Task = require('../models/task');

exports.getIndex = (req, res, next) => {
  Task.find()
    .then((tasks) => {
      console.log(tasks);
      res.render('index');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
