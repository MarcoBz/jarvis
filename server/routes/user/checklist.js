const express = require('express')
const router = express.Router()
const database = require('../../database')

router.get('/:id/lastDay', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 
    else res.status(200).send({
        "message" : "The user exists",
        "content" : findUser.lastDay
    })   
});

router.get('/:id/actions', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 
    else res.status(200).send({
        "message" : "The user exists",
        "content" : findUser.actions
    })   
});

router.get('/:id/actions/:action', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 

    const findAction = findUser.actions[req.params.action]; 
    if (!findAction) return res.status(404).send({
        "message" : "The action does not exist",
        "content" : false
    }); 
    else return res.status(200).send({
        "message" : "The action exists",
        "content" : findAction
    })   
});

router.patch('/:id/actions/', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 

    if (req.body.op == "replace"){
        let updatedAction = req.body.path.split('/')[1]
        findUser.actions[updatedAction] = req.body.value
        return res.status(200).send({
            "message" : "Replaced value of action",
            "content" : findUser
        });
    }
    else if (req.body.op == "add"){
        let newAction = req.body.path.split('/')[1]
        findUser.actions[newAction] = req.body.value
        return send({
            "message" : "Added action",
            "content" : findUser
        });
    }
    return res.status(204).send({
        "message" : "No operations",
        "content" : findUser
    });
});

router.get('/:id/dailyRecap', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 
    else return res.status(200).send({
        "message" : "The user exists",
        "content" : findUser.dailyRecap
    });   
});

router.get('/:id/dailyRecap/:day', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    });
    
    const findDay = findUser.dailyRecap[req.params.day]; 
    if (!findDay) return res.status(404).send({
        "message" : "Not found the right day",
        "content" : false
    });

    else return res.status(200).send({
        "message" : "Found day",
        "content" : findDay
    })
});

router.patch('/:id/dailyRecap', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 

    if (req.body.op == "replace"){
        let updatedDay = req.body.path.split('/')[1]
        findUser.dailyRecap[updatedDay] = req.body.value
        return res.status(200).send({
            "message" : "Replaced value",
            "content" : findUser
        });
    }

    else if (req.body.op == "add"){
        let newDay = req.body.path.split('/')[1]
        findUser.dailyRecap[newDay] = req.body.value
        return res.status(201).sendres.status(200).send({
            "message" : "Added dailyRecap",
            "content" : findUser
        });
    }
    return res.status(204).send({
        "message" : "No operations",
        "content" : findUser
    });
});

router.get('/:id/dailyStatus', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 
    else return res.status(200).send({
        "message" : "The user exists",
        "content" : findUser.dailyStatus
    }); 
});

router.get('/:id/dailyStatus/:status', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 
    const findStatus = findUser.dailyStatus[req.params.action];
    if (!findStatus) return res.status(404).send({
        "message" : "Not found the right status",
        "content" : false
    }); 

    else return res.status(200).send({
        "message" : "Found status",
        "content" : findStatus
    }) 
});

router.patch('/:id/dailyStatus', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 

    if (req.body.op == "replace"){
        let updatedStatus = req.body.path.split('/')[1]
        findUser.dailyStatus[updatedStatus] = parseInt(req.body.value)   
        return res.status(200).send({
            "message" : "Replaced value",
            "content" : findUser
        });
    }

    return res.status(204).send({
        "message" : "No operations",
        "content" : findUser
    });
});

router.get('/:id/days/:day', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 
    const findDay = findUser.days[req.params.day]; 
    if (!findDay) return res.status(404).send({
        "message" : "Not found the right day",
        "content" : false
    }); 

    else return res.status(200).send({
        "message" : "Found day",
        "content" : findDay
    })   
});

router.patch('/:id/days', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 

    if (req.body.op == "add"){
        
        let newDay = req.body.path.split('/')[1]
        findUser.days[newDay] = req.body.value
        findUser.lastDay = newDay

        for (action in req.body.value){
            findUser.actions[action][1] += 1
        }

        findUser.dailyRecap[newDay] = [0, Object.keys(req.body.value).length, "a"]
        findUser.dailyStatus["a"] += 1

        return res.status(201).send({
            "message" : "Added day",
            "content" : findUser
        });
    }
    res.status(204)
});


