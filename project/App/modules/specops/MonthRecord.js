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

const RecordItemView = require('./RecordItemView.js');
const moment = require('moment');
const { Button, InputBox } = COMPONENTS;
const CopyBox = require('../home/CopyBox.js');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '历史记录',
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
        this.props.updateItem();
        app.navigator.pop();
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            tabIndex: 0,
            weekSummary: '',
            weekCount: 0,
            currentWeekID:'',
            currentMonthID:'',
            monthDataSource: this.ds.cloneWithRows([]),
            weekDataSource: this.ds.cloneWithRows([]),
            isInputBoxShow: false,
            inputBoxText: '',
            isNextMonth: this.props.isNextMonth,
            memWeekTime: [],
            haveCannel: false,
            isModify:true,
        };
    },
    getWeekPlan (index) {
        return this.monthData.weekPlan[index];
    },
    clearMonthData () {
        this.monthData.monthPlan = [];
        this.monthData.weekPlan = [];
        for (let i = 0; i < 5; i++) {
            this.monthData.weekPlan[i] = [];
        }
    },
    processWeekPlan (obj) {
        this.monthData.weekPlan[obj.weekNum - 1].push(obj);
    },
    processWeekTime (startTime) {
        let firstMonday = moment(startTime).day(1);
        if (moment(firstMonday).month() != moment(startTime).month()) {
            firstMonday = moment(startTime).day(8);
        }
        for (let i = 0; i < 6; i++) {
            if (moment(firstMonday).add(7 * i, 'd').month() === moment(firstMonday).month()) {
                this.state.memWeekTime[i] = moment(firstMonday).add(7 * i, 'd').format('YYYY-MM-DD');
            } else {
                this.setState({ weekCount: i });
                this.memWeekCount = i;
                break;
            }
        }
    },
    getWeekSummary (index) {
        this.setState({ weekSummary:'' });
        const param = {
            userID:this.userID,
            planDate:moment(this.state.memWeekTime[index]).format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_WEEK_SUMMARY, param, this.getWeekSummarySuccess, true);

        // can modify.
        const currentIndex = this.getCurrentWeekIndex();
        this.setState({ isModify: !(index < currentIndex) });
    },
    getWeekSummarySuccess (data) {
        if (data.success) {
            this.setState({ weekSummary:data.context ? data.context.content : '' });
        } else {
            Toast(data.msg);
        }
    },
    getCurrentWeekIndex () {
        let index = 0;
        let strWeek = '';
        if (moment().day() === 0) {
            strWeek = moment().subtract(1, 'd').format('YYYY-MM-DD');
        } else {
            strWeek = moment().format('YYYY-MM-DD');
        }
        for (let i = 0; i < this.memWeekCount; i++) {
            if (moment(this.state.memWeekTime[i]).week() === moment(strWeek).week()) {
                index = i;
                break;
            }
        }
        return index;
    },
    componentDidMount () {
        if (this.props.userID) {
            this.userID = this.props.userID;
        } else {
            this.userID = app.personal.info.userID;
        }

        this.monthData = {};
        this.onInputBoxFun = null;
        this.memTabIndex = 0;
        this.memWeekCount = 0;
        this.clearMonthData();
        this.processWeekTime(this.props.time);
        this.getMonthData();
    },
    getMonthData () {
        const param = {
            userID:this.userID,
            planDate:moment(this.state.memWeekTime[0]).format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_MONTH_PLAN, param, this.getMonthDataSuccess, true);
    },
    getMonthDataSuccess (data) {
        if (data.success) {
            // process month plan..
            const monthPlan = data.context.monthPlan || [];
            const weekPlan = data.context.weekPlan || [];
            for (let i = 0; i < monthPlan.length; i++) {
                this.monthData.monthPlan.push(monthPlan[i]);
            }
            // process week plan..
            for (let i = 0; i < weekPlan.length; i++) {
                this.processWeekPlan(weekPlan[i]);
            }

            this.setState({ monthDataSource: this.ds.cloneWithRows(this.monthData.monthPlan) });
            this.changeTab(this.getCurrentWeekIndex());
        } else {
            Toast(data.msg);
        }
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    modifyMonthPlanContent (obj) {
        this.setState({ isInputBoxShow: true });
        this.onInputBoxFun = this.modifyMonthPlan;
        this.setState({ inputBoxText: obj.content });
        this.setState({ currentMonthID: obj.id });
        this.setState({ haveCannel: true });
    },
    modifyWeekPlanContent (obj) {
        this.setState({ isInputBoxShow: true });
        this.onInputBoxFun = this.modifyWeekPlan;
        this.setState({ inputBoxText: obj.content });
        this.setState({ currentWeekID: obj.id });
        this.setState({ haveCannel: true });
    },
    doCancel () {
        this.setState({ isInputBoxShow: false });
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
        let weekData = this.getWeekPlan(tabIndex);

        this.setState({ weekDataSource: this.ds.cloneWithRows(weekData) });
        this.getWeekSummary(tabIndex);
    },
    renderRowMonth (obj) {
        return (
            <View style={styles.listRow}>
                <RecordItemView
                    data={obj}
                    rowHeight={5}
                    onPress={this.modifyMonthPlanContent.bind(null, obj)}
                    />
            </View>
        );
    },
    renderRowWeek (obj) {
        return (
            <View style={styles.listRowWeek}>
                <RecordItemView
                    data={obj}
                    rowHeight={14}
                    onPress={this.modifyWeekPlanContent.bind(null, obj)}
                    />
            </View>
        );
    },
    render () {
        return (
            <View style={[styles.container, this.props.showDetail?null:{height: 0}]}
                onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <ScrollView>
                    <this.monthPlanPurpose />
                    <this.monthPlanContent />
                    <this.monthPlanConclusion />
                </ScrollView>
            </View>
        );
    },
    // 本月工作计划
    monthPlanPurpose () {
        let monthStr = '';
        if (this.state.isNextMonth) {
            monthStr = moment().add(1, 'M').format('YYYY年MM月');
        } else {
            monthStr = moment().format('YYYY年MM月DD日');
        }

        return (
            <View style={styles.monthPlanPurposeViewStyle}>
                <View style={styles.topPanelStyle}>
                    <View style={styles.titleContainer}>
                        <Image
                            resizeMode='contain'
                            source={app.img.specops_cicle}
                            style={styles.iconCycleStyle} />
                        <Text style={styles.contextText}>
                            月工作目标
                        </Text>
                    </View>
                </View>
                <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.monthDataSource}
                    renderRow={this.renderRowMonth}
                    />
            </View>
        );
    },
    getStrTime (index) {
        const time1 = moment(this.state.memWeekTime[index]);
        const time2 = moment(this.state.memWeekTime[index]).add(6, 'd');
        let strTime = '';

        if (this.state.memWeekTime[index] != undefined) {
            if (time2.year() > time1.year()) {
                strTime = time1.format('MM.DD') + '-' + time2.format('MM.DD');
            } else if (time2.month() > time1.month()) {
                strTime = time1.format('MM.DD') + '-' + time2.format('MM.DD');
            } else {
                strTime = time1.format('MM.DD') + '-' + time2.format('MM.DD');
            }
        }
        return strTime;
    },
    // 本月详细工作计划
    monthPlanContent () {
        const { tabIndex } = this.state;
        const menuAdminArray1 = ['第一周', '第二周', '第三周', '第四周'];
        const menuAdminArray2 = ['第一周', '第二周', '第三周', '第四周', '第五周'];
        let menuAdminArray = [];
        if (this.state.weekCount > 4) {
            menuAdminArray = menuAdminArray2;
        } else {
            menuAdminArray = menuAdminArray1;
        }
        return (
            <View style={styles.monthPlanInfoViewStyle}>
                <View style={styles.titleContainer}>
                    <Image
                        resizeMode='contain'
                        source={app.img.specops_cicle}
                        style={styles.iconCycleStyle} />
                    <Text style={styles.contextText}>
                        周工作目标
                    </Text>
                </View>
                <View style={styles.tabContainer}>
                    {
                        menuAdminArray.map((item, i) => {
                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={this.changeTab.bind(null, i)}
                                    style={styles.tabButton}>
                                    <View style={[styles.tabView, this.state.tabIndex === i ? { backgroundColor: '#FF6363' } : { backgroundColor: '#F2FFF9' }]}>
                                        <Text style={[styles.tabText, this.state.tabIndex === i ? { color: 'white' } : null]} >
                                            {item}
                                        </Text>
                                        <Text style={[styles.contextTextDayTime, this.state.tabIndex === i ? { color: 'white' } : null]}>
                                            {this.getStrTime(i)}
                                        </Text>
                                    </View>
                                    {
                                        this.state.tabIndex === i ?
                                            <View style={styles.triangle} />
                                        :
                                        this.state.tabIndex != i && this.state.tabIndex - 1 !== i &&
                                        <Image resizeMode='stretch' source={app.img.specops_grey_line} style={styles.vline} />
                                   }
                                </TouchableOpacity>
                            );
                        })
                    }
                </View>
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
    // 每周总结
    monthPlanConclusion () {
        return (
            <View style={styles.monthPlanConclusionViewStyle}>
                <View style={styles.titleWeekContainer}>
                    <Image
                        resizeMode='contain'
                        source={app.img.specops_cicle}
                        style={styles.iconCycleStyle} />
                    <Text style={styles.contextText}>{'周工作总结'}</Text>
                </View>
                <TouchableOpacity onLongPress={this.onLongPress.bind(null, this.state.weekSummary)}>
                    <Text style={[styles.detailStyle, this.state.weekSummary ? null : { color:'#FF6363' }]}>{this.state.weekSummary ? this.state.weekSummary : '未完成'}</Text>
                </TouchableOpacity>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    listRow: {
        marginLeft:12,
    },
    listRowWeek: {
        marginLeft:12,
    },
    containerMonthList: {
        marginTop: 1,
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    monthPlanPurposeViewStyle: {
        width: sr.w,
        flexDirection: 'column',
        marginTop: 15,
    },
    topPanelStyle: {
        width: sr.w,
        paddingBottom: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleWeekContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:10,
    },
    contextText: {
        fontSize: 18,
        color: '#404040',
        fontFamily:'STHeitiSC-Medium',
    },
    contextTextDayTime: {
        textAlign:'center',
        color: '#6e6e6e',
        fontSize: 10,
        fontFamily:'STHeitiSC-Medium',
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
        alignSelf:'stretch',
        marginTop: 3,
        marginHorizontal: 10,
    },
    inputPlanContainer: {
        height:85,
        marginHorizontal: 10,
        backgroundColor: '#e6eaeb',
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
    monthPlanInfoViewStyle: {
        marginTop: 15,
    },
    tabContainer: {
        marginTop: 23,
        width:sr.w,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tabButton: {
        flex: 1,
        height:55,
        flexDirection: 'row',
    },
    vline: {
        width: 1,
        height: 40,
        marginTop:2,
    },
    tabView: {
        flex: 1,
        height:44,
        marginTop:0,
        backgroundColor: '#f4f4f4',
    },
    tabText: {
        marginTop:4,
        fontSize: 16,
        color: '#6e6e6e',
        textAlign:'center',
        fontFamily:'STHeitiSC-Medium',
    },
    monthPlanConclusionViewStyle: {
        marginTop: 10,
    },
    inputContainer: {
        height:130,
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    detailStyle:{
        flex: 1,
        fontSize:14,
        color:'#2a2a2a',
        fontFamily:'STHeitiSC-Medium',
        marginLeft: 45,
        marginRight:21,
        marginTop:17,
        marginBottom:21,
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
    triangle: {
        position: 'absolute',
        left: 36,
        top: 40,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 10,
        borderBottomWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FF6363',
        transform: [
            { rotate: '180deg' },
        ],
    },
    iconCycleStyle: {
        width: 12,
        height: 12,
        marginLeft:20,
        marginRight:12,
    },
});
