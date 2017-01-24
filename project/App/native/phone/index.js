'use strict';

var {NativeAppEventEmitter, DeviceEventEmitter, Platform, NativeModules} = require('react-native');
var EventEmitter = Platform.OS==="android"?DeviceEventEmitter:NativeAppEventEmitter;
var RCTPhone = NativeModules.Phone;
var CONSTANTS = {
    "broadcastTypes": {
        "MCAS_BROADCAST_TYPE_CHANNEL_STATE": 1,
        "MCAS_BROADCAST_TYPE_GAME_READY": 4,
        "MCAS_BROADCAST_TYPE_GAME_GRADE": 6,
        "MCAS_BROADCAST_TYPE_EXIT_CHATROOM": 7,
        "MCAS_BROADCAST_TYPE_MEET_SPEAKER_USERID": 101,
        "MCAS_BROADCAST_TYPE_MEET_CHANNEL_STATE": 102,
        "MCAS_BROADCAST_TYPE_MEET_ADMIN_USERID": 103,
        "MCAS_BROADCAST_TYPE_MEET_NEW_CHANNEL": 104,
    },
    "channelStates": {
        "MCAS_CHANNEL_STATE_READY": 1,
        "MCAS_CHANNEL_STATE_SPEAKERING": 2,
        "MCAS_CHANNEL_STATE_SPEAK_FINISH": 3,
        "MCAS_CHANNEL_STATE_EXIT": 4,
    },
    "meetChannelStates": {
        "MCAS_CHANNEL_MEET_STATE_LISTENING": 1,
        "MCAS_CHANNEL_MEET_STATE_APPLYSPEAKING": 2,
        "MCAS_CHANNEL_MEET_STATE_SPEAKING": 3,
        "MCAS_CHANNEL_MEET_STATE_OFFLINE": 4,
    },
    "messages": {
        "MCAS_CHANNEL_GAME_MESSAGE_START": 1,
        "MCAS_CHANNEL_GAME_MESSAGE_STOP": 2,
        "MCAS_CHANNEL_GAME_MESSAGE_RESTART": 4,
    },
    "meetMessages": {
        "MCAS_MEET_MESSAGE_APPLY_SPEAK": 1,
        "MCAS_MEET_MESSAGE_BEGIN_SPEAK": 2,
        "MCAS_MEET_MESSAGE_END_SPEAK":3,
        "MCAS_MEET_MESSAGE_KICK_USER": 4,
        "MCAS_MEET_MESSAGE_ADMIN": 5,
        "MCAS_MEET_MESSAGE_CHATROOM_CLOSE": 6,
        "MCAS_MEET_MESSAGE_CANCEL_APPLY_SPEAK": 7,
    },
    "meetFunctions": {
        "MCAS_REQUEST_FUNCTION_CONNECT_MCAS": "connectMcas",
        "MCAS_REQUEST_FUNCTION_CLOSE_SOCKET": "closeSocket",
        "MCAS_REQUEST_FUNCTION_MATCH_JOINCHATROOM":"matchJoinChatroom",
        "MCAS_REQUEST_FUNCTION_JOINCHATROOM": "joinChatroom",
        "MCAS_REQUEST_FUNCTION_EXITCHATROOM": "exitChatroom",
        "MCAS_REQUEST_FUNCTION_MEET_MESSAGE_PROCESS":"meetMessageProcess",
    },
    "events": {
        "EVENT_ON_JOIN_ROOM": "EVENT_ON_JOIN_ROOM",
        "EVENT_ON_EXIT_ROOM": "EVENT_ON_EXIT_ROOM",
        "EVENT_ON_CONNECT": "EVENT_ON_CONNECT",
        "EVENT_ON_DISCONNECT": "EVENT_ON_DISCONNECT",
        "EVENT_ON_BROADCAST": "EVENT_ON_BROADCAST",
        "EVENT_ON_SEND_MESSAGE": "EVENT_ON_SEND_MESSAGE",
        "EVENT_ON_MATCHING_ROOM": "EVENT_ON_MATCHING_ROOM",
        "EVENT_ON_SET_GRADE": "EVENT_ON_SET_GRADE",
        "EVENT_ON_REQUEST": "EVENT_ON_REQUEST",
    },
};


function registerEvents(callback, type) {
    if (callback) {
        EventEmitter.addListener(CONSTANTS.events[type], function(result){
            callback(result);
        });
    }
}

var Phone = function(params) {
    var {
        onconnect,
        ondisconnect,
        onmatchingroom,
        onjoinroom,
        onexitroom,
        onbroadcast,
        onSendMessage,
        onsetgrade,
        onrequest,
    } = params;

    Object.assign(this, RCTPhone, CONSTANTS);

    registerEvents(onconnect, "EVENT_ON_CONNECT");
    registerEvents(ondisconnect, "EVENT_ON_DISCONNECT");
    registerEvents(onmatchingroom, "EVENT_ON_MATCHING_ROOM");
    registerEvents(onjoinroom, "EVENT_ON_JOIN_ROOM");
    registerEvents(onexitroom, "EVENT_ON_EXIT_ROOM");
    registerEvents(onbroadcast, "EVENT_ON_BROADCAST");
    registerEvents(onSendMessage, "EVENT_ON_SEND_MESSAGE");
    registerEvents(onsetgrade, "EVENT_ON_SET_GRADE");
    registerEvents(onrequest, "EVENT_ON_REQUEST");
};

module.exports = Phone;
