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
        app.post('/addDistributionUser', function (req, res) {
            app.sendFile(req, res, __dirname+'/addDistributionUser.json');
        });
        app.post('/packageList', function (req, res) {
            app.sendFile(req, res, __dirname+'/packageList.json');
        });
        app.post('/register', function (req, res) {
            app.sendFile(req, res, __dirname+'/register.json');
        });
        app.post('/sendVerificationCode', function (req, res) {
            app.sendFile(req, res, __dirname+'/sendVerificationCode.json');
        });
        app.post('/createWinCoinOrder', function (req, res) {
            app.sendFile(req, res, __dirname+'/createWinCoinOrder.json');
        });
        app.post('/html5Alipay', function (req, res) {
            app.sendFile(req, res, __dirname+'/html5Alipay.json');
        });
        app.post('/aliPayConfirm', function (req, res) {
            app.sendFile(req, res, __dirname+'/checkAlipayIsSuccess.json');
        });
        app.post('/saveOrderUserRelations', function (req, res) {
            app.sendFile(req, res, __dirname+'/addDistributionUser.json');
        });
    };
    return new Mgr();
})();
