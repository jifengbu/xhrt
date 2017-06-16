'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    Image,
    StyleSheet,
    Text,
    View,
    BackAndroid,
    Navigator,
    TouchableOpacity,
    TouchableHighlight,
    Animated,
    ScrollView,
} = ReactNative;

const Setting = require('./Setting.js');
const TaskRecords = require('./TaskRecords.js');
const LearningRecords = require('./LearningRecords.js');
const CourseRecords = require('./CourseRecords.js');
const AlreadyBuyCourse = require('./AlreadyBuyCourse.js');
const MyRoomList = require('../meeting/MyRoomList.js');
const ActualCombatRecord = require('../actualCombat/ActualCombatRecord.js');
const AgentManager = require('./AgentManager.js');
const AgentReturns = require('../theAgent/AgentReturns.js');
const AppointmentSetting = require('../live/AppointmentSetting.js');
const MyIntegral = require('./MyIntegral.js');
const Wallet = require('../wallet/index.js');
const BossIndex = require('../specopsBoss/index.js');
const BuyRecommend = require('../wallet/BuyRecommend.js');
const BuySpecops = require('../wallet/BuySpecops.js');
const Recommend = require('../wallet/Recommend.js');
const ImgFileMgr = require('../../manager/ImgFileMgr.js');
var NewsList = require('../home/NewsList.js');

const { Button, DImage, WebviewMessageBox } = COMPONENTS;
import Badge from 'react-native-smart-badge';

