const mongoose = require('mongoose');
const {Schema} = mongoose;

const Message = new Schema({
    name: String,
    text: String,
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = function (modelName) {
    return mongoose.model('Message', Message, modelName);
}