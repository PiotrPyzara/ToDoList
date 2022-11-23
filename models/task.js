const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  finish: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('task', taskSchema);
