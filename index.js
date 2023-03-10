const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const {readFile} = require('./functions');
const query = require('./model/query'); 
const { response } = require('express');

const app = express()

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(({message: 'Hello world!'}));
})

app.get('/cft', (req, res) => {
    res.set('Content-Type', 'application/json')
    res.send(readFile());
});

app.post('/registration', (req, res) => {
    console.log(req.body);

    query.registerAccount(req.body).then(([rows, field]) => {
        console.log(rows.affectedRows);
        console.log(rows.serverStatus);
    }).catch((err) => {
        res.send({error: true, message: err.sqlMessage})
    });
})

app.post('/login', (req, res) => {
    const {email, password} = req.body

    console.log(req.body);

    res.set('Content-Type', 'application/json');

    query.verifyLogin(email, password).then(([rows, field]) => {
        res.status(200);
        
        if (rows.length === 0) {
            res.send({verified: 0});
        }
        res.send(rows[0]);
    }).catch((err) => {
        throw err;
    });
})

app.listen(3001, 'localhost', () => {
        console.log('Starting at port 3001')
}); 