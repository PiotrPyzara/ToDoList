const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const taskController = require('../controllers/task');

// GET /
router.get('/', taskController.getIndex);

// POST /task/create
router.post(
  '/task/create',
  body('taskname', 'Zadanie musi mieć conajmniej 3 znaki.').isLength({
    min: 3,
  }),
  taskController.createTask
);

// GET /task/edit/:taskID
router.get('/task/edit/:taskID', taskController.getTaskEdit);

// POST /task/edit
router.post(
  '/task/edit',
  body('taskname', 'Zadanie musi mieć conajmniej 3 znaki.').isLength({
    min: 3,
  }),
  taskController.postEditTask
);

// POST /task/delete
router.post('/task/delete', taskController.postDeleteTask);

module.exports = router;
