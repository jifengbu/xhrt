module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/businessSchoolList', function (req, res) {
            app.sendFile(req, res, __dirname+'/businessSchoolList.json');
        });
        app.subPost('/businessSchoolItem', function (req, res) {
            app.sendFile(req, res, __dirname+'/businessSchoolItem.json');
        });
        app.subPost('/myInvitationCodeDetail', function (req, res) {
            app.sendFile(req, res, __dirname+'/myInvitationCodeDetail.json');
        });
    };
    return new Mgr();
})();
