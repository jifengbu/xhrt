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

const moment = require('moment');
const { Button, InputBox, DImage, Picker } = COMPONENTS;
const CopyBox = require('../home/CopyBox.js');
import Swiper from 'react-native-swiper2';

const NoCommitUserHead = require('./NoCommitUserHead.js');
const WeekPlanItem = require('./WeekPlanItem.js');
const WeekSummaryItem = require('./WeekSummaryItem.js');
const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    onStartShouldSetResponderCapture (evt) {
        app.touchPosition.x = evt.nativeEvent.pageX;
        app.touchPosition.y = evt.nativeEvent.pageY;
        return false;
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.monthData = [];
        this.isDayPlan = true;
        this.isDaySummary = false;
        this.tabIndex = 0;
        return {
            weekCount: 0,
            pickerData: ['', ''],
            defaultSelectValue: '',
            haveTimeData: false,
            infiniteLoadStatus: STATUS_TEXT_HIDE,
            NoCommitUser: [],
            DayPlanAndActual: [],
            DaySummaryAndProblem: [],
        };
    },
    onWillHide() {
        Picker.hide();
    },
    clearMonthData () {
        this.setState({ NoCommitUser: [] });
        this.setState({ DayPlanAndActual: [] });
        this.setState({ DaySummaryAndProblem: [] });
        this.pageNo = 1;
    },
    componentDidMount () {
        this.clearMonthData();

        // is plan and summary
        if (this.props.isDayPlan == true) {
            this.isDayPlan = true;
            this.isDaySummary = false;
        } else if (this.props.isDaySummary == true) {
            this.isDayPlan = false;
            this.isDaySummary = true;
        }

        // generate month data
        this.currentMonth = this.generateMyCurrentYearMonth().month;
        this.currentYear = this.generateMyCurrentYearMonth().year;
        this.generateMonthData(this.currentYear, this.currentMonth);

        this.currentTimeStr = this.generateCurrentTimeStr(moment().format('YYYY-MM-DD'));
        this.currentIndex = this.getCurrentWeekIndex();
        this.tabIndex = this.getCurrentDayIndex();

        this.getDayViewData(this.monthData[this.currentIndex][this.tabIndex]);
        this.getMonthPlanNoFinishList(this.monthData[this.currentIndex][this.tabIndex]);

        setTimeout(() => {
            this.setState({ haveTimeData: true });
        }, 600);
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
    generateCurrentTimeStr (timeStr) {
        let currentTimeStr = moment(timeStr).format('YYYY年MM月D日');
        const weekNum = moment(timeStr).day();
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

        currentTimeStr = currentTimeStr + '   ' + currentWeekStr;
        console.log(currentTimeStr);
        return currentTimeStr;
    },
    generateMonthData (year, month) {
        this.monthData = [];
        for (let i = 0; i < 5; i++) {
            this.monthData[i] = [];
        }
        // find month first monday
        let isFirstMonday = false;
        let addPos = 0;

        let firstDay = '';
        firstDay = moment().set('date', 1).set('month', month).set('year', year).format('YYYY-MM-DD');

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
        // get week first day date
        for (let i = 0; i < 6; i++) {
            if (moment(firstMonday).add(7 * i, 'd').month() === moment(firstMonday).month()) {
                this.monthData[i].push(moment(firstMonday).add(7 * i, 'd').format('YYYY-MM-DD'));
            } else {
                this.setState({ weekCount: i });
                this.memWeekCount = i;
                break;
            }
        }
        // generate 7 day date
        for (let i = 0; i < this.monthData.length; i++) {
            for (let j = 1; j < 7; j++) {
                if (this.monthData[i].length > 0) {
                    this.monthData[i][j] = moment(this.monthData[i][0]).add(j, 'd').format('YYYY-MM-DD');
                }
            }
        }
        _.remove(this.monthData, (item) => item.length === 0);

        console.log(this.monthData);
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
            if (moment(this.monthData[i][0]).week() === moment(strWeek).week()) {
                index = i;
                break;
            }
        }
        return index;
    },
    getCurrentDayIndex () {
        let index = 0;
        if (moment().day() === 0) {
            index = 6;
        } else {
            index = moment().day() - 1;
        }
        return index;
    },
    getWeekNum (time) {
        let currentWeek = moment(time).week();
        const currentWeekday = moment(time).weekday();
        if (currentWeekday === 0) {
            currentWeek = currentWeek - 1;
        }
        return currentWeek;
    },
    getCurrentMonthMonday () {
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
        if (moment().date() < moment(firstMonday).date()) {
            isFirstMonday = false;
            addPos = 0;
            firstDay = moment().subtract(1, 'M').set('date', 1).format('YYYY-MM-DD');
            firstMonday = '';
            while (isFirstMonday === false) {
                const isMonday = moment(firstDay).add(1 * addPos, 'd').day();
                if (isMonday === 1) {
                    isFirstMonday = true;
                    firstMonday = moment(firstDay).add(1 * addPos, 'd').format('YYYY-MM-DD');
                    break;
                }
                addPos++;
            }
        }
        return firstMonday;
    },
    getCurrentMonth () {
        const strFirstMonday = this.getCurrentMonthMonday();
        let monthNum = 0;
        if (moment().date() < moment(strFirstMonday).date()) {
            return moment().month();
        } else {
            return moment().month() + 1;
        }
    },
    getCurrentYear () {
        const strFirstMonday = this.getCurrentMonthMonday();
        let monthNum = 0;
        if (moment().date() < moment(strFirstMonday).date()) {
            if (moment().month() == 0) {
                return moment().year() - 1;
            }
        }
        return moment().year();
    },
    // get time data
    createTimeData (joinTime) {
        const joinYear = moment(joinTime).year();
        const joinMonth = moment(joinTime).month();

        const date = [];
        const currentYear = moment().year();
        const currentMonth = moment().month();

        for (let i = joinYear; i <= currentYear; i++) {
            const month = [];
            for (let j = 1; j < 13; j++) {
                if (i == joinYear) {
                    if (j >= joinMonth) {
                        month.push(j + '月');
                    }
                } else if (i == currentYear) {
                    if (j <= currentMonth) {
                        month.push(j + '月');
                    }
                } else {
                    month.push(j + '月');
                }
            }
            let _date = {};
            _date[i + '年'] = month;
            date.push(_date);
        }

        return date;
    },
    onPressShowPicker (type) {
        let date = moment();
        let defaultSelectValue = [date.year() + '年', (date.month() + 1) + '月'];
        let pickerData = this.createTimeData(app.personal.info.companyInfo.enterDate);
        Picker(pickerData, defaultSelectValue, '').then((value)=>{
            this.setChooseValue(value);
        });
    },
    getMonthPlanNoFinishList (month) {
        const info = app.personal.info;
        const param = {
            companyId: info.companyInfo.companyId,
            date: month,
            userID: info.userID,
            type: this.isDayPlan ? 2 : 3,
        };
        POST(app.route.ROUTE_GET_NO_FINISH_EMPLOYEES, param, this.getMonthPlanNoFinishListSuccess, true);
    },
    getMonthPlanNoFinishListSuccess (data) {
        if (data.success) {
            // no commit user
            // this.state.NoCommitUser = data.context.list.slice(0);
            this.setState({ NoCommitUser: data.context.list });
        }
    },
    getDayViewData (dayDate) {
        if (this.isDayPlan) {
            this.getDayPlanList(dayDate);
        } else if (this.isDaySummary) {
            this.getDaySummaryList(dayDate);
        }
    },
    getDayPlanList (dayDate) {
        const info = app.personal.info;
        const param = {
            companyId: info.companyInfo.companyId,
            date: dayDate,
            userID: info.userID,
            pageNo: this.pageNo,
        };
        POST(app.route.ROUTE_GET_DAY_PLAN_USER_LIST, param, this.getDayPlanListSuccess, this.getDayPlanListFailed);
    },
    getDayPlanListSuccess (data) {
        if (data.success) {
            // add new pageData to DayPlanAndActual
            for (let i = 0; i < data.context.list.length; i++) {
                const item = _.find(this.state.DayPlanAndActual, (o) => o.userId == data.context.list[i].userId);
                if (!item) {
                    this.state.DayPlanAndActual.push(data.context.list[i]);
                }
            }
            const infiniteLoadStatus = data.context.list.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_HAVE_MORE;
            this.setState({
                infiniteLoadStatus: infiniteLoadStatus,
            });
        } else {
            this.getDayPlanListFailed();
        }
    },
    getDayPlanListFailed () {
        this.pageNo--;
        this.setState({ infiniteLoadStatus: STATUS_LOAD_ERROR });
    },
    getDaySummaryList (dayDate) {
        const info = app.personal.info;
        const param = {
            companyId: info.companyInfo.companyId,
            date: dayDate,
            userID: info.userID,
            pageNo: this.pageNo,
        };
        POST(app.route.ROUTE_GET_DAY_SUMMER_USER_LIST, param, this.getDaySummaryListSuccess, this.getDaySummaryListFailed);
    },
    getDaySummaryListSuccess (data) {
        if (data.success) {
            // add new pageData to DaySummaryAndProblem
            for (let i = 0; i < data.context.list.length; i++) {
                const item = _.find(this.state.DaySummaryAndProblem, (o) => o.userId == data.context.list[i].userId);
                if (!item) {
                    this.state.DaySummaryAndProblem.push(data.context.list[i]);
                }
            }
            const infiniteLoadStatus = data.context.list.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_HAVE_MORE;
            this.setState({
                infiniteLoadStatus: infiniteLoadStatus,
            });
        } else {
            this.getDaySummaryListFailed();
        }
    },
    getDaySummaryListFailed () {
        this.pageNo--;
        this.setState({ infiniteLoadStatus: STATUS_LOAD_ERROR });
    },
    onEndReached () {
        console.log('onEndReached', this.state.infiniteLoadStatus);
        if (this.state.infiniteLoadStatus == STATUS_ALL_LOADED || this.state.infiniteLoadStatus == STATUS_TEXT_HIDE) {
            return;
        }
        if (this.state.infiniteLoadStatus == STATUS_HAVE_MORE) {
            this.pageNo++;
            this.getDayViewData(this.monthData[this.currentIndex][this.tabIndex]);
        }
    },
    changeTab (index, time) {
        if (this.tabIndex == index) {
            return;
        }
        this.clearMonthData();

        this.tabIndex = index;
        this.currentTimeStr = this.generateCurrentTimeStr(time);
        this.getDayViewData(time);
        this.getMonthPlanNoFinishList(time);
    },
    onChangePage (weekIndex) {
        if (this.currentIndex == weekIndex) {
            return;
        }
        this.clearMonthData();

        this.currentIndex = Math.round(weekIndex);
        this.currentTimeStr = this.generateCurrentTimeStr(this.monthData[this.currentIndex][this.tabIndex]);
        this.getDayViewData(this.monthData[this.currentIndex][this.tabIndex]);
        this.getMonthPlanNoFinishList(this.monthData[this.currentIndex][this.tabIndex]);
    },
    setChooseValue (value) {
        this.clearMonthData();

        this.currentYear = parseInt(value[0]);
        this.currentMonth = parseInt(value[1]) - 1;
        this.generateMonthData(this.currentYear, this.currentMonth);

        console.log('year, month , date', this.currentYear, this.currentMonth, this.monthData);

        this.currentIndex = this.getCurrentWeekIndex();
        this.tabIndex = this.getCurrentDayIndex();

        this.currentTimeStr = this.generateCurrentTimeStr(this.monthData[this.currentIndex][this.tabIndex]);
        this.getDayViewData(this.monthData[this.currentIndex][this.tabIndex]);
        this.getMonthPlanNoFinishList(this.monthData[this.currentIndex][this.tabIndex]);

        this.setState({ haveTimeData: false });
        setTimeout(() => {
            this.setState({ haveTimeData: true });
        }, 600);
    },
    renderWeekView (dateArray, index) {
        const menuAdminArray = ['一', '二', '三', '四', '五', '六', '日'];
        return (
            <View style={styles.tabContainer}
                key={index}
                        >
                {
                        menuAdminArray.map((item, i) => {
                            return (
                                <View key={i} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={this.changeTab.bind(null, i, dateArray[i])}
                                        style={[styles.tabButton, this.tabIndex === i ? { borderTopWidth: 4, backgroundColor: '#FF8686', borderColor: '#FF6262' } : null]}>
                                        <Text style={[styles.tabText, this.tabIndex === i ? { marginTop: 2, color: '#FFFFFF' } : null]} >
                                            {item}
                                        </Text>
                                        <Text style={[styles.tabTextTime, this.tabIndex === i ? { color: '#FFFFFF' } : null]} >
                                            {moment(dateArray[i]).format('D')}
                                        </Text>
                                    </TouchableOpacity>
                                    {
                                        (i !== menuAdminArray.length - 1 && this.tabIndex - 1 !== i && this.tabIndex !== i) &&
                                        <View style={styles.vline} />
                                    }
                                </View>
                            );
                        })
                    }
            </View>
        );
    },
    renderRowWeekPlanItem (obj, sectionID, rowID) {
        return (
            <WeekPlanItem planData={obj} />
        );
    },
    renderRowWeekSummaryItem (obj, sectionID, rowID) {
        return (
            <WeekSummaryItem planData={obj} />
        );
    },

    renderFooter () {
        return (
            <View style={styles.listFooterContainer}>
                {
                    this.state.infiniteLoadStatus == STATUS_HAVE_MORE &&
                    <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
                }
            </View>
        );
    },
    renderHeader () {
        return (
            <View>
                {
                    this.state.NoCommitUser.length > 0 &&
                    <NoCommitUserHead userData={this.state.NoCommitUser} style={styles.separator} />
                }
            </View>
        );
    },
    render () {
        return (
            <View style={styles.containerAll}
                onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <ScrollView>
                    <View>
                        <View style={styles.container}>
                            <TouchableOpacity
                                onPress={this.onPressShowPicker}>
                                <View style={styles.dataMonthView}>
                                    <Text style={styles.dataMonthText}>
                                        {`${this.currentMonth + 1}`}
                                    </Text>
                                    <Text style={styles.dataMonthText}>
                                      月
                                  </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.vline} />
                            {
                              this.state.haveTimeData &&
                              <View style={styles.bannerContainer}>
                                  <Swiper
                                      height={sr.ws(56)}
                                      width={sr.ws(sr.w - 56)}
                                      showsPagination={false}
                                      loop={false}
                                      onChangePage={this.onChangePage}
                                      index={this.currentIndex}
                                      >
                                      {
                                          this.monthData.length > 0 &&
                                          this.monthData.map((item, i) => {
                                              return (
                                                  this.renderWeekView(item, i)
                                              );
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
                    </View>
                    <ListView
                        initialListSize={1}
                        onEndReachedThreshold={10}
                        enableEmptySections
                        style={styles.listStyle}
                        onEndReached={this.onEndReached}
                        dataSource={this.isDayPlan ? this.ds.cloneWithRows(this.state.DayPlanAndActual) : this.ds.cloneWithRows(this.state.DaySummaryAndProblem)}
                        renderRow={this.isDayPlan ? this.renderRowWeekPlanItem : this.renderRowWeekSummaryItem}
                        renderHeader={this.renderHeader}
                        renderFooter={this.renderFooter}
                      />
                </ScrollView>
            </View>

        );
    },
});

const styles = StyleSheet.create({
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
        // width: (sr.w-56-6)/7,
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
        width:sr.w - 56,
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
        height: 100,
        alignItems: 'center',
    },
    listFooter: {
        marginVertical: 10,
        color: 'gray',
        fontSize: 14,
    },
});
