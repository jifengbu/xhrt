'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

var moment = require('moment');
import Swiper from 'react-native-swiper2';
var Search = require('../search/index.js');
var VideoPlay = require('../study/VideoPlay.js');
var PersonInfo = require('../person/PersonInfo.js');
var PackageList = require('../package/PackageList.js');
var AidDetail = require('../actualCombat/AidDetail.js');
var BusinessCollege = require('../businessCollege/index.js');
var WaitingLive = require('../live/WaitingLive.js');
var LivePlayer = require('../live/LivePlayer.js');
var BackPlayer = require('../live/BackPlayer.js');
var ShowMealBox = require('../package/ShowMealBox.js');
var ExcellentWorks = require('../excellentWorks/index.js');
var ReadingList = require('./ReadingList.js');
var RecommendVideo = require('./RecommendVideo.js');

var {StarBar} = COMPONENTS;

const LABEL_IMAGES = [
    app.img.home_boutique_curriculum,
    app.img.home_good_case,
    app.img.home_editor_recommend,
    app.img.home_course_highlights,
];
const VIDEO_TYPES = ['精品课程', '精彩案例', '编辑推荐', '特种兵'];

module.exports = React.createClass({
    statics: {
        title: '赢销截拳道',
        leftButton: { image: app.img.personal_entrance, handler: ()=>{
            app.navigator.push({
                component: PersonInfo,
                fromLeft: true,
            });
        }},
        rightButton: { image: app.img.search_search, handler: ()=>{
            app.navigator.push({
                component: Search,
            });
        }},
        guideLayer: require('../guide/HomeGuide.js'),
    },
    getInitialState() {
        return {
            ShowMealBox: false,
            newKitsList:[],
            homeVideoList:[],
        };
    },
    componentDidMount() {
        this.getHomePageData();
    },
    toReadingList() {
        app.navigator.push({
            title: '推荐阅读',
            component: ReadingList,
            passProps: {},
        });
    },
    onPressToWorks() {
        app.navigator.push({
            title: '优秀作业',
            component: ExcellentWorks,
            passProps: {isFirst: 1},
        });
    },
    onPressBusiness() {
        app.navigator.push({
            title: '明星示范单位',
            component: BusinessCollege,
        });
    },
    doCancle() {
        this.setState({ShowMealBox: false});
    },
    doPayConfirm() {
        app.navigator.push({
            title: '套餐',
            component: PackageList,
        });
        this.setState({ShowMealBox: false});
    },
    getHomePageData() {
        var param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_HOME_PAGE_DATA, param, this.getHomePageDataSuccess, this.getHomePageDataError, true);
    },
    getHomePageDataSuccess(data) {
        if (data.success) {
            var context = data.context;
            let kidsList = context.kidsList||[];
            let homeVideoList = context.homeVideoList||[];
            app.data.specopsPackageID = context.packageID; //特种兵套餐ID，用来支付
            app.data.specopsPackagePrice = context.packagePrice.toFixed(2); //特种兵套餐价钱，用来支付和显示
            if (context.broadcastLive) {
                context.homeVideoList.unshift({});
            }
            this.setState({newKitsList:kidsList,homeVideoList:homeVideoList, context: context}, ()=>{
                app.dismissProgressHUD();
            });
        } else {
            app.dismissProgressHUD();
            Toast(data.msg);
        }
    },
    getHomePageDataError() {
        app.dismissProgressHUD();
    },
    playLive(data) {
        // data.broadcastRoomID = '608057440';
        // data.broadcastLiveStartTime = "2016-07-07 15:45:10";
        if (data.broadcastLive == 1) {
            var startTime = data.broadcastLiveStartTime;
            var startMoment = moment(startTime),  nowMoment = moment();
            var broadcastRoomID = data.broadcastRoomID;
            if (nowMoment.isBefore(startMoment)) {
                app.navigator.push({
                    component: WaitingLive,
                    passProps: {
                        broadcastRoomID: broadcastRoomID,
                        broadcastLiveAuthor:data.broadcastLiveAuthor,
                        broadcastLiveFreeTime:data.broadcastLiveFreeTime,
                        broadcastLiveImg:data.broadcastLiveImg,
                        broadcastLiveName:data.broadcastLiveName,
                        broadcastLiveStartTime:startTime
                    }
                });
            } else {
                if (app.personal.info.isWatchLive === 1) {
                    app.navigator.push({
                        component: LivePlayer,
                        passProps: {
                            broadcastRoomID: broadcastRoomID,
                            broadcastLiveName:data.broadcastLiveName,
                            broadcastLiveStartTime:startTime
                        }
                    });
                } else {
                    Toast("没有观看直播权限");
                }

            }
        } else {
            app.navigator.push({
                component: BackPlayer
            });
        }
    },
    playVideo(data) {
        if (app.personal.info.userType == "0" && data.isFree != 1) {
            this.setState({ShowMealBox: true});
            return;
        }
        if (app.personal.info.userType == "1") {

            if (_.find(app.personal.info.validVideoList,(item)=>item==data.videoID)) {
                app.navigator.push({
                    title: data.name,
                    component: VideoPlay,
                    passProps: {videoInfo:data},
                });
                return;
            }
            this.setState({ShowMealBox: true});
            return;
        }
        app.navigator.push({
            title: data.name,
            component: VideoPlay,
            passProps: {videoInfo:data},
        });
    },
    render() {
        var {gotoSpecialSoldierTime,PKTime,PKWinTime,newReplay} = app.personal.info;
        var becomeSpecialSoldierDay = Math.floor(moment().diff(moment(gotoSpecialSoldierTime))/(24 * 60 * 60 * 1000))+1||1;
        var {homeVideoList, context} = this.state;
        var StudyNotice = '今天你还未学习任何课程';
        if (app.studyNumMgr.info && app.studyNumMgr.info.num) {
            StudyNotice = '今天已学习了 ' +app.studyNumMgr.info.num +' 个视频';
        }
        return (
            <View style={styles.container}>
                <ScrollView style={styles.pageContainer}>
                    <View style={styles.bannerContainer}>
                        {homeVideoList.length && context?
                            <Swiper
                                paginationStyle={styles.paginationStyle}
                                height={sr.ws(218)}>
                                {
                                    homeVideoList.map((item, i)=>{
                                        if (context.broadcastLive!=0 && i===0) {
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    onPress={this.playLive.bind(null, context)}>
                                                    <Image
                                                        resizeMode='stretch'
                                                        defaultSource={app.img.common_default}
                                                        source={{uri:context.broadcastLiveImg}}
                                                        style={styles.bannerImage}
                                                        />
                                                    <View style={styles.bannerTextContainer}>
                                                        <Text style={styles.bannerTextLine}>
                                                        </Text>
                                                        <Text numberOfLines={1} style={styles.bannerText}>
                                                            {context.broadcastLiveName+'   '+context.broadcastLiveStartTime}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        } else {
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    onPress={this.playVideo.bind(null, item)}>
                                                    <Image
                                                        resizeMode='stretch'
                                                        defaultSource={app.img.common_default}
                                                        source={{uri:item.urlImg}}
                                                        style={styles.bannerImage}
                                                        />
                                                    <View style={styles.bannerTextContainer}>
                                                        <Text style={styles.bannerTextLine}>
                                                        </Text>
                                                        <Text numberOfLines={1} style={styles.bannerText}>
                                                            {VIDEO_TYPES[item.videoType-1]}{'：'}{item.name}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                    })
                                }
                            </Swiper>
                            :
                            <View style={{flex:1, backgroundColor:'rgba(0, 0, 0, 0.7)'}}/>
                        }
                    </View>
                    <View style={styles.enterContainer}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={[styles.enterButton, {backgroundColor:'#98CEA3'}]}
                            onPress={()=>app.showMainScene(2)}
                            >
                            <View style={styles.enterTextContainer}>
                                <View style={styles.titleStyle}>
                                    <Text style={[styles.enterTextTitle,{color: '#305038'}]}>学习场</Text>
                                </View>
                                <View style={styles.titleStyle1}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.enterTextTip,{color: '#305038'}]}>
                                        {StudyNotice}
                                    </Text>
                                </View>
                            </View>
                            <Image
                                resizeMode='stretch'
                                source={app.img.home_learn_2}
                                style={styles.styleImage}
                                />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={[styles.enterButton, {backgroundColor:'#A62045'}]}
                            onPress={()=>app.showMainScene(3)}
                            >
                            <View style={styles.enterTextContainer}>
                                <View style={styles.titleStyle}>
                                    <Text style={[styles.enterTextTitle,{color: '#FFFFFF'}]}>训练场</Text>
                                </View>
                            </View>
                            <Image
                                resizeMode='stretch'
                                source={app.img.home_train_2}
                                style={styles.styleImage}
                                />
                        </TouchableOpacity>

                    </View>
                    {
                        !CONSTANTS.ISSUE_IOS &&
                        <View style={styles.enterContainer1}>
                            <View style={styles.enterTextContainer1}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.home_actual_1}
                                    style={styles.styleImage1}
                                    />
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={[styles.enterButton, {backgroundColor:'#D8B86C'}]}
                                onPress={()=>app.showMainScene(1)}>
                                <View style={styles.enterTextContainer}>
                                    <View style={styles.titleStyle}>
                                        <Text style={[styles.enterTextTitle,{color: '#4a3c1f'}]}>特种兵</Text>
                                    </View>
                                    <View style={styles.titleStyle1}>
                                        <Text
                                            numberOfLines={1}
                                            style={[styles.enterTextTip,{color: '#4a3c1f'}]}>{app.personal.info.isSpecialSoldier?`今天是你加入特种兵的第${becomeSpecialSoldierDay}天..`:`加入特种兵吧..`}</Text>
                                    </View>
                                </View>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.home_special_troops}
                                    style={styles.styleImage}
                                    />
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        !CONSTANTS.ISSUE_IOS &&
                        <View style={styles.containContainer}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={styles.containTitleContainer}
                                onPress={this.onPressBusiness}>
                                <Image
                                    resizeMode='contain'
                                    source={app.img.home_star}
                                    style={styles.containTitleImage}
                                    />
                                <Text style={styles.containTitle}>明星示范单位</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={styles.containTitleContainer}
                                onPress={this.onPressToWorks}>
                                <Image
                                    resizeMode='contain'
                                    source={app.img.home_homework_1}
                                    style={styles.containTitleImage}
                                    />
                                <Text style={styles.containTitle}>课堂作业</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={styles.containTitleContainer}
                                onPress={this.playLive.bind(null, context)}>
                                <Image
                                    resizeMode='contain'
                                    source={app.img.home_live}
                                    style={styles.containTitleImage}
                                    />
                                <Text style={styles.containTitle}>课程直播</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </ScrollView>
                {
                    this.state.ShowMealBox &&
                    <ShowMealBox
                        doConfirm={this.doPayConfirm}
                        doCancle={this.doCancle}>
                    </ShowMealBox>
                }
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE'
    },
    pageContainer: {
        flex: 1,
        marginBottom: 49,
    },
    bannerContainer: {
        width: sr.w,
        height: 218,
    },
    paginationStyle: {
        width: sr.w,
        bottom: 30,
    },
    bannerTextContainer: {
        flexDirection: 'column',
        width: sr.w,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 30,
        justifyContent: 'center',
    },
    bannerText: {
        marginLeft: 10,
        fontSize: 13,
        color: '#FFFFFF',
    },
    bannerTextLine: {
        width: sr.w,
        height: 2,
        backgroundColor: '#239fdb',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    bannerImage: {
        width: sr.w,
        height: 218,
    },
    enterContainer: {
        height: 117,
        width: sr.w,
        marginTop: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#EEEEEE'
    },
    enterContainer1: {
        height: 117,
        width: sr.w,
        marginTop: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#EEEEEE'
    },
    enterButton: {
        width: sr.w/2-4,
        height: 117,
    },
    enterTextContainer: {
        width: sr.w/2-4,
        height: 70,
    },
    enterTextContainer1: {
        width: sr.w/2-4,
        height: 117,
        backgroundColor: '#A62045',
        justifyContent: 'center',
        alignItems: 'center',
    },
    enterTextTitle: {
        fontSize: 16,
        fontWeight: '900'
    },
    enterTextTip: {
        fontSize: 11,
    },
    containContainer: {
        height: 75,
        width: sr.w,
        marginTop: 9,
        flexDirection: 'row',
        alignItems: 'center',
    },
    containTitleContainer: {
        height: 75,
        width: sr.w/3,
        alignItems: 'center',
        backgroundColor:'#FFFFFF'
    },
    containTitleImage: {
        marginVertical:10,
        width: 30,
        height: 30,
    },
    styleImage: {
        width: 35,
        height: 35,
        marginRight: 10,
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    styleImage1: {
        width: 100,
        height: 60,
    },
    containTitle: {
        fontSize: 14,
    },
    titleStyle: {
        width: 170,
        height: 20,
        marginLeft: 10,
        marginTop: 10,
        justifyContent: 'center',
    },
    titleStyle1: {
        width: 170,
        height: 20,
        marginLeft: 10,
        justifyContent: 'center',
    },
    titleStyleTrain: {
        width: 170,
        height: 15,
        marginLeft: 10,
        justifyContent: 'center',
    },
});
