'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
} = ReactNative;

var moment = require('moment');
import Echarts from 'native-echarts';

module.exports = React.createClass({
    getInitialState() {
        let {taskSubmitRateData} = this.props;
        let monthPlanData = taskSubmitRateData.monthPlanRateList||[];
        let dayPlanData = taskSubmitRateData.dayPlanRateList||[];
        let daySummaryData = taskSubmitRateData.daySummaryRateList||[];
        let rateDate = [];
        let monthRateData = [];
        let dayRateData = [];
        let SummaryRateData = [];
        for (var i in monthPlanData) {
            monthRateData.push(monthPlanData[i].submitRate);
            rateDate.push(moment(monthPlanData[i].monthNum).format('M')+'月');
        }
        for (var i in dayPlanData) {
            dayRateData.push(dayPlanData[i].submitRate);
        }
        for (var i in daySummaryData) {
            SummaryRateData.push(daySummaryData[i].submitRate);
        }
        return {
            rateDate: rateDate,
            monthPlanRate: taskSubmitRateData.monthPlanRate||'',
            dayPlanRate: taskSubmitRateData.dayPlanRate||'',
            daySummaryRate: taskSubmitRateData.daySummaryRate||'',
            monthRateData: monthRateData,
            dayRateData: dayRateData,
            SummaryRateData: SummaryRateData,
        };
    },
    render() {
        var {monthPlanRate, dayPlanRate, daySummaryRate, rateDate, monthRateData, dayRateData, SummaryRateData} = this.state;
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
            xAxis: {
                boundaryGap : false,
                type: 'category',
                name: 'x',
                data: rateDate
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            color:["#72D667", "#9BA0FF", "#F1582F"],
            yAxis: {
                type: 'value',
                name: '（平均提交率）',
                axisLabel: {
                          show: true,
                          interval: 'auto',
                          formatter: '{value} %'
                  		}
            },
            series: [
                        {
                            name: '目标提交率',
                            type: 'line',
                            data: monthRateData
                        },
                        {
                            name: '计划提交率',
                            type: 'line',
                            data: dayRateData
                        },
                        {
                            name: '总结提交率',
                            type: 'line',
                            data: SummaryRateData
                        }
                    ]
        };
        return (
            <View style={styles.container}>
                <View style={styles.chartTopView}>
                    <Text style={styles.chartTitle}>员工提交目标、计划、总结情况</Text>
                    <View style={styles.titleDetailView}>
                        <View style={styles.itemView}>
                            <View style={styles.lineContainer}>
                                <View style={[styles.dotView, {backgroundColor: '#72D667'}]}></View>
                                <View style={[styles.lineView, {backgroundColor: '#72D667'}]}></View>
                                <View style={[styles.dotView, {backgroundColor: '#72D667'}]}></View>
                            </View>
                            <Text style={styles.targetTitle}>{monthPlanRate}</Text>
                            <Text style={styles.detailTitle}>目标提交率</Text>
                        </View>
                        <View style={styles.itemView}>
                            <View style={styles.lineContainer}>
                                <View style={[styles.dotView, {backgroundColor: '#9BA0FF'}]}></View>
                                <View style={[styles.lineView, {backgroundColor: '#9BA0FF'}]}></View>
                                <View style={[styles.dotView, {backgroundColor: '#9BA0FF'}]}></View>
                            </View>
                            <Text style={styles.targetTitle}>{dayPlanRate}</Text>
                            <Text style={styles.detailTitle}>计划提交率</Text>
                        </View>
                        <View style={styles.itemView}>
                            <View style={styles.lineContainer}>
                                <View style={[styles.dotView, {backgroundColor: '#F1582F'}]}></View>
                                <View style={[styles.lineView, {backgroundColor: '#F1582F'}]}></View>
                                <View style={[styles.dotView, {backgroundColor: '#F1582F'}]}></View>
                            </View>
                            <Text style={styles.targetTitle}>{daySummaryRate}</Text>
                            <Text style={styles.detailTitle}>总结提交率</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.chartView}>
                    <Echarts option={option} height={200} />
                </View>
            </View>
        );
      }
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    chartTopView: {
        marginTop: 18,
        width: sr.w-40,
        marginHorizontal: 20,
    },
    chartTitle: {
        fontSize: 12,
        color: '#999999',
        fontFamily: 'STHeitiSC-Medium',
    },
    titleDetailView: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    itemView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotView: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    lineView: {
        width: 20,
        height: 1,
    },
    targetTitle: {
        color: '#444444',
        fontSize: 24,
        fontFamily: 'STHeitiSC-Medium',
    },
    detailTitle: {
        color: '#444444',
        fontSize: 12,
        fontFamily: 'STHeitiSC-Medium',
    },
    chartView: {
        height: 200,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#FFFFFF',
    },
});
