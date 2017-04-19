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
import Badge from 'react-native-smart-badge'
// var Search = require('../search/index.js');
// var VideoPlay = require('../study/VideoPlay.js');
var PersonInfo = require('../person/PersonInfo.js');
var PackageList = require('../package/PackageList.js');
// var WaitingLive = require('../live/WaitingLive.js');
// var LivePlayer = require('../live/LivePlayer.js');
// var BackPlayer = require('../live/BackPlayer.js');
var ShowMealBox = require('../package/ShowMealBox.js');
var ReadingList = require('./ReadingList.js');
var RecommendVideo = require('./RecommendVideo.js');
var StarCompany = require('./StarCompany.js');
var ImageSelect = require('./ImageSelect.js');
var Activity = require('./Activity.js');
var CompanyDetail = require('./CompanyDetail.js');
var ActivityDetail = require('./ActivityDetail.js');
var ReadingDetail = require('./ReadingDetail.js');
var RecommendVideoPlayer = require('./RecommendVideoPlayer.js');
var CoursePlayer = require('../specops/CoursePlayer.js');
var ShowWebView = require('./ShowWebView.js');
var specialTask = require('../task/index.js');
var EmployeeMonthPlan = require('../specopsBoss/EmployeeMonthPlan.js');
var EmployeePlanAndSummary = require('../specopsBoss/EmployeePlanAndSummary.js');
var BindingBox = require('../login/BindingBox.js');
var BossIndex = require('../specopsBoss/index.js');

var {DImage} = COMPONENTS;

const VIDEO_TYPES = ['精品课程', '精彩案例', '编辑推荐', '课程亮点'];

module.exports = React.createClass({
    statics: {
        title: '赢销截拳道',
        leftButton: { image: app.img.personal_entrance, handler: ()=>{
            app.navigator.push({
                component: PersonInfo,
                fromLeft: true,
            });
        }},
    },
    getInitialState() {
        this.isBig = false;
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            ShowMealBox: false,
            bannerList:[],
            hotActiveityList:[],
            encourageReadList:[],
            encourageCourseList:[],
            shopInfoList:[],
            studyInfo: null,
            task:null,
            submitLog: this.ds.cloneWithRows([]),
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    componentDidMount() {
        this.getHomePageData();
        this.getUserStudyInfo();
        app.personal.info.companyInfo&&this.getWorkSituationAbstract();
        if (app.isBind === false) {
            app.showModal(
                <BindingBox doRefresh={this.doRefresh}/>
            );
        }
    },
    doRefresh() {
        this.isBig = true;
        this.getHomePageData();
        this.getUserStudyInfo();
        app.personal.info.companyInfo&&this.getWorkSituationAbstract();

    },
    onWillFocus() {
        this.getUserStudyInfo();
        this.getHomePageData();
        app.personal.info.companyInfo&&this.getWorkSituationAbstract();
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
            // app.data.specopsPackageID = data.context.packageID; //特种兵套餐ID，用来支付
            // app.data.specopsPackagePrice = data.context.packagePrice.toFixed(2); //特种兵套餐价钱，用来支付和显示
            let {banner, hotActiveity, encourageRead, encourageCourse, shopInfo, task, packageList} = data.context;
            app.data.packageList = packageList;
            let hotActiveityList = [];
            let encourageReadList = [];
            let encourageCourseList = [];
            let shopInfoList = [];
            if (hotActiveity) {
                hotActiveityList = hotActiveity.slice(0,6);
            }
            if (encourageRead) {
                encourageReadList = encourageRead.slice(0,4);
            }
            if (encourageCourse) {
                encourageCourseList = encourageCourse.slice(0,3);
            }
            if (shopInfo) {
                shopInfoList = shopInfo.slice(0,3);
            }

            let bannerList = [];
            if (banner) {
                for (var i = 0; i < banner.length; i++) {
                    switch (banner[i].type) {
                        case 1:
                        bannerList.push({"banneType": 1, "bannerId": banner[i].activityId?banner[i].activityId:'',
                                        "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'', "title": banner[i].title?banner[i].title:'',
                                        "describe": banner[i].describe?banner[i].describe:''});
                            break;
                        case 2:
                        bannerList.push({"banneType": 2, "bannerId": banner[i].encourageReadId?banner[i].encourageReadId:'',
                                        "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'', "title": banner[i].title?banner[i].title:'',
                                        "describe": banner[i].describe?banner[i].describe:''});
                            break;
                        case 3:
                        bannerList.push({"banneType": 3, "videoInfo": banner[i].videoInfo?banner[i].videoInfo:'',
                                    "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'', "title": banner[i].title?banner[i].title:'',
                                    "describe": banner[i].describe?banner[i].describe:''});
                            break;
                        case 4:
                        bannerList.push({"banneType": 4, "bannerId": banner[i].shopInfoId?banner[i].shopInfoId:'',
                                        "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'', "title": banner[i].title?banner[i].title:'',
                                        "describe": banner[i].describe?banner[i].describe:''});
                            break;
                        case 5:
                        bannerList.push({"banneType": 5, "bannerId": 'null', "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'',
                                        "title": banner[i].title?banner[i].title:'',"cUrl": banner[i].cUrl?banner[i].cUrl:'',
                                        "describe": banner[i].describe?banner[i].describe:''});
                            break;
                        case 6:
                        bannerList.push({"banneType": 6, "bannerId": 'null', "imageUrl": banner[i].imageUrl?banner[i].imageUrl:'',
                                        "title": banner[i].title?banner[i].title:'', "describe": banner[i].describe?banner[i].describe:''});
                            break;
                    }

                }
            }
            this.setState({bannerList, hotActiveityList, encourageReadList, encourageCourseList, shopInfoList,task, dataSource: this.ds.cloneWithRows(encourageCourseList)}, ()=>{
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
    getUserStudyInfo() {
        var param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_USER_STUDY_INFO, param, this.getUserStudyInfoSuccess);
    },
    getUserStudyInfoSuccess(data) {
        if (data.success) {
            this.setState({studyInfo: data.context});
        } else {
            Toast(data.msg);
        }
    },
    toNextPages(bannerInfo) {
        //1.活动详情页 2.文章详情页 3.课程详情页 4.明星示范单位详情页 5.网页 6.个人中心
        switch (bannerInfo.banneType) {
            case 1:
                app.navigator.push({
                    title: '活动详情页',
                    component: ActivityDetail,
                    passProps: {activeityId:bannerInfo.bannerId},
                });
                break;
            case 2:
                app.navigator.push({
                    title: bannerInfo.title,
                    component: ReadingDetail,
                    passProps: {articleId: bannerInfo.bannerId},
                });
                break;
            case 3:
                if (bannerInfo.videoInfo) {
                    this.playVideo(bannerInfo.videoInfo, true);
                }
                break;
            case 4:
                app.navigator.push({
                    title: '明星企业',
                    component: CompanyDetail,
                    passProps: {starCompanyID: bannerInfo.bannerId},
                });
                break;
            case 5:
                app.navigator.push({
                    title: bannerInfo.title,
                    component: ShowWebView,
                    passProps: {htmlUrl:bannerInfo.cUrl, imageUrl: bannerInfo.imageUrl, title: bannerInfo.title, describe: bannerInfo.describe},
                });
                break;
            case 6:
                app.navigator.push({
                    component: PersonInfo,
                    fromLeft: true,
                });
                break;
            default:
        }
    },
    toPersonInfo() {
        app.navigator.push({
            component: PersonInfo,
            fromLeft: true,
        });
    },
    toReadingList(type) {
        app.navigator.push({
            title: '推荐阅读',
            component: ReadingList,
            passProps: {tabIndex: type},
        });
    },
    toStarCompanyList() {
        app.navigator.push({
            title: '明星示范单位',
            component: StarCompany,
        });
    },
    toCompanyDetail(shopId, shopName, imageUrl) {
        app.navigator.push({
            title: '明星企业',
            component: CompanyDetail,
            passProps: {starCompanyID: shopId, shopName: shopName, imageUrl: imageUrl},
        });
    },
    toRecommendVideoPage() {
        app.navigator.push({
            title: '推荐课程',
            component: RecommendVideo,
        });
    },
    toActivityPage() {
        app.navigator.push({
            title: '热门活动',
            component: Activity,
        });
    },
    doSelect(obj) {
        app.navigator.push({
            title: '活动详情页',
            component: ActivityDetail,
            passProps: {activeityId: obj.activeityId},
        });
    },
    goSpecialTask(index) {
        app.navigator.push({
            component: specialTask,
            passProps: {index},
        });
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
    renderBanner() {
        var {bannerList} = this.state;
        return (
            <View style={styles.bannerContainer}>
                <Swiper
                    paginationStyle={styles.paginationStyle}
                    height={sr.ws(218)}
                    loop={true}
                    autoplay={true}
                    dotColor={'red'}
                    autoplayTimeout={5}
                    >
                    {
                        bannerList.map((item, i)=>{
                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={this.toNextPages.bind(null, item)}>
                                    <Image
                                        resizeMode='stretch'
                                        defaultSource={app.img.common_default}
                                        source={{uri: item.imageUrl}}
                                        style={styles.bannerImage}
                                        />
                                    <View style={styles.bannerTextContainer}>
                                        <Text numberOfLines={1} style={styles.bannerText}>
                                            {item.title}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </Swiper>
            </View>
        );
    },
    renderTask() {
        var {task} = this.state;
        return (
            <View>
                <View style={styles.taskView}>
                    <View style={styles.columnTopView}>
                        <View style={styles.columnRedLine}></View>
                        <Text style={styles.columnTitle}>
                          当前任务
                        </Text>
                    </View>
                    <View style={styles.columnContainer}>
                        <View style={styles.rowContainer}>
                            <TouchableOpacity onPress={this.goSpecialTask.bind(null,0)}>
                                <Image style={styles.cell} source={app.img.task_special_task}>
                                    {
                                        (task&&task.specialTask.unfinished>0) &&
                                        <View style={styles.cellContent}>
                                            <Badge style={styles.cellContentLabelLeft} textStyle={{color: '#FFFFFF'}}>
                                              {task&&task.specialTask.unfinished}
                                            </Badge>
                                            <Text style={styles.cellContentLabelRight}>
                                              条未完成
                                            </Text>
                                        </View>
                                    }
                                </Image>
                            </TouchableOpacity>
                          <TouchableOpacity onPress={this.goSpecialTask.bind(null,1)}>
                              <Image style={styles.cell} source={app.img.task_study_task}>
                               {
                                   (task&&task.studyTask.unfinished>0) &&
                                   <View style={styles.cellContent}>
                                       <Badge style={styles.cellContentLabelLeft} textStyle={{color: '#FFFFFF'}}>
                                         {task&&task.studyTask.unfinished}
                                       </Badge>
                                       <Text style={styles.cellContentLabelRight}>
                                         条未完成
                                       </Text>
                                   </View>
                                }
                              </Image>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.rowContainer}>
                            <TouchableOpacity onPress={this.goSpecialTask.bind(null,2)}>
                                <Image style={styles.cell} source={app.img.task_practice_task}>
                                 {
                                     (task&&task.trainTask.unfinished>0) &&
                                     <View style={styles.cellContent}>
                                         <Badge style={styles.cellContentLabelLeft} textStyle={{color: '#FFFFFF'}}>
                                           {task&&task.trainTask.unfinished}
                                         </Badge>
                                         <Text style={styles.cellContentLabelRight}>
                                           条未完成
                                         </Text>
                                     </View>
                                 }
                                </Image>
                            </TouchableOpacity>
                          <TouchableOpacity onPress={this.goSpecialTask.bind(null,3)}>
                              <Image style={styles.cell} source={app.img.task_space_task}>
                            {
                            //       <View style={styles.cellContent}>
                            //        <Badge style={styles.cellContentLabelLeft} textStyle={{color: '#FFFFFF'}}>
                            //          {task&&task.platformTask.unfinished}
                            //        </Badge>
                            //        <Text style={styles.cellContentLabelRight}>
                            //          条未完成
                            //        </Text>
                            //    </View>
                           }
                              </Image>
                          </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomLine}/>
            </View>
        )
    },
    renderUserInfo() {
        var info = app.personal.info;
        var {studyInfo} = this.state;
        let headUrl = studyInfo&&studyInfo.headImg?studyInfo.headImg:info.sex===1?app.img.personal_sex_male:app.img.personal_sex_female;
        let nameTemWidth = this.calculateStrLength(info.name);
        let nameWidth = nameTemWidth*10+7;
        return (
            <TouchableOpacity onPress={this.toPersonInfo}>
                <View style={styles.personContainer}>
                    <View style={styles.personalInfoContainer}>
                        <DImage
                            resizeMode='cover'
                            defaultSource={app.img.personal_head}
                            source={studyInfo&&studyInfo.headImg?{uri: headUrl}:headUrl}
                            style={styles.headerIcon}  />
                        <View style={styles.personalInfoStyle}>
                            <View style={styles.nameContainer}>
                                <Text style={[styles.nameText, {width: nameWidth>160?sr.ws(160):sr.ws(nameWidth)}]} numberOfLines={1}>
                                    {studyInfo&&studyInfo.userName}
                                </Text>
                                <View style={styles.verticalLine}>
                                </View>
                                <Text style={styles.aliasText}>
                                    {studyInfo&&studyInfo.alias}
                                </Text>
                            </View>
                            <Text style={styles.companyText}>
                                {(studyInfo&&studyInfo.company ==null || studyInfo&&studyInfo.company=='')?'您还未设置企业信息':info.company}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.divisionLine}>
                    </View>
                    <View style={styles.studyDetailContainer}>
                        <View style={styles.panelContainer}>
                            <View style={styles.timeContainer}>
                                <Text style={[styles.timeStyle, {color: '#60A4F5'}]}>
                                    {studyInfo&&studyInfo.watchVideoLength}
                                </Text>
                                <Text style={[styles.timeText, {alignSelf: 'flex-end'}]}>分钟</Text>
                            </View>
                            <Text style={styles.timeText}>总共学习</Text>
                        </View>
                        <View style={styles.vline}/>
                        <View style={styles.panelContainer}>
                            <View style={styles.timeContainer}>
                                <Text style={[styles.timeStyle, {color: '#A2D66C'}]}>
                                    {studyInfo&&studyInfo.overVideoStudy}
                                </Text>
                                <Text style={[styles.timeText, {alignSelf: 'flex-end'}]}>课时</Text>
                            </View>
                            <Text style={styles.timeText}>完成课程</Text>
                        </View>
                        <View style={styles.vline}/>
                        <View style={styles.panelContainer}>
                            <View style={styles.timeContainer}>
                                <Text style={[styles.timeStyle, {color: '#FED057'}]}>
                                    {studyInfo&&studyInfo.continuousLogin}
                                </Text>
                                <Text style={[styles.timeText, {alignSelf: 'flex-end'}]}>天</Text>
                            </View>
                            <Text style={styles.timeText}>累计学习</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomLine}/>
            </TouchableOpacity>
        );
    },
    renderWorkRow(obj, sectionID, rowID) {
        return (
            <View>
                {
                    <View style={styles.separatorBoss} />
                }
                <View style={styles.rowContainerBoss}>
                    <Text numberOfLines={1} style={styles.rowTime}>{obj.date&&moment(obj.date).format('M.D HH:mm')}</Text>
                    <Text numberOfLines={1} style={styles.rowName}>{obj.name}</Text>
                    <Text numberOfLines={1} style={styles.rowTip}>{obj.context}</Text>
                </View>
            </View>
        )
    },
    getWorkSituationAbstract() {
        let info = app.personal.info;
        var param = {
            userID: info.userID,
            companyId: info.companyInfo.companyId,
        };
        POST(app.route.ROUTE_GET_WORK_SITUATION_ABSTRACT, param, this.getWorkSituationAbstractSuccess,true);
    },
    getWorkSituationAbstractSuccess(data) {
        if (data.context) {
            var {userSum} = data.context;
            var {submitLog} = data.context;
            var {monthWeekPlanNum} = data.context;
            var {dayPlanNum} = data.context;
            var {summaryNum} = data.context;
            this.setState({submitLog:this.ds.cloneWithRows(submitLog.slice(0,4)), monthWeekPlanNum, dayPlanNum, summaryNum, userSum});
        }
    },
    toEmployeeTarget() {
        app.navigator.push({
            title: '员工目标',
            component: EmployeeMonthPlan,
        });
    },
    toEmployeePlan() {
        app.navigator.push({
            title: '员工计划',
            component: EmployeePlanAndSummary,
            passProps: {isDayPlan: true, isDaySummary: false},
        });
    },
    toEmployeeSummary() {
        app.navigator.push({
            title: '员工总结',
            component: EmployeePlanAndSummary,
            passProps: {isDayPlan: false, isDaySummary: true},
        });
    },
    toSpecops() {
        app.navigator.push({
            component: BossIndex,
            passProps: {},
        });
    },
    renderEmployeeWork(){
        let {monthWeekPlanNum, dayPlanNum, summaryNum, submitLog, userSum}=this.state;
        return (
            <View>
                <View style={styles.businessContainer}>
                    <View style={styles.workStyle}>
                        <View style={styles.leftTitleStyle}>
                            <View style={styles.vertical}></View>
                            <Text style={styles.workText}>员工工作情况</Text>
                        </View>
                        {
                            <TouchableOpacity style={styles.rightTitleStyle} onPress={this.toSpecops}>
                                <Text style={styles.targetText}>查看详情</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.bottomLine1}></View>
                    <View style={styles.studyDetail}>
                        <TouchableOpacity onPress={this.toEmployeeTarget} style={styles.buttonContainer}>
                            <DImage
                                resizeMode='contain'
                                source={app.img.specopsBoss_target}
                                style={styles.imageContainer}>
                                <Text style={styles.buttonText}>员工目标</Text>
                            </DImage>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toEmployeePlan} style={styles.buttonContainer}>
                            <DImage
                                resizeMode='contain'
                                source={app.img.specopsBoss_plan}
                                style={styles.imageContainer}>
                                <Text style={styles.buttonText}>员工计划</Text>
                            </DImage>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toEmployeeSummary} style={styles.buttonContainer}>
                            <DImage
                                resizeMode='contain'
                                source={app.img.specopsBoss_summary}
                                style={styles.imageContainer}>
                                <Text style={styles.buttonText}>员工总结</Text>
                            </DImage>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.studyDetail}>
                        <View style={styles.panelContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.numberBlackStyle}>
                                    {monthWeekPlanNum?monthWeekPlanNum.complete:''}
                                </Text>
                                <Text style={styles.numberAllStyle}>{'/'}</Text>
                                <Text style={styles.numberAllStyle}>{userSum}</Text>
                            </View>
                            <Text style={styles.numberTipStyle}>目标提交人数</Text>
                        </View>
                        <View style={styles.vline}/>
                        <View style={styles.panelContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.numberBlackStyle}>
                                    {dayPlanNum?dayPlanNum.complete:''}
                                </Text>
                                <Text style={styles.numberAllStyle}>{'/'}</Text>
                                <Text style={styles.numberAllStyle}>{userSum}</Text>
                            </View>
                            <Text style={styles.numberTipStyle}>计划提交人数</Text>
                        </View>
                        <View style={styles.vline}/>
                        <View style={styles.panelContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.numberBlackStyle}>
                                    {summaryNum?summaryNum.complete:''}
                                </Text>
                                <Text style={styles.numberAllStyle}>{'/'}</Text>
                                <Text style={styles.numberAllStyle}>{userSum}</Text>
                            </View>
                            <Text style={styles.numberTipStyle}>总结提交人数</Text>
                        </View>
                    </View>
                    <ListView
                        initialListSize={1}
                        enableEmptySections={true}
                        style={styles.list}
                        dataSource={submitLog}
                        renderRow={this.renderWorkRow}
                        />
                </View>
                <View style={styles.bottomLine}/>
            </View>

        );
    },
    renderImageSelectRow(obj) {
        return (
            <DImage
                defaultSource={app.img.common_default}
                source={{uri:obj.rImageUrl==null?'':obj.rImageUrl}}
                style={styles.selectedScoreContainer}>
                <View style={styles.bottomStyleMid}>
                    <Text numberOfLines={1} style={styles.textStyleMid}>{obj.title}</Text>
                </View>
            </DImage>
        )
    },
    renderHotActiveity() {
        var {hotActiveityList} = this.state;
        return (
            <View>
            {
                hotActiveityList.length > 0 &&
                <View>
                    <View style={styles.readingContainerImage}>
                        <View style={styles.titleContainer}>
                            <View style={styles.leftTitleStyle}>
                                <View style={styles.titleView}></View>
                                <Text style={styles.titleText}>热门活动</Text>
                            </View>
                            {
                                <TouchableOpacity style={styles.rightTitleStyle} onPress={this.toActivityPage}>
                                    <Text style={styles.targetText}>查看更多</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.titleDivisionLine}></View>
                        <View style={styles.activityStyle}>
                            <ImageSelect
                                index={hotActiveityList.length>2 ? 1: 0}
                                list={hotActiveityList}
                                width={sr.ws(361)}
                                height={sr.ws(158)}
                                onPress={this.doSelect}
                                renderRow={this.renderImageSelectRow}
                                />
                        </View>
                    </View>
                    <View style={styles.bottomLine}/>
                </View>
            }
            </View>
        );
    },
    renderEncourageRead() {
        var {encourageReadList} = this.state;
        return (
            <View>
            <View style={styles.readingContainer}>
                <View style={styles.titleContainer}>
                    <View style={styles.leftTitleStyle}>
                        <View style={styles.titleView}></View>
                        <Text style={styles.titleText}>推荐阅读</Text>
                    </View>
                </View>
                <View style={styles.titleDivisionLine}></View>
                {
                    encourageReadList.length===4&&
                    <View style={styles.readingStyle}>
                        <View style={styles.leftReadingStyle}>
                            <TouchableOpacity underlayColor="rgba(0, 0, 0, 0)" onPress={this.toReadingList.bind(null, encourageReadList[0].type)} style={styles.celebrityStyle}>
                                <DImage
                                    resizeMode='stretch'
                                    defaultSource={app.img.common_default}
                                    source={{uri:encourageReadList[0].imageUrl}}
                                    style={styles.celebrityImage}>
                                    <View style={styles.celebrityImageView}>
                                    <Text style={styles.readingMenuText}>{encourageReadList[0].tags}</Text>
                                    </View>
                                </DImage>
                            </TouchableOpacity>
                            <View style={styles.bottomReadingStyle}>
                                <TouchableOpacity underlayColor="rgba(0, 0, 0, 0)" onPress={this.toReadingList.bind(null, encourageReadList[2].type)} style={styles.bottomMenuStyle}>
                                    <DImage
                                        resizeMode='stretch'
                                        defaultSource={app.img.common_default}
                                        source={{uri:encourageReadList[2].imageUrl}}
                                        style={styles.bottomImage}>
                                        <View style={styles.bottomImageView}>
                                            <Text style={styles.readingMenuText}>{encourageReadList[2].tags}</Text>
                                        </View>
                                    </DImage>
                                </TouchableOpacity>
                                <TouchableOpacity underlayColor="rgba(0, 0, 0, 0)" onPress={this.toReadingList.bind(null, encourageReadList[3].type)} style={[styles.bottomMenuStyle, {marginLeft: 8}]}>
                                    <DImage
                                        resizeMode='stretch'
                                        defaultSource={app.img.common_default}
                                        source={{uri:encourageReadList[3].imageUrl}}
                                        style={styles.bottomImage}>
                                        <View style={styles.bottomImageView}>
                                        <Text style={styles.readingMenuText}>{encourageReadList[3].tags}</Text>
                                        </View>
                                    </DImage>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity underlayColor="rgba(0, 0, 0, 0)" onPress={this.toReadingList.bind(null, encourageReadList[1].type)} style={styles.homeworkStyle}>
                            <DImage
                                resizeMode='stretch'
                                defaultSource={app.img.common_default}
                                source={{uri:encourageReadList[1].imageUrl}}
                                style={styles.homeworkImage}>
                                <View style={styles.homeworkImageView}>
                                <Text style={styles.readingMenuText}>{encourageReadList[1].tags}</Text>
                                </View>
                            </DImage>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <View style={styles.bottomLine}/>
            </View>
        );
    },
    playVideo(obj, isFromBanner) {
        const {isAgent, isSpecialSoldier} = app.personal.info;
        let authorized = isAgent||isSpecialSoldier; //是否是特种兵1—是  0—不是
        if (obj.videoType==6) {
            if (!authorized) {
                //跳转到购买特种兵页
                app.navigator.pop();
                app.showMainScene(1);
            } else {
                //跳转到特种兵视频播放页
                var param = {
                    userID:app.personal.info.userID,
                    videoID: obj.videoID,
                };
                POST(app.route.ROUTE_STUDY_PROGRESS, param, (data)=>{
                    if (data.success) {
                        app.navigator.push({
                            component: CoursePlayer,
                            passProps: {isCourseRecord:true, lastStudyProgress: data.context, otherVideoID: isFromBanner?null:obj.videoID},
                        });
                    } else {
                        Toast('该特种兵课程学习进度获取失败，请重试！');
                    }
                });
            }
        } else {
            //跳转到普通视频播放页
            app.navigator.push({
                component: RecommendVideoPlayer,
                passProps: {videoInfo:obj},
            });
        }
    },
    renderRow(obj, sectionID, rowID, onRowHighlighted) {
        let videoType = obj.videoType&&obj.videoType < 5? VIDEO_TYPES[obj.videoType-1]+'：':'';
        let name = obj.name ? obj.name: '';
        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj, false)}
                underlayColor="#EEB422">
                <View style={styles.listViewItemContain}>
                    {
                      rowID==0?<View style={{backgroundColor: '#FFFFFF'}}/>:
                      <View style={styles.separator}/>
                    }
                    <View style={styles.ItemContentContain}>
                        <Image
                            resizeMode='stretch'
                            source={{uri:obj.urlImg}}
                            style={styles.LeftImage} />
                        <View style={styles.flexConten}>
                            <View style={styles.rowViewStyle}>
                                <Text
                                    numberOfLines={1}
                                    style={styles.nameTextStyles}>
                                    {videoType+name}
                                </Text>
                                <Text
                                    numberOfLines={2}
                                    style={styles.detailTextStyles}>
                                    {obj.detail}
                                </Text>
                            </View>
                            <View style={styles.columnViewStyle}>
                                <View style={styles.mainSpeakStyles}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.personal_eye}
                                        style={styles.eyeImage} />
                                    <Text style={styles.mainSpeakTag}>{obj.clicks*3+50}</Text>
                                    <Image
                                        resizeMode='stretch'
                                        source={obj.isPraise === 0?app.img.personal_praise_pressed:app.img.personal_praise}
                                        style={styles.praiseImage} />
                                    <Text style={styles.mainSpeakTag}>{obj.likes}</Text>
                                </View>
                                <Text numberOfLines={1} style={styles.lastTimeText}>
                                    { moment(obj.createTime).format('YYYY.MM.DD')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    renderEncourageCourse() {
        var {encourageCourseList} = this.state;
        return (
            <View>
                <View style={styles.businessContainer}>
                    <View style={styles.titleContainer}>
                        <View style={styles.leftTitleStyle}>
                            <View style={styles.titleView}></View>
                            <Text style={styles.titleText}>精品课程</Text>
                        </View>
                        <TouchableOpacity style={styles.rightTitleStyle} onPress={this.toRecommendVideoPage}>
                            <Text style={styles.targetText}>查看更多</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleDivisionLine}></View>
                    {
                        encourageCourseList.length>0&&
                        <ListView
                            initialListSize={1}
                            onEndReachedThreshold={10}
                            enableEmptySections={true}
                            style={styles.listStyle}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow}
                            />
                    }
                </View>
                <View style={styles.bottomLine}/>
            </View>
        );
    },
    renderStarCompany() {
        var {shopInfoList} = this.state;
        return (
            <View style={styles.businessContainer}>
                <View style={styles.titleContainer}>
                    <View style={styles.leftTitleStyle}>
                        <View style={styles.titleView}></View>
                        <Text style={styles.titleText}>明星示范单位</Text>
                    </View>
                    <TouchableOpacity style={styles.rightTitleStyle} onPress={this.toStarCompanyList}>
                        <Text style={styles.targetText}>查看更多</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleDivisionLine}></View>
                {
                    shopInfoList.length>=3&&
                    <View style={styles.businessStyle}>
                    <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={this.toCompanyDetail.bind(null, shopInfoList[0].shopId, shopInfoList[0].shopName, shopInfoList[0].imageUrl)}>
                        <Image
                            resizeMode='stretch'
                            defaultSource={app.img.common_default}
                            source={{uri:shopInfoList[0].imageUrl}}
                            style={styles.businessImage0}>
                        </Image>
                    </TouchableHighlight>
                    <Text style={styles.businessNameText}>{shopInfoList[0].shopName}</Text>
                    <View style={styles.topBusinessStyle}>
                        <View style={styles.bottomBusinessContainer}>
                            <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={this.toCompanyDetail.bind(null, shopInfoList[1].shopId, shopInfoList[1].shopName, shopInfoList[1].imageUrl)}>
                                <Image
                                    resizeMode='stretch'
                                    defaultSource={app.img.common_default}
                                    source={{uri:shopInfoList[1].imageUrl}}
                                    style={styles.businessImage1}>
                                </Image>
                            </TouchableHighlight>
                        </View>
                        <View style={[styles.bottomBusinessContainer, {marginLeft: 9}]}>
                            <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={this.toCompanyDetail.bind(null, shopInfoList[2].shopId, shopInfoList[2].shopName, shopInfoList[2].imageUrl)}>
                                <Image
                                    resizeMode='stretch'
                                    defaultSource={app.img.common_default}
                                    source={{uri:shopInfoList[2].imageUrl}}
                                    style={styles.businessImage1}>
                                </Image>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={styles.bottomBusinessStyle}>
                        <View style={styles.bottomBusinessContainer2}>
                            <Text numberOfLines={2} style={styles.businessNameText2}>{shopInfoList[1].shopName}</Text>
                        </View>
                        <View style={[styles.bottomBusinessContainer2, {marginLeft: 9}]}>
                            <Text numberOfLines={2} style={styles.businessNameText2}>{shopInfoList[2].shopName}</Text>
                        </View>
                    </View>
                    </View>
                }
            </View>
        );
    },
    render() {
        var {gotoSpecialSoldierTime,PKTime,PKWinTime,newReplay} = app.personal.info;
        var becomeSpecialSoldierDay = Math.floor(moment().diff(moment(gotoSpecialSoldierTime))/(24 * 60 * 60 * 1000))+1||1;
        var {bannerList, hotActiveityList, encourageReadList, encourageCourseList, shopInfoList, studyInfo} = this.state;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.pageContainer}>
                    {
                        bannerList.length >=1 &&
                        <this.renderBanner />
                    }
                    {
                        <this.renderTask/>
                    }
                    <this.renderUserInfo />
                    {
                        app.personal.info.companyInfo&&
                        <this.renderEmployeeWork />
                    }
                    {
                        hotActiveityList.length >= 1 &&
                        <this.renderHotActiveity />
                    }
                    <this.renderEncourageRead />
                    <this.renderEncourageCourse />
                    <this.renderStarCompany />
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
        justifyContent: 'flex-end',
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
    personContainer: {
        width: sr.w-6,
        height: 147,
        marginTop: 9,
        alignSelf: 'center',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    personalInfoContainer: {
        height: 82,
        flexDirection: 'row',
    },
    headerIcon: {
        width: 54,
        height: 54,
        marginLeft: 18,
        marginTop: 15,
        borderRadius: 27,
    },
    personalInfoStyle: {
        marginLeft: 31,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    nameContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    nameText: {
        fontSize: 18,
        color: '#2A2A2A',
        fontFamily: 'STHeitiSC-Medium',
    },
    aliasText: {
        fontSize: 12,
        color: '#2A2A2A',
        fontFamily: 'STHeitiSC-Medium',
    },
    verticalLine: {
        width: 1,
        height: 12,
        marginLeft: 21,
        marginRight: 12,
        backgroundColor: '#D4D4D4',
    },
    companyText: {
        fontSize: 12,
        color: '#999999',
        fontFamily: 'STHeitiSC-Medium',
    },
    divisionLine: {
        width: sr.w-24,
        height: 1,
        alignSelf: 'center',
        backgroundColor: '#F8F8F8',
    },
    studyDetailContainer: {
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
    timeContainer: {
        height: 24,
        flexDirection: 'row',
        marginBottom: 6,
    },
    timeStyle: {
        fontSize: 18,
        fontFamily: 'STHeitiSC-Medium',
    },
    timeText: {
        color: '#2A2A2A',
        fontSize: 12,
        fontFamily: 'STHeitiSC-Medium',
    },
    vline: {
        width: 1,
        height: 34,
        backgroundColor: '#EEEEEE',
    },
    readingContainerImage: {
        width: sr.w-6,
        height: 242,
        alignSelf: 'center',
        marginTop: 12,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    readingContainer: {
        width: sr.w-6,
        height: 254,
        alignSelf: 'center',
        marginTop: 12,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    listStyle: {
        marginVertical: 8,
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
    },
    titleContainer: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftTitleStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        width: 4,
        height: 18,
        marginLeft: 8,
        backgroundColor: '#FF3F3F',
    },
    titleText: {
        width: 150,
        fontSize: 20,
        color: '#333333',
        marginLeft: 10,
        fontFamily: 'STHeitiSC-Medium',
    },
    rightTitleStyle: {
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    targetText: {
        color: '#7E7E7E',
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
    },
    titleDivisionLine: {
        width: sr.w-6,
        height: 1,
        alignSelf: 'center',
        backgroundColor: '#F1F1F1',
    },
    bottomLine: {
        width: sr.w-22,
        height: 1,
        marginLeft: 11,
        backgroundColor: '#C5C5C5',
    },
    activityStyle: {
        marginHorizontal: 7,
        marginVertical: 20,
    },
    readingStyle: {
        flex: 1,
        height: 199,
        marginTop: 9,
        flexDirection: 'row',
    },
    leftReadingStyle: {
        marginLeft: 8,
        flexDirection: 'column',
    },
    celebrityStyle: {
        width: 225,
        height: 96,
        flexDirection: 'column'
    },
    celebrityImage: {
        width: 225,
        height: 96,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    celebrityImageView: {
        width: 225,
        height: 96,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#66666666',
    },
    readingMenuText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
    },
    bottomReadingStyle: {
        flexDirection: 'row',
        marginTop: 7,
    },
    bottomMenuStyle: {
        width: 108,
        height: 86,
    },
    bottomImage: {
        width: 108,
        height: 86,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomImageView: {
        width: 108,
        height: 86,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#66666666',
    },
    homeworkStyle: {
        width: 121,
        height: 189,
        marginLeft: 7,
    },
    homeworkImage: {
        width: 121,
        height: 189,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeworkImageView: {
        width: 121,
        height: 189,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#66666666',
    },
    businessContainer: {
        width: sr.w-6,
        marginTop: 12,
        alignSelf: 'center',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    businessStyle: {
        width: sr.w-6,
        alignItems: 'center',
        marginTop: 12,
        flexDirection: 'column',
    },
    businessImage0: {
        width: 354,
        height: 168,
        borderRadius: 2,
    },
    businessNameText: {
        color: '#252525',
        fontSize: 14,
        marginTop: 10,
        marginLeft: 8,
        alignSelf: 'flex-start',
        fontFamily: 'STHeitiSC-Medium',
        width: 354,
    },
    businessNameText2: {
        color: '#252525',
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
        width: 170,
    },
    topBusinessStyle: {
        marginVertical: 12,
        alignItems: 'center',
        flexDirection: 'row',
    },
    bottomBusinessStyle: {
        marginBottom: 12,
        flexDirection: 'row',
    },
    bottomBusinessContainer: {
        width: 172,
    },
    bottomBusinessContainer2: {
        width: 172,
    },
    businessImage1: {
        width: 172,
        height: 115,
        borderRadius: 2,
    },
    selectedScoreContainer: {
        width: 256,
        height: 158,
        alignItems: 'center',
        borderRadius: 4,
        justifyContent: 'center',
    },
    bottomStyleMid: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: 256,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    textStyleMid: {
        fontSize: 16,
        fontFamily:'STHeitiSC-Medium',
        color: '#FFFFFF',
    },
    rowContainer: {
       flexDirection: 'row',
       marginRight:10,
       marginLeft:5,
       backgroundColor:'transparent'
   },
   columnContainer: {
       flexDirection: 'column',
       paddingTop:8,
       paddingBottom:13,
       backgroundColor:'white',
       borderTopWidth:1,
       borderColor:'#F1F1F1'
   },
   cell: {
       marginTop:5,
       marginLeft:5,
       flex: 1,
       width:170,
       height: 101,
   },
   cellTitle: {
       fontSize: 20,
       textAlign: 'center',
       fontFamily: 'STHeitiSC-Medium',
       color: '#FFFFFF',
       marginTop: 33
   },
   taskView: {
      borderRadius:6,
      marginHorizontal:3,
      backgroundColor:'white',
      paddingBottom:3,
   },
   columnTopView: {
      flexDirection:'row',
      height:43,
      backgroundColor:'white',
      marginTop:3,
   },
   columnTitle: {
       marginTop:6,
       fontSize: 20,
       fontFamily: 'STHeitiSC-Medium',
       color: '#333333',
   },
   columnRedLine: {
       height:18,
       width:4,
       marginTop:12,
       marginLeft:17,
       marginRight:10,
       backgroundColor: '#FF3F3F'
   },
   cellContent: {
       flexDirection:'row',
       backgroundColor: 'rgba(0, 0, 0, 0.65)',
       height: 30,
       justifyContent: 'center',
       marginTop:72,
   },
   cellContentLabelLeft: {
       marginTop: app.isandroid?5:8,
       marginLeft:55,
       backgroundColor:'red'
   },
   cellContentLabelRight: {
       flex:1,
       fontSize: 12,
       textAlign: 'left',
       fontFamily: 'STHeitiSC-Medium',
       color: '#FFFFFF',
       marginTop: app.isandroid?6:8,
       marginLeft:3,
   },
   separator: {
       position: 'absolute',
       width: sr.w-20,
       height: 1,
       left: 10,
       right: 10,
       top: 0,
       backgroundColor: '#F7F7F7',
   },
   columnViewStyle: {
       position: 'absolute',
       bottom: 0,
       left: 0,
       width: 228,
       height: 20,
       flexDirection: 'row',
       alignItems: 'flex-end',
       justifyContent: 'space-between',
   },
   listViewItemContain: {
       flexDirection: 'row',
       width: sr.w,
       paddingVertical: 2,
       backgroundColor: '#FFFFFF',
   },
   ItemContentContain: {
       flexDirection: 'row',
       width: sr.w-20,
       margin: 10,
   },
   LeftImage: {
       width: 112.5,
       height:77,
       borderRadius: 2,
   },
   flexConten: {
       width: 232,
       marginLeft: 10,
       flexDirection: 'column',
   },
   rowViewStyle: {
       backgroundColor: 'transparent',
   },
   nameTextStyles: {
       color: '#252525',
       fontSize:16,
       backgroundColor: 'transparent',
   },
   detailTextStyles: {
       marginTop: 3,
       color: '#989898',
       fontSize:12,
       backgroundColor: 'transparent',
   },
   mainSpeakStyles: {
       flexDirection: 'row',
       alignItems: 'center',
   },
   eyeImage: {
       height: 12,
       width: 13,
   },
   praiseImage: {
       height: 12,
       width: 12,
   },
   mainSpeakTag: {
       color: '#989898',
       fontSize: 12,
       marginLeft: 5,
       marginRight: 15,
   },
   lastTimeText: {
       color: '#B2B2B2',
       fontSize: 12,
   },
   rowContainerBoss: {
       height: 32,
       flexDirection: 'row',
       alignItems:'center',
   },
   rowTime: {
       width: 75,
       marginLeft:18,
       fontFamily: 'STHeitiSC-Medium',
       fontSize:14,
       color: '#919191',
   },
   rowName: {
       width: 99,
       marginLeft:20,
       fontFamily: 'STHeitiSC-Medium',
       fontSize:14,
       color: '#919191',
   },
   rowTip: {
       width: 120,
       marginLeft:18,
       fontFamily: 'STHeitiSC-Medium',
       fontSize:14,
       color: '#919191',
   },
   separatorBoss: {
       height:1,
       backgroundColor: '#fafafa'
   },
   list: {
       alignSelf:'stretch',
       marginVertical: 5,
   },
   numberAllStyle: {
       fontSize: 14,
       fontFamily: 'STHeitiSC-Medium',
       color:'#919191',
       alignSelf: 'flex-end',
   },
   numberTipStyle: {
       fontSize: 14,
       fontFamily: 'STHeitiSC-Medium',
       color:'#919191',
   },
   numberBlackStyle: {
       fontSize: 18,
       fontFamily: 'STHeitiSC-Medium',
       color:'#242424',
   },
   contentContainer: {
       height: 24,
       flexDirection: 'row',
       marginBottom: 6,
   },
   studyDetail: {
       height: 62,
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center',
   },
   bottomLine1: {
       height: 1,
       backgroundColor: '#ededed',
   },
   vertical: {
       width: 4,
       height: 16,
       borderRadius: 1,
       backgroundColor: '#FF6363',
   },
   workText: {
       fontSize: 20,
       color: '#333333',
       marginLeft: 14,
       fontFamily: 'STHeitiSC-Medium',
   },
   workStyle: {
       height: 47,
       marginLeft: 16,
       alignItems: 'center',
       flexDirection: 'row',
       justifyContent: 'space-between',
   },
   buttonText: {
       color: '#FFFFFF',
       backgroundColor:'transparent',
       fontSize: 20,
       fontFamily: 'STHeitiSC-Medium',
   },
   imageContainer: {
       borderRadius:2,
       height:42,
       width: 106,
       marginLeft:8,
       marginRight:8,
       alignItems: 'center',
       justifyContent: 'center',
   },
});
