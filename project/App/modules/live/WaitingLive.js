'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

var moment = require('moment');
var TimerMixin = require('react-timer-mixin');
var ShowGoPayMessageBox = require('./ShowGoPayMessageBox.js');
var LivePlayer = require('./LivePlayer.js');

module.exports = React.createClass({
    mixins: [TimerMixin],
    statics: {
        title: '课堂直播',
    },
    getCountdownTime() {
        var startMoment = moment(this.props.broadcastLiveStartTime),  nowMoment = moment();
        var sec = Math.floor(startMoment.diff(nowMoment)/1000);
        var diff = sec;
        var day = Math.floor(sec/86400);
        sec -= 86400*day;
        var hour = Math.floor(sec/3600);
        sec -= 3600*hour;
        var minute = Math.floor(sec/60);
        sec -= 60*minute;
        return {
            leftDay: day,
            leftTime: app.utils.timeFormat(hour, minute, sec),
            diff: diff,
        };
    },
    getInitialState() {
        return this.getCountdownTime();
    },
    componentDidMount() {
        var intervalID = this.setInterval(()=>{
            var obj = this.getCountdownTime();
            if (intervalID != null && obj.diff <= 0) {
                this.clearInterval(intervalID);
                intervalID = null;
                app.navigator.push({
                    component: LivePlayer,
                    passProps: {
                        broadcastRoomID: this.props.broadcastRoomID,
                        broadcastLiveName:this.props.broadcastLiveName,
                        broadcastLiveStartTime:this.props.broadcastLiveStartTime,
                    }
                });
            } else {
                this.setState(obj);
            }
        }, 1000);
    },
    render() {
        var {leftDay, leftTime} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.bannerContainer}>
                    <Image
                        resizeMode='stretch'
                        defaultSource={app.img.common_default}
                        source={{uri:this.props.broadcastLiveImg}}
                        style={styles.bannerImage}
                        />
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTextLine}>
                        </Text>
                        <Text numberOfLines={1} style={styles.bannerText}>
                          {'赢销截拳道直播'}
                        </Text>
                    </View>
                </View>
                <View style={styles.waitingContainer}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.live_bg_img}
                        style={styles.waitingStyle}>
                        <View style={styles.countdownTitle}>
                            <Text style={styles.countdownText}>{'直播倒计时'}</Text>
                        </View>
                        <View style={styles.countdownStyle}>
                            {leftDay>0 && <Text style={styles.countdownText}>{leftDay+'天'}</Text>}
                            <Image
                                resizeMode='stretch'
                                defaultSource={app.img.live_time}
                                source={app.img.live_time}
                                style={styles.countdownImage}>
                                <Text style={styles.countdownTime}>{leftTime}</Text>
                            </Image>
                        </View>
                        <View style={styles.countdownDetail}>
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.countdownDetailText, {color: CONSTANTS.THEME_COLOR}]}>{'课程名称：'}</Text>
                                    <Text style={[styles.countdownDetailText, {color: 'grey'}]}>{this.props.broadcastLiveName}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.countdownDetailText, {color: CONSTANTS.THEME_COLOR}]}>{'讲师：'}</Text>
                                    <Text style={[styles.countdownDetailText, {color: 'grey'}]}>{this.props.broadcastLiveAuthor}</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={[styles.countdownDetailText, {color: CONSTANTS.THEME_COLOR}]}>{'开课时间：'}</Text>
                                    <Text style={[styles.countdownDetailText, {color: 'grey'}]}>{this.props.broadcastLiveStartTime}</Text>
                                </View>
                            </View>
                        </View>
                    </Image>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bannerContainer: {
        marginTop:5,
        height: 200,
    },
    bannerTextContainer: {
        flexDirection: 'column',
        width: sr.w,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 30,
        justifyContent: 'center',
    },
    bannerText: {
        marginLeft: 10,
        fontSize: 15,
        color: '#FFFFFF'
    },
    bannerTextLine: {
        width: sr.w,
        height: 2,
        backgroundColor: '#239fdb',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    bannerImage: {
        width: sr.w,
        height: 200,
    },
    waitingContainer: {
        flex: 1,
        backgroundColor: '#edeeef',
    },
    waitingStyle: {
        marginVertical: 10,
        height: sr.ch-220,
        width: sr.w-20,
        alignSelf: 'center',
    },
    countdownTitle: {
        width: 120,
        height: 30,
        marginLeft: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: CONSTANTS.THEME_COLOR,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countdownText: {
        color: CONSTANTS.THEME_COLOR,
        fontSize: 20,
        backgroundColor: 'transparent',
    },
    countdownStyle: {
        marginTop: 30,
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countdownImage: {
        width: 200,
        height: 70,
        marginLeft: 15,
        alignItems:'center',
        justifyContent:'center'
    },
    countdownTime: {
        fontSize: 45,
        color: 'white',
        backgroundColor: 'transparent',
    },
    countdownDetail: {
        marginLeft: 30,
        flex: 1,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countdownDetailText: {
        fontSize: 14,
        backgroundColor: 'transparent',
    },
});
