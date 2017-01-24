'use strict';

var React = require('react');
var {
    StyleSheet,
    View,
    Navigator,
    Text,
    Image,
} = ReactNative;

var TrainHearerAngleView = require('./TrainHearerAngleView.js');
var SpeechState = require('./SpeechState.js');
var AudioRecorder = require('../../native/index.js').AudioRecorder;
var virtualUsers = require('../../data/virtualUsers.js');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '自我回顾',
        leftButton: {handler: ()=>app.scene.goBack()},
    },
    componentWillMount() {
        this.competitors = this.getCompetitors();
    },
    componentDidMount() {
        AudioRecorder.play(this.props.filepath, (result)=>{
            app.navigator.pop();
        }, (error)=>{
            Toast('无效历史记录');
            app.navigator.pop();
        });
    },
    goBack() {
        AudioRecorder.playStop();
        app.navigator.pop();
    },
    getCompetitors() {
        var info = [];
        var virtualNum = [];
        var length = virtualUsers.length;

        var personInfo = app.personal.info;
        var personInfoMap = {};
        var userInfo = {};
        personInfoMap['userID'] = personInfo.userID;
        personInfoMap['channelState'] = app.phoneMgr.phone.channelStates.MCAS_CHANNEL_STATE_SPEAKERING;
        userInfo['sex'] = personInfo.sex;
        userInfo['userName'] = personInfo.name;
        userInfo['userLevel'] = personInfo.level;
        userInfo['userAlias'] = personInfo.alias;
        userInfo['userImg'] = personInfo.headImg;
        personInfoMap['userInfo'] = userInfo;
        info.push(personInfoMap);

        virtualNum.push(_.random(length-1));
        while (virtualNum.length < 3) {
            var num = _.random(length-1);
            while (_.includes(virtualNum, num)) {
                num = _.random(length-1);
            }
            virtualNum.push(num);
        }

        _.forEach(virtualNum, (i)=>{
            info.push(virtualUsers[i]);
        });

        return info;
    },
    render() {
        var {sex, userID} = app.personal.info;
        return (
            <View style={styles.container}>
                <TrainHearerAngleView
                    competitors={this.competitors}
                    speaker={{userInfo:{sex: sex}, userID}}
                    />
                <View style={styles.propBottomView}>
                    <View style={{marginTop: 20}}>
                        <Text style={styles.text}>
                            {'     '}认真欣赏你的训练成果吧.
                        </Text>
                        <Text style={styles.text}>
                            {'     '}认真修炼才能成为王雩老师那样的赢销宗师哦.
                        </Text>
                    </View>
                </View>
                <View style={styles.propTopView}>
                    <SpeechState
                        competitors={this.competitors}
                        />
                </View>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    container: {
        width:sr.w,
        height:sr.ch,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'black'
    },
    propBottomView: {
        position:'absolute',
        bottom:-30,
        width:sr.w,
        height:230,
        backgroundColor: 'rgb(0, 0, 0)',
        alignItems:'center',
    },
    propTopView: {
        position:'absolute',
        top: 0,
        left: 0,
        width: sr.w - 60,
        marginLeft:10,
    },
    text: {
        fontSize: 16,
        color: '#FFFFFF',
    },
});