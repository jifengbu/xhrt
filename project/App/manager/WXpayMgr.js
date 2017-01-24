'use strict';

var {NativeAppEventEmitter, DeviceEventEmitter, Platform} = require('react-native');
var EventEmitter = require('EventEmitter');
var Wxpay = require('../native/index.js').WeixinPay;
var gEventEmitter = Platform.OS==="android"?DeviceEventEmitter:NativeAppEventEmitter;

class Manager extends EventEmitter {
	constructor() {
        super();
	}
	/**
	 * orderType  订单类型： 0=赢销币，1=套餐，2=年费会员,3=急求包打赏，4=求救包支付，5=4800特种兵套餐
	 */
	createWinCoinOrder(winCoinIDValue, orderType) {
		var param = {
			userID: app.personal.info.userID,
			winCoinID: winCoinIDValue,
			orderType: orderType,
		};
		POST(app.route.ROUTE_CREATE_WIN_CONIN_ORDER, param, this.createWinCoinOrderSuccess.bind(this), true);
	}
	createWinCoinOrderSuccess(data) {
		if (data.success) {
			this.getWXPayInfo(app.personal.info.userID,data.context.orderNo);
		} else {
			Toast(data.msg);
		}
	}
	getWXPayInfo(userID,orderNo) {
		var param = {
			userId:userID,
			orderNo:orderNo
		};
		this.orderNo = orderNo;
		POST(app.route.ROUTE_GET_WXPAY_INFO, param, this.getWXPayInfoInfoSuccess.bind(this));
	}
	getWXPayInfoInfoSuccess(data) {
		if (data.success) {
			this.doPay(data.context);
		} else {
			Toast(data.msg);
		}
	}
	useWeixinSuccess(info) {
		// this.emit('WXIPAY_RESULTS', {state: 'success', orderNo: this.orderNo})
	}
	useWeixinError(info) {
		this.emit('WXIPAY_RESULTS', {state: 'error', orderNo: this.orderNo,message:info});
	}
	onPayResult(info) {
		if (this.subscription) {
			this.subscription.remove();
			this.subscription = null;
		}
		if (info.success=='true') {
			this.emit('WXIPAY_RESULTS', {state: 'success', orderNo: this.orderNo,message:info.errStr})
		} else {
			this.emit('WXIPAY_RESULTS', {state: 'error', orderNo: this.orderNo,message:info.errStr})
		}
	}
    /*
    * 注：订单总金额，只能为整数，单位为【分】，参数值不能带小数。
    * appid: 公众账号ID
    * noncestr: 随机字符串
    * package: 扩展字段
    * partnerid: 商户号
    * prepayid: 预支付交易会话ID
    * timestamp: 时间戳
    * sign: 签名
    */
    doPay(data) {
		this.subscription = gEventEmitter.addListener('WEIXIN_PAY', (obj)=>{this.onPayResult(obj)});
        Wxpay.pay({
            appid: data.appid,
            noncestr: data.noncestr,
            package: data.package,
            partnerid: data.partnerid,
            prepayid: data.prepayid,
            timestamp: data.timestamp,
            sign: data.sign,
        },this.useWeixinSuccess.bind(this), this.useWeixinError.bind(this));
    }
	//查询是否支付成功
	checkPayResult() {
		var param = {
			userID: app.personal.info.userID,
			orderNo: this.orderNo,
		};
		POST(app.route.ROUTE_CHECK_ALIPAY_ISSUCCESS, param, this.onCheckPayResult.bind(this));
	}
	onCheckPayResult(data) {
		if (data.success) {
			if (data.context.flag) {
				var personInfo = app.personal.info;
				personInfo.winCoin = data.context.winCoin;
				app.personal.set(personInfo);
				this.emit('WXIPAY_RESULTS', {state: 'success', orderNo: this.orderNo,message:'购买成功'})
			} else {
				this.emit('WXIPAY_RESULTS', {state: 'error', orderNo: this.orderNo,message:'购买失败'})
			}
		}
	}
}
module.exports = new Manager();
