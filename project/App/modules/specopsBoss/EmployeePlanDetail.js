'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight,
} = ReactNative;

var {DImage} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let {data} = this.props;
        let target = data.dayPlanList.shouldSubmitNum || '';
        let dataSource = this.ds.cloneWithRows(data.dayPlanList.userList)||[];
        return {
            tabIndex: 0,
            target:target,
            dataSource:dataSource,
            data:data,
        };
    },
    changeTab(tabIndex) {
        let {data} = this.state;
        let target = '';
        let dataSource = this.ds.cloneWithRows([]);
        if (tabIndex === 0) {
          target = data.dayPlanList.shouldSubmitNum;
          dataSource = this.ds.cloneWithRows(data.dayPlanList.userList);
        } else if (tabIndex === 1) {
          target = data.monthPlanList.shouldSubmitNum;
          dataSource = this.ds.cloneWithRows(data.monthPlanList.userList);
        } else {
          target = data.daySummaryList.shouldSubmitNum;
          dataSource = this.ds.cloneWithRows(data.daySummaryList.userList);
        }
        this.setState({tabIndex,dataSource,target});
    },
    renderRow(obj, sectionID, rowID) {
          return (
              <TouchableHighlight
                  onPress={null}
                  underlayColor="#EEB422">
                  <View style={styles.listViewItemContain}>
                    {
                      rowID != 0&&
                      <View style={styles.rowLine}/>
                    }
                    <View style={styles.headView}>
                        <DImage
                            resizeMode='stretch'
                            defaultSource={app.img.personal_head}
                            source={{uri: obj.userImg}}
                            style={styles.headImage} />
                        <View style={styles.nameStyale}>
                            <Text style={styles.nameText} >{obj.userName}</Text>
                            <Text style={styles.detailText} >{obj.post}</Text>
                        </View>
                    </View>
                    <Text style={styles.nameText} >{'提交率: '+obj.submitRate+'%'}</Text>
                    <Text style={styles.nameText} >{'未提交 '+obj.notSubmitNum+'次'}</Text>
                  </View>
              </TouchableHighlight>
          )
    },
    render() {
        var {tabIndex,target,dataSource} = this.state;
        let theme = tabIndex === 0?'本月应提交计划  ':tabIndex === 1?'本月应提交目标  ':'本月应提交总结  ';
        var menuAdminArray = ['计划', '目标', '总结'];
        return (
            <View style={styles.container}>
                <View style={styles.line}/>
                <View style={styles.tabContainer}>
                    {
                        menuAdminArray.map((item, i)=>{
                            return (
                                <TouchableHighlight
                                    key={i}
                                    underlayColor="rgba(0, 0, 0, 0)"
                                    onPress={this.changeTab.bind(null, i)}
                                    style={styles.touchTab}>
                                    <View style={styles.tabButton}>
                                        <Text style={[styles.tabText, this.state.tabIndex===i?{color:'#FF5E5F'}:{color:'#A2A2A2'}]} >
                                            {item}
                                        </Text>
                                        <View style={[styles.tabLine, this.state.tabIndex===i?{backgroundColor: '#FF5E5F'}:null]}>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        })
                    }
                </View>
                <View style={styles.line}/>
                <View style={styles.themeStyle}>
                    <Text style={styles.themeText} >{theme}<Text style={styles.numText}>{target+'份'}</Text></Text>
                </View>
                <ListView
                      initialListSize={1}
                      onEndReachedThreshold={10}
                      enableEmptySections={true}
                      style={styles.listStyle}
                      onEndReached={this.onEndReached}
                      dataSource={dataSource}
                      renderRow={this.renderRow}
                      />
            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        backgroundColor: '#F1F1F1',
    },
    line: {
      height: 1,
      width: sr.w,
      backgroundColor: '#EDEDED'
    },
    tabContainer: {
        width:sr.w,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    touchTab: {
        flex: 1,
        paddingTop: 20,
    },
    tabButton: {
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonCenter: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonRight: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 9,
    },
    tabText: {
        fontSize: 14,
    },
    tabLine: {
        width: 79,
        height: 2,
        marginTop: 10,
        alignSelf: 'center',
    },
    themeStyle: {
        width: sr.w,
        height: 46,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    themeText: {
      fontSize: 14,
      fontFamily: 'STHeitiSC-Medium',
      color: '#464646',
    },
    numText: {
      fontSize: 14,
      fontFamily: 'STHeitiSC-Medium',
      color: '#FF3333',
    },
    listViewItemContain: {
      width: sr.w,
      height: 61,
      flexDirection: 'row',
      paddingHorizontal: 24,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    rowLine: {
      position: 'absolute',
      left: 24,
      top: 0,
      width: sr.w-48,
      height: 1,
      backgroundColor: '#EDEDED',
    },
    headView: {
      flexDirection: 'row',
    },
    headImage: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    nameStyale: {
      marginLeft: 5,
    },
    nameText: {
      fontSize: 14,
      color: '#333333',
      fontFamily: 'STHeitiSC-Medium',
    },
    detailText: {
      fontSize: 10,
      color: '#818181',
      fontFamily: 'STHeitiSC-Medium',
    },
});
