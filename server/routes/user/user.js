const express = require("express")
const router = express.Router()
const database = require("../../database")
const schemas = require("../../utils/schemas")
const utils = require("../../utils/mongoUtils")
const mongoose = require("../../utils/mongoConnection")

userSchema = schemas.userSchema
const User = mongoose.model("Population", userSchema)

router.post("/:user", (req, res) => {
    utils.query_user(req.params.user) 
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
                    "content" : true
                });
            }
            else res.status(200).send({ 
                "message" : "The user already exists",
                "content" : findUser.user
            }) ; 
        })
})

router.get("/:user", (req, res) => {
    utils.query_user(req.params.user) 
        .then((findUser) => {
            if (!findUser)  return res.status(404).send({ 
                "message" : "The user does not exist",
                "content" : false
            }); 
            else res.status(200).send({ 
                "message" : "The user exists",
                "content" : findUser
            }) ; 
        });
})



module.exports = router