const Umeng = require('./umeng/index.js');
const Alipay = require('./alipay/index.js');
const WeixinPay = require('./wxpay/index.js');
const Phone = require('./phone/index.js');
const AudioRecorder = require('./audioRecorder/index.js');
const VhallPlayer = require('./vhall/index.js');
const VhallPublish = require('./vhall/publish');

module.exports = {
    Umeng: Umeng,
    Alipay: Alipay,
    WeixinPay: WeixinPay,
    Phone: Phone,
    AudioRecorder: AudioRecorder,
    VhallPlayer:VhallPlayer,
    VhallPublish:VhallPublish,
};
