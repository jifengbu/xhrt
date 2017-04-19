'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    AppState,
    Text,
    Image,
    Animated,
    View,
    TouchableHighlight,
} = ReactNative;

const Subscribable = require('Subscribable');
const TimerMixin = require('react-timer-mixin');
const AlipayMgr = require('../../manager/AlipayMgr.js');
const WXpayMgr = require('../../manager/WXpayMgr.js');
const BindingBox = require('../login/BindingBox.js');

module.exports = React.createClass({
    mixins: [Subscribable.Mixin],
    componentWillMount () {
        this.addListenerOn(WXpayMgr, 'WXIPAY_RESULTS', (param) => {
            this.setState({ payWXStatus:false });
            if (param.state == 'success') {
                this.wechatPayConfirm(param.orderNo);
            } else {
                Toast(param.message);
            }
        });
        this.addListenerOn(AlipayMgr, 'ALIPAY_RESULTS', (param) => {
            if (param.state == 'success') {
                this.aliPayConfirm(param.orderNo, param.price);
            } else {
                Toast('支付宝支付失败');
            }
        });
    },
    getInitialState: function () {
        return {
            currentAppState: AppState.currentState,
            payWXStatus:false,
        };
    },
    componentDidMount: function () {
        AppState.addEventListener('change', this._handleAppStateChange);
    },
    componentWillUnmount: function () {
        AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange: function (currentAppState) {
        this.setState({ currentAppState });
        console.log(this.state.currentAppState);
        if (this.state.currentAppState == 'active' && this.state.payWXStatus == true) {
            this.setState({ payWXStatus:false });
            WXpayMgr.checkPayResult();
        }
    },
    aliPayConfirm (tradeNo, price) {
        const param = {
            orderNo: tradeNo,
            price: price,
        };
        POST(app.route.ROUTE_ALIPAY_CONFIRM, param, this.aliPayConfirmResult);
    },
    aliPayConfirmResult (data) {
        Toast(data.msg);
        if (data.success) {
            this.props.doPayByAlipay();
        }
    },
    wechatPayConfirm (tradeNo) {
        const param = {
            orderNo: tradeNo,
        };
        POST(app.route.ROUTE_WECHATPAY_CONFIRM, param, this.wechatPayConfirmResult);
    },
    wechatPayConfirmResult (data) {
        Toast(data.msg);
        if (data.success) {
            this.props.doPayByWechat();
        }
    },
    doPayByWechat () {
        if (app.isBind === false) {
            Toast('需要绑定手机号才能购买');
            app.showModal(
                <BindingBox doRefresh={this.doRefresh} />
            );
        } else {
            this.setState({ payWXStatus:true });
            WXpayMgr.createWinCoinOrder(this.props.packageID, this.props.orderType);
        }
    },
    doRefresh () {
        const { isAgent, isSpecialSoldier } = app.personal.info;
        const authorized = isAgent || isSpecialSoldier;
        if (authorized) {
            this.props.doBack();
            Toast('此账号已经是特种兵');
            return;
        }
        Toast('绑定成功');
        app.closeModal();
    },
    doSuccess () {
        const { isAgent, isSpecialSoldier } = app.personal.info;
        const authorized = isAgent || isSpecialSoldier;
        if (authorized) {
            this.props.doBack();
            Toast('此账号已经是特种兵');
            return;
        }
        Toast('绑定成功');
        app.closeModal();
    },
    doPayByAlipay () {
        if (app.isBind === false) {
            Toast('需要绑定手机号才能购买');
            app.showModal(
                <BindingBox doRefresh={this.doSuccess} />
            );
        } else {
            AlipayMgr.createWinCoinOrder(this.props.packageID, this.props.packagePrice, this.props.orderType);
        }
    },
    doClose () {
        this.props.doClose();
        app.closeModal();
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.viewContainer}>
                    <View style={styles.panelContainer}>
                        <View style={styles.promptTitleView}>
                            <Text style={styles.themeTitle}>{`¥ ${this.props.packagePrice.toFixed(2)}`}</Text>
                        </View>
                        <View style={styles.promptTitleView}>
                            <Text style={styles.title}>{this.props.title}</Text>
                        </View>
                        <Text style={styles.title}>{this.props.describe}</Text>
                        <View style={styles.divisionContainer}>
                            <View style={[styles.lineView, { marginRight: 10 }]} />
                            <Text style={styles.promptText}>请选择您的支付方式</Text>
                            <View style={[styles.lineView, { marginLeft: 10 }]} />
                        </View>
                        <View style={styles.imageContainer}>
                            <View style={styles.touchContainer}>
                                <TouchableHighlight
                                    onPress={this.doPayByWechat}
                                    underlayColor='rgba(0, 0, 0, 0)'>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_wetchat}
                                        style={styles.payImageWechat} />
                                </TouchableHighlight>
                                <Text style={styles.payTitleText}>微信支付</Text>
                            </View>
                            <View style={styles.lineVertical} />
                            <View style={styles.touchContainer}>
                                <TouchableHighlight
                                    onPress={this.doPayByAlipay}
                                    underlayColor='rgba(0, 0, 0, 0)'>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_pay}
                                        style={styles.payImage} />
                                </TouchableHighlight>
                                <Text style={styles.payTitleText}>支付宝支付</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableHighlight
                        onPress={this.doClose}
                        style={styles.closeTouchableHighlight}
                        underlayColor='rgba(0, 0, 0, 0)'>
                        <Image
                            resizeMode='contain'
                            source={app.img.draw_back}
                            style={styles.closeIcon} />
                    </TouchableHighlight>
                </View>
            </View>
        );
    },
});
const styles = StyleSheet.create({
    container: {
        position:'absolute',
        bottom: 0,
        top:0,
        left: 0,
        right: 0,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    viewContainer: {
        width: sr.w,
        height: 253,
        alignItems:'center',
        justifyContent:'flex-end',
    },
    panelContainer: {
        width: sr.w - 60,
        height: 233,
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
        backgroundColor: '#EFEFEF',
    },
    lineVertical: {
        height: 55,
        width: 1,
        backgroundColor: '#EFEFEF',
    },
    promptText: {
        fontSize: 12,
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
        left:sr.w - 49,
        width: 38,
        height: 38,
        marginTop: 5,
    },
    closeIcon: {
        width: 38,
        height: 38,
    },
});
