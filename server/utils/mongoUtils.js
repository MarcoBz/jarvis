const mongoose = require("./mongoConnection")
const schemas = require("./schemas")

userSchema = schemas.userSchema
daysSchema = schemas.daysSchema
const User = mongoose.model("Population", userSchema)

async function query_user(user){
    let userCollection = await User
        .findOne({
            user : user
        })
    return userCollection 
}

async function query_dayID(Days, day){
    let dayID = await Days
        .findOne({
            day : day
        })
        .select({
            _id : 1
        })
    return dayID._id
}

async function query_checklist(Days, dayID){
    let checklistCollection = await Days
        .findById(dayID)
    return checklistCollection
}

async function remove_action(Days, dayID, removedAction){
    let checklistCollection = await Days
        .findById(dayID)
    
    if (checklistCollection.actions.find(c => c.action === removedAction)){
        checklistCollection.actions.find(c => c.action === removedAction).remove()
        checklistCollection.save()
        return "Ok"
    }
    else{
        return "No Action"
    }
}

async function add_action(Days, dayID, newAction){
    let checklistCollection = await Days
        .findById(dayID)
    checklistCollection.actions.push(newAction)
    checklistCollection.save()
    return "Ok"
}

async function update_action(Days, dayID, updatedAction, value){
    let checklistCollection = await Days
        .findById(dayID)    
    if (checklistCollection.actions.find(c => c.action === updatedAction)){
        checklistCollection.actions.find(c => c.action === updatedAction).isDone = value
        checklistCollection.save()
        return "Ok"
    }
    else{
        return "No Action"
    }
}

async function query_lastDay(Days){
    let checklistCollection = await Days   
        .findOne()
        .sort({
            order: -1
        })
    return checklistCollection
}

async function query_actions(Days){

    let all_checklists = await Days
        .find()
        .select({
            _id : 0,
            actions : 1
        })
    
    return all_checklists
}

module.exports.query_checklist = query_checklist
module.exports.query_user = query_user
module.exports.query_dayID = query_dayID
module.exports.update_action = update_action
module.exports.add_action = add_action
module.exports.remove_action = remove_action
module.exports.query_lastDay = query_lastDay
module.exports.query_actions = query_actions