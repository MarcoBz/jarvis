const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/checklist')
    .then(() => console.log('Connected to MongoDb'))
    .catch(err => console.error('Connection failed', err))

userSchema = new mongoose.Schema({
    user: String,
    lastyDay: String,
    days:  [
        {
            day: String,
            actions: Array
        }
    ]
    
})