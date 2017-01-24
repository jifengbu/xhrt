module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/playBackInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/playBackInfo.json');
        });
        app.subPost('/appointmentLive', function (req, res) {
            app.sendFile(req, res, __dirname+'/appointmentLive.json');
        });
        app.subPost('/launchLive', function (req, res) {
            app.sendFile(req, res, __dirname+'/launchLive.json');
        });
    };

    return new Mgr();
})();
