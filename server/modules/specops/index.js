module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/specialSoldierVerification', function (req, res) {
            app.sendFile(req, res, __dirname+'/specialSoldierVerification.json');
        });
        app.subPost('/getSpecialSoldierData', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSpecialSoldierData.json');
        });
        app.subPost('/submitDaySummary', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitDaySummary.json');
        });
        app.subPost('/getDaySummary', function (req, res) {
            app.sendFile(req, res, __dirname+'/getDaySummary.json');
        });
        app.subPost('/submitWeekSummary', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitWeekSummary.json');
        });
        app.subPost('/getWeekSummary', function (req, res) {
            app.sendFile(req, res, __dirname+'/getWeekSummary.json');
        });
        app.subPost('/addMonthPlan', function (req, res) {
            app.sendFile(req, res, __dirname+'/addMonthPlan.json');
        });
        app.subPost('/editMonthPlan', function (req, res) {
            app.sendFile(req, res, __dirname+'/editMonthPlan.json');
        });
        app.subPost('/setMonthPlanIsOver', function (req, res) {
            app.sendFile(req, res, __dirname+'/setMonthPlanIsOver.json');
        });
        app.subPost('/getMonthPlan', function (req, res) {
            app.sendFile(req, res, __dirname+'/getMonthPlan.json');
        });
        app.subPost('/addWeekPlan', function (req, res) {
            app.sendFile(req, res, __dirname+'/addWeekPlan.json');
        });
        app.subPost('/getWeekPlan', function (req, res) {
            app.sendFile(req, res, __dirname+'/getWeekPlan.json');
        });
        app.subPost('/editWeekPlan', function (req, res) {
            app.sendFile(req, res, __dirname+'/editWeekPlan.json');
        });
        app.subPost('/setWeekPlanIsOver', function (req, res) {
            app.sendFile(req, res, __dirname+'/setWeekPlanIsOver.json');
        });
        app.subPost('/addTodayPlan', function (req, res) {
            app.sendFile(req, res, __dirname+'/addTodayPlan.json');
        });
        app.subPost('/editDayPlan', function (req, res) {
            app.sendFile(req, res, __dirname+'/editDayPlan.json');
        });
        app.subPost('/setDayPlanIsOver', function (req, res) {
            app.sendFile(req, res, __dirname+'/setDayPlanIsOver.json');
        });
        app.subPost('/specialSoldierVideo', function (req, res) {
            app.sendFile(req, res, __dirname+'/specialSoldierVideo.json');
        });
        app.subPost('/submitSpecialSoldierTask', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitSpecialSoldierTask.json');
        });
        app.subPost('/question', function (req, res) {
            app.sendFile(req, res, __dirname+'/question.json');
        });
        app.subPost('/getAgentInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getAgentInfo.json');
        });
        app.subPost('/getSpecialSoldierHomework', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSpecialSoldierHomework.json');
        });
        app.subPost('/getSpecialSoldierQuestion', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSpecialSoldierQuestion.json');
        });
        app.subPost('/getQandA', function (req, res) {
            app.sendFile(req, res, __dirname+'/getQandA.json');
        });
        app.subPost('/answer', function (req, res) {
            app.sendFile(req, res, __dirname+'/answer.json');
        });
        app.subPost('/qandADetail', function (req, res) {
            app.sendFile(req, res, __dirname+'/qandADetail.json');
        });
        app.subPost('/endVideo', function (req, res) {
            app.sendFile(req, res, __dirname+'/endVideo.json');
        });
        app.subPost('/getFixedProblem', function (req, res) {
            app.sendFile(req, res, __dirname+'/getFixedProblem.json');
        });
        app.subPost('/addFixedProblemAnswer', function (req, res) {
            app.sendFile(req, res, __dirname+'/addFixedProblemAnswer.json');
        });
        app.subPost('/addReportEmail', function (req, res) {
            app.sendFile(req, res, __dirname+'/addReportEmail.json');
        });
        app.subPost('/addReportEmail', function (req, res) {
            app.sendFile(req, res, __dirname+'/addReportEmail.json');
        });
        app.subPost('/getSubjectAll', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSubjectAll.json');
        });
        app.subPost('/submitAnswer', function (req, res) {
            app.sendFile(req, res, __dirname+'/submitAnswer.json');
        });
        app.subPost('/getSpecopsIntroduction', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSpecopsIntroduction.json');
        });
        app.subPost('/getHomePagePlan', function (req, res) {
            app.sendFile(req, res, __dirname+'/getHomePagePlan.json');
        });
        app.subPost('/studyProgress', function (req, res) {
            app.sendFile(req, res, __dirname+'/studyProgress.json');
        });
    };

    return new Mgr();
})();
