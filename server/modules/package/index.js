module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getPackageList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getPackageList.json');
        });
        app.subPost('/getPackageItem', function (req, res) {
            app.sendFile(req, res, __dirname+'/getPackageItem.json');
        });
    };

    return new Mgr();
})();
