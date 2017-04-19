'use strict';

const React = require('react');const ReactNative = require('react-native');

const {
    AppState,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Navigator,
    Animated,
    Easing,
} = ReactNative;

const Subscribable = require('Subscribable');
const TimerMixin = require('react-timer-mixin');
const UmengMgr = require('../../manager/UmengMgr.js');
const AlipayMgr = require('../../manager/AlipayMgr.js');
const WXpayMgr = require('../../manager/WXpayMgr.js');
// const DrawShareMessageBox = require('./DrawShareMessageBox.js');
const DrawAwardRecordMessageBox = require('./DrawAwardRecordMessageBox.js');
const DrawIntegralNotEnoughMessageBox = require('./DrawIntegralNotEnoughMessageBox.js');
const DrawCongratulationsMessageBox = require('./DrawCongratulationsMessageBox.js');
const PayResultMessageBox = require('./PayResultMessageBox.js');
const BuyMessageBox = require('./BuyMessageBox.js');

const { Button, WebviewMessageBox } = COMPONENTS;

const NO_REWARD_ANDLE_MIN = 330; // 未中奖的最小角度
const NO_REWARD_ANDLE_MAX = 390; // 未中奖的最大角度
const ANIMATE_CIRCLE_TIMES = 20; // 动画的圈数
const ANIMATE_DURING_TIME = 20000; // 动画时间
const ANGLE_OFFSET = 5; // 奖品角度间隔位移为角度
let exchangeData = {};
let lightBackIntervalID;
let isContinue = true;
let isGetWebResult = true;
let messageBoxText = '购买失败';
let tradeNo = '';

module.exports = React.createClass({
    mixins: [Subscribable.Mixin, TimerMixin],
    statics: {
        title: '幸运抽奖',
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
        if (this.pay_interval != null) {
            clearInterval(this.pay_interval);
        }
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
            const personInfo = app.personal.info;
            personInfo.winCoin = data.context.totalWinCoin != undefined && data.context.totalWinCoin ? data.context.totalWinCoin : 0;
            app.personal.set(personInfo);
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
            const personInfo = app.personal.info;
            personInfo.winCoin = data.context.totalWinCoin != undefined && data.context.totalWinCoin ? data.context.totalWinCoin : 0;
            app.personal.set(personInfo);
        }
    },
    getAilPayResult (tradeNo) {
        isGetWebResult = false;
        const param = {
            userID: app.personal.info.userID,
            orderNo: tradeNo,
        };
        POST(app.route.ROUTE_CHECK_ALIPAY_ISSUCCESS, param, this.getPayResult);
    },
    getPayResult (data) {
        if (data.success) {
            let isSuccess = false;
            if (data.context.flag) {
                const personInfo = app.personal.info;
                personInfo.winCoin = data.context.winCoin;
                app.personal.set(personInfo);
                messageBoxText = '购买成功';
            } else {
                messageBoxText = '购买失败';
            }
            tradeNo = '';
            isContinue = false; // 停止循环
            this.setState({ overlayShowBox: true });
        } else {
            isContinue = true;
        }
        isGetWebResult = true; // 表示服务器已返回，可以继续拉取数据
    },
    showLotteryAnimate () {
        this.setState({
            endValue: _.random(NO_REWARD_ANDLE_MIN + ANGLE_OFFSET, NO_REWARD_ANDLE_MAX - ANGLE_OFFSET),
            userInterfaceEnable: false,
        });
        this.state.rotation.setValue(0);
        this.timeoutFalg = true;
        lightBackIntervalID = this.setInterval(() => {
            this.state.lightState === 1 ? this.setState({ lightState: 2 }) : this.setState({ lightState: 1 });
        }, 500);
        Animated.timing(this.state.rotation, {
            toValue: 1,
            duration: ANIMATE_DURING_TIME / 2,
            easing: Easing.in(Easing.poly(2)),
        }).start(() => {
            this.timeoutFalg = false;
            Animated.timing(this.state.rotation, {
                toValue: 2,
                duration: ANIMATE_DURING_TIME / 2,
                easing: Easing.out(Easing.poly(2)),
            }).start(this.animationDidStop);
        });
    },
    animationDidStop () {
        this.setState({ startValue: this.state.endValue - 360 * ANIMATE_CIRCLE_TIMES }); // 上一次的结束位置为下次的开始位置
        // todo 关闭灯光效果
        clearInterval(lightBackIntervalID);
        // 显示抽奖结果
        this.setState({ userInterfaceEnable:true, overlayShowCongratulations:true });
    },
    startDraw () {
        if (this.state.isIntegralEnough) {
            this.getPrizes();
            this.showLotteryAnimate();
        } else {
            this.setState({ overlayShowNotEnough:true });
        }
    },
    getPrizes () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_PRIZES, param, this.getPrizesSuccess);
    },
    getPrizesSuccess (data) {
        if (data.success) {
            const personInfo = app.personal.info;
            const context = data.context;
            if (context.isLottery == 2 && this.timeoutFalg) { // 中奖并且没有超时
                const { startAngle, endAngle } = context.prize;
                this.setState({ endValue: _.random(startAngle + ANGLE_OFFSET, endAngle - ANGLE_OFFSET) });
            }
            personInfo.integral -= context.prize.consMarsCoin;
            app.personal.set(personInfo);
            this.setState({ prizeContext:context, integralDetail:context.prize });
        } else {
            Toast(data.msg);
        }
    },
    myAwardRecords () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_MY_AWARD_RECORDS, param, this.myAwardRecordsSuccess);
    },
    myAwardRecordsSuccess (data) {
        if (data.success) {
            const awardList = data.context.awardList || [];
            this.setState({ recordList:awardList, overlayShowAwardRecord:true });
        } else {
            Toast(data.msg);
        }
    },
    doShare () {
        // this.setState({overlayShowShare:true});
        if (this.state.prizeContext.prize == undefined) {
            UmengMgr.doActionSheetShare(CONSTANTS.SHARE_SHAREDIR_SERVER + 'shareDraw.html', '赢销抽大奖', '我在赢销截拳道学习场，完整观看完视频后，获得抽奖机会', 'web', CONSTANTS.SHARE_IMGDIR_SERVER + 'draw.png', this.doShareCallback);
        } else {
            const data = 'prizeImg=' + this.state.prizeContext.prize.img + '&prizeName=' + this.state.prizeContext.prize.name;
            const dataEncode = encodeURI(data);
            UmengMgr.doActionSheetShare(CONSTANTS.SHARE_SHAREDIR_SERVER + 'shareDraw.html?' + dataEncode, '赢销抽大奖', '我在赢销截拳道学习场，完整观看完视频后，获得抽奖机会', 'web', CONSTANTS.SHARE_IMGDIR_SERVER + 'draw.png', this.doShareCallback);
        }
    },
    doShareCallback () {

    },
    // doCloseShare() {
    //     this.setState({overlayShowShare:false});
    // },
    // doShareWechat() {
    //     this.setState({overlayShowShare:false});
    // },
    // doShareFriends() {
    //     this.setState({overlayShowShare:false});
    // },
    // doShareQQ() {
    //     this.setState({overlayShowShare:false});
    // },
    doCloseAwardRecord () {
        this.setState({ overlayShowAwardRecord:false });
    },
    doCloseNotEnough () {
        this.setState({ overlayShowNotEnough:false });
    },
    doBuyIntegral () {
        this.setState({ overlayShowNotEnough:false });
        this.getIntegralGoods();
    },
    getIntegralGoods () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_INTEGRAL_GOODS, param, this.getIntegralGoodsSuccess);
    },
    getIntegralGoodsSuccess (data) {
        if (data.success) {
            const integralList = data.context.integralList || [];
            this.setState({ integralList:integralList, overlayShowBuy:true });
        } else {
            Toast(data.msg);
        }
    },
    exchange (integralIDValue) {
        const param = {
            userID: app.personal.info.userID,
            integralID:integralIDValue,
        };
        POST(app.route.ROUTE_EXCHANGE, param, this.exchangeSuccess, true);
    },
    exchangeSuccess (data) {
        if (data.success) {
            // 更新个人积分信息
            const personInfo = app.personal.info;
            personInfo.integral += exchangeData.getIntegral;
            personInfo.winCoin -= exchangeData.costWinCoin;
            const winNum = parseInt(personInfo.winCoin);
            if (winNum <= 0) {
                personInfo.winCoin = 0;
            }
            app.personal.set(personInfo);
            this.setState({ isIntegralEnough:!(this.props.costCoin > app.personal.info.integral) });
            Toast(data.msg);
        } else {
            Toast(data.msg);
        }
    },
    doCloseCongratulations () {
        const personInfo = app.personal.info;
        if (this.state.integralDetail.prizeTypeCode === '10002') {
            personInfo.integral += Number(this.state.integralDetail.value);
        } else if (this.state.integralDetail.prizeTypeCode === '10003') {
            personInfo.winCoin += Number(this.state.integralDetail.value);
        }
        app.personal.set(personInfo);
        this.setState({ isIntegralEnough:!(this.props.costCoin > app.personal.info.integral) });
        this.setState({ overlayShowCongratulations:false });
    },
    doCloseBuy () {
        this.setState({ overlayShowBuy:false });
    },
    doDrawAgain () {
        this.setState({ overlayShowCongratulations:false });
    },
    doSubmit (data) {
        this.submitReceivingInfo(data);
    },
    submitReceivingInfo (data) {
        const param = {
            userID: app.personal.info.userID,
            name:data.name,
            phone:data.phone,
            address:data.address,
            lotteryId:data.lotteryId,
        };
        POST(app.route.ROUTE_SUBMIT_RECEIVEING_INFO, param, this.submitReceivingInfoSuccess);
    },
    submitReceivingInfoSuccess (data) {
        Toast(data.msg);
        this.setState({ overlayShowCongratulations:false });
    },
    doExchangeIntegral (data) {
        exchangeData = {
            getIntegral:data.integralNum,
            costWinCoin:data.winCoin,
        };
        this.setState({ overlayShowBuy:false });
        this.exchange(data.id);
    },
    doPayWechat (winCoinIDValue) {
        this.setState({ overlayShowBuy:false });
        this.setState({ payWXStatus:true });
        WXpayMgr.createWinCoinOrder(winCoinIDValue, 0);
    },
    doPayAlipay (winCoinIDValue, winCoinPrice) {
        this.setState({ overlayShowBuy:false });
        AlipayMgr.createWinCoinOrder(winCoinIDValue, winCoinPrice, 0);
    },
    getInitialState () {
        return {
            currentAppState: AppState.currentState,
            rotation: new Animated.Value(0),
            endValue: 0,    // 转盘结束的位置
            startValue: -360 * ANIMATE_CIRCLE_TIMES,  // 转盘开始的位置
            isIntegralEnough: !(this.props.costCoin > app.personal.info.integral),
            // overlayShowShare:false,
            overlayShowAwardRecord:false,
            overlayShowNotEnough:false,
            overlayShowCongratulations:false,
            overlayShowBuy:false,
            payWXStatus:false,
            userInterfaceEnable: true,
            lightState:1,
            recordList:[],
            integralList:[],
            prizeContext:{},
            overlayShowBox:false,
            integralDetail:{},
        };
    },
    doConfirmBox () {
        this.setState({ overlayShowBox: false });
    },
    render () {
        return (
            <View style={styles.container}>
                <Image
                    resizeMode='stretch'
                    source={app.img.draw_background}
                    style={styles.backgroundImage}>
                    <View style={styles.topView}>
                        <Button
                            onPress={this.doShare}
                            style={styles.topViewButton}>分享</Button>
                    </View>
                    <View style={styles.centerView}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.draw_award_round}
                            style={styles.awardRoundImage}>
                            <Image
                                resizeMode='stretch'
                                source={this.state.lightState === 1 ? app.img.draw_style_1 : app.img.draw_style_2}
                                style={styles.awardStyleImage}>
                                <Image
                                    resizeMode='stretch'
                                    defaultSource={app.img.draw_prize}
                                    source={{ uri:this.props.rewardBackImg }}
                                    style={styles.awardPrizeImage}>
                                    <Animated.Image
                                        style={[styles.startPointImage, {
                                            opacity: this.state.fadeInOpacity,
                                            transform: [{
                                                rotateZ: this.state.rotation.interpolate({
                                                    inputRange: [0, 1, 2],
                                                    outputRange: [this.state.startValue + 'deg', '0deg', (this.state.endValue + 360 * ANIMATE_CIRCLE_TIMES) + 'deg'],
                                                }),
                                            }],
                                        }]}
                                        resizeMode='stretch'
                                        source={app.img.draw_start_point} />
                                    <TouchableOpacity
                                        onPress={this.startDraw}
                                        activeOpacity={0.5}
                                        style={styles.startDrawButton}
                                        >
                                        <Text />
                                    </TouchableOpacity>
                                </Image>
                            </Image>
                        </Image>

                        <Text style={{ color: '#FFFFFF', marginTop:20 }}>{'我的积分: '}
                            <Text style={{ color: '#ff8c00' }}>{app.personal.info.integral}
                            </Text>
                        </Text>
                        <Text style={{ color: '#FFFFFF', marginTop:10 }}>{'每次抽奖消耗  '}
                            <Text style={{ color: '#ff8c00' }}>20
                                <Text style={{ color: '#FFFFFF' }}>{'  积分'}
                                </Text>
                            </Text>
                        </Text>
                    </View>
                    <View style={styles.bottomView} />
                </Image>
                <Button
                    onPress={this.myAwardRecords}
                    style={styles.bottomViewButton}>我的获奖记录</Button>
                {
                    // this.state.overlayShowShare ?
                    // <DrawShareMessageBox doClose={this.doCloseShare} doShareWechat={this.doShareWechat} doShareFriends={this.doShareFriends} doShareQQ={this.doShareQQ}></DrawShareMessageBox>
                    // :
                    this.state.overlayShowAwardRecord ?
                        <DrawAwardRecordMessageBox
                            recordList={this.state.recordList}
                            doClose={this.doCloseAwardRecord} />
                    : this.state.overlayShowNotEnough ?
                        <DrawIntegralNotEnoughMessageBox
                            costType={0}
                            costCoin={this.props.costCoin}
                            doClose={this.doCloseNotEnough}
                            doBuyIntegral={this.doBuyIntegral} />
                    : this.state.overlayShowCongratulations ?
                        <DrawCongratulationsMessageBox
                            showType={0}
                            prizeContext={this.state.prizeContext}
                            doClose={this.doCloseCongratulations}
                            doDrawAgain={this.doDrawAgain}
                            doSubmit={this.doSubmit} />
                    : this.state.overlayShowBuy &&
                    <BuyMessageBox
                        costType={0}
                        integralList={this.state.integralList}
                        doClose={this.doCloseBuy}
                        doExchangeIntegral={this.doExchangeIntegral}
                        doPayWechat={this.doPayWechat}
                        doPayAlipay={this.doPayAlipay} />
                }
                {
                    !this.state.userInterfaceEnable &&
                    <View style={styles.interfaceMask} />
                }
                {
                    this.state.overlayShowBox &&
                    <PayResultMessageBox
                        contentText={messageBoxText}
                        doConfirm={this.doConfirmBox} />
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topView: {
        flex: 1,
        width:sr.w,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop:20,
    },
    topViewButton: {
        width:70,
        height:25,
        marginTop: 25,
        justifyContent: 'center',
        marginHorizontal:10,
        backgroundColor: CONSTANTS.THEME_COLOR,
        borderRadius:5,
        borderWidth:1,
        borderColor:'white',
    },
    bottomView: {
        flex: 1,
        flexDirection: 'row',
    },
    bottomViewButton: {
        width:160,
        height:45,
        bottom: -5,
        borderRadius: 4,
        position: 'absolute',
        left: (sr.w - 160) / 2,
    },
    centerView: {
        flex: 4,
        marginTop:-15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        width:sr.w,
        height: sr.h,
        alignItems: 'center',
        justifyContent: 'center',
    },
    awardRoundImage: {
        width:sr.w - 80,
        height: sr.w - 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:-60,
    },
    awardStyleImage: {
        width:sr.w - 90,
        height:sr.w - 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    awardPrizeImage: {
        width:sr.w - 150,
        height: sr.w - 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startPointImage: {
        width:70,
        height: 70 * 332 / 195,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startDrawButton: {
        width: 80,
        height: 80,
        top: sr.w / 2 - 100,
        left: sr.w / 2 - 100,
        position: 'absolute',
    },
    interfaceMask: {
        position: 'absolute',
        width: sr.w,
        height: sr.h,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.01)',
    },
});
