'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
    Image,
    StyleSheet,
    Text,
    View,
} = ReactNative;

import Echarts from 'native-echarts';

module.exports = React.createClass({
    cacl(arr, callback) {
        var ret;
        for (var i=0; i<arr.length;i++) {
        ret = callback(arr[i], ret);
        }
        return ret;
    },
    getSum(arr) {
        return this.cacl(arr, function (item, sum) {
            if (typeof (sum) == 'undefined') {
             return item;
            } else {
             return sum += item;
            }
        });
    },
    getAvg (arr) {
        if (arr.length == 0) {
            return 0;
        }
        return (this.getSum(arr) / arr.length);
    },
    render() {
        // const avg = this.getAvg((typeof(this.props.data)=='undefined'?[0]:this.props.data));
        const data = this.props.data;
        const date = this.props.date;
        const option = {
            grid: {
                left: '5%',
                right: '6%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                data: date,
                axisLine:{
                    lineStyle:{
                        color:'#DDDDDD',
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#AEAEAE'
                    }
                },
            },
            yAxis: {
                name: '',
                axisLine:{
                    lineStyle:{
                        color:'#DDDDDD',
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#AEAEAE'
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
                          formatter: '{c}'
                      }
                  },
                  emphasis: {
                      color: '#F6603C',
                  }
              },
                markPoint : {
                    itemStyle: {
                      normal: {
                          color:'#F6603C',
                      }
                  },
                   data : [
                       {name: '当前', xAxis: date[date.length-1],yAxis:data[data.length-1]}
                   ]
               },
            }]
        };
        return (
          <Echarts option={option} height={270} />
        );
      }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6EBEC',
    },
});
