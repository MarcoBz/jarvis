const mongoose = require("mongoose")
const schemas = require("../../utils/schemas")
mongoose.connect("mongodb://localhost:27017/Jarvis", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDb"))
    .catch(err => console.error("Connection failed", err))

userSchema = schemas.userSchema
daysSchema = schemas.daysSchema

async function query_user(user){
    let userCollection = await User
        .findOne({
            user : user
        })
    return userCollection 
}

module.exports.query_user = query_user