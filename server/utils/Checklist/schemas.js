const mongoose = require("../mongoConnection")

actionSchema = new mongoose.Schema({
    action: String,
    isDone: { type: Boolean, default: false}
})

daysSchema = new mongoose.Schema({
    day: String,
    order: Number,
    actions: [actionSchema]
})

module.exports.actionSchema = actionSchema
module.exports.daysSchema = daysSchema