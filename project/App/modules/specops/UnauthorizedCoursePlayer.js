'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    AppState,
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    Animated,
} = ReactNative;

const SpecopsVideoMenuPanel = require('./SpecopsVideoMenuPanel.js');
const SpecopsHistoryVideo = require('./SpecopsHistoryVideo.js');
const ShareHomework = require('./ShareHomework.js');
const Player = require('../study/Player.js');
const VideoTimeMgr = require('../../manager/VideoTimeMgr.js');
const VideoCollect = require('./VideoCollectBox.js');
const ClassTest = require('./ClassTest.js');
const JoinSpecopsMessageBox = require('./JoinSpecopsMessageBox.js');
const PaySpecopsMessageBox = require('./PaySpecopsMessageBox.js');
const moment = require('moment');
const TimerMixin = require('react-timer-mixin');
const LocalDataMgr = require('../../manager/LocalDataMgr.js');

const { StarBar, Button, DImage, MessageBox } = COMPONENTS;

const CoursePlayer = React.createClass({
    mixins: [TimerMixin],
    statics: {
        title: '课程学习',
        leftButton: { handler: () => { app.scene.goBack(); } },
    },
    getInitialState () {
        this.detailsMap = {};// 作业相关内容
        let taskNum = 0;
        if (this.props.lastStudyProgress) {
            const { isWatchVideo, isOverTest, isOverTask, isTaskShare } = this.props.lastStudyProgress;
            taskNum = 4 - (isWatchVideo + isOverTest + isOverTask + isTaskShare);
        }
        return {
            isFullScreen: false,
            pageData: null,
            playing: false,
            currentAppState:'',
            scrollEnabled: true,
            lineHeight: 0,
            isLookAll: false,
            showVideoFinishBox: (taskNum >= 1 && this.props.lastStudyProgress.isWatchVideo === 1) || false,
            taskNum: taskNum,
            studyProgressDetail: this.props.lastStudyProgress,
            showMessageBox:false,
            showPromptBox: false,
            showJoinSpecopsBox: false,
        };
    },
    componentDidMount () {
        this.isStarting = false;
        this.videoArray = [];
        this.getSpecopsVideoData(this.props.otherVideoID);
        if (this.props.otherVideoID) {
            this.updateStudyProgress(this.props.otherVideoID);// 这里调用该接口只做学习进度更新数据 不做其他状态控制
        }
        AppState.addEventListener('change', this._handleAppStateChange);
        setTimeout(() => {
            this.doClosePrompt();
        }, 5000);

        const showTime = LocalDataMgr.getValueFromKey('showJoinSpecopsBox');
        if (showTime == null || showTime != moment().format('YYYY-MM-DD')) {
            this.setState({ showJoinSpecopsBox: true });
            LocalDataMgr.setValueAndKey('showJoinSpecopsBox', moment().format('YYYY-MM-DD'));
        }
    },
    goBack () {
        this.stopVideoSaveTime();
        app.personal.updateSpecopsTask();
        if (this.props.isCourseRecord) {
            app.navigator.pop();
            this.props.refreshProgress && this.props.refreshProgress();
        } else {
            app.navigator.pop();
        }
    },
    componentWillUnmount () {
        this.stopVideoSaveTime();
        AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange: function (currentAppState) {
        this.setState({ currentAppState });
        if (currentAppState === 'active') {
            // this.playerPlay && this.playerPlay.stopPlayVideo();
        } else {
            this.stopVideoSaveTime();
            this.fullScreenListener(false);
        }
    },
    onWillFocus () {
        const { videoID } = this.state.pageData;
        this.updateHomework(videoID);
        this.updateStudyProgress(videoID);// 这里调用该接口只做学习进度更新数据 不做其他状态控制
    },
    updateStudyProgress (videoID) {
        const param = {
            userID:app.personal.info.userID,
            videoID: videoID,
        };
        POST(app.route.ROUTE_STUDY_PROGRESS, param, this.updateStudyProgressSuccess);
    },
    updateStudyProgressSuccess (data) {
        if (data.success) {
            const { isWatchVideo, isOverTest, isOverTask, isTaskShare } = data.context;
            const taskNum = 4 - (isWatchVideo + isOverTest + isOverTask + isTaskShare);
            if (!taskNum) {
                this.setState({ showVideoFinishBox: false });
            } else {
                this.setState({ studyProgressDetail: data.context, taskNum });
            }
        } else {
            Toast(data.msg);
        }
    },
    stopVideoSaveTime () {
        if (this.state.playing === false) {
            return;
        }
        this.playerPlay && this.playerPlay.stopPlayVideo();
        const videoUrl = this.state.pageData ? this.state.pageData.urlPlay : null;
        const time = this.playerPlay && this.playerPlay.getPlayTime();

        console.log('stop time is ', time, videoUrl);
        if (time && videoUrl) {
            VideoTimeMgr.setPlayTime(videoUrl, time);
        }
        this.setState({ playing:false });
    },
    getVideoTimeSeek () {
        const { showVideoFinishBox } = this.state;
        if (!showVideoFinishBox && !this.props.update) {
            this.setState({ playing: true });
        }
        const videoUrl = this.state.pageData ? this.state.pageData.urlPlay : null;
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
    getSpecopsVideoData (otherVideoID) {
        const param = {
            userID: app.personal.info.userID,
            otherVideoID,
        };
        POST(app.route.ROUTE_SPECIAL_SOLDIER_VIDEO, param, this.getSpecopsVideoDataSuccess, this.getSpecopsVideoDataError, true);
    },
    getSpecopsVideoDataSuccess (data) {
        if (data.success) {
            this.detailsMap['taskContent'] = data.context.taskContent || '';
            this.detailsMap['taskID'] = data.context.taskID || '';
            this.detailsMap['userTaskID'] = data.context.userTaskID || '';
            this.detailsMap['videoID'] = data.context.videoID || '';
            this.detailsMap['taskName'] = data.context.taskName || '';
            this.videoArray = data.context.watchVideoList;
            this.setState({ pageData: data.context });
            this.doUpdateClicks(data.context.videoID);
            this.getVideoTimeSeek();
            if (this.props.update) {
                this.upDateCurrentView(this.props.otherVideoID, this.props.newSee, this.props.lastSee);
            }
        } else {
            // 防止获取数据失败后点击内容交互时崩溃问题
            app.navigator.pop();
            if (this.props.isCourseRecord) {
                this.props.refreshProgress();
            }
            Toast(data.msg);
        }
    },
    getSpecopsVideoDataError () {
        // 防止获取数据失败后点击内容交互时崩溃问题
        app.navigator.pop();
        if (this.props.isCourseRecord) {
            this.props.refreshProgress();
        }
    },
    doUpdateClicks () {
        if (this.state.pageData != null) {
            const param = {
                userID:app.personal.info.userID,
                videoID:this.state.pageData.videoID,
            };
            POST(app.route.ROUTE_UPDATECLICKS, param, this.doUpdateClicksSuccess);
        }
    },
    doUpdateClicksSuccess (data) {
        const { showVideoFinishBox, studyProgressDetail } = this.state;
        if (showVideoFinishBox) {
            this.setState({ playing: false });
        } else {
            // this.setState({playing: true});
        }
        if (data.success) {
            // 点击视频播放接口返回成功后通知列表更新点击数
            this.props.updateClickOrLikeNum && this.props.updateClickOrLikeNum({ videoID: this.state.pageData.videoID, type: 'click' });
        } else {
            Toast(data.msg);
        }
    },
    fullScreenListener (isFullScreen) {
        this.setState({ scrollEnabled: !isFullScreen });
        app.toggleNavigationBar(!isFullScreen);
        this.setState({ isFullScreen });
        app.GlobalVarMgr.setItem('isFullScreen', isFullScreen);
    },
    onEnd () {
        this.fullScreenListener(false);
        this.stopVideoSaveTime();
        if (this.isStarting) {
            const { videoID } = this.state.pageData;
            this.backEndVideoReward(videoID);
            this.getWatchVideoReward(videoID);
            this.isStarting = false;
        }
        setTimeout(() => {
            if (this.state.pageData && this.state.pageData.isNextVideo == 0) {
                this.setState({ showJoinSpecopsBox: true });
                LocalDataMgr.setValueAndKey('showJoinSpecopsBox', moment().format('YYYY-MM-DD'));
            }
        }, 200);
    },
    onLoaded (duration) {
        if (!this.isStarting) {
            this.isStarting = true;
        }
    },
    backEndVideoReward (videoID) {
        const param = {
            userID:app.personal.info.userID,
            videoID: videoID,
        };
        POST(app.route.ROUTE_END_VIDEO, param, this.backEndVideoRewardSuccess.bind(null, videoID), true);
    },
    backEndVideoRewardSuccess (videoID, data) {
        if (data.success) {
            this.getStudyProgress(videoID);
        }
    },
    getWatchVideoReward (videoID) {
        const param = {
            userID:app.personal.info.userID,
            videoID:videoID,
        };
        POST(app.route.ROUTE_WATCH_VIDEO, param, (data) => { console.log(data); });
    },
    getStudyProgress (videoID) {
        const param = {
            userID:app.personal.info.userID,
            videoID: videoID,
        };
        POST(app.route.ROUTE_STUDY_PROGRESS, param, this.getStudyProgressSuccess);
    },
    getStudyProgressSuccess (data) {
        if (data.success) {
            const { isWatchVideo, isOverTest, isOverTask, isTaskShare } = data.context;
            const taskNum = 4 - (isWatchVideo + isOverTest + isOverTask + isTaskShare);
            if (taskNum >= 1) {
                this.state.showVideoFinishBox = true;
                this.stopVideoSaveTime();
            } else {
                this.state.showVideoFinishBox = false;
                if (this.state.pageData.isNextVideo) {
                    this.getSpecopsVideoData();
                }
            }
            this.setState({ studyProgressDetail: data.context, taskNum });
        } else {
            Toast(data.msg);
        }
    },
    // 通过回调得到点赞成功改变显示
    updateHeart (videoID, praiseOrCollection) {
        if (videoID == this.state.pageData.videoID) {
            if (praiseOrCollection === 'isPraise') {
                // 点击视频播放接口返回成功后通知列表更新点击数
                this.props.updateClickOrLikeNum && this.props.updateClickOrLikeNum({ videoID: this.state.pageData.videoID, type: 'heart' });
                this.state.pageData.isPraise = 0;
                this.state.pageData.likes += 1;
            } else if (praiseOrCollection === 'isCollection') {
                this.setState({ showCollectBox: true });
                this.state.pageData.isCollection = 0;
                this.state.pageData.collections += 1;
            } else if (praiseOrCollection === 'subCollection') {
                this.setState({ showCollectBox: false });
                this.state.pageData.isCollection = 1;
                this.state.pageData.collections -= 1;
                if (this.state.pageData.collections <= 0) {
                    this.state.pageData.collections = 0;
                }
            }
            this.setState({ pageData: this.state.pageData });
        }
    },
    updatePoint (boxTitle, boxPoint) {
        // this.setState({boxTitle:boxTitle,boxPoint:boxPoint, overlayFirstMessageBox:true});
    },
    goCourseTestPage () {
        this.stopVideoSaveTime();
        const tempTitle = this.state.studyProgressDetail && this.state.studyProgressDetail.isOverTest ? '完成测试' : '随堂测试';
        // 进入随堂测试页面
        app.navigator.push({
            component: ClassTest,
            title: tempTitle,
            passProps: {
                videoId: this.state.pageData.videoID,
                isFromMainPage: false,
                name: this.state.pageData.name,
            },
        });
    },
    updateHomework (videoID) {
        const param = {
            userID: app.personal.info.userID,
            otherVideoID:videoID,
        };
        POST(app.route.ROUTE_SPECIAL_SOLDIER_VIDEO, param, this.updateHomeworkSuccess, true);
    },
    updateHomeworkSuccess (data) {
        if (data.success) {
            this.detailsMap['taskContent'] = data.context.taskContent || '';
            this.detailsMap['taskID'] = data.context.taskID || '';
            this.detailsMap['userTaskID'] = data.context.userTaskID || '';
            this.detailsMap['videoID'] = data.context.videoID || '';
        } else {
            Toast(data.msg);
        }
    },
    goHomeworkPage () {
        this.stopVideoSaveTime();
        // 进入课后作业页面
        app.navigator.push({
            component: ShareHomework,
            passProps: {
                data:this.detailsMap,
            },
        });
    },
    goVideoListPage () {
        this.stopVideoSaveTime();
        let { routeIndex } = this.props;
        routeIndex = (routeIndex === undefined) ? app.navigator.getCurrentRoutes().length - 1 : routeIndex;
        app.navigator.push({
            title: '特种兵视频列表',
            component: SpecopsHistoryVideo,
            passProps: { doRestart:this.doRestart, videoList:this.state.pageData.watchVideoList, routeIndex },
        });
    },
    doRestart (obj, rowID, routeIndex) {
        this.stopVideoSaveTime();
        const { watchVideoList } = this.state.pageData;
        const index = rowID == 0 ? 1 : watchVideoList.length - 1 == rowID ? rowID : parseInt(rowID) + 1;
        if (!obj.isOver && !watchVideoList[index].isOver) {
            Toast('请按顺序把前面未看完的视频完整看完后，才能按顺序解锁下一集视频哦！');
            return;
        }
        app.navigator.replace({
            title: '课程学习',
            component: CoursePlayer,
            passProps: { otherVideoID: obj.videoID, routeIndex },
        });
    },
    upDateCurrentView (videoID, newSee, lastSee) {
        if (newSee < lastSee) {
            this.setState({ showMessageBox:true });
        } else {
            app.navigator.replace({
                title: '课程学习',
                component: CoursePlayer,
                passProps: { otherVideoID: videoID },
            });
        }
    },
    doLookAll () {
        this.setState({ isLookAll: !this.state.isLookAll });
    },
    _measureLineHeight (e) {
        if (!this.state.lineheight) {
            const { height } = e.nativeEvent.layout;
            this.setState({ lineHeight: height + 26 });
        }
    },
    doNextVideo () {
        this.state.showVideoFinishBox = false;
        this.getSpecopsVideoData();
    },
    changePlaying () {
        this.getVideoTimeSeek();
    },
    doStudyWork (btnTitle) {
        if (btnTitle === '随堂测试') {
            const tempTitle = this.state.studyProgressDetail && this.state.studyProgressDetail.isOverTest ? '完成测试' : '随堂测试';
            app.navigator.push({
                component: ClassTest,
                title: tempTitle,
                passProps: {
                    videoId: this.state.pageData.videoID,
                    name: this.state.pageData.name,
                },
            });
        } else {
            app.navigator.push({
                component: ShareHomework,
                passProps: {
                    data:this.detailsMap,
                },
            });
        }
    },
    doClose () {
        this.setState({ showVideoFinishBox: false });
    },
    doClosePrompt () {
        this.setState({ showPromptBox: true });
    },
    doPayByWechat () {
        this.onBuySuccess();
    },
    doPayByAlipay () {
        this.onBuySuccess();
    },
    onBuySuccess () {
        app.closeModal();
        this.props.setAuthorized();
        Toast('恭喜你成为特种兵');
    },
    getBtnTitle () {
        const { studyProgressDetail } = this.state;
        if (!studyProgressDetail.isOverTest) {
            return '随堂测试';
        } else if (studyProgressDetail.isOverTest && !studyProgressDetail.isOverTask) {
            return '课后作业';
        } else {
            return '作业分享';
        }
    },
    render () {
        const { urlPlay, urlImg } = this.state.pageData || {};
        const { isAgent, isSpecialSoldier } = app.personal.info;
        const { studyProgressDetail, isLookAll, taskNum, showVideoFinishBox, showPromptBox } = this.state;
        return (
            <View style={this.state.isFullScreen ? styles.fullContainer : styles.container}>
                {
                    this.state.playing ?
                        <View style={styles.playerView}>
                            <Player
                                ref={(ref) => { this.playerPlay = ref; }}
                                uri={urlPlay}
                                fullScreenListener={this.fullScreenListener}
                                onEnd={this.onEnd}
                                onLoaded={this.onLoaded}
                            />
                            {
                            !showPromptBox &&
                            <View style={styles.promptViewContainer}>
                                <View style={styles.promptView}>
                                    <Text style={styles.promptText}>{'您可免费观看3集'}</Text>
                                </View>
                                <TouchableHighlight
                                    onPress={this.doClosePrompt}
                                    underlayColor='rgba(0, 0, 0, 0)'
                                    style={styles.touchCloseView}>
                                    <Image
                                        resizeMode='contain'
                                        source={app.img.draw_back}
                                        style={styles.closePrompt} />
                                </TouchableHighlight>
                                <View style={styles.talkBubbleTriangle} />
                            </View>
                        }
                        </View> :
                        <DImage
                            resizeMode='stretch'
                            defaultSource={app.img.common_default}
                            source={urlImg ? { uri: urlImg } : app.img.common_default}
                            style={styles.playerContainer}>
                            <TouchableOpacity
                                style={styles.video_icon_container}
                                onPress={this.changePlaying}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.specops_play}
                                    style={styles.video_icon} />
                            </TouchableOpacity>
                        </DImage>
                }
                {
                    (this.state.showVideoFinishBox && studyProgressDetail) &&
                    <Animated.View style={styles.backViewContainer}>
                        <View style={styles.panelContainer}>
                            <View style={styles.overlayContainer}>
                                <Text style={styles.studyAwardTitle}>{'恭喜你'}</Text>
                                <Text style={styles.studyAwardTitle}>{'完成了本周视频学习'}</Text>
                                <Text style={styles.studyAwardTitle2}>{`${studyProgressDetail.studyProgress}%`}</Text>
                                <Text style={styles.studyAwardTitle3}>{'当前特种兵任务进度'}</Text>
                                <View style={styles.studyBtnView}>
                                    <Text style={styles.studyAwardTitle4}>{'还差'}</Text>
                                    <Text style={styles.studyAwardTitle41}>{taskNum}</Text>
                                    <Text style={styles.studyAwardTitle4}>{'项你就可以完成本周特种兵任务了'}</Text>
                                </View>
                                <View style={styles.studyBtnView}>
                                    <Button
                                        onPress={this.doStudyWork.bind(null, this.getBtnTitle())}
                                        style={styles.studyTaskBtn}
                                        textStyle={styles.studyTaskText}>{this.getBtnTitle()}</Button>
                                    {
                                        this.state.pageData && this.state.pageData.isNextVideo === 1 &&
                                        <Button
                                            onPress={this.doNextVideo}
                                            style={styles.studyNextBtn}
                                            textStyle={styles.studyNextText}>跳过，看下一集</Button>
                                    }
                                </View>
                            </View>
                            <TouchableHighlight
                                onPress={this.doClose}
                                underlayColor='rgba(0, 0, 0, 0)'
                                style={styles.touchableHighlight}>
                                <Image
                                    resizeMode='contain'
                                    source={app.img.draw_back}
                                    style={styles.closeIcon} />
                            </TouchableHighlight>
                        </View>
                    </Animated.View>
                }
                <ScrollView style={styles.pageContainer} scrollEnabled={this.state.scrollEnabled}>
                    {
                    !this.state.isFullScreen &&
                    <View style={styles.personCtainer}>
                        <SpecopsVideoMenuPanel
                            data={this.state.pageData}
                            noticeShow={this.updateHeart}
                            noticeShowBox={this.updatePoint} />
                    </View>
                }
                    {
                    !this.state.isFullScreen &&
                    <View style={styles.courseSynopsisStyle}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleTypeText}>课程介绍</Text>
                        </View>
                        <View style={styles.divisionCrossLine} />
                        <View style={[styles.synopsisStyle, { height: this.state.lineHeight }]}>
                            <Text onLayout={this._measureLineHeight} numberOfLines={isLookAll ? 200 : 6} style={styles.synopsisText}>
                                {this.state.pageData && (app.isandroid ? '        ' : '\t') + this.state.pageData.detail}
                            </Text>
                            {
                                !isLookAll &&
                                <Image resizeMode='stretch' source={app.img.specops_mask} style={[styles.maskImage, { height: (this.state.lineHeight) / 2 }]} />
                            }
                            <TouchableOpacity onPress={this.doLookAll} style={styles.lookAllStyle}>
                                <Text style={styles.lookAllText}>{isLookAll ? '收起内容' : '查看全部'}</Text>
                                <Image resizeMode='contain' source={isLookAll ? app.img.specops_up : app.img.specops_down} style={styles.iconStyle} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                    {
                    !this.state.isFullScreen &&
                    <View style={styles.studyTaskStyle}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleTypeText}>课程学习任务</Text>
                        </View>
                        <View style={styles.divisionCrossLine} />
                        <View style={styles.entranceStyle}>
                            <TouchableOpacity onPress={this.goCourseTestPage} style={styles.homeworkStyle}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.specops_course_test}
                                    style={styles.entranceImage} />
                                <Text style={styles.entranceText}>随堂测试</Text>
                            </TouchableOpacity>
                            <View style={styles.divisionVerticalLine} />
                            <TouchableOpacity onPress={this.goHomeworkPage} style={styles.homeworkStyle}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.specops_homework}
                                    style={styles.entranceImage} />
                                <Text style={styles.entranceText}>课后作业</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                    {
                    (!this.state.isFullScreen && this.state.pageData) &&
                    <View style={styles.listContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleTypeText}>特种兵视频列表</Text>
                        </View>
                        <View style={styles.divisionCrossLine} />
                        <SpecopsHistoryVideo briefDisplay doRestart={this.doRestart} videoList={this.state.pageData.watchVideoList} />
                        <TouchableOpacity onPress={this.goVideoListPage} style={styles.btnContainer}>
                            <Text style={styles.btnTypeText}>查看全部</Text>
                        </TouchableOpacity>
                    </View>
                }
                </ScrollView>
                {
                    this.state.showCollectBox &&
                    <VideoCollect
                        doCancel={() => this.setState({ showCollectBox: false })} />
                }
                {
                    this.state.showMessageBox &&
                    <MessageBox
                        content='请按顺序把前面未看完的视频完整看完后，才能按顺序解锁下一集视频哦！'
                        doConfirm={() => {
                            this.setState({ showMessageBox:false });
                            app.navigator.replace({
                                title: '课程学习',
                                component: CoursePlayer,
                            });
                        }}
                        />
                }
                {
                    this.state.showJoinSpecopsBox &&
                    <JoinSpecopsMessageBox
                        doClose={() => this.setState({ showJoinSpecopsBox:false })}
                        doConfirm={() => {
                            this.setState({ showJoinSpecopsBox:false });
                            app.showModal(
                                <PaySpecopsMessageBox
                                    doPayByWechat={this.doPayByWechat}
                                    doPayByAlipay={this.doPayByAlipay}
                                    doClose={() => app.closeModal}
                                />
                            );
                        }}
                    />
                }
            </View>
        );
    },
});
module.exports = CoursePlayer;

