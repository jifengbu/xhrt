'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    AppState,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    ScrollView,
} = ReactNative;

const Subscribable = require('Subscribable');
const TimerMixin = require('react-timer-mixin');
const AlipayMgr = require('../../manager/AlipayMgr.js');
const WXpayMgr = require('../../manager/WXpayMgr.js');

let WXpayOrderNo = 0;
let AlipayOrderNo = 0;

module.exports = React.createClass({
    mixins: [Subscribable.Mixin, TimerMixin],
    statics: {
        title: '套餐购买',
    },
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
        POST(app.route.ROUTE_ALIPAY_CONFIRM, param, this.onPaySuccess);
    },
    wechatPayConfirm (tradeNo) {
        const param = {
            orderNo: tradeNo,
        };
        POST(app.route.ROUTE_WECHATPAY_CONFIRM, param, this.onPaySuccess);
    },
    onPaySuccess (data) {
        const { packageData, packageContext } = this.props;
        const { typeCode } = packageData;
        if (data.success) {
            const personInfo = app.personal.info;
            personInfo.userType = typeCode === '10004' ? '2' : '1';
            if (typeCode != '10004') {
                packageContext.packageVideoList.map((item, i) => {
                    personInfo.validVideoList.push(item.videoID);
                });
                // app.leftTimesMgr.addLeftTimes(typeCode, packageContext.packageTimeAll);
            }
            app.personal.set(personInfo);
            app.navigator.pop();
        }
    },
    getInitialState () {
        return {
            checkedType: 1,
            currentAppState: AppState.currentState,
            payWXStatus:false,
            winCoinList: [],
        };
    },
    doCheckedPay (index) {
        this.setState({ checkedType: index });
    },
    doConfirm () {
        if (this.state.checkedType === 1) {
            AlipayMgr.createWinCoinOrder(this.props.packageData.packageID, this.props.packageData.packagePrice.toFixed(2), this.props.packageData.typeCode === '10004' ? 2 : 1);
        } else if (this.state.checkedType === 0) {
            this.setState({ payWXStatus:true });
            WXpayMgr.createWinCoinOrder(this.props.packageData.packageID, this.props.packageData.typeCode === '10004' ? 2 : 1);
        }
    },
    getVideoPackageSuccess (data) {
        if (data.success) {
            if (this.state.checkedType === 1) {
                AlipayOrderNo = data.context.orderNo;
                AlipayMgr.getaliPayInfo('购买商品', data.context.orderNo, this.props.packageData.packagePrice.toFixed(2));
            } else if (this.state.checkedType === 0) {
                WXpayOrderNo = data.context.orderNo;
                this.setState({ payWXStatus:true });
                WXpayMgr.getWXPayInfo(app.personal.info.userID, data.context.orderNo);
            }
        } else {
            Toast(data.msg);
        }
    },
    render () {
        return (
            <View style={styles.container}>
                <Image
                    resizeMode='stretch'
                    source={app.img.package_VIP}
                    style={styles.bannerImage} />
                <View style={styles.viewStyle}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.describeText}>{'价格: '}</Text>
                        <Text style={styles.priceText}>
                            {this.props.packageData.packagePrice.toFixed(2)}
                        </Text>
                        <Text style={styles.describeText}>{' 元'}</Text>
                    </View>
                    <Text style={[styles.textStyle1, { marginLeft: 30, marginRight: 30 }]}>{this.props.packageData.packageIntroduction}</Text>
                </View>
                <View style={styles.lineStyle} />
                <View style={styles.viewStyle}>
                    <Text style={styles.textStyle}> 请选择你的支付方式:
                    </Text>
                </View>
                <View style={styles.payStyle}>
                    <View style={styles.imageViewStyle}>
                        <TouchableOpacity
                            onPress={this.doCheckedPay.bind(null, 0)}
                            underlayColor='rgba(0, 0, 0, 0)'>
                            <Image
                                resizeMode='stretch'
                                source={app.img.login_weixin_button}
                                style={styles.imageStyle} />
                            {
                                this.state.checkedType === 0 &&
                                <Image
                                    resizeMode='contain'
                                    source={app.img.common_check}
                                    style={styles.bannerImage1} />
                            }
                        </TouchableOpacity>
                        <Text style={styles.textStyle1}> 微信支付
                        </Text>
                    </View>
                    <View style={styles.imageViewStyle}>
                        <TouchableOpacity
                            onPress={this.doCheckedPay.bind(null, 1)}
                            underlayColor='rgba(0, 0, 0, 0)'>
                            <Image
                                resizeMode='stretch'
                                source={app.img.login_alipay_button}
                                style={styles.imageStyle} />
                            {
                                this.state.checkedType === 1 &&
                                <Image
                                    resizeMode='contain'
                                    source={app.img.common_check}
                                    style={styles.bannerImage1} />
                            }
                        </TouchableOpacity>
                        <Text style={styles.textStyle1}> 支付宝支付
                        </Text>
                    </View>
                </View>
                <View style={styles.touchContainer}>
                    <TouchableOpacity
                        onPress={this.doConfirm}
                        style={[styles.tabButton, { backgroundColor:'#4FC1E9' }]}>
                        <Text style={styles.textcenter} >
                            确    定
                        </Text>
                        <View style={styles.makeup} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    },

});

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#feffff',
    },
    viewStyle: {
        width: sr.w,
        marginTop:10,
    },
    payStyle: {
        width: sr.w,
        flexDirection:'row',
        height: 90,
        marginTop:10,
        alignItems:'center',
        justifyContent:'center',
    },
    lineStyle: {
        width: sr.w - 20,
        height: 1,
        alignSelf: 'center',
        marginTop:20,
        backgroundColor:'gray',
    },
    textStyle: {
        marginLeft: 20,
        fontSize:12,
        marginTop:20,
        color:'gray',
    },
    textStyle1: {
        fontSize:12,
        color:'gray',
    },
    bannerImage: {
        width:110,
        height: 150,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 30,
        alignSelf: 'center',
    },
    bannerImage1: {
        width:20,
        height: 20,
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    imageStyle: {
        width:60,
        height: 60,
        borderRadius:30,
    },
    imageViewStyle: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    touchContainer: {
        height:50,
        width:sr.w,
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    tabButton: {
        height:50,
        width:sr.w,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 10,
    },
    textcenter:{
        fontSize: 14,
        textAlign: 'center',
        color :'white',
    },
    priceContainer: {
        marginTop: 20,
        marginRight: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    priceText: {
        fontSize: 36,
        color: '#fa6e6f',
    },
    describeText: {
        fontSize: 20,
    },
    makeup: {
        width: sr.w,
        height: 10,
        position: 'absolute',
        right:0,
        bottom: 0,
        backgroundColor:'#4FC1E9',
    },
});