const MenuItem = React.createClass({
    showChildPage () {
        if (this.props.page.title === '特种兵课程') {
            app.navigator.push({
                title: this.props.page.title,
                component: this.props.page.module,
                passProps: { showCount:false },
                sceneConfig: {
                    ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null,
                },
            });
            return;
        }
        if (this.props.page.title === '学习记录' || '已购视频') {
            app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
            app.navigator.push({
                component: this.props.page.module,
                passProps: { briefDisplay: false },
                sceneConfig: {
                    ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null,
                },
            });
            return;
        }
        if (this.props.page.title === '企业管理') {
            app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
            app.navigator.push({
                component: this.props.page.module,
                passProps: { companyInfo:this.props.companyInfo },
                sceneConfig: {
                    ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null,
                },
            });
            return;
        }
    },
    render () {
        const { title, img, info, seprator } = this.props.page;
        const { companyInfo } = this.props;
        const headUrl = companyInfo && companyInfo.logo ? companyInfo.logo : app.img.common_default;
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.showChildPage}
                    style={seprator ? styles.ItemBg2 : styles.ItemBg}>
                    <View style={styles.infoStyle}>
                        <Text style={styles.itemNameText}>{title}</Text>
                    </View>
                    <View style={styles.infoStyleRight}>
                        <Text style={styles.itemNoticeText}>{info}</Text>
                        <Image
                            resizeMode='stretch'
                            source={app.img.common_go}
                            style={styles.icon_go} />
                    </View>
                </TouchableOpacity>
                {
                    (title === '企业管理' && companyInfo) &&
                    <TouchableOpacity onPress={this.showChildPage.bind(null, this.props.page)}>
                        <View style={styles.companyContainer}>
                            <View style={styles.companyInfoContainer}>
                                <DImage
                                    resizeMode='cover'
                                    style={styles.headerCircle}
                                    source={app.img.specopsBoss_head_circle}>
                                    <DImage
                                        resizeMode='cover'
                                        defaultSource={app.img.personal_head}
                                        source={companyInfo.logo ? { uri: headUrl } : headUrl}
                                        style={styles.headerIcon} />
                                </DImage>
                                <View style={styles.companyInfoStyle}>
                                    <Text style={styles.companyNameText} numberOfLines={2}>
                                        {companyInfo.name}
                                    </Text>
                                    <View style={styles.goBossView}>
                                        <Image resizeMode='stretch' source={app.img.personal_enter_boss} style={styles.goBossIcon}>
                                        </Image>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.companyDetailContainer}>
                                <View style={styles.panelContainer}>
                                    <View style={styles.numberContainer}>
                                        <Text style={styles.numberStyle}>
                                            {companyInfo.operatorCount}
                                        </Text>
                                    </View>
                                    <Text style={styles.numberText}>开通特种兵人数</Text>
                                </View>
                                <View style={styles.vline} />
                                <View style={styles.panelContainer}>
                                    <View style={styles.numberContainer}>
                                        <Text style={styles.numberStyle}>
                                            {companyInfo.enterDays}
                                        </Text>
                                    </View>
                                    <Text style={styles.numberText}>企业入驻天数</Text>
                                </View>
                                <View style={styles.vline} />
                                <View style={styles.panelContainer}>
                                    <View style={styles.numberContainer}>
                                        <Text style={styles.numberStyle}>
                                            {companyInfo.todaySignInCount}
                                        </Text>
                                    </View>
                                    <Text style={styles.numberText}>今日登录人数</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                }
                {
                    title === '已购视频' &&
                    <AlreadyBuyCourse briefDisplay={true} learningRecordBase={this.props.learningRecordBase}/>
                }
                {
                    title === '特种兵课程' &&
                    <CourseRecords showCount />
                }
                {
                    title === '学习记录' &&
                    <LearningRecords briefDisplay learningRecordBase={this.props.learningRecordBase} />
                }
            </View>
        );
    },
});

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        leftButton: { image: app.img.personal_set, handler: () => { app.scene.toggleMenuPanel(); } },
        rightButton: { image: app.img.wallet_message, handler: ()=>{
            app.navigator.push({
                component: NewsList,
            });
        }},
    },
    getChildPages (courseData, learningRecordBase, companyInfo) {
        const total = learningRecordBase.total || '';
        const { isAgent, isSpecialSoldier } = app.personal.info;
        return [
            { seprator:true, title:'企业管理', module: BossIndex, img:app.img.personal_order, info:'', hidden:!companyInfo },
            { seprator:true, title:'已购视频', module: AlreadyBuyCourse, img:app.img.personal_order, info:courseData && courseData.length + '个视频', hidden:(isAgent == 0 && isSpecialSoldier == 0) },
            { seprator:true, title:'特种兵课程', module: CourseRecords, img:app.img.personal_order, info:courseData && courseData.length + '节课', hidden:(isAgent == 0 && isSpecialSoldier == 0) },
            { seprator:true, title:'学习记录', module: LearningRecords, img:app.img.personal_order, info:'已经学习' + total + '节课' },
        ].map((item, i) => !item.hidden && <MenuItem page={item} key={i} learningRecordBase={learningRecordBase} courseData={courseData} companyInfo={companyInfo} />);
    },
    getInitialState () {
        return {
            learningRecordBase:{},
            courseData:[],
            amount: 0,
        };
    },
    componentWillMount () {
        app.updateNavbarColor('#DE3031');
    },
    onWillFocus () {
        app.updateNavbarColor('#DE3031');
        this.getUserSumAmount();// 获取钱包余额
    },
    onWillHide () {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
    },
    componentDidMount () {
        this.doGetPersonalInfo();
        this.getLearningRecord();
        this.getStudyProgressList();// 获取我的课程列表
        this.getUserSumAmount();// 获取钱包余额
    },
    doRefresh () {
        this.doGetPersonalInfo();
        this.getLearningRecord();
        this.getStudyProgressList();// 获取我的课程列表
    },
    getLearningRecord () {
        const param = {
            userID: app.personal.info.userID,
            pageNo: 1,
        };
        POST(app.route.ROUTE_SUBMIT_GETMYLEARNINGRECORD, param, this.getLearningRecordSuccess);
    },
    getLearningRecordSuccess (data) {
        if (data.success) {
            const learningRecordBase = {
                total:data.context.total,
                lastTimeWatch:data.context.lastTimeWatch,
                monthTotal:data.context.monthTotal,
                videoList:[],
            };
            if (data.context.videoList) {
                learningRecordBase.videoList = data.context.videoList.length > 3 ? data.context.videoList.splice(0, 3) : data.context.videoList;
            }

            this.setState({ learningRecordBase:learningRecordBase });
        }
    },
    getStudyProgressList () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_STUDY_PROGRESS_LIST, param, this.getStudyProgressListSuccess);
    },
    getStudyProgressListSuccess (data) {
        if (data.success) {
            const { courseList } = data.context;
            if (courseList) {
                this.setState({ courseData:courseList });
            }
        }
    },
    getUserSumAmount () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_USER_SUMAMOUNT, param, this.getUserSumAmountSuccess);
    },
    getUserSumAmountSuccess (data) {
        if (data.success) {
            const { amount } = data.context;
            let money = amount*1/100;
            this.setState({ amount:money});
        }
    },
    doGetPersonalInfo () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_PERSONAL_INFO, param, this.getPersonalInfoSuccess);
    },
    getPersonalInfoSuccess (data) {
        if (data.success) {
            const context = data.context;
            context['userID'] = app.personal.info.userID;
            context['phone'] = app.personal.info.phone;
            app.personal.set(context);
            // 初始化学习视频数据
            const studyNumInfo = app.studyNumMgr.info;
            if (studyNumInfo) {
                if (studyNumInfo.time != app.utils.getCurrentDateString()) {
                    app.studyNumMgr.initStudyNum();
                }
            } else {
                app.studyNumMgr.initStudyNum();
            }

            // down share img
            ImgFileMgr.downImgFile(data.context.extensionImg);
        }
    },
    toggleMenuPanel () {
        // app.THEME_COLOR = CONSTANTS.THEME_COLORS[1];
        // app.update();
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
        app.navigator.push({
            title: '设置',
            component: Setting,
            passProps:{ doRefresh:this.doRefresh },
            sceneConfig: {
                ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null,
            },
        });
    },
    showNews () {
        const { isAgent, isSpecialSoldier, recommendAmbassador, feeQRCode} = app.personal.info;
        let isSpecops = isAgent || isSpecialSoldier;
        if (isSpecops) {
            if (recommendAmbassador==1) {
                app.navigator.push({
                    component: Recommend,
                    passProps:{ feeQRCode },
                });
            } else {
                app.navigator.push({
                    component: BuyRecommend,
                });
            }
        } else {
            app.navigator.push({
                component: BuySpecops,
            });
        }
    },
    showIntegral () {
        // app.THEME_COLOR = CONSTANTS.THEME_COLORS[1];
        // app.update();
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
        app.navigator.push({
            component: MyIntegral,
            passProps: {},
            sceneConfig: {
                ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null,
            },
        });
    },
    showWallet () {
        app.updateNavbarColor('red');
        app.navigator.push({
            component: Wallet,
            sceneConfig: {
                ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null,
            },
        });
    },
    calculateStrLength (oldStr) {
        let height = 0;
        let linesWidth = 0;
        if (oldStr) {
            oldStr = oldStr.replace(/<\/?.+?>/g, /<\/?.+?>/g, '');
            oldStr = oldStr.replace(/[\r\n]/g, '|');
            const StrArr = oldStr.split('|');
            for (let i = 0; i < StrArr.length; i++) {
                // 计算字符串长度，一个汉字占2个字节
                linesWidth = StrArr[i].replace(/[^\x00-\xff]/g, 'aa').length;
            }
            return linesWidth;
        }
    },
    render () {
        const info = app.personal.info;
        const companyInfo = info.companyInfo;
        const name = info.name ? info.name : '';
        const post = info.post ? info.post : '';
        const company = info.company ? info.company : '';
        const headUrl = info.headImg ? info.headImg : info.sex === 1 ? app.img.personal_sex_male : app.img.personal_sex_female;
        const { courseData, learningRecordBase, amount} = this.state;
        const nameTemWidth = this.calculateStrLength(name);
        const nameWidth = nameTemWidth * 10+7;
        const money = parseFloat(amount).toFixed(2);
        return (
            <View style={styles.container}>
                <ScrollView style={styles.pageContainer}>
                    <View
                        style={styles.headItemBg}>
                        <View
                            style={styles.iconBackground}>
                            <View style={styles.topView}>
                                {
                                    <DImage
                                        resizeMode='cover'
                                        defaultSource={app.img.personal_head}
                                        source={info.headImg ? { uri: headUrl } : headUrl}
                                        style={styles.headStyle} />
                                }
                                <View style={styles.headRightView}>
                                    <View style={styles.nameStyle}>
                                        <Text style={[styles.nameText, { width: nameWidth > 150 ? sr.ws(150) : sr.ws(nameWidth) }]} numberOfLines={1}>
                                            {name}
                                        </Text>
                                        <Text style={styles.levelText}>
                                            {info.alias}
                                        </Text>
                                    </View>
                                    <View style={styles.nameBottomCompanyStyle}>
                                        <Text
                                            numberOfLines={1}
                                            style={styles.nameBottomText}>
                                            {company + post}
                                        </Text>
                                    </View>
                                    <View style={styles.nameBottomStyle}>
                                        <Text
                                            numberOfLines={1}
                                            style={styles.companyPositionText}>
                                            {'已累计学习'}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={styles.nameBottomDayText}>
                                            {app.personal.info.continuousLogin}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={styles.companyPositionText}>
                                            {'天'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.infoStyle2}>
                                <View style={styles.loginTimesView}>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.loginTimesText}>
                                        {'本月你第' + app.personal.info.monthLoginNum + '次登录'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={this.showNews}
                                    style={styles.recommend}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.personal_recommend}
                                        style={styles.recommendImg} />
                                </TouchableOpacity>
                            </View>
                            <Image resizeMode='cover'
                                source={app.img.personal_right}
                                style={styles.buttonStyle}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={this.showWallet}
                                    style={styles.buttonStyle1}>
                                    <View style={styles.iconBackgroundLeft}>
                                        <Image
                                            resizeMode='stretch'
                                            source={app.img.wallet_wallet}
                                            style={styles.iconSmall} />
                                        <Text style={styles.infoTextLeft}>{'钱包  ￥' + money}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ width:1, borderRadius:1, height:28, alignSelf:'center', backgroundColor:'#BE4546' }} />
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={this.showIntegral}
                                    style={styles.buttonStyle1}>
                                    <View style={styles.iconBackgroundLeft}>
                                        <Image
                                            resizeMode='stretch'
                                            source={app.img.wallet_integral}
                                            style={styles.iconSmall} />
                                        <Text style={styles.infoTextRight}>{'积分  ' + info.integral}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Image>
                        </View>
                    </View>
                    {
                        this.getChildPages(courseData, learningRecordBase, companyInfo)
                    }
                </ScrollView>
            </View>
        );
    },
});

