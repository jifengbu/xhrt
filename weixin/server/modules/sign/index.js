module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.post('/sign', function (req, res) {
            app.sendFile(req, res, __dirname+'/sign.json');
        });
    };

    return new Mgr();
})();
