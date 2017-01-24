module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.post('/getPersonalInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/personal.json');
        });
        app.post('/getHomeworkList', function (req, res) {
            app.sendFile(req, res, __dirname+'/homeworkList.json');
        });
        app.post('/getHomeworkById', function (req, res) {
            app.sendFile(req, res, __dirname+'/getHomeworkById.json');
        });
        app.post('/getHomeworkListByOpenid', function (req, res) {
            app.sendFile(req, res, __dirname+'/homeworkList.json');
        });
        app.post('/getExcellentHomeworkList', function (req, res) {
            app.sendFile(req, res, __dirname+'/homeworkList.json');
        });
        app.post('/getExcellentHomeworkList', function (req, res) {
            app.sendFile(req, res, __dirname+'/excellentHomeworkList.json');
        });
        app.post('/getCourseList', function (req, res) {
            app.sendFile(req, res, __dirname+'/courseList.json');
        });
        app.post('/submitHomework', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitHomework.json');
        });
        app.post('/commentHomework', function (req, res) {
            app.sendFile(req, res, __dirname+'/commentHomework.json');
        });
        app.post('/getHomeworkTipData', function (req, res) {
            app.sendFile(req, res, __dirname+'/getHomeworkTipData.json');
        });
        app.post('/praiseHomework', function (req, res) {
            app.sendFile(req, res, __dirname+'/praiseHomework.json');
        });
        app.post('/getOneSpecialSoldierTask', function (req, res) {
            app.sendFile(req, res, __dirname+'/getOneSpecialSoldierTask.json');
        });
    };

    return new Mgr();
})();
