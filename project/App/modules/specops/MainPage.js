'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Keyboard,
} = ReactNative;

const WeekPlan = require('./WeekPlan.js');
const moment = require('moment');
const CoursePlayer = require('./CoursePlayer.js');
const WaitingSpecopsLive = require('../live/WaitingSpecopsLive.js');
const WatchSpecopsLive = require('../live/WatchSpecopsLive.js');
const ShareHomework = require('./ShareHomework.js');
const WorkTask = require('./WorkTask.js');
const ClassTest = require('./ClassTest.js');
const Guidance = require('./GuidanceBox.js');
const GuideSwiper = require('./GuideSwiper.js');
const Progress = require('react-native-progress');
const LocalDataMgr = require('../../manager/LocalDataMgr.js');
const PaySpecopsMessageBox = require('./PaySpecopsMessageBox.js');
const OpenSpecops = require('./OpenSpecops.js');
const UnauthorizedCoursePlayer = require('./UnauthorizedCoursePlayer.js');

module.exports = React.createClass({
    getInitialState () {
        this.detailsMap = {};// 作业相关内容
        return {
            specialSoldierImgUrl: '',
            dayPlan:[],
            weekPlan:[],
            monthPlan:[],
            lineHeight: 0,
            isLookAll: false,
            lineHeightIntroduce: 0,
            studyProgressDetail: {},
            isWatchVideo: false,
            isDayActuallydoing: 0,
            isDaySummary: 0,
            isEverydayQuestion: 0,
        };
    },
    componentDidMount () {
        this.getSpecialSoldierData();
        this.getHomePagePlan();
    },
    componentWillUnmount () {
        app.closeModal();
    },
    onWillFocus () {
        const firstUse = LocalDataMgr.getValueFromKey('firstUse');
        if (firstUse == null) {
            LocalDataMgr.setValueAndKey('firstUse', 1);
            app.showModal(
                <Guidance doGuidance={this.doGuidance} />
            );
        }
        this.getSpecialSoldierData();
        this.getHomePagePlan();
    },
    doGuidance () {
        app.showModal(
            <GuideSwiper />
        );
    },
    getSpecialSoldierData () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_SPECIAL_SOLDIER_DATA, param, this.getSpecialSoldierDataSuccess, true);
    },
    getSpecialSoldierDataSuccess (data) {
        const weekArr = [];
        const monthArr = [];
        if (data.success) {
            const { dayPlan, weekPlan, monthPlan, specialSoldierImgUrl, specialSoldierVedioName, specialSoldierVedioID, isWatchVideo, isDayActuallydoing, isDaySummary, isEverydayQuestion, introductionTitle, introductionContent } = data.context;
            const dayArr = dayPlan || [];
            const weekArr = weekPlan || [];
            const monthArr = monthPlan || [];
            this.setState({ dayPlan:dayArr, weekPlan:weekArr, monthPlan:monthArr, specialSoldierImgUrl, specialSoldierVedioName, isDayActuallydoing, isDaySummary, isEverydayQuestion, isWatchVideo, specialSoldierVedioID, introductionTitle, introductionContent });
            this.data = data.context;
            this.getStudyProgress(specialSoldierVedioID);
        } else {
            Toast(data.msg);
        }
    },
    getHomePagePlan () {
        const param = {
            userID: app.personal.info.userID,
            planDate: moment().format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_HOME_PAGE_PLAN, param, this.getHomePagePlanSuccess, true);
    },
    getHomePagePlanSuccess (data) {
        if (data.success) {
            this.setState({ allPlanDetail:data.context });
        } else {
            Toast(data.msg);
        }
    },
    getStudyProgress (specialSoldierVedioID) {
        if (app.personal.info && app.personal.info.userID) {
            const param = {
                userID:app.personal.info.userID,
                videoID: specialSoldierVedioID,
            };
            POST(app.route.ROUTE_STUDY_PROGRESS, param, this.getStudyProgressSuccess);
        }
    },
    getStudyProgressSuccess (data) {
        if (data.success) {
            this.setState({ studyProgressDetail: data.context });
            this.detailsMap['taskContent'] = data.context.taskContent || '';
            this.detailsMap['taskID'] = data.context.taskID || '';
            this.detailsMap['userTaskID'] = data.context.userTaskID || '';
            this.detailsMap['taskName'] = data.context.taskName || '';
        } else {
            Toast(data.msg);
        }
    },
    playCourse () {
        if (!this.data) return;
        const { specialSoldierLiveID, specialSoldierVedioUrl, specialSoldierLiveTime, specialSoldierImgUrl } = this.data;
        if (specialSoldierLiveID) {
            const startMoment = moment(specialSoldierLiveTime), nowMoment = moment();
            if (nowMoment.isBefore(startMoment)) {
                app.navigator.push({
                    component: WaitingSpecopsLive,
                    passProps: {
                        broadcastRoomID: specialSoldierLiveID,
                        specialSoldierImgUrl,
                        specialSoldierLiveTime,
                    },
                });
            } else {
                app.navigator.push({
                    component: WatchSpecopsLive,
                    passProps: {
                        broadcastRoomID: specialSoldierLiveID,
                    },
                });
            }
        } else {
            app.navigator.push({
                component: CoursePlayer,
                passProps: { lastStudyProgress: this.state.studyProgressDetail, setAuthorized:this.props.setAuthorized },
            });
        }
    },
    _measureLineHeight (e) {
        if (!this.state.lineheight) {
            const { height } = e.nativeEvent.layout;
            this.setState({ lineHeight: height + 41 });
        }
    },
    _measureLineHeightIntroduce (e) {
        if (!this.state.lineheightIntroduce) {
            const { height } = e.nativeEvent.layout;
            this.setState({ lineHeightIntroduce: height + 20 });
        }
    },
    doLookAll () {
        this.setState({ isLookAll: !this.state.isLookAll });
    },
    goTaskNextPage (index) {
        // index 为0,1,2 分别跳转到不同的页面
        app.navigator.push({
            component: WeekPlan,
            passProps: {
                indexPos: index,
                doIsOverTask: this.doIsOverTask,
            },
        });
    },
    goProgressNextPage (index) {
        // index 为0,1,2 分别跳转到不同的页面  课程学习 随堂测试 课后作业
        const tempTitle = this.state.studyProgressDetail.isOverTest ? '完成测试' : '随堂测试';
        switch (index) {
            case 0:
                app.navigator.push({
                    component: CoursePlayer,
                    passProps: { lastStudyProgress: this.state.studyProgressDetail, setAuthorized:this.props.setAuthorized },
                });
                break;
            case 1:
                app.navigator.push({
                    component: ClassTest,
                    title: tempTitle,
                    passProps: {
                        videoId: this.state.specialSoldierVedioID,
                        lastStudyProgress: this.state.studyProgressDetail,
                        isFromMainPage: true,
                        name: this.state.specialSoldierVedioName,
                    },
                });
                break;
            case 2:
                app.navigator.push({
                    component: ShareHomework,
                    passProps: { data:this.detailsMap },
                });
                break;
            default:

        }
    },
    openSpecops () {
        app.navigator.push({
            title: '开通赢销特种兵',
            component: OpenSpecops,
            passProps: { setAuthorized:this.props.setAuthorized, isPop:true },
        });
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
    toOpenSpecops () {
        app.navigator.push({
            title: '开通赢销特种兵',
            component: OpenSpecops,
            passProps: { setAuthorized:this.props.setAuthorized, isPop:true },
        });
    },
    render () {
        const { dayPlan, weekPlan, monthPlan, specialSoldierImgUrl, specialSoldierVedioName, isDayActuallydoing, isDaySummary, isEverydayQuestion, isWatchVideo, introductionTitle, introductionContent } = this.state;
        let strHour = '';
        if (moment().hour() <= 12) {
            strHour = '早上好！赢销特种兵';
        } else if (moment().hour() > 12 && moment().hour() < 19) {
            strHour = '下午好！赢销特种兵';
        } else {
            strHour = '晚上好！赢销特种兵';
        }
        const { isAgent, isSpecialSoldier } = app.personal.info;
        const authorized = isAgent || isSpecialSoldier;
        const { studyProgressDetail, isLookAll } = this.state;
        const { specops_study_unfinish, specops_study_finished, specops_test_unfinish, specops_test_finished, specops_homework_unfinish, specops_homework_finished } = app.img;
        const { specops_complete, specops_conclusion, specops_remark } = app.img;
        const progress = studyProgressDetail && studyProgressDetail.studyProgress || 0;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.pageContainer}>
                    {
                        !isWatchVideo &&
                        <Image
                            resizeMode='stretch'
                            source={{ uri: specialSoldierImgUrl }}
                            style={styles.backgroundStyle}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.specops_video_overlayer}
                                style={styles.overlayBackgroundStyle}>
                                <View
                                    style={styles.videoTextStyle}>
                                    <Text style={styles.videoText}>{specialSoldierVedioName && specialSoldierVedioName}</Text>
                                </View>
                            </Image>
                            <TouchableOpacity
                                onPress={this.playCourse}
                                style={styles.bannerTouch}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.specops_play}
                                    style={styles.videoIcon} />
                            </TouchableOpacity>
                        </Image>
                    }

                    <View style={styles.personIntroductionStyle}>
                        {
                            this.props.isSpecialSoldier ?
                                <View style={[styles.titleContainer, { marginLeft: 8 }]}>
                                    <Text style={[styles.nameText, { color: '#404040' }]}>{strHour}</Text>
                                    <Text numberOfLines={1} style={[styles.nameText, { marginLeft: 15, color: '#FF6363', width: sr.ws(150) }]}>{app.personal.info.name}</Text>
                                </View>
                            :
                                <View style={[styles.titleContainer, { justifyContent: 'space-between' }]}>
                                    <Text style={[styles.nameTextJoin, { marginLeft: 19, color: '#404040' }]}>{'加入特种兵，体验更优质的服务。'}</Text>
                                    <TouchableOpacity
                                        onPress={this.toOpenSpecops}
                                        style={styles.joinSpecopsTouch}>
                                        <Text numberOfLines={1} style={styles.joinSpecopsText}>{'加入特种兵'}</Text>
                                    </TouchableOpacity>
                                </View>
                        }
                        <View style={styles.divisionLine} />
                        <View style={styles.personStyle}>
                            <Image resizeMode='stretch' source={app.img.specops_wangyu} style={styles.headStyle} />
                            <View style={[styles.talkBubbleSquare, { height: this.state.lineHeightIntroduce }]}>
                                <Text onLayout={this._measureLineHeightIntroduce} style={styles.introduceText}>{introductionTitle || '赢销截拳道是王老师经过N十年的研发的一个课程'}</Text>
                            </View>
                            <View style={styles.talkBubbleTriangle} />
                        </View>
                        <View style={[styles.synopsisStyle, { height: this.state.lineHeight }]}>
                            <Text onLayout={this._measureLineHeight} numberOfLines={isLookAll ? 200 : 2} style={styles.synopsisText}>
                                {introductionContent && introductionContent}
                            </Text>
                            <TouchableOpacity onPress={this.doLookAll} style={styles.lookAllStyle}>
                                <Text style={styles.lookAllText}>{isLookAll ? '收起内容' : '查看全部'}</Text>
                                <Image resizeMode='contain' source={isLookAll ? app.img.specops_up : app.img.specops_down} style={styles.iconStyle} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.todayTaskStyle}>
                        <View style={[styles.titleContainer, { backgroundColor: '#C8B086' }]}>
                            <View style={styles.taskView} />
                            <Text style={[styles.nameText, { color: '#FFFFFF' }]}>今日任务</Text>
                        </View>
                        <View style={styles.divisionLine} />
                        <View style={styles.menuContainer}>
                            <TouchableOpacity onPress={authorized ? this.goTaskNextPage.bind(null, 0) : this.openSpecops} style={styles.menuStyle}>
                                <Image resizeMode='contain' source={specops_complete} style={styles.menuImage} />
                                <Text style={styles.menuText}>{'今日实际'}</Text>
                                <View style={[styles.menuView, isDayActuallydoing ? { backgroundColor: '#C7C7C7' } : { backgroundColor: '#FF6363' }]}>
                                    <Text style={styles.menuStatusText}>{isDayActuallydoing ? '已填写' : '未填写'}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={authorized ? this.goTaskNextPage.bind(null, 1) : this.openSpecops} style={styles.menuStyle}>
                                <Image resizeMode='contain' source={specops_conclusion} style={styles.menuImage} />
                                <Text style={styles.menuText}>{'今日总结'}</Text>
                                <View style={[styles.menuView, isDaySummary ? { backgroundColor: '#C7C7C7' } : { backgroundColor: '#FF6363' }]}>
                                    <Text style={styles.menuStatusText}>{isDaySummary ? '已填写' : '未填写'}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={authorized ? this.goTaskNextPage.bind(null, 2) : this.openSpecops} style={styles.menuStyle}>
                                <Image resizeMode='contain' source={specops_remark} style={styles.menuImage} />
                                <Text style={styles.menuText}>{'每日三省'}</Text>
                                <View style={[styles.menuView, isEverydayQuestion ? { backgroundColor: '#C7C7C7' } : { backgroundColor: '#FF6363' }]}>
                                    <Text style={styles.menuStatusText}>{isEverydayQuestion ? '已填写' : '未填写'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.studyProgressStyle}>
                        <View style={[styles.titleContainer, { backgroundColor: '#C8B086' }]}>
                            <View style={styles.taskView} />
                            <Text style={[styles.nameText, { color: '#FFFFFF' }]}>本周学习进度</Text>
                        </View>
                        {
                            isWatchVideo ?
                                <Image
                                    resizeMode='stretch'
                                    source={{ uri: specialSoldierImgUrl }}
                                    style={styles.backgroundStyle}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_video_overlayer}
                                        style={styles.overlayBackgroundStyle}>
                                        <View
                                            style={styles.videoTextStyle}>
                                            <Text style={styles.videoText}>{specialSoldierVedioName && specialSoldierVedioName}</Text>
                                        </View>
                                    </Image>
                                    <TouchableOpacity
                                        onPress={this.playCourse}
                                        style={styles.bannerTouch}>
                                        <Image
                                            resizeMode='stretch'
                                            source={app.img.specops_play}
                                            style={styles.videoIcon} />
                                    </TouchableOpacity>
                                </Image>
                            :
                                <View style={styles.divisionLine} />
                        }
                        <View style={styles.menuContainer}>
                            <TouchableOpacity onPress={this.goProgressNextPage.bind(null, 0)} style={styles.menuStyle}>
                                <Image resizeMode='contain' source={isWatchVideo ? specops_study_finished : specops_study_unfinish} style={styles.menuProgressImage} />
                                <Text style={[styles.menuProgressStatusText, isWatchVideo ? { color: '#C7C7C7' } : { color: '#FF6363' }]}>{isWatchVideo ? '已完成' : '未完成'}</Text>
                                <Text style={styles.menuProgressText}>{'课程学习'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.goProgressNextPage.bind(null, 1)} style={styles.menuStyle}>
                                <Image resizeMode='contain' source={(studyProgressDetail && studyProgressDetail.isOverTest) ? specops_test_finished : specops_test_unfinish} style={styles.menuProgressImage} />
                                <Text style={[styles.menuProgressStatusText, studyProgressDetail && studyProgressDetail.isOverTest ? { color: '#C7C7C7' } : { color: '#FF6363' }]}>{studyProgressDetail && studyProgressDetail.isOverTest ? '已完成' : '未完成'}</Text>
                                <Text style={styles.menuProgressText}>{'随堂测试'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.goProgressNextPage.bind(null, 2)} style={styles.menuStyle}>
                                <Image resizeMode='contain' source={(studyProgressDetail && studyProgressDetail.isOverTask) ? specops_homework_finished : specops_homework_unfinish} style={styles.menuProgressImage} />
                                <Text style={[styles.menuProgressStatusText, studyProgressDetail && studyProgressDetail.isOverTask ? { color: '#C7C7C7' } : { color: '#FF6363' }]}>{studyProgressDetail && studyProgressDetail.isOverTask ? '已完成' : '未完成'}</Text>
                                <Text style={styles.menuProgressText}>{'课后作业'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.progressStyle}>
                            <View style={styles.progressViewStyle}>
                                <Progress.Bar
                                    progress={progress / 100}
                                    width={sr.ws(sr.w - 77)}
                                    height={sr.ws(5)}
                                    borderRadius={sr.ws(3)}
                                    animated
                                    borderWidth={1}
                                    borderColor='#FFFFFF'
                                    color='#FF6363' />
                            </View>
                            <Text style={styles.progressText}>{`${studyProgressDetail.studyProgress}%`}</Text>
                        </View>
                    </View>
                    <WorkTask allPlanDetail={this.state.allPlanDetail} style={styles.workTaskStyle} openSpecops={this.openSpecops} />
                </ScrollView>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    pageContainer: {
        flex: 1,
        marginBottom: 49,
    },
    bannerTouch: {
        width: sr.w,
        height: 180,
        left: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundStyle: {
        width: sr.w,
        height: 180,
    },
    videoIcon: {
        width: 51,
        height: 51,
    },
    videoTextStyle: {
        width: sr.w,
        height: 39,
        left: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    overlayBackgroundStyle: {
        width: sr.w,
        height: 180,
        left: 0,
        bottom: 0,
        position: 'absolute',
    },
    videoText: {
        width: sr.w - 50,
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'STHeitiSC-Medium',
        backgroundColor: 'transparent',
    },
    personIntroductionStyle: {
        width: sr.w,
        backgroundColor: '#FFFFFF',
    },
    titleContainer: {
        width: sr.w,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    joinSpecopsText: {
        fontSize: 15,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
    },
    joinSpecopsTouch: {
        width: 100,
        height: 35,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#db3237',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#d90000',
    },
    taskView: {
        width: 10,
        height: 44,
        backgroundColor: '#99886A',
    },
    nameTextJoin: {
        fontSize: 15,
        marginLeft: 11,
        fontFamily: 'STHeitiSC-Medium',
    },
    nameText: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 11,
        fontFamily: 'STHeitiSC-Medium',
    },
    divisionLine: {
        width: sr.w - 38,
        height: 1,
        marginLeft: 19,
        backgroundColor: '#E9E9E9',
    },
    personStyle: {
        marginLeft: 26,
        marginRight: 30,
        marginTop: 8,
        flexDirection: 'row',
    },
    headStyle: {
        width: 58,
        height: 72,
        marginTop: 8,
    },
    talkBubbleSquare: {
        width: sr.w - 122,
        marginTop: 13,
        marginLeft: 13,
        backgroundColor: '#FF6363',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    talkBubbleTriangle: {
        position: 'absolute',
        left: 62,
        top: 23,
        width: 0,
        height: 0,
        borderTopColor: 'transparent',
        borderTopWidth: 10,
        borderRightWidth: 15,
        borderRightColor: '#FF6363',
        borderBottomWidth: 5,
        borderBottomColor: 'transparent',
        transform: [
            { rotate: '28deg' },
        ],
    },
    introduceText: {
        fontSize: 16,
        color: '#FFFFFF',
        lineHeight: 22,
        marginHorizontal: 10,
        fontFamily: 'STHeitiSC-Medium',
    },
    synopsisStyle: {
        width: sr.w - 38,
        marginLeft: 19,
        marginRight: 19,
        marginTop: 11,
    },
    synopsisText: {
        width: sr.w - 38,
        fontSize: 14,
        lineHeight: 20,
        color: '#404040',
        fontFamily: 'STHeitiSC-Medium',
    },
    lookAllStyle: {
        width: 100,
        height: 20,
        bottom: 12,
        left: sr.w / 2 - 50,
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
    },
    lookAllText: {
        fontSize: 14,
        color: '#45B0F7',
        fontFamily: 'STHeitiSC-Medium',
        backgroundColor: 'transparent',
    },
    iconStyle: {
        width: 11,
        height: 11,
        marginLeft: 6,
    },
    todayTaskStyle: {
        width: sr.w,
        height: 180,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
    },
    menuContainer: {
        marginTop: 17,
        alignItems: 'center',
        flexDirection: 'row',
    },
    menuStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuImage: {
        width: 37,
        height: 37,
    },
    menuText: {
        color: '#626262',
        fontSize: 12,
        marginTop: 10,
        fontFamily: 'STHeitiSC-Medium',
    },
    menuView: {
        width: 67,
        height: 23,
        marginTop: 12,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuStatusText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
    },
    studyProgressStyle: {
        width: sr.w,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
    },
    menuProgressImage: {
        width: 34,
        height: 34,
    },
    menuProgressStatusText: {
        fontSize: 10,
        marginTop: 6,
        fontFamily: 'STHeitiSC-Medium',
    },
    menuProgressText: {
        marginTop: 6,
        fontSize: 14,
        color: '#404040',
        fontFamily: 'STHeitiSC-Medium',
    },
    progressStyle: {
        width: sr.w - 34,
        height: 20,
        marginLeft: 17,
        marginTop: 12,
        marginBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
    },
    progressViewStyle: {
        width: sr.w - 77,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E9E9E9',
    },
    progressText: {
        fontSize: 14,
        height: 20,
        marginLeft: 16,
        color: '#404040',
        fontFamily: 'STHeitiSC-Medium',
    },
    workTaskStyle: {
        width: sr.w,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
    },
});
