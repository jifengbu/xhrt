'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
} = ReactNative;

var sortByOrder = require('lodash.sortbyorder');
var Phone = require('../native/index.js').Phone;
var EventEmitter = require('EventEmitter');

const
REQUEST_SUCCESS = 0,
ERROR_MACS_CHATROOM_NOFOUND = -1,
ERROR_MACS_CHATROOM_USER_FULL = -2,
ERROR_MACS_USER_NOFOUND = -3,
ERROR_MACS_NETWORK_BAD = -4,
ERROR_MCAS_MATCH_FAIL = -5,
ERROR_MCAS_REMOTE_LOGIN = -6,
ERROR_CLIENT_FAIL = -7,
ERROR_MCAS_CHATROOM_SPEAKER_FULL = -8;

const ERROR_TEXTS = {
    '-1': "找不到指定房间",
    '-2': "房间已满, 不能加入房间",
    '-3': "找不到用户",
    '-4': "网络太糟糕了",
    '-5': "匹配失败, 没有找到适合你的选手",
    '-6': "你的账号在异地登录",
    '-7': "需要开启设备录音权限",
    '-8': "别人正在说话",
};

const
ERROR_MCAS_IN_REQUEST = -10000,
ERROR_MCAS_OFF_LINE = -10002;

//用户格外的状态
const
EXTRA_STATE_READY_SPEAK = 4, //正在准备演讲
EXTRA_STATE_WAIT_GRADE = 5, //等待评委打分
EXTRA_STATE_GRADING = 6, //正在打分
EXTRA_STATE_GRADED = 7, //打分完毕
EXTRA_STATE_WAIT_RESTART = 8; //等待重新开始

/*phone status change graph
*
* STATUS_NONE->[STATUS_START_JOINING]
* STATUS_START_JOINING->[STATUS_SELF_READY_SPEAK, STATUS_WAIT_OTHER_SPEAK]
* STATUS_SELF_READY_SPEAK->[STATUS_SELF_START_SPEAK]
* STATUS_SELF_START_SPEAK->[STATUS_SELF_SPEAKING]
* STATUS_SELF_SPEAKING->[STATUS_SELF_START_END_SPEAK]
* STATUS_SELF_START_END_SPEAK->[STATUS_WAIT_COUNT_GRADE]
* STATUS_WAIT_OTHER_SPEAK->[STATUS_OTHER_SPEAKING]
* STATUS_OTHER_SPEAKING->[STATUS_GRADE_FOR_OTHER]
* STATUS_GRADE_FOR_OTHER->[STATUS_START_GRADE_OTHER, STATUS_WAIT_COUNT_GRADE]
* STATUS_START_GRADE_OTHER->[STATUS_WAIT_COUNT_GRADE, STATUS_SELF_READY_SPEAK, STATUS_WAIT_OTHER_SPEAK, STATUS_SHOW_TOTAL_GRADE]
* STATUS_WAIT_COUNT_GRADE->[STATUS_SELF_READY_SPEAK, STATUS_WAIT_OTHER_SPEAK, STATUS_SHOW_TOTAL_GRADE]
* STATUS_SHOW_TOTAL_GRADE->[STATUS_START_RESTART_GAME, STATUS_START_EXITING]
* STATUS_START_RESTART_GAME->[STATUS_SELF_READY_SPEAK, STATUS_WAIT_OTHER_SPEAK]
* STATUS_START_EXITING->[STATUS_NONE]
*
*/

const
STATUS_SERVER_INFO_ERROR = -1, //服务器数据出错
STATUS_NONE = 0, //初始状态
STATUS_START_JOINING = 1, //执行joinChatroom后，还没有收到onjoinroom
STATUS_JOINED_ROOM = 2, //收到onjoinroom
STATUS_SELF_READY_SPEAK = 3, //轮到自己演讲，显示开始按钮
STATUS_SELF_START_SPEAK = 4, //自己按下开始按钮，准备开始演讲，但是服务器还没有返回可以开始演讲
STATUS_SELF_SPEAKING = 5, //服务器返回给自己消息，可以演讲了
STATUS_SELF_START_END_SPEAK = 6, //自己按结束下按钮，但是服务器还没有返回消息
STATUS_WAIT_OTHER_SPEAK = 7,//等待别人演讲
STATUS_OTHER_SPEAKING = 8,//别人演讲中
STATUS_GRADE_FOR_OTHER = 9, //弹出打分界面
STATUS_START_GRADE_OTHER = 10, //已经点击确定按钮发送给服务器
STATUS_WAIT_COUNT_GRADE = 11, //自己给别人打分成功，等待其他人打分
STATUS_SHOW_TOTAL_GRADE = 12, //显示分数排名
STATUS_START_RESTART_GAME = 13, //点击重新开始按钮
STATUS_START_EXITING = 14; //开始退出房间

