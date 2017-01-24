package com.gyyx.edutech;

public interface bearViewInterface {
	public int onJoinChatroomRS(int result, String chatroomID, String userID);
	public int onExitChatroomRS(int result, String chatroomID, String userID);
	public int onAudioServerConnect();
	public int onAudioServerDisconnect();

	public int onAudioServerBroadcast(String resultJson);
	public int onSendMessageToServerRS(int result, int message);
	public int onMatchingChatroomRS(int result, String chatroomID, String userID);
	public int onSetGradeToServerRS(int result);
	public int onRequestRS(int result, String resultJson);
}
