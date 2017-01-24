module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getSearchData', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSearchData.json');
        });
        app.subPost('/search', function (req, res) {
            app.sendFile(req, res, __dirname+'/search.json');
        });
        app.subPost('/searchVideo', function (req, res) {
            app.sendFile(req, res, __dirname+'/searchVideo.json');
        });
        app.subPost('/searchRoom', function (req, res) {
            app.sendFile(req, res, __dirname+'/searchRoom.json');
        });
        app.subPost('/searchQuestion', function (req, res) {
            app.sendFile(req, res, __dirname+'/searchQuestion.json');
        });
    };

    return new Mgr();
})();
