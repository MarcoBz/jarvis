const express = require('express')
const router = express.Router()
const database = require('../../database')

router.get('/:id', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({ 
        "message" : "The user does not exist",
        "content" : false
    }); 
    else res.status(200).send({ 
        "message" : "The user exists",
        "content" : findUser
    }) ;  
});