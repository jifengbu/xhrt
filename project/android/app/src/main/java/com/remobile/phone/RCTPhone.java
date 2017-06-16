package com.remobile.phone;

import android.app.Activity;
import android.content.Context;
import android.media.AudioManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.gyyx.edutech.bearIFCallback;
import com.gyyx.edutech.bearInterface;
import com.gyyx.edutech.bearViewInterface;


public class RCTPhone extends ReactContextBaseJavaModule implements bearViewInterface {
    public static final String EVENT_ON_JOIN_ROOM = "EVENT_ON_JOIN_ROOM";
    public static final String EVENT_ON_EXIT_ROOM = "EVENT_ON_EXIT_ROOM";
    public static final String EVENT_ON_CONNECT = "EVENT_ON_CONNECT";
    public static final String EVENT_ON_DISCONNECT = "EVENT_ON_DISCONNECT";
    public static final String EVENT_ON_BROADCAST = "EVENT_ON_BROADCAST";
    public static final String EVENT_ON_SEND_MESSAGE = "EVENT_ON_SEND_MESSAGE";
    public static final String EVENT_ON_MATCHING_ROOM = "EVENT_ON_MATCHING_ROOM";
    public static final String EVENT_ON_SET_GRADE = "EVENT_ON_SET_GRADE";
    public static final String EVENT_ON_REQUEST = "EVENT_ON_REQUEST";

    public static final String FLOG_TAG = "RCTPhone";


    private Activity activity;
    // private bearInterface bear;
    // private bearIFCallback bearCallback;
    private int currVolume;

    public RCTPhone(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        this.activity = activity;
        // bear = new bearInterface();
        // bearCallback = new bearIFCallback(this);
    }

    @Override
    public String getName() {
        return "Phone";
    }

    @ReactMethod
    public void connectAudioServer(ReadableMap args) {
        String serverIP = args.getString("serverIP");
        int serverPort = args.getInt("serverPort");
        // bear.setParam(serverIP, serverPort, activity.getApplicationContext(), bearCallback);
    }

    @ReactMethod
    public int joinChatroom(ReadableMap args) {
        String options = args.getString("options");
        String chatroomID = args.getString("chatroomID");

        // return bear.joinChatroom(options, chatroomID);
        return 0;
    }

    @ReactMethod
    public int exitChatroom(ReadableMap args) {
        String userID = args.getString("userID");
        String chatroomID = args.getString("chatroomID");
        // return bear.exitChatroom(userID, chatroomID);
        return 0;
    }

    @ReactMethod
    public int setMessageToServer(ReadableMap args) {
        String userID = args.getString("userID");
        String chatroomID = args.getString("chatroomID");
        int message = args.getInt("message");

        // return bear.setMessageToServer(userID, chatroomID, message);
        return 0;
    }

    @ReactMethod
    public int matchingChatroom(ReadableMap args) {
        String options = args.getString("options");

        // return bear.matchingChatroom(options);
        return 0;
    }

    @ReactMethod
    public int setGradeToServer(ReadableMap args) {
        String userID = args.getString("userID");
        String chatroomID = args.getString("chatroomID");
        String gradeUserID = args.getString("gradeUserID");
        int gradeCount = args.getInt("gradeCount");

        // return bear.setGradeToServer(userID, chatroomID, gradeUserID, gradeCount);
        return 0;
    }

    @ReactMethod
    public int pausePlayout() {
        // return bear.pausePlayout();
        return 0;
    }

    @ReactMethod
    public int resumePlayout() {
        // return bear.resumePlayout();
        return 0;
    }

    @ReactMethod
    public int pauseRecord() {
        // return bear.pauseRecord();
        return 0;
    }

    @ReactMethod
    public int resumeRecord() {
        // return bear.resumeRecord();
        return 0;
    }

    @ReactMethod
    public int speakerOn() {
        try {
            AudioManager audioManager =	(AudioManager) activity.getSystemService(Context.AUDIO_SERVICE);
            audioManager.setMode(AudioManager.ROUTE_SPEAKER);
            currVolume = audioManager.getStreamVolume(AudioManager.STREAM_VOICE_CALL);
            if(!audioManager.isSpeakerphoneOn()) {
                audioManager.setSpeakerphoneOn(true);
                audioManager.setStreamVolume(AudioManager.STREAM_VOICE_CALL,
                        audioManager.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL ),
                        AudioManager.STREAM_VOICE_CALL);

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }

    @ReactMethod
    public int speakerOff() {
        try {
            AudioManager audioManager =	(AudioManager) activity.getSystemService(Context.AUDIO_SERVICE);
            audioManager.setMode(AudioManager.MODE_IN_CALL);
            if(audioManager.isSpeakerphoneOn()) {
                audioManager.setSpeakerphoneOn(false);
                audioManager.setStreamVolume(AudioManager.STREAM_VOICE_CALL,currVolume, AudioManager.STREAM_VOICE_CALL);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }
    @ReactMethod
    public int request(String data) {
        // return bear.request(data);
        return 0;
    }

    public int onJoinChatroomRS(final int result, final String chatroomID, final String userID) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                WritableMap params = Arguments.createMap();
                params.putInt("result", result);
                params.putString("chatroomID", chatroomID);
                params.putString("userID", userID);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_ON_JOIN_ROOM, params);
            }
        });
        return 1;
    }
    public int onExitChatroomRS(final int result, final String chatroomID, final String userID) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                WritableMap params = Arguments.createMap();
                params.putInt("result", result);
                params.putString("chatroomID", chatroomID);
                params.putString("userID", userID);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_ON_EXIT_ROOM, params);
            }
        });
        return 1;
    }
    public int onAudioServerConnect() {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_ON_CONNECT, true);
            }
        });
        return 1;
    }
    public int onAudioServerDisconnect() {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_ON_DISCONNECT, true);
            }
        });
        return 1;
    }

    public int onAudioServerBroadcast(final String resultJson) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_ON_BROADCAST, resultJson);
            }
        });
        return 1;
    }
    public int onSendMessageToServerRS(final int result, final int message) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                WritableMap params = Arguments.createMap();
                params.putInt("result", result);
                params.putInt("message", message);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_ON_SEND_MESSAGE, params);
            }
        });
        return 1;
    }
    public int onMatchingChatroomRS(final int result, final String chatroomID, final String userID) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                WritableMap params = Arguments.createMap();
                params.putInt("result", result);
                params.putString("chatroomID", chatroomID);
                params.putString("userID", userID);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_ON_MATCHING_ROOM, params);
            }
        });
        return 1;
    }
    public int onSetGradeToServerRS(final int result) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                WritableMap params = Arguments.createMap();
                params.putInt("result", result);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_ON_SET_GRADE, params);
            }
        });
        return 1;
    }
    public int onRequestRS(final int result, final String resultJson)
    {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                WritableMap params = Arguments.createMap();
                params.putInt("result", result);
                params.putString("data", resultJson);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_ON_REQUEST, params);
            }
        });
        return 1;
    }
}
