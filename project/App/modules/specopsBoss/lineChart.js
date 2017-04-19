'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
} = ReactNative;

import Echarts from 'native-echarts';

module.exports = React.createClass({
    render () {
        const xData = this.props.xData;
        const yData = this.props.yData;
        const option = {
            grid: {
                left: '5%',
                right: '6%',
                bottom: '3%',
                containLabel: true,
            },
            color:['#ff8f8f'],
            xAxis: {
                boundaryGap : false,
                data: xData,
                axisLine:{
                    lineStyle:{
                        color:'#DDDDDD',
                    },
                },
                axisLabel: {
                    textStyle: {
                        color: '#AEAEAE',
                    },
                },
            },
            yAxis: {
                type : 'value',
                axisLine:{
                    lineStyle:{
                        color:'#DDDDDD',
                    },
                },
                axisLabel: {
                    textStyle: {
                        color: '#AEAEAE',
                    },
                },
            },
            series: [{
                name: '销量',
                type: 'line',
                itemStyle: { normal: { areaStyle: { type: 'default' } } },
                data: yData,
                markPoint : {
                    data : [
                    { name: '当前', xAxis: xData[xData.length - 1], yAxis:yData[yData.length - 1] },
                    ] },
                markLine : {
                    symbol:[],
                    itemStyle: {
                        normal: {
                            label:{ show: false },
                        },
                    },
                    data : [
                      { xAxis:1 },
                      { xAxis:2 },
                      { xAxis:3 },
                      { xAxis:4 },
                      { xAxis:5 },
                    ] },
            }],
        };
        return (
            <View style={styles.container}>
                <Echarts option={option} height={this.props.height} />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        // marginBottom:50,
    },
});
