var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var des = require('./utils/des.js');
var deskey = "SV#Y!jAz";

var app = express();

app.TIMEOUT = 100;
var modules = [
    'homework',
    'enroll',
    'sign',
    'share',
];

app.use(express.static(__dirname + '/../www'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

//设置跨域访问
app.all('*', function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Cache-Control", "no-cache");
    next();
});

app.send = function(req, res, str) {
    // console.log("recv:", des.decode(req.body, deskey));
    setTimeout(function() {
    // console.log("send:", str);
        res.send(des.encode(str, deskey));
    }, app.TIMEOUT);
};

app.sendFile = function(req, res, filename) {
    var str = fs.readFileSync(filename, 'utf8');
    app.send(req, res, JSON.stringify(JSON.parse(str)));
};

for (var i in modules) {
    require('./modules/'+modules[i]).register(app);
}

app.listen(3000, function() {
    console.log("server listen on: http://localhost:3000");
});
