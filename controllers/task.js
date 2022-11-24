const Task = require('../models/task');

exports.getIndex = (req, res, next) => {
  Task.find()
    .then((tasks) => {
      console.log(tasks);
      res.render('index');
    })
    .catch((err) => {
      console.log(err);
    });
};
