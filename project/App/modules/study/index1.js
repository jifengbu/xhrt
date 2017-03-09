'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
} = ReactNative;

var VideoList = require('./VideoList1.js');
var TaskMessageBox = require('./TaskMessageBox.js');
var PersonInfo = require('../person/PersonInfo.js');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '学习场',
        leftButton: { image: app.img.personal_entrance, handler: ()=>{
            app.navigator.push({
                component: PersonInfo,
                fromLeft: true,
            });
        }},
        rightButton: { image: app.img.study_label_button, handler: ()=>{app.scene.toggleMenuPanel();app.closeSpecopsPlayer&&app.closeSpecopsPlayer();}},
    },
    getInitialState() {
        return {
            tabIndex: 0,
        };
    },
    onWillFocus() {
        if (this.state.tabIndex === 0) {
            this.aidList0.checkFirstPageList();
        } else if (this.state.tabIndex === 0) {
            this.aidList1.checkFirstPageList();
        } else {
          this.aidList2.checkFirstPageList();
        }
    },
    changeTab(tabIndex) {
      this.setState({tabIndex});
          if (tabIndex===0) {
              this.aidList0.checkFirstPageList();
          } else if (tabIndex===1) {
              this.aidList1.checkFirstPageList();
          } else {
            this.aidList2.checkFirstPageList();
          }
    },
    toggleMenuPanel() {
        if (!this.state.overlayShowTask) {
            var param = {
                userID: app.personal.info.userID,
            };
            POST(app.route.ROUTE_GET_TASK_INTEGRATION, param, this.doGetTaskIntegrationSuccess, true);
        }
    },
    doGetTaskIntegrationSuccess(data) {
        if (data.success) {
            let taskList = data.context.taskList||[];
            this.setState({taskList: taskList, overlayShowTask:true});
        } else {
            Toast(data.msg);
        }
    },
    doCloseTask() {
        this.setState({overlayShowTask:false});
    },
    render() {
        var {tabIndex} = this.state;
        var menuAdminArray = ['精品课程', '精彩案例'];
        if (CONSTANTS.ISSUE_IOS) {
            _.remove(menuAdminArray, (o, i)=>i===2);
        }
        return (
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    {
                        !app.GlobalVarMgr.getItem('isFullScreen') &&
                        menuAdminArray.map((item, i)=>{
                            return (
                                <TouchableHighlight
                                    key={i}
                                    underlayColor="rgba(0, 0, 0, 0)"
                                    onPress={this.changeTab.bind(null, i)}
                                    style={styles.touchTab}>
                                    <View style={styles.tabButton}>
                                        <Text style={[styles.tabText, this.state.tabIndex===i?{color:'#A62045'}:{color:'#666666'}]} >
                                            {item}
                                        </Text>
                                        <View style={[styles.tabLine, this.state.tabIndex===i?{backgroundColor: '#A62045'}:null]}>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        })
                    }
                </View>
                <View style={{flex:1}}>
                    <VideoList
                        ref={(ref)=>this.aidList0 = ref}
                        disable={tabIndex!==0}
                        type={1}
                        style={tabIndex===0?{flex:1}:{left:-sr.tw, top:0, position:'absolute'}}/>
                    <VideoList
                        ref={(ref)=>this.aidList1 = ref}
                        disable={tabIndex!==1}
                        type={2}
                        style={tabIndex===1?{flex:1}:{left:-sr.tw, top:0, position:'absolute'}}/>
                    <VideoList
                        ref={(ref)=>this.aidList2 = ref}
                        disable={tabIndex!==2}
                        type={3}
                        style={tabIndex===2?{flex:1}:{left:-sr.tw, top:0, position:'absolute'}}/>
                </View>
                {
                    typeof(this.state.taskList) != 'undefined'&&this.state.overlayShowTask &&
                    <TaskMessageBox
                        style={styles.overlayContainer}
                        taskList={this.state.taskList}
                        doCloseTask={this.doCloseTask}
                        doDraw={this.doDraw}
                        doShare={this.doShare}>
                    </TaskMessageBox>
                }
            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingBottom: 49,
    },
    tabContainer: {
        width:sr.w,
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
        fontSize: 13,
    },
    tabLine: {
        width: sr.w/4,
        height: 2,
        marginTop: 10,
        alignSelf: 'center',
    },
    makeup: {
        backgroundColor:'#4FC1E9',
        top: 0,
        width: 10,
        height: 50,
        position: 'absolute'
    },
});
