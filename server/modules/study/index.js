var fs = require('fs');
module.exports = (function() {
    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getPrizes', function (req, res) {
            app.sendFile(req, res, __dirname+'/getPrizes.json');
        });
        app.subPost('/getVideoList', function (req, res, body) {
            var str = fs.readFileSync(__dirname+'/getVideoList.json', 'utf8');
            var videoType = body.videoType*1;
            str = str
                .replace('3.png', (3+videoType)%7+1+'.png')
                .replace('4.png', (4+videoType)%7+1+'.png')
                .replace('5.png', (5+videoType)%7+1+'.png')
                .replace('6.png', (6+videoType)%7+1+'.png')
                .replace('7.png', (7+videoType)%7+1+'.png');
            app.send(req, res, str);
        });
        app.subPost('/getRewardList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getRewardList.json');
        });
        app.subPost('/myAwardRecords', function (req, res) {
            app.sendFile(req, res, __dirname+'/myAwardRecords.json');
        });
        app.subPost('/submitReceivingInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitReceivingInfo.json');
        });
        app.subPost('/doLike', function (req, res) {
            app.sendFile(req, res, __dirname+'/doLike.json');
        });
        app.subPost('/doCollection', function (req, res) {
            app.sendFile(req, res, __dirname+'/doCollection.json');
        });
        app.subPost('/getIntegralGoods', function (req, res) {
            app.sendFile(req, res, __dirname+'/getIntegralGoods.json');
        });
        app.subPost('/exchange', function (req, res) {
            app.sendFile(req, res, __dirname+'/exchange.json');
        });
        app.subPost('/doShare', function (req, res) {
            app.sendFile(req, res, __dirname+'/doShare.json');
        });
        app.subPost('/relevantVideo', function (req, res) {
            app.sendFile(req, res, __dirname+'/relevantVideo.json');
        });
        app.subPost('/getWinCoinGoods', function (req, res) {
            app.sendFile(req, res, __dirname+'/getWinCoinGoods.json');
        });
        app.subPost('/createWinCoinOrder', function (req, res) {
            app.sendFile(req, res, __dirname+'/createWinCoinOrder.json');
        });
        app.subPost('/getComment', function (req, res) {
            app.sendFile(req, res, __dirname+'/getComment.json');
        });
        app.subPost('/watchVideo', function (req, res) {
            app.sendFile(req, res, __dirname+'/watchVideo.json');
        });
        app.subPost('/submitSonComment', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitSonComment.json');
        });
        app.subPost('/getSonComment', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSonComment.json');
        });
        app.subPost('/submitComment', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitComment.json');
        });
        app.subPost('/getTaskIntegration', function (req, res) {
            app.sendFile(req, res, __dirname+'/getTaskIntegration.json');
        });
        app.subPost('/updateClicks', function (req, res) {
            app.sendFile(req, res, __dirname+'/updateClicks.json');
        });
    };

    return new Mgr();
})();
