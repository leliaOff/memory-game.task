var express = require('express');
var session = require('express-session');
var mysql   = require('mysql');
const game  = require('./server/game.js');

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'memory_game',
    password : 'memory_game',
    database : 'memory_game'
});
connection.connect();

app.get('/', (req, res) => {
    res.sendfile('index.html');
});

app.get('/welcome', (req, res) => {
    
    if(!req.session.username) {
        res.send('');
    } else {
        res.send(req.session.username);
    }
    
});

app.get('/login', (req, res) => {
    
    let username = req.param('username');
    username.replace(/\s+/g, '');

    if(username == '') {
        res.send('');
    } else {
        req.session.username = username;
        res.send(username);
    }
    
});

app.get('/logout', (req, res) => {

    let username = req.session.username;
    req.session.destroy();  
    res.send();

});

app.get('/level', (req, res) => {
    
    if(!req.session.username) {
        res.send('');
        return;
    }
    
    let username = req.session.username;

    let query = `SELECT max(level) as level FROM results WHERE username = '${username}'`;
    connection.query(query, (error, result, fields) => {
        
        if(error) throw error;
        
        let level = result[0].level;
        if(!level) {
            level = 1;
        }
        let data = game.getGameData(level + 1);

        //Засекаем время
        req.session.tm = Math.floor(new Date() / 1000);

        res.send(JSON.stringify(data));

    });
    
});

app.get('/save', (req, res) => {

    if(!req.session.username || !req.session.tm) {
        res.send('');
        return;
    }
    
    let username = req.session.username;
    let timeout = Math.floor(new Date() / 1000) - req.session.tm;

    let level = parseInt(req.param('level'), 10);
    let attempts = parseInt(req.param('attempts'), 10);

    console.log(`${username} ${level} ${timeout} ${attempts}`);

    let query = `INSERT INTO results (username, level, timeout, attempts) VALUES ('${username}', '${level}', '${timeout}', '${attempts}')`;
    connection.query(query, (error, result, fields) => {
        
        if(error) throw error;        
        console.log('insert 1 row');
        res.send('');

    });
    
});

app.listen(8081);
console.log('server started');