module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getStduiest', function (req, res) {
            app.sendFile(req, res, __dirname+'/getStduiest.json');
        });
        app.subPost('/getStduiestItem', function (req, res) {
            app.sendFile(req, res, __dirname+'/getStduiestItem.json');
        });
    };
    return new Mgr();
})();
