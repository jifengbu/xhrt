module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
        app.subPost('/getHomeworkDetails', function (req, res) {
            app.sendFile(req, res, __dirname+'/getHomeworkDetails.json');
        });
        app.subPost('/getPersonalHomeworkDetails', function (req, res) {
            app.sendFile(req, res, __dirname+'/getPersonalHomeworkDetails.json');
        });
        app.subPost('/getStudySituationDetails', function (req, res) {
            app.sendFile(req, res, __dirname+'/getStudySituationDetails.json');
        });
        app.subPost('/getDayPlan', function (req, res) {
            app.sendFile(req, res, __dirname+'/getDayPlan.json');
        });
        app.subPost('/getCompanyInfo', function (req, res) {
            app.sendFile(req, res, __dirname+'/getCompanyInfo.json');
        });
        app.subPost('/getWorkSituationAbstract', function (req, res) {
            app.sendFile(req, res, __dirname+'/getWorkSituationAbstract.json');
        });
        app.subPost('/getSpecialList', function (req, res) {
            app.sendFile(req, res, __dirname+'/getSpecialList.json');
        });
        app.subPost('/getStudySituationAbstract', function (req, res) {
            app.sendFile(req, res, __dirname+'/getStudySituationAbstract.json');
        });
        app.subPost('/getPersonalStudyDetails', function (req, res) {
            app.sendFile(req, res, __dirname+'/getPersonalStudyDetails.json');
        });
        app.subPost('/getPersonalQuizzesDetails', function (req, res) {
            app.sendFile(req, res, __dirname+'/getPersonalQuizzesDetails.json');
        });
        app.subPost('/getQuizzesDetails', function (req, res) {
            app.sendFile(req, res, __dirname+'/getQuizzesDetails.json');
        });
        app.subPost('/getUserTaskSubmitRate', function (req, res) {
            app.sendFile(req, res, __dirname+'/getUserTaskSubmitRate.json');
        });
        app.subPost('/getUserTaskSubmitRateDetails', function (req, res) {
            app.sendFile(req, res, __dirname+'/getUserTaskSubmitRateDetails.json');
        });
    };

    return new Mgr();
})();
