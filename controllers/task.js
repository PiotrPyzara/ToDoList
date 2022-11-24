const Task = require('../models/task');

exports.getIndex = (req, res, next) => {
  Task.find()
    .then((tasks) => {
      res.render('index', {
        pageTitle: 'Lista rzeczy do zrobienia',
        tasks: tasks,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.createTask = (req, res, next) => {
  const name = req.body.taskname;

  const task = new Task({ name: name, finish: false });
  task
    .save()
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
