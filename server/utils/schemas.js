const mongoose = require("mongoose")

userSchema = new mongoose.Schema({
    user: String,
    name: String,
    surname: String
})

daysSchema = new mongoose.Schema({
    day: String,
    actions: [{
        action: String,
        isDone: { type: Boolean, default: false}
    }]
})

module.exports.userSchema = userSchema
module.exports.daysSchema = daysSchema