var multer = require('multer');
var path = require('path');
var fs = require('fs');

module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getMyTaskRecord', function (req, res) {
            app.sendFile(req, res, __dirname+'/taskRecords.json');
        });
        app.subPost('/getMyProfit', function (req, res) {
            app.sendFile(req, res, __dirname+'/myProfit.json');
        });
        app.subPost('/getNews', function (req, res) {
            app.sendFile(req, res, __dirname+'/myNews.json');
        });
        app.subPost('/delNews', function (req, res) {
            app.sendFile(req, res, __dirname+'/delNews.json');
        });
        app.subPost('/getMyCollection', function (req, res) {
            app.sendFile(req, res, __dirname+'/myCollection.json');
        });
        app.subPost('/delMyCollectVedio', function (req, res) {
            app.sendFile(req, res, __dirname+'/delMyCollectVedio.json');
        });
        app.subPost('/getPersonalInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getPersonalInfo.json');
        });
        app.subPost('/getMyLearningRecord', function (req, res) {
            app.sendFile(req, res, __dirname+'/getMyLearningRecord.json');
        });
        app.subPost('/delMyLearningRecord', function (req, res) {
            app.sendFile(req, res, __dirname+'/delMyLearningRecord.json');
        });
        app.post('/app/api/uploadFile', multer({dest: 'public/heads/'}).single('file'), function (req, res) {
            var extname = path.extname(req.file.originalname);
            fs.renameSync(req.file.path, req.file.path+extname);
            var obj =  {
                "success": true,
                "msg": "获取数据成功",
                "context": {
                    "url":"http://localhost:3000"+req.file.path.replace('public', '')
                }
            };
            console.log(obj);
            app.sendObj(req, res, obj);
        });
        app.subPost('/updatePersnalInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/updatePersnalInfo.json');
        });
        app.subPost('/getVersionInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getVersionInfo.json');
        });
        app.subPost('/submitFeedback', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitFeedback.json');
        });
        app.subPost('/applicationForCash', function (req, res) {
            app.sendFile(req, res, __dirname+'/applicationForCash.json');
        });
        app.subPost('/cashRecord', function (req, res) {
            app.sendFile(req, res, __dirname+'/cashRecord.json');
        });
        app.subPost('/bindAccount', function (req, res) {
            app.sendFile(req, res, __dirname+'/bindAccount.json');
        });
        app.subPost('/studyProgressList', function (req, res) {
            app.sendFile(req, res, __dirname+'/studyProgressList.json');
        });
    };
    return new Mgr();
})();
