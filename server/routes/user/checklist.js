const express = require("express")
const router = express.Router()
const database = require("../../database")
const checklistSchemas = require("../../utils/Checklist/schemas")
const userSchemas = require("../../utils/User/schemas")
const utils = require("../../utils/mongoUtils")
const mongoose = require("../../utils/mongoConnection")

userSchema = userSchemas.userSchema
actionSchema = checklistSchemas.actionSchema
daysSchema = checklistSchemas.daysSchema
const Action = mongoose.model("Action", actionSchema)

router.get("/:user/days/:day", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  
        const Days = mongoose.model(String(findUser._id) + "_day", daysSchema)
        utils.query_dayID(Days, req.params.day)
        .then((dayID) => {
            
            utils.query_checklist(Days, dayID)
            .then((day) => {
                let checklist = {}
                for (let i = 0; i < day.actions.length;  i++ ){
                    checklist[day.actions[i].action] = day.actions[i].isDone
                }
                return res.status(201).send({
                    "message" : "Found checklist",
                    "content" : {
                        "checklist" : checklist,
                        "order" : day.order
                    }
                });
            }) 
            .catch((err) => {
                return res.status(404).send({
                    "message" : "Error in retrieving checklist",
                    "content" : err
                });
            })
        })
        .catch((err) => {
            return res.status(404).send({ 
                "message" : "Day not found",
                "content" : false
            })
        })
    });   
})

router.post("/:user/days/:day", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        }); 

        const Days = mongoose.model(String(findUser._id) + "_day", daysSchema)

        let actionArray = []
        for(let action in req.body.actions){
            actionArray.push(new Action({
                action: req.body.actions[action] 
            }))
        }
        const checklist = new Days({           
            day: req.params.day ,
            order: req.body.order,
            actions: actionArray
        })

        checklist.save()
            .then((savedDay) =>{ 
                return res.status(201).send({
                    "message" : "Added day",
                    "content" : savedDay
                });
            })
            .catch((err) => {
                return res.status(404).send({
                    "message" : "Error in saving the day",
                    "content" : err
                });
            })
    });
});

router.patch('/:user/days/:day', (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });   
        
          
        const Days = mongoose.model(String(findUser._id) + "_day", daysSchema)
        utils.query_dayID(Days, req.params.day)
        .then((dayID) => {
            for (let ops in req.body){
                if (req.body[ops].op == "replace"){
                    
                    let updatedAction = req.body[ops].path.split('/')[1]
                    utils.update_action(Days, dayID, updatedAction, req.body[ops].value)
                }
                else if (req.body[ops].op == "add"){                
                    let newAction = new Action({
                        action: req.body[ops].path.split('/')[1] 
                    })
                    utils.add_action(Days, dayID, newAction)
                }
                else if (req.body[ops].op == "remove"){
                    let removedAction = req.body[ops].path.split('/')[1]
                    utils.remove_action(Days, dayID, removedAction)
                }
            }

            utils.query_dayID(Days, req.params.day)
            .then((dayID) => {
    
                utils.query_checklist(Days, dayID)
                .then((day) => {
                    let checklist = {}
                    for (let i = 0; i < day.actions.length;  i++ ){
                        checklist[day.actions[i].action] = day.actions[i].isDone
                    }
                    return res.status(201).send({
                        "message" : "Found checklist",
                        "content" : checklist
                    });
                }) 
                .catch((err) => {
                    return res.status(404).send({
                        "message" : "Error in retrieving checklist",
                        "content" : err
                    });
                })
            })
            .catch((err) => {
                return res.status(404).send({ 
                    "message" : "Day not found",
                    "content" : false
                })
            })

        })
        .catch((err) => {
            return res.status(404).send({ 
                "message" : "Day not found",
                "content" : false
            })
        })
    })
})

router.get("/:user/lastDay", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  
        const Days = mongoose.model(String(findUser._id) + "_day", daysSchema)
        utils.query_lastDay(Days)
        .then((lastDay) => res.status(200).send({
            "message" : "The user exists",
            "content" : {
                "lastDay" : lastDay.day
            }
        }))
    }) 
})

