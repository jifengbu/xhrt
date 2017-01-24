'use strict';

var Des = require('@remobile/react-native-des');
var FileTransfer = require('@remobile/react-native-file-transfer');
var KEY = CONSTANTS.DES_KEY;

function UPLOAD(filePath, url, options, onprogress, success, failed, wait) {
    console.log("send:", url, parameter);
    if (typeof failed === 'boolean') {
        wait = failed;
        failed = null;
    }
    if (wait) {
        app.showProgressHUD();
    }
    var parameter = options.params;
    Des.encrypt(JSON.stringify(parameter), KEY, function(base64) {
        var param = base64;
        var fileTransfer = new FileTransfer();
        fileTransfer.onprogress = onprogress;
        fileTransfer.upload(filePath, app.route.ROUTE_UPDATE_FILE, (res)=>{
            var base64 = res.response;
            Des.decrypt(base64, KEY, function(jsonString) {
                var json = {};
                try {
                    json = JSON.parse(jsonString);
                } catch (error) {
                    if (!failed || !failed(error)) {
                        Toast('数据解析错误');
                        if (wait) {
                            app.dismissProgressHUD();
                        }
        			}
                }
                console.log("recv:", json);
                app.dismissProgressHUD();
                success(json);
            }, function() {
                Toast('数据解密错误');
            });
        }, (err)=>{
            if (!failed || !failed(err)) {
                Toast('上传失败');
                if (wait) {
                    app.dismissProgressHUD();
                }
			}
        }, options);
    }, function() {
        Toast('数据加密错误');
    });
}

module.exports = UPLOAD;
