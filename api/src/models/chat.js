const mongoose = require('mongoose');
const {Schema} = mongoose;

const ChatMessage = new Schema({
    name: String,
    text: String,
    time: {
        type: Date,
        default: Date.now
    }
});

// module.exports = mongoose.model('Message', ChatMessage);
module.exports = ChatMessage;