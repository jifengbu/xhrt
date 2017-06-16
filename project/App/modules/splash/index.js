'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
} = ReactNative;

import Swiper from 'react-native-swiper2';
const TimerMixin = require('react-timer-mixin');
const SplashScreen = require('@remobile/react-native-splashscreen');
const Login = require('../login/Login.js');
const Home = require('../home/index.js');
const StudyNum = require('../../data/StudyNum.js');
const LocalDataMgr = require('../../manager/LocalDataMgr.js');
const DeviceInfo = require('react-native-device-info');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState () {
        return {
            renderSplashType: 0,
        };
    },
    doGetPersonalInfo () {
        const param = {
            userID: app.personal.info.userID,
            __from__: 'splash',
        };
        POST(app.route.ROUTE_GET_PERSONAL_INFO, param, this.getPersonalInfoSuccess, this.getInfoError);
    },
    getPersonalInfoSuccess (data) {
        if (data.success) {
            const context = data.context;
            context['userID'] = app.personal.info.userID;
            context['phone'] = app.personal.info.phone;
            app.personal.set(context);
            // 初始化学习视频数据
            const studyNumInfo = app.studyNumMgr.info;
            if (studyNumInfo) {
                if (studyNumInfo.time != app.utils.getCurrentDateString()) {
                    app.studyNumMgr.initStudyNum();
                }
            } else {
                app.studyNumMgr.initStudyNum();
            }
            this.changeToHomePage();
            app.personal.setNeedLogin(false);
        } else {
            this.getInfoError();
        }
    },
    getInfoError () {
        app.personal.setNeedLogin(true);
        this.changeToLoginPage();
    },
    enterLoginPage (needHideSplashScreen) {
        app.navigator.replace({
            component: Login,
        });
        needHideSplashScreen && SplashScreen.hide();
    },
    changeToLoginPage () {
        if (app.updateMgr.needShowSplash) {
            this.setState({ renderSplashType: 1 }, () => {
                SplashScreen.hide();
            });
        } else {
            this.enterLoginPage(true);
        }
    },
    enterHomePage (needHideSplashScreen) {
        app.navigator.replace({
            component: Home,
        });
        needHideSplashScreen && SplashScreen.hide();
    },
    changeToHomePage () {
        if (app.updateMgr.needShowSplash) {
            this.setState({ renderSplashType: 2 }, () => {
                SplashScreen.hide();
            });
        } else {
            this.enterHomePage(true);
        }
    },
    enterNextPage () {
        app.updateMgr.setNeedShowSplash(false);
        if (this.state.renderSplashType === 1) {
            this.enterLoginPage();
        } else {
            this.enterHomePage();
        }
    },
    changeToNextPage () {
        const loginMethod = LocalDataMgr.getValueFromKey('loginMethod');
        if (loginMethod == 1) {
            this.changeToLoginPage();
        } else {
            if (app.personal.needLogin) {
                this.changeToLoginPage();
            } else {
                this.doGetPersonalInfo();
            }
        }
    },
    componentDidMount () {
        // console.log('getUniqueID', DeviceInfo.getUniqueID());
        // console.log('getManufacturer', DeviceInfo.getManufacturer());
        // console.log('getBrand', DeviceInfo.getBrand());
        // console.log('getModel', DeviceInfo.getModel());
        // console.log('getDeviceId', DeviceInfo.getDeviceId());
        // console.log('getSystemName', DeviceInfo.getSystemName());
        // console.log('getSystemVersion', DeviceInfo.getSystemVersion());
        //
        // navigator.geolocation.getCurrentPosition(
        //   (position) => {
        //     console.log('initialPosition-----', position);
        //     // 经度
        //     console.log('经度-----', position.coords.longitude);
        //     // 纬度
        //     console.log('纬度-----', position.coords.latitude);
        //   },
        //   (error) => console.log('getCurrentPosition error', error),
        //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        // );

        app.utils.until(
            () => app.personal.initialized && app.updateMgr.initialized && app.navigator && app.uniqueLoginMgr.uuid,
            (cb) => setTimeout(cb, 100),
            () => this.changeToNextPage()
        );
    },
    componentWillUnmount () {
        if (app.isandroid) {
            app.updateMgr.checkUpdate();
        }
    },
    onLayout (e) {
        const { height } = e.nativeEvent.layout;
        if (this.state.height !== height) {
            this.heightHasChange = !!this.state.height;
            this.setState({ height });
        }
    },
    renderSwiperSplash () {
        const { height } = this.state;
        const marginBottom = (!this.heightHasChange || Math.floor(height) === Math.floor(sr.th)) ? 0 : 30;
        return (
            <View style={{ flex: 1 }} onLayout={this.onLayout}>
                {
                    height &&
                    <Swiper
                        paginationStyle={styles.paginationStyle}
                        dot={<View style={{ backgroundColor:'#FFFCF4', width: 8, height: 8, borderRadius: 4, marginLeft: 8, marginRight: 8, marginBottom }} />}
                        activeDot={<View style={{ backgroundColor:'#FFCD53', width: 16, height: 8, borderRadius: 4, marginLeft: 8, marginRight: 8, marginBottom }} />}
                        height={height}
                        loop={false}>
                        {
                            [1, 2, 3, 4].map((i) => {
                                return (
                                    <Image
                                        key={i}
                                        resizeMode='stretch'
                                        source={app.img['splash_splash' + i]}
                                        style={[styles.bannerImage, { height }]}>
                                        {
                                            i === 4 &&
                                            <TouchableOpacity
                                                style={styles.enterButtonContainer}
                                                onPress={this.enterNextPage}>
                                                <Image resizeMode='stretch' style={styles.enterButton} source={app.img.splash_start} />
                                            </TouchableOpacity>
                                        }
                                    </Image>
                                );
                            })
                        }
                    </Swiper>
                }
            </View>
        );
    },
    render () {
        return this.state.renderSplashType === 0 ? null : this.renderSwiperSplash();
    },
});

const styles = StyleSheet.create({
    paginationStyle: {
        bottom: 30,
    },
    bannerImage: {
        width: sr.w,
    },
    enterButtonContainer: {
        position: 'absolute',
        width: 165,
        height: 40,
        left: (sr.w - 165) / 2,
        bottom: 80,
        alignItems:'center',
        justifyContent: 'center',
    },
    enterButton: {
        width: 140,
        height: 36,
    },
});
