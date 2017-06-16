'use strict';

const React = require('react');
const ReactNative = require('react-native');
const LoginPanel = require('./LoginPanel.js');
const RegisterPanel = require('./RegisterPanel.js');

const {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
} = ReactNative;

module.exports = React.createClass({
    statics: {
        color: CONSTANTS.THEME_COLORS[1],
        title: '登录赢销截拳道',
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
    },
    getInitialState () {
        return {
            phone: '',
            tabIndex: 0,
        };
    },
    onWillFocus () {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[0]);
    },
    componentWillMount () {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[0]);
    },
    componentDidMount () {
        app.personal.setNeedLogin(true);
        app.toggleNavigationBar(true);
        app.studyNumMgr.clear();
    },
    changeToLoginPanel (phone) {
        this.setState({ tabIndex: 0, phone });
    },
    render () {
        return (
            <ScrollView style={styles.container}>
                <Image resizeMode='stretch'
                    source={app.img.login_background}
                    style={styles.imageContainer}>
                    <View style={styles.logoContainer}>
                        <Image resizeMode='stretch'
                            source={app.img.login_loginLogo}
                            style={styles.imageLogin} />
                    </View>
                    <View style={styles.pageContainer}>
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                onPress={this.changeTab.bind(null, 0)}
                                style={styles.tabButton}>
                                {
                                    this.state.tabIndex === 0 &&
                                    <Image resizeMode='stretch'
                                        source={app.img.login_login}
                                        style={styles.tabImg} />
                                }
                                {this.state.tabIndex === 1 && <Text style={styles.tabText} >登录</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.changeTab.bind(null, 1)}
                                style={styles.tabButton}>
                                {
                                    this.state.tabIndex === 1 &&
                                    <Image resizeMode='stretch'
                                        source={app.img.login_registered}
                                        style={styles.tabImg} />
                                }
                                {this.state.tabIndex === 0 && <Text style={styles.tabText} >手机注册</Text>}
                            </TouchableOpacity>
                        </View>
                        {this.state.tabIndex === 0 ? <LoginPanel phone={this.state.phone} /> : <RegisterPanel changeToLoginPanel={this.changeToLoginPanel} />}
                    </View>
                </Image>
                <View style={{height: 1}}/>
            </ScrollView>
        );
    },
});

const TOPHEIGHT = sr.h / 3;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageContainer: {
        flex: 2,
    },
    imageContainer: {
        width: sr.w,
        height: sr.ch,
    },
    imageLogin: {
        width: TOPHEIGHT * 0.6 * 239 / 121,
        height: TOPHEIGHT * 0.6,
    },
    tabContainer: {
        height: 46,
        flexDirection: 'row',
    },
    tabButton: {
        width: sr.w / 2,
        height: 46,
        alignItems:'center',
        justifyContent:'center',
    },
    tabText: {
        color: '#2f4f4f',
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    tabImg: {
        width: (sr.w / 2 + 20),
        height: 46,
    },
});
