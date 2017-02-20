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

import Echarts from 'native-echarts';

module.exports = React.createClass({
    render() {
        const option = {
            grid: {
                x: 40,
                y: 50,
                x2: 40,
                y2: 40,
            },
            color:["#ff8f8f"],
            xAxis: {
              boundaryGap : false,
              data: this.props.xData
            },
            yAxis: {type : 'value'},
            series: [{
                name: '销量',
                type: 'line',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: this.props.yData,
                markPoint : {
                data : [
                   {type : 'max', name: '最大值'},
                   {type : 'min', name: '最小值'}
               ]},
               markLine : {
                   symbol:[],
                   itemStyle: {
                        normal: {
                            label:{show: false},
                        },
                    },
                   data : [
                      {xAxis:1},
                      {xAxis:2},
                      {xAxis:3},
                      {xAxis:4},
                      {xAxis:5},
              ]},
            }]
        };
        return (
            <View style={styles.container}>
                <Echarts option={option} height={this.props.height} />
            </View>
        );
      }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        // marginBottom:50,
    },
});
