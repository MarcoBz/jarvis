const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/checklist", { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDb'))
    .catch(err => console.error('Connection failed', err))

userSchema = new mongoose.Schema({
    user: String,
    lastDay: String,
    days:[
        {
            day: String,
            actions: [{
                action: String,
                isDone: { type: Boolean, default: false}
            }]
        }
    ]
})

const Checklist = mongoose.model('Checklist', userSchema)

async function saveUser(){
    const user = new Checklist({
        user: "marco_bz",
        lastDay : "02-01-2018",
        days:[
            {           
                day: "01.01.2018" ,
                actions: [{
                    action: "action1",
                    isDone: false
                },
                {
                    action: "action2",
                    isDone: false
                },
                {
                    action: "action3",
                    isDone: true
                }]
            },
            {           
                day: "02.01.2018" ,
                actions: [{
                    action: "action1",
                    isDone: false
                },
                {
                    action: "action2",
                    isDone: true
                },
                {
                    action: "action3",
                    isDone: true
                }]
            }
        ]
    })

    const savingUser = await user.save()
    console.log(savingUser)
}

saveUser()