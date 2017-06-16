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
    TouchableHighlight,
} = ReactNative;

const WinVideoMenuPanel = require('./WinVideoMenuPanel.js');
const BuyVideoBox = require('./BuyVideoBox.js');
const BuySpecops = require('./BuySpecops.js');
const BuySpecopsBoss = require('./BuySpecopsBoss.js');
const RecommendHisttory = require('./RecommendHisttory.js');
const Player = require('../study/Player.js');
const VideoCollect = require('../specops/VideoCollectBox.js');
const TimerMixin = require('react-timer-mixin');
const UmengMgr = require('../../manager/UmengMgr.js');
const Umeng = require('../../native/index.js').Umeng;
const VideoTimeMgr = require('../../manager/VideoTimeMgr.js');

const { DImage, ShareSheet } = COMPONENTS;

const WinVideoPlayer = React.createClass({
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
            isLookAll: false,
            dataList: [],
            tabIndex: 0,
            actionSheetVisible: false,
        };
    },
    goBack() {
        this.stopVideoSaveTime();
        app.navigator.pop();
    },
    doPaySpecops() {
        app.navigator.push({
            title: '特种兵详情',
            component: BuySpecopsBoss,
        });
    },
    componentDidMount () {
        app.showModal(
            <BuyVideoBox doConfirm={this.doPaySpecops}
                />
        );
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
    doRestart (obj) {
        this.stopVideoSaveTime();
        app.navigator.replace({
            title: '课程学习',
            component: WinVideoPlayer,
            passProps: { videoInfo: obj },
        });
    },
    doLookAll () {
        this.setState({ isLookAll: !this.state.isLookAll });
    },
    changePlaying () {
        this.getVideoTimeSeek();
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex});
    },
    tabItem() {
        const classArray = ['视频介绍','学员感想','相关推荐'];
        return(
            <View style={styles.tabContainer}>
                {
                  classArray.map((item, i) => {
                      return (
                          <TouchableHighlight
                              key={i}
                              underlayColor='rgba(0, 0, 0, 0)'
                              onPress={this.changeTab.bind(null, i)}
                              style={styles.touchTab}>
                              <View style={styles.tabButton}>
                                  <Text style={[styles.tabText, { color:this.state.tabIndex === i ? '#FA6263' : '#6C6C6C' }]} >
                                      {item}
                                  </Text>
                              <View style={[styles.tabLine,{backgroundColor: this.state.tabIndex === i ? '#FA6263':'#FFFFFF'}]} />
                              </View>
                          </TouchableHighlight>
                      );
                  })
              }
            </View>
        );
    },
    render () {
        const { urlPlay, urlImg } = this.state.pageData || {};
        const { isAgent, isSpecialSoldier } = app.personal.info;
        const authorized = isAgent || isSpecialSoldier;
        const { isLookAll, tabIndex } = this.state;
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
                                    source={app.img.home_btn_play}
                                    style={styles.video_icon} />
                            </TouchableOpacity>
                        </DImage>
                }
                <ScrollView style={styles.pageContainer} scrollEnabled={this.state.scrollEnabled}>
                    {
                        !this.state.isFullScreen &&
                        <this.tabItem />
                    }
                    {
                        !this.state.isFullScreen &&
                        <View style={styles.divisionCrossLine}/>
                    }
                    {
                        !this.state.isFullScreen &&tabIndex === 0&&
                        <View style={styles.personCtainer}>
                            <WinVideoMenuPanel
                                data={this.state.pageData}
                                noticeShow={this.updateHeart} />
                        </View>
                    }

                    {
                        (!this.state.isFullScreen && this.state.pageData) &&
                        <View style={styles.listContainer}>
                            {
                                this.state.dataList != 0 &&tabIndex === 2&&
                                <RecommendHisttory
                                    briefDisplay
                                    doRestart={this.doRestart}
                                    dataList={this.state.dataList} />
                            }
                        </View>
                    }
                </ScrollView>
                {
                    !authorized&&
                    <View style={styles.btnBottom}>
                        <TouchableOpacity
                            onPress={null}
                            style={styles.menuBtnContainer}>
                            <DImage
                                resizeMode='contain'
                                source={app.img.home_diamond}
                                style={styles.iconStyle} />
                            <Text style={styles.panleMenuBtnText}>
                                {'特种兵尊享系列课程'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={null}
                            style={[styles.btnContainer,{backgroundColor: '#DE3031'}]}>
                            <Text style={styles.panleMenuBtnText}>
                                {'立即购买'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
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
module.exports = WinVideoPlayer;

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
        height: 56,
        width: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems:'center',
    },
    video_icon: {
        height: 56,
        width: 56,
    },
    personCtainer: {
        width: sr.w,
        backgroundColor: 'blue',
    },
    divisionCrossLine: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    listContainer:{
        width:sr.w,
        backgroundColor: '#FFFFFF',
    },
    tabContainer: {
        width:sr.w,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
    },
    touchTab: {
        flex: 1,
        paddingTop: 20,
    },
    tabButton: {
        alignItems:'center',
        justifyContent:'center',
    },
    tabText: {
        fontSize: 13,
    },
    tabLine: {
        width: 55,
        marginTop: 10,
        height: 2,
    },
    btnBottom: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 49,
        flexDirection: 'row',
        width: sr.w,
    },
    menuBtnContainer: {
        width: 233,
        height: 49,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFB235',
    },
    btnContainer: {
        width: 142,
        height: 49,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    iconStyle: {
        width: 17,
        height: 15,
        marginTop: 2,
        marginRight: 5,
    },
    panleMenuBtnText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
});
