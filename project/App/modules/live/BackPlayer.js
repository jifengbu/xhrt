'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  StatusBar,
  NativeModules,
  StyleSheet
} = ReactNative;

var moment = require('moment');
var TimerMixin = require('react-timer-mixin');
var PackageList = require('../package/PackageList.js');
var BackPlayView = require('./BackPlayView.js');
var {MessageBox} =  COMPONENTS;

module.exports = React.createClass({
    mixins: [TimerMixin],
    statics: {
        title: '课堂回播',
    },
    getInitialState() {
        return {
            statusBarHidden: false,
            showPayMessageBox: false,
            showInfoMessageBox: false,
            videoEnable: false,
        };
    },
    componentDidMount() {
        this.getPlayBackList();
    },
    isFeeUser() {
        var userType = app.personal.info.userType;
        return userType == 0 ||userType == 1;//0=体验用户，1=套餐用户， 2=年费用户 ， 3=课堂用户5万的用户，4=代理商用户
    },
    doBuyYearMembership() {
        this.setState({showPayMessageBox: false, statusBarHidden: false}, ()=>{
            app.toggleNavigationBar(true);
            app.navigator.replace({
                title: '套餐',
                component: PackageList,
            });
        });
    },
    checkUserAllRight(context) {
        var endMoment = moment(context.playBackStartTime).add(2, 'hours');
        var now = moment();
        var videoEnable = true;
        if (this.isFeeUser() && endMoment.isBefore(now)) {
            videoEnable = false;
        }
        if (videoEnable) {
            var list = context.playBackVideoList;
            var flag = false;
            for (var item of list) {
                var startTime = moment(item.backVideoStartTime), endTime = moment(item.backVideoEndTime);
                if (now.isAfter(startTime) && now.isBefore(endTime)) {
                    this.uri = item.videoUrl;
                    flag = true;
                    break;
                }
            }
            if (flag) {
                this.setState({videoEnable: true, statusBarHidden: true});
                app.toggleNavigationBar(false);
            } else {
                videoEnable = false;
                this.setState({showInfoMessageBox: true});
            }
        }
        if (this.isFeeUser()) {
            if (videoEnable) {
                var intervalID = this.setInterval(()=>{
                    if (intervalID != null && !moment().isBefore(endMoment)) {
                        this.clearInterval(intervalID);
                        intervalID = null;
                        this.setState({showPayMessageBox: true, videoEnable: false});
                    }
                }, 10000);
            } else {
                this.setState({showPayMessageBox: true, showInfoMessageBox: true});
            }
        }
    },
    goBack() {
        this.setState({statusBarHidden: false}, ()=>{
            app.navigator.pop();
            app.toggleNavigationBar(true);
        });
    },
    getPlayBackList() {
        var param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_PLAYBACK_LIST, param, this.getPlayBackListSuccess, this.getPlayBackListError, true);
    },
    getPlayBackListSuccess(data) {
        if (data.success) {
            this.checkUserAllRight(data.context.playBack);
        } else {
            Toast("暂无回播");
        }
    },
    getPlayBackListError(error) {
        this.goBack();
    },
    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={this.state.statusBarHidden} />
                {
                    this.state.videoEnable &&
                    <BackPlayView
                        goBack={this.goBack}
                        uri={this.uri}
                        />
                }
                {
                    this.state.showInfoMessageBox &&
                    <MessageBox
                        content="该时间段没有回播，请稍后再试!"
                        doConfirm={()=>{app.navigator.pop()}}
                        />
                }
            </View>
        );
    }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
