const mongoose = require("./mongoConnection")

userSchema = new mongoose.Schema({
    user: String,
    name: String,
    surname: String
})

actionSchema = new mongoose.Schema({
    action: String,
    isDone: { type: Boolean, default: false}
})

daysSchema = new mongoose.Schema({
    day: String,
    actions: [actionSchema]
})

module.exports.userSchema = userSchema
module.exports.actionSchema = actionSchema
module.exports.daysSchema = daysSchema