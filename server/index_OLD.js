const express = require('express')
const Validation = require('./validation')

const validator = new Validation()

const app = express()
app.use(express.json());
app.use(express.static('public'));

const checklist = []

app.get('/', (req, res) => {
    res.send('HOME')
});

app.get('/api/myChecklist', (req, res) => { 
    res.status(201).send(checklist)
});


app.post('/api/myChecklist', (req, res) => {
    const { error } = validator.validateAction(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const findAction = checklist.find(c => c.action === req.body.action)
    if (findAction) return res.status(400).send({ message : 'Action already added at the checklist'});

    const action = {
        id: checklist.length + 1,
        action : req.body.action,
        checkedToday : req.body.checkedToday
    }
    checklist.push(action)
    res.status(201).send({ message : 'Added current action', action : action})
});

app.put('/api/myChecklist/:id', (req, res) => {
    const { error } = validator.validateAction(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const action = {
        id : req.params.id,
        action : req.body.action,
        checkedToday : req.body.checkedToday
    }

    const findAction = checklist.find(c => c.id === parseInt(req.params.id));
    if (!findAction) {
        checklist.push(action)
        return res.status(201).send({ message : 'The current action did not exist, added now at the list', action : action});
    }
    else {
        checklist.splice(checklist.indexOf(findAction), 1);
        checklist.push(action)
        return res.status(200).send({ message : 'Updated current action', action : action});
    }

});

app.patch('/api/myChecklist/:id', (req, res) => {
    const findAction = checklist.find(c => c.id === parseInt(req.params.id));

    if (!findAction) return res.status(404).send({ message : 'The current action does not exist'}); 

    if (req.body.op == "replace"){
        checklist[checklist.indexOf(findAction)][req.body.field] = req.body.value
        return res.status(200).send({ message : 'Updated current action', action : findAction}); 
    }

});

app.delete('/api/myChecklist/:id', (req, res) => {
    const findAction = checklist.find(c => c.id === parseInt(req.params.id));
    if (!findAction) return res.status(404).send({ message : 'The current action does not exist'}); 
    checklist.splice(checklist.indexOf(findAction), 1);
    for (let i = 0; i < checklist.length; i++ ){
        checklist[i].id = i+1
    }

    return res.status(200).send({ message : 'Deleted current action', action : findAction}); 
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