const styles = StyleSheet.create({
    panelContainer: {
        width: sr.w,
        height: sr.w * 2 / 3,
        alignItems:'center',
        justifyContent:'center',
    },
    playerView: {
        width: sr.w,
        height: sr.w * 2 / 3,
    },
    overlayContainer: {
        alignItems:'center',
        justifyContent:'center',
        width: sr.w - 40,
        height: sr.w * 2 / 3 - 40,
        backgroundColor: 'white',
        opacity: 255,
    },
    backViewContainer: {
        position:'absolute',
        top: 0,
        width: sr.w,
        height: sr.w * 2 / 3,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'transparent',
    },
    studyAwardTitle: {
        color: 'black',
        fontSize: 16,
        backgroundColor: 'transparent',
        fontWeight: '600',
        fontFamily:'STHeitiSC-Medium',
    },
    studyAwardTitle2: {
        color: '#FB6568',
        fontSize: 20,
        backgroundColor: 'transparent',
        fontWeight: '600',
        fontFamily:'STHeitiSC-Medium',
    },
    studyAwardTitle3: {
        color: '#666666',
        fontSize: 12,
        backgroundColor: 'transparent',
        fontFamily:'STHeitiSC-Medium',
    },
    studyAwardTitle4: {
        color: '#444444',
        fontSize: 14,
        backgroundColor: 'transparent',
        fontFamily:'STHeitiSC-Medium',
    },
    studyAwardTitle41: {
        color: '#FB6568',
        fontSize: 14,
        backgroundColor: 'transparent',
        fontFamily:'STHeitiSC-Medium',
    },
    studyTextView:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
    },
    studyBtnView:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
    },
    studyTaskBtn: {
        marginRight: 20,
        height: 34,
        width: 130,
        marginTop: 15,
        backgroundColor:'#FB6568',
        borderRadius: 4,
    },
    studyNextBtn: {
        height: 34,
        width: 130,
        marginTop: 15,
        backgroundColor:'white',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#FB6568',
    },
    studyTaskText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    studyNextText: {
        color: '#FB6568',
        fontSize: 14,
        fontWeight: '500',
    },
    touchableHighlight: {
        position:'absolute',
        top:5,
        right:5,
        width: 38,
        height: 38,
    },
    closeIcon: {
        width: 38,
        height: 38,
    },
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    fullContainer: {
        width: sr.w,
        height: sr.fh,
        backgroundColor: '#EEEEEE',
    },
    pageContainer: {
        flex: 1,
    },
    playerContainer: {
        width: sr.w,
        height: sr.w * 2 / 3,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'white',
    },
    video_icon_container: {
        height: 65,
        width: 65,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems:'center',
    },
    video_icon: {
        height: 65,
        width: 65,
    },
    promptViewContainer: {
        width: 140,
        height: 60,
        left: 0,
        bottom: 40,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    promptView: {
        width: 120,
        height: 35,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    promptText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily: 'STHeitiSC-Medium',
    },
    touchCloseView: {
        width: 25,
        height: 25,
        right: 0,
        top: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closePrompt: {
        width: 15,
        height: 15,
    },
    talkBubbleTriangle: {
        position: 'absolute',
        left: 25,
        bottom: 3,
        width: 0,
        height: 0,
        borderTopColor: 'transparent',
        borderTopWidth: 10,
        borderRightWidth: 12,
        borderRightColor: 'rgba(0,0,0,0.9)',
        borderBottomWidth: 5,
        borderBottomColor: 'transparent',
        transform: [
            { rotate: '155deg' },
        ],
    },
    personCtainer: {
        width: sr.w,
        backgroundColor: '#FFFFFF',
    },
    courseSynopsisStyle: {
        width: sr.w,
        marginTop: 7,
        backgroundColor: '#FFFFFF',
    },
    synopsisStyle: {
        width: sr.w,
        marginTop: 15,
        marginBottom: 8,
    },
    synopsisText: {
        width: sr.w - 48,
        marginLeft: 24,
        fontSize: 16,
        color: '#151515',
        fontFamily: 'STHeitiSC-Medium',
    },
    maskImage: {
        width: sr.w,
        bottom: 20,
        left: 0,
        position: 'absolute',
    },
    lookAllStyle: {
        width: 100,
        height: 20,
        bottom: 0,
        left: sr.w / 2 - 50,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    lookAllText: {
        fontSize: 14,
        color: '#45B0F7',
        fontFamily: 'STHeitiSC-Medium',
    },
    iconStyle: {
        width: 11,
        height: 11,
        marginLeft: 6,
    },
    studyTaskStyle: {
        width: sr.w,
        height: 147,
        marginTop: 8,
        backgroundColor: '#FFFFFF',
    },
    titleContainer: {
        height: 47,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleTypeText: {
        fontSize: 16,
        marginLeft: 25,
        fontFamily: 'STHeitiSC-Medium',
        color: '#151515',
    },
    divisionCrossLine: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    entranceStyle: {
        width: sr.w,
        height: 97,
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeworkStyle: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    entranceImage: {
        width: 32,
        height: 32,
    },
    entranceText: {
        fontSize: 14,
        color: '#151515',
        marginTop: 8,
        fontFamily: 'STHeitiSC-Medium',
    },
    divisionVerticalLine: {
        width: 1,
        height: 86,
        backgroundColor: '#E5E5E5',
    },
    listContainer:{
        width:sr.w,
        marginTop: 6,
        backgroundColor: '#FFFFFF',
    },
    btnContainer: {
        width: sr.w - 20,
        height: 47,
        marginVertical: 18,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        backgroundColor: '#F6F6F6',
    },
    btnTypeText: {
        fontSize: 16,
        color: '#494949',
        fontFamily: 'STHeitiSC-Medium',
    },
});
