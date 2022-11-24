const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task');

// GET /
router.get('/', taskController.getIndex);

// POST /task/create
router.post('/task/create', taskController.createTask);

// GET /task/edit/:taskID
router.get('/task/edit/:taskID', taskController.getTaskEdit);

// POST /task/edit
router.post('/task/edit', taskController.postEditTask);

// POST /task/delete
router.post('/task/delete', taskController.postDeleteTask);

module.exports = router;
