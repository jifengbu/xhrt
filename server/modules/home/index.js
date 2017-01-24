module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getHomePageData', function (req, res) {
            app.sendFile(req, res, __dirname+'/homePageData.json');
        });
        app.subPost('/getUserStudyInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getUserStudyInfo.json');
        });
        app.subPost('/getHotActiveityList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getHotActiveityList.json');
        });
        app.subPost('/getHotActivityDetailed', function (req, res) {
            app.sendFile(req, res, __dirname+'/getHotActivityDetailed.json');
        });
        app.subPost('/getArticleList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getArticleList.json');
        });
        app.subPost('/getEncourageCourseList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getEncourageCourseList.json');
        });
        app.subPost('/getShopInfoList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getShopInfoList.json');
        });
        app.subPost('/praiseLog', function (req, res) {
            app.sendFile(req, res, __dirname+'/praiseLog.json');
        });
        app.subPost('/collectionLog', function (req, res) {
            app.sendFile(req, res, __dirname+'/collectionLog.json');
        });
        app.subPost('/watchLog', function (req, res) {
            app.sendFile(req, res, __dirname+'/watchLog.json');
        });
        app.subPost('/commentArticle', function (req, res) {
            app.sendFile(req, res, __dirname+'/commentArticle.json');
        });
        app.subPost('/articleInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/articleInfo.json');
        });
        app.subPost('/getCommentArticleList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getCommentArticleList.json');
        });
    };
    return new Mgr();
})();
