const task = require('../models/task');
const Task = require('../models/task');
const { validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');

const ITEMS_PER_PAGE = 5;

exports.getIndex = async (req, res, next) => {
  const page = +req.query.page || 1;

  try {
    const totalItems = await Task.find().count();
    const tasks = await Task.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render('index', {
      pageTitle: 'Lista rzeczy do zrobienia',
      tasks: tasks,
      taskErrorMessage: '',
      editUrl: '',
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasBackPage: page > 1,
      nextPage: page + 1,
      backPage: page - 1,
      totalItems: totalItems,
      editInput: '',
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postCreateTask = async (req, res, next) => {
  const name = req.body.taskname;

  const errors = validationResult(req);
  const page = +req.body.currentPage;

  try {
    const totalItems = await Task.find().count();
    const tasks = await Task.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (!errors.isEmpty()) {
      res.status(422).render('index', {
        pageTitle: 'Lista rzeczy do zrobienia',
        tasks: tasks,
        taskErrorMessage: errors.array()[0].msg,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasBackPage: page > 1,
        nextPage: page + 1,
        backPage: page - 1,
        totalItems: totalItems,
        editInput: name,
      });
    } else {
      const task = new Task({ name: name, finish: false });
      await task.save();

      res.redirect('/?page=' + page);
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }

  // if (errors.isEmpty()) {
  //   const task = new Task({ name: name, finish: false });
  //   task
  //     .save()
  //     .then((result) => {
  //       res.redirect('/?page=' + page);
  //     })
  //     .catch((err) => {
  //       const error = new Error(err);
  //       error.httpStatusCode = 500;
  //       return next(error);
  //     });
  // } else {
  //   Task.find()
  //     .count()
  //     .then((num) => {
  //       totalItems = num;
  //       return Task.find()
  //         .skip((page - 1) * ITEMS_PER_PAGE)
  //         .limit(ITEMS_PER_PAGE);
  //     })
  //     .then((tasks) => {
  //       return res.status(422).render('index', {
  //         pageTitle: 'Lista rzeczy do zrobienia',
  //         tasks: tasks,
  //         taskErrorMessage: errors.array()[0].msg,
  //         currentPage: page,
  //         hasNextPage: ITEMS_PER_PAGE * page < totalItems,
  //         hasBackPage: page > 1,
  //         nextPage: page + 1,
  //         backPage: page - 1,
  //         totalItems: totalItems,
  //         editInput: name,
  //       });
  //     })
  //     .catch((err) => {
  //       const error = new Error(err);
  //       error.httpStatusCode = 500;
  //       return next(error);
  //     });
  // }
};

exports.getTaskEdit = (req, res, next) => {
  const taskID = req.params.taskID;
  let taskName;
  let totalItems;
  const page = parseInt(req.query.page) || 1;

  if (!mongoose.isValidObjectId(taskID)) {
    return res.redirect('/');
  } else {
    Task.findById(taskID)
      .then((task) => {
        if (!task) {
          return res.redirect('/');
        }
        taskName = task.name;
        return Task.find()
          .count()
          .then((num) => {
            totalItems = num;
            return Task.find()
              .skip((page - 1) * ITEMS_PER_PAGE)
              .limit(ITEMS_PER_PAGE);
          });
      })
      .then((tasks) => {
        res.render('edit', {
          pageTitle: 'Lista rzeczy do zrobienia',
          editInput: taskName,
          tasks: tasks,
          taskID: taskID,
          taskErrorMessage: '',
          editUrl: req.url,
          editID: taskID,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasBackPage: page > 1,
          nextPage: page + 1,
          backPage: page - 1,
          totalItems: totalItems,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
};

exports.postEditTask = (req, res, next) => {
  const taskID = req.body.taskID || req.body.editID;
  const taskName = req.body.taskname;
  const editMode = req.body.editMode;
  let editUrl = req.body.editUrl;
  let totalItems;
  // const page = parseInt(req.body.currentPage);
  const page = req.body.currentPage;

  const errors = validationResult(req);

  if (!errors.isEmpty() && !editMode) {
    Task.find()
      .count()
      .then((num) => {
        totalItems = num;
        return Task.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      });
    Task.find()
      .then((tasks) => {
        return res.status(422).render('edit', {
          pageTitle: 'Lista rzeczy do zrobienia',
          tasks: tasks,
          taskErrorMessage: errors.array()[0].msg,
          editInput: taskName,
          taskID: taskID,
          editUrl: editUrl,
          editID: taskID,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasBackPage: page > 1,
          nextPage: page + 1,
          backPage: page - 1,
          totalItems: totalItems,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    Task.findById(taskID)
      .then((task) => {
        if (editMode) {
          task.finish = !task.finish;
          editUrl = '/?page=' + page;
        } else {
          task.name = taskName;
          editUrl = '/?page=' + page;
        }
        return task.save();
      })
      .then((result) => {
        return res.redirect(editUrl || '/');
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
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
