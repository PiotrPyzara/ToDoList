const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task');

// GET /
router.get('/', taskController.getIndex);

// POST /task/create
router.get('/task/create');

// GET /task/edit/:taskID
router.get('/task/edit/:taskID');

// POST /task/edit
router.post('/task/edit');

// POST /task/delete
router.post('/task/delete');

module.exports = router;
