'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
    Image,
    StyleSheet,
    Text,
    View,
} = ReactNative;

import Echarts from 'native-echarts';

module.exports = React.createClass({
    render () {
        const data = this.props.data;
        const date = this.props.date;
        const option = {
            grid: {
                left: '5%',
                right: '6%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                data: date,
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
                name: '',
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
                type: 'bar',
                data: data,
                itemStyle: {
                    normal: {
                        color:'#F8BDAD',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}',
                        },
                    },
                    emphasis: {
                        color: '#F6603C',
                    },
                },
                markPoint : {
                    itemStyle: {
                        normal: {
                            color:'#F6603C',
                        },
                    },
                    data : [
                       { name: '当前', xAxis: date[date.length - 1], yAxis:data[data.length - 1] },
                    ],
                },
            }],
        };
        return (
            <Echarts option={option} height={270} />
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6EBEC',
    },
});
