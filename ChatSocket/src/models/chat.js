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

module.exports = function (collectionName) {
    return mongoose.model('Message', Message, collectionName);
}