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

async function query_dayID(userID, day){
    const Days = mongoose.model(String(userID) + "_day", daysSchema)
    let dayID = await Days
        .findOne({
            day : day
        })
        .select({
            _id : 1
        })
    return dayID._id
}

async function query_checklist(userID, dayID){
    console.log(dayID)
    const Days = mongoose.model(String(userID) + "_day", daysSchema)
    let checklistCollection = await Days
        .findById(dayID)
    console.log(checklistCollection)
    return checklistCollection
}

async function remove_action(userID, dayID, removedAction){
    const Days = mongoose.model(String(userID) + "_day", daysSchema)
    // let checklistCollection = await Days
    //     .findOne({
    //         day : day
    //     })
    //     .select({
    //         actions : 1
    //     })

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

async function add_action(userID, dayID, newAction){
    const Days = mongoose.model(String(userID) + "_day", daysSchema)
    let checklistCollection = await Days
        .findById(dayID)
    checklistCollection.actions.push(newAction)
    checklistCollection.save()
    return "Ok"
}

async function update_action(userID, dayID, updatedAction, value){
    const Days = mongoose.model(String(userID) + "_day", daysSchema)
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

module.exports.query_checklist = query_checklist
module.exports.query_user = query_user
module.exports.query_dayID = query_dayID
module.exports.update_action = update_action
module.exports.add_action = add_action
module.exports.remove_action = remove_action