router.get("/:user/actions", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });
        
        const Days = mongoose.model(String(findUser._id) + "_day", daysSchema)
        utils.query_actions(Days)
        .then((all_checklists) => {
            list_actions = []
            for (checklist in all_checklists){
                for (let i = 0; i < all_checklists[checklist].actions.length; i++ ){
                    let actionObject = list_actions.find(c => c.action === all_checklists[checklist].actions[i].action)
                    if (actionObject) {
                        actionObject.totalDays++
                        if (all_checklists[checklist].actions[i].isDone) actionObject.checkedDays++
                    }
                    else{
                        newActionObject = {
                            action: all_checklists[checklist].actions[i].action,
                            totalDays: 1,
                            checkedDays: 0
                        }
                        if (all_checklists[checklist].actions[i].isDone) newActionObject.checkedDays++
                        list_actions.push(newActionObject)
                    }
                    
                }
            }
            
            return res.status(200).send({
                "message" : "List created",
                "content" : list_actions
            })
        })
    })
})

router.get("/:user/actions/:action", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        }); 
        const Days = mongoose.model(String(findUser._id) + "_day", daysSchema)
        utils.query_actions(Days)
        .then((all_checklists) => {
            let queried_action = { queried_action: req.params.action,
                result : [0,0]}
            for (checklist in all_checklists){
                for (let i = 0; i < all_checklists[checklist].actions.length; i++ ){
                    if (all_checklists[checklist].actions[i].action == req.params.action){
                        queried_action.result[0]++
                        if (all_checklists[checklist].actions[i].isDone) queried_action.result[1]++
                    }
                }
            }
            if (queried_action.result[0] == 0) return res.status(404).send({
                "message" : "The action does not exist",
                "content" : false
            }); 
            else return res.status(200).send({
                "message" : "The action exists",
                "content" : queried_action
            })
        })
    })
})

router.get("/:user/dailyRecap", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  
        const Days = mongoose.model(String(findUser._id) + "_day", daysSchema)
        utils.query_actions(Days)
        .then((all_checklists) => {
            list_days = {}
            for (checklist in all_checklists){
                list_days[all_checklists[checklist].day] = [all_checklists[checklist].actions.length, 0]
                for (let i = 0; i < all_checklists[checklist].actions.length; i++ ){
                    if (all_checklists[checklist].actions[i].isDone) list_days[all_checklists[checklist].day][1]++
                }
            }
            return res.status(200).send({
                "message" : "List created",
                "content" : list_days
            })
        })
    })
})

router.get("/:user/dailyRecap/:day", (req, res) => {
    utils.query_user(req.params.user) 
    .then((findUser) => {
        
        if (!findUser._id)  return res.status(404).send({ 
            "message" : "The user does not exist",
            "content" : false
        });  
        const Days = mongoose.model(String(findUser._id) + "_day", daysSchema)
        utils.query_actions(Days)
        .then((all_checklists) => {
            let list_days = {}
            list_days[req.params.day] = [
                all_checklists.find(c => c.day === req.params.day).actions.length,
                0
            ]
            for (let i = 0; i < list_days[req.params.day][0]; i++ ){
                if (all_checklists.find(c => c.day === req.params.day).actions[i].isDone) list_days[req.params.day][1]++
            }
            
            return res.status(200).send({
                "message" : "List created",
                "content" : list_days
            })
        })
    })
})



module.exports = router

// function defineStatus(perc){
//     let status
//     perc = parseInt(perc)
//     if (perc == 0) status = "a" // a : Start Doing Something!!!
//     else if ( perc > 0  && perc <= 20 ) status = "b" // b : Are you serious? 
//     else if ( perc > 20  && perc <= 40 ) status = "c" // c : Come on!
//     else if ( perc > 40  && perc <= 60 ) status = "d" // d : You can do better
//     else if ( perc > 60  && perc <= 80 ) status = "e" // e : You are doin fine
//     else if ( perc > 80  && perc < 100 ) status = "f" // f : Almost done everything
//     else if ( perc == 100 ) status = "g" // g : Perfect Day
//     return status
// }

// 