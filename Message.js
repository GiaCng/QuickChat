const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    "senderEmail" : String,
    "receiverEmail" :String,
    "content" : String,
    "createdAt": {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Message", messageSchema);