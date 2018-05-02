var express = require('express');
var session = require('express-session');
var mysql   = require('mysql');

var MemoryGame  = require('./server/MemoryGame.js');
var GameResult  = require('./server/GameResult.js');

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
    
    let gameResult = new GameResult();
    gameResult.getMaxLevel(req.session.username, (error, result) => {
        
        if(error) throw error;

        let game = new MemoryGame(result + 1);
        let data = game.getGameData();

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

    let gameResult = new GameResult();
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

    let gameResult = new GameResult();
    gameResult.cleanResult(req.session.username, (error, result) => {        
        if(error) throw error;
        res.send(result);
    });

});

app.get('/results', (req, res) => {
    
    let gameResult = new GameResult();
    gameResult.getAllResults((error, result) => {
        
        if(error) throw error;
        res.send(JSON.stringify(result));

    });
    
});

app.get('/logout', (req, res) => {

    let username = req.session.username;
    req.session.destroy();  
    res.send();

});

app.listen(8081);
console.log('server started');