'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Navigator,
    Text,
    Image,
} = ReactNative;

const TimerMixin = require('react-timer-mixin');
const Subscribable = require('Subscribable');
const TrainMain = require('./TrainMain.js');
const Phone = require('../../native/index.js').Phone;
const Progress = require('react-native-progress');
const { MessageBox } = COMPONENTS;

module.exports = React.createClass({
    mixins: [Subscribable.Mixin, TimerMixin, SceneMixin],
    statics: {
        title: '准备大厅',
        leftButton: { handler: () => app.scene.goBackPrompt() },
    },
    registerEvents (name) {
        this.addListenerOn(app.phoneMgr, name, (param) => {
            this[name](param);
        });
    },
    componentWillMount () {
        this.registerEvents('EVENT_SERVER_INFO_ERROR');
        this.registerEvents('EVENT_CONNECT');
        this.registerEvents('EVENT_DISCONNECT');
        this.registerEvents('EVENT_START_SELF_READY_SPEAK');
        this.registerEvents('EVENT_START_WAIT_OTHER_SPEAK');
        this.registerEvents('EVENT_ALL_OTHERS_LEFT_ROOM_BEFORE_READY');
    },
    EVENT_CONNECT (result) {
        if (this.state.firstConnect) {
            this.setState({ firstConnect: false });
            app.phoneMgr.joinChatroom(CONSTANTS.TRAIN_TYPES[this.props.trainingCode].gameType);
        }
    },
    EVENT_DISCONNECT (result) {
        app.phoneMgr.closeSocket();
        app.phoneMgr.connectTrainServer();
    },
    EVENT_SERVER_INFO_ERROR (result) {
        app.phoneMgr.closeSocket();
        app.phoneMgr.connectTrainServer();
    },
    EVENT_START_SELF_READY_SPEAK (result) {
        console.log('EVENT_START_SELF_READY_SPEAK' + result);
        this.showTrainMain();
    },
    EVENT_START_WAIT_OTHER_SPEAK (result) {
        console.log('EVENT_START_WAIT_OTHER_SPEAK' + result);
        this.showTrainMain(result.speaker);
    },
    EVENT_ALL_OTHERS_LEFT_ROOM_BEFORE_READY (result) {
        console.log('EVENT_ALL_OTHERS_LEFT_ROOM_BEFORE_READY' + result);
        Toast('匹配失败, 没有找到适合你的选手');
        this.goBack();
    },
    goBackPrompt () {
        this.setState({ showExitMessageBox: true });
    },
    goBack () {
        const mgr = app.phoneMgr;
        mgr.closeSocket();
        app.navigator.pop();
    },
    getInitialState () {
        return {
            progress: 0,
            firstConnect: true,
            showExitMessageBox: false,
        };
    },
    componentDidMount () {
        const mgr = app.phoneMgr;
        let intervalID = this.setInterval(() => {
            const progress = this.state.progress + 0.005;
            if (progress >= 1) {
                if (intervalID != null) {
                    this.clearInterval(intervalID);
                    intervalID = null;
                }
                Toast('匹配超时，没有找到适合你的选手');
                this.goBack();
            } else {
                this.setState({ progress });
            }
        }, 150);
        mgr.connectTrainServer();
    },
    showTrainMain (speaker) {
        const roundTime = CONSTANTS.TRAIN_TYPES[this.props.trainingCode].roundTime;
        app.phoneMgr.trainingCode = this.props.trainingCode;
        app.phoneMgr.trainingID = this.props.trainingID;
        app.navigator.replace({
            component: TrainMain,
            passProps: {
                propList: this.props.propList,
                isSelfSpeek:!speaker,
                competitors: app.phoneMgr.competitors,
                speaker: speaker,
                roundTime: roundTime,
                getTrainingInfo: this.props.getTrainingInfo,
            },
        });
    },
    render () {
        return (
            <View style={styles.container}>
                <Image
                    resizeMode='stretch'
                    source={app.img.train_ready_background}
                    style={styles.backgroundImage}>
                    <View style={styles.waitView}>
                        <Progress.Circle
                            progress={this.state.progress}
                            size={sr.ws(80)}
                            unfilledColor='#A62045'
                            borderWidth={0.5}
                            borderColor='#A62045'
                            thickness={10}
                            direction='clockwise'
                            textStyle={styles.textStyle}
                            showsText
                            formatText={(p) => {
                                return (p == 1) ? '赢' : 30 - Math.floor(p * 30);
                            }}
                            color='#D9B5BF' />
                    </View>
                    <Text style={styles.title}>{this.state.firstConnect ? '正在匹配选手..' : '正在匹配选手...'}</Text>
                    <Image
                        resizeMode='stretch'
                        source={app.personal.info.sex === 0 ? app.img.train_girl : app.img.train_boy}
                        style={app.personal.info.sex === 0 ? styles.iconGirl : styles.iconBoy} />
                </Image>
                {
                    this.state.showExitMessageBox &&
                    <MessageBox
                        content='正在匹配中，确定要退出吗？'
                        doConfirm={this.goBack}
                        doCancel={() => { this.setState({ showExitMessageBox: false }); }}
                        />
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
    },
    textStyle: {
        color:'white',
        fontSize: 40,
        fontWeight:'100',
        alignItems: 'center',
    },
    backgroundImage: {
        width:sr.w,
        height:sr.ch,
        alignItems:'center',
    },
    waitView: {
        marginTop:30,
        alignItems: 'center',
        backgroundColor: '#4E6E7E',
        borderRadius: 50,
    },
    iconGirl: {
        position:'absolute',
        left: sr.w / 2 - sr.w * 1 / 6 - 5,
        bottom: sr.h * 1 / 8,
        width:sr.w * 1 / 3 + 10,
        height:sr.h * 1 / 2,
    },
    iconBoy: {
        position:'absolute',
        left: sr.w / 2 - sr.w * 1 / 6 - 15,
        bottom: sr.h * 1 / 8,
        width:sr.w * 1 / 3 + 30,
        height:sr.h * 1 / 2,
    },
    title: {
        marginTop:15,
        color: 'white',
        fontSize: 16,
        overflow: 'hidden',
    },
});
