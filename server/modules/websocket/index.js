var WebSocketServer = require('ws').Server;
var url = require('url');

module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app, server) {
        var wss = new WebSocketServer({server: server});
        var self = this;
        wss.on('connection', function (ws) {
            var location = url.parse(ws.upgradeReq.url, true);
            console.log('client connected', {phone: location.query.phone});
            ws.on('message', function (message) {
                var param = JSON.parse(message);
                self.onMessage(ws, param.type, param.data);
            });
            ws.on('close', function (message) {
                console.log('disconnect', message);
            });
        });
    };
    Mgr.prototype.onMessage = function(ws, type, data) {
        console.log('===recv:', type, data);
        switch (type) {
            case 'APPLY_TASK_RQ': {
                var data = {
                    type: 'APPLY_TASK_RS',
                    data: {success: true},
                }
                ws.send(JSON.stringify(data));
                break;
            }
        }
    };

    return new Mgr();
})();
