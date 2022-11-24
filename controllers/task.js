const task = require('../models/task');
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

  if (!name) {
    return res.redirect('/');
  }

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

exports.getTaskEdit = (req, res, next) => {
  const taskID = req.params.taskID;
  let taskName;

  Task.findById(taskID)
    .then((task) => {
      if (!task) {
        return res.redirect('/');
      }
      taskName = task.name;
      return Task.find();
    })
    .then((tasks) => {
      res.render('edit', {
        pageTitle: 'Lista zadań',
        editInput: taskName,
        tasks: tasks,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
