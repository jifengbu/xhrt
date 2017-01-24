'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
} = ReactNative;

var AgentReturns = require('./AgentReturns.js');
var InviteCodeManage = require('./InviteCodeManage.js');
var LearningManage = require('./LearningManage.js');
var SplashScreen = require('@remobile/react-native-splashscreen');
var {Button} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '代理商管理',
    },
    componentDidMount() {
        SplashScreen.hide();
    },
    toggleMenuPanel() {
        //删除数据，刷新列表
    },
    getInitialState() {
        return {
            tabIndex: 0
        };
    },
    changeTab(tabIndex) {
        this.setState({tabIndex});
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 0)}
                        style={[styles.tabButton, this.state.tabIndex===0?{backgroundColor:'#4FC1E9'}:null]}>
                        <Text style={[styles.tabText, this.state.tabIndex===0?{color:'#FFFFFF'}:null]} >代理收益</Text>
                        {this.state.tabIndex===0&&<View style={[styles.makeup, {right:0}]}></View>}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 1)}
                        style={[styles.tabButton, this.state.tabIndex===1?{backgroundColor:'#4FC1E9'}:null]}>
                        <Text style={[styles.tabText, this.state.tabIndex===1?{color:'#FFFFFF'}:null]} >学习管理</Text>
                        {this.state.tabIndex===1&&<View style={[styles.makeup, {left:0}]}></View>}
                        {this.state.tabIndex===1&&<View style={[styles.makeup, {right:0}]}></View>}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 2)}
                        style={[styles.tabButton, this.state.tabIndex===2?{backgroundColor:'#4FC1E9'}:null]}>
                        <Text style={[styles.tabText, this.state.tabIndex===2?{color:'#FFFFFF'}:null]} >邀请码管理</Text>
                        {this.state.tabIndex===2&&<View style={[styles.makeup, {left:0}]}></View>}
                    </TouchableOpacity>
                </View>
                <AgentReturns
                    tabIndex={0}
                    style={this.state.tabIndex===0?{flex:1}:{left:-sr.tw, top:0, position:'absolute'}}/>
                <LearningManage
                    tabIndex={1}
                    style={this.state.tabIndex===1?{flex:1}:{left:-sr.tw, top:0, position:'absolute'}}/>
                <InviteCodeManage
                    tabIndex={2}
                    style={this.state.tabIndex===2?{flex:1}:{left:-sr.tw, top:0, position:'absolute'}}/>
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        height: 50,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#4FC1E9',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    tabButton: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 10,
    },
    tabText: {
        fontSize: 18,
    },
    makeup: {
        backgroundColor:'#4FC1E9',
        top: 0,
        width: 8,
        height: 50,
        position: 'absolute'
    },
});
