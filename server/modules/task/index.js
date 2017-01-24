module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getSpecialTask', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSpecialTask.json');
        });
        app.subPost('/getTrainTask', function (req, res) {
            app.sendFile(req, res, __dirname+'/getTrainTask.json');
        });
        app.subPost('/getStudyTask', function (req, res) {
            app.sendFile(req, res, __dirname+'/getStudyTask.json');
        });
        app.subPost('/getPlatformTask', function (req, res) {
            app.sendFile(req, res, __dirname+'/getPlatformTask.json');
        });
    };

    return new Mgr();
})();
