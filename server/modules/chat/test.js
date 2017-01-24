var http = require('http');

var qs = require('querystring');

var data = {
    messageType: 1,
    userName: 'fang',
    content: 'who am i?',
};

var content = qs.stringify(data);

var options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/send?' + content,
    method: 'GET'
};

var req = http.request(options, function (res) {
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
});

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

req.end();
