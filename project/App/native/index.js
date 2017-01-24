var Umeng = require('./umeng/index.js');
var Alipay = require('./alipay/index.js');
var WeixinPay = require('./wxpay/index.js');
var Phone = require('./phone/index.js');
var AudioRecorder = require('./audioRecorder/index.js');
var VhallPlayer = require('./vhall/index.js');
var VhallPublish = require('./vhall/publish');

module.exports = {
    Umeng: Umeng,
    Alipay: Alipay,
    WeixinPay: WeixinPay,
    Phone: Phone,
    AudioRecorder: AudioRecorder,
    VhallPlayer:VhallPlayer,
    VhallPublish:VhallPublish,
};
