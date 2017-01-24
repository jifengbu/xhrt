module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/login', function (req, res) {
            app.sendFile(req, res, __dirname+'/login.json');
        });
        app.subPost('/register', function (req, res) {
            app.sendFile(req, res, __dirname+'/register.json');
        });
        app.subPost('/sendVerificationCode', function (req, res) {
            app.sendFile(req, res, __dirname+'/sendVerificationCode.json');
        });
        app.subPost('/findPwd', function (req, res) {
            app.sendFile(req, res, __dirname+'/findPwd.json');
        });
        app.subPost('/updatePwd', function (req, res) {
            app.sendFile(req, res, __dirname+'/updatePwd.json');
        });
        app.subPost('/getProtocol', function (req, res) {
            app.sendFile(req, res, __dirname+'/getProtocol.json');
        });
        app.subPost('/versionUpdate', function (req, res) {
            app.sendFile(req, res, __dirname+'/versionUpdate.json');
        });
    };

    return new Mgr();
})();
