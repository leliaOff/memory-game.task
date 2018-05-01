var express = require('express');
var session = require('express-session');
var mysql   = require('mysql');
const game  = require('./server/game.js');
const gameResult  = require('./server/gameResult.js');

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

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

app.get('/level', (req, res) => {
    
    if(!req.session.username) {
        res.send('');
        return;
    }
    
    gameResult.getMaxLevel(req.session.username, (error, result) => {
        
        if(error) throw error;

        let data = game.getGameData(result + 1);
        req.session.tm = Math.floor(new Date() / 1000);
        res.send(JSON.stringify(data));

    });
    
});

app.get('/save', (req, res) => {

    if(!req.session.username || !req.session.tm) {
        res.send('');
        return;
    }

    let data = [
        req.session.username,
        parseInt(req.param('level'), 10),
        Math.floor(new Date() / 1000) - req.session.tm,
        parseInt(req.param('attempts'), 10)
    ];

    gameResult.saveResult(...data, (error, result) => {        
        if(error) throw error;
        res.send(result);
    });
    
});

app.get('/clean', (req, res) => {

    if(!req.session.username) {
        res.send('');
        return;
    }

    gameResult.cleanResult(req.session.username, (error, result) => {        
        if(error) throw error;
        res.send(result);
    });

});

app.get('/results', (req, res) => {
    
    gameResult.getAllResults((error, result) => {
        
        if(error) throw error;

        let usersResults = {};
        for(let i in result) {

            if(!usersResults[result[i].username]) {
                usersResults[result[i].username] = [];
            }
            usersResults[result[i].username].push(result[i]);
        }

        res.send(JSON.stringify(usersResults));

    });
    
});

app.get('/logout', (req, res) => {

    let username = req.session.username;
    req.session.destroy();  
    res.send();

});

app.listen(8081);
console.log('server started');