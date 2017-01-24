module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getCustomRoomList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getCustomRoomList.json');
        });
        app.subPost('/applyRoom', function (req, res) {
            app.sendFile(req, res, __dirname+'/applyRoom.json');
        });
    };

    return new Mgr();
})();
