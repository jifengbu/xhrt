'use strict';

const React = require('react');
const ReactNative = require('react-native');

const {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    ListView,
} = ReactNative;

const moment = require('moment');
const { DImage } = COMPONENTS;
const LineChart = require('./lineChart.js');
const EmployeeStudyDetail = require('./EmployeeStudyDetail.js');
const SpecopsPerson = require('./SpecopsPerson.js');
const EmployeeMonthPlan = require('./EmployeeMonthPlan.js');
const EmployeePlanAndSummary = require('./EmployeePlanAndSummary.js');
const LineStackChart = require('./lineStackChart.js');
const EmployeeMonthCommit = require('./EmployeeMonthCommit.js');

const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '赢销截拳道',
    },
    getInitialState () {
        this.list = [];
        this.pageNo = 1;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            specopsList: this.ds.cloneWithRows(this.list),
            submitLog: this.ds.cloneWithRows([]),
            monthWeekPlanNum:{},
            dayPlanNum:{},
            summaryNum:{},
            userSum:0,
            xData:[],
            yData:[],
            avgWhenLong:0,
            rose:0,
            taskSubmitRateData: {},
            haveData: false,
        };
    },
    onWillFocus () {
        // this.setState({haveData: false});
        // setTimeout(()=>{
        //     this.setState({haveData: true});
        // }, 400);
    },
    generateMyCurrentYearMonth () {
        // find month first monday
        let isFirstMonday = false;
        let addPos = 0;

        let firstDay = '';
        firstDay = moment().set('date', 1).format('YYYY-MM-DD');

        let firstMonday = '';
        while (isFirstMonday === false) {
            const isMonday = moment(firstDay).add(1 * addPos, 'd').day();
            if (isMonday === 1) {
                isFirstMonday = true;
                firstMonday = moment(firstDay).add(1 * addPos, 'd').format('YYYY-MM-DD');
                break;
            }
            addPos++;
        }

        const ret = {};
        ret.year = moment().year();
        ret.month = moment().month();
        if (moment(firstMonday).date() > moment().date()) {
            ret.month = ret.month - 1;
            if (ret.month < 0) {
                ret.month = 11;
                ret.year = ret.year - 1;
            }
        }
        return ret;
    },
    componentDidMount: function () {
        this.getWorkSituationAbstract();
        this.getSpecialList();
        this.getStudySituationAbstract();
        this.getUserTaskSubmitRate();
    },
    getUserTaskSubmitRate () {
        const tTime = moment();
        tTime.set('date', 15);
        tTime.set('year', this.generateMyCurrentYearMonth().year);
        tTime.set('month', this.generateMyCurrentYearMonth().month);
        const info = app.personal.info;
        const param = {
            userID: info.userID,
            companyId: info.companyInfo.companyId,
            date:tTime.format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_USER_TASK_SUBMIT_RATE, param, this.getUserTaskSubmitRateSuccess);
    },
    getUserTaskSubmitRateSuccess (data) {
        if (data.success) {
            this.setState({ taskSubmitRateData: data.context });
        }
    },
    getWorkSituationAbstract () {
        const info = app.personal.info;
        const param = {
            userID: info.userID,
            companyId: info.companyInfo.companyId,
        };
        POST(app.route.ROUTE_GET_WORK_SITUATION_ABSTRACT, param, this.getWorkSituationAbstractSuccess, true);
    },
    getWorkSituationAbstractSuccess (data) {
        if (data.context) {
            const { userSum } = data.context;
            const { submitLog } = data.context;
            const { monthWeekPlanNum } = data.context;
            const { dayPlanNum } = data.context;
            const { summaryNum } = data.context;
            this.setState({ submitLog:this.ds.cloneWithRows(submitLog.slice(0, 4)), monthWeekPlanNum, dayPlanNum, summaryNum, userSum });
        }
    },
    getSpecialList () {
        const info = app.personal.info;
        const param = {
            companyId: info.companyInfo.companyId,
            userID: info.userID,
            pageNo:this.pageNo,
        };
        this.setState({ infiniteLoadStatus: this.pageNo === 1 ? STATUS_START_LOAD : STATUS_HAVE_MORE });
        POST(app.route.ROUTE_GET_SPECIAL_LIST, param, this.getSpecialListSuccess, this.getSpecialListFailed);
    },
    getSpecialListSuccess (data) {
        if (data.success) {
            if (data.context) {
                const list = data.context.userList || [];
                this.list = this.list.concat(list);
                const infiniteLoadStatus = list.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_HAVE_MORE;
                this.setState({
                    infiniteLoadStatus: infiniteLoadStatus,
                    specopsList:this.ds.cloneWithRows(this.list),
                });
            } else {
                this.setState({ infiniteLoadStatus: STATUS_NO_DATA });
            }
            this.setState({ haveData: false });
            setTimeout(() => {
                this.setState({ haveData: true });
            }, 400);
        } else {
            this.getSpecialListFailed();
        }
    },
    getSpecialListFailed () {
        this.pageNo--;
        this.setState({ infiniteLoadStatus: STATUS_LOAD_ERROR });
    },
    getStudySituationAbstract () {
        const info = app.personal.info;
        const param = {
            userID: info.userID,
            companyId: info.companyInfo.companyId,
        };
        POST(app.route.ROUTE_GET_STUDY_SITUATION_ABSTRACT, param, this.getStudySituationAbstractSuccess);
    },
    fomatFloat (src, pos) {
        // 保留一位小数
        return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    },
    getStudySituationAbstractSuccess (data) {
        if (data.context) {
            const xData = [];
            const yData = [];
            const whenLongData = data.context.studyWhenLong;
            const coursesNumber = whenLongData.whenLongList;
            for (let index in coursesNumber) {
                if (coursesNumber.hasOwnProperty(index)) {
                    xData.push(moment(coursesNumber[index].date).format('M.D'));
                    const num = coursesNumber[index].dayAvgWhenLong;
                    const number = this.fomatFloat(num / 60, 1);
                    yData.push(number);
                }
            }
            const avgWhenLong = this.fomatFloat((whenLongData.avgWhenLong) / 60, 1);
            let rose = this.fomatFloat((whenLongData.rose) / 60, 1);
            if (yData.length > 2) {
                const n = yData[yData.length - 1] - yData[yData.length - 2];
                rose = this.fomatFloat(n, 1);
            }

            this.setState({ xData:xData, yData:yData, avgWhenLong:avgWhenLong, rose:rose });
        }
    },
    toEmployeeTarget () {
        app.navigator.push({
            title: '员工目标',
            component: EmployeeMonthPlan,
        });
    },
    toEmployeePlan () {
        app.navigator.push({
            title: '员工计划',
            component: EmployeePlanAndSummary,
            passProps: { isDayPlan: true, isDaySummary: false },
        });
    },
    toEmployeeSummary () {
        app.navigator.push({
            title: '员工总结',
            component: EmployeePlanAndSummary,
            passProps: { isDayPlan: false, isDaySummary: true },
        });
    },
    toEmployeeMonthCommit () {
        app.navigator.push({
            title: '员工任务提交详情',
            component: EmployeeMonthCommit,
        });
    },
    toEmployeeStudy () {
        app.navigator.push({
            title: '员工学习详情',
            component: EmployeeStudyDetail,
        });
    },
    _onPressRow (userId) {
        app.navigator.push({
            component: SpecopsPerson,
            passProps: { userID: userId },
        });
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    renderSpecposSeparator (sectionID, rowID) {
        return (
            <View style={styles.specposSeparator} key={rowID} />
        );
    },
    renderWorkRow (obj, sectionID, rowID) {
        return (
            <View style={styles.rowContainer}>
                <Text numberOfLines={1} style={styles.rowTime}>{obj.date && moment(obj.date).format('M.D HH:mm')}</Text>
                <Text numberOfLines={1} style={styles.rowName}>{obj.name}</Text>
                <Text numberOfLines={1} style={styles.rowTip}>{obj.context}</Text>
            </View>
        );
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
    renderSpecopsRow (obj, sectionID, rowID) {
        const headUrl = obj.userImg ? obj.userImg : obj.sex === 1 ? app.img.personal_sex_male : app.img.personal_sex_female;
        const nameTemWidth = this.calculateStrLength(obj.userName);
        const nameWidth = nameTemWidth * 10+7;
        return (
            <TouchableHighlight
                onPress={this._onPressRow.bind(null, obj.userId)}
                underlayColor='#EEB422'>
                <View style={styles.rowSpecopsContainer}>
                    <DImage
                        resizeMode='cover'
                        defaultSource={app.img.personal_head}
                        source={obj.userImg ? { uri: headUrl } : headUrl}
                        style={styles.rowHeaderIcon} />
                    <View style={{ marginLeft:18, width: nameWidth > 140 ? sr.ws(140) : sr.ws(nameWidth) }}>
                        <Text numberOfLines={1} style={styles.rowSpecopsName}>
                            {obj.userName}
                        </Text>
                    </View>
                    {
                        obj.post != '' &&
                        <View style={styles.rowPosition}>
                            <Text numberOfLines={1} style={styles.rowPositionText}>
                                {obj.post}
                            </Text>
                        </View>
                    }
                </View>
            </TouchableHighlight>
        );
    },
    renderUserInfo () {
        const { companyInfo } = app.personal.info;
        const headUrl = companyInfo.logo ? companyInfo.logo : app.img.common_default;
        return (
            <View>
                <View style={styles.personContainer}>
                    <View style={styles.personalInfoContainer}>
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
                        <View style={styles.personalInfoStyle}>
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameText} numberOfLines={1}>
                                    {companyInfo.name}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.divisionLine} />
                    <View style={styles.studyDetailContainer}>
                        <View style={styles.panelContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.numberStyle}>
                                    {companyInfo.operatorCount}
                                </Text>
                            </View>
                            <Text style={styles.timeText}>开通特种兵人数</Text>
                        </View>
                        <View style={styles.vline} />
                        <View style={styles.panelContainer}>
                            <View style={styles.contentContainer}>
                                <Text style={styles.numberStyle}>
                                    {companyInfo.enterDays}
                                </Text>
                            </View>
                            <Text style={styles.timeText}>企业入驻天数</Text>
                        </View>
                        <View style={styles.vline} />
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
    renderEmployeeWork () {
        const { monthWeekPlanNum, dayPlanNum, summaryNum, submitLog, userSum } = this.state;
        return (
            <View style={styles.workContainer}>
                <View style={styles.workStyle}>
                    <View style={styles.verticalLine} />
                    <Text style={styles.workText}>员工工作情况</Text>
                </View>
                <View style={styles.bottomLine} />
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
                        <View style={styles.contentContainerPlan}>
                            <Text style={styles.numberBlackStyle}>
                                {monthWeekPlanNum ? monthWeekPlanNum.complete : ''}
                            </Text>
                            <Text style={styles.numberAllStyle}>{'/'}</Text>
                            <Text style={styles.numberAllStyle}>{userSum}</Text>
                        </View>
                        <Text style={styles.numberTipStyle}>目标提交人数</Text>
                    </View>
                    <View style={styles.vline} />
                    <View style={styles.panelContainer}>
                        <View style={styles.contentContainerPlan}>
                            <Text style={styles.numberBlackStyle}>
                                {dayPlanNum ? dayPlanNum.complete : ''}
                            </Text>
                            <Text style={styles.numberAllStyle}>{'/'}</Text>
                            <Text style={styles.numberAllStyle}>{userSum}</Text>
                        </View>
                        <Text style={styles.numberTipStyle}>计划提交人数</Text>
                    </View>
                    <View style={styles.vline} />
                    <View style={styles.panelContainer}>
                        <View style={styles.contentContainerPlan}>
                            <Text style={styles.numberBlackStyle}>
                                {summaryNum ? summaryNum.complete : ''}
                            </Text>
                            <Text style={styles.numberAllStyle}>{'/'}</Text>
                            <Text style={styles.numberAllStyle}>{userSum}</Text>
                        </View>
                        <Text style={styles.numberTipStyle}>总结提交人数</Text>
                    </View>
                </View>
                <ListView
                    initialListSize={1}
                    enableEmptySections
                    style={styles.list}
                    dataSource={submitLog}
                    renderRow={this.renderWorkRow}
                    renderSeparator={this.renderSeparator}
                    />
            </View>

        );
    },
    renderEmployeeTask () {
        const { taskSubmitRateData } = this.state;
        return (
            <View style={styles.workContainer}>
                <View style={styles.workStyle}>
                    <View style={styles.verticalLine} />
                    <Text style={styles.workText}>员工任务提交情况</Text>
                </View>
                <View style={styles.bottomLine} />
                {
                    this.state.haveData &&
                    <LineStackChart taskSubmitRateData={taskSubmitRateData} />
                }
                <View style={[styles.bottomLine, { marginTop: 8 }]} />
                <TouchableOpacity onPress={this.toEmployeeMonthCommit}>
                    <Text style={[styles.chartBottomText, { marginTop: 10 }]}>点击查看详情</Text>
                </TouchableOpacity>
            </View>
        );
    },
    renderEmployeeStudy () {
        const { avgWhenLong, rose } = this.state;
        return (
            <View style={styles.workContainer}>
                <View style={styles.workStyle}>
                    <View style={styles.verticalLine} />
                    <Text style={styles.workText}>员工学习情况</Text>
                </View>
                <View style={styles.bottomLine} />
                <View style={styles.chartTopRowView}>
                    <Text style={styles.chartTopAvgText}>{avgWhenLong}<Text style={styles.chartTopRoseText}>h</Text></Text>
                    <View style={styles.chartTopRoseView}>
                        <View style={[styles.chartTopRoseMark, rose < 0 ? { transform: [{ rotate: '180deg' }] } : null]} />
                        <Text style={styles.chartTopRoseText}>{Math.abs(rose) + 'h'}</Text>
                    </View>
                </View>
                <Text style={styles.chartTopText}>员工今日平均学习时长</Text>
                {
                    this.state.haveData &&
                    <LineChart yData={this.state.yData} xData={this.state.xData ? this.state.xData : []} height={200} />
                }
                <TouchableOpacity onPress={this.toEmployeeStudy}>
                    <Text style={styles.chartBottomText}>点击查看详情</Text>
                </TouchableOpacity>
            </View>
        );
    },
    renderHeader () {
        return (
            <View style={styles.pageContainer}>
                <this.renderUserInfo />
                <this.renderEmployeeWork />
                <this.renderEmployeeTask />
                <this.renderEmployeeStudy />
                <View style={styles.workContainer}>
                    <View style={styles.workStyle}>
                        <View style={styles.verticalLine} />
                        <Text style={styles.workText}>我的赢销特种兵</Text>
                    </View>
                    <View style={styles.bottomLine} />
                </View>
            </View>
        );
    },
    renderFooter () {
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        );
    },
    onEndReached () {
        if (this.state.infiniteLoadStatus === STATUS_ALL_LOADED || this.state.infiniteLoadStatus === STATUS_TEXT_HIDE) {
            return;
        }
        this.pageNo++;
        this.getSpecialList();
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.separator} />
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections
                    removeClippedSubviews={false}
                    style={styles.listStyle}
                    onEndReached={this.onEndReached}
                    dataSource={this.state.specopsList}
                    renderRow={this.renderSpecopsRow}
                    renderHeader={this.renderHeader}
                    renderFooter={this.renderFooter}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
    },
    separator: {
        width: sr.w,
        backgroundColor: '#EDEDED',
        height: 1,
    },
    pageContainer: {
        flex: 1,
        backgroundColor: '#F1F1F1',
    },
    personContainer: {
        width: sr.w - 6,
        height: 147,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
    },
    personalInfoContainer: {
        height: 82,
        flexDirection: 'row',
    },
    headerCircle: {
        width: 60,
        height: 60,
        marginLeft: 16,
        marginTop: 13,
        borderRadius: 30,
        alignItems: 'center',
    },
    headerIcon: {
        width: 54,
        height: 54,
        marginTop: 1,
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
    },
    nameContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    nameText: {
        color: '#000000',
        fontSize:18,
        width: sr.w-115,
        fontFamily: 'STHeitiSC-Medium',
    },
    divisionLine: {
        width: sr.w - 24,
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
    contentContainerPlan: {
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
        fontSize: 18,
        fontFamily: 'STHeitiSC-Medium',
        color:'#242424',
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
        height: 18,
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
        alignSelf:'stretch',
    },
    specposSeparator: {
        height:1,
        backgroundColor: '#ededed',
    },
    rowContainer: {
        height: 32,
        flexDirection: 'row',
        alignItems:'center',
    },
    rowSpecopsContainer: {
        height: 52,
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
    rowSpecopsName: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize:16,
        color: '#333333',
    },
    rowPosition: {
        marginLeft:18,
        backgroundColor: '#FF5E5F',
        borderRadius: 2,
    },
    rowPositionText: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize:10,
        marginHorizontal: 3,
        color: '#FFFFFF',
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
    listFooterContainer: {
        height: 60,
        alignItems: 'center',
    },
    listFooter: {
        marginVertical: 10,
        color: 'gray',
        fontSize: 14,
    },
});
