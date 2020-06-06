const express = require("express")
const router = express.Router()
const database = require("../../database")
const schemas = require("../../utils/User/schemas")
const utils = require("../../utils/mongoUtils")
const mongoose = require("../../utils/mongoConnection")

userSchema = schemas.userSchema
const User = mongoose.model("Population", userSchema)

router.post("/:user", (req, res) => {
    utils.query_user(req.params.user) 
        .then((findUser) => {
            if (!findUser)  {
                user = new User({
                        user : req.params.user,
                        name : req.body.name,
                        surname : req.body.surname,
                        rooms : ['Checklist']
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

// router.patch("/:user/rooms", (req, res) => {
//     utils.query_user(req.params.user) 
//         .then((findUser) => {
//             if (!findUser)  return res.status(404).send({ 
//                 "message" : "The user does not exist",
//                 "content" : false
//             }); 
            
//             if (req.body.op == "add"){
//                 for (let i = 0; i < findUser.rooms.length; i++){
//                     if (findUser.rooms[i] == req.body.value){
//                         res.status(200).send({ 
//                             "message" : "The user has already access to the room",
//                             "content" : findUser
//                         }) ;                         
//                     }
//                 }
//                 findUser.rooms.push(req.body.value)
//                 res.status(200).send({ 
//                     "message" : "The user can access the room now",
//                     "content" : findUser
//                 })
                
//             }

//             if (req.body.op == "delete"){
//                 for( let i = 0; i < findUser.rooms.length; i++){ 
//                     if ( findUser.rooms[i] === req.body.value) {
//                         findUser.rooms.splice(i, 1); 
//                         res.status(200).send({ 
//                             "message" : "The user cannot access the room now",
//                             "content" : findUser
//                         })
//                     }
//                 }
//                 res.status(200).send({ 
//                     "message" : "The user cannot already access the room",
//                     "content" : findUser
//                 })
//             }

//         });
// })



module.exports = router