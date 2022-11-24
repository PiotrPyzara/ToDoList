const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task');

// GET /
router.get('/', taskController.getIndex);

module.exports = router;
