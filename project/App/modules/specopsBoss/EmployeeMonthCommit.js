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
var LineStackChart = require('./lineStackChart.js');
var EmployeePlanDetail = require('./EmployeePlanDetail.js');

module.exports = React.createClass({
    getInitialState() {
        this.MonthDataStr = [];
        this.MonthDataNum = [];
        this.createTimeData(app.personal.info.companyInfo.enterDate);
        return {
            tabIndex: 0,
            taskSubmitRateData: null,
            haveData: true,
        };
    },
    componentDidMount() {
        setTimeout(()=>{
            let currentMonthIndex = this.getCurrentMonthIndex();

            let movePos = 0;
            if (currentMonthIndex > 6) {
                movePos = currentMonthIndex - 6;
                // scrollTo current month
                InteractionManager.runAfterInteractions(() => {
                    setTimeout(()=>{
                        this.scrollView.scrollTo({x: sr.ws(56*movePos)});
                    }, 200);
                });
            }
            this.changeTab(currentMonthIndex);
        }, 200);
    },
    // get time data
    createTimeData(joinTime) {
        let joinYear = moment(joinTime).year();
        let joinMonth = moment(joinTime).month();

        let dateDateNum = {};
        let currentYear = moment().year();
        let currentMonth = moment().month();

        for (var i = joinYear; i <= currentYear; i++) {
            let month = [];
            let monthNUm = [];
            for (var j = 0; j < 12; j++) {
                if (i == joinYear && i != currentYear) {
                    if (j >= joinMonth) {
                        monthNUm.push(j);
                    }
                }else if (i == currentYear) {
                    if (j <= currentMonth) {
                        monthNUm.push(j);
                    }
                }else {
                    monthNUm.push(j);
                }
            }
            dateDateNum[i] = monthNUm;
        }

        this.MonthDataNum = [];
        let tempTime = moment();
        tempTime.set('date', 15);
        for(var i in dateDateNum){
            for (var j = 0; j < dateDateNum[i].length; j++) {
                tempTime.set('year', i);
                tempTime.set('month', dateDateNum[i][j]);
                this.MonthDataNum.push(tempTime.format('YYYY-MM-DD'));
            }
        }
        while (this.MonthDataNum.length < 7 && this.MonthDataNum.length > 0) {
            let addStr = moment(this.MonthDataNum[this.MonthDataNum.length-1]).add(1, 'months').format('YYYY-MM-DD');
            this.MonthDataNum.push(addStr);
        }

        this.MonthDataStr = [];
        for (var j = 0; j < this.MonthDataNum.length; j++) {
            this.MonthDataStr.push(moment(this.MonthDataNum[j]).month()+1+'月');
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
    generateMyCurrentYearMonth(){
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

        let ret = {};
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
    getCurrentMonthIndex(){
        let tTime = moment();
        tTime.set('date', 15);
        tTime.set('year', this.generateMyCurrentYearMonth().year);
        tTime.set('month', this.generateMyCurrentYearMonth().month);
        let tTimeStr = tTime.format('YYYY-MM-DD');

        for (var i = 0; i < this.MonthDataNum.length; i++) {
            if (this.MonthDataNum[i] === tTimeStr) {
                return i;
            }
        }
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
    getUserTaskSubmitRate(date) {
        let info = app.personal.info;
        var param = {
            userID: info.userID,
            companyId: info.companyInfo.companyId,
            date:date
        };
        POST(app.route.ROUTE_GET_USER_TASK_SUBMIT_RATE, param, this.getUserTaskSubmitRateSuccess, true);
    },
    getUserTaskSubmitRateSuccess(data) {
        if (data.success) {
            this.setState({taskSubmitRateData: data.context});
            this.setState({haveData: false});
            setTimeout(()=>{
                this.setState({haveData: true});
            },400);
        }
    },
    changeTab(index){
        if (this.state.tabIndex == index) {
            return;
        }
        let currentMonthIndex = this.getCurrentMonthIndex();
        if (index > currentMonthIndex) {
            return;
        }

        this.setState({tabIndex:index});
        this.getUserTaskSubmitRate(this.MonthDataNum[index]);
        let month = index+1;
        this.currentTimeStr = moment(this.MonthDataNum[index]).format('YYYY年M月');
    },
    render() {
        let {taskSubmitRateData} = this.state;
        return (
            <ScrollView>
            <View style={styles.containerAll}
                  onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                  <ScrollView
                      ref={(scrollView) => {this.scrollView = scrollView;}}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}>
                      {
                          this.MonthDataStr.length > 0 &&
                          this.MonthDataStr.map((item, i)=>{
                              let currentMonthIndex = this.getCurrentMonthIndex();
                              let itemStyle;
                              if (i === this.state.tabIndex) {
                                  itemStyle = [styles.tabText, {marginTop: 16, color: '#FFFFFF'}];
                              } else if (i > currentMonthIndex) {
                                  itemStyle = [styles.tabText,{color: '#C8C8C8'}];
                              } else {
                                  itemStyle = styles.tabText;
                              }
                              return (
                                  <View key={i} style={styles.itemView}>
                                      <TouchableOpacity
                                          key={i}
                                          onPress={this.changeTab.bind(null, i)}
                                          style={[styles.tabButton, this.state.tabIndex===i?{borderTopWidth: 4, backgroundColor: '#FF8686', borderColor: '#FF6262'}:null]}>
                                          <Text style={itemStyle} >
                                              {item}
                                          </Text>
                                      </TouchableOpacity>
                                      {
                                          (i!==this.MonthDataStr.length-1 && this.state.tabIndex-1 !== i && this.state.tabIndex !== i) &&
                                          <View style={styles.vline}/>
                                      }
                                  </View>
                              )
                          })
                      }
                  </ScrollView>
                  <View style={styles.currentTimeView}>
                      <Text style={styles.currentTimeText} >
                          {this.currentTimeStr}
                      </Text>
                  </View>
                  <View style={styles.separator}/>
                  {
                      taskSubmitRateData&&this.state.haveData&&
                      <LineStackChart taskSubmitRateData={taskSubmitRateData}/>
                  }
                  <View style={styles.separator}/>
                  {
                      taskSubmitRateData&&this.state.haveData&&
                      <EmployeePlanDetail data={taskSubmitRateData}/>
                  }

            </View>
            </ScrollView>
        );
    },
});

var styles = StyleSheet.create({
    containerAll: {
        backgroundColor: 'transparent',
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
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
    },
    separator: {
        height:10,
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
    tabButton: {
        alignItems:'center',
        backgroundColor: '#F4FFFA',
        height: 56,
        width: sr.w/7,
    },
    vline: {
        width: 1,
        height: 40,
        backgroundColor: '#D2D2D2',
    },
    tabText: {
        marginTop: 20,
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
