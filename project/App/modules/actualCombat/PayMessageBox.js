'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    AppState,
    StyleSheet,
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

module.exports = React.createClass({
    mixins: [Subscribable.Mixin, TimerMixin],
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
    componentDidMount: function () {
        AppState.addEventListener('change', this._handleAppStateChange);
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
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
            this.closeModal(() => {
                this.props.doPayByAlipay();
            });
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
            this.closeModal(() => {
                this.props.doPayByWechat();
            });
        }
    },
    doPayByWechat () {
        this.setState({ payWXStatus:true });
        WXpayMgr.createWinCoinOrder(this.props.kitID, this.props.typeCode);
    },
    doPayByAlipay () {
        AlipayMgr.createWinCoinOrder(this.props.kitID, this.props.price, this.props.typeCode);
    },
    doPayByApplePay () {
        this.closeModal(() => {
            this.props.doPayByApplePay();
        });
    },
    doClose () {
        this.closeModal(() => {
            this.props.doClose();
        });
    },
    getInitialState () {
        return {
            opacity: new Animated.Value(0),
            currentAppState: AppState.currentState,
            payWXStatus:false,
        };
    },
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(() => {
            callback();
        });
    },
    render () {
        return (
            <Animated.View onPress={this.doClose} style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <View style={styles.container}>
                    <View style={styles.panelContainer}>
                        <Text style={styles.title}>请选择您的支付方式</Text>
                        <Text style={styles.lineView} />
                        <View style={styles.imageContainer}>
                            <View style={styles.touchContainer}>
                                <TouchableHighlight
                                    onPress={this.doPayByWechat}
                                    underlayColor='rgba(0, 0, 0, 0)'>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.login_weixin_button}
                                        style={styles.image} />
                                </TouchableHighlight>
                                <Text style={styles.payTitleText}>微信支付</Text>
                            </View>
                            <View style={styles.touchContainer}>
                                <TouchableHighlight
                                    onPress={this.doPayByAlipay}
                                    underlayColor='rgba(0, 0, 0, 0)'>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.login_alipay_button}
                                        style={styles.image} />
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
            </Animated.View>
        );
    },
});
const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
    },
    panelContainer: {
        width:sr.w * 3 / 4,
        borderRadius: 6,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    title: {
        color: '#444444',
        fontSize: 16,
        fontWeight: '100',
        textAlign: 'center',
        overflow: 'hidden',
        marginTop:22,
        marginBottom: 5,
    },
    lineView: {
        marginVertical: 5,
        width: sr.w * 3 / 4 - 50,
        height: 1,
        backgroundColor: '#cccccc',
    },
    imageContainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
    },
    touchContainer: {
        margin:20,
        alignItems: 'center',
    },
    image: {
        width:80,
        height:80,
    },
    payTitleText: {
        fontSize: 12,
        color: 'grey',
        marginTop: 3,
    },
    closeTouchableHighlight: {
        position:'absolute',
        top:0,
        left:sr.w * 3 / 4 - 24,
        width: 38,
        height: 38,
        marginTop: -10,
    },
    closeIcon: {
        width: 38,
        height: 38,
    },
});
