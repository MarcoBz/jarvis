const express = require("express")
const router = express.Router()
const database = require("../../database")
const schemas = require("../../utils/schemas")
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/Jarvis", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDb"))
    .catch(err => console.error("Connection failed", err))

userSchema = schemas.userSchema
const User = mongoose.model("Population", userSchema)

router.post("/:user", (req, res) => {
    query_user(req.params.user) 
        .then((findUser) => {
            if (!findUser.id)  {

                user = new User({
                        user : req.params.user,
                        name : req.body.name,
                        surname : req.body.surname
                    })
                
                user.save()

                return res.status(200).send({ 
                    "message" : "User created",
                    "content" : false
                });
            }
            else res.status(200).send({ 
                "message" : "The user already exists",
                "content" : findUser.user
            }) ; 
        })
})

router.get("/:user", (req, res) => {
    const findUser = database.find(c => c.user === parseInt(req.params.user)); 
    if (!findUser) return res.status(404).send({ 
        "message" : "The user does not exist",
        "content" : false
    }); 
    else res.status(200).send({ 
        "message" : "The user exists",
        "content" : findUser
    }) ;  
});

async function query_user(user){
    let userCollection = await User
        .find({
            user : user
        })
    return userCollection 
}