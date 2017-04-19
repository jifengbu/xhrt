'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    ListView,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

const WeekRecordItemView = require('./WeekRecordItemView.js');
const moment = require('moment');
const CopyBox = require('../home/CopyBox.js');

const { Button, InputBox } = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        leftButton: { handler: () => app.scene.goBack() },
    },
    onStartShouldSetResponderCapture (evt) {
        console.log('----onStartShouldSetResponderCapture', evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        app.touchPosition.x = evt.nativeEvent.pageX;
        app.touchPosition.y = evt.nativeEvent.pageY;
        return false;
    },
    onLongPress (str) {
        if (str != '' && str.length > 0) {
            // 显示复制按钮
            app.showModal(
                <CopyBox copyY={app.touchPosition.y}
                    copyX={app.touchPosition.x}
                    copyString={str} />,
                        { backgroundColor: 'transparent' }
            );
        }
    },
    goBack () {
        app.navigator.pop();
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            tabIndex: 0,
            daySummary: '',
            currentWeekID:'',
            currentDayID:'',
            weekDataSource: this.ds.cloneWithRows([]),
            dayDataSource: this.ds.cloneWithRows([]),
            isInputBoxShow: false,
            inputBoxText: '',
            haveCannel: false,
            memDayTime: [],
            isNextWeek: this.props.isNextWeek,
            scrollSize: 80,
            problemArray:[],
            isModify:true,
            isWeekModify:true,
            isActualModify: true,
            showInputBox: false,
            showInputContext: '',
            showCheckInputBox: false,
            showCheckInputContext: '',
        };
    },
    clearWeekData () {
        this.weekData.weekPlan = [];
        this.weekData.dayPlan = [];
        for (let i = 0; i < 7; i++) {
            this.weekData.dayPlan[i] = [];
        }
    },
    getWeekNum (time) {
        let currentWeek = moment(time).week();
        const currentWeekday = moment(time).weekday();
        if (currentWeekday === 0) {
            currentWeek = currentWeek - 1;
        }
        return currentWeek;
    },
    isSameWeekWithCurrentTime (time) {
        const currentWeek = this.getWeekNum(moment().format('YYYY-MM-DD'));
        const selectWeek = this.getWeekNum(time);
        if (currentWeek === selectWeek) {
            return true;
        } else {
            return false;
        }
    },
    processDayPlan (obj) {
        const tWeek = Number(obj.week);
        if (tWeek === 0) {
            this.weekData.dayPlan[6].push(obj);
        } else {
            this.weekData.dayPlan[tWeek - 1].push(obj);
        }
    },
    processDayTime (startTime) {
        for (let i = 0; i < 7; i++) {
            this.state.memDayTime[i] = moment(startTime).add(i, 'd').format('YYYY-MM-DD');
        }
    },
    getDaySummary (index) {
        const dayPlan = this.weekData.dayPlan[index];
        this.setState({ daySummary:'' });
        const param = {
            userID:this.userID,
            planDate:moment(this.state.memDayTime[index]).format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_DAY_SUMMARY, param, this.getDaySummarySuccess, true);

        // get scroll size
        this.setState({ scrollSize:this.getScrollSize(index) });
        this.getFixedProblem(index);

        // get actually
        this.getActually(index);
    },
    getDaySummarySuccess (data) {
        if (data.success) {
            this.setState({ daySummary:data.context ? data.context.content : '' });
        } else {
            Toast(data.msg);
        }
    },
    getFixedProblem (index) {
        const param = {
            userID: this.userID,
            date:this.state.memDayTime[index],
        };
        POST(app.route.ROUTE_GET_FIXED_PROBLEM, param, this.getFixedProblemSuccess);
    },
    getFixedProblemSuccess (data) {
        if (data.success) {
            const { fixedProblem, myQuestionList } = data.context;
            this.state.problemArray = [];
            const tempArray = [];
            for (let i = 0; i < fixedProblem.length; i++) {
                const problemItem = {};
                problemItem.index = i + 1;
                problemItem.problemId = fixedProblem[i].problemId;
                problemItem.problemTitle = fixedProblem[i].problemTitle;
                problemItem.problemContent = fixedProblem[i].problemContent ? fixedProblem[i].problemContent : '';
                tempArray.push(problemItem);
            }
            if (myQuestionList) {
                for (let j = 0; j < myQuestionList.length; j++) {
                    const problemItem = {};
                    problemItem.index = j + fixedProblem.length + 1;
                    problemItem.problemId = myQuestionList[j].myQuestinoId;
                    problemItem.problemTitle = myQuestionList[j].title ? myQuestionList[j].title : '';
                    problemItem.problemContent = myQuestionList[j].content ? myQuestionList[j].content : '';
                    tempArray.push(problemItem);
                }
            }
            this.setState({ problemArray:tempArray });
        } else {
            Toast(data.msg);
        }
    },
    getCurrentDayIndex () {
        let index = 0;
        for (let i = 0; i < 7; i++) {
            if (moment(this.state.memDayTime[i]).day() === moment().day()) {
                index = i;
                break;
            }
        }
        return index;
    },
    getScrollSize (index) {
        let size = sr.rws(120);
        for (let i = 0; i < this.weekData.weekPlan.length; i++) {
            size += sr.rws(39);
        }
        for (let i = 0; i < this.weekData.dayPlan[index].length; i++) {
            size += sr.rws(39);
        }
        return size;
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    componentDidMount () {
        if (this.props.userID) {
            this.userID = this.props.userID;
        } else {
            this.userID = app.personal.info.userID;
        }

        this.weekData = {};
        this.onInputBoxFun = null;
        this.currentTime = this.props.time.format('YYYY-MM-DD');
        this.clearWeekData();
        this.processDayTime(this.currentTime);
        this.getWeekPlan(this.currentTime);
    },
    getWeekDataSuccess (data) {
        if (data.success) {
            const weekPlan = data.context.weekPlan || [];
            const dayPlan = data.context.dayPlan || [];
            this.clearWeekData();
            // process week plan..
            for (let i = 0; i < weekPlan.length; i++) {
                this.weekData.weekPlan.push(weekPlan[i]);
            }
            // process day plan..
            for (let i = 0; i < dayPlan.length; i++) {
                this.processDayPlan(dayPlan[i]);
            }

            this.setState({ weekDataSource: this.ds.cloneWithRows(this.weekData.weekPlan) });
            this.changeTab(this.getCurrentDayIndex());
        } else {
            Toast(data.msg);
        }
    },
    modifyWeekPlanContent (obj) {
        this.setState({ isInputBoxShow: true });
        this.onInputBoxFun = this.modifyWeekPlan;
        this.setState({ inputBoxText: obj.content });
        this.setState({ currentWeekID: obj.id });
        this.setState({ haveCannel: true });
    },
    showDayPlanDetail (obj) {
        this.setState({ isInputBoxShow: true });
        this.onInputBoxFun = this.doCancel;
        this.setState({ inputBoxText: obj.content });
        this.setState({ currentDayID: obj.id });
        this.setState({ haveCannel: false });
    },
    doCancel () {
        this.setState({ isInputBoxShow: false });
    },
    openOperateBox (item) {
        if (item.isOver) {
            this.setState({ showCheckInputBox: true, showCheckInputContext:item.content });
        } else {
            this.setState({ showInputBox: true, id:item.id, showInputContext:item.content });
        }
    },
    // 获取实际做的事
    getActually (index) {
        const param = {
            userID: this.userID,
            workDate:this.state.memDayTime[index],
        };
        POST(app.route.ROUTE_GET_ACTUAL_COMPLETE_WORK, param, this.getActuallySuccess, true);
    },
    getActuallySuccess (data) {
        if (data.success) {
            const actualWorks = data.context.actualWorks || [];
            this.setState({ dayDataSource: this.ds.cloneWithRows(actualWorks.slice()) });
        } else {
            Toast(data.msg);
        }
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
        this.getDaySummary(tabIndex);
    },
    getWeekPlan (time) {
        const param = {
            userID:this.userID,
            planDate:time,
        };
        POST(app.route.ROUTE_GET_WEEK_PLAN, param, this.getWeekDataSuccess, true);
    },
    getServerDayPlan (time) {
        const param = {
            userID:this.userID,
            planDate:time,
        };
        POST(app.route.ROUTE_GET_DAY_PLAN, param, this.getServerDayPlanSuccess, true);
    },
    getServerDayPlanSuccess (data) {
        this.setState({ dayDataSource: this.ds.cloneWithRows(data.context.dayPlan.reverse()) });
    },
    renderRowWeek (obj) {
        return (
            <View style={styles.listRowWeek}>
                <WeekRecordItemView
                    data={obj}
                    rowHeight={10}
                    haveImage={this.props.haveImage}
                    />
            </View>
        );
    },
    renderRowDay (obj) {
        return (
            <View style={styles.listRowDay}>
                <WeekRecordItemView
                    data={obj}
                    rowHeight={8}
                    />
            </View>
        );
    },
    renderRowDayComplete (obj) {
        return (
            <View style={styles.listRowDayComplete}>
                <WeekRecordItemView
                    data={obj}
                    />
            </View>
        );
    },
    render () {
        return (
            <View style={styles.container}
                onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <ScrollView>
                    <this.weekPlanPurpose />
                    <this.weekPlanContent />
                    <this.weekPlanConclusion />
                </ScrollView>
            </View>
        );
    },
    // 本周工作计划
    weekPlanPurpose () {
        let strTime = '';
        if (this.state.memDayTime.length > 0) {
            const time1 = moment(this.state.memDayTime[0]);
            const time2 = moment(this.state.memDayTime[0]).add(6, 'd');

            if (this.state.memDayTime[0] != undefined) {
                if (time2.year() > time1.year()) {
                    strTime = time1.format('YYYY年MM月DD日') + '-' + time2.format('YYYY年MM月DD日');
                } else if (time2.month() > time1.month()) {
                    strTime = time1.format('YYYY年MM月DD日') + '-' + time2.format('MM月DD日');
                } else {
                    strTime = time1.format('YYYY年MM月DD日') + '-' + time2.format('DD日');
                }
            }
        }
        return (
            <View style={styles.weekPlanPurposeViewStyle}>
                <View style={styles.titleContainer}>
                    <Image
                        resizeMode='contain'
                        source={app.img.specops_cicle}
                        style={styles.iconCycleStyle} />
                    <Text style={styles.contextText}>
                        周工作目标
                    </Text>
                </View>
                <View style={styles.separator} />
                <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.weekDataSource}
                    renderRow={this.renderRowWeek}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    },
    calculateStrLength (oldStr) {
        let height = 0;
        let linesHeight = 0;
        if (oldStr) {
            oldStr = oldStr.replace(/<\/?.+?>/g, /<\/?.+?>/g, '');
            oldStr = oldStr.replace(/[\r\n]/g, '|');
            const StrArr = oldStr.split('|');
            for (let i = 0; i < StrArr.length; i++) {
                // 计算字符串长度，一个汉字占2个字节
                const newStr = StrArr[i].replace(/[^\x00-\xff]/g, 'aa').length;
                // 计算行数
                if (newStr == 0) {
                    linesHeight = 1;
                } else {
                    linesHeight = Math.ceil(newStr / 48);
                }
                // 计算高度，每行18
                height += linesHeight * sr.ws(18);
            }
            return height + 1 * sr.ws(18);
        } else {
            return 0;
        }
    },
    // 本周详细工作计划
    weekPlanContent () {
        const { tabIndex } = this.state;
        const menuAdminArray = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        return (
            <View style={styles.weekPlanInfoViewStyle}>
                <View style={styles.tabContainer}>
                    {
                        menuAdminArray.map((item, i) => {
                            return (
                                <View key={i} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i)}
                                        style={[styles.tabButton, this.state.tabIndex === i ? { backgroundColor: '#FF8686', borderTopWidth:4 } : null]}>
                                        <View style={[styles.tabView, this.state.tabIndex === i ? { marginTop:5 } : null]}>
                                            <Text style={[styles.tabText, this.state.tabIndex === i ? { color:'#FFFFFF' } : null]} >
                                                {item}
                                            </Text>
                                            <Text style={[styles.contextTextDayTime, this.state.tabIndex === i ? { color:'#FFFFFF' } : null]}>
                                                {this.state.memDayTime[i] != null && moment(this.state.memDayTime[i]).format('MM.DD')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {(i !== menuAdminArray.length - 1 && this.state.tabIndex - 1 !== i && this.state.tabIndex !== i) &&
                                        <View style={styles.vline} />}
                                </View>
                            );
                        })
                    }
                </View>
                <View style={[styles.titleContainer, { marginTop: 17, marginBottom: 8 }]}>
                    <Image
                        resizeMode='contain'
                        source={app.img.specops_cicle}
                        style={styles.iconCycleStyle} />
                    <Text style={styles.contextText}>
                        计划工作项
                    </Text>
                </View>
                <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.dayDataSource}
                    renderRow={this.renderRowDay}
                    />
            </View>
        );
    },
    // 每日总结
    weekPlanConclusion () {
        const { problemArray, daySummary } = this.state;
        const height = this.calculateStrLength(daySummary);
        return (
            <View style={styles.weekPlanConclusionViewStyle}>
                <View style={styles.titleContainer}>
                    <Image
                        resizeMode='contain'
                        source={app.img.specops_cicle}
                        style={styles.iconCycleStyle} />
                    <Text style={styles.contextText}>
                        工作总结
                    </Text>
                </View>
                <TouchableOpacity onLongPress={this.onLongPress.bind(null, this.state.daySummary)}>
                    <Text style={styles.summaryStyle}>{daySummary == null || daySummary == '' ? '未完成' : daySummary}</Text>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Image
                        resizeMode='contain'
                        source={app.img.specops_cicle}
                        style={styles.iconCycleStyle} />
                    <Text style={styles.contextText}>
                        每日三省
                    </Text>
                </View>
                {
                    problemArray.map((item, i) => {
                        if (item.problemContent) {
                            const textInputHeight = this.calculateStrLength(item.problemContent);
                        }
                        return (
                            <View key={i}>
                                <Text style={styles.questionTitle}>{(i + 1) + '、' + item.problemTitle}</Text>
                                <TouchableOpacity onLongPress={this.onLongPress.bind(null, item.problemContent)}>
                                    <Text style={[styles.detailStyle, item.problemContent == null || item.problemContent == '' ? { color:'#FF6363' } : null]}>{item.problemContent == null || item.problemContent == '' ? '未完成' : item.problemContent}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        marginBottom:2,
    },
    dayImage:{
        width: 16,
        height: 16,
        marginHorizontal: 20,
        marginTop: 5,
    },
    planBotStyle: {
        width: sr.w,
        height: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    //   backgroundColor: '#8DCAAC'
    },
    titleStyle: {
        marginLeft: 9,
        fontSize: 18,
        color: '#404040',
        alignItems: 'center',
        fontWeight: '600',
    },
    questionTitle: {
        marginTop: 3,
        marginHorizontal: 45,
        marginRight:21,
        color: '#2a2a2a',
        fontFamily:'STHeitiSC-Medium',
    },
    inputAnswerContainer: {
        height:80,
        marginTop: 5,
        marginBottom: 10,
        marginHorizontal: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#B5B6B7',
        backgroundColor: '#e4e5e6',
    },
    weekPlanPurposeViewStyle: {
        width: sr.w,
        flexDirection: 'column',
    },
    titleContainer: {
        marginVertical:17,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contextText: {
        fontSize: 18,
        color:'#404040',
        fontFamily:'STHeitiSC-Medium',
    },
    contextTextDayTime: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 10,
        color: '#676767',
        fontSize: 14,
    },
    calendarIcon: {
        marginLeft: 5,
        width: 25,
        height: 25,
    },
    separator: {
        width: sr.w,
        height: 1,
        backgroundColor: '#EEEEEE',
    },
    list: {
        marginTop: 5,
        marginHorizontal: 20,
    },
    listRowWeek: {
        marginLeft:12,
    },
    listRowDay: {
        marginLeft:13,
    },
    listRowDayComplete: {
        // marginVertical:10,
        marginLeft:13,
    },
    inputPlanContainer: {
        height:85,
        marginHorizontal: 10,
        backgroundColor: '#e4e5e6',
    },
    submitBtnStyle: {
        alignSelf: 'flex-end',
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginBottom: 7,
        marginRight: 8,
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    submitBtntextStyle: {
        fontSize: 16,
        fontWeight: '500',
    },
    addTextStyle: {
        fontSize: 14,
        fontWeight: '900',
        color: CONSTANTS.THEME_COLOR,
    },
    addItemText: {
        width: sr.w,
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 8,
        marginHorizontal: 10,
    },
    rowContainer: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 8,
        flexDirection: 'row',
    },
    isFinishedIcon: {
        width: 17,
        height: 17,
        marginRight: 5,
    },
    weekPlanInfoViewStyle: {
        marginTop: 0,
    },
    tabContainer: {
        width:sr.w,
        height: 56,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginTop: app.isandroid ? -5 : 0,
        justifyContent: 'space-between',
        borderBottomColor:'#EEEEEE',
        borderBottomWidth:1,
    },
    tabButton: {
        flex: 1,
        height:55,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        borderColor: '#FF6262',
        backgroundColor: '#F2FFF9',
    },
    tabView: {
        flex: 1,
        marginTop:9,
    },
    tabText: {
        flex: 1,
        fontSize: 12,
        marginBottom:-8,
        color: '#676767',
        textAlign: 'center',
        fontFamily:'STHeitiSC-Medium',
    },
    weekPlanConclusionViewStyle: {
        // marginTop: 10,
    },
    inputContainer: {
        height:130,
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 10,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'grey',
        backgroundColor: '#e4e5e6',
    },
    detailStyle:{
        flex: 1,
        fontSize:14,
        paddingVertical: 15,
        marginLeft: 45,
        marginRight:21,
        textAlignVertical: 'top',
        color: '#2a2a2a',
        fontFamily:'STHeitiSC-Medium',
    },
    summaryStyle:{
        flex: 1,
        fontSize:14,
        paddingVertical: 3,
        marginLeft: 45,
        marginRight:21,
        textAlignVertical: 'top',
        color: '#2a2a2a',
        fontFamily:'STHeitiSC-Medium',
    },
    buttonContainer: {
        paddingBottom: 10,
    },
    buttontextStyle: {
        fontSize: 16,
        fontWeight: '900',
    },
    buttonStyle: {
        flex: 1,
        height: 36,
        borderRadius: 3,
        marginHorizontal: 10,
    },
    iconCycleStyle: {
        width: 12,
        height: 12,
        marginLeft:20,
        marginRight:12,
    },
    vline: {
        width: 1,
        height: 46,
        borderRadius: 1,
        backgroundColor: '#D2D2D2',
    },
});
