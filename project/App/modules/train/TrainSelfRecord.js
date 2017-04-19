'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Navigator,
    Text,
    Image,
} = ReactNative;
const fs = require('react-native-fs');
const TimerMixin = require('react-timer-mixin');
const TrainSpeakerAngleView = require('./TrainSpeakerAngleView.js');
const SpeechState = require('./SpeechState.js');
const ProgressBar = require('./ProgressBar.js');
const RecordList = require('./RecordList.js');
const AudioRecorder = require('../../native/index.js').AudioRecorder;
const virtualUsers = require('../../data/virtualUsers.js');
const VideoNameInputBox = require('./VideoNameInputBox.js');

const MessageBox = COMPONENTS.MessageBox;

module.exports = React.createClass({
    mixins: [TimerMixin, SceneMixin],
    statics: {
        title: '自我训练场',
        rightButton: { image: app.img.common_record, handler: () => { app.scene.showRecordList(); } },
        leftButton: { handler: () => app.scene.goBack() },
    },
    componentWillMount () {
        this.roundTime = CONSTANTS.TRAIN_TYPES[this.props.trainingCode].roundTime;
        this.competitors = this.getCompetitors();
        this.propIndex = 0;
    },
    doStartSpeach () {
        if (this.recordOn) {
            return;
        }
        const time = Date.now();
        const name = app.audioFileMgr.getFileNameFromTime(time);
        const filepath = app.audioFileMgr.getFilePathFromName(name);
        this.fileInfo = {
            time: time,
            name: name,
            filepath: filepath,
            type: this.props.trainingCode,
        };

        this.recordOn = true;
        AudioRecorder.record((result) => {
            this.setState({ start: true });
            this.setTimeout(() => {
                this.setState({ showStopBtn: true });
            }, this.roundTime * 3 / 4);
        }, (error) => {
            Toast('录制音频文件失败，请稍后再试');
        }, filepath);
    },
    doConfirm (name) {
        this.fileInfo.name = name;
        app.audioFileMgr.saveRecordFile(this.fileInfo);
        this.setState({ showVideoNameInputBox: false });
    },
    doCancelCustomMessageBox () {
        this.setState({ showCustomMessageBox: false });
    },
    doConfirmCustomMessageBox () {
        this.recordOn = false;
        if (this.routeType === 1) {
            this.setState({ showCustomMessageBox: false, showVideoNameInputBox: false, showStopBtn: false, start: false });
            this.showRecordList();
        } else {
            app.navigator.pop();
        }
        AudioRecorder.stop((result) => {
            fs.unlink(this.fileInfo.filepath);
        }, (error) => {
        });
    },
    goBack () {
        if (this.recordOn) {
            this.routeType = 0;
            this.setState({ showCustomMessageBox: true });
            return;
        }
        app.navigator.pop();
    },
    doStopSpeach () {
        this.setState({ showCustomMessageBox: false, showVideoNameInputBox: true, showStopBtn: false, start: false });
        AudioRecorder.stop((result) => {
            this.recordOn = false;
        }, (error) => {
            Toast('录制音频文件失败，请稍后再试');
        });
    },
    showRecordList () {
        if (this.recordOn) {
            this.routeType = 1;
            this.setState({ showCustomMessageBox: true });
            return;
        }
        app.navigator.push({
            component: RecordList,
            passProps: {
                trainingCode: this.props.trainingCode,
            },
        });
    },
    onProgress (progress) {
        const val = Math.floor(progress * 100);
        if ((val === 95 ||
            val === 94 ||
            val === 50 ||
            val === 49 ||
            val === 20 ||
            val === 19
        ) && val !== this.lastProgressVal) {
            this.lastProgressVal = val;
            this.showGif();
        }
    },
    onEnd () {
        this.doStopSpeach();
    },
    getInitialState () {
        return {
            start: false,
            showStopBtn: false,
            showVideoNameInputBox: false,
            showCustomMessageBox: false,
            propItem: {},
        };
    },
    showGif () {
        let tPropCode = _.random(1, 8);
        if (tPropCode === 5 || tPropCode === 6 || tPropCode === 8) {
            tPropCode = 3;
        }
        this.setState({
            propItem: {
                propCode: '00' + tPropCode,
                propIndex: this.propIndex++,
            },
        });
    },
    getCompetitors () {
        const info = [];
        const virtualNum = [];
        const length = virtualUsers.length;

        const personInfo = app.personal.info;
        const personInfoMap = {};
        const userInfo = {};
        personInfoMap['userID'] = personInfo.userID;
        personInfoMap['channelState'] = app.phoneMgr.phone.channelStates.MCAS_CHANNEL_STATE_SPEAKERING;
        userInfo['sex'] = personInfo.sex;
        userInfo['userName'] = personInfo.name;
        userInfo['userLevel'] = personInfo.level;
        userInfo['userAlias'] = personInfo.alias;
        userInfo['userImg'] = personInfo.headImg;
        personInfoMap['userInfo'] = userInfo;
        info.push(personInfoMap);

        virtualNum.push(_.random(length - 1));
        while (virtualNum.length < 3) {
            let num = _.random(length - 1);
            while (_.includes(virtualNum, num)) {
                num = _.random(length - 1);
            }
            virtualNum.push(num);
        }

        _.forEach(virtualNum, (i) => {
            info.push(virtualUsers[i]);
        });

        return info;
    },
    render () {
        return (
            <View style={styles.container}>
                <TrainSpeakerAngleView
                    propItem={this.state.propItem}
                    competitors={this.competitors}
                    doStartSpeach={this.doStartSpeach}
                    doStopSpeach={this.doStopSpeach}
                    showStartBtn={!this.state.start}
                    showStopBtn={this.state.showStopBtn} />
                <View style={styles.propBottomView}>
                    {
                        this.state.start && <View style={{ height: 280 }}>
                            <ProgressBar
                                autoStart
                                time={this.roundTime}
                                onProgress={this.onProgress}
                                onEnd={this.onEnd} />
                            <View style={{ marginTop: 5, height: 250 }}>
                                <Text style={styles.text}>
                                    {'     '}点击结束按钮可以结束训练.
                                </Text>
                                <Text style={styles.text}>
                                    {'     '}或者在倒计时结束后结束训练.
                                </Text>
                            </View>
                        </View>
                    }
                    {
                        !this.state.start && <View style={{ height: 120 }}>
                            <Text style={styles.text}>
                                {'     '}亲，你好，这里是自我训练场，请点击开始按钮自我训练.
                            </Text>
                            <Text style={styles.text}>
                                {'     '}训练时间为1分钟，我们将会为你倒计时.
                            </Text>
                        </View>
                    }
                </View>
                <View style={styles.propTopView}>
                    <SpeechState
                        competitors={this.competitors}
                        />
                </View>
                {
                    this.state.showCustomMessageBox &&
                    <MessageBox
                        doCancel={this.doCancelCustomMessageBox}
                        doConfirm={this.doConfirmCustomMessageBox}
                        content='你确定要放弃该次训练吗?'
                        />
                }
                {
                    this.state.showVideoNameInputBox &&
                    <VideoNameInputBox
                        doConfirm={this.doConfirm}
                        fileName={this.fileInfo.name}
                        />
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        width:sr.w,
        height:sr.h,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'black',
    },
    propBottomView: {
        marginTop: -120,
        width:sr.w,
        height:240,
        backgroundColor: 'rgb(0,0,0)',
        alignItems:'center',
    },
    chatBottomView: {
        position:'absolute',
        bottom:0,
        width:sr.w,
        height:180,
    },
    propTopView: {
        position:'absolute',
        top: 0,
        left: 20,
        width: sr.w - 60,
    },
    text: {
        fontSize: 16,
        color: '#FFFFFF',
    },
});
