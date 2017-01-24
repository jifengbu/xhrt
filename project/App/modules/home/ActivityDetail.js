'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    AppState,
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    Animated,
    InteractionManager,
} = ReactNative;
var WebView = require('react-native-webview-bridge');

import Swiper from 'react-native-swiper2';
var ApplySuccessBox = require('./ApplySuccessBox.js');
var ApplyBox = require('./ApplyBox.js');
var EditPersonInfo = require('../person/EditPersonInfo.js');
var Player = require('./Player.js');
var moment = require('moment');
var UmengMgr = require('../../manager/UmengMgr.js');
var Umeng = require('../../native/index.js').Umeng;
var LivePlayer = require('../live/LivePlayer.js');

var {PageList,DImage,ShareSheet} = COMPONENTS;
var exitActicity = false;

var ActicityDetail = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var _scrollView: ScrollView;
        this.scrollView = _scrollView;
        return {
            isFullScreen: false,
            detailData: {},
            webHeight: 0,
            dataSource: this.ds.cloneWithRows([]),
            scrollEnabled: true,
            actionSheetVisible: false,
            playing: false,
            liveData: {},
        };
    },
    componentDidMount: function() {
        this.getList();
        AppState.addEventListener('change', this._handleAppStateChange);

        setTimeout(()=>{
            if (!exitActicity) {
                InteractionManager.runAfterInteractions(() => {
                    this.scrollView.scrollTo({y: 1});
                });
            }
        }, 200);
    },
    componentWillUnmount() {
        exitActicity = true;
        AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange: function(currentAppState) {
        if (currentAppState === 'active') {
            // this.playerPlay && this.playerPlay.stopPlayVideo();
        }else {
            this.playerPlay && this.playerPlay.stopPlayVideo();
        }
    },
    fullScreenListener(isFullScreen) {
        app.toggleNavigationBar(!isFullScreen);
        if (app.isandroid) {
            this.setState({isFullScreen});
            this.setState({scrollEnabled: !isFullScreen});
            app.GlobalVarMgr.setItem('isFullScreen', isFullScreen);
        }else {
            setTimeout(()=>{
                this.setState({isFullScreen});
                this.setState({scrollEnabled: !isFullScreen});
                app.GlobalVarMgr.setItem('isFullScreen', isFullScreen);
            }, 100);
        }
    },
    onEnd() {
        this.fullScreenListener(false);
        this.setState({playing: false});
    },
    changePlaying() {
        this.setState({playing: true});
    },
    doCloseActionSheet() {
        this.setState({actionSheetVisible:false});
    },
    doShowActionSheet() {
        this.setState({actionSheetVisible:true});
    },
    getList() {
        var param = {
            userID: app.personal.info.userID,
            activeityId: this.props.activeityId,
        };
        POST(app.route.ROUTE_GET_HOT_AVTIVITY_DETAILED, param, this.getListSuccess);
    },
    getListSuccess(data) {
        if (data.success) {
            let object = data.context.activityDetailed;
            if (object&&object.mode == 1) {
                app.getCurrentRoute().leftButton = { handler: ()=>{app.navigator.pop()}};
                app.getCurrentRoute().rightButton = { image: app.img.home_share, handler: ()=>{app.scene.doShowActionSheet()}};
                app.forceUpdateNavbar();
            }
            if (object) {
                this.setState({
                    detailData: object,
                    liveData: object.live,
                    dataSource: this.ds.cloneWithRows(object.historyActivity&&object.historyActivity)
                });
            }
        }
    },
    doConfirm() {
        app.navigator.push({
            component: EditPersonInfo,
        });
    },
    apply() {
        if (this.state.detailData.isEnroll) {
            this.getSignUp();
        } else {
            Toast('不在活动报名时间范围内');
        }
    },
    getSignUp() {
        var param = {
            userID: app.personal.info.userID,
            activeityId: this.props.activeityId,
        };
        POST(app.route.ROUTE_APP_ENROLL, param, this.getSignUpSuccess);
    },
    getSignUpSuccess(data) {
        if (data.success) {
            if (data.context && !data.context.infoComplete) {//true 不完整 false 完整
                app.showModal(
                    <ApplyBox />
                );
            } else if (data.context&&data.context.infoComplete) {
                app.showModal(
                    <ApplySuccessBox
                        doConfirm={this.doConfirm}
                        />
                );
            } else {
                Toast(data.msg);
            }
        } else {
            Toast(data.msg);
        }
    },
    doShareWeChat() {
        this.doShare(0);
    },
    doShareTimeline() {
        this.doShare(1);
    },
    doShareQQ() {
        this.doShare(2);
    },
    doShare(index) {
        var {introduceImage, detailedId, title} = this.state.detailData;
        var tempIntroduceImage = introduceImage||null;
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
        UmengMgr.doSingleShare(platform, CONSTANTS.SHARE_SHAREDIR_SERVER+'shareActivity.html?activeityId='+this.state.detailData.detailedId+'&userID='+app.personal.info.userID, '赢销截拳道', title, 'web', tempIntroduceImage, this.doShareCallback);
    },
    doShareCallback() {

    },
    replace(obj) {
        app.navigator.replace({
            title: '活动详情页',
            component: ActicityDetail,
            passProps: {activeityId: obj.activeityId},
        });
    },
    toLive() {
        let { live } = this.state.detailData;
        if (live.broadcastLive == 1) {
            if (app.personal.info.isWatchLive === 1) {
                app.navigator.push({
                    component: LivePlayer,
                    passProps: {
                        broadcastRoomID: live.broadcastRoomID&&live.broadcastRoomID,
                        broadcastLiveName: live.broadcastLiveName&&live.broadcastLiveName,
                        broadcastLiveStartTime: live.broadcastLivestartTimr&&live.broadcastLivestartTimr,
                    }
                });
            } else {
                Toast("没有观看直播权限");
            }
        } else {
            Toast('不在直播时间段');
        }
    },
    renderRow(obj, sectionID, rowID) {
        let time = obj.startDate&&obj.endDate?'时间：'+moment(obj.startDate).format('MM月DD号 HH:mm')+' - '+moment(obj.endDate).format('MM月DD号 HH:mm'):'';
        let des = '';
        if (obj.mode == 1) {
            des = obj.address?'地点：'+obj.address:'';
        } else {
            des = obj.mainTeacher?'主讲人：'+obj.mainTeacher:'';
        }
        let title = obj.title?obj.title:'';
        return (
            <TouchableHighlight
                onPress={this.replace.bind(null,obj)}
                style={styles.listViewItemContain}
                underlayColor="#EEB422">
                <View style={styles.ItemContentContain}>
                    <DImage
                        resizeMode='stretch'
                        defaultSource={app.img.common_default}
                        source={{uri:obj.minImage}}
                        style={styles.LeftImage} />
                    <View style={styles.flexConten}>
                        <Text
                            numberOfLines={1}
                            style={styles.nameTitle}>
                            {title}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={styles.midTitle}>
                            {des}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={styles.midTitle}>
                            {time}
                        </Text>
                    </View>
                    <Image
                        resizeMode='stretch'
                        source={obj.mode == 1?app.img.home_offline:app.img.home_liveTitle}
                        style={styles.LabelImage} />
                </View>
            </TouchableHighlight>
        )
    },
    onBridgeMessage(message){
        const { webviewbridge } = this.refs;
        let type, data;
        try {
            let result = JSON.parse(message);
            type = result.type;
            data = result.data;
        } catch (e) {}
        switch (type) {
            case "heightChange":
                this.setState({webHeight: data});
            break;
        }
    },
    render() {
        let {detailData} = this.state;
        let startDate = detailData.startDate&&detailData.startDate;
        let endDate = detailData.endDate&&detailData.endDate;
        let sections = [{title: '主      讲', image: app.img.home_speaker, common: detailData.mainTeacher },
                        {title: '主  办 方', image: app.img.home_organizer, common: detailData.sponsor },
                        {title: '开课日期', image: app.img.home_classDate, common: startDate&&endDate?moment(startDate).format('M月D号 HH:mm')+'-'+moment(endDate).format('MM月DD号 HH:mm'):''},
                        {title: '开课地址', image: app.img.home_classAdress, common: detailData.address},
                        {title: '价      格', image: app.img.home_price, common: detailData.price?('￥'+detailData.price):'免费'}];

        _.remove(sections, (item)=>item.common == undefined || item.common =='');
        if (detailData.mode == 2) {
            _.remove(sections, (item)=>item.title === '开课地址');
        }
        //直播是否正在进行
        let isLive = false, btnText = moment(startDate).format('M月D号 HH:mm')+'开启直播间';
        let startMoment = moment(startDate),  nowMoment = moment(), endMoment = moment(endDate);
        if (!nowMoment.isBefore(startMoment) && nowMoment.isBefore(endMoment)) {
            isLive = true;
            btnText = '进入直播间';
        } else if (!nowMoment.isBefore(endMoment)) {
            btnText = '直播已过期';
        }

        //判断显示直播图片还是显示活动图片
        let isLiveImage = false;
        if (this.state.liveData.broadcastLiveImg&&this.state.liveData.broadcastLiveImg != '') {
            isLiveImage = true;
        }
        const injectScript = `
        (function () {
            var height = document.body.offsetHeight;
            WebViewBridge.send(JSON.stringify({
                type:'heightChange',
                data: height,
            }));
          }());`;
        return (
            <View style={{flex: 1}}>
                {
                    !this.state.isFullScreen&&
                    <View style={styles.line}/>
                }
                <ScrollView ref={(scrollView) => { this.scrollView = scrollView}}
                    scrollEnabled={this.state.scrollEnabled} style={this.state.isFullScreen?styles.fullContainer:styles.container}>
                    {
                        !this.state.isFullScreen && (detailData.introduceImage != '' || isLiveImage) &&
                        <Image
                            resizeMode='stretch'
                            defaultSource={app.img.common_default}
                            source={{uri:isLiveImage?this.state.liveData.broadcastLiveImg:detailData.introduceImage}}
                            style={styles.bannerImage}
                            />
                    }
                    {
                        !this.state.isFullScreen&&
                        <View style={styles.nameView}>
                            <Text style={styles.midTitleTheme}>
                                {detailData.title}
                            </Text>
                            <View style={styles.pageViews}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.personal_eye}
                                    style={styles.eyeImage} />
                                <Text style={styles.numTitle}>
                                    {detailData.pageViews}
                                </Text>
                            </View>
                            <Image
                                resizeMode='stretch'
                                source={detailData.mode == 1?app.img.home_offline:app.img.home_liveTitle}
                                style={styles.imagelabel} />
                        </View>
                    }
                    {
                        !this.state.isFullScreen&&
                        sections.map((item, i)=>{
                            return(
                                <View key = {i} style={styles.voicebtnside}>
                                    <View style={[styles.sperator,i === 0?{width: sr.w}:{marginLeft: sr.ws(24)}]}/>
                                    <Image
                                        resizeMode='stretch'
                                        source={sections[i].image}
                                        style={styles.imageVoicestyle} />
                                    <Text style={styles.texttile} >
                                        {sections[i].title}
                                    </Text>
                                    <Text numberOfLines={2} style={[styles.comtile,{color: sections[i].title == '价      格'?'red':'#343434'}]} >
                                        {sections[i].common}
                                    </Text>
                                </View>
                            )
                        })
                    }
                    {
                        !this.state.isFullScreen&&
                        <View style={styles.lineView}/>
                    }
                    <View style={styles.midView}>
                        {
                            !this.state.isFullScreen && detailData.introduceHtml5 != '' &&
                            <WebView
                                style={[styles.webview,{height: this.state.webHeight+30}]}
                                ref="webviewbridge"
                                onBridgeMessage={this.onBridgeMessage}
                                injectedJavaScript={injectScript}
                                scrollEnabled={false}
                                source={{uri: detailData.introduceHtml5}}
                                scalesPageToFit={false}
                                />
                        }
                    </View>
                    {
                         detailData.activityVideo != undefined && detailData.activityVideo != '' && detailData.activityVideoImage != '' &&
                        (
                            <View style={styles.midView}>
                            {
                                this.state.playing?
                                <Player
                                    ref={(ref)=>this.playerPlay = ref}
                                    uri={detailData.activityVideo}
                                    fullScreenListener={this.fullScreenListener}
                                    onEnd={this.onEnd}
                                    width={sr.ws(323)}
                                    height={sr.ws(217)}
                                    />:
                                    <DImage
                                        resizeMode='stretch'
                                        defaultSource={app.img.common_default}
                                        source={{uri: detailData.activityVideoImage}}
                                        style={styles.playerContainer}>
                                        <TouchableOpacity
                                            style={styles.video_icon_container}
                                            onPress={this.changePlaying}>
                                            <Image
                                                resizeMode='stretch'
                                                source={app.img.specops_play}
                                                style={styles.video_icon}>
                                            </Image>
                                        </TouchableOpacity>
                                    </DImage>
                            }
                            </View>
                        )
                    }
                    {
                        !this.state.isFullScreen &&
                        <View style={styles.blankView}></View>
                    }
                    {
                        !this.state.isFullScreen&&
                        <View style={styles.lineView}/>
                    }
                    {
                        !this.state.isFullScreen&&
                        <View style={styles.titleView}>
                            <View style={styles.splitView}>
                            </View>
                            <Text style={styles.themeTitle}>你可能感兴趣的</Text>
                        </View>
                    }
                    {
                        !this.state.isFullScreen&&
                        <ListView
                            initialListSize={1}
                            onEndReachedThreshold={10}
                            enableEmptySections={true}
                            style={styles.listStyle}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow}
                            />
                    }
                </ScrollView>
                {
                    !this.state.isFullScreen&&
                    <View style={styles.btnView}>
                        <View style={styles.topLine}/>
                        <TouchableOpacity onPress={detailData.mode == 1?this.apply:isLive?this.toLive:null} style={[styles.btnStyle,{backgroundColor: detailData.mode == 1?'#FF3F3F':isLive?'#FF3F3F':'#AFAFAF'}]}>
                            <Text style={styles.btnTitle}>{detailData.mode == 1?'立即报名':btnText}</Text>
                        </TouchableOpacity>
                    </View>
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
    }
});
module.exports = ActicityDetail;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    fullContainer: {
        width: sr.w,
        height: sr.fh,
        backgroundColor: '#EEEEEE',
    },
    playerContainer: {
        width: 323,
        marginLeft: 26,
        height: 217,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'white',
    },
    video_icon_container: {
        height: 51,
        width: 51,
        borderRadius: 25.5,
        justifyContent: 'center',
        alignItems:'center',
    },
    video_icon: {
        height: 51,
        width: 51,
    },
    bannerImage: {
        width: sr.w,
        height: 222,
    },
    nameView: {
        width: sr.w,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    midTitleTheme: {
        fontFamily: 'STHeitiSC-Medium',
        marginLeft: 22,
        marginVertical: 15,
        width: sr.w-105,
        color: '#3C3C3C',
        fontSize: 16,
    },
    eyeImage: {
        height: 11,
        width: 13,
    },
    numTitle: {
        fontSize: 14,
        marginLeft: 5,
        fontFamily: 'STHeitiSC-Medium',
        color: '#959595',
    },
    pageViews: {
        width: 83,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    imagelabel: {
        width: 25,
        height: 25,
        position: 'absolute',
        right: 0.5,
        top: 0,
    },
    lineView: {
        width: sr.w,
        height: 6,
        backgroundColor: '#F4F4F4',
    },
    voicebtnside: {
        width: sr.w,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    sperator: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: sr.w-48,
        height: 1,
        backgroundColor: '#F8F8F8',
    },
    imageVoicestyle: {
        height: 16,
        width: 14,
        marginLeft: 22,
    },
    texttile: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 12,
        marginHorizontal: 13,
        color: '#959595',
        width: 60,
    },
    comtile: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 12,
        width: 232,
    },
    midView: {
        width: sr.w,
        backgroundColor: '#FFFFFF',
    },
    titleView: {
        height: 43,
        width: sr.w,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    splitView: {
        marginLeft: 20,
        marginRight: 10,
        height: 18,
        width: 4,
        backgroundColor: '#FF3F3F',
    },
    themeTitle: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 16,
        color: '#333333',
    },
    listViewItemContain: {
        flexDirection: 'row',
        width: sr.w,
        marginTop: 1,
        backgroundColor: '#FFFFFF',
    },
    ItemContentContain: {
        flexDirection: 'row',
        width: sr.w-11,
        marginLeft: 11,
        paddingVertical: 15,
    },
    LeftImage: {
        width: 118,
        height:72,
        borderRadius: 2,
    },
    flexConten: {
        width: 225,
        marginLeft: 10,
        justifyContent: 'space-between',
    },
    nameTitle: {
      color: '#313131',
      fontFamily: 'STHeitiSC-Medium',
      fontSize:14,
      width: 200,
    },
    midTitle: {
      color: '#313131',
      fontFamily: 'STHeitiSC-Medium',
      fontSize:10,
    },
    LabelImage: {
      height: 28,
      width: 28,
      position: 'absolute',
      top: 0,
      right: 10,
    },
    listStyle: {
        alignSelf:'stretch',
        marginBottom: 68,
        backgroundColor: '#EEEEEE',
    },
    btnView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 68,
        width: sr.w,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    topLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 1,
        width: sr.w,
        backgroundColor: '#F1F1F1'
    },
    btnStyle: {
        height: 43,
        width: sr.w-24,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTitle: {
        fontFamily:'STHeitiSC-Medium',
        fontSize: 18,
        color: '#FFFFFF',
    },
    webview: {
        width: sr.w,
    },
    line: {
        width: sr.w,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    blankView: {
        width: sr.w,
        height: 12,
        backgroundColor: 'white',
    },
});