/*meet status change graph
*
* STATUS_NONE->[STATUS_MEET_START_JOINING]
* STATUS_MEET_START_JOINING-> [STATUS_MEET_LISTENING, STATUS_MEET_SPEAKING]
* STATUS_MEET_LISTENING->[STATUS_MEET_APPLY_SPEAKING]
* STATUS_MEET_APPLY_SPEAKING->[STATUS_MEET_LISTENING, STATUS_MEET_SPEAKING]
* STATUS_MEET_SPEAKING->[STATUS_MEET_LISTENING, STATUS_MEET_START_END_SPEAK]
* STATUS_MEET_START_END_SPEAK->[STATUS_MEET_LISTENING]
*
*/
const
STATUS_MEET_START_JOINING = 20, //正在加入会议
STATUS_MEET_LISTENING = 21, //开会正在旁听
STATUS_MEET_SPEAKING = 22, //开会正在麦上
STATUS_MEET_APPLY_SPEAKING = 23, //开会申请上麦
STATUS_MEET_START_END_SPEAK = 24; //开会申请下麦

class Manager extends EventEmitter {
    constructor() {
        super();
        this.constants = {
            STATUS_SERVER_INFO_ERROR: STATUS_SERVER_INFO_ERROR,
            STATUS_NONE: STATUS_NONE,
            STATUS_START_JOINING: STATUS_START_JOINING,
            STATUS_JOINED_ROOM: STATUS_JOINED_ROOM,
            STATUS_SELF_READY_SPEAK: STATUS_SELF_READY_SPEAK,
            STATUS_SELF_START_SPEAK: STATUS_SELF_START_SPEAK,
            STATUS_SELF_SPEAKING: STATUS_SELF_SPEAKING,
            STATUS_SELF_START_END_SPEAK: STATUS_SELF_START_END_SPEAK,
            STATUS_WAIT_OTHER_SPEAK: STATUS_WAIT_OTHER_SPEAK,
            STATUS_OTHER_SPEAKING: STATUS_OTHER_SPEAKING,
            STATUS_GRADE_FOR_OTHER: STATUS_GRADE_FOR_OTHER,
            STATUS_START_GRADE_OTHER: STATUS_START_GRADE_OTHER,
            STATUS_WAIT_COUNT_GRADE: STATUS_WAIT_COUNT_GRADE,
            STATUS_SHOW_TOTAL_GRADE: STATUS_SHOW_TOTAL_GRADE,
            STATUS_START_RESTART_GAME: STATUS_START_RESTART_GAME,
            STATUS_START_EXITING: STATUS_START_EXITING,
            STATUS_MEET_START_JOINING: STATUS_MEET_START_JOINING,
            STATUS_MEET_SPEAKING: STATUS_MEET_SPEAKING,
            STATUS_MEET_APPLY_SPEAKING: STATUS_MEET_APPLY_SPEAKING,
            STATUS_MEET_START_END_SPEAK: STATUS_MEET_START_END_SPEAK,
        };
        this.chatroomID = "0";
        this.status = STATUS_NONE;
        this.round = 0;
        this.gradeList = {};
        this.isSpeakerOn = false;
        this.isInRoom = false;
        this.phone = new Phone({
            onconnect: this.onconnect.bind(this),
            ondisconnect: this.ondisconnect.bind(this),
            onexitroom: this.onexitroom.bind(this),
            onbroadcast: this.onbroadcast.bind(this),
            onSendMessage: this.onSendMessage.bind(this),
            onsetgrade: this.onsetgrade.bind(this),
            onrequest: this.onrequest.bind(this),
        });
        this.connectAccessServer();
    }
    handleError(result, keys) {
        if(ERROR_MCAS_CHATROOM_SPEAKER_FULL == result)
        {
          Toast(ERROR_TEXTS[result]);
          return false;
        }
        var ret = false;
        keys = keys||_.keys(ERROR_TEXTS);
        _.forEach(keys, (key)=>{
            if (result == key) {
                ret = true;
                this.onServerError(ERROR_TEXTS[key]);
            }
        });
        return ret;
    }
    toggleSpeaker(flag) {
        if (flag == null) {
            if (this.isSpeakerOn) {
                this.phone.speakerOff();
                this.isSpeakerOn = false;
            } else {
                this.phone.speakerOn();
                this.isSpeakerOn = true;
            }
        } else if (flag && !this.isSpeakerOn) {
            this.phone.speakerOn();
            this.isSpeakerOn = true;
        } else if (!flag && this.isSpeakerOn) {
            this.phone.speakerOff();
            this.isSpeakerOn = false;
        }
    }
    connectAccessServer() {
        console.log('connectAccessServer');
        this.phone.connectAudioServer({
            serverIP: CONSTANTS.CHAT_SERVER_IP,
            serverPort: CONSTANTS.CHAT_SERVER_PORT,
        });
    }
    connectTrainServer() {
        console.log('connectTrainServer');
        this.phone.request(JSON.stringify({
            chatroomNumber: 'none',
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_CONNECT_MCAS,
            requestTimeOut: CONSTANTS.TRAIN_SERVER_TIMEOUT,
            isBroadcast: 1,
        }));
    }
    connectMeetingServer(meetingRoom) {
        console.log('connectMeetingServer');
        this.meetingRoom = meetingRoom;
        this.phone.request(JSON.stringify({
            chatroomNumber: meetingRoom.roomNO,
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_CONNECT_MCAS,
            requestTimeOut: CONSTANTS.MEETING_SERVER_TIMEOUT,
            isBroadcast: 1,
        }));
    }
    closeSocket() {
        console.log('closeSocket');
        this.phone.speakerOff();
        this.phone.request(JSON.stringify({
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_CLOSE_SOCKET,
        }));
    }
    onconnect() {
        console.log('onconnect');
        this.status = STATUS_NONE;
        this.emit("EVENT_CONNECT");
    }
    ondisconnect() {
        console.log('ondisconnect');
        this.status = STATUS_NONE;
        this.closeSocket();
        this.emit("EVENT_DISCONNECT");
    }
    onServerError(info) {
        console.log("onServerError", info);
        this.emit("EVENT_SERVER_INFO_ERROR", info);
        this.status = STATUS_NONE;
    }
    joinChatroom(gameType) {
        var info = app.personal.info;

        this.gameType = gameType;
        this.competitors = [];
        console.log('joinChatroom', gameType);
        this.status = STATUS_START_JOINING;
        var userInfo = {
            sex: info.sex,
            userImg: info.headImg,
            userName: info.name||app.login.list[0],
            userLevel: info.level,
            userAlias: info.alias,
            isSpecialSoldier: info.isSpecialSoldier,
        };
        this.phone.request(JSON.stringify({
            userID: app.personal.info.userID,
            gameType: gameType,
            userInfo: JSON.stringify(userInfo),
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_MATCH_JOINCHATROOM,
        }));
    }
    onjoinroom(result) {
        console.log('onjoinroom', result);
        if (this.status == STATUS_START_JOINING) {
            this.status = STATUS_JOINED_ROOM;
        }
        this.chatroomID = result.chatroomID;
        this.isInRoom = true;
        if (this.neadExitChatRoom) {
            this.closeSocket();
        }
    }
    exitChatroom() {
        console.log('exitChatroom');
        this.status = STATUS_NONE;
        this.isInRoom = false;
        this.phone.closeSocket();
    }
    onexitroom(result) {
        console.log('onexitroom', result);
        if (result.result == 0) {
            this.isInRoom = false;
            this.status = STATUS_NONE;
        } else if(result.result == ERROR_MCAS_IN_REQUEST) {
        } else if(result.result == ERROR_MCAS_OFF_LINE) {
            this.ondisconnect();
        } else {
            this.status = STATUS_NONE;
        }
        this.emit("EVENT_EXIT_ROOM_FINISH");
    }
    startSpeak() {
        console.log('startSpeak');
        this.status = STATUS_SELF_START_SPEAK;
        this.phone.setMessageToServer({
            userID: app.personal.info.userID,
            chatroomID: this.chatroomID,
            message: this.phone.messages.MCAS_CHANNEL_GAME_MESSAGE_START,
        });
    }
    stopSpeak() {
        console.log('stopSpeak');
        this.status = STATUS_SELF_START_END_SPEAK;
        this.phone.setMessageToServer({
            userID: app.personal.info.userID,
            chatroomID: this.chatroomID,
            message: this.phone.messages.MCAS_CHANNEL_GAME_MESSAGE_STOP,
        });
    }
    restart() {
        console.log('restart');
        this.status = STATUS_START_RESTART_GAME;
        this.phone.setMessageToServer( {
            userID: app.personal.info.userID,
            chatroomID: this.chatroomID,
            message: this.phone.messages.MCAS_CHANNEL_GAME_MESSAGE_RESTART,
        });
    }
    onSendMessage(result) {
        console.log('onSendMessage', result);
        if (result.result == 0) {
        } else if(result.result == ERROR_MCAS_OFF_LINE) {
            this.ondisconnect();
        } else if(result.result == ERROR_MCAS_IN_REQUEST) {
        } else {
            this.onServerError("消息错误("+result.message+")");
        }
    }
    setGradeToServer(score) {
        console.log('setGradeToServer',app.personal.info.userID, this.gradeUserID);
        if (this.status === STATUS_GRADE_FOR_OTHER) {
            this.status = STATUS_START_GRADE_OTHER;
        }
        this.phone.setGradeToServer({
            userID: app.personal.info.userID,
            chatroomID: this.chatroomID,
            gradeUserID: this.gradeUserID,
            gradeCount: parseInt(score),
        });
    }
    onsetgrade(result) {
        console.log('onsetgrade', result);
        if (result.result == 0) {
            //success
        } else if(result.result == ERROR_MCAS_OFF_LINE) {
            this.ondisconnect();
        } else if(result.result == ERROR_MCAS_IN_REQUEST) {
        } else {
            this.onServerError("打分错误");
        }
    }
    onrequest(result) {
        console.log('onrequest', result);
        if (result.result == 0) {
            var data;
            try {
                data = JSON.parse(result.data);
            } catch (e) {
                return this.onServerError("解析JSON错误");
            }
            this.onMeetingRoomRequest(data);
        } else if(result.result == ERROR_MCAS_IN_REQUEST) {
            //do nothing
        } else if(result.result == ERROR_MCAS_OFF_LINE) {
            this.ondisconnect();
        } else {
            this.handleError(result.result);
        }
    }
    onbroadcast(result) {
        console.log("onbroadcast", result);
        var  broadcastTypes = this.phone.broadcastTypes;
        var data;
        try {
            data = JSON.parse(result);
        } catch (e) {
            return this.onServerError("解析JSON错误");
        }
        if (data.broadcastType == broadcastTypes.MCAS_BROADCAST_TYPE_GAME_READY) {
            this.chatroomID = data.chatroomID;
            if (!data.isReStart) {
                this.onNewGameReady(data.chatroomArray);
            } else {
                this.onNextGameReady(data.chatroomArray);
            }
        } else if (data.broadcastType == broadcastTypes.MCAS_BROADCAST_TYPE_CHANNEL_STATE) {
            this.onCompetitorsStateChange(data.userID, data.channelState);
        } else if (data.broadcastType == broadcastTypes.MCAS_BROADCAST_TYPE_GAME_GRADE) {
            this.dealWithCompetitorsGrade(data.userID, data.gradeUserID, data.gradeCount);
        } else if (data.broadcastType == broadcastTypes.MCAS_BROADCAST_TYPE_MEET_CHANNEL_STATE) {
            this.onMeetingStateChange(data.userID, data.meetChannelState);
        } else if (data.broadcastType == broadcastTypes.MCAS_BROADCAST_TYPE_MEET_ADMIN_USERID) {
            this.onMeetingAdminChange(data.userID);
        } else if (data.broadcastType == broadcastTypes.MCAS_BROADCAST_TYPE_MEET_NEW_CHANNEL) {
            this.onNewPersonJoin(data.userID, data.meetChannelState, data.userInfo);
        }
    }
    onNewGameReady(competitors) {
        var states = this.phone.channelStates;
        this.isInRoom = true;
        this.competitors = _.sortBy(competitors, (item)=>item.seatNumber);
        var left = _.reject(this.competitors, (item)=>item.channelState==states.MCAS_CHANNEL_STATE_EXIT||item.userID==app.personal.info.userID);
        if (!left.length) {
            this.emit("EVENT_ALL_OTHERS_LEFT_ROOM_BEFORE_READY");
            return;
        }
        _.forEach(this.competitors, (item)=>{
            try {
                item.userInfo = JSON.parse(item.userInfo);
            } catch(e) {
                this.status = STATUS_SERVER_INFO_ERROR;
            }
        });
        if (this.status === STATUS_SERVER_INFO_ERROR) {
            return this.onServerError("解析 userInfo JSON 失败");
        }
        this.round = 0;
        this.gradeList = {};
        var firstSpeaker = _.find(this.competitors, (item)=>item.channelState==states.MCAS_CHANNEL_STATE_READY);
        if (firstSpeaker.userID==app.personal.info.userID) { //自己是第一个演讲的
            this.status = STATUS_SELF_READY_SPEAK;
            firstSpeaker.extraState = EXTRA_STATE_READY_SPEAK;
            this.emit("EVENT_START_SELF_READY_SPEAK");
        } else {
            this.status = STATUS_WAIT_OTHER_SPEAK;
            firstSpeaker.extraState = EXTRA_STATE_READY_SPEAK;
            this.emit("EVENT_START_WAIT_OTHER_SPEAK", {speaker: firstSpeaker});
        }
        // app.leftTimesMgr.subLeftTime(this.trainingCode);
        var param = {
            userID:app.personal.info.userID,
            trainingCode:this.trainingCode,
        };
        POST(app.route.ROUTE_TRAINING_CONSUMPTION, param, (data)=>{console.log(data)});
    }
    onNextGameReady(competitors) {
        var states = this.phone.channelStates;
        _.forEach(this.competitors, (item)=>{
            var person = _.find(competitors, (p)=>p.userID==item.userID);
            if (!person) {
                this.status = STATUS_SERVER_INFO_ERROR;
            }
            item.extraState = null;
            item.channelState = person.channelState;
            item.seatNumber = person.seatNumber;
        });
        this.competitors = _.sortBy(this.competitors, (item)=>item.seatNumber);
        if (this.status === STATUS_SERVER_INFO_ERROR) {
            return this.onServerError("重新开始的用户和上轮不一致");
        }
        var firstSpeaker = _.find(this.competitors, (item)=>item.channelState==states.MCAS_CHANNEL_STATE_READY);
        if (firstSpeaker.userID==app.personal.info.userID) { //自己是第一个演讲的
            this.status = STATUS_SELF_READY_SPEAK;
            firstSpeaker.extraState = EXTRA_STATE_READY_SPEAK;
            this.emit("EVENT_SELF_READY_SPEAK");
        } else {
            this.status = STATUS_WAIT_OTHER_SPEAK;
            firstSpeaker.extraState = EXTRA_STATE_READY_SPEAK;
            this.emit("EVENT_WAIT_OTHER_SPEAK", {speaker: firstSpeaker});
        }
        // app.leftTimesMgr.subLeftTime(this.trainingCode);
        this.round++;
        this.gradeList = {};
    }
    onCompetitorsStateChange(userID, channelState) {
        var competitor = _.find(this.competitors, (item)=>item.userID==userID);
        if (competitor) {
            var preState = competitor.channelState;
            competitor.channelState = channelState;
            this.dealWithCompetitorsStateChange(competitor, channelState, preState);
        }
    }
    dealWithCompetitorsStateChange(competitor, curState, preState) {
        var states = this.phone.channelStates;
        if (competitor.userID == app.personal.info.userID) {
            if (preState == states.MCAS_CHANNEL_STATE_READY && curState == states.MCAS_CHANNEL_STATE_SPEAKERING) {
                this.status = STATUS_SELF_SPEAKING;
                competitor.extraState = null;
                this.emit("EVENT_SELF_SPEAKING");
            } else if (preState == states.MCAS_CHANNEL_STATE_SPEAKERING && curState == states.MCAS_CHANNEL_STATE_SPEAK_FINISH) {
                this.gradeUserID = competitor.userID;
                _.forEach(this.competitors, (item)=>{
                    if (item.channelState == states.MCAS_CHANNEL_STATE_EXIT) {
                        item.extraState = null;
                    } else if (item.userID != competitor.userID) {
                        item.extraState = EXTRA_STATE_GRADING;
                    } else {
                        item.extraState = EXTRA_STATE_WAIT_GRADE;
                    }
                });
                this.status = STATUS_WAIT_COUNT_GRADE;
                this.emit("EVENT_STATUS_CHANGE");
            } else if (curState == states.MCAS_CHANNEL_STATE_EXIT) {
                this.status = STATUS_NONE;
            }
        } else {
            if (preState == states.MCAS_CHANNEL_STATE_READY && curState == states.MCAS_CHANNEL_STATE_SPEAKERING) {
                this.status = STATUS_OTHER_SPEAKING;
                competitor.extraState = null;
                this.emit("EVENT_OTHER_SPEAKING");
            } else if (preState == states.MCAS_CHANNEL_STATE_SPEAKERING && curState == states.MCAS_CHANNEL_STATE_SPEAK_FINISH) {
                this.gradeUserID = competitor.userID;
                _.forEach(this.competitors, (item)=>{
                    if (item.channelState == states.MCAS_CHANNEL_STATE_EXIT) {
                        item.extraState = null;
                    } else if (item.userID != competitor.userID) {
                        item.extraState = EXTRA_STATE_GRADING;
                    } else {
                        item.extraState = EXTRA_STATE_WAIT_GRADE;
                    }
                });
                this.status = STATUS_GRADE_FOR_OTHER;
                this.emit("EVENT_SHOW_GRADE_FOR_OTHER_PANEL", {gradeCompetitor: competitor});
            } else if (curState == states.MCAS_CHANNEL_STATE_EXIT) {
                this.dealWithCompetitorsExit(competitor, preState);
            }
        }
    }
    dealWithCompetitorsExit(competitor, preState) {
        competitor.extraState = null;
        var states = this.phone.channelStates;
        var left = _.reject(this.competitors, (item)=>item.channelState==states.MCAS_CHANNEL_STATE_EXIT||item.userID==app.personal.info.userID);
        if (!left.length) {
            this.closeSocket();
            this.emit("EVENT_ALL_OTHERS_LEFT_ROOM");
            return;
        }
        if (preState == states.MCAS_CHANNEL_STATE_SPEAKERING) {
            var speaker = _.find(this.competitors, (item)=>item.channelState==states.MCAS_CHANNEL_STATE_READY);
            if (!speaker) {
                this.submitRoundScoreRank();
            } else if (speaker.userID == app.personal.info.userID) {
                this.status = STATUS_SELF_READY_SPEAK;
                speaker.extraState = EXTRA_STATE_READY_SPEAK;
                this.emit("EVENT_SELF_READY_SPEAK");
            } else {
                this.status = STATUS_WAIT_OTHER_SPEAK;
                speaker.extraState = EXTRA_STATE_READY_SPEAK;
                this.emit("EVENT_WAIT_OTHER_SPEAK", {speaker: speaker});
            }
            return;
        } else if (preState == states.MCAS_CHANNEL_STATE_READY) {
            var seatNumber = competitor.seatNumber;
            var front = _.filter(this.competitors, (item)=>item.seatNumber<seatNumber);
            var frontOver = true;
            _.forEach(front, (item)=>{
                if (item.channelState==states.MCAS_CHANNEL_STATE_READY ||
                    item.channelState==states.MCAS_CHANNEL_STATE_SPEAKERING) {
                        frontOver = false;
                    }
            });
            if (frontOver) {
                if (this.status == STATUS_WAIT_OTHER_SPEAK) {
                    var speaker = _.find(this.competitors, (item)=>item.channelState==states.MCAS_CHANNEL_STATE_READY);
                    if (!speaker) {
                        this.submitRoundScoreRank();
                    } else if (speaker.userID == app.personal.info.userID) {
                        this.status = STATUS_SELF_READY_SPEAK;
                        speaker.extraState = EXTRA_STATE_READY_SPEAK;
                        this.emit("EVENT_SELF_READY_SPEAK");
                    } else {
                        this.status = STATUS_WAIT_OTHER_SPEAK;
                        speaker.extraState = EXTRA_STATE_READY_SPEAK;
                        this.emit("EVENT_WAIT_OTHER_SPEAK", {speaker: speaker});
                    }
                    return;
                }
            }
        }
        if (this.status == STATUS_WAIT_COUNT_GRADE) {
            this.checkEveryOneGrade(this.gradeList[this.gradeUserID]);
        }
        this.emit("EVENT_COMPETITOR_EXIT");
    }
    dealWithCompetitorsGrade(userID, gradeUserID, gradeCount) {
        if (this.gradeUserID != gradeUserID) {
            return this.onServerError("打分的对象错误");
        }
        var competitorGrades = this.gradeList[gradeUserID];
        if (!competitorGrades) {
            competitorGrades = this.gradeList[gradeUserID] = [];
        }
        competitorGrades.push({userID:userID, gradeCount:gradeCount});
        _.find(this.competitors, (item)=>item.userID==userID).extraState = EXTRA_STATE_GRADED;
        this.emit("EVENT_STATUS_CHANGE");
        this.checkEveryOneGrade(competitorGrades);
    }
    checkEveryOneGrade(competitorGrades) {
        var states = this.phone.channelStates;
        //去除已经打分的人和本人，如果剩下的人全部为离线或者没有剩下的人就说明打分结束
        var left = _.reject(this.competitors, (item)=> {
            return (!!_.find(competitorGrades, (p)=>item.userID==p.userID)) || item.userID==this.gradeUserID;
        });
        var allGrade = _.every(left, (item)=>item.channelState==states.MCAS_CHANNEL_STATE_EXIT);
        if (allGrade) {
            _.map(this.competitors, (item)=>item.extraState = null);
            var speaker = _.find(this.competitors, (item)=>item.channelState==states.MCAS_CHANNEL_STATE_READY);
            if (!speaker) {
                this.submitRoundScoreRank();
            } else if (speaker.userID == app.personal.info.userID) {
                this.status = STATUS_SELF_READY_SPEAK;
                speaker.extraState = EXTRA_STATE_READY_SPEAK;
                this.emit("EVENT_SELF_READY_SPEAK");
            } else {
                this.status = STATUS_WAIT_OTHER_SPEAK;
                speaker.extraState = EXTRA_STATE_READY_SPEAK;
                this.emit("EVENT_WAIT_OTHER_SPEAK", {speaker: speaker});
            }
        } else {
            this.status = STATUS_WAIT_COUNT_GRADE;
        }
    }
    submitRoundScoreRank() {
        var scoreList = [];

        _.mapValues(this.gradeList, (list, userID)=>{
            var scores = _.map(list, (item)=>item.gradeCount);
            var n = scores.length||1;
            var sum = _.sum(scores);
            var score = (parseInt(Math.round(sum/n*10))/10)||0;
            scoreList.push({userID:userID, sum:sum, score:score});
        });
        scoreList = _.map(sortByOrder(scoreList, ['score', 'sum'], ['desc', 'desc']), (p, i)=>{
            p.rank=i+1;
            delete p.sum;
            return p;
        });
        console.log("scoreList", scoreList);
        var rankList = _.map(scoreList, (item)=>{
            var speaker = _.find(this.competitors, (p)=>item.userID==p.userID);
            return Object.assign({}, speaker, item);
        });

        console.log("rankList", rankList);
        this.status = STATUS_SHOW_TOTAL_GRADE;
        this.emit("EVENT_SHOW_TOTAL_GRADE_PANEL", {rankList: rankList});
        console.log('-------------',rankList);
        var param = {
            roomID:this.chatroomID,
            trainingID:this.trainingID,
            round: this.round,
            scoreList:scoreList
        };
        console.log(param);
        POST(app.route.ROUTE_SUBMIT_SCORE, param, (data)=>{console.log(data)});
    }
    setMySelfWait() {
        _.find(app.phoneMgr.competitors, (item)=>item.userID==app.personal.info.userID).extraState = EXTRA_STATE_WAIT_RESTART;
    }
    //meeting
    onMeetingRoomRequest(data) {
        if (data.functionName == this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_JOINCHATROOM) {
            this.onJoinMeetingRoom(data);
        } else if (data.functionName == this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_EXITCHATROOM) {
            this.onExitMeetingRoom(data);
        } else if (data.functionName == this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_MATCH_JOINCHATROOM) {
            this.onjoinroom(data);
        }
    }
    joinMeetingRoom() {
        var info = app.personal.info;
        this.status = STATUS_MEET_START_JOINING;
        this.competitors = [];
        var userInfo = {
            userImg: info.headImg,
            userName: info.name||app.login.list[0],
            userLevel: info.level,
            userAlias: info.alias,
        };
        this.phone.request(JSON.stringify({
            chatroomNumber: this.meetingRoom.roomNO,
            maxUserCount: this.meetingRoom.totalNumber,
            maxSpeakerCount: 1,
            userID: info.userID,
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_JOINCHATROOM,
            userInfo: JSON.stringify(userInfo)
        }));
        console.log('joinMeetingRoom', info.userID, userInfo);
    }
    onJoinMeetingRoom(data) {
        if (this.handleError(data.result)) {
            return;
        }
        var states = this.phone.meetChannelStates;
        var allUserIDState;
        try {
            allUserIDState = JSON.parse(data.allUserIDState);
        } catch (e) {
            return this.onServerError("解析JSON错误");
        }
        console.log('onJoinMeetingRoom', allUserIDState);
        var stateCount = allUserIDState.stateCount;
        var list = allUserIDState.userIDArray;
        var myUserID = app.personal.info.userID;
        _.forEach(list, (item)=>{
            try {
                item.userInfo = JSON.parse(item.userInfo);
            } catch(e) {
                this.status = STATUS_SERVER_INFO_ERROR;
            }
        });
        if (this.status === STATUS_SERVER_INFO_ERROR) {
            return this.onServerError("解析 userInfo JSON 失败");
        }
        this.competitors = this.competitors.concat(list);
        var myself = _.find(list, (item)=>item.userID==myUserID);
        if (!myself) {
            return this.onServerError("开会列表没有自己");
        }
        this.adminUserID = allUserIDState.adminUserID;
        if (myself.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_LISTENING) {
            this.status = STATUS_MEET_LISTENING;
        } else {
            this.status = STATUS_MEET_SPEAKING;
        }
        this.emit("EVENT_MEET_UPDATE_USERLIST", {start: true});
        this.submitOnlinePerson();
    }
    onMeetingStateChange(userID, meetChannelState) {
        console.log('onMeetingStateChange');
        if (this.status === STATUS_MEET_START_JOINING) {
            return;
        }
        var competitor = _.find(this.competitors, (item)=>item.userID==userID);
        if (competitor) {
            competitor.meetChannelState = meetChannelState;
            this.dealWithMeetingStateChange(competitor, meetChannelState);
        }
    }
    onNewPersonJoin(userID, meetChannelState, userInfo) {
        if (userID === app.personal.info.userID) {
            return;
        }
        try {
            userInfo = JSON.parse(userInfo);
        } catch(e) {
            return this.onServerError("解析 userInfo JSON 失败");
        }
        if (!_.find(this.competitors, (item)=>{item.userID==userID})) {
            this.competitors.push({userID:userID, meetChannelState:meetChannelState, userInfo:userInfo});
            this.emit("EVENT_MEET_UPDATE_USERLIST");
        }
    }
    dealWithMeetingStateChange(competitor, curState) {
        var myUserID = app.personal.info.userID;
        var states = this.phone.meetChannelStates;
        if (competitor.userID == myUserID) {
            if (curState == states.MCAS_CHANNEL_MEET_STATE_LISTENING) {
                this.status = STATUS_MEET_LISTENING;
            } else if (curState == states.MCAS_CHANNEL_MEET_STATE_SPEAKING) {
                this.status = STATUS_MEET_SPEAKING;
            } else if (curState == states.MCAS_CHANNEL_MEET_STATE_OFFLINE) {
                this.emit("EVENT_YOUR_ARE_KICKED");
                Toast("你被房主踢出了房间");
            }
        } else {
            if (curState == states.MCAS_CHANNEL_MEET_STATE_OFFLINE) {
                Toast(competitor.userInfo.userName+'离开了房间');
                _.remove(this.competitors, (item)=>item.userID==competitor.userID);
                if (this.adminUserID == app.personal.info.userID) {
                    this.submitOnlinePerson();
                }
            }
        }
        this.emit("EVENT_MEET_UPDATE_USERLIST");
    }
    onMeetingAdminChange(userID) {
        console.log('onMeetingAdminChange');
        if (_.find(this.competitors, (item)=>item.userID==userID)) {
            this.adminUserID = userID;
            this.emit("EVENT_MEET_UPDATE_USERLIST");
        }
    }
    exitMeetingRoom() {
        console.log('exitMeetingRoom');
        this.phone.request(JSON.stringify({
            chatroomNumber: this.meetingRoom.roomNO,
            userID: app.personal.info.userID,
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_EXITCHATROOM,
        }));
    }
    onExitMeetingRoom(data) {
        console.log('onExitMeetingRoom');
        this.status = STATUS_NONE;
        if (this.competitors.length === 1) {
            this.submitOnlinePerson(0);
        }
    }
    meetingApplySpeak() {
        console.log('meetingApplySpeak');
        this.status = STATUS_MEET_APPLY_SPEAKING;
        this.phone.request(JSON.stringify({
            chatroomNumber: this.meetingRoom.roomNO,
            userID: app.personal.info.userID,
            message: this.phone.meetMessages.MCAS_MEET_MESSAGE_APPLY_SPEAK,
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_MEET_MESSAGE_PROCESS,
        }));
    }
    meetingCancelApplySpeak() {
        console.log('meetingCancelApplySpeak');
        this.status = STATUS_MEET_LISTENING;
        this.phone.request(JSON.stringify({
            chatroomNumber: this.meetingRoom.roomNO,
            userID: app.personal.info.userID,
            message: this.phone.meetMessages.MCAS_MEET_MESSAGE_CANCEL_APPLY_SPEAK,
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_MEET_MESSAGE_PROCESS,
        }));
    }
    meetingBeginSpeak(userID) {
        console.log('meetingBeginSpeak');
        this.phone.request(JSON.stringify({
            chatroomNumber: this.meetingRoom.roomNO,
            userID: userID,
            message: this.phone.meetMessages.MCAS_MEET_MESSAGE_BEGIN_SPEAK,
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_MEET_MESSAGE_PROCESS,
        }));
    }
    meetingEndSpeak(userID) {
        console.log('meetingEndSpeak');
        if (userID == app.personal.info.userID) {
            this.status = STATUS_MEET_START_END_SPEAK;
        }
        this.phone.request(JSON.stringify({
            chatroomNumber: this.meetingRoom.roomNO,
            userID: userID,
            message: this.phone.meetMessages.MCAS_MEET_MESSAGE_END_SPEAK,
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_MEET_MESSAGE_PROCESS,
        }));
    }
    meetingKickUser(userID) {
        console.log('meetingKickUser');
        this.phone.request(JSON.stringify({
            chatroomNumber: this.meetingRoom.roomNO,
            userID: userID,
            message: this.phone.meetMessages.MCAS_MEET_MESSAGE_KICK_USER,
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_MEET_MESSAGE_PROCESS,
        }));
    }
    meetingChangeAdmin(userID) {
        console.log('meetingChangeAdmin');
        this.phone.request(JSON.stringify({
            chatroomNumber: this.meetingRoom.roomNO,
            userID: userID,
            message: this.phone.meetMessages.MCAS_MEET_MESSAGE_ADMIN,
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_MEET_MESSAGE_PROCESS,
        }));
    }
    meetingCloseRoom() {
        console.log('meetingCloseRoom');
        this.phone.request(JSON.stringify({
            chatroomNumber: this.meetingRoom.roomNO,
            userID: app.personal.info.userID,
            message: this.phone.meetMessages.MCAS_MEET_MESSAGE_CHATROOM_CLOSE,
            functionName: this.phone.meetFunctions.MCAS_REQUEST_FUNCTION_MEET_MESSAGE_PROCESS,
        }));
    }
    submitOnlinePerson(number) {
        var param = {
            roomID:this.meetingRoom.id,
            peopleNum:number==null?this.competitors.length:number,
        };
        console.log('submitOnlinePerson', param);
        POST(app.route.ROUTE_SUBMIT_ONLINE_PERSON, param, (data)=>{console.log(data)});
    }
    deviceNetOffline(){
        this.closeSocket();
        this.emit("EVENT_DEVICE_NET_OFFLINE");
    }
}
module.exports = new Manager();
