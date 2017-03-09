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
        let sections = this.props.sections;//['优(100~90)','良(89~75)','中(74~60)','差(60~0)'];
        let radios = this.props.radios;//['50%','35%','10%','5%'];
        let numbers = this.props.numbers;//[11,22,4,2];;
        let showUnitText = this.props.showUnitText;//人 or 次
        let colors = ['#C28BC4','#F4715A','#3076C7','#AE3100'];
        const option = {
          legend: {
              show: false,
              orient: 'vertical',
              bottom: '150',
              x : 'right',
              data:sections
          },
          color:colors,
          series: [{
              label: {
                 normal: {
                    show: false,
                    position: 'center'
                 }
              },
              hoverAnimation:false,
              name: '销量',
              type: 'pie',
              radius:[24,52],
              data:numbers
          }]
        };
        return (
              <View style={styles.container}>
                  <Echarts option={option} height={140} width={140}/>
                  <View style={styles.chartViewRight}>
                     {
                         sections && sections.length > 0 &&
                         sections.map((item, i)=>{
                             return(
                                 <View key={i} style={styles.itemView}>
                                     <View style={styles.leftView}>
                                         <View style={[styles.roundView,{backgroundColor: colors[i]}]}/>
                                         <Text style={[styles.littleView,{width:60}]}>{sections[i]}</Text>
                                         <Text style={[styles.littleView,{width:30}]}>{radios[i]}</Text>
                                     </View>
                                     <Text style={styles.personText}>{numbers[i]+showUnitText}
                                     </Text>
                                 </View>
                             )
                         })
                     }
                 </View>
              </View>
        );
      }
});

var styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        backgroundColor: '#FFFFFF',
    },
    chartView: {
        width: 140,
        height: 140,
        marginTop: 10,
        alignItems:'center',
        justifyContent:'center',
    },
    chartViewRight: {
        width: sr.w-140,
        alignItems:'center',
        justifyContent:'center',
    },
    itemView: {
        width: sr.w-140,
        height: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftView: {
        height: 20,
        marginLeft: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    roundView: {
        height: 7,
        width: 7,
        marginRight: 13,
        borderRadius:3.5,
    },
    littleView: {
        fontSize: 10,
        marginRight: 12,
        color: '#8e8e8e',
        fontFamily: 'STHeitiSC-Medium',
    },
    personText: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 12,
        color: '#404040',
        marginRight: 55,
    },
});
