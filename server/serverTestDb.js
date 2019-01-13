const express = require("express")
const mongoose = require("mongoose")
const schemas = require("./utils/schemas")
mongoose.connect("mongodb://localhost:27017/Jarvis", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDb"))
    .catch(err => console.error("Connection failed", err))

userSchema = schemas.userSchema

const User = mongoose.model("Population", userSchema)

async function query_user(user){
    let userCollection = await User
        .find({
            user : user
        })
    console.log()
    return userCollection 
}

query_user("marco_3") 
.then((findUser) => {
    if (!findUser._id)  {

        user = new User({
                user :"marco_3",
                name : "marco",
                surname : "2"
            })
        
        user.save()
            .then((user2) => console.log(user2))
    }
    else console.log("diocan")
})