const NAVBAR_HEIGHT = sr.rws(Navigator.NavigationBar.Styles.General.NavBarHeight);
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#F0EFF5',
        flexDirection: 'column',
    },
    pageContainer: {
        flex:1,
        marginBottom: 49,
    },
    headItemBg: {
        height: 195,
        width: sr.w,
        backgroundColor: 'blue',
    },
    ItemBg2: {
        marginTop: 7,
        marginBottom: 1,
        height: 45,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    ItemBg: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 45,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    fadeNavigator: {
        height:sr.trueTotalNavHeight,
        backgroundColor:'#DE3031',
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    lineView: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 1,
        width: sr.w,
        backgroundColor: '#DE3031',
    },
    closeButtonContainer: {
        marginTop: 20,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    setButtonContainer: {
        marginTop: 20,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        width: NAVBAR_HEIGHT * 0.6,
        height: NAVBAR_HEIGHT * 0.6,
    },
    setButton: {
        width: NAVBAR_HEIGHT * 0.6,
        height: NAVBAR_HEIGHT * 0.6,
    },
    topView: {
        flexDirection: 'row',
    },
    headStyle: {
        marginTop: 15,
        marginLeft: 46,
        width: 71,
        height: 71,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        borderRadius: 35.5,
    },
    headRightView: {
        marginTop: 12,
        marginBottom: 8,
    },
    iconBackground: {
        width: sr.w,
        height: 195,
        backgroundColor:'#DE3031',
    },
    iconBackgroundLeft: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    iconSmall: {
        width: 16,
        height: 15,
        marginLeft: 35,
        marginRight: 5,
    },
    buttonStyle: {
        position:'absolute',
        bottom:0,
        left:0,
        width:sr.w,
        height:45,
        flexDirection: 'row',
    },
    buttonStyle1: {
        flex: 1,
        justifyContent: 'center',
    },
    icon_go: {
        width: 10,
        height: 16,
    },
    infoStyle2: {
        width: sr.w,
        height: 60,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    nameBottomText: {
        fontSize: 12,
        width:200,
        color:'white',
        marginVertical: 5,
        backgroundColor: 'transparent',
    },
    companyPositionText: {
        fontSize: 12,
        color:'white',
    },
    nameBottomDayText: {
        fontSize: 20,
        color:'#FFE689',
        marginTop: -5,
    },
    loginTimesText: {
        marginLeft: 26,
        fontSize: 12,
        color:'#FFB6B7',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
    cashText: {
        fontSize: 14,
        color: '#2C2E2C',
    },
    moneyText: {
        fontSize: 15,
        color: '#A60245',
    },
    infoText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 5,
    },
    infoTextLeft: {
        fontSize: 12,
        color: '#FFFFFF',
        marginHorizontal: 5,
        backgroundColor: 'transparent',
    },
    infoTextRight: {
        fontSize: 12,
        width: 98,
        color: '#FFFFFF',
        marginHorizontal: 5,
        backgroundColor: 'transparent',
    },
    nameStyle: {
        height: 26,
        width: sr.w,
        marginLeft: 26,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    nameBottomCompanyStyle: {
        width: 210,
        height: 25,
        marginLeft: 26,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    nameBottomStyle: {
        height: 25,
        width: 200,
        marginLeft: 26,
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    loginTimesView: {
        height: 38,
        width: sr.w - 180,
        justifyContent: 'center',

    },
    recommend: {
        height: 60,
        width: 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    recommendImg: {
        width: 78,
        height: 59,
    },
    moneyStyle: {
        height: 39,
        width: sr.w,
        marginTop: 8,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    cashStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameText: {
        fontSize: 16,
        color:'white',
    },
    levelText: {
        fontSize: 12,
        marginLeft:10,
        marginTop:2,
        width:120,
        color:'#FFE689',
    },
    infoStyle: {
        height: 30,
        marginLeft: 29,
        justifyContent: 'center',
    },
    infoStyleRight: {
        flexDirection: 'row',
        height: 30,
        marginRight: 15,
        alignItems: 'center',
    },
    itemNameText: {
        fontSize: 16,
        fontFamily: 'STHeitiSC-Medium',
        color: '#252525',
    },
    itemNoticeText: {
        marginRight: 10,
        width: 100,
        fontSize: 12,
        textAlign: 'right',
        fontFamily: 'STHeitiSC-Medium',
        color: '#878787',
    },
    companyContainer: {
        width: sr.w,
        height: 157,
        alignSelf: 'center',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    companyInfoContainer: {
        height: 82,
        flexDirection: 'row',
    },
    headerCircle: {
        width: 54,
        height: 54,
        marginLeft: 27,
        marginTop: 13,
        borderRadius: 27,
        alignItems: 'center',
    },
    headerIcon: {
        width: 48,
        height: 48,
        marginTop: 1,
        borderRadius: 24,
    },
    companyInfoStyle: {
        flex:1,
        marginLeft: 17,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    companyNameText: {
        width: 170,
        fontSize: 18,
        color: '#000000',
        fontFamily: 'STHeitiSC-Medium',
    },
    goBossView: {
        width: 75,
        height: 31,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        backgroundColor: '#F15D5F'
    },
    goBossIcon: {
        width: 54,
        height: 18,
    },
    divisionLine: {
        width: sr.w - 24,
        height: 1,
        alignSelf: 'center',
        backgroundColor: '#F8F8F8',
    },
    companyDetailContainer: {
        height: 62,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    panelContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    numberContainer: {
        height: 24,
        flexDirection: 'row',
        marginBottom: 6,
    },
    numberStyle: {
        color: '#FF5E5F',
        fontSize: 20,
        fontFamily: 'STHeitiSC-Medium',
    },
    numberText: {
        color: '#848484',
        fontSize: 12,
        lineHeight: 21,
        fontFamily: 'STHeitiSC-Medium',
    },
    vline: {
        width: 1,
        height: 45,
        backgroundColor: '#EEEEEE',
    },
});
