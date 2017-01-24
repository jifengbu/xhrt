module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getGoodsInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getGoodsInfo.json');
        });
        app.subPost('/searchGoods', function (req, res) {
            app.sendFile(req, res, __dirname+'/searchGoods.json');
        });
        app.subPost('/getGoodsDetail', function (req, res) {
            app.sendFile(req, res, __dirname+'/getGoodsDetail.json');
        });
        app.subPost('/getshopInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getshopInfo.json');
        });
        app.subPost('/getGoodsComment', function (req, res) {
            app.sendFile(req, res, __dirname+'/getGoodsComment.json');
        });
        app.subPost('/merchandising', function (req, res) {
            app.sendFile(req, res, __dirname+'/merchandising.json');
        });
        app.subPost('/placeOrder', function (req, res) {
            app.sendFile(req, res, __dirname+'/placeOrder.json');
        });
        app.subPost('/orderData', function (req, res) {
            app.sendFile(req, res, __dirname+'/orderData.json');
        });
        app.subPost('/getMyAddr', function (req, res) {
            app.sendFile(req, res, __dirname+'/getMyAddr.json');
        });
        app.subPost('/submitMyAddr', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitMyAddr.json');
        });
        app.subPost('/getMyOrder', function (req, res) {
            app.sendFile(req, res, __dirname+'/getMyOrder.json');
        });
        app.subPost('/getOrderDetail', function (req, res) {
            app.sendFile(req, res, __dirname+'/getOrderDetail.json');
        });
        app.subPost('/delOrder', function (req, res) {
            app.sendFile(req, res, __dirname+'/delOrder.json');
        });
        app.subPost('/submitGoodsComment', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitGoodsComment.json');
        });
        app.subPost('/endOrder', function (req, res) {
            app.sendFile(req, res, __dirname+'/endOrder.json');
        });
    };

    return new Mgr();
})();
