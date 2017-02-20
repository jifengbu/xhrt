import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    ListView,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    InteractionManager,
} from 'react-native';

var moment = require('moment');
var {Button, InputBox, DImage} = COMPONENTS;
var CopyBox = require('../home/CopyBox.js');
import Swiper from 'react-native-swiper2';
import Picker from 'react-native-picker';

var NoCommitUserHead = require('./NoCommitUserHead.js');
var WeekPlanItem = require('./WeekPlanItem.js');
var WeekSummaryItem = require('./WeekSummaryItem.js');
const {STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR} = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    onStartShouldSetResponderCapture(evt){
        console.log('----onStartShouldSetResponderCapture',evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        app.touchPosition.x = evt.nativeEvent.pageX;
        app.touchPosition.y = evt.nativeEvent.pageY;
        return false;
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.pageNo = 1;
        this.monthData = [];
        this.NoCommitUser = [];
        this.DayPlanAndActual = [0,1];
        this.DaySummaryAndProblem = [0,1];
        return {
            weekCount: 0,
            pickerData: ['', ''],
            defaultSelectValue: '',
            haveData: false,
            isDayPlan: true,
            isDaySummary: false,
        };
    },
    clearMonthData() {
        this.NoCommitUser = [];
        this.DayPlanAndActual = [0,1];
        this.DaySummaryAndProblem = [0,1];

        this.currentTimeStr = this.generateCurrentTimeStr(moment().format('YYYY-MM-DD'));
        this.currentIndex = this.getCurrentWeekIndex();
        this.tabIndex = this.getCurrentDayIndex();

        // is plan and summary
        if (this.props.isDayPlan) {
            this.setState({isDayPlan:this.props.isDayPlan});
            this.setState({isDaySummary:false});
        }else if (this.props.isDaySummary){
            this.setState({isDaySummary:this.props.isDaySummary});
            this.setState({isDayPlan:false});
        }

        // generate month data
        this.currentMonth = moment().month();
        this.currentYear = moment().year();
        this.generateMonthData(this.currentYear, this.currentMonth);

        this.onChangePage(this.currentIndex);

        setTimeout(()=>{
            this.setState({haveData: true});
        }, 200);
    },
    generateCurrentTimeStr(timeStr){
        let currentTimeStr = moment(timeStr).format('YYYY年MM月D日')
        let weekNum = moment(timeStr).day();
        let currentWeekStr = '';

        switch (weekNum) {
            case 0:
                currentWeekStr = '周日';
                break;
            case 1:
                currentWeekStr = '周一';
                break;
            case 2:
                currentWeekStr = '周二';
                break;
            case 3:
                currentWeekStr = '周三';
                break;
            case 4:
                currentWeekStr = '周四';
                break;
            case 5:
                currentWeekStr = '周五';
                break;
            case 6:
                currentWeekStr = '周六';
                break;
        }

        currentTimeStr = currentTimeStr+'   '+currentWeekStr;
        console.log(currentTimeStr);
        return currentTimeStr;
    },
    generateMonthData(year, month){
        this.monthData = [];
        for (var i = 0; i < 5; i++) {
            this.monthData[i] = [];
        }
        // find month first monday
        var isFirstMonday = false;
        var addPos = 0;

        var firstDay = '';
        firstDay = moment().set('date', 1).set('month', month).set('year', year).format('YYYY-MM-DD');

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
        // get week first day date
        this.currentMonth = month;
        for (var i = 0; i < 6; i++) {
            if (moment(firstMonday).add(7*i, 'd').month() === moment(firstMonday).month()) {
                this.monthData[i].push(moment(firstMonday).add(7*i, 'd').format('YYYY-MM-DD'));
            }else {
                this.setState({weekCount: i});
                this.memWeekCount = i;
                break;
            }
        }
        // generate 7 day date
        for (var i = 0; i < this.monthData.length; i++) {
            for (var j = 1; j < 7; j++) {
                if (this.monthData[i].length > 0) {
                    this.monthData[i][j] = moment(this.monthData[i][0]).add(j, 'd').format('YYYY-MM-DD');
                }
            }
        }
        _.remove(this.monthData, (item)=>item.length===0);

        console.log(this.monthData);
    },
    getCurrentWeekIndex() {
        var index = 0;
        var strWeek = '';
        if (moment().day() === 0) {
            strWeek = moment().subtract(1, 'd').format('YYYY-MM-DD');
        }else {
            strWeek = moment().format('YYYY-MM-DD');
        }
        for (var i = 0; i < this.memWeekCount; i++) {
            if (moment(this.monthData[i][0]).week() === moment(strWeek).week()) {
                index = i;
                break;
            }
        }
        return index;
    },
    getCurrentDayIndex() {
        var index = 0;
        if (moment().day() === 0) {
            index = 6;
        }else {
            index = moment().day()-1;
        }
        return index;
    },
    getWeekNum(time){
        let currentWeek = moment(time).week();
        let currentWeekday = moment(time).weekday();
        if (currentWeekday===0) {
            currentWeek = currentWeek - 1;
        }
        return currentWeek;
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
    getCurrentYear(){
        var strFirstMonday = this.getCurrentMonthMonday();
        var monthNum = 0;
        if (moment().date() < moment(strFirstMonday).date()) {
            if (moment().month() == 0) {
                return moment().year()-1;
            }
        }
        return moment().year();
    },
    // get time data
    createTimeData(joinTime) {
        let joinYear = moment(joinTime).year();
        let joinMonth = moment(joinTime).month()+1;

        let date = {};
        let currentYear = moment().year();
        let currentMonth = moment().month()+1;

        for (var i = joinYear; i <= currentYear; i++) {
            let month = [];
            for (var j = 1; j < 13; j++) {
                if (i == joinYear) {
                    if (j >= joinMonth) {
                        month.push(j+'月');
                    }
                }else if (i == currentYear) {
                    if (j <= currentMonth) {
                        month.push(j+'月');
                    }
                }else {
                    month.push(j+'月');
                }
            }
            date[i+'年'] = month;
        }

        // add two month
        let tempMonth1 = currentMonth+1;
        let tempMonth2 = currentMonth+2;
        let tempYear = currentYear;
        let isAdd = true;
        if (tempMonth1 == 13) {
            tempMonth1 = 1;
            if (isAdd){
                isAdd = false;
                tempYear++;
            }
        }
        // add first month
        if (tempYear == currentYear) {
            date[currentYear+'年'].push(tempMonth1+'月');
        }else {
            let tempMonthArray = [];
            tempMonthArray.push(tempMonth1+'月');
            date[tempYear+'年'] = tempMonthArray;
        }

        if (tempMonth2 == 13) {
            tempMonth2 = 1;
            if (isAdd){
                isAdd = false;
                tempYear++;
            }
        }
        if (tempMonth2 == 14) {
            tempMonth2 = 2;
            if (isAdd){
                isAdd = false;
                tempYear++;
            }
        }
        // add second month
        if (tempYear == currentYear) {
            date[currentYear+'年'].push(tempMonth2+'月');
        }else {
            if (tempMonth2 == 1) {
                let tempMonthArray = [];
                tempMonthArray.push(tempMonth2+'月');
                date[tempYear+'年'] = tempMonthArray;
            }
            if (tempMonth2 == 2) {
                date[tempYear+'年'].push(tempMonth2+'月');
            }
        }

        return date;
    },
    onPressShowPicker(type) {
        if (!this.picker.isPickerShow()) {
            let date = moment();
            let currentData = [date.year()+'年', (date.month()+1)+'月'];
            this.setState({defaultSelectValue: currentData, pickerData: this.createTimeData('2015-06-11')});
            this.picker.show();
        } else {
            this.picker.hide();
        }
    },
    getDayViewData(dayDate){
        if (this.state.isDayPlan) {
            this.getDayPlanList(dayDate);
        } else if (this.state.isDaySummary) {
            this.getDaySummaryList(dayDate);
        }
    },
    getDayPlanList(dayDate) {
        var param = {
            companyId: app.personal.info.userID,
            date: dayDate,
            pageNo: this.pageNo,
        };
        this.setState({infiniteLoadStatus: this.pageNo===1?STATUS_START_LOAD:STATUS_HAVE_MORE});
        POST(app.route.ROUTE_GET_DAY_PLAN_USER_LIST, param, this.getDayPlanListSuccess, this.getDayPlanListFailed);
    },
    getDayPlanListSuccess(data) {
        if (data.success) {
            // add new pageData to DayPlanAndActual
            for (var i = 0; i < data.context.planContext.length; i++) {
                this.DayPlanAndActual.push(data.context.planContext[i]);
            }
            var infiniteLoadStatus = data.context.planContext.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_HAVE_MORE;
            this.setState({
                infiniteLoadStatus: infiniteLoadStatus,
            });
            // no commit user
            this.NoCommitUser = data.context.noUserList.slice(0);
        } else {
            this.getDayPlanListFailed();
        }
    },
    getDayPlanListFailed() {
        this.pageNo--;
        this.setState({infiniteLoadStatus: STATUS_LOAD_ERROR});
    },
    getDaySummaryList(dayDate) {
        var param = {
            companyId: app.personal.info.userID,
            date: dayDate,
            pageNo: this.pageNo,
        };
        this.setState({infiniteLoadStatus: this.pageNo===1?STATUS_START_LOAD:STATUS_HAVE_MORE});
        POST(app.route.ROUTE_GET_DAY_SUMMER_USER_LIST, param, this.getDaySummaryListSuccess, this.getDaySummaryListFailed);
    },
    getDaySummaryListSuccess(data) {
        if (data.success) {
            // add new pageData to DaySummaryAndProblem
            for (var i = 0; i < data.context.planContext.length; i++) {
                this.DaySummaryAndProblem.push(data.context.summaryContext[i]);
            }
            var infiniteLoadStatus = data.context.planContext.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_HAVE_MORE;
            this.setState({
                infiniteLoadStatus: infiniteLoadStatus,
            });
            // no commit user
            this.NoCommitUser = data.context.noUserList.slice(0);
        } else {
            this.getDaySummaryListFailed();
        }
    },
    getDaySummaryListFailed() {
        this.pageNo--;
        this.setState({infiniteLoadStatus: STATUS_LOAD_ERROR});
    },
    onEndReached() {
        console.log('------onEndReached');
        if (this.state.infiniteLoadStatus === STATUS_ALL_LOADED || this.state.infiniteLoadStatus === STATUS_TEXT_HIDE) {
            return;
        }
        this.pageNo++;
        this.getDayViewData(this.monthData[this.currentIndex][this.tabIndex]);
    },
    componentDidMount() {
        this.clearMonthData();
    },
    changeTab(index, time){
        this.tabIndex = index;
        this.currentTimeStr = this.generateCurrentTimeStr(time);
        this.getDayViewData(time);
    },
    onChangePage(weekIndex){
        console.log('----week', weekIndex);
        this.currentIndex = weekIndex;
        this.currentTimeStr = this.generateCurrentTimeStr(this.monthData[weekIndex][this.tabIndex]);
        this.getDayViewData(this.monthData[weekIndex][this.tabIndex]);
    },
    setChooseValue(value){
        this.currentYear = parseInt(value[0]);
        this.currentMonth = parseInt(value[1])-1;
        this.generateMonthData(this.currentYear, this.currentMonth);
        this.currentTimeStr = this.generateCurrentTimeStr(this.monthData[this.currentIndex][this.tabIndex]);
        this.getDayViewData(this.monthData[this.currentIndex][this.tabIndex]);
    },
    renderWeekView(dateArray, index) {
        var menuAdminArray = ['一', '二', '三', '四', '五', '六', '日'];
        return (
                <View style={styles.tabContainer}
                        key={index}
                        >
                    {
                        menuAdminArray.map((item, i)=>{
                            return (
                                <View key={i} style={{flexDirection: 'row',flex: 1,alignItems: 'center'}}>
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i, dateArray[i])}
                                        style={[styles.tabButton, this.tabIndex===i?{borderTopWidth: 4, backgroundColor: '#FF8686', borderColor: '#FF6262'}:null]}>
                                        <Text style={[styles.tabText, this.tabIndex===i?{marginTop: 2, color: '#FFFFFF'}:null]} >
                                            {item}
                                        </Text>
                                        <Text style={[styles.tabTextTime, this.tabIndex===i?{color: '#FFFFFF'}:null]} >
                                            {moment(dateArray[i]).format('D')}
                                        </Text>
                                    </TouchableOpacity>
                                    {
                                        (i!==menuAdminArray.length-1 && this.tabIndex-1 !== i && this.tabIndex !== i) &&
                                        <View style={styles.vline}/>
                                    }
                                </View>
                            )
                        })
                    }
                </View>
            )
    },
    renderRow(obj, sectionID, rowID) {
        return (
                this.state.isDayPlan?
                <WeekPlanItem planDate={obj}/>
                :
                <WeekSummaryItem planDate={obj}/>
        )
    },
    renderFooter() {
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        )
    },
    renderHeader() {
        return (
            <View>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={this.onPressShowPicker}>
                        <View style={styles.dataMonthView}>
                            <Text style={styles.dataMonthText}>
                                {this.currentMonth+1}
                            </Text>
                            <Text style={styles.dataMonthText}>
                                月
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.vline}/>
                    {
                        this.state.haveData &&
                        <View style={styles.bannerContainer}>
                            <Swiper
                                height={sr.ws(56)}
                                showsPagination={false}
                                loop={false}
                                ref = {val=>this.viewSwiper = val }
                                onChangePage={this.onChangePage}
                                >
                                {
                                    this.monthData.map((item, i)=>{
                                        return (
                                            this.renderWeekView(item, i)
                                        )
                                    })
                                }
                            </Swiper>
                        </View>
                    }
                </View>
                <View style={styles.currentTimeView}>
                    <Text style={styles.currentTimeText} >
                        {this.currentTimeStr}
                    </Text>
                </View>
                <NoCommitUserHead userData={this.NoCommitUser} style={styles.separator}/>
            </View>
        )
    },
    render() {
        return (
            <View style={styles.containerAll}
                  onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections={true}
                    style={styles.listStyle}
                    onEndReached={this.onEndReached}
                    dataSource={this.state.isDayPlan?this.ds.cloneWithRows(this.DayPlanAndActual):this.ds.cloneWithRows(this.DaySummaryAndProblem)}
                    renderRow={this.renderRow}
                    renderHeader={this.renderHeader}
                    renderFooter={this.renderFooter}
                    />
                <Picker
                    style={{height: sr.th/3}}
                    ref={picker => this.picker = picker}
                    showDuration={300}
                    showMask={false}
                    hideCancelBtn={true}
                    pickerBtnText={'完成'}
                    selectedValue={this.state.defaultSelectValue}
                    pickerData={this.state.pickerData}
                    onPickerDone={(value) => this.setChooseValue(value)}
                    />
            </View>

        );
    },
});

