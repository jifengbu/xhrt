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

const ClassTestBossList = require('./ClassTestBossList.js');
const PieChart = require('./pieChart.js');

const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    statics: {
        title: '随堂测试成绩列表页',
    },
    onStartShouldSetResponderCapture (evt) {
        app.touchPosition.x = evt.nativeEvent.pageX;
        app.touchPosition.y = evt.nativeEvent.pageY;
        return false;
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.pageNo = 1;
        this.monthData = [];
        return {
            pickerData: ['', ''],
            defaultSelectValue: '',
            haveData: false,
            quizzesDetailsData: null,
            sections: [],
            radios: [],
            numbers: [],
        };
    },
    componentDidMount () {
        this.clearMonthData();
    },
    onWillHide() {
        Picker.hide();
    },
    clearMonthData () {
        // generate year data
        this.currentYear = this.generateMyCurrentYearMonth().year;
        this.currentMonth = this.generateMyCurrentYearMonth().month;

        this.generateYearData(this.currentYear);
        this.setState({ haveData: true });

        this.currentIndex = this.getMonthIndex(this.currentMonth);
        this.tabIndex = this.getCurrentWeekIndex(this.currentIndex);

        if (this.yearData[this.currentIndex].length <= this.tabIndex) {
            this.tabIndex = this.yearData[this.currentIndex].length - 1;
        }
        this.getDayViewData(this.yearData[this.currentIndex][this.tabIndex]);
    },
    generateYearData (year) {
        this.yearData = [];
        for (let i = 0; i < 12; i++) {
            this.yearData[i] = [];
        }
        // 需要判断进驻的时间，从进驻时间开始
        let startPos = 0;
        // const joinYear = moment(app.personal.info.companyInfo.enterDate).year();
        // const joinMonth = moment(app.personal.info.companyInfo.enterDate).month();
        // if ( joinYear < year) {
        //     startPos = 0;
        // }
        // if ( joinYear == year) {
        //     startPos = joinMonth;
        // }
        // if ( joinYear > year) {
        //     console.log('join year is fail');
        //     return;
        // }
        // generateYearData
        for (let i = startPos; i < 12; i++) {
            this.generateMonthData(year, i);
        }

        _.remove(this.yearData, (item) => item.length === 0);
    },
    generateMonthData (year, month) {
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
        for (let i = 0; i < 6; i++) {
            if (moment(firstMonday).add(7 * i, 'd').month() === moment(firstMonday).month()) {
                this.yearData[month].push(moment(firstMonday).add(7 * i, 'd').format('YYYY-MM-DD'));
            } else {
                this.memWeekCount = i;
                break;
            }
        }
    },
    getMonthIndex (month) {
        let index = 0;
        for (let i = 0; i < this.yearData.length; i++) {
            if (moment(this.yearData[i][0]).month() === month) {
                index = i;
                break;
            }
        }
        return index;
    },
    getCurrentWeekIndex (monthIndex) {
        let index = 0;
        let strWeek = '';
        if (moment().day() === 0) {
            strWeek = moment().subtract(1, 'd').format('YYYY-MM-DD');
        } else {
            strWeek = moment().format('YYYY-MM-DD');
        }
        for (let i = 0; i < this.yearData[monthIndex].length; i++) {
            if (moment(this.yearData[monthIndex][i]).week() === moment(strWeek).week()) {
                index = i;
                break;
            }
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
    isSameWeekWithCurrentTime (time) {
        const currentWeek = this.getWeekNum(moment().format('YYYY-MM-DD'));
        const selectWeek = this.getWeekNum(time);
        if (currentWeek === selectWeek) {
            return true;
        } else {
            return false;
        }
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
    // get time data
    createTimeData (joinTime) {
        const joinYear = moment(joinTime).year();
        const joinMonth = moment(joinTime).month();

        const date = [];
        const currentYear = this.generateMyCurrentYearMonth().year;
        const currentMonth = this.generateMyCurrentYearMonth().month;

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
    getPersonalQuizzesDetailsData (weekDate) {
        this.setState({ quizzesDetailsData: null });// 用于刷新成绩列表
        const param = {
            companyId: app.personal.info.companyInfo.companyId,
            userID: app.personal.info.userID,
            date: weekDate,
        };
        POST(app.route.ROUTE_GET_QUIZZES_DETAIL, param, this.getPersonalQuizzesDetailsDataSuccess, true);
    },
    getPersonalQuizzesDetailsDataSuccess (data) {
        if (data.success) {
            const quizzesDetailsData = data.context;
            const sections = [];
            const radios = [];
            const numbers = [];
            if (quizzesDetailsData) {
                const quizzesSuccess = quizzesDetailsData.quizzesSuccess;
                for (let i in quizzesSuccess) {
                    sections.push(quizzesSuccess[i].title + '(' + quizzesSuccess[i].sectionMax + '~' + quizzesSuccess[i].sectionMin + ')');
                    radios.push(quizzesSuccess[i].proportion + '%');
                    numbers.push(quizzesSuccess[i].number);
                }
            }
            this.setState({ quizzesDetailsData: data.context, sections, radios, numbers });
        } else {
            Toast(data.msg);
        }
    },
    getDayViewData (weekDate) {
        this.getPersonalQuizzesDetailsData(weekDate);
    },
    changeTab (index, time) {
        this.tabIndex = index;
        this.getDayViewData(time);
    },
    onChangePage (weekIndex) {
        if (this.currentIndex == weekIndex) {
            return;
        }
        console.log('----week', weekIndex);
        this.currentIndex = Math.round(weekIndex);
        if (this.yearData[this.currentIndex].length <= this.tabIndex) {
            this.tabIndex = this.yearData[this.currentIndex].length - 1;
        }
        this.currentMonth = moment(this.yearData[this.currentIndex][this.tabIndex]).month();
        this.getDayViewData(this.yearData[this.currentIndex][this.tabIndex]);
    },
    setChooseValue (value) {
        this.currentYear = parseInt(value[0]);
        this.currentMonth = parseInt(value[1]) - 1;
        this.generateYearData(this.currentYear);

        this.currentIndex = this.getMonthIndex(this.currentMonth);
        this.tabIndex = this.getCurrentWeekIndex(this.currentIndex);

        console.log('index tabindex data', this.currentIndex, this.tabIndex, this.yearData);

        this.getDayViewData(this.yearData[this.currentIndex][this.tabIndex]);

        this.setState({ haveData: false });
        setTimeout(() => {
            this.setState({ haveData: true });
        }, 100);
    },
    renderWeekView (dateArray) {
        const menuAdminArray1 = ['第一周', '第二周', '第三周', '第四周'];
        const menuAdminArray2 = ['第一周', '第二周', '第三周', '第四周', '第五周'];
        let menuAdminArray = [];
        if (dateArray.length > 4) {
            menuAdminArray = menuAdminArray2;
        } else {
            menuAdminArray = menuAdminArray1;
        }
        const monthStr = moment(dateArray[0]).format('M月');
        const yearStr = moment(dateArray[0]).format('YYYY年');

        return (
            <View style={styles.tabContainer}>
                {
                        menuAdminArray.map((item, i) => {
                            const time1 = moment(dateArray[i]);
                            const time2 = moment(dateArray[i]).add(6, 'd');
                            let strTime = '';

                            if (dateArray[i] != undefined) {
                                strTime = time1.format('M.D') + '-' + time2.format('M.D');
                            }

                            const isCurrentWeek = this.isSameWeekWithCurrentTime(dateArray[i]);
                            return (
                                <View key={i} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i, dateArray[i])}
                                        style={[styles.tabButton, this.tabIndex === i ? { borderTopWidth: 4, backgroundColor: '#FF8686', borderColor: '#FF6262' } : null]}>
                                        <Text style={[styles.tabText, this.tabIndex === i ? { marginTop: 2, color: '#FFFFFF' } : null]} >
                                            {isCurrentWeek ? '本周' : item}
                                        </Text>
                                        <Text style={[styles.tabTextTime, this.tabIndex === i ? { color: '#FFFFFF' } : null]} >
                                            {strTime}
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
    render () {
        const { quizzesDetailsData, sections, radios, numbers } = this.state;
        return (
            <View style={styles.containerAll}
                onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <View style={styles.separator} />
                <ScrollView>
                    <View style={styles.container}>
                        <TouchableOpacity
                            onPress={this.onPressShowPicker}>
                            <View style={styles.dataMonthView}>
                                <Text style={styles.dataMonthText}>
                                    {(this.currentMonth + 1) + '月'}
                                </Text>
                                <Text style={styles.dataMonthText}>
                                    {this.currentYear + '年'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.vline} />
                        {
                              this.state.haveData &&
                              <View style={styles.bannerContainer}>
                                  <Swiper
                                      height={sr.ws(52)}
                                      width={sr.ws(sr.w - 56)}
                                      showsPagination={false}
                                      loop={false}
                                      onChangePage={this.onChangePage}
                                      index={this.currentIndex}
                                      >
                                      {
                                          this.yearData.map((item, i) => {
                                              return (
                                                  <View key={i}>
                                                      {
                                                          this.renderWeekView(item)
                                                      }
                                                  </View>
                                              );
                                          })
                                      }
                                  </Swiper>
                              </View>
                          }
                    </View>
                    {
                          quizzesDetailsData ?
                              <View>
                                  <View style={[styles.lineDivision, { height: sr.ws(7) }]} />
                                  <View style={styles.homeworkContainer}>
                                      <View style={styles.separator} />
                                      {
                                          <PieChart showUnitText={'人'} sections={sections} radios={radios} numbers={numbers} />
                                  }
                                  </View>
                                  <ClassTestBossList quizzesDetailsData={quizzesDetailsData} />
                              </View>
                          :
                              <View style={styles.listFooterContainer}>
                                  <Text style={styles.listFooter}>{'暂无成绩数据'}</Text>
                              </View>
                      }
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
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems:'center',
    },
    dataMonthView: {
        paddingTop: 5,
        width: 56,
        height: 52,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dataMonthText: {
        fontSize: 12,
        color: '#000000',
        fontFamily:'STHeitiSC-Medium',
    },
    bannerContainer: {
        width: sr.w - 56,
        height: 52,
    },
    tabButton: {
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: '#F4FFFA',
        height: 52,
    },
    vline: {
        width: 1,
        height: 46,
        backgroundColor: '#D2D2D2',
    },
    tabTextTime: {
        fontSize: 12,
        color: '#454545',
        textAlign: 'center',
        fontFamily:'STHeitiSC-Medium',
    },
    tabContainer: {
        width:sr.w - 56,
        height: 52,
        flexDirection: 'row',
        // backgroundColor: '#F4F4F4',
        justifyContent: 'space-between',
    },
    separator: {
        height:1,
        backgroundColor:'#F1F1F1',
    },
    tabText: {
        marginTop: 6,
        fontSize: 14,
        color: '#454545',
        textAlign: 'center',
        fontFamily:'STHeitiSC-Medium',
    },
    lineDivision: {
        width: sr.w,
        backgroundColor: '#F1F1F1',
    },
    homeworkContainer: {
        flexDirection: 'column',
    },
    listFooterContainer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooter: {
        color: 'gray',
        fontSize: 14,
    },
});
