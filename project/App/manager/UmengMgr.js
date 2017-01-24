'use strict';
var Umeng = require('../native/index.js').Umeng;
var EventEmitter = require('EventEmitter');

class Manager extends EventEmitter {
	constructor() {
        super();
	}
	/*
	*url:点击图文跳到的地址
	*title：图文上显示的标题,为null时显示公司名
	*text：图文显示的内容
	*shareType：app（应用分享），微信分享时会打开应用，qq分享会跳连接；web（网络分享），跳连接；text（文字分享）发送一段文字内容为text参数
	*callback:回调函数
	*/
    doActionSheetShare(url,title,text,shareType,imageUrl,callback) {
        Umeng.shareWithActionSheet({
            url:url==null?(app.isandroid?'http://www.gyyxjqd.com/download/apks/admin/apks/apk/yxjqd.apk':'https://itunes.apple.com/cn/app/ying-xiao-jie-quan-dao/id1096525384?mt=8'):url,
            title:title==null?"贵阳赢销截拳道网络科技有限公司":title,
            text: text,
			imageUrl:imageUrl==null?"http://120.76.207.78/app/www/img/logo.png":imageUrl,
			shareType:shareType,
			sharePlatforms:"all"
        }, (result)=>{
			if (result.success) {
				callback()
			}
            console.log("success", result);
        });

    }
	//platform取值:
	// Umeng.platforms.UMShareToWechatTimeline(微信朋友圈)
	// Umeng.platforms.UMShareToWechatSession（微信好友）
	// Umeng.platforms.UMShareToQQ（qq）
	// Umeng.platforms.UMShareToQzone（qq空间）
    doSingleShare(platform,url,title,text,shareType,imageUrl,callback) {
        Umeng.shareSingle(platform==null?Umeng.platforms.UMShareToQQ:platform, {
			url:url==null?(app.isandroid?'http://www.gyyxjqd.com/download/apks/admin/apks/apk/yxjqd.apk':'https://itunes.apple.com/cn/app/ying-xiao-jie-quan-dao/id1096525384?mt=8'):url,
			title:title==null?"贵阳赢销截拳道网络科技有限公司":title,
			text: text,
			imageUrl:imageUrl==null?"http://120.76.207.78/app/www/img/logo.png":imageUrl,
			shareType:shareType,
        }, (result)=>{
			if (result.success) {
				callback()
			}
            console.log("success", result);
        });
    }
}
module.exports = new Manager();
