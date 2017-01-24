package com.gyyx.edutech;

import android.util.Log;

public class bearIFCallback {
	
	private bearViewInterface _interface;

	public bearIFCallback(bearViewInterface inter)  {
		_interface = inter;
	}
	
	public void onJoinChatroomRS(int result, String chatroomID, String userID) {
		Log.v("webrtc-java", "onJoinChatroomRS");
		_interface.onJoinChatroomRS(result, chatroomID, userID);

	}
	public void onExitChatroomRS(int result, String chatroomID, String userID) {
		Log.v("webrtc-java", "onExitChatroomRS");
		_interface.onExitChatroomRS(result, chatroomID, userID);
	}
    public void onAudioServerConnect() {
		Log.v("webrtc-java", "onAudioServerConnect");
		_interface.onAudioServerConnect();
	}
	public void onAudioServerDisconnect() {
		Log.v("webrtc-java", "onAudioServerDisconnect");
		_interface.onAudioServerDisconnect();
	}

	public void onAudioServerBroadcast(String resultJson) {
		Log.v("webrtc-java", "onAudioServerBroadcast, json is " + resultJson);
		_interface.onAudioServerBroadcast(resultJson);
	}
	public void onSendMessageToServerRS(int result, int message) {
		Log.v("webrtc-java", "onSendMessageToServerRS result is "+result+"message is "+message);
		_interface.onSendMessageToServerRS(result, message);
	}
	public void onMatchingChatroomRS(int result, String chatroomID, String userID) {
		Log.v("webrtc-java", "onMatchingChatroomRS chatroomid is " + chatroomID + "userID is " + userID);

		_interface.onMatchingChatroomRS(result, chatroomID, userID);
	}

	public void onSetGradeToServerRS(int result)
	{
		Log.v("webrtc-java", "onSetGradeToServerRS result is " + result);
		_interface.onSetGradeToServerRS(result);
	}

	public void onRequestRS(int result, String resultJson)
	{
		Log.v("webrtc-java", "onRequestRS" + resultJson);
		_interface.onRequestRS(result, resultJson);
	}
}
