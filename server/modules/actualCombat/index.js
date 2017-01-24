module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getAidKit', function (req, res) {
            app.sendFile(req, res, __dirname+'/getAidKit.json');
        });
        app.subPost('/getKits', function (req, res) {
            app.sendFile(req, res, __dirname+'/getKits.json');
        });
        app.subPost('/getCase', function (req, res) {
            app.sendFile(req, res, __dirname+'/getCase.json');
        });
        app.subPost('/getItemKit', function (req, res) {
            app.sendFile(req, res, __dirname+'/getItemKit.json');
        });
        app.subPost('/getItemKitComment', function (req, res) {
            app.sendFile(req, res, __dirname+'/getItemKitComment.json');
        });
        app.subPost('/replayItemKit', function (req, res) {
            app.sendFile(req, res, __dirname+'/replayItemKit.json');
        });
        app.subPost('/getCaseScheme', function (req, res) {
            app.sendFile(req, res, __dirname+'/getCaseScheme.json');
        });
        app.subPost('/getCaseSchemeDetail', function (req, res) {
            app.sendFile(req, res, __dirname+'/getCaseSchemeDetail.json');
        });
        app.subPost('/submitKit', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitKit.json');
        });
        app.subPost('/submitScore', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitScore.json');
        });
        app.subPost('/getScoreDetail', function (req, res) {
            app.sendFile(req, res, __dirname+'/getScoreDetail.json');
        });
        app.subPost('/publisherKid', function (req, res) {
            app.sendFile(req, res, __dirname+'/publisherKid.json');
        });
        app.subPost('/myKid', function (req, res) {
            app.sendFile(req, res, __dirname+'/myKid.json');
        });
        app.subPost('/praiseKits', function (req, res) {
            app.sendFile(req, res, __dirname+'/praiseKits.json');
        });
        app.subPost('/getSonKidsComment', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSonKidsComment.json');
        });
        app.subPost('/submitSonKidsComment', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitSonKidsComment.json');
        });
        app.subPost('/getPlanDetail', function (req, res) {
            app.sendFile(req, res, __dirname+'/getPlanDetail.json');
        });
        app.subPost('/getSendKit', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSendKit.json');
        });
        app.subPost('/publisherKit', function (req, res) {
            app.sendFile(req, res, __dirname+'/publisherKit.json');
        });
        app.subPost('/getPublisherRules', function (req, res) {
            app.sendFile(req, res, __dirname+'/getPublisherRules.json');
        });
        app.subPost('/getMyAidDetail', function (req, res) {
            app.sendFile(req, res, __dirname+'/getMyAidDetail.json');
        });
        app.subPost('/myJoinKit', function (req, res) {
            app.sendFile(req, res, __dirname+'/myJoinKit.json');
        });
        app.subPost('/getAidManageList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getAidManageList.json');
        });
    };

    return new Mgr();
})();
