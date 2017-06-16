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
    TouchableOpacity,
} = ReactNative;

const dismissKeyboard = require('dismissKeyboard');
const SpecopsVideoMenuPanel = require('../specops/SpecopsVideoMenuPanel.js');
const RecommendHisttory = require('./RecommendHisttory.js');
const Player = require('../study/Player.js');
const VideoCollect = require('../specops/VideoCollectBox.js');
const TimerMixin = require('react-timer-mixin');
const UmengMgr = require('../../manager/UmengMgr.js');
const Umeng = require('../../native/index.js').Umeng;
const VideoTimeMgr = require('../../manager/VideoTimeMgr.js');

const { DImage, ShareSheet } = COMPONENTS;

const RecommendVideoPlayer = React.createClass({
    mixins: [TimerMixin],
    statics: {
        title: '课程学习',
        leftButton: { handler: () => { app.scene.goBack(); } },
        rightButton: { image: app.img.home_share, handler: () => { app.scene.doShowActionSheet(); } },
    },
    getInitialState () {
        return {
            isFullScreen: false,
            pageData: this.props.videoInfo,
            playing: false,
            currentAppState:'',
            scrollEnabled: true,
            lineHeight: 0,
            isLookAll: false,
            dataList: [],
            actionSheetVisible: false,
        };
    },
    goBack() {
        this.stopVideoSaveTime();
        app.navigator.pop();
    },
    componentDidMount () {
        this.doUpdateClicks();
        this.getRelevantVideo();
        AppState.addEventListener('change', this._handleAppStateChange);
    },
    componentWillUnmount () {
        this.stopVideoSaveTime();
        AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange: function (currentAppState) {
        this.setState({ currentAppState });
        if (currentAppState === 'active') {
            this.getVideoTimeSeek();
        } else {
            this.stopVideoSaveTime();
            this.fullScreenListener(false);
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
        this.setState({ playing: true });
        const videoUrl = this.state.pageData ? this.state.pageData.urlPlay : null;
        if (videoUrl) {
            const time = VideoTimeMgr.getPlayTime(videoUrl);
            if (time > 0) {
                setTimeout(() => {
                    this.playerPlay && this.playerPlay.setLastPlayTime(time);
                    console.log('seek time is ', time, videoUrl);
                }, 60);
            }
        }
    },
    doShowActionSheet () {
        this.stopVideoSaveTime();
        this.setState({ actionSheetVisible:true });
    },
    doCloseActionSheet () {
        this.setState({ actionSheetVisible:false });
    },
    doShareWeChat () {
        this.doShare(0);
    },
    doShareTimeline () {
        this.doShare(1);
    },
    doShareQQ () {
        this.doShare(2);
    },
    doShare (index) {
        const { videoID, name, urlImg, detail } = this.state.pageData;
        let platform;
        switch (index) {
            case 0:
                platform = Umeng.platforms.UMShareToWechatSession;
                break;
            case 1:
                platform = Umeng.platforms.UMShareToWechatTimeline;
                break;
            case 2:
                platform = Umeng.platforms.UMShareToQQ;
                break;
            default:
                Toast('未知分享');
                return;
        }
        UmengMgr.doSingleShare(platform, CONSTANTS.SHARE_SHAREDIR_SERVER + 'sharePerfectVideo.html?userID=' + app.personal.info.userID + '&videoID=' + videoID, name, detail || '视频', 'web', urlImg, this.doShareCallback);
    },
    doShareCallback () {
        this.doCloseActionSheet();
    },
    getRelevantVideo () {
        const param = {
            userID:app.personal.info.userID,
            videoID: this.state.pageData.videoID,
        };
        POST(app.route.ROUTE_RELEVANT_VIDEO, param, this.doRelevantVideoSuccess);
    },
    doRelevantVideoSuccess (data) {
        if (data.success) {
            const list = data.context.videoList || [];
            const listData = list.length >= 4 ? (list.slice(0, 4) || []) : list;
            this.setState({ dataList: listData });
        }
    },
    doUpdateClicks () {
        const param = {
            userID:app.personal.info.userID,
            videoID:this.state.pageData.videoID,
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
    fullScreenListener (isFullScreen) {
        this.setState({ scrollEnabled: !isFullScreen });
        app.toggleNavigationBar(!isFullScreen);
        this.setState({ isFullScreen });
        app.GlobalVarMgr.setItem('isFullScreen', isFullScreen);
    },
    onEnd () {
        this.fullScreenListener(false);
        this.getWatchVideoReward(this.state.pageData.videoID);
        this.stopVideoSaveTime();
    },
    getWatchVideoReward (videoID) {
        const param = {
            userID:app.personal.info.userID,
            videoID:videoID,
        };
        POST(app.route.ROUTE_WATCH_VIDEO, param, this.getWatchVideoRewardSuccess, true);
    },
    getWatchVideoRewardSuccess (data) {
        if (data.success) {
            const personInfo = app.personal.info;
            personInfo.integral += data.context.makePoint;
            app.personal.set(personInfo);
        } else {
            Toast(data.msg);
        }
    },
    // 通过回调得到点赞成功改变显示
    updateHeart (videoID, praiseOrCollection) {
        if (videoID == this.state.pageData.videoID) {
            if (praiseOrCollection === 'isPraise') {
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
    goVideoListPage () {
        this.stopVideoSaveTime();
        app.navigator.push({
            title: '相关课程',
            component: RecommendHisttory,
            passProps: { doRestart:this.doRestart, briefDisplay:false, videoID: this.state.pageData.videoID },
        });
    },
    doRestart (obj) {
        this.stopVideoSaveTime();
        app.navigator.replace({
            title: '课程学习',
            component: RecommendVideoPlayer,
            passProps: { videoInfo: obj },
        });
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
    changePlaying () {
        this.getVideoTimeSeek();
    },
    render () {
        const { urlPlay, urlImg } = this.state.pageData || {};
        const { isAgent, isSpecialSoldier } = app.personal.info;
        const { isLookAll } = this.state;
        return (
            <View style={this.state.isFullScreen ? styles.fullContainer : styles.container}>
                {
                    this.state.playing ?
                        <Player
                            ref={(ref) => { this.playerPlay = ref; }}
                            uri={urlPlay}
                            fullScreenListener={this.fullScreenListener}
                            onEnd={this.onEnd}
                        /> :
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
                <ScrollView style={styles.pageContainer} scrollEnabled={this.state.scrollEnabled}>
                    {
                    !this.state.isFullScreen &&
                    <View style={styles.personCtainer}>
                        <SpecopsVideoMenuPanel
                            data={this.state.pageData}
                            noticeShow={this.updateHeart} />
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
                    (!this.state.isFullScreen && this.state.pageData) &&
                    <View style={styles.listContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleTypeText}>相关课程</Text>
                        </View>
                        <View style={styles.divisionCrossLine} />
                        {
                            this.state.dataList != 0 &&
                            <RecommendHisttory briefDisplay doRestart={this.doRestart} dataList={this.state.dataList} />
                        }
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
                <ShareSheet
                    visible={this.state.actionSheetVisible}
                    onCancel={this.doCloseActionSheet} >
                    <ShareSheet.Button image={app.img.specops_wechat} onPress={this.doShareWeChat}>微信好友</ShareSheet.Button>
                    <ShareSheet.Button image={app.img.specops_friend_circle} onPress={this.doShareTimeline}>朋友圈</ShareSheet.Button>
                    <ShareSheet.Button image={app.img.specops_qq} onPress={this.doShareQQ}>QQ</ShareSheet.Button>
                </ShareSheet>
            </View>
        );
    },
});
module.exports = RecommendVideoPlayer;

const styles = StyleSheet.create({
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
        height: sr.w * 9 / 16,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'white',
    },
    video_icon_container: {
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems:'center',
    },
    video_icon: {
        height: 51,
        width: 51,
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