router.patch('/:id/days/:day', (req, res) => {
    const findUser = database.find(c => c.id === parseInt(req.params.id)); 
    if (!findUser) return res.status(404).send({
        "message" : "The user does not exist",
        "content" : false
    }); 
    const day = req.params.day
    const findDay = findUser.days[day]; 
    if (!findDay) return res.status(404).send({
        "message" : "Not found the right day",
        "content" : false
    });

    for (let ops in req.body){

        if (req.body[ops].op == "replace"){
            let updatedAction = req.body[ops].path.split('/')[1]
            findUser.days[req.params.day][updatedAction] = req.body[ops].value
            let checkOrNotCheck
            if (req.body[ops].value == true ) checkOrNotCheck = 1
            else if (req.body[ops].value == false ) checkOrNotCheck = -1
            else checkOrNotCheck = 0
            findUser.actions[updatedAction][0] += checkOrNotCheck 
            let oldPercActions = 100 * parseInt(findUser.dailyRecap[day][0]) / parseInt(findUser.dailyRecap[day][1])
            let oldStatus = defineStatus(oldPercActions)
            findUser.dailyRecap[day][0] += checkOrNotCheck 
            let percActions = 100 * parseInt(findUser.dailyRecap[day][0]) / parseInt(findUser.dailyRecap[day][1])
            let status = defineStatus(percActions)
            findUser.dailyStatus[oldStatus] -= checkOrNotCheck 
            findUser.dailyStatus[status] += checkOrNotCheck 
            findUser.dailyRecap[day][2] = status
        }

        else if (req.body[ops].op == "add"){
            let newAction = req.body[ops].path.split('/')[1]
            if (newAction in findUser.days[req.params.day]) {
            }
            else {
                if (req.body[ops].value == false ){
                    findUser.days[req.params.day][newAction] = req.body[ops].value
                    if (findUser.actions[newAction]) findUser.actions[newAction][1] += 1 
                    else findUser.actions[newAction] = [0,1]
                    let oldPercActions = 100 * parseInt(findUser.dailyRecap[day][0]) / parseInt(findUser.dailyRecap[day][1])
                    let oldStatus = defineStatus(oldPercActions)
                    findUser.dailyRecap[day][1] += 1 
                    let percActions = 100 * parseInt(findUser.dailyRecap[day][0]) / parseInt(findUser.dailyRecap[day][1])
                    let status = defineStatus(percActions)
                    findUser.dailyStatus[oldStatus] -= 1
                    findUser.dailyStatus[status] += 1
                    findUser.dailyRecap[day][2] = status
                }
            } 

        }
        else if (req.body[ops].op == "remove"){
            let removedAction = req.body[ops].path.split('/')[1]
            if (removedAction in findUser.days[req.params.day]){
                let oldPercActions = 100 * parseInt(findUser.dailyRecap[day][0]) / parseInt(findUser.dailyRecap[day][1])
                let oldStatus = defineStatus(oldPercActions)
                if ( findUser.days[day][removedAction]) {
                    findUser.dailyRecap[day][0] -= 1
                    findUser.actions[removedAction][0] -= 1                     
                }
                delete findUser.days[req.params.day][removedAction]
                findUser.dailyRecap[day][1] -= 1
                findUser.actions[removedAction][1] -= 1 
                let percActions = 100 * parseInt(findUser.dailyRecap[day][0]) / parseInt(findUser.dailyRecap[day][1])
                let status = defineStatus(percActions)
                findUser.dailyStatus[oldStatus] -= 1
                findUser.dailyStatus[status] += 1
                findUser.dailyRecap[day][2] = status              
            }
        }
    }
    return res.status(204).send({
        "message" : "",
        "content" : findUser
    });
});

function defineStatus(perc){

    let status
    perc = parseInt(perc)
    if (perc == 0) status = "a" // a : Start Doing Something!!!
    else if ( perc > 0  && perc <= 20 ) status = "b" // b : Are you serious? 
    else if ( perc > 20  && perc <= 40 ) status = "c" // c : Come on!
    else if ( perc > 40  && perc <= 60 ) status = "d" // d : You can do better
    else if ( perc > 60  && perc <= 80 ) status = "e" // e : You are doin fine
    else if ( perc > 80  && perc < 100 ) status = "f" // f : Almost done everything
    else if ( perc == 100 ) status = "g" // g : Perfect Day
    return status
}

module.exports = router