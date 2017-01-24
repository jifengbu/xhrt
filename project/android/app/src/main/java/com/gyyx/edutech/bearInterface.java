package com.gyyx.edutech;

import android.content.Context;
import android.util.Log;

public class bearInterface {
	
	  public native int audioProcessNS(short[] buffer_in, int samples, short[] buffer_out);
	  
	  public native int setParam(String serverIP, int serverPort, Context appContext, Object callback);
	  
	  public native int joinChatroom(String userID, String chatroomID);
	  public native int exitChatroom(String userID, String chatroomID);
	  public native int setMessageToServer(String userID, String chatroomID, int message);
	  public native int matchingChatroom(String userID);
	  public native int setGradeToServer(String userID, String chatroomID, String gradeUserID, int gradeCount);
	  public native int request(String requestJson);

	  public native int pausePlayout();
	  public native int resumePlayout();
	  
	  public native int pauseRecord();
	  public native int resumeRecord();

	  static {
		  Log.v("webrtc-java", "System.loadLibrary(webrtcx)");
	      System.loadLibrary("webrtcx");
	  }
}
