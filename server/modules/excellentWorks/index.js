module.exports = (function() {

    function Mgr() {
    }
    Mgr.prototype.register = function(app) {
      app.subPost('/getCourseList', function (req, res) {
          app.sendFile(req, res, __dirname+'/getCourseList.json');
      });
      app.subPost('/getHomeworkList', function (req, res) {
          app.sendFile(req, res, __dirname+'/getHomeworkList.json');
      });
      app.subPost('/getExcellentHomeworkList', function (req, res) {
          app.sendFile(req, res, __dirname+'/excellentHomeworkList.json');
      });
      app.subPost('/getHomeworkTipData', function (req, res) {
          app.sendFile(req, res, __dirname+'/getHomeworkTipData.json');
      });
    };
    return new Mgr();
})();
