var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var fs = require('fs');
var des = require('./utils/des.js');

var deskey = "SV#Y!jAz";
var app = express();
var server = http.Server(app);

app.TIMEOUT = 100;
var modules = [
    'test',
    'login',
    'person',
    'home',
    'study',
    'train',
    'shop',
    'meeting',
    'actualCombat',
    'businessCollege',
    'package',
    'schoolBusiness',
    'excellentWorks',
    'specops',
    'search',
    'live',
    'chat',
    'task',
];

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.send = function(req, res, str) {
    console.log(req.headers);
    // console.log("recv:", des.decode(req.body, deskey));
    setTimeout(function() {
        // console.log("send:", str);
        res.send(des.encode(str, deskey));
    }, app.TIMEOUT);
};

app.sendFile = function(req, res, filename) {
    app.send(req, res, fs.readFileSync(filename, 'utf8'));
};

app.sendObj = function(req, res, obj) {
    app.send(req, res, JSON.stringify(obj));
};

app.subPost = function(url, callback) {
    app.post('/app/api'+url, function(req, res) {
        var body = des.decode(req.body, deskey);
        callback(req, res, JSON.parse(body));
    });
};

for (var i in modules) {
    require('./modules/'+modules[i]).register(app, server);
}

server.listen(3000, function() {
    console.log("server listen on: http://localhost:3000");
});
