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
        app.subPost('/getClassList', function (req, res, data) {
            app.sendObj(req, res, {
                success: true,
                msg: "获取数据成功",
                context: {
                    homeworkList: [0,1,2,3,4,5,6,7,8,9].map(function(i){
                        return {
                            time: '02.24~02.26',
                            name: '上海一阶课('+data.dayType+')'+((data.pageNo-1)*10+i),
                            address: '上海五星级酒店',
                            isover: !(i&1),
                            isceo: !!(i&1),
                        }
                    }),
                }
            });
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
