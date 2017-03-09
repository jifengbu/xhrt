'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
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

var MyNews = require('./MyNews.js');
var Setting = require('./Setting.js');
var TaskRecords = require('./TaskRecords.js');
var LearningRecords = require('./LearningRecords.js');
var CourseRecords = require('./CourseRecords.js');
var MyRoomList = require('../meeting/MyRoomList.js');
var ActualCombatRecord = require('../actualCombat/ActualCombatRecord.js');
var AgentManager = require('./AgentManager.js');
var AgentReturns = require('../theAgent/AgentReturns.js');
var AppointmentSetting = require('../live/AppointmentSetting.js');
var MyIntegral = require('./MyIntegral.js');
var BossIndex = require('../specopsBoss/index.js');

var {Button, DImage, WebviewMessageBox} = COMPONENTS;
import Badge from 'react-native-smart-badge'

var MenuItem = React.createClass({
    showChildPage() {
        if (this.props.page.title==='我的课程') {
            app.navigator.push({
                title: this.props.page.title,
                component: this.props.page.module,
                passProps: {showCount:false},
                sceneConfig: {
                    ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null
                }
            });
            return;
        }
        if (this.props.page.title==='学习记录') {
            app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
            app.navigator.push({
                component: this.props.page.module,
                passProps: {briefDisplay: false},
                sceneConfig: {
                    ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null
                }
            });
            return;
        }
        if (this.props.page.title==='企业管理') {
            app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
            app.navigator.push({
                component: this.props.page.module,
                passProps: {companyInfo:this.props.companyInfo},
                sceneConfig: {
                    ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null
                }
            });
            return;
        }
    },
    render() {
        var {title, img, info, seprator} = this.props.page;
        let {companyInfo} = this.props;
        let headUrl = companyInfo&&companyInfo.logo?companyInfo.logo:app.img.common_default;
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
                            style={styles.icon_go}  />
                    </View>
                </TouchableOpacity>
                {
                    (title==='企业管理' && companyInfo) &&
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
                                        source={companyInfo.logo?{uri: headUrl}:headUrl}
                                        style={styles.headerIcon}  />
                                </DImage>
                                <View style={styles.companyInfoStyle}>
                                    <Text style={styles.companyNameText} numberOfLines={2}>
                                        {companyInfo.name}
                                    </Text>
                                    <Image resizeMode='stretch' source={app.img.specopsBoss_boss_entrance} style={styles.goBossIcon}>
                                        <Text style={styles.goBossText} numberOfLines={1}>{'进入管理端'}</Text>
                                    </Image>
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
                                <View style={styles.vline}/>
                                <View style={styles.panelContainer}>
                                    <View style={styles.numberContainer}>
                                        <Text style={styles.numberStyle}>
                                            {companyInfo.enterDays}
                                        </Text>
                                    </View>
                                    <Text style={styles.numberText}>企业入驻天数</Text>
                                </View>
                                <View style={styles.vline}/>
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
                    title==='我的课程' &&
                    <CourseRecords showCount={true} />
                }
                {
                    title==='学习记录' &&
                    <LearningRecords briefDisplay={true} learningRecordBase={this.props.learningRecordBase}/>
                }
            </View>
        )
    }
});

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        leftButton: { image: app.img.common_back, handler: ()=>{app.scene.goBack&&app.scene.goBack()}},
        rightButton: { image: app.img.personal_set, handler: ()=>{app.scene.toggleMenuPanel()}},
    },
    getChildPages(courseData,learningRecordBase, companyInfo) {
        let total = learningRecordBase.total || '';
        const {isAgent, isSpecialSoldier} = app.personal.info;
        return [
            {seprator:true, title:'企业管理', module: BossIndex, img:app.img.personal_order, info:'',hidden:!companyInfo},
            {seprator:true, title:'我的课程', module: CourseRecords, img:app.img.personal_order, info:courseData&&courseData.length+'节课',hidden:(isAgent==0&&isSpecialSoldier==0)},
            {seprator:true, title:'学习记录', module: LearningRecords, img:app.img.personal_order, info:'已经学习'+total+'节课'},
        ].map((item, i)=>!item.hidden&&<MenuItem page={item} key={i} learningRecordBase={learningRecordBase} courseData={courseData} companyInfo={companyInfo}/>)
    },
    getInitialState() {
        return {
            learningRecordBase:{},
            courseData:[],
        };
    },
    componentWillMount() {
        app.updateNavbarColor('#DE3031');
    },
    goBack() {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[0]);
        app.navigator.pop();
    },
    onWillFocus() {
        app.updateNavbarColor('#DE3031')
    },
    onWillHide() {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
    },
    // onWillHide() {
    //     app.toggleNavigationBar(true);
    // },
    // componentWillMount(){
    //     this.setState({integral:app.personal.info.integral});
    //     app.toggleNavigationBar(false);
    // },
    componentDidMount() {
        this.doGetPersonalInfo();
        this.getLearningRecord();
        this.getStudyProgressList();//获取我的课程列表
    },
    getLearningRecord() {
        var param = {
            userID: app.personal.info.userID,
            pageNo: 1,
        };
        POST(app.route.ROUTE_SUBMIT_GETMYLEARNINGRECORD, param, this.getLearningRecordSuccess);
    },
    getLearningRecordSuccess(data) {
        if (data.success) {
            var learningRecordBase = {
                total:data.context.total,
                lastTimeWatch:data.context.lastTimeWatch,
                monthTotal:data.context.monthTotal,
                videoList:[],
            }
            if (data.context.videoList) {
                learningRecordBase.videoList = data.context.videoList.length>3?data.context.videoList.splice(0,3):data.context.videoList;
            }

            this.setState({learningRecordBase:learningRecordBase});
        }
    },
    getStudyProgressList() {
        var param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_STUDY_PROGRESS_LIST, param, this.getStudyProgressListSuccess);
    },
    getStudyProgressListSuccess(data) {
        if (data.success) {
            let {courseList} = data.context;
            if (courseList) {
                this.setState({courseData:courseList});
            }
        }
    },
    doGetPersonalInfo() {
        var param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_PERSONAL_INFO, param, this.getPersonalInfoSuccess);
    },
    getPersonalInfoSuccess(data) {
        if (data.success) {
            var context = data.context;
            context['userID'] = app.personal.info.userID;
            context['phone'] = app.personal.info.phone;
            app.personal.set(context);
            //初始化学习视频数据
            var studyNumInfo = app.studyNumMgr.info;
            if (studyNumInfo) {
                if (studyNumInfo.time != app.utils.getCurrentDateString()) {
                    app.studyNumMgr.initStudyNum();
                }
            } else {
                app.studyNumMgr.initStudyNum();
            }
        }
    },
    toggleMenuPanel() {
        // app.THEME_COLOR = CONSTANTS.THEME_COLORS[1];
        // app.update();
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
        app.navigator.push({
            title: '设置',
            component: Setting,
            sceneConfig: {
                ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null
            }
        });
    },
    showNews() {
        // app.THEME_COLOR = CONSTANTS.THEME_COLORS[1];
        // app.update();
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
        app.navigator.push({
            component: MyNews,
            sceneConfig: {
                ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null
            }
        });
    },
    showIntegral() {
        // app.THEME_COLOR = CONSTANTS.THEME_COLORS[1];
        // app.update();
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
        app.navigator.push({
            component: MyIntegral,
            passProps: {},
            sceneConfig: {
                ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null
            }
        });
    },
    shouldComponentUpdate(nextProps, nextState) {
        return app.personal.info != null;
    },
    calculateStrLength(oldStr) {
        let height = 0;
        let linesWidth = 0;
        if (oldStr) {
            oldStr = oldStr.replace(/<\/?.+?>/g,/<\/?.+?>/g,"");
            oldStr = oldStr.replace(/[\r\n]/g, '|');
            let StrArr = oldStr.split('|');
            for (var i = 0; i < StrArr.length; i++) {
                //计算字符串长度，一个汉字占2个字节
                linesWidth = StrArr[i].replace(/[^\x00-\xff]/g,"aa").length;
            }
            return linesWidth;
        }
    },
    render() {
        var info = app.personal.info;
        var companyInfo = info.companyInfo;
        let name = info.name?info.name:'';
        let post = info.post?info.post:'';
        let company = info.company?info.company:'';
        let headUrl = info.headImg?info.headImg:info.sex===1?app.img.personal_sex_male:app.img.personal_sex_female;
        let {courseData, learningRecordBase} = this.state;
        let nameTemWidth = this.calculateStrLength(name);
        let nameWidth = nameTemWidth*10;
        return (
            <View style={styles.container}>
                <ScrollView>
                <View
                    style={styles.headItemBg}>
                    <View
                        style={styles.iconBackground}>
                        <View style={styles.topView}>
                            {
                                <DImage
                                    resizeMode='cover'
                                    defaultSource={app.img.personal_head}
                                    source={info.headImg?{uri: headUrl}:headUrl}
                                    style={styles.headStyle}  />
                            }
                            <View style={styles.headRightView}>
                                <View style={styles.nameStyle}>
                                    <Text style={[styles.nameText, {width: nameWidth>150?sr.ws(150):sr.ws(nameWidth)}]} numberOfLines={1}>
                                        {name}
                                    </Text>
                                    {
                                        // true &&
                                        // <Image
                                        //     resizeMode='stretch'
                                        //     source={app.img.personal_badge2}
                                        //     style={styles.icon_vip} />
                                    }
                                    <Text style={styles.levelText}>
                                        {info.alias}
                                    </Text>
                                </View>
                                <View style={styles.nameBottomCompanyStyle}>
                                    <Text
                                        numberOfLines={1}
                                        style={styles.nameBottomText}>
                                        {company+post}
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
                                    {'本月你第'+app.personal.info.monthLoginNum+'次登录'}
                                </Text>
                            </View>
                            {
                                // !CONSTANTS.ISSUE_IOS &&
                                // <View style={styles.moneyStyle}>
                                //     <View style={styles.cashStyle}>
                                //         <Text style={styles.moneyText}>
                                //             {this.state.integral}
                                //         </Text>
                                //         <Text style={styles.cashText}>
                                //             {'赢销积分'}
                                //         </Text>
                                //     </View>
                                //     <View style={styles.cashStyle}>
                                //         <Text style={styles.moneyText}>
                                //             {app.personal.info.winCoin}
                                //         </Text>
                                //         <Text style={styles.cashText}>
                                //             {'赢销币'}
                                //         </Text>
                                //     </View>
                                // </View>
                            }
                        </View>
                        <Image resizeMode='cover'
                            source={app.img.personal_right}
                            style={styles.buttonStyle}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this.showIntegral}
                                style={styles.buttonStyle1}>
                                <View style={styles.iconBackgroundLeft}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.personal_talent}
                                        style={styles.iconSmall1}/>
                                    <Text style={[styles.infoTextLeft,{color: '#FFFFFF'}]}>{'成长积分: '+info.integral}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{width:1,borderRadius:1, height:28,alignSelf:'center', backgroundColor:'#BE4546'}}></View>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this.showNews}
                                style={styles.buttonStyle1}>
                                <View style={styles.iconBackground1}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.personal_letter_white}
                                        style={styles.iconSmall}/>
                                    <Text style={[styles.infoText1,{color: '#FFFFFF'}]}>消息中心</Text>
                                    {
                                        info.newMsgCount !== 0&&
                                        <Badge style={[styles.infoTextBadge,{backgroundColor: '#C96B6D'}]} textStyle={{color: '#FFFFFF',}}>{info.newMsgCount == 0?'':info.newMsgCount}</Badge>
                                    }
                                </View>
                            </TouchableOpacity>
                        </Image>
                    </View>
                </View>
                    {
                        this.getChildPages(courseData,learningRecordBase,companyInfo)
                    }
                </ScrollView>
            </View>
        );
    }
});

