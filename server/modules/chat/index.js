var WebSocketServer = require('ws').Server;
var url = require('url');

module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app, server) {
        var wss = new WebSocketServer({server: server});
        var client = {};
        wss.on('connection', function (ws) {
            var location = url.parse(ws.upgradeReq.url, true);
            console.log('client connected', {userID: location.query.userID});

            client.ws = ws;
            ws.on('message', function (message) {
                console.log(message);
            });
            ws.on('close', function (message) {
                console.log('disconnect');
            });
        });

        app.get('/send', function (req, res) {
            const messageType = req.query.messageType;
            const userName = req.query.userName;
            const content = req.query.content;
            const ws = client.ws;
            var data = {
                type: 'SEND_MESSAGE_NF',
                data: {messageType:messageType*1, userName, content},
            }
            ws.send(JSON.stringify(data));
            res.send('ok');
        });
    };

    return new Mgr();
})();
