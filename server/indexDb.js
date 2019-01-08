const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/Jarvis", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDb"))
    .catch(err => console.error("Connection failed", err))

// userSchema = new mongoose.Schema({
//     user: String,
//     name: String,
//     surname: String
// })

daysSchema = new mongoose.Schema({
    day: String,
    actions: [{
        action: String,
        isDone: { type: Boolean, default: false}
    }]
})

// const User = mongoose.model("Population", userSchema)

// async function saveUser(){
//     const user = new User({
//         user: "marco_bz",
//         name: "Marco",
//         surname: "Barison"
//     })
//     const savedUser = await user.save()
//     console.log("Created User :", savedUser.user)

//     return savedUser._id
// }

async function saveDailyChecklist(day,actions){
    let actionArray = []
    for(let action in actions){
        actionArray.push({
            action: actions[action],
            isDone: false   
        })
    }

    const checklist = new Days({           
        day: day ,
        actions: actionArray
    })

    const savedDay = await checklist.save()
    console.log(savedDay)
}

// saveUser()
//     .then((userID) => {
//         console.log(userID)
//     })

const userID = "5c34fe96998217028cf2427e"
const Days = mongoose.model(String(userID) + "_day", daysSchema)
saveDailyChecklist("01.01.2018",["action1","action2","action3"])
saveDailyChecklist("02.01.2018",["action1","action2","action4"])
saveDailyChecklist("03.01.2018",["action1","action3"])