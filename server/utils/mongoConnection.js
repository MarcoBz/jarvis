const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/Jarvis", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDb"))
    .catch(err => console.error("Connection failed", err))

module.exports = mongoose