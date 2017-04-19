'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    AppState,
    StyleSheet,
    View,
    Navigator,
    Text,
    Image,
    ScrollView,
} = ReactNative;

const Subscribable = require('Subscribable');
const TimerMixin = require('react-timer-mixin');
const TrainSpeakerAngleView = require('./TrainSpeakerAngleView.js');
const TrainHearerAngleView = require('./TrainHearerAngleView.js');
const TrainProp = require('./Prop.js');
const TrainPChat = require('./Chat.js');
const SpeechState = require('./SpeechState.js');
const ProgressBar = require('./ProgressBar.js');
const TrainGradeMessageBox = require('./TrainGradeMessageBox.js');
const TrainRankMessageBox = require('./TrainRankMessageBox.js');
const AlipayMgr = require('../../manager/AlipayMgr.js');
const WXpayMgr = require('../../manager/WXpayMgr.js');
const BuyMessageBox = require('../study/BuyMessageBox.js');
const DrawIntegralNotEnoughMessageBox = require('../study/DrawIntegralNotEnoughMessageBox.js');
const CardBox = require('../shared/CardBox.js');

const { MessageBox } = COMPONENTS;
const trainGuide = require('../guide/TrainGuide.js');
let exchangeData = {};
let personInfo;

module.exports = React.createClass({
    mixins: [Subscribable.Mixin, TimerMixin, SceneMixin],
    statics: {
        title: '训练场',
        leftButton: { handler: () => app.scene.goBackPrompt() },
    },
    registerEvents (name) {
        this.addListenerOn(app.phoneMgr, name, (param) => {
            this[name](param);
        });
    },
    componentWillMount () {
        this.propIndex = 0;
        this.registerEvents('EVENT_SERVER_INFO_ERROR');
        this.registerEvents('EVENT_DISCONNECT');
        this.registerEvents('EVENT_SELF_READY_SPEAK');
        this.registerEvents('EVENT_SELF_SPEAKING');
        this.registerEvents('EVENT_WAIT_OTHER_SPEAK');
        this.registerEvents('EVENT_OTHER_SPEAKING');
        this.registerEvents('EVENT_STATUS_CHANGE');
        this.registerEvents('EVENT_SHOW_GRADE_FOR_OTHER_PANEL');
        this.registerEvents('EVENT_SHOW_TOTAL_GRADE_PANEL');
        this.registerEvents('EVENT_ALL_OTHERS_LEFT_ROOM');
        this.registerEvents('EVENT_DEVICE_NET_OFFLINE');

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
        if (!this.state.isSelfSpeek) {
            app.showAssistModal(trainGuide);
        }
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
    EVENT_SERVER_INFO_ERROR (result) {
        this.setState({ contentText: result, showCustomMessageBox: true });
    },
    EVENT_DISCONNECT (result) {
        this.setState({ contentText: '网络异常，房间即将关闭', showCustomMessageBox: true });
    },
    EVENT_SELF_READY_SPEAK (result) {
        // 切换界面到自己的界面
        console.log('EVENT_SELF_READY_SPEAK', result);
        this.setState({ competitors: app.phoneMgr.competitors, isSelfSpeek: true, showSpeakerStartBtn: true });
    },
    EVENT_SELF_SPEAKING (result) {
        // 更新用户状态
        console.log('EVENT_SELF_SPEAKING', result);
        this.setState({ competitors: app.phoneMgr.competitors });
        this.refs.progressbar.doStartProgress();
    },
    EVENT_WAIT_OTHER_SPEAK (result) {
        // 切换界面到其他人
        console.log('EVENT_WAIT_OTHER_SPEAK', result);
        app.showAssistModal(trainGuide);
        this.setState({ competitors: app.phoneMgr.competitors, isSelfSpeek: false, speaker:result.speaker });
    },
    EVENT_OTHER_SPEAKING (result) {
        // 更新用户状态
        console.log('EVENT_OTHER_SPEAKING', result);
        this.setState({ competitors: app.phoneMgr.competitors });
    },
    EVENT_STATUS_CHANGE (result) {
        // 更新用户状态
        console.log('EVENT_STATUS_CHANGE', result);
        this.setState({ competitors: app.phoneMgr.competitors });
    },
    EVENT_SHOW_GRADE_FOR_OTHER_PANEL (result) {
        // 显示给别人打分
        console.log('EVENT_SHOW_GRADE_FOR_OTHER_PANEL', result);
        this.setState({ competitors: app.phoneMgr.competitors, overlayShowGrade:true, gradeCompetitor: result.gradeCompetitor });
    },
    EVENT_SHOW_TOTAL_GRADE_PANEL (result) {
        // 显示总的分数排行榜
        console.log('EVENT_SHOW_TOTAL_GRADE_PANEL', result);
        this.setState({ competitors: app.phoneMgr.competitors, overlayShowRank:true, rankList: result.rankList });
        const personInfo = app.personal.info;
        personInfo.PKTime += 1;
        const userInfo = _.find(result.rankList, (item) => item.rank == 1);
        if (userInfo && userInfo.userID == personInfo.userID) {
            personInfo.PKWinTime += 1;
        }
        app.personal.set(personInfo);
    },
    EVENT_COMPETITOR_EXIT (result) {
        // 更新用户状态
        console.log('EVENT_COMPETITOR_EXIT', result);
        this.setState({ competitors: app.phoneMgr.competitors });
    },
    EVENT_ALL_OTHERS_LEFT_ROOM (result) {
        console.log('EVENT_ALL_OTHERS_LEFT_ROOM', result);
        this.setState({ competitors: app.phoneMgr.competitors, contentText: '其他人都离开了房间，房间即将关闭', showCustomMessageBox: true });
    },
    EVENT_DEVICE_NET_OFFLINE () {
        this.goBack();
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
            personInfo.winCoin = data.context.totalWinCoin ? data.context.totalWinCoin : 0;
            app.personal.set(personInfo);
            this.setState({});// 刷新赢销币数量
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
            personInfo.winCoin = data.context.totalWinCoin ? data.context.totalWinCoin : 0;
            app.personal.set(personInfo);
            this.setState({});// 刷新赢销币数量
        }
    },
    doRestart () {
        app.phoneMgr.setMySelfWait();
        this.setState({ competitors: app.phoneMgr.competitors, overlayShowRank:false, showSpeakerStartBtn:false });
        app.phoneMgr.restart();
    },
    doStartSpeach () {
        this.setState({ showSpeakerStartBtn:false, showProgress: true });
        app.phoneMgr.startSpeak();
        this.setTimeout(() => {
            this.setState({ showSpeakerStopBtn:true });
        }, this.props.roundTime * 3 / 4);
    },
    doStopSpeach () {
        app.phoneMgr.stopSpeak();
        this.setState({ showSpeakerStopBtn: false, showProgress: false });
    },
    goBack () {
        app.phoneMgr.closeSocket();
        app.navigator.pop();
        this.props.getTrainingInfo();
    },
    goBackPrompt () {
        this.setState({ showExitMessageBox: true });
    },
    doExit () {
        this.goBack();
    },
    doTrainGradeMessageBoxConfirm (score) { // 关闭和确定都打分
        this.setState({ overlayShowGrade:false });
        app.phoneMgr.setGradeToServer(score);
    },
    getInitialState () {
        return {
            currentAppState: AppState.currentState,
            competitors: this.props.competitors,
            speaker: this.props.speaker,
            isSelfSpeek:this.props.isSelfSpeek,
            overlayShowGrade:false,
            overlayShowRank:false,
            showSpeakerStartBtn:true,
            showSpeakerStopBtn:false,
            showProgress: false,
            showCustomMessageBox: false,
            showExitMessageBox: false,
            showleftTimesMessageBox: false,
            overlayShowBuy: false,
            overlayShowNotEnough: false,
            payWXStatus:false,
            contentText: '',
            propItem: {},
            integralList: [],
            winCoinList: [],
            costType: 0,
            propValue: 0,
            overlayShowCardBox: false,
            cardBoxUserID:'',
        };
    },
    doCloseNotEnough () {
        this.setState({ overlayShowNotEnough:false });
    },
    doBuyIntegral () {
        if (this.state.costType === 0) {
            this.getIntegralGoods();
        } else {
            this.getWinCoinGoods();
        }
        this.setState({ overlayShowNotEnough:false });
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
            this.setState({ integralList:integralList, overlayShowBuy: true });
        } else {
            Toast(data.msg);
        }
    },
    getWinCoinGoods () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_WIN_COIN_GOODS, param, this.getWinCoinGoodsSuccess);
    },
    getWinCoinGoodsSuccess (data) {
        if (data.success) {
            const winCoinList = data.context.winCoinList || [];
            this.setState({ winCoinList:winCoinList, overlayShowBuy: true });
        } else {
            Toast(data.msg);
        }
    },
    showGif (propCode) {
        this.setState({
            propItem: {
                propCode: propCode,
                propIndex: this.propIndex++,
            },
        });
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
    doCloseBuy () {
        this.setState({ overlayShowBuy:false });
    },
    // 0表示积分 1表示赢销币
    ShowBuyChange (costType, propValue) {
        if (costType === 0) {
            this.setState({ costType: costType, propValue: propValue, overlayShowNotEnough: true });
        } else {
            this.setState({ costType: costType, propValue: propValue, overlayShowNotEnough: true });
        }
    },
    doExchangeIntegral (data) {
        exchangeData = {
            getIntegral:data.integralNum,
            costWinCoin:data.winCoin,
        };
        this.setState({ overlayShowBuy:false });
        this.exchange(data.id);
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
            personInfo = app.personal.info;
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
    doSendProp (propInfo) {
        const param = {
            fromUserID: app.personal.info.userID,
            toUserID: this.state.speaker.userID,
            propID: propInfo.propID,
            roomID: app.phoneMgr.chatroomID,
        };
        POST(app.route.ROUTE_SEND_PROP, param, this.doSendPropSuccess.bind(null, propInfo));
    },
    doSendPropSuccess (propInfo, data) {
        if (data.success) {
            if (!CONSTANTS.ISSUE_IOS) {
                const personInfo = app.personal.info;
                // 0表示用积分购买1-用赢销币购买 发送成功后 减去相应的积分和营销币
                if (propInfo.propType == 1) {
                    personInfo.integral -= propInfo.propValue;
                } else if (propInfo.propType == 2) {
                    personInfo.winCoin -= propInfo.propValue;
                }
                const winNum = parseInt(personInfo.winCoin);
                const integralNum = parseInt(personInfo.integral);
                if (winNum <= 0) {
                    personInfo.winCoin = 0;
                }
                if (integralNum <= 0) {
                    personInfo.integral = 0;
                }
                // 更新个人积分信息
                app.personal.set(personInfo);
            }
        } else {
            Toast(data.msg);
        }
    },
    hideCard () {
        this.setState({ overlayShowCardBox: false });
    },
    showCard () {
        this.setState({ overlayShowCardBox: true });
    },
    onPressSpeech (userID) {
        this.setState({ cardBoxUserID:userID });
        this.showCard();
    },
    render () {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    {
                      this.state.isSelfSpeek ?
                          <TrainSpeakerAngleView
                              competitors={this.state.competitors}
                              propItem={this.state.propItem}
                              doStartSpeach={this.doStartSpeach}
                              doStopSpeach={this.doStopSpeach}
                              showStartBtn={this.state.showSpeakerStartBtn}
                              showStopBtn={this.state.showSpeakerStopBtn}
                          />
                      :
                          <TrainHearerAngleView
                              competitors={this.state.competitors}
                              propItem={this.state.propItem}
                              speaker={this.state.speaker}
                          />
                    }
                    <View style={styles.propTopView}>
                        <SpeechState
                            competitors={this.state.competitors}
                            onPress={this.onPressSpeech}
                            />
                    </View>
                </ScrollView>
                {
                        this.state.isSelfSpeek ?
                            <View style={this.state.showProgress ? styles.propBottomViewSpeakerShowProgress : styles.propBottomViewSpeaker}>
                                {this.state.showProgress &&
                                <ProgressBar
                                    style={styles.ProgressBottomView}
                                    ref='progressbar'
                                    time={this.props.roundTime}
                                    onEnd={this.doStopSpeach} />
                            }
                                <TrainPChat
                                    style={styles.chatBottomView}
                                    roomID={app.phoneMgr.chatroomID}
                                    noticeShow={this.showGif} />
                            </View>
                        :
                            <View style={app.isandroid ? styles.propBottomViewListenerAndroid : styles.propBottomViewListenerIos}>
                                <TrainProp
                                    noticeShowPrompt={this.doSendProp}
                                    roomID={app.phoneMgr.chatroomID}
                                    ShowBuyChange={this.ShowBuyChange}
                                    propList={this.props.propList} />
                                <TrainPChat
                                    style={styles.chatBottomView}
                                    roomID={app.phoneMgr.chatroomID}
                                    noticeShow={this.showGif} />
                            </View>
                    }
                {
                    this.state.overlayShowGrade &&
                    <TrainGradeMessageBox
                        competitor={this.state.gradeCompetitor}
                        doConfirm={this.doTrainGradeMessageBoxConfirm}
                        />
                }
                {
                    this.state.overlayShowRank &&
                    <TrainRankMessageBox
                        rankList={this.state.rankList}
                        doRestart={this.doRestart}
                        doExit={this.doExit}
                        />
                }
                {
                    (this.state.showCustomMessageBox && !this.state.showExitMessageBox) &&
                    <MessageBox
                        content={this.state.contentText}
                        doConfirm={this.goBack}
                        />
                }
                {
                    this.state.showExitMessageBox &&
                    <MessageBox
                        content='你正在比赛中，确定要退出比赛吗？'
                        doConfirm={this.goBack}
                        doCancel={() => { this.setState({ showExitMessageBox: false }); }}
                        />
                }
                {
                    this.state.showleftTimesMessageBox &&
                    <MessageBox
                        content='你已经消耗完该训练场次数，需要购买套餐后才可以使用'
                        doConfirm={this.goBack}
                        doCancel={() => { this.setState({ showleftTimesMessageBox: false }); }}
                        />
                }
                {
                    this.state.overlayShowNotEnough &&
                    <DrawIntegralNotEnoughMessageBox
                        costType={this.state.costType}
                        costCoin={this.state.propValue}
                        doClose={this.doCloseNotEnough}
                        doBuyIntegral={this.doBuyIntegral} />
                }
                {
                    this.state.overlayShowBuy &&
                    <BuyMessageBox
                        costType={this.state.costType}
                        integralList={this.state.integralList}
                        winCoinList={this.state.winCoinList}
                        doClose={this.doCloseBuy}
                        doExchangeIntegral={this.doExchangeIntegral}
                        doPayWechat={this.doPayWechat}
                        doPayAlipay={this.doPayAlipay} />
                }
                {
                    this.state.overlayShowCardBox &&
                    <CardBox
                        hideCard={this.hideCard}
                        userID={this.state.cardBoxUserID} />
                }

            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    propBottomViewSpeakerShowProgress: {
        position:'absolute',
        bottom: 0,
        left: 0,
        width:sr.w,
        backgroundColor:'transparent',
        height:182,
    },
    propBottomViewSpeaker: {
        position:'absolute',
        bottom: 0,
        left: 0,
        width:sr.w,
        backgroundColor:'transparent',
        height:147,
    },
    propBottomViewListenerAndroid: {
        position:'absolute',
        bottom: 0,
        left: 0,
        width:sr.w,
        backgroundColor:'black',
        height:210,
    },
    propBottomViewListenerIos: {
        position:'absolute',
        bottom: 0,
        left: 0,
        width:sr.w,
        backgroundColor:'black',
        height:200,
    },
    chatBottomView: {
        // width:sr.w,
        // backgroundColor:'#333333',
    },
    propTopView: {
        position:'absolute',
        top: 0,
        left: 0,
        width: sr.w - 60,
        alignItems:'center',
        justifyContent:'center',
    },
    text: {
        fontSize: 16,
        color: '#FFFFFF',
    },
});
