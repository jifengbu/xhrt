module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.post('/getTestList', function (req, res) {
            var data = {
                success: true,
                context: {
                    list:[1,2,3,4,5,6,7,8,9,10]
                }
            };
            app.sendObj(req, res, data);
        });
    };

    return new Mgr();
})();
