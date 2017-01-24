'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} = ReactNative;

var moment = require('moment');
var NextWeekPlan = require('./NextWeekPlan.js');
var MonthPlan = require('./MonthPlan.js');
var WeekPlan = require('./WeekPlan.js');

module.exports = React.createClass({
    getInitialState() {
        return {
            memWeekTime: [],
            memDayTime: [],
        };
    },
    componentDidMount() {
        this.currentMonthNum = this.getCurrentMonth();
        this.processWeekTime(this.currentMonthNum-1);
        this.processDayTime(moment().format('YYYY-MM-DD'));
        this.currentWeekSeq = this.getCurrentTimeWeekSeq();
    },
    toNextWeekPlan() {
        app.navigator.push({
            component: NextWeekPlan,
        });
    },
    onMonthPlan(){
        app.navigator.push({
            component: MonthPlan,
        });
    },
    processDayTime(time){
        //  current time get day data.
        var dayStr = '';
        var day = moment(time).day();
        if (day === 0) {
            dayStr = moment(time).subtract(1, 'd').format('YYYY-MM-DD');
        }else {
            dayStr = moment(time).format('YYYY-MM-DD');
        }
        if (this.state.isNextWeek) {
            dayStr = moment(dayStr).add(7, 'd').format('YYYY-MM-DD');
        }
        for (var i = 0; i < 7; i++) {
            this.state.memDayTime[i] = moment(dayStr).startOf('week').add(1+i, 'd').format('YYYY-MM-DD');
        }
    },
    getCurrentMonthMonday(){
        // find month first monday
        var isFirstMonday = false;
        var addPos = 0;

        var firstDay = '';
        firstDay = moment().set('date', 1).format('YYYY-MM-DD');

        var firstMonday = '';
        while (isFirstMonday === false) {
            var isMonday = moment(firstDay).add(1*addPos, 'd').day();
            if (isMonday === 1) {
                isFirstMonday = true;
                firstMonday = moment(firstDay).add(1*addPos, 'd').format('YYYY-MM-DD');
                break;
            }
            addPos++;
        }
        if (moment().date() < moment(firstMonday).date()) {
            isFirstMonday = false;
            addPos = 0;
            firstDay = moment().subtract(1, 'M').set('date', 1).format('YYYY-MM-DD');
            firstMonday = '';
            while (isFirstMonday === false) {
                var isMonday = moment(firstDay).add(1*addPos, 'd').day();
                if (isMonday === 1) {
                    isFirstMonday = true;
                    firstMonday = moment(firstDay).add(1*addPos, 'd').format('YYYY-MM-DD');
                    break;
                }
                addPos++;
            }
        }
        return firstMonday;
    },
    getCurrentMonth(){
        var strFirstMonday = this.getCurrentMonthMonday();
        var monthNum = 0;
        if (moment().date() < moment(strFirstMonday).date()) {
            return moment().month();
        }else {
            return moment().month()+1;
        }
    },
    processWeekTime(month){
        // find month first monday
        var isFirstMonday = false;
        var addPos = 0;

        var firstDay = '';
        firstDay = moment().set('date', 1).set('month', month).format('YYYY-MM-DD');

        var firstMonday = '';
        while (isFirstMonday === false) {
            var isMonday = moment(firstDay).add(1*addPos, 'd').day();
            if (isMonday === 1) {
                isFirstMonday = true;
                firstMonday = moment(firstDay).add(1*addPos, 'd').format('YYYY-MM-DD');
                break;
            }
            addPos++;
        }
        if (moment().date() < moment(firstMonday).date()) {
            isFirstMonday = false;
            addPos = 0;
            firstDay = moment().subtract(1, 'M').set('date', 1).format('YYYY-MM-DD');
            firstMonday = '';
            while (isFirstMonday === false) {
                var isMonday = moment(firstDay).add(1*addPos, 'd').day();
                if (isMonday === 1) {
                    isFirstMonday = true;
                    firstMonday = moment(firstDay).add(1*addPos, 'd').format('YYYY-MM-DD');
                    break;
                }
                addPos++;
            }
        }
        // get week date
        for (var i = 0; i < 6; i++) {
            if (moment(firstMonday).add(7*i, 'd').month() === moment(firstMonday).month()) {
                this.state.memWeekTime[i] = moment(firstMonday).add(7*i, 'd').format('YYYY-MM-DD');
            }else {
                this.setState({weekCount: i});
                this.memWeekCount = i;
                break;
            }
        }
    },
    getCurrentTimeWeekSeq(){
        var curWeekNum = this.getWeekNum(moment().format('YYYY-MM-DD'));
        for (var i = 0; i < this.state.memWeekTime.length; i++) {
            var weekNum = this.getWeekNum(this.state.memWeekTime[i]);
            if (curWeekNum == weekNum) {
                return (i+1);
            }
        }
        return 0;
    },
    getWeekNum(time){
        let currentWeek = moment(time).week();
        let currentWeekday = moment(time).weekday();
        if (currentWeekday===0) {
            currentWeek = currentWeek - 1;
        }
        return currentWeek;
    },
    getWeekDay(i) {
        switch (parseInt(i)) {
            case 0:
                return "周日";
            case 1:
                return "周一";
            case 2:
                return "周二";
            case 3:
                return "周三";
            case 4:
                return "周四";
            case 5:
                return "周五";
            case 6:
                return "周六";
            default:
                console.log('week param fail');
        }
    },
    onPressItem(week){
        app.navigator.push({
            component: WeekPlan,
            passProps: {
                doWeek: week,
            }
        });
    },
    render() {
        let monthPlan = this.props.allPlanDetail && this.props.allPlanDetail.monthPlan||[];
        let weekPlan = this.props.allPlanDetail && this.props.allPlanDetail.weekPlan||[];
        let dayPlan = this.props.allPlanDetail && this.props.allPlanDetail.dayPlan||[];
        let currentTime = moment().format('YYYY-MM-DD');
        var strTime = '';
        if (this.state.memDayTime.length > 0) {
            var time1 = moment(this.state.memDayTime[0]);
            var time2 = moment(this.state.memDayTime[0]).add(6, 'd');

            if (this.state.memDayTime[0] != undefined) {
                strTime = time1.format('MM.DD')+'-'+time2.format('MM.DD');
            }
        }
        return (
            <View style={this.props.style}>
                <View style={styles.titleContainer}>
                    <View style={styles.leftTitleStyle}>
                        <View style={styles.taskView}></View>
                        <Text style={styles.nameText}>工作任务</Text>
                        <Text style={styles.dateText}>{'第'+this.currentWeekSeq+'周'+ ' '+ '（'+strTime+'）'}</Text>
                    </View>
                    <TouchableOpacity style={styles.rightTitleStyle}
                        onPress={this.onMonthPlan}>
                        <Text style={styles.targetText}>工作目标</Text>
                        <Image resizeMode='contain' source={app.img.specops_go_white} style={styles.goImage}></Image>
                    </TouchableOpacity>
                </View>
                <View style={[styles.divisionLine, {width: sr.w}]}></View>
                <View style={styles.contextContainer}>
                    <View style={styles.goalStyle}>
                        <View style={styles.verticalLine}></View>
                        <Text style={styles.goalText}>月工作目标</Text>
                    </View>
                    <View style={[styles.divisionLine, {width: sr.w-54, alignSelf: 'center'}]}></View>
                    {
                        monthPlan.map((item, i)=>{
                            return (
                                <View key={i} style={styles.contextContainer}>
                                    <View style={styles.goalContextStyle}>
                                        <View style={styles.dotStyle}></View>
                                        <Text style={styles.goalContextText}>{item.content}</Text>
                                    </View>
                                    <View style={[styles.divisionLine, {width: sr.w-54, alignSelf: 'center'}]}></View>
                                </View>
                            )
                        })
                    }
                    <View style={styles.goalStyle}>
                        <View style={styles.verticalLine}></View>
                        <Text style={styles.goalText}>周工作目标</Text>
                    </View>
                    <View style={[styles.divisionLine, {width: sr.w-54, alignSelf: 'center'}]}></View>
                    {
                        weekPlan.map((item, i)=>{
                            return (
                                <View key={i} style={styles.contextContainer}>
                                    <View style={styles.goalContextStyle}>
                                        <View style={styles.dotStyle}></View>
                                        <Text style={styles.goalContextText}>{item.content}</Text>
                                    </View>
                                    {
                                        i!=weekPlan.length-1&&
                                        <View style={[styles.divisionLine, {width: sr.w-54, alignSelf: 'center'}]}></View>
                                    }
                                </View>
                            )
                        })
                    }
                </View>
                <View style={styles.weekPlanDetailStyle}>
                    {
                        dayPlan.map((item, i)=>{
                            return (
                                <TouchableOpacity key={i} onPress={this.onPressItem.bind(null, item.week)}
                                style={[styles.planDetailStyle, currentTime === item.weekIsDate?{borderColor: '#FF6363'}:{borderColor: '#F1F1F1'}]}>
                                    <View style={[styles.leftPlanStyle, currentTime === item.weekIsDate?{backgroundColor: '#FF6363', }:{backgroundColor: '#F1F1F1'}]}>
                                        <Text style={[styles.planWeekText, currentTime === item.weekIsDate?{color: '#FFFFFF', marginTop: 8}:{color: '#404040', marginTop: 8}]}>{this.getWeekDay(item.week)}</Text>
                                        <Text style={[styles.planDateText, currentTime === item.weekIsDate?{color: '#FFFFFF', marginBottom: 8}:{color: '#404040', marginBottom: 8}]}>{moment(item.weekIsDate).format('MM.DD')}</Text>
                                    </View>
                                    <View style={styles.rightPlanStyle}>
                                        <View style={styles.planContentContainer}>
                                            {
                                                item.detailPlan&&item.detailPlan.map((itemInfo, j)=>{
                                                    return (
                                                        <View key={j} style={[styles.planContentStyle, j===0&&{marginTop: 8}]}>
                                                            <Text style={[styles.planContenText, !itemInfo.isOver&&{opacity: 0.6}]}>{j+1+`、${itemInfo.content}`}</Text>
                                                            {
                                                                itemInfo.isOver===1&&<Image resizeMode='contain' source={app.img.specops_check} style={styles.checkImage}></Image>
                                                            }
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                        <Image resizeMode='contain' source={app.img.specops_untask_go} style={styles.goPlanImage}></Image>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <TouchableOpacity
                    onPress={this.toNextWeekPlan}
                    style={styles.touchNextStyle}>
                    <Text style={styles.touchNextText}>填写下周计划</Text>
                </TouchableOpacity>
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        width: sr.w,
        marginTop: 5,
        backgroundColor: '#FFFFFF',
    },
    titleContainer: {
        width: sr.w,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8DC9AC',
        justifyContent: 'space-between',
    },
    leftTitleStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskView: {
        width: 10,
        height: 44,
        backgroundColor: '#60987D',
    },
    rightTitleStyle: {
        marginRight: 17,
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '700',
        marginLeft: 11,
        fontFamily: 'STHeitiSC-Medium',
    },
    dateText: {
        fontSize: 12,
        color: '#FFFFFF',
        marginLeft: 21,
        fontFamily: 'STHeitiSC-Medium',
    },
    targetText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'STHeitiSC-Medium',
    },
    goImage: {
        width: 9,
        height: 14,
        marginLeft: 11,
    },
    divisionLine: {
        height: 1,
        backgroundColor: '#E9E9E9',
    },
    goalStyle: {
        height: 47,
        marginLeft: 32,
        alignItems: 'center',
        flexDirection: 'row',
    },
    verticalLine: {
        width: 4,
        height: 16,
        borderRadius: 1,
        backgroundColor: '#FF6363',
    },
    goalText: {
        fontSize: 14,
        color: '#000000',
        marginLeft: 14,
        fontFamily: 'STHeitiSC-Medium',
    },
    contextContainer: {
        flexDirection: 'column',
    },
    goalContextStyle: {
        flex: 1,
        marginVertical: 12,
        marginHorizontal: 32,
        alignItems: 'center',
        flexDirection: 'row',
    },
    dotStyle: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FF6363',
    },
    goalContextText: {
        width: sr.w-74,
        fontSize: 12,
        color: '#3A3A3A',
        lineHeight: 15,
        marginLeft: 14,
        fontFamily: 'STHeitiSC-Medium',
    },
    weekPlanDetailStyle: {
        flexDirection: 'column',
    },
    planDetailStyle: {
        width: sr.w-34,
        marginBottom: 7,
        borderRadius: 2,
        borderWidth: 1,
        marginHorizontal: 17,
        flexDirection: 'row',
    },
    leftPlanStyle: {
        width: 72,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    planWeekText: {
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
    },
    planDateText: {
        fontSize: 10,
        color: '#808080',
        marginTop: 5,
        fontFamily: 'STHeitiSC-Medium',
    },
    rightPlanStyle: {
        width: sr.w-108,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    planContentContainer: {
        flexDirection: 'column',
    },
    planContentStyle: {
        width: sr.w-136,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    planContenText: {
        width: sr.w-185,
        fontSize: 12,
        color: '#3A3A3A',
        lineHeight: 15,
        marginLeft: 15,
        fontFamily: 'STHeitiSC-Medium',
    },
    checkImage: {
        width: 16,
        height: 16,
        marginRight: 10,
    },
    goPlanImage: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    touchNextStyle: {
        width: sr.w-36,
        height: 31,
        marginTop: 11,
        marginBottom: 18,
        marginLeft: 18,
        borderRadius: 2,
        backgroundColor: '#FF6363',
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchNextText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
    },
});
