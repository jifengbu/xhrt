module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.post('/articleInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/articleInfo.json');
        });
        app.post('/getCommentArticleList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getCommentArticleList.json');
        });
        app.post('/getHotActivityDetailed', function (req, res) {
            app.sendFile(req, res, __dirname+'/getHotActivityDetailed.json');
        });
        app.post('/shareEnroll', function (req, res) {
            app.sendFile(req, res, __dirname+'/shareEnroll.json');
        });
    };
    return new Mgr();
})();
