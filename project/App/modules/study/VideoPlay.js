'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    AppState,
    Image,
    StyleSheet,
    ScrollView,
    TextInput,
    AsyncStorage,
    Text,
    View,
    TouchableOpacity,
} = ReactNative;
const dismissKeyboard = require('dismissKeyboard');
const UmengMgr = require('../../manager/UmengMgr.js');
const VideoComment = require('./VideoComment.js');
const VideoRecommend = require('./VideoRecommend.js');
const VideoMenuPanel = require('./VideoMenuPanel.js');
const StudyAwardMessageBox = require('./StudyAwardMessageBox.js');
const TaskMessageBox = require('./TaskMessageBox.js');
const Draw = require('./Draw.js');
const Player = require('./Player.js');
const ShowMealBox = require('../package/ShowMealBox.js');
const FirstMessageBox = require('./FirstMessageBox.js');
const VideoTimeMgr = require('../../manager/VideoTimeMgr.js');
const TimerMixin = require('react-timer-mixin');

const { Button, DImage } = COMPONENTS;
const ITEM_NAME = 'DO_REFRESH_COMMENTS';

const VideoPlay = React.createClass({
    mixins: [SceneMixin, TimerMixin],
    statics: {
        color: '#000000',
        guideLayer: require('../guide/StudyGuide.js'),
        leftButton: { image: app.img.common_back2, handler: () => {
            app.scene.goBack(); } },
    },
    goBack () {
        this.stopVideoSaveTime();
        app.navigator.pop();
    },
    onWillFocus() {
        if (this.showDraw) {
            this.showDraw=false;
            this.setState({playing:true});
            this.getVideoTimeSeek();
        }
    },
    stopVideoSaveTime () {
        if (this.state.playing === false) {
            return;
        }
        this.playerPlay && this.playerPlay.stopPlayVideo();
        const videoUrl = this.props.videoInfo ? this.props.videoInfo.urlPlay : null;
        const time = this.playerPlay && this.playerPlay.getPlayTime();

        console.log('stop time is ', time, videoUrl);
        if (time && videoUrl) {
            VideoTimeMgr.setPlayTime(videoUrl, time);
        }
        this.setState({ playing:false });
    },
    getVideoTimeSeek () {
        const videoUrl = this.props.videoInfo ? this.props.videoInfo.urlPlay : null;
        if (videoUrl) {
            const time = VideoTimeMgr.getPlayTime(videoUrl);
            if (time > 0) {
                this.setTimeout(() => {
                    this.playerPlay && this.playerPlay.setLastPlayTime(time);
                    console.log('seek time is ', time, videoUrl);
                }, 60);
            }
        }
    },
    componentWillMount () {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
    },
    onWillHide () {
        if (this.props.isFromRecords) {
        } else {
            app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
        }
    },
    componentDidMount () {
        this.doUpdateClicks();
        AppState.addEventListener('change', this._handleAppStateChange);

        this.getVideoTimeSeek();
    },
    componentWillUnmount () {
        AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange: function (currentAppState) {
        if (currentAppState !== 'active') {
            this.fullScreenListener(false);
            this.stopVideoSaveTime();
        }else {
            if (!this.showDraw) {
                this.setState({playing:true});
                this.getVideoTimeSeek();
            }
        }
    },
    doUpdateClicks () {
        const param = {
            userID:this.state.personinfo.userID,
            videoID:this.props.videoInfo.videoID,
        };
        POST(app.route.ROUTE_UPDATECLICKS, param, this.doUpdateClicksSuccess);
    },
    doUpdateClicksSuccess (data) {
        if (data.success) {
            // 点击视频播放接口返回成功后通知列表更新点击数
            this.props.updateClickOrLikeNum && this.props.updateClickOrLikeNum({ videoID: this.props.videoInfo.videoID, type: 'click' });
        } else {
            Toast(data.msg);
        }
    },
    getInitialState () {
        this.showDraw=false;
        return {
            overlayShowStudyAward:false,
            overlayFirstMessageBox: false,
            isFullScreen: false,
            makePoint:0,
            personinfo: app.personal.info,
            ShowMealBox: false,
            boxTitle: 0,
            boxPoint: 0,
            isSendding: false,
            isChildComment: false,
            tempCommentID: 0,
            tempPublisherName: '',
            commentContent: '',
            scrollEnabled: true,
            playing: true,
        };
    },
    doCancle () {
        this.setState({ ShowMealBox: false });
    },
    toggleMenuPanel () {
        if (!this.state.overlayShowTask) {
            const param = {
                userID:this.state.personinfo.userID,
            };
            POST(app.route.ROUTE_GET_TASK_INTEGRATION, param, this.doGetTaskIntegrationSuccess, true);
        }
    },
    doGetTaskIntegrationSuccess (data) {
        if (data.success) {
            const taskList = data.context.taskList || [];
            this.setState({ taskList: taskList, overlayShowTask:true });
        } else {
            Toast(data.msg);
        }
    },
    onComplete () {
        this.getWatchVideoReward();
    },
    doClose () {
        this.setState({ overlayShowStudyAward:false });
    },
    doCloseFirst () {
        this.setState({ overlayFirstMessageBox:false });
    },
    doCloseTask () {
        this.setState({ overlayShowTask:false });
    },
    doGetRewardList () {
        const param = {
            userID:this.state.personinfo.userID,
        };
        POST(app.route.ROUTE_GET_REWARD_LIST, param, this.doGetRewardListSuccess, true);
    },
    doGetRewardListSuccess (data) {
        this.setState({ overlayShowStudyAward:false });
        this.showDraw=true;
        this.stopVideoSaveTime();
        app.navigator.push({
            component: Draw,
            passProps: { rewardBackImg:data.context.rewardImg, costCoin:data.context.consMarsCoin },
        });
    },
    doDraw () {
        this.doGetRewardList();
    },
    doShareCallVideo(){
        if (this.state.playing === false) {
            return;
        }
        this.playerPlay && this.playerPlay.stopPlayVideo();
        const videoUrl = this.props.videoInfo ? this.props.videoInfo.urlPlay : null;
        const time = this.playerPlay && this.playerPlay.getPlayTime();

        console.log('stop time is ', time, videoUrl);
        if (time && videoUrl) {
            VideoTimeMgr.setPlayTime(videoUrl, time);
        }
    },
    doShare (makePoint) {
        this.setState({ overlayShowStudyAward:false });
        const name = '亲爱' + app.personal.info.name + '同志';
        const percentage = makePoint > 0 ? ('获得赢销积分+' + makePoint + '分') : '';
        const encourage = makePoint > 0 ? '并且获得一次抽奖机会' : '获得一次抽奖机会';
        const desc = name + percentage + encourage;
        const data = 'name=' + name + '&logo=' + app.personal.info.headImg + '&percentage=' + percentage + '&encourage=' + encourage;
        const dataEncode = encodeURI(data);
        UmengMgr.doActionSheetShare(CONSTANTS.SHARE_SHAREDIR_SERVER + 'shareStudyAndCompletion.html?' + dataEncode, '积分奖励', desc, 'web', this.props.videoInfo.urlImg, this.doShareCallback);
    },
    doShareCallback () {
        const param = {
            userID:this.state.personinfo.userID,
            shareType:1, // 0-分享视频 1-分享抽奖 2-分享战果
            keyword:'一次抽奖机会',
        };
        POST(app.route.ROUTE_DO_SHARE, param, this.doShareSuccess);
    },
    doShareSuccess (data) {
        Toast(data.msg);
    },
    doPayConfirm () {
        app.navigator.push({
            title: '套餐',
            component: require('../package/PackageList.js'),
        });
        this.setState({ ShowMealBox: false });
    },
    fullScreenListener (isFullScreen) {
        this.setState({ scrollEnabled: !isFullScreen });
        app.toggleNavigationBar(!isFullScreen);
        this.setState({ isFullScreen });
        app.GlobalVarMgr.setItem('isFullScreen', isFullScreen);
    },
    getWatchVideoReward () {
        const param = {
            userID:this.state.personinfo.userID,
            videoID:this.props.videoInfo.videoID,
        };
        POST(app.route.ROUTE_WATCH_VIDEO, param, this.getWatchVideoRewardSuccess, true);
    },
    getWatchVideoRewardSuccess (data) {
        dismissKeyboard();
        if (data.success) {
            const personInfo = app.personal.info;
            this.setState({ makePoint:data.context.makePoint, overlayShowStudyAward:true });
            personInfo.integral += data.context.makePoint;
            app.personal.set(personInfo);
            // 增加学习课程数量,用于首页显示
            app.studyNumMgr.addStudyNum(this.props.videoInfo.videoID);
        } else {
            Toast(data.msg);
        }
    },
    doRestart (obj) {
        this.stopVideoSaveTime();
        if (app.personal.info.userType == '0' && obj.isFree != 1) {
            this.setState({ ShowMealBox: true });
            return;
        }
        if (app.personal.info.userType == '1' && obj.isFree != 1) {
            if (_.find(app.personal.info.validVideoList, (item) => item == obj.videoID)) {
                app.navigator.replace({
                    title: obj.name,
                    component: VideoPlay,
                    passProps: { videoInfo:obj },
                });
                return;
            }
            this.setState({ ShowMealBox: true });
            return;
        }
        app.navigator.replace({
            title: obj.name,
            component: VideoPlay,
            passProps: { videoInfo:obj },
        });
    },
    // 通过回调得到点赞成功改变数量显示
    updateHeart (videoID) {
        this.props.updateClickOrLikeNum && this.props.updateClickOrLikeNum({ videoID: videoID, type: 'heart' });
    },
    updatePoint (boxTitle, boxPoint) {
        this.setState({ boxTitle:boxTitle, boxPoint:boxPoint });
        this.setState({ overlayFirstMessageBox:true });
    },
    updatePointCom (boxTitle, boxPoint) {
        this.setState({ boxTitle:boxTitle, boxPoint:boxPoint });
        this.setState({ overlayFirstMessageBox:true });
    },
    doSubmitComment () {
        dismissKeyboard();
        if (this.state.commentContent === '') {
            Toast('请提交感悟信息');
            return;
        }
        if (!this.state.isSendding) {
            Toast('正在发送感悟...');
            this.setState({ isSendding: true });
        // 为true子评论，为false评论
            if (this.state.isChildComment) {
                const param = {
                    userID:app.personal.info.userID,
                    videoID:this.props.videoInfo.videoID,
                    commentID:this.state.tempCommentID,
                    comment:this.state.commentContent,
                };
                POST(app.route.ROUTE_SUBMIT_SON_COMMENT, param, this.doSubmitSonCommentSuccess);
            } else {
                const param = {
                    userID: app.personal.info.userID,
                    videoID:this.props.videoInfo.videoID,
                    comment:this.state.commentContent,
                };
                POST(app.route.ROUTE_SUBMIT_COMMENT, param, this.submitCommentSuccess);
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
        // 更新积分
            info.integral += data.context.integral;
            app.personal.set(info);
            Toast('发表感悟成功');
            this.commentList.doRefresh(curComment);
            if (data.context.integral !== 0) {
                this.updatePointCom('感悟', data.context.integral);
            }
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
    render () {
        const videoInfo = this.props.videoInfo;
        return (
            <View style={styles.container}>
                <ScrollView scrollEnabled={this.state.scrollEnabled}>
                {
                    this.state.playing &&
                    <Player
                        ref={(ref) => { this.playerPlay = ref; }}
                        uri={videoInfo.urlPlay}
                        fullScreenListener={this.fullScreenListener}
                        onComplete={this.onComplete}
                    />
                }
                {
                    !this.state.isFullScreen &&
                    <View style={styles.container}>
                        <VideoMenuPanel
                            data={videoInfo}
                            noticeShow={this.updateHeart}
                            doShareCallVideo={this.doShareCallVideo}
                            noticeShowBox={this.updatePoint} />
                        <VideoRecommend
                            doRestart={this.doRestart}
                            data={videoInfo} />
                    </View>
                }
                </ScrollView>
                {
                // !this.state.isFullScreen &&
                // <View style={styles.inputContainer}>
                //     <View style={styles.bottomInput}>
                //         <View style={styles.inputView}>
                //             <TextInput
                //                 ref={(ref)=>{this.commentInput = ref}}
                //                 onBlur={this.onBlur}
                //                 onChangeText={(text) => this.setState({commentContent: text})}
                //                 defaultValue={this.state.commentContent}
                //                 placeholder={this.state.isChildComment?("回复"+this.state.tempPublisherName+"："):"有什么感想快来说说吧"}
                //                 style={styles.textInput}/>
                //         </View>
                //         <Button
                //             onPress={this.doSubmitComment}
                //             style={styles.btnSend}
                //             textStyle={styles.butText}>
                //             发送
                //         </Button>
                //     </View>
                // </View>
            }
                {
                this.state.overlayShowStudyAward &&
                <StudyAwardMessageBox
                    makePoint={this.state.makePoint}
                    doClose={this.doClose}
                    doDraw={this.doDraw}
                    doShare={this.doShare} />
            }
                {
                this.state.overlayFirstMessageBox &&
                <FirstMessageBox
                    point={this.state.boxPoint}
                    doCloseFirst={this.doCloseFirst}
                    title={this.state.boxTitle} />
            }
                {
                this.state.overlayShowTask &&
                <TaskMessageBox
                    taskList={this.state.taskList}
                    doCloseTask={this.doCloseTask} />
            }
                {
                this.state.ShowMealBox &&
                <ShowMealBox
                    doConfirm={this.doPayConfirm}
                    doCancle={this.doCancle} />
            }
            </View>
        );
    },
});
module.exports = VideoPlay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE',
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
