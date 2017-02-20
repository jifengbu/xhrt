'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight
} = ReactNative;

var LineChart = require('./lineChart.js');
var BarChart = require('./barChart.js');
var moment = require('moment');
import Swiper from 'react-native-swiper2';

module.exports = React.createClass({
    getInitialState() {
        this.isRefresh = false;
        return {
            tabIndex: 0,
        };
    },
    changeTab(tabIndex) {
        this.setState({tabIndex});
    },
    onChangePage() {
        if (!this.isRefresh) {
            this.setState({});
            this.isRefresh = true;
        }
    },
    render() {
        let classArray = ['员工学习时长','员工学习课程数'];
        let {studyWhenLong,monthStudyWhenLong,avgCoursesNumber,monthAvgCoursesNumber} = this.props;
        let durationList = [];
        let durationDate = [];
        for (var i in studyWhenLong.whenLongList) {
            durationList.push(studyWhenLong.whenLongList[i].dayAvgWhenLong);
            durationDate.push(moment(studyWhenLong.whenLongList[i].date).format('M.D'));
        }
        let courseList = [];
        let courseDate = [];
        for (var i in avgCoursesNumber.coursesNumber) {
            courseList.push(avgCoursesNumber.coursesNumber[i].dayAvgCoursesNumber);
            courseDate.push(moment(avgCoursesNumber.coursesNumber[i].date).format('M.D'));
        }
        let durationArr = [];
        let durationTime = [];
        for (var i in monthStudyWhenLong) {
            durationArr.push(monthStudyWhenLong[i].count);
            durationTime.push(monthStudyWhenLong[i].month+'月');
        }
        let courseArr = [];
        let courseTime = [];
        for (var i in monthAvgCoursesNumber) {
            courseArr.push(monthAvgCoursesNumber[i].count);
            courseTime.push(monthAvgCoursesNumber[i].month+'月');
        }
        return (
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                  {
                      classArray.map((item, i)=>{
                          return (
                              <TouchableHighlight
                                  key={i}
                                  underlayColor="rgba(0, 0, 0, 0)"
                                  onPress={this.changeTab.bind(null, i)}
                                  style={styles.touchTab}>
                                  <View style={styles.tabButton}>
                                      <Text style={[styles.tabText, {color:this.state.tabIndex===i?'#FA4C50':'#666666'}]} >
                                          {item}
                                      </Text>
                                      <View style={[this.state.tabIndex===i?styles.tabLineSelect:styles.tabLine]}>
                                      </View>
                                  </View>
                              </TouchableHighlight>
                          )
                      })
                  }
              </View>
              <View style={styles.chartStyle}>
                  <Swiper
                      paginationStyle={styles.paginationStyle}
                      dot={<View style={{backgroundColor:'#E0E0E0', width: 8, height: 8,borderRadius: 4, marginLeft: 8, marginRight: 8,}} />}
                      activeDot={<View style={{backgroundColor:'#FA4C50', width: 8, height: 8,borderRadius: 4, marginLeft: 8, marginRight: 8,}} />}
                      height={sr.ws(320)}
                      onChangePage={this.onChangePage}
                      loop={false}>
                      {
                          [1,2].map((item, i)=>{
                              let tableTitle = '';
                              let rose = 0;
                              let avgWhenLong = 0;
                              if (item === 1) {
                                  tableTitle = this.state.tabIndex === 0?'员工今日平均学习时长(h)':'员工今日平均学习课程数(节)';
                                  rose = this.state.tabIndex === 0?studyWhenLong.rose+'h':avgCoursesNumber.rose+'节';
                                  avgWhenLong = this.state.tabIndex === 0?studyWhenLong.avgWhenLong+'h':avgCoursesNumber.avgWhenLong+'节';
                              } else {
                                  tableTitle = this.state.tabIndex === 0?'员工每月平均学习时长(h)':'员工每月平均学习课程数(节)';
                              }
                              return (
                                  <View key={i}>
                                      {
                                          item === 1&&
                                          <View style={styles.chartTopRowView}>
                                              <Text style={styles.chartTopAvgText}>{avgWhenLong}</Text>
                                              <View style={styles.chartTopRoseView}>
                                                  <View style={[styles.chartTopRoseMark,parseInt(rose)<0?{transform: [{rotate: '180deg'}]}:null]}></View>
                                                  <Text style={styles.chartTopRoseText}>{rose}</Text>
                                              </View>
                                          </View>
                                      }
                                      <Text style={[styles.chartTopText,{marginTop: item === 1?0:10}]}>{tableTitle}</Text>
                                      {
                                          item === 1?
                                          <LineChart yData={this.state.tabIndex === 0?durationList:courseList} xData={this.state.tabIndex === 0?durationDate:courseDate} height={230}/>:
                                          <BarChart data={this.state.tabIndex === 0?durationArr:courseArr} date={this.state.tabIndex === 0?durationTime:courseTime}/>
                                      }
                                  </View>
                              )
                          })
                      }
                  </Swiper>
              </View>
            </View>
        );
      }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    tabContainer: {
          width:sr.w,
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
      },
      touchTab: {
          flex: 1,
          paddingTop: 20,
      },
      tabButton: {
          alignItems:'center',
          justifyContent:'center',
      },
      tabText: {
          fontSize: 13,
      },
      tabLine: {
          width: sr.w/2,
          marginTop: 11,
          height: 1,
          backgroundColor: '#F0F1F2',
      },
      tabLineSelect: {
          width: sr.w/2,
          marginTop: 10,
          height: 2,
          backgroundColor: '#FA4C50',
      },
      chartStyle: {
          width: sr.w,
          height: 320,
          backgroundColor:'#FFFFFF',
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
      paginationStyle: {
          width: sr.w,
          bottom: 15,
      },
});
