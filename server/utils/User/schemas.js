const mongoose = require("../mongoConnection")

userSchema = new mongoose.Schema({
    user: String,
    name: String,
    surname: String, 
    rooms: [String]
})

module.exports.userSchema = userSchema