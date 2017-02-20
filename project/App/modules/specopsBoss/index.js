'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    ListView,
} = ReactNative;

var moment = require('moment');
var {DImage} = COMPONENTS;
var LineChart = require('./lineChart.js');
var EmployeeStudyDetail = require('./EmployeeStudyDetail.js');
var SpecopsPerson = require('./SpecopsPerson.js');
var EmployeeMonthPlan = require('./EmployeeMonthPlan.js');
var EmployeePlanAndSummary = require('./EmployeePlanAndSummary.js');
var LineStackChart = require('./lineStackChart.js');
var EmployeeMonthCommit = require('./EmployeeMonthCommit.js');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '赢销截拳道',
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            specopsList: this.ds.cloneWithRows([]),
            submitLog: this.ds.cloneWithRows([]),
            companyInfo:this.props.companyInfo,
            monthWeekPlanNum:{},
            dayPlanNum:{},
            summaryNum:{},
            xData:[],
            yData:[],
            avgWhenLong:0,
            rose:0,
            taskSubmitRateData: null,
        };
    },
    componentDidMount: function() {
        this.getWorkSituationAbstract();
        this.getSpecialList();
        this.getStudySituationAbstract();
        this.getUserTaskSubmitRate();
    },
    getUserTaskSubmitRate() {
        var param = {
            userID: app.personal.info.userID,
            companyId: app.personal.info.companyId,
            date:moment().format('YYYY-MM-DD')
        };
        POST(app.route.ROUTE_GET_USER_TASK_SUBMIT_RATE, param, this.getUserTaskSubmitRateSuccess);
    },
    getUserTaskSubmitRateSuccess(data) {
        if (data.success) {
            this.setState({taskSubmitRateData: data.context});
        }
    },
    getWorkSituationAbstract() {
        var param = {
            userID: app.personal.info.userID,
            companyId: app.personal.info.companyId,
        };
        POST(app.route.ROUTE_GET_WORK_SITUATION_ABSTRACT, param, this.getWorkSituationAbstractSuccess,true);
    },
    getWorkSituationAbstractSuccess(data) {
        if (data.context) {
            this.setState({submitLog:this.ds.cloneWithRows(data.context.submitLog),monthWeekPlanNum:data.context.monthWeekPlanNum,dayPlanNum:data.context.dayPlanNum,summaryNum:data.context.summaryNum})
        }
    },
    getSpecialList() {
        var param = {
            companyId: app.personal.info.companyId,
            pageNo:0,
        };
        POST(app.route.ROUTE_GET_SPECIAL_LIST, param, this.getSpecialListSuccess,true);
    },
    getSpecialListSuccess(data) {
        if (data.context) {
            this.setState({specopsList:this.ds.cloneWithRows(data.context)})
        }
    },
    getStudySituationAbstract() {
        var param = {
            companyId: app.personal.info.companyId,
        };
        POST(app.route.ROUTE_GET_STUDY_SITUATION_ABSTRACT, param, this.getStudySituationAbstractSuccess,true);
    },
    getStudySituationAbstractSuccess(data) {
        if (data.context) {
            var xData=[];
            var yData=[];
            var whenLongList=data.context.whenLongList;
            for (var index in whenLongList) {
                if (whenLongList.hasOwnProperty(index)) {
                    xData.push(whenLongList[index].date.slice(5));
                    yData.push(whenLongList[index].dayAvgWhenLong);
                }
            }
            this.setState({xData:xData,yData:yData,avgWhenLong:data.context.avgWhenLong,rose:data.context.rose});
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
    toEmployeeMonthCommit() {
        app.navigator.push({
            title: '员工任务提交详情',
            component: EmployeeMonthCommit,
        });
    },
    toEmployeeStudy() {
        app.navigator.push({
            title: '员工学习详情',
            component: EmployeeStudyDetail,
        });
    },
    _onPressRow(userId) {
        app.navigator.push({
            component: SpecopsPerson,
            passProps: {userId: userId},
        });
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID}/>
        );
    },
    renderSpecposSeparator(sectionID, rowID) {
        return (
            <View style={styles.specposSeparator} key={rowID}/>
        );
    },
    renderWorkRow(obj, sectionID, rowID) {
        return (
            <View style={styles.rowContainer}>
                <Text style={styles.rowTime}>{obj.date?obj.date.slice(5):''}</Text>
                <Text style={styles.rowName}>{obj.name}</Text>
                <Text style={styles.rowTip}>{obj.context}</Text>
            </View>
        )
    },
    renderSpecopsRow(obj, sectionID, rowID) {
        return (
            <TouchableHighlight
                onPress={this._onPressRow.bind(null, obj.userId)}
                underlayColor="#EEB422">
                <View style={styles.rowSpecopsContainer}>
                    <DImage
                        resizeMode='cover'
                        defaultSource={app.img.personal_head}
                        source={{uri:obj.userImg}}
                        style={styles.rowHeaderIcon}  />
                    <Text style={styles.rowSpecopsName}>
                        {obj.userName}
                    </Text>
                    <Text style={styles.rowPosition}>
                        {obj.post}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    },
    renderUserInfo() {
        let {companyInfo}=this.state;
        let headUrl = companyInfo.logo?companyInfo.logo:app.img.common_default;
        return (
            <View>
                <View style={styles.personContainer}>
                    <View style={styles.personalInfoContainer}>
                        <DImage
                            resizeMode='cover'
                            defaultSource={app.img.personal_head}
                            source={companyInfo.logo?{uri: headUrl}:headUrl}
                            style={styles.headerIcon}  />
                        <View style={styles.personalInfoStyle}>
                            <View style={styles.nameContainer}>
                                <Text style={[styles.nameText, {fontSize: 18}]} numberOfLines={1}>
                                    {companyInfo.name}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.divisionLine}></View>
                    <View style={styles.studyDetailContainer}>
                        <View style={styles.panelContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.numberStyle}>
                                    {companyInfo.operatorCount}
                                </Text>
                            </View>
                            <Text style={styles.timeText}>开通特种兵人数</Text>
                        </View>
                        <View style={styles.vline}/>
                        <View style={styles.panelContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.numberStyle}>
                                    {companyInfo.enterDays}
                                </Text>
                            </View>
                            <Text style={styles.timeText}>企业入驻天数</Text>
                        </View>
                        <View style={styles.vline}/>
                        <View style={styles.panelContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.numberStyle}>
                                    {companyInfo.todaySignInCount}
                                </Text>
                            </View>
                            <Text style={styles.timeText}>今日登录人数</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    },
    renderEmployeeWork(){
        let {monthWeekPlanNum,dayPlanNum,summaryNum,submitLog}=this.state;
        return (
            <View style={styles.workContainer}>
                <View style={styles.workStyle}>
                    <View style={styles.verticalLine}></View>
                    <Text style={styles.workText}>员工工作情况</Text>
                </View>
                <View style={styles.bottomLine}></View>
                <View style={styles.studyDetailContainer}>
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
                <View style={styles.studyDetailContainer}>
                    <View style={styles.panelContainer}>
                        <View style={styles.contentContainer}>
                            <Text style={styles.numberBlackStyle}>
                                {monthWeekPlanNum?monthWeekPlanNum.complete:''}
                            </Text>
                            <Text style={styles.numberAllStyle}>{'/'}</Text>
                            <Text style={styles.numberAllStyle}>{monthWeekPlanNum?monthWeekPlanNum.unfinished:''}</Text>
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
                            <Text style={styles.numberAllStyle}>{dayPlanNum?dayPlanNum.unfinished:''}</Text>
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
                            <Text style={styles.numberAllStyle}>{summaryNum?summaryNum.unfinished:''}</Text>
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
                    renderSeparator={this.renderSeparator}
                    />
            </View>

        );
    },
    renderEmployeeTask() {
        let {taskSubmitRateData}=this.state;
        return (
            <View style={styles.workContainer}>
                <View style={styles.workStyle}>
                    <View style={styles.verticalLine}></View>
                    <Text style={styles.workText}>员工任务提交情况</Text>
                </View>
                <View style={styles.bottomLine}></View>
                {
                    taskSubmitRateData&&
                    <LineStackChart taskSubmitRateData={taskSubmitRateData}/>
                }
                <View style={[styles.bottomLine, {marginTop: 8}]}></View>
                <TouchableOpacity onPress={this.toEmployeeMonthCommit}>
                    <Text style={[styles.chartBottomText, {marginTop: 10}]}>点击查看详情</Text>
                </TouchableOpacity>
            </View>
        );
    },
    renderEmployeeStudy(){
        let {avgWhenLong,rose} = this.state;
        return (
            <View style={styles.workContainer}>
                <View style={styles.workStyle}>
                    <View style={styles.verticalLine}></View>
                    <Text style={styles.workText}>员工学习情况</Text>
                </View>
                <View style={styles.bottomLine}></View>
                <View style={styles.chartTopRowView}>
                    <Text style={styles.chartTopAvgText}>{avgWhenLong+'h'}</Text>
                    <View style={styles.chartTopRoseView}>
                        <View style={[styles.chartTopRoseMark,rose<0?{transform: [{rotate: '180deg'}]}:null]}></View>
                        <Text style={styles.chartTopRoseText}>{rose+'h'}</Text>
                    </View>

                </View>
                <Text style={styles.chartTopText}>员工今日平均学习时长</Text>
                <LineChart yData={this.state.yData} xData={this.state.xData?this.state.xData:[]} height={200}/>
                <TouchableOpacity onPress={this.toEmployeeStudy}>
                    <Text style={styles.chartBottomText}>点击查看详情</Text>
                </TouchableOpacity>
            </View>
        );
    },
    renderMySpecops(){
        let {specopsList}=this.state;
        return (
            <View style={styles.workContainer}>
                <View style={styles.workStyle}>
                    <View style={styles.verticalLine}></View>
                    <Text style={styles.workText}>我的赢销特总兵</Text>
                </View>
                <View style={styles.bottomLine}></View>
                <ListView
                    initialListSize={1}
                    enableEmptySections={true}
                    style={styles.list}
                    dataSource={specopsList}
                    renderRow={this.renderSpecopsRow}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    },
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.pageContainer}>
                    <this.renderUserInfo />
                    <this.renderEmployeeWork />
                    <this.renderEmployeeTask />
                    <this.renderEmployeeStudy />
                    <this.renderMySpecops />
                </ScrollView>
            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    pageContainer: {
        flex: 1,
    },
    personContainer: {
        width: sr.w-6,
        height: 147,
        alignSelf: 'center',
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
    rowHeaderIcon: {
        width: 36,
        height: 36,
        marginLeft:20,
        borderRadius: 18,
    },
    personalInfoStyle: {
        marginLeft: 31,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    nameContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    nameText: {
        color: '#000000',
        fontSize:18,
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
    buttonContainer: {
        borderRadius:2,
        height:42,
        flex:1,
        marginLeft:8,
        marginRight:8,
        alignItems: 'center',
        justifyContent: 'center',
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
    buttonText: {
        color: '#FFFFFF',
        backgroundColor:'transparent',
        fontSize: 20,
        fontFamily: 'STHeitiSC-Medium',
    },
    contentContainer: {
        height: 24,
        flexDirection: 'row',
        marginBottom: 6,
    },
    numberStyle: {
        fontSize: 20,
        fontFamily: 'STHeitiSC-Medium',
        color:'#ff5e5f',
    },
    numberBlackStyle: {
        fontSize: 20,
        fontFamily: 'STHeitiSC-Medium',
        color:'#242424',
    },
    numberAllStyle: {
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
        color:'#919191',
        lineHeight:30,
    },
    numberTipStyle: {
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
        color:'#919191',
    },
    timeText: {
        color: '#848484',
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
    },
    vline: {
        width: 1,
        height: 34,
        backgroundColor: '#EEEEEE',
    },
    bottomLine: {
        height: 1,
        backgroundColor: '#ededed',
    },
    workContainer: {
        marginTop:10,
        backgroundColor: '#FFFFFF',
    },
    workStyle: {
        height: 47,
        marginLeft: 16,
        alignItems: 'center',
        flexDirection: 'row',
    },
    verticalLine: {
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
    list: {
        alignSelf:'stretch'
    },
    specposSeparator: {
        height:1,
        backgroundColor: '#ededed'
    },
    separator: {
        height:1,
        backgroundColor: '#fafafa'
    },
    rowContainer: {
        height: 32,
        flexDirection: 'row',
        alignItems:'center'
    },
    rowSpecopsContainer: {
        height: 52,
        flexDirection: 'row',
        alignItems:'center'
    },
    rowTime: {
        marginLeft:18,
        fontFamily: 'STHeitiSC-Medium',
        fontSize:14,
        color: '#919191',
    },
    rowName: {
        marginLeft:29,
        fontFamily: 'STHeitiSC-Medium',
        fontSize:14,
        color: '#919191',
    },
    rowTip: {
        marginLeft:18,
        fontFamily: 'STHeitiSC-Medium',
        fontSize:14,
        color: '#919191',
    },
    rowSpecopsName: {
        marginLeft:18,
        fontFamily: 'STHeitiSC-Medium',
        fontSize:16,
        color: '#333333',
    },
    rowPosition: {
        marginLeft:18,
        fontFamily: 'STHeitiSC-Medium',
        fontSize:10,
        color: '#FFFFFF',
        backgroundColor: '#FF5E5F',
        borderRadius: 2,
        paddingHorizontal:3,
    },
    chartTopRowView: {
        flexDirection:'row',
        marginTop:18,
    },
    chartTopAvgText: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 24,
        color: '#FF5E5F',
        textAlign:'right',
        flex:1,
        marginLeft:60,
    },
    chartTopRoseView: {
        flex:1,
        flexDirection:'row',
        marginLeft:10,
    },
    chartTopRoseMark: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#F35837',
        alignSelf:'center',
        marginLeft:17,
    },
    chartTopRoseText: {
        marginLeft:4,
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 14,
        color: '#F35837',
        textAlign:'left',
        alignSelf:'center',
    },
    chartTopText: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 14,
        color: '#737373',
        textAlign:'center',
        lineHeight: 22,
    },
    chartBottomText: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 14,
        color: '#4E99E7',
        textAlign:'center',
        marginBottom:12,
    },

});
