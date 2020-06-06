const mongoose = require("mongoose")
let mongodb_dev = "mongodb://localhost:27017/Jarvis2"
let mongodb_test = "mongodb://heroku_79zszx4f:l9c9envh1nrqo2ikuq5mc5op39@ds111535.mlab.com:11535/heroku_79zszx4f"

mongoose.connect( mongodb_dev, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDb"))
    .catch(err => console.error("Connection failed", err))

module.exports = mongoose