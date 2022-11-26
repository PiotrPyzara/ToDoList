const task = require('../models/task');
const Task = require('../models/task');

exports.getIndex = (req, res, next) => {
  Task.find()
    .then((tasks) => {
      res.render('index', {
        pageTitle: 'Lista rzeczy do zrobienia',
        tasks: tasks,
        taskErrorMessage: '',
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
        pageTitle: 'Lista rzeczy do zrobienia',
        editInput: taskName,
        tasks: tasks,
        taskID: taskID,
        taskErrorMessage: '',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditTask = (req, res, next) => {
  const taskID = req.body.taskID;
  const taskName = req.body.taskname;

  if (!taskName) {
    return res.redirect('/');
  }
  Task.findById(taskID)
    .then((task) => {
      if (!task) {
        return res.redirect('/');
      }
      task.name = taskName;
      return task.save();
    })
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteTask = (req, res, next) => {
  const taskID = req.body.taskID;

  Task.deleteOne({ _id: taskID })
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
