module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.post('/enroll', function (req, res) {
            app.sendFile(req, res, __dirname+'/enroll.json');
        });
    };

    return new Mgr();
})();
