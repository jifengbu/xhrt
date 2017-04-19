'use strict';
const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Navigator,
    TouchableOpacity,
    Text,
    Image,
} = ReactNative;

const Feedback = require('./Feedback.js');
const EditPersonInfo = require('./EditPersonInfo.js');
const NewPeopleGuide = require('./newPeopleGuide.js');
const About = require('./About.js');
const MyCollects = require('./MyCollects.js');
const MyIntegral = require('./MyIntegral.js');
const Update = require('@remobile/react-native-update');
const UpdatePage = require('../update/UpdatePage');
const BindingBox = require('../login/BindingBox.js');
// const AgentManager = require('./AgentManager.js');

const { Button, WebviewMessageBox } = COMPONENTS;

const MenuItem = React.createClass({
    showChildPage () {
        if (this.props.page.webAddress) {
            app.showModal(
                <WebviewMessageBox
                    webAddress={this.props.page.webAddress} />,
                { title: this.props.page.title }
            );
            return;
        }
        if (this.props.page.method) {
            this.props.page.method();
            return;
        }
        app.navigator.push({
            component: this.props.page.module,
            title: this.props.page.title,
            sceneConfig: {
                ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null,
            },
        });
    },
    render () {
        const { title, img, info } = this.props.page;
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
                        style={styles.icon_go} />
                </View>
            </TouchableOpacity>
        );
    },
});

module.exports = React.createClass({
    statics: {
        title: '设置',
        leftButton: { image: app.img.common_back2, handler: () => { app.navigator.pop(); } },
    },
    doRefresh () {
        this.props.doRefresh();
        app.navigator.pop();
    },
    getInitialState () {
        return {
            options: null,
        };
    },
    componentWillMount () {
        Update.checkVersion({
            versionUrl: app.route.ROUTE_VERSION_INFO_URL,
            iosAppId: CONSTANTS.IOS_APPID,
        }).then((options) => {
            this.setState({ options });
        });
    },
    getChildPages () {
        if (!app.personal.info) {
            return;
        }
        const { options } = this.state;
        const { isAgent, isSpecialSoldier } = app.personal.info;
        const tempTitle = (isAgent == 1) ? '我是代理商' : '我的二维码';
        return [
            { seprator:false, title:'个人信息设置', module: EditPersonInfo },
            { seprator:false, title:'等级任务积分', module: MyIntegral },
            // {seprator:false, title: '我的二维码', module: AgentManager, hidden:isAgent==0&&isSpecialSoldier==0},
            { seprator:false, title:'我的收藏', module: MyCollects },
            { seprator:false, title:'意见反馈', module: Feedback },
            { hidden: !app.isandroid, seprator:false, title:'在线更新', method: () => {
                app.navigator.push({
                    title: '在线更新',
                    component: UpdatePage,
                    passProps: { options },
                });
            }, info: options === null ? '正在获取版本号' : options === undefined ? '获取版本号失败' : options.newVersion ? ('有最新' + options.newVersion + '版本') : '' },
            { seprator:false, title:'新手指引', module: NewPeopleGuide },
            { seprator:false, title:'绑定手机', method: () => {
                app.showModal(
                    <BindingBox doRefresh={this.doRefresh} />
                );
            }, hidden:app.isBind !== false },
            { seprator:false, title:'关于', module: About },
        ].map((item, i) => !item.hidden && <MenuItem page={item} key={i} />);
    },
    doLoggedOut () {
        app.navigator.resetTo({
            title: '登录赢销截拳道',
            component: require('../login/Login.js'),
        }, 0);
    },
    render () {
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

const styles = StyleSheet.create({
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
