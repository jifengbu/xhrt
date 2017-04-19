'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Image,
    View,
    TextInput,
    ScrollView,
    TouchableHighlight,
    Text,
} = ReactNative;

const dismissKeyboard = require('dismissKeyboard');
const Subscribable = require('Subscribable');
const TimerMixin = require('react-timer-mixin');
const AidComment = require('./AidComment.js');
const MyCaseList = require('./MyCaseList.js');
const SignUp = require('./SignUp.js');
const AidBigImage = require('./AidBigImage.js');
const ShowPayAidMessageBox = require('./ShowPayAidMessageBox.js');
const ShowThankVoiceMessageBox = require('./ShowThankVoiceMessageBox.js');
const BuyWinCoinMessageBox = require('../train/BuyWinCoinMessageBox.js');
const Audio = require('@remobile/react-native-audio');
const AlipayMgr = require('../../manager/AlipayMgr.js');
const WXpayMgr = require('../../manager/WXpayMgr.js');
const CardBox = require('../shared/CardBox.js');

const PayMessageBox = require('./PayMessageBox.js');

const { Button } = COMPONENTS;

let defaultNum = 1; // 未付款时默认只能看一张图片
// let isPay = false;  //是否支付 默认为false
module.exports = React.createClass({
    mixins: [Subscribable.Mixin, TimerMixin],
    getInitialState () {
        this.isPlaying = [];
        return {
            kitDetail : {},
            isPlaying: false,
            overlayShowPayAidMessageBox: false,
            overlayShowThankVoiceMessageBox: false,
            overlayShowPayMessageBox: false,
            isPay: false,
            kitID: this.props.kitInfo.id,
            payType: 3,
            startDate: '00:00:00',
            endDate: '00:00:00',
            isChildComment: false,
            tempCommentID: 0,
            tempPublisherName: '',
            commentContent: '',
            userCardId: '',
            overlayShowCardBox: false,
        };
    },
    componentDidMount () {
        app.phoneMgr.toggleSpeaker(true);
        this.setState({ isSpeakerOn:app.phoneMgr.isSpeakerOn });
        this.getItemKit();
    },
    getItemKit () {
        const param = {
            kitID: this.props.kitInfo.id,
            userID: app.personal.info.userID,
            type: this.props.tabIndex,

        };
        POST(app.route.ROUTE_GET_ITEM_KIT, param, this.getItemKitSuccess, true);
    },
    getItemKitSuccess (data) {
        if (data.success) {
            const { audioArray, isPay, startTime, endTime } = data.context;
            this.isPlaying = _.fill(Array(audioArray.length), false);
            if (app.personal.info.userID === this.props.kitInfo.releaseId) {
                this.setState({
                    kitDetail:data.context,
                    isPlaying: this.isPlaying,
                    isPay: true,
                    startDate: startTime,
                    endDate: endTime,
                });
            } else {
                const tempIsPay = !!isPay;
                this.setState({
                    kitDetail:data.context,
                    isPlaying: this.isPlaying,
                    isPay: tempIsPay,
                    startDate: startTime,
                    endDate: endTime,
                });
            }
        } else {
            Toast(data.msg);
        }
    },
    doPayConfirm () {
        this.setState({ overlayShowPayAidMessageBox: false, overlayShowPayMessageBox:true });
    },
    doCancle () {
        this.setState({ overlayShowPayAidMessageBox: false });
    },
    doThankConfirm () {
        this.setState({ overlayShowThankVoiceMessageBox: false });
    },
    doThankCancle () {
        this.setState({ overlayShowThankVoiceMessageBox: false });
    },
    onPaySuccess () {
        const { thankAudio } = this.state.kitDetail;
        this.props.updateAidList(this.props.kitInfo.id, this.props.tabIndex);
        if (thankAudio === '' || thankAudio == null) {
            this.setState({ overlayShowPayMessageBox:false, isPay: true });
        } else {
            this.setState({ overlayShowPayMessageBox:false, overlayShowThankVoiceMessageBox: true, isPay: true });
        }
    },
    doClosePayMessageBox () {
        this.setState({ overlayShowPayMessageBox:false });
    },
    doPayByApplePay () {

    },
    doSubmitComment () {
        dismissKeyboard();
        if (this.state.commentContent === '') {
            Toast('请提交评论信息');
            return;
        }
        const { userID } = app.personal.info;
        if (!this.state.isSendding) {
            Toast('正在发送评论...');
            this.setState({ isSendding: true });
            // 为true子评论，为false评论
            if (this.state.isChildComment) {
                const param = {
                    userID: userID,
                    kitID:this.props.kitInfo.id,
                    commentID:this.state.tempCommentID,
                    comment:this.state.commentContent,
                    type: this.props.tabIndex,
                };
                POST(app.route.ROUTE_SUBMIT_SONKIDS_COMMENT, param, this.doSubmitSonCommentSuccess);
            } else {
                const param = {
                    userID: userID,
                    kitID:this.props.kitInfo.id,
                    type: this.props.tabIndex,
                    comment:this.state.commentContent,
                };
                POST(app.route.ROUTE_REPLAY_ITEM_KIT, param, this.submitCommentSuccess);
            }
        }
    },
    submitCommentSuccess (data) {
        if (data.success) {
            const info = app.personal.info;
            const curComment = {
                commentID: 0,
                publisherImg: info.headImg,
                publisherName: info.name,
                publisherTime: app.utils.getCurrentTimeString(),
                publisherAlias: info.alias,
                comment: this.state.commentContent,
            };
            this.setState({ commentContent: '', isSendding: false, isChildComment: false });
            Toast('发表评论成功');
            this.commentList.doRefresh(curComment);
        } else {
            Toast(data.msg);
        }
    },
    doSubmitSonCommentSuccess (data) {
        if (data.success) {
            Toast('回复成功');
            app.refreshComments.doRefreshComments();
            this.setState({ commentContent: '', isSendding: false, isChildComment: false });
        } else {
            Toast(data.msg);
        }
    },
    popupInputbox (commentID, publisherName) {
        this.setState({
            tempCommentID: commentID,
            tempPublisherName: publisherName,
            isChildComment: true,
        });
        this.commentInput.focus();
    },
    onBlur () {
        if (this.state.commentContent === '') {
            this.setState({
                tempCommentID: 0,
                tempPublisherName: '',
                isChildComment: false,
            });
        }
    },
    hideCard () {
        this.setState({ overlayShowCardBox: false });
    },
    isShowCard (userCardId) {
        this.setState({ userCardId, overlayShowCardBox: true });
    },
    render () {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <this.DetailView />
                    <AidComment ref={(ref) => { this.commentList = ref; }} popupInputbox={this.popupInputbox} isPlayer={this.isPlayer} kitID={this.props.kitInfo.id} tabIndex={this.props.tabIndex} />
                    {
                        this.props.tabIndex === 0 ?
                            <View style={styles.caseContainer}>
                                <View style={styles.caseTitleContainer}>
                                    <Text style={[styles.titleText, { fontSize: 18 }]}>
                                        {'网友方案'}
                                    </Text>
                                </View>
                                <MyCaseList isPlayer={this.isPlayer} isShowCard={this.isShowCard} kitDetail={this.state.kitDetail} kitID={this.props.kitInfo.id} ref={(ref) => { this.caseList = ref; }} tabIndex={this.props.tabIndex} showCardType={2} />
                            </View>
                        : <View style={{ height: 20 }} />
                    }
                </ScrollView>
                <View style={styles.inputContainer}>
                    <View style={styles.bottomInput}>
                        <View style={styles.inputView}>
                            <TextInput
                                ref={(ref) => { this.commentInput = ref; }}
                                onBlur={this.onBlur}
                                onChangeText={(text) => this.setState({ commentContent: text })}
                                defaultValue={this.state.commentContent}
                                placeholder={this.state.isChildComment ? ('回复' + this.state.tempPublisherName + '：') : '有什么感想快来说说吧'}
                                style={styles.textInput} />
                        </View>
                        <Button
                            onPress={this.doSubmitComment}
                            style={styles.btnSend}
                            textStyle={styles.butText}>
                            发送
                        </Button>
                    </View>
                </View>
                {
                    this.state.overlayShowPayAidMessageBox &&
                    <ShowPayAidMessageBox
                        winCoinNum={this.state.kitDetail.price}
                        doConfirm={this.doPayConfirm}
                        doCancle={this.doCancle} />
                }
                {
                    this.state.overlayShowThankVoiceMessageBox &&
                    <ShowThankVoiceMessageBox
                        thankLong={this.state.kitDetail.thankLong}
                        thankAudio={this.state.kitDetail.thankAudio}
                        doConfirm={this.doThankConfirm}
                        doCancle={this.doThankCancle} />
                }
                {
                    this.state.overlayShowPayMessageBox &&
                    <PayMessageBox {...this.state}
                        kitID={this.props.kitInfo.id}
                        price={this.props.kitInfo.price}
                        typeCode={3}
                        doPayByWechat={this.onPaySuccess}
                        doPayByAlipay={this.onPaySuccess}
                        doClose={this.doClosePayMessageBox}
                        doPayByApplePay={this.doPayByApplePay} />
                }
                {
                    this.state.overlayShowCardBox &&
                    <CardBox
                        userID={this.state.userCardId}
                        hideCard={this.hideCard} />
                }
            </View>
        );
    },
    updateCaseList (id) {
        this.props.updateAidList({ id: id, type: this.props.tabIndex });
        this.caseList.doRefresh();
    },
    goConfirm () {
        this.isPlayer();
        app.navigator.push({
            component: SignUp,
            passProps: {
                toKitDetail:this.state.kitDetail,
                kitID:this.props.kitInfo.id,
                updateCaseList:this.updateCaseList,
            },
        });
    },
    showBigImage (imageArray, index) {
        app.showModal(
            <AidBigImage
                doImageClose={app.closeModal}
                defaultIndex={index}
                defaultImageArray={imageArray} />
        );
    },
    componentWillUnmount () {
        app.phoneMgr.toggleSpeaker(false);
        clearInterval(this.intervalID);
        this.intervalID = null;
        if (this.player) {
            this.voiceStop();
        }
    },
    voiceStop () {
        this.player.stop();
        this.player.release();
        this.player = null;
    },
    isPlayer () {
        if (this.player) {
            this.voiceStop();
            this.isPlaying[this.isPlayingIndex] = false;
            this.setState({ isPlaying: this.isPlaying });
        }
    },
    playVoice (url, index) {
        if (!url || url === 'null') {
            Toast('音频地址为空');
            return;
        }
        if (!this.state.isPay && this.props.tabIndex === 1) {
            index = 0;
            const tempDuration = parseInt(this.state.kitDetail.audioArray[index].whenLong * 0.2);
            this.setState({ second: tempDuration });
            url = this.state.kitDetail.audioArray[index].recordPath;
            if (this.player && this.isPlaying[0]) {
                this.voiceStop();
                this.isPlaying[0] = false;
                this.setState({ isPlaying: this.isPlaying });
                clearInterval(this.intervalID);
                this.intervalID = null;
                return;
            } else {
                this.player = new Audio(url, (error) => {
                    if (!error) {
                        this.isPlaying[0] = true;
                        this.setState({ isPlaying: this.isPlaying });
                        this.player != null && this.player.play(() => {
                        });
                    } else {
                        Toast('播放失败');
                    }
                });
                clearInterval(this.intervalID);
                this.intervalID = null;
            }
            this.intervalID = setInterval(() => {
                let { second } = this.state;
                second--;
                this.setState({ second });
                if (second < 0) {
                    if (this.player && this.isPlaying[0]) {
                        this.voiceStop();
                        this.isPlaying[0] = false;
                        this.setState({ isPlaying: this.isPlaying });
                    }
                    this.showPayMessageBox();
                    clearInterval(this.intervalID);
                    this.intervalID = null;
                }
            }, 1000);
            return;
        }
        if (this.player && this.isPlaying[index]) {
            this.voiceStop();
            this.isPlaying[index] = false;
            this.setState({ isPlaying: this.isPlaying });
        } else {
            const tempIsPlaying = _.find(this.isPlaying, (item) => item == true);
            if (tempIsPlaying && tempIsPlaying != null) {
                if (this.player != null) {
                    this.player.stop();
                    this.player.release();
                }
                this.player = null;
                this.isPlaying[this.tempIndex] = false;
                this.setState({ isPlaying: this.isPlaying });
                this.player = new Audio(url, (error) => {
                    if (!error) {
                        this.isPlaying[index] = true;
                        this.setState({ isPlaying: this.isPlaying });
                        this.tempIndex = index;
                        this.player != null && this.player.play(() => {
                            this.player.release();
                            this.player = null;
                            this.isPlaying[index] = false;
                            this.setState({ isPlaying: this.isPlaying });
                        });
                    } else {
                        Toast('播放失败');
                    }
                });
            } else {
                this.player = new Audio(url, (error) => {
                    if (!error) {
                        this.isPlaying[index] = true;
                        this.setState({ isPlaying: this.isPlaying });
                        this.tempIndex = index;
                        this.player != null && this.player.play(() => {
                            this.player.release();
                            this.player = null;
                            this.isPlaying[index] = false;
                            this.setState({ isPlaying: this.isPlaying });
                        });
                    } else {
                        Toast('播放失败');
                    }
                });
            }
        }
        this.isPlayingIndex = index;
    },
    toggleSpeaker () {
        app.phoneMgr.toggleSpeaker();
        this.setState({ isSpeakerOn:app.phoneMgr.isSpeakerOn });
        if (this.state.isSpeakerOn) {
            Toast('已经为你切换到扬声器');
        } else {
            Toast('已经为你切换到听筒');
        }
    },
    showPayMessageBox () {
        this.setState({ overlayShowPayAidMessageBox: true });
    },
    // 征集话术详情
    DetailView () {
        let tempPrice = 0;
        const { imageArray, title, price, titleDec, audioArray } = this.state.kitDetail;
        if (price != undefined) {
            tempPrice = price.toFixed(2);
        }
        let TempImageArray = [];
        let surplusNum = 0;
        if (imageArray != undefined) {
            if (!this.state.isPay && this.props.tabIndex === 1) {
                if (imageArray.length == defaultNum) {
                    TempImageArray = _.slice(imageArray, 0, defaultNum);
                    surplusNum = defaultNum - 1;
                }
                if (imageArray.length > defaultNum) {
                    TempImageArray = _.slice(imageArray, 0, defaultNum);
                    surplusNum = imageArray.length - defaultNum;
                } else {
                    TempImageArray = imageArray;
                }
            } else {
                TempImageArray = imageArray;
            }
        }
        return (
            <View style={styles.containerAuto}>
                <View style={styles.titleContainer}>
                    <Text
                        numberOfLines={1}
                        style={[styles.titleText, { marginHorizontal:20 }]}>
                        {title && title}
                    </Text>
                </View>
                <View style={styles.detailContainer}>
                    <Text style={styles.contextTextTime}>
                        {this.props.tabIndex === 0 ? (this.state.startDate + '至' + this.state.endDate) : this.state.startDate}
                    </Text>
                    <View style={styles.deteContainer}>
                        <Text style={[styles.contextText, { fontSize: 13, fontWeight: '500', color: '#bf9f62' }]}>
                            {'主题介绍 '}
                        </Text>
                        <View style={styles.rightTitle}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.train_integral}
                                style={styles.iconCount}
                                />
                            <Text style={styles.rewardText}>
                                {this.props.type === 0 ? '悬赏 ' : '打赏 '}
                            </Text>
                            <Text style={[styles.describeText, { fontSize: 16 }]}>
                                {'¥ ' + tempPrice + '元'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.deteContainer1}>
                        <Text style={styles.contextText}>
                            {titleDec && titleDec}
                        </Text>
                    </View>
                    {
                        TempImageArray.length != 0 &&
                        <ScrollView horizontal style={styles.imageContainer}>
                            {
                                TempImageArray.map((item, i) => {
                                    return (
                                        <TouchableHighlight key={i} underlayColor='rgba(0, 0, 0, 0)' onPress={this.showBigImage.bind(null, TempImageArray, i)} style={styles.bigImageTouch}>
                                            <Image
                                                resizeMode='stretch'
                                                defaultSource={app.img.common_default}
                                                source={{ uri: item }}
                                                style={styles.imageStyle}
                                                />
                                        </TouchableHighlight>
                                    );
                                })
                            }
                            {
                                !this.state.isPay && this.props.tabIndex === 1 && surplusNum >= defaultNum ?
                                    <TouchableHighlight underlayColor='rgba(0, 0, 0, 0)' onPress={this.showPayMessageBox}>
                                        <View style={styles.showPayImage}>
                                            <Image
                                                resizeMode='stretch'
                                                defaultSource={app.img.actualCombat_empty}
                                                style={styles.imageIcon}
                                            />
                                            <Text style={styles.showPayText}>
                                                {'打赏后查看剩余 ' + surplusNum + ' 张相片'}
                                            </Text>
                                        </View>
                                    </TouchableHighlight> : null
                            }
                        </ScrollView>
                    }
                    <View style={styles.audioContainer}>
                        {
                            audioArray && audioArray.map((item, i) => {
                                return (
                                    <View key={i} style={styles.audioView}>
                                        <Text style={styles.audioTextContainer}>{item.whenLong + "''"}</Text>
                                        <TouchableHighlight
                                            onLongPress={this.toggleSpeaker}
                                            onPress={this.playVoice.bind(null, item.recordPath, i, item.whenLong)}
                                            style={styles.audioClick}>
                                            <View
                                                style={[styles.audioPlay, { backgroundColor: CONSTANTS.THEME_COLOR }]}>
                                                <Image resizeMode='stretch' source={this.state.isPlaying[i] ? app.img.actualCombat_voice_playing : app.img.actualCombat_voice_play} style={styles.imageVoice} />
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                );
                            })
                        }
                    </View>
                    {
                        this.props.tabIndex === 0 ?
                            <View style={styles.btnContainer}>
                                <Button
                                    onPress={this.goConfirm}
                                    textStyle={styles.btnText}
                                    style={styles.btnGo}>
                                    {'报名参加'}
                                </Button>
                            </View>
                        : null
                    }
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#EEEEEE',
        flexDirection: 'column',
    },
    containerAuto: {
        marginBottom: 25,
        backgroundColor: '#EEEEEE',
        flexDirection: 'column',
    },
    caseContainer: {
        width: sr.w,
        marginBottom: 35,
    },
    caseTitleContainer: {
        backgroundColor: CONSTANTS.THEME_COLOR,
        width: sr.w,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        backgroundColor: '#bf9f62',
        width: sr.w,
        height: 29,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
        alignSelf:'center',
    },
    detailContainer: {
        paddingTop: 5,
        paddingBottom: 10,
        backgroundColor: 'white',
    },
    deteContainer: {
        marginHorizontal: 20,
        marginTop:  3,
        flexDirection: 'row',
        width: sr.w - 20,
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    rightTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCount: {
        marginRight: 5,
        width: 12,
        height: 12,
    },
    rewardText: {
        fontSize: 12,
        fontWeight: '400',
        color: 'grey',
    },
    describeText: {
        fontWeight: '500',
        color: CONSTANTS.THEME_COLOR,
    },
    deteContainer1: {
        marginHorizontal: 10,
        width: sr.w - 20,
        justifyContent: 'center',
        marginTop: 8,
    },
    contextText: {
        fontSize: 14,
        color: '#666666',
    },
    contextTextTime: {
        fontSize: 11,
        color: '#555555',
        marginLeft: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        paddingVertical: 8,
        height: 116,
        backgroundColor: '#edeeef',
    },
    bigImageTouch: {
        flexDirection: 'row',
        width: 100,
        height: 100,
        marginLeft: 10,
    },
    imageIcon: {
        width: 45,
        height: 45,
    },
    imageStyle: {
        width: 100,
        height: 100,
    },
    showPayImage: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        marginLeft: 10,
        backgroundColor: '#FFFFFF',
    },
    showPayText: {
        alignSelf: 'center',
        fontSize: 11,
        color: '#666664',
        marginTop: 5,
        textAlign: 'center',
        width: 70,
    },
    audioContainer: {
        width: sr.w,
        marginTop: 3,
    },
    audioView: {
        marginBottom: 13,
        height: 32,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    audioClick: {
        height: 32,
        width: 70,
        marginRight: 10,
        borderRadius: 4,
    },
    audioTextContainer: {
        fontSize: 12,
        bottom: 14,
        color:'gray',
        marginRight: 10,
        alignSelf: 'flex-end',
    },
    audioPlay: {
        height: 32,
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderRadius: 4,
    },
    imageVoice:{
        width: 12,
        height:16,
        marginRight: 10,
    },
    lineView:{
        width: sr.w,
        height: 30,
        backgroundColor: 'red',
    },
    btnText: {
        fontSize: 14,
        fontWeight: '500',
    },
    btnGo: {
        width: 100,
        height: 35,
        borderRadius: 4,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#c1974b',
    },
    btnContainer: {
        height: 35,
        width: sr.w,
        alignItems: 'center',
    },
    inputContainer: {
        width: sr.w,
        height: 50,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: '#cbcccd',
    },
    textInput: {
        width: sr.w - 96,
        height:30,
        fontSize: 16,
        paddingVertical: -3,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
    },
    bottomInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputView: {
        marginLeft: 15,
        width: sr.w - 90,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    btnSend: {
        width: 50,
        height: 30,
        marginRight: 10,
        borderRadius: 4,
    },
    butText: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'center',
    },
});
