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
};

exports.getTaskEdit = async (req, res, next) => {
  const taskID = req.params.taskID;
  const page = +req.query.page || 1;

  try {
    const totalItems = await Task.find().count();
    const tasks = await Task.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (!mongoose.isValidObjectId(taskID)) {
      return res.redirect('/');
    }

    const taskName = (await Task.findById(taskID)).name;

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
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postEditTask = async (req, res, next) => {
  const taskID = req.body.taskID || req.body.editID;
  const taskName = req.body.taskname;
  const editMode = req.body.editMode;
  const page = +req.body.currentPage;
  const editUrl = (req.body.editUrl === undefined) ? '/' : req.body.editUrl;

  const errors = validationResult(req);

  try {
    const totalItems = await Task.find().count();
    const tasks = await Task.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (!errors.isEmpty() && !editMode) {
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
    }

    if (!mongoose.isValidObjectId(taskID)) {
      return res.redirect('/');
    }

    const task = await Task.findById(taskID);

    if (editMode) {
      task.finish = !task.finish;
    } else {
      task.name = taskName;
    }

    await task.save();

    return res.redirect(editMode ? editUrl : '/');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postDeleteTask = async (req, res, next) => {
  const taskID = req.body.taskID;

  try {
    await Task.deleteOne({ _id: taskID });
    return res.redirect('/');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
