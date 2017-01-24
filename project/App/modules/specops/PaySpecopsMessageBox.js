'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    AppState,
    Text,
    Image,
    Animated,
    View,
    TouchableHighlight,
} = ReactNative;

var Subscribable = require('Subscribable');
var TimerMixin = require('react-timer-mixin');
var AlipayMgr = require('../../manager/AlipayMgr.js');
var WXpayMgr = require('../../manager/WXpayMgr.js');

module.exports = React.createClass({
    mixins: [Subscribable.Mixin],
    componentWillMount() {
        this.addListenerOn(WXpayMgr, 'WXIPAY_RESULTS', (param)=>{
            this.setState({payWXStatus:false});
            if (param.state == 'success') {
                this.wechatPayConfirm(param.orderNo);
            } else {
                Toast(param.message);
            }
        });
        this.addListenerOn(AlipayMgr, 'ALIPAY_RESULTS', (param)=>{
            if (param.state == 'success') {
                this.aliPayConfirm(param.orderNo, param.price);
            } else {
                Toast('支付宝支付失败');
            }
        });
    },
    getInitialState: function() {
      return {
        currentAppState: AppState.currentState,
        payWXStatus:false,
      };
    },
    componentDidMount: function() {
      AppState.addEventListener('change', this._handleAppStateChange);
    },
    componentWillUnmount: function() {
      AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange: function(currentAppState) {
      this.setState({ currentAppState, });
      console.log(this.state.currentAppState);
      if (this.state.currentAppState == 'active' && this.state.payWXStatus == true) {
          this.setState({payWXStatus:false});
          WXpayMgr.checkPayResult();
      }
    },
    aliPayConfirm(tradeNo,price) {
        var param = {
            orderNo: tradeNo,
            price: price,
        };
        POST(app.route.ROUTE_ALIPAY_CONFIRM, param, this.aliPayConfirmResult);
    },
    aliPayConfirmResult(data) {
        Toast(data.msg);
        if (data.success) {
            this.props.doPayByAlipay();
        }
    },
    wechatPayConfirm(tradeNo) {
        var param = {
            orderNo: tradeNo,
        };
        POST(app.route.ROUTE_WECHATPAY_CONFIRM, param, this.wechatPayConfirmResult);
    },
    wechatPayConfirmResult(data) {
        Toast(data.msg);
        if (data.success) {
            this.props.doPayByWechat();
        }
    },
    doPayByWechat() {
        this.setState({payWXStatus:true});
        WXpayMgr.createWinCoinOrder(app.data.specopsPackageID, 5);
    },
    doPayByAlipay() {
        AlipayMgr.createWinCoinOrder(app.data.specopsPackageID, app.data.specopsPackagePrice, 5);
    },
    doClose() {
        this.props.doClose();
        app.closeModal();

    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.panelContainer}>
                    <View style={styles.promptTitleView}>
                        <Text style={styles.themeTitle}>{`¥${app.data.specopsPackagePrice}`}</Text>
                    </View>
                    <View style={styles.promptTitleView}>
                        <Text style={styles.title}>开通特种兵</Text>
                    </View>
                    <Text style={styles.title}>购买后你将拥有一年的特种兵特权</Text>
                    <View style={styles.divisionContainer}>
                        <View style={[styles.lineView, {marginRight: 10}]}/>
                        <Text style={styles.promptText}>请选择您的支付方式</Text>
                        <View style={[styles.lineView, {marginLeft: 10}]}/>
                    </View>
                    <View style={styles.imageContainer}>
                        <View style={styles.touchContainer}>
                            <TouchableHighlight
                                onPress={this.doPayByWechat}
                                underlayColor="rgba(0, 0, 0, 0)">
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.specops_wetchat}
                                    style={styles.payImageWechat}>
                                </Image>
                            </TouchableHighlight>
                            <Text style={styles.payTitleText}>微信支付</Text>
                        </View>
                        <View style={styles.lineVertical}/>
                        <View style={styles.touchContainer}>
                            <TouchableHighlight
                                onPress={this.doPayByAlipay}
                                underlayColor="rgba(0, 0, 0, 0)">
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.specops_pay}
                                    style={styles.payImage}>
                                </Image>
                            </TouchableHighlight>
                            <Text style={styles.payTitleText}>支付宝支付</Text>
                        </View>
                    </View>
                </View>
                <TouchableHighlight
                    onPress={this.doClose}
                    style={styles.closeTouchableHighlight}
                    underlayColor="rgba(0, 0, 0, 0)">
                    <Image
                        resizeMode='contain'
                        source={app.img.draw_back}
                        style={styles.closeIcon}>
                    </Image>
                </TouchableHighlight>
            </View>
        );
    }
});
var styles = StyleSheet.create({
    container: {
        position:'absolute',
        bottom: 0,
        top:0,
        left: 0,
        right: 0,
        alignItems:'center',
    },
    panelContainer: {
        width: 313,
        height: 233,
        marginTop: (sr.h-200)/2,
        marginBottom: 15,
        borderRadius: 6,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
    },
    promptTitleView: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        color: '#949494',
        fontSize: 12,
        fontFamily: 'STHeitiSC-Medium',
        textAlign: 'center',
        overflow: 'hidden',
        marginBottom: 5,
    },
    themeTitle: {
        color: '#383838',
        fontSize: 28,
        fontFamily: 'STHeitiSC-Medium',
        textAlign: 'center',
        overflow: 'hidden',
        marginBottom: 5,
    },
    divisionContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    lineView: {
        flex: 1,
        height: 1,
        marginVertical: 5,
        backgroundColor: '#EFEFEF'
    },
    lineVertical: {
        height: 55,
        width: 1,
        backgroundColor: '#EFEFEF'
    },
    promptText: {
        fontSize: 10,
        fontFamily: 'STHeitiSC-Medium',
        color: '#C8C8C8',
    },
    imageContainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    touchContainer: {
        marginVertical:15,
        marginHorizontal: 40,
        alignItems: 'center',
    },
    payImageWechat: {
        width:29,
        height:29,
    },
    payImage: {
        width:26,
        height:26,
    },
    payTitleText: {
        fontSize: 14,
        color: '#5C5C5C',
        marginTop: 5,
        fontFamily: 'STHeitiSC-Medium',
    },
    closeTouchableHighlight: {
        position:'absolute',
        top:0,
        left:sr.w*6/7+3,
        width: 38,
        height: 38,
        marginTop: (sr.h-200-20)/2,
    },
    closeIcon: {
        width: 38,
        height: 38
    },
});
