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

var ClassTestBossList = require('./ClassTestBossList.js');
var PieChart = require('./pieChart.js');

const {STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR} = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    statics: {
        title: '随堂测试成绩列表页',
    },
    onStartShouldSetResponderCapture(evt){
        app.touchPosition.x = evt.nativeEvent.pageX;
        app.touchPosition.y = evt.nativeEvent.pageY;
        return false;
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
    clearMonthData() {
        // generate year data
        this.currentMonth = moment().month();
        this.currentYear = moment().year();
        this.generateYearData(this.currentYear);
        this.setState({haveData: true});

        this.currentIndex = this.getMonthIndex(this.currentMonth);
        this.tabIndex = this.getCurrentWeekIndex(this.currentIndex);

        this.onChangePage(this.currentIndex);
    },
    generateYearData(year){
        this.yearData = [];
        for (var i = 0; i < 12; i++) {
            this.yearData[i] = [];
        }
        // 需要判断进驻的时间，从进驻时间开始，到最近的最后两个月。
        // generateYearData
        for (var i = 0; i < 12; i++) {
            this.generateMonthData(year, i);
        }

        _.remove(this.yearData, (item)=>item.length===0);
        console.log('-----',this.yearData);
    },
    generateMonthData(year, month){
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
        for (var i = 0; i < 6; i++) {
            if (moment(firstMonday).add(7*i, 'd').month() === moment(firstMonday).month()) {
                this.yearData[month].push(moment(firstMonday).add(7*i, 'd').format('YYYY-MM-DD'));
            }else {
                this.memWeekCount = i;
                break;
            }
        }
    },
    getMonthIndex(month) {
        var index = 0;
        for (var i = 0; i < this.yearData.length; i++) {
            if (moment(this.yearData[i][0]).month() === month) {
                index = i;
                break;
            }
        }
        return index;
    },
    getCurrentWeekIndex(monthIndex) {
        var index = 0;
        var strWeek = '';
        if (moment().day() === 0) {
            strWeek = moment().subtract(1, 'd').format('YYYY-MM-DD');
        }else {
            strWeek = moment().format('YYYY-MM-DD');
        }
        for (var i = 0; i < this.yearData[monthIndex].length; i++) {
            if (moment(this.yearData[monthIndex][i]).week() === moment(strWeek).week()) {
                index = i;
                break;
            }
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
    isSameWeekWithCurrentTime(time) {
        let currentWeek = this.getWeekNum(moment().format('YYYY-MM-DD'));
        let selectWeek = this.getWeekNum(time);
        if (currentWeek === selectWeek) {
            return true;
        }else {
            return false;
        }
    },
    // get time data
    createBirthdayData(joinTime) {
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
            this.setState({defaultSelectValue: currentData, pickerData: this.createBirthdayData('2015-06-11')});
            this.picker.show();
        } else {
            this.picker.hide();
        }
    },
    getPersonalQuizzesDetailsData(weekDate) {
        var param = {
            companyId: app.personal.info.companyId,
            date: weekDate,
        };
        POST(app.route.ROUTE_GET_QUIZZES_DETAIL, param, this.getPersonalQuizzesDetailsDataSuccess, true);
    },
    getPersonalQuizzesDetailsDataSuccess(data) {
        if (data.success) {
            let quizzesDetailsData = data.context;
            let sections = [];
            let radios = [];
            let numbers = [];
            if (quizzesDetailsData) {
                var quizzesSuccess = quizzesDetailsData.quizzesSuccess;
                for (var i in quizzesSuccess) {
                    sections.push(quizzesSuccess[i].title+'('+quizzesSuccess[i].sectionMax+'~'+quizzesSuccess[i].sectionMin+')');
                    radios.push(quizzesSuccess[i].proportion+'%');
                    numbers.push(quizzesSuccess[i].number);
                }
            }
            this.setState({quizzesDetailsData: data.context, sections, radios, numbers});
        } else {
            Toast(data.msg);
        }
    },
    getDayViewData(weekDate){
        this.getPersonalQuizzesDetailsData(weekDate);
    },
    componentDidMount() {
        this.clearMonthData();
    },
    changeTab(index, time){
        this.tabIndex = index;
        this.getDayViewData(time);
    },
    onChangePage(weekIndex){
        console.log('----week', weekIndex);
        this.currentIndex = weekIndex;
        this.currentMonth = moment(this.yearData[weekIndex][this.tabIndex]).month();
        this.getDayViewData(this.yearData[weekIndex][this.tabIndex]);
    },
    setChooseValue(value){
        this.currentYear = parseInt(value[0]);
        this.currentMonth = parseInt(value[1])-1;
        this.generateYearData(this.currentYear);
        this.getDayViewData(this.yearData[this.currentIndex][this.tabIndex]);

        this.currentIndex = this.getMonthIndex(this.currentMonth);
        this.tabIndex = this.getCurrentWeekIndex(this.currentIndex);

        this.setState({haveData: false});
        setTimeout(()=>{
            this.setState({haveData: true});
        }, 100);
    },
    renderWeekView(dateArray) {
        var menuAdminArray1 = ['第一周', '第二周', '第三周', '第四周'];
        var menuAdminArray2 = ['第一周', '第二周', '第三周', '第四周', '第五周'];
        var menuAdminArray = [];
        if (dateArray.length > 4) {
            menuAdminArray = menuAdminArray2;
        }else{
            menuAdminArray = menuAdminArray1;
        }
        var monthStr = moment(dateArray[0]).format('M月');
        var yearStr = moment(dateArray[0]).format('YYYY年');

        return (
                <View style={styles.tabContainer}>
                    {
                        menuAdminArray.map((item, i)=>{
                            var time1 = moment(dateArray[i]);
                            var time2 = moment(dateArray[i]).add(6, 'd');
                            var strTime = '';

                            if (dateArray[i] != undefined) {
                                strTime = time1.format('M.D')+'-'+time2.format('M.D');
                            }

                            var isCurrentWeek = this.isSameWeekWithCurrentTime(dateArray[i]);
                            return (
                                <View key={i} style={{flexDirection: 'row',flex: 1,alignItems: 'center'}}>
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i, dateArray[i])}
                                        style={[styles.tabButton, this.tabIndex===i?{borderTopWidth: 4, backgroundColor: '#FF8686', borderColor: '#FF6262'}:null]}>
                                        <Text style={[styles.tabText, this.tabIndex===i?{marginTop: 2, color: '#FFFFFF'}:null]} >
                                            {isCurrentWeek?'本周':item}
                                        </Text>
                                        <Text style={[styles.tabTextTime, this.tabIndex===i?{color: '#FFFFFF'}:null]} >
                                            {strTime}
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
    render() {
        let {quizzesDetailsData, sections, radios, numbers} = this.state;
        return (
            <View style={styles.containerAll}
                  onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                  <ScrollView>
                      <View style={styles.container}>
                          <TouchableOpacity
                              onPress={this.onPressShowPicker}>
                              <View style={styles.dataMonthView}>
                                  <Text style={styles.dataMonthText}>
                                      {(this.currentMonth+1)+'月'}
                                  </Text>
                                  <Text style={styles.dataMonthText}>
                                      {this.currentYear+'年'}
                                  </Text>
                              </View>
                          </TouchableOpacity>
                          <View style={styles.vline}/>
                          {
                              this.state.haveData &&
                              <View style={styles.bannerContainer}>
                                  <Swiper
                                      height={sr.ws(52)}
                                      showsPagination={false}
                                      loop={false}
                                      ref = {val=>this.viewSwiper = val }
                                      onChangePage={this.onChangePage}
                                      index={this.currentIndex}
                                      >
                                      {
                                          this.yearData.map((item, i)=>{
                                              return (
                                                  <View key={i}>
                                                      {
                                                          this.renderWeekView(item)
                                                      }
                                                  </View>
                                              )
                                          })
                                      }
                                  </Swiper>
                              </View>
                          }
                      </View>
                      {
                          quizzesDetailsData&&
                          <View>
                              <View style={[styles.lineDivision, {height: sr.ws(7)}]}/>
                              <View style={styles.homeworkContainer}>
                                  <View style={styles.separator}/>
                                  {
                                      <PieChart sections={sections} radios={radios} numbers={numbers}/>
                                  }
                              </View>
                              {
                                  <ClassTestBossList quizzesDetailsData={quizzesDetailsData}/>
                              }
                          </View>
                      }
                </ScrollView>
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
        width:sr.w-56,
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
});