var styles = StyleSheet.create({
    containerAll: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems:'center',
    },
    currentTimeView: {
        width: sr.w,
        height: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentTimeText: {
        marginTop: 4,
        fontSize: 16,
        color: '#454545',
        fontFamily:'STHeitiSC-Medium',
    },
    dataMonthView: {
        width: 56,
        height: 56,
        backgroundColor: '#F4FFFA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dataMonthText: {
        fontSize: 16,
        color: '#FF5E5F',
        fontFamily:'STHeitiSC-Medium',
    },
    bannerContainer: {
        width: sr.w - 56,
        height: 56,
    },
    paginationStyle: {
        width: 100,
        bottom: 30,
        justifyContent: 'flex-end',
    },
    itemHeadView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabButton: {
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: '#F4FFFA',
        height: 56,
    },
    vline: {
        width: 1,
        height: 46,
        backgroundColor: '#D2D2D2',
    },
    tabTextTime: {
        fontSize: 16,
        color: '#454545',
        textAlign: 'center',
        fontFamily:'STHeitiSC-Medium',
    },
    tabContainer: {
        width:sr.w-56,
        height: 56,
        flexDirection: 'row',
        // backgroundColor: '#F4F4F4',
        justifyContent: 'space-between',
    },

    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
    },
    separator: {
        height:1,
        backgroundColor:'#F1F1F1',
    },
    blankView: {
        height:60,
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
    },
    tabText: {
        marginTop: 6,
        fontSize: 16,
        color: '#454545',
        textAlign: 'center',
        fontFamily:'STHeitiSC-Medium',
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
