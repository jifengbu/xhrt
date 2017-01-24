'use strict';

var EventEmitter = require('EventEmitter');
var Native = require('../native/index.js');

var winCoinPrice = 0.01;

class Manager extends EventEmitter {
	constructor() {
        super();
	}
	/**
	 * orderType  订单类型： 0=赢销币，1=套餐，2=年费会员,3=急求包打赏，4=求救包支付，5=4800特种兵套餐
	 */
    createWinCoinOrder(winCoinIDValue,price,orderType) {
		winCoinPrice = price;
        var param = {
            userID: app.personal.info.userID,
            winCoinID: winCoinIDValue,
			orderType: orderType,
        };
        POST(app.route.ROUTE_CREATE_WIN_CONIN_ORDER, param, this.createWinCoinOrderSuccess.bind(this, orderType), true);
    }
    createWinCoinOrderSuccess(orderType, data) {
        if (data.success) {
						switch (orderType)
						{
							case 0:
								this.getaliPayInfo("购买赢销币",data.context.orderNo,winCoinPrice);
								break;
							case 1:
								this.getaliPayInfo("购买套餐",data.context.orderNo,winCoinPrice);
								break;
							case 2:
								this.getaliPayInfo("购买年费会员",data.context.orderNo,winCoinPrice);
								break;
							case 3:
								this.getaliPayInfo("购买急救包打赏",data.context.orderNo,winCoinPrice);
								break;
							case 4:
								this.getaliPayInfo("购买求救包支付",data.context.orderNo,winCoinPrice);
								break;
							case 5:
								this.getaliPayInfo("购买4800特种兵套餐",data.context.orderNo,winCoinPrice);
								break;
						}
        } else {
            Toast(data.msg);
        }
    }
    getaliPayInfo(subject,orderNo,price) {
        var param = {
        };
		this.subject = subject;
		this.tradeNo = orderNo;
		winCoinPrice = price;
        POST(app.route.ROUTE_GET_ALIPAY_INFO, param, this.getaliPayInfoSuccess.bind(this));
    }
    getaliPayInfoSuccess(data) {
        if (data.success) {
            var context = data.context;
            this.partner = context.alipayPID;
            this.seller = context.alipayName;
            this.privateKey = context.alipayPrivateKey ;
            this.notifyUrl = context.callbackUrl;
            this.doPay();
        } else {
            Toast(data.msg);
        }
    }
	paySuccess(info) {
		this.emit('ALIPAY_RESULTS', {state: 'success', orderNo: this.tradeNo,price:winCoinPrice})
	}
	payError(info) {
		this.emit('ALIPAY_RESULTS', {state: 'error', orderNo: this.tradeNo,price:winCoinPrice})
	}
    /*
    * seller 你的商户支付宝帐号
    * partner 你的商户PID, 签约后，支付宝会为每个商户分配一个唯一的 parnter 和 seller。
    * privateKey 你生成的private key
    * tradeNo 交易号
    * subject 这个字段会显示在支付宝付款的页面
    * body 订单详情，没找到会显示哪里
    * price 价格，支持两位小数
    * function(successResults){} 是成功之后的回调函数
    * function(errorResults){} 是失败之后的回调函数
    */
    doPay() {
        var obj = {
            partner: this.partner,
            seller: this.seller,
            privateKey: this.privateKey,
            tradeNo: this.tradeNo,
            subject: this.subject,
            body: "赢销截拳道",
            price: winCoinPrice,
            notifyUrl: this.notifyUrl
        };
        Native.Alipay.pay(obj, this.paySuccess.bind(this),this.payError.bind(this));
    }
}
module.exports = new Manager();
