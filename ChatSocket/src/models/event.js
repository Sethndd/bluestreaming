const mongoose = require('mongoose');
const {Schema} = mongoose;

const Event = new Schema({
    code: String,
    title: String,
    desciption: [String],
});

module.exports = mongoose.model('Event', ChatMessage);