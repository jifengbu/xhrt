'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
} = ReactNative;

import Swiper from 'react-native-swiper2';
var TimerMixin = require('react-timer-mixin');
var SplashScreen = require('@remobile/react-native-splashscreen');
var Login = require('../login/Login.js');
var Home = require('../home/index.js');
var StudyNum = require('../../data/StudyNum.js');
var Update = require('@remobile/react-native-update');

var {ProgressBar} = COMPONENTS;

var
STATUS_NONE = 0,
STATUS_DOWNLOAD_JS_PROGESS = 1,
STATUS_UNZIP_JS_PROGESS = 2,
STATUS_UPDATE_END = 3;

var ProgressInfo = React.createClass({
    render() {
        const { progress } = this.props;
        if (progress < 1000) {
            return (
                <View>
                    <Text>{this.props.title} [{progress}%]</Text>
                    <ProgressBar
                        fillStyle={{}}
                        backgroundStyle={{backgroundColor: '#cccccc', borderRadius: 2}}
                        style={{marginTop: 10, width:PROGRESS_WIDTH}}
                        progress={progress/100.0}
                        />
                    <View style={styles.progressText}>
                        <Text>0</Text>
                        <Text>100</Text>
                    </View>
                </View>
            );
        } else {
            let size = progress/1000/1024/1024;
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text>{this.props.title} [ {size.toFixed(2)} M ]</Text>
                </View>
            );
        }
    }
});

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState() {
        return {
            status: STATUS_NONE,
            progress: 0,
            renderSplashType: 0,
        };
    },
    updateJSCode() {
        console.log("updateJSCode");
        var update = new Update({
            versionUrl: app.route.ROUTE_VERSION_INFO_URL,
            jsbundleUrl:app.isandroid?app.route.ROUTE_JS_ANDROID_URL:app.route.ROUTE_JS_IOS_URL,
            androidApkUrl:app.route.ROUTE_APK_URL,
            androidApkDownloadDestPath:'/sdcard/yxjqd.apk',
            iosAppId: CONSTANTS.IOS_APPID,
            needUpdateApp: this.needUpdateApp,
            needUpdateJS: this.needUpdateJS,
            onDownloadJSStart:()=>{this.setState({status: STATUS_DOWNLOAD_JS_PROGESS,progress:0})},
            onDownloadJSProgress:(progress)=>{this.setState({status: STATUS_DOWNLOAD_JS_PROGESS,progress:progress})},
            onUnzipJSStart:()=>{this.setState({status: STATUS_DOWNLOAD_JS_PROGESS,progress:0})},
            onUnzipJSProgress:(progress)=>{this.setState({status: STATUS_UNZIP_JS_PROGESS,progress:progress})},
            onUnzipJSEnd:()=>{this.setState({status: STATUS_UPDATE_END})},
            onNewestVerion: this.onNewestVerion,
            onError:(errCode)=>{this.onError(errCode)},
        })
        update.start();
    },
    onError() {
        this.getInfoError();
    },
    needUpdateApp(oldVersion, newVersion, description, callback) {
        console.log("needUpdateApp", oldVersion, newVersion, description);
        callback(1);
        this.changeToNextPage();
    },
    onNewestVerion() {
        console.log("onNewestVerion");
        this.changeToNextPage();
    },
    needUpdateJS(oldVersion, newVersion, description, callback) {
        console.log("needUpdateJS", oldVersion, newVersion, description);
        callback(0);
    },
    checkJSCodeUpdate() {
        if (CONSTANTS.NOT_NEED_UPDATE_JS_START) {
            this.changeToNextPage()
        } else {
            console.log("checkJSCodeUpdate");
            this.updateJSCode();
        }
    },
    doGetPersonalInfo() {
        var param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_PERSONAL_INFO, param, this.getPersonalInfoSuccess, this.getInfoError);
    },
    getPersonalInfoSuccess(data) {
        if (data.success) {
            var context = data.context;
            context['userID'] = app.personal.info.userID;
            context['phone'] = app.personal.info.phone;
            app.personal.set(context);
            //初始化学习视频数据
            var studyNumInfo = app.studyNumMgr.info;
            if (studyNumInfo) {
                if (studyNumInfo.time != app.utils.getCurrentDateString()) {
                    app.studyNumMgr.initStudyNum();
                }
            } else {
                app.studyNumMgr.initStudyNum();
            }
            this.changeToHomePage();
        } else {
            this.getInfoError();
        }
    },
    getInfoError() {
        app.personal.clear();
        this.changeToLoginPage();
    },
    enterLoginPage() {
        setTimeout(()=>{
            app.navigator.replace({
                component: Login,
            });
        }, 600);
    },
    changeToLoginPage() {
        if (app.updateMgr.needShowSplash) {
            this.setState({renderSplashType: 1});
        } else {
            this.enterLoginPage();
        }
    },
    enterHomePage() {
        setTimeout(()=>{
            app.navigator.replace({
                component: Home,
            });
        }, 600);
    },
    changeToHomePage() {
        if (app.updateMgr.needShowSplash) {
            this.setState({renderSplashType: 2});
        } else {
            this.enterHomePage();
        }
    },
    enterNextPage() {
        app.updateMgr.setNeedShowSplash(false);
        if (this.state.renderSplashType===1) {
            this.enterLoginPage();
        } else {
            this.enterHomePage();
        }
    },
    changeToNextPage() {
        if (app.personal.info) {
            this.doGetPersonalInfo();
        } else {
            this.changeToLoginPage();
        }
    },
    componentDidMount() {
        this.checkJSCodeUpdate();
        setTimeout(()=>{
            SplashScreen.hide();
        }, 100);
    },
    renderUpdateSplash() {
        var components = {};
        components[STATUS_DOWNLOAD_JS_PROGESS] = (
            <ProgressInfo
                title="正在更新版本..."
                progress={this.state.progress} />
        );
        components[STATUS_UNZIP_JS_PROGESS] = (
            <ProgressInfo
                title="正在检测文件..."
                progress={this.state.progress} />
        );
        components[STATUS_UPDATE_END] = (
            <Text>更新完成，请稍后...</Text>
        );
        return (
            <Image
                resizeMode='stretch'
                source={app.img.splash_splash}
                style={styles.splash}>
                <View style={styles.functionContainer}>
                    {components[this.state.status]}
                </View>
            </Image>
        );
    },
    renderSwiperSplash() {
        return (
            <Swiper
                paginationStyle={styles.paginationStyle}
                dot={<View style={{backgroundColor:'#FFFCF4', width: 8, height: 8,borderRadius: 4, marginLeft: 8, marginRight: 8,}} />}
                activeDot={<View style={{backgroundColor:'#FFCD53', width: 16, height: 8,borderRadius: 4, marginLeft: 8, marginRight: 8,}} />}
                height={sr.th}
                loop={false}>
                {
                    [1,2,3,4].map((i)=>{
                        return (
                            <Image
                                key={i}
                                resizeMode='stretch'
                                source={app.img["splash_splash"+i]}
                                style={styles.bannerImage}>
                                {
                                    i===4 &&
                                    <TouchableOpacity
                                        style={styles.enterButtonContainer}
                                        onPress={this.enterNextPage}>
                                        <Image resizeMode='stretch' style={styles.enterButton} source={app.img.splash_start} />
                                   </TouchableOpacity>
                                }
                            </Image>
                        )
                    })
                }
            </Swiper>
        );
    },
    render() {
        return this.state.renderSplashType===0 ? this.renderUpdateSplash() : this.renderSwiperSplash();
    },
});


var PROGRESS_WIDTH = sr.tw*0.7;
var styles = StyleSheet.create({
    splash: {
        width: sr.w,
        height: sr.h,
    },
    functionContainer: {
        position: 'absolute',
        top: sr.h*0.6,
        left: sr.w*0.15,
        width: sr.w*0.7,
    },
    progressText: {
        flexDirection:'row',
        justifyContent:'space-between',
        width: sr.w*0.7,
    },
    paginationStyle: {
        bottom: 30,
    },
    bannerImage: {
        width: sr.w,
        height: sr.h,
    },
    enterButtonContainer: {
        position: 'absolute',
        width: 165,
        height: 40,
        left: (sr.w-165)/2,
        bottom: 110,
        alignItems:'center',
        justifyContent: 'center',
    },
    enterButton: {
        width: 140,
        height: 36,
    },
});
