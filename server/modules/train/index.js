module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getTrainingInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getTrainingInfo.json');
        });
        app.subPost('/getCompetitorsInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getCompetitorsInfo.json');
        });
        app.subPost('/sendMessage', function (req, res) {
            app.sendFile(req, res, __dirname+'/sendMessage.json');
        });
        app.subPost('/updateMessage', function (req, res) {
            app.sendFile(req, res, __dirname+'/updateMessage.json');
        });
        app.subPost('/sendProp', function (req, res) {
            app.sendFile(req, res, __dirname+'/sendProp.json');
        });
        app.subPost('/submitScore', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitScore.json');
        });
        app.subPost('/getVirtualInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getVirtualInfo.json');
        });
        app.subPost('/getaliPayInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getaliPayInfo.json');
        });
    };

    return new Mgr();
})();