var NAVBAR_HEIGHT = sr.rws(Navigator.NavigationBar.Styles.General.NavBarHeight);
var styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#F0EFF5',
        flexDirection: 'column',
    },
    headItemBg: {
        height: 195,
        width: sr.w,
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
        width: NAVBAR_HEIGHT*0.6,
        height: NAVBAR_HEIGHT*0.6,
    },
    setButton: {
        width: NAVBAR_HEIGHT*0.6,
        height: NAVBAR_HEIGHT*0.6,
    },
    topView: {
        flexDirection: 'row',
    },
    headStyle: {
        marginTop: 25,
        marginLeft:62,
        width: 71,
        height: 71,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        borderRadius: 35.5,
    },
    headRightView: {
        marginTop: 22,
        marginBottom: 8,
    },
    icon_vip: {
        width: 22,
        height: 14,
        marginTop:-5,
        marginLeft:5,
    },
    iconBackground: {
        width: sr.w,
        height: 195,
        backgroundColor:'#DE3031',
    },
    iconBackgroundLeft: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    iconBackground1: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    iconSmall: {
        width: 21,
        height: 15,
        marginLeft: 35,
        marginRight: 5,
    },
    iconSmall1: {
        width: 18,
        height: 18,
        marginLeft: 30,
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
        height: 50,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    nameBottomText: {
        fontSize: 12,
        width:200,
        color:'white',
        marginVertical: 5,
        backgroundColor: 'transparent'
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
        fontSize: 12,
        color:'#FFB6B7',
        marginBottom: 6,
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
    cashText: {
        fontSize: 14,
        color: '#2C2E2C'
    },
    moneyText: {
        fontSize: 15,
        color: '#A60245'
    },
    infoText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 5,
    },
    infoTextLeft: {
        fontSize: 12,
        width: 98,
        marginHorizontal: 5,
        backgroundColor: 'transparent',
    },
    infoText1: {
        fontSize: 12,
        width: 54,
        marginHorizontal: 5,
        backgroundColor: 'transparent'
    },
    infoTextBadge: {
        marginHorizontal: 5,
    },
    nameStyle: {
        height: 26,
        width: sr.w,
        marginLeft: 26,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    nameBottomCompanyStyle: {
        width: 210,
        height: 25,
        marginLeft: 26,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    nameBottomStyle: {
        flex: 1,
        width: 200,
        marginLeft: 26,
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    loginTimesView: {
        height: 38,
        width: sr.w-115,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    moneyStyle: {
        height: 39,
        width: sr.w,
        marginTop: 8,
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    cashStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameText: {
        fontSize: 16,
        color:'white',
        width: 100,
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
    goBossIcon: {
        width: 96,
        height: 47,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goBossText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 5,
        marginBottom: 4,
        backgroundColor: 'transparent',
    },
    divisionLine: {
        width: sr.w-24,
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
