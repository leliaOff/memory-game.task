var express = require('express');
var session = require('express-session');
const game = require('./server/game.js');

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/welcome', function(req, res) {
    
    if(!req.session.username) {
        res.send('');
    } else {
        res.send(req.session.username);
    }
    
});

app.get('/login', function(req, res) {
    
    let username = req.param('username');
    username.replace(/\s+/g, '');

    if(username == '') {
        res.send('');
    } else {
        req.session.username = username;
        res.send(username);
    }
    
});

app.get('/logout', function(req, res) {

    let username = req.session.username;
    req.session.destroy();  
    res.send();

});

app.get('/level', function(req, res) {
    
    let username = req.session.username;
    let n = 3;

    let data = game.getGameData(n);
    res.send(JSON.stringify(data));
    
});

app.listen(8080);
console.log('server started');