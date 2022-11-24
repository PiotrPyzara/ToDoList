const Task = require('../models/task');

exports.getIndex = (req, res, next) => {
  Task.find()
    .then((tasks) => {
      res.render('index', { tasks: tasks });
    })
    .catch((err) => {
      console.log(err);
    });
};
