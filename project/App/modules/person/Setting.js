'use strict';
var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Navigator,
    TouchableOpacity,
    Text,
    Image,
} = ReactNative;

var Feedback = require('./Feedback.js');
var UpdateFrame = require('./UpdateFrame.js');
var EditPersonInfo = require('./EditPersonInfo.js');
var NewPeopleGuide = require('./newPeopleGuide.js');
var About = require('./About.js');
var MyCollects = require('./MyCollects.js');
var MyIntegral = require('./MyIntegral.js');
// var AgentManager = require('./AgentManager.js');

var {Button, WebviewMessageBox} = COMPONENTS;

var MenuItem = React.createClass({
    showChildPage() {
        if (this.props.page.webAddress) {
            app.showModal(
                <WebviewMessageBox
                    webAddress={this.props.page.webAddress}/>,
                {title: this.props.page.title}
            );
            return;
        }
        app.navigator.push({
            component: this.props.page.module,
            title: this.props.page.title,
            sceneConfig: {
                ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null
            }
        });
    },
    render() {
        var {title, img, info} = this.props.page;
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.showChildPage}
                style={styles.meunItemStyle}>
                <View style={styles.titleStyle}>
                    <Text style={styles.itemNameText}>{title}</Text>
                </View>
                <View style={styles.infoStyle}>
                    <Text style={styles.itemNoticeText}>{info}</Text>
                    <Image
                        resizeMode='stretch'
                        source={app.img.personal_arrow}
                        style={styles.icon_go}  />
                </View>
            </TouchableOpacity>
        )
    }
});

module.exports = React.createClass({
    statics: {
        title: '设置',
        leftButton: {image: app.img.common_back2, handler: ()=>{app.navigator.pop()}},
    },
    getChildPages() {
        if (!app.personal.info) {
            return;
        }
        let {isAgent, isSpecialSoldier} = app.personal.info;
        var tempTitle = (isAgent == 1) ? '我是代理商': '我的二维码';
        return [
            {seprator:false, title:'个人信息设置', module: EditPersonInfo},
            {seprator:false, title:'等级任务积分', module: MyIntegral},
            // {seprator:false, title: '我的二维码', module: AgentManager, hidden:isAgent==0&&isSpecialSoldier==0},
            {seprator:false, title:'我的收藏', module: MyCollects},
            {seprator:false, title:'意见反馈', module: Feedback},
            // {seprator:false, title:'在线更新', module: UpdateFrame, info: app.hasNewVersion ? ('有最新'+app.hasNewVersion+'版本') : ''},
            {seprator:false, title:'新手指引', module: NewPeopleGuide},
            {seprator:false, title:'关于', module: About},
        ].map((item, i)=>!item.hidden&&<MenuItem page={item} key={i}/>)
    },
    doLoggedOut() {
        app.navigator.resetTo({
            title: '登录赢销截拳道',
            component: require('../login/Login.js'),
        }, 0);
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.menuView}>
                    {
                        this.getChildPages()
                    }
                </View>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.doLoggedOut}
                    style={styles.loginStyle}>
                    <Text style={styles.itemNameText}>{'退出登录'}</Text>
                </TouchableOpacity>
            </View>
        );
    },
});


var styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#F0EFF5',
    },
    menuView: {
        marginTop: 3,
    },
    loginStyle: {
        width: sr.w,
        height: 46,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    meunItemStyle: {
        width: sr.w,
        height: sr.rws(46),
        marginTop: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
    },
    titleStyle: {
        marginLeft: 33,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoStyle: {
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemNameText: {
        fontSize: 16,
        color: '#373737',
        fontFamily: 'STHeitiSC-Medium',
    },
    itemNoticeText: {
        width: 93,
        fontSize: 12,
        color: '#888888',
        fontFamily: 'STHeitiSC-Medium',
    },
    icon_go: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: 6,
        height: 10,
    },
});
