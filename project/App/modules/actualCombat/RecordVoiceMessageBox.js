'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
} = ReactNative;

const TimerMixin = require('react-timer-mixin');
const Button = require('@remobile/react-native-simple-button');

const RecordVoiceMessageBoxRecording = React.createClass({
    doGiveup () {
        this.closeModal(() => {
            this.props.doGiveup();
        });
    },
    doConfirm () {
        clearInterval(this.setIntervalID);
        this.setIntervalID = null;
        this.closeModal(() => {
            this.props.doConfirm(this.state.second + this.state.minute * 60);
        });
    },
    getInitialState () {
        return {
            second : 0,
            minute : 0,
            opacity: new Animated.Value(0),
        };
    },
    componentDidMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
        this.props.doStartRecord();
        this.setIntervalID = setInterval(() => {
            let { second, minute } = this.state;
            second++;
            if (second >= 60) {
                second = 0;
                minute++;
            }
            this.setState({ second:second, minute:minute });
        }, 1000);
    },
    doClose () {
        this.closeModal(() => {
            this.props.doClose();
        });
    },
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(() => {
            callback();
        });
    },
    noticeShow (second, minute) {
        this.show(() => {
            this.props.noticeShow(second, minute);
        });
    },
    show (callback) {
        return callback();
    },
    render () {
        let { second, minute } = this.state;
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <View style={styles.container}>
                    <Text style={[styles.title, { marginTop: 15, marginBottom: 8 }]}>录音中</Text>
                    <Text style={styles.lineView} />
                    <Text style={styles.title2}>{minute + ':' + second}</Text>
                    <Image
                        resizeMode='stretch'
                        source={app.img.actualCombat_recording_voice}
                        style={[styles.centerImage, { marginTop: 8, marginBottom: 35 }]} />
                    <View style={styles.recordVoiceMessageBoxRecordingButtonView}>
                        <Button
                            onPress={this.doGiveup}
                            textStyle={[styles.btnText, { color: CONSTANTS.THEME_COLOR }]}
                            style={styles.recordVoiceMessageBoxRecordingButtonLeft}>放  弃</Button>
                        <Button
                            onPress={this.doConfirm}
                            textStyle={[styles.btnText, { color: '#FFFFFF' }]}
                            style={styles.recordVoiceMessageBoxRecordingButtonRight}>确  定</Button>
                    </View>
                </View>
            </Animated.View>
        );
    },
});
const RecordVoiceMessageBoxWaiting = React.createClass({
    mixins: [TimerMixin],
    getInitialState () {
        return {
            second : 3,
            opacity: new Animated.Value(0),
        };
    },
    componentDidMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
        let intervalID = setInterval(() => {
            let { second } = this.state;
            second--;
            this.setState({ second });
            if (second === 1) {
                clearInterval(intervalID);
                intervalID = null;
            }
        }, 1000);
        this.setTimeout(() => {
            this.props.showRecordVoiceMessageBoxRecording();
        }, 3000);
    },
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(() => {
            callback();
        });
    },
    render () {
        const { second } = this.state;
        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <View style={styles.chooseContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{'录音在 '}</Text>
                        <Text style={styles.secondText}>{second}</Text>
                        <Text style={styles.title}>{' 秒后开始'}</Text>
                    </View>
                    <View style={styles.lineView} />
                    <Image
                        resizeMode='stretch'
                        source={app.img.actualCombat_recording_voice}
                        style={styles.centerImage} />
                </View>
            </Animated.View>
        );
    },
});
module.exports = React.createClass({
    getInitialState () {
        return {
            showType:this.props.showType,
        };
    },
    showRecordVoiceMessageBoxWaiting () {
        this.setState({ showType:0 });
    },
    showRecordVoiceMessageBoxRecording () {
        this.setState({ showType:1 });
    },
    render () {
        return (
            this.state.showType === 0 ?
                <RecordVoiceMessageBoxWaiting
                    showRecordVoiceMessageBoxRecording={this.showRecordVoiceMessageBoxRecording} />
            :
                <RecordVoiceMessageBoxRecording
                    doStartRecord={this.props.doStartRecord}
                    doGiveup={this.props.doGiveup}
                    doConfirm={this.props.doConfirm} />
        );
    },
});
const styles = StyleSheet.create({
    container: {
        width:sr.w * 5 / 8,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    chooseContainer: {
        width:sr.w * 5 / 8,
        height:200,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
    },
    titleContainer: {
        marginBottom: 5,
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        color: 'gray',
        fontSize: 16,
        fontWeight: '100',
        textAlign: 'center',
        overflow: 'hidden',
    },
    secondText: {
        color: '#c1974b',
        fontSize: 22,
        fontWeight: '500',
        textAlign: 'center',
        overflow: 'hidden',
    },
    title2: {
        marginTop: 5,
        color: 'gray',
        fontSize: 12,
        fontWeight: '100',
        textAlign: 'center',
        overflow: 'hidden',
    },
    lineView: {
        width: sr.w * 5 / 8 - 50,
        height: 1,
        backgroundColor: '#cccccc',
    },
    centerImage: {
        width:210,
        height:100,
        alignSelf:'center',
        marginVertical:25,
    },
    recordVoiceMessageBoxRecordingButtonView: {
        width:sr.w * 5 / 8,
        height:40,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:CONSTANTS.THEME_COLOR,
    },
    recordVoiceMessageBoxRecordingButtonRight: {
        flex:1,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:CONSTANTS.THEME_COLOR,
    },
    recordVoiceMessageBoxRecordingButtonLeft: {
        flex:1,
        height: 38,
        margin: 1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
    },
    btnText: {
        fontSize: 16,
    },
});
