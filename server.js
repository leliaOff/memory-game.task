var express = require('express');
var app = express();
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/welcome', function(req, res) {
    res.send('Hello world!');
});

app.listen(8080);
console.log('server started');