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
let sTimeFunc;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '历史记录',
        leftButton: { handler: () => app.scene.goBack() },
    },
    goBack () {
        app.navigator.pop();
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            daySummary: '',
            weekSummary: '',
            monthDataSource: this.ds.cloneWithRows([]),
            weekDataSource: this.ds.cloneWithRows([]),
            dayDataSource: this.ds.cloneWithRows([]),
            haveCannel: false,
            inputBoxText: '',
            isInputBoxShow: false,
            timeText:'',
            problemArray:[],
            actually:this.ds.cloneWithRows([]),
        };
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    componentDidMount () {
        sTimeFunc = this.timeFunc;
        this.currentTime = moment().format('YYYY-MM-DD');
    },
    onDidFocus () {
        this.setState({ timeText:moment().format('YYYY年MM月DD日') });
        const param = {
            userID:app.personal.info.userID,
            date:moment().format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_PLAN_SUMMARY, param, this.getPlanSummaryDataSuccess, true);

        // get actually
        this.getActually(moment().format('YYYY-MM-DD'));

        // const param2 = {
        //     userID: app.personal.info.userID,
        //     date:moment().format('YYYY-MM-DD'),
        // };
        // POST(app.route.ROUTE_GET_FIXED_PROBLEM, param2, this.getFixedProblemSuccess);
    },
    getFixedProblemSuccess (data) {
        if (data.success) {
            this.setState({ problemArray:data.context.fixedProblem });
        } else {
            Toast(data.msg);
        }
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
    timeFunc (time) {
        this.setState({ timeText:time.format('YYYY年MM月DD日') });
        this.currentTime = time.format('YYYY-MM-DD');
        const param = {
            userID:app.personal.info.userID,
            date:time.format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_PLAN_SUMMARY, param, this.getPlanSummaryDataSuccess, true);

        // get actually
        this.getActually(this.currentTime);

        // const param2 = {
        //     userID: app.personal.info.userID,
        //     date:time.format('YYYY-MM-DD'),
        // };
        // POST(app.route.ROUTE_GET_FIXED_PROBLEM, param2, this.getFixedProblemSuccess);
    },
    getPlanSummaryDataSuccess (data) {
        if (data.success) {
            this.setState({ monthDataSource: this.ds.cloneWithRows(data.context.monthPlan ? data.context.monthPlan : []) });
            this.setState({ weekDataSource: this.ds.cloneWithRows(data.context.weekPlan ? data.context.weekPlan : []) });
            this.setState({ dayDataSource: this.ds.cloneWithRows(data.context.dayPlan ? data.context.dayPlan : []) });
            this.setState({ daySummary: data.context.daySummary ? data.context.daySummary.content : '' });
            this.setState({ weekSummary: data.context.weekSummary ? data.context.weekSummary.content : '' });
            this.setState({ problemArray:data.context.fixedProblem ? data.context.fixedProblem : [] });
        } else {
            Toast(data.msg);
        }
    },
    showMonthPlanDetail (obj) {
        this.setState({ isInputBoxShow: true });
        this.setState({ inputBoxText: obj.content });
        this.setState({ haveCannel: false });
    },
    showWeekPlanDetail (obj) {
        this.setState({ isInputBoxShow: true });
        this.setState({ inputBoxText: obj.content });
        this.setState({ haveCannel: false });
    },
    showDayPlanDetail (obj) {
        this.setState({ isInputBoxShow: true });
        this.setState({ inputBoxText: obj.content });
        this.setState({ haveCannel: false });
    },
    doCancel () {
        this.setState({ isInputBoxShow: false });
    },
    onBeforeDay () {
        this.currentTime = moment(this.currentTime).subtract(1, 'days').format('YYYY-MM-DD');
        this.timeFunc(moment(this.currentTime));
    },
    onAfterDay () {
        if (this.currentTime == moment().format('YYYY-MM-DD')) {
            return;
        }
        this.currentTime = moment(this.currentTime).add(1, 'days').format('YYYY-MM-DD');
        this.timeFunc(moment(this.currentTime));
    },
    // 获取实际做的事
    getActually (dateStr) {
        const param = {
            userID: app.personal.info.userID,
            workDate:dateStr,
        };
        POST(app.route.ROUTE_GET_ACTUAL_COMPLETE_WORK, param, this.getActuallySuccess, true);
    },
    getActuallySuccess (data) {
        if (data.success) {
            const actualWorks = data.context.actualWorks || [];
            this.setState({ actually:this.ds.cloneWithRows(actualWorks) });
        } else {
            Toast(data.msg);
        }
    },
    // 总结视图
    render () {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.timeView}>
                        <TouchableOpacity
                            onPress={this.onBeforeDay}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.specops_day_before}
                                style={styles.dayImage} />
                        </TouchableOpacity>
                        <Text style={styles.timeText}>{this.state.timeText}</Text>
                        <TouchableOpacity
                            onPress={this.onAfterDay}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.specops_day_after}
                                style={styles.dayImage} />
                        </TouchableOpacity>
                    </View>
                    <this.dayPlanView />
                    <this.dayPlanCommpleteView />
                    <this.daySummaryView />
                    <View style={styles.separatorView} />
                    <this.weekPlanView />
                    <this.WeekSummaryView />
                    <View style={styles.separatorView} />
                    <this.monthPlanView />
                </ScrollView>
                {
                    this.state.isInputBoxShow &&
                    <InputBox
                        doConfirm={this.doCancel}
                        inputText={this.state.inputBoxText}
                        doCancel={this.doCancel}
                        haveCannel={this.state.haveCannel}
                        />
                }
            </View>
        );
    },
    renderRowWeek (obj) {
        return (
            <View style={styles.container}>
                <RecordItemView
                    data={obj}
                    onPress={this.showWeekPlanDetail.bind(null, obj)}
                    />
            </View>
        );
    },
    renderRowDayCommplete (obj) {
        return (
            <View style={styles.container}>
                <RecordItemView
                    data={obj}
                    haveHeadImage
                    onPress={this.showDayPlanDetail.bind(null, obj)}
                    />
            </View>
        );
    },
    renderRowMonth (obj) {
        return (
            <View style={styles.container}>
                <RecordItemView
                    data={obj}
                    onPress={this.showMonthPlanDetail.bind(null, obj)}
                    />
            </View>
        );
    },
    // 当天实际做的事
    dayPlanCommpleteView () {
        return (
            <View style={styles.planViewStyle}>
                <View style={styles.dayPanelStyle}>
                    <Text style={styles.contextTextPlan}>
                        当天实际做的事
                    </Text>
                </View>
                <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.actually}
                    renderRow={this.renderRowDayCommplete}
                    renderSeparator={this.renderSeparator}
                    />
                <View style={styles.separator} />
            </View>
        );
    },
    // 本日工作计划
    dayPlanView () {
        return (
            <View style={styles.planViewStyle}>
                <View style={styles.dayPanelStyle}>
                    <Text style={styles.contextTextPlan}>
                        当天工作计划
                    </Text>
                </View>
                <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.dayDataSource}
                    renderRow={this.renderRowWeek}
                    renderSeparator={this.renderSeparator}
                    />
                <View style={styles.separator} />
            </View>
        );
    },
    // 每日总结
    daySummaryView () {
        const { problemArray } = this.state;
        const heightDaySummary = this.calculateStrLength(this.state.daySummary);
        return (
            <View style={styles.planViewStyle}>
                <View style={styles.contextTextSummaryView}>
                    <Text style={styles.contextTextSummaryDay}>{'日总结'}</Text>
                </View>
                <View style={styles.separator} />
                <View style={[styles.inputContainer, { height:this.state.daySummary && heightDaySummary > 80 ? heightDaySummary : 80 }]}>
                    <TextInput
                        style={styles.detailStyle}
                        onChangeText={(text) => this.setState({ daySummary: text })}
                        multiline
                        defaultValue={this.state.daySummary}
                        editable={false}
                        />
                </View>
                {
                    problemArray.map((item, i) => {
                        const heightProblemContent = this.calculateStrLength(item.problemContent);
                        return (
                            <View key={i}>
                                <Text style={styles.questionTitle}>{item.problemTitle}</Text>
                                <View style={[styles.inputAnswerContainer, { height:item.problemContent && heightProblemContent > 80 ? heightProblemContent : 80 }]}>
                                    <TextInput
                                        style={styles.detailStyle}
                                        onChangeText={(text) => { item.problemContent = text; }}
                                        multiline
                                        editable={false}
                                        defaultValue={item.problemContent}
                                        />
                                </View>
                            </View>
                        );
                    })
                }
            </View>
        );
    },
    // 本周工作计划
    weekPlanView () {
        return (
            <View style={styles.planViewStyle}>
                <View style={styles.weekPanelStyle}>
                    <Text style={styles.contextTextPlan}>
                        当周工作计划
                    </Text>
                </View>
                <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.weekDataSource}
                    renderRow={this.renderRowWeek}
                    renderSeparator={this.renderSeparator}
                    />
                <View style={styles.separator} />
            </View>
        );
    },
    // 每周总结
    WeekSummaryView () {
        const heightWeekSummary = this.calculateStrLength(this.state.weekSummary);
        return (
            <View style={styles.planViewStyle}>
                <View style={styles.contextTextSummaryView}>
                    <Text style={styles.contextTextSummaryWeek}>{'周总结'}</Text>
                </View>
                <View style={styles.separator} />
                <View style={[styles.inputContainer, { height:this.state.weekSummary && heightWeekSummary > 80 ? heightWeekSummary : 80 }]}>
                    <TextInput
                        style={styles.detailStyle}
                        onChangeText={(text) => this.setState({ weekSummary: text })}
                        multiline
                        defaultValue={this.state.weekSummary}
                        editable={false}
                        />
                </View>
            </View>
        );
    },
    // 本月工作计划
    monthPlanView () {
        return (
            <View style={styles.planViewStyle}>
                <View style={styles.monthPanelStyle}>
                    <Text style={styles.contextTextPlan}>
                        当月工作计划
                    </Text>
                </View>
                <View style={styles.separator} />
                <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.monthDataSource}
                    renderRow={this.renderRowMonth}
                    renderSeparator={this.renderSeparator}
                    />
                <View style={styles.separator} />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    dayImage:{
        width: 16,
        height: 16,
        marginHorizontal: 20,
    },
    questionTitle: {
        marginTop: 15,
        marginHorizontal: 10,
        color:'#8CCAAC',
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
    timeView: {
        width: sr.w,
        height: 30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#EFF3F6',
        flexDirection: 'row',
    },
    timeText: {
        fontSize: 16,
        color: '#A22346',
    },
    planViewStyle: {
        width: sr.w,
        flexDirection: 'column',
    },
    dayPanelStyle: {
        width: sr.w,
        padding: 8,
        height: 30,
        backgroundColor: '#8CCAAC',
    },
    weekPanelStyle: {
        width: sr.w,
        padding: 8,
        height: 30,
        backgroundColor:'#D4C09D',
    },
    monthPanelStyle: {
        width: sr.w,
        padding: 8,
        height: 30,
        backgroundColor:'#A22346',
    },
    contextTextPlan: {
        fontSize: 14,
        color: 'white',
        fontWeight: '800',
    },
    contextTextSummaryView: {
        width: sr.w,
        height: 32,
        justifyContent:'center',
    },
    contextTextSummaryDay: {
        fontSize: 15,
        color: '#8CCAAC',
        fontWeight: '800',
        marginLeft: 10,
    },
    contextTextSummaryWeek: {
        fontSize: 15,
        color: '#D4C09D',
        fontWeight: '800',
        marginLeft: 10,
    },
    separator: {
        width: sr.w,
        height: 1,
        backgroundColor: '#EEEEEE',
    },
    separatorView: {
        width: sr.w,
        height: 20,
        backgroundColor: '#EFF3F6',
    },
    separatorSpaceView: {
        width: sr.w,
        height: 200,
    },
    list: {
        alignSelf:'stretch',
        marginTop: 5,
        marginHorizontal: 10,
    },
    inputContainer: {
        height:130,
        marginTop: 5,
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
        paddingVertical: 2,
        marginLeft: 5,
        textAlignVertical: 'top',
        backgroundColor: '#e4e5e6',
        color: '#555555',
    },
});
