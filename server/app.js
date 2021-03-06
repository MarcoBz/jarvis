const express = require('express')
const Validation = require('./validation')
const home = require('./routes/home')
const user = require('./routes/user/user')
const checklist = require('./routes/user/checklist')
const userTvSeries = require('./routes/user/tvSeries')
const tmdbData = require('./routes/tmdb')
const test = require('./routes/test')

const validator = new Validation()
const app = express()
app.use(express.json());
app.use(express.static('public'));
app.use(function(req, res, next) {
    res.header("Accept-Patch", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE, PATCH");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use('/', home)
app.use('/api/user', user)
app.use('/api/checklist', checklist)
app.use('/api/tvseries', userTvSeries)
app.use('/api/tmdb', tmdbData)
app.use('/api/test', test)

const port = process.env.PORT || 4000 ;
app.listen(port, () => console.log(`Listening on port ${port}...`));
