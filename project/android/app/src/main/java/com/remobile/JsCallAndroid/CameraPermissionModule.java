package com.remobile.JsCallAndroid;

import android.app.Activity;
import android.content.Intent;
import android.hardware.Camera;
import android.os.PowerManager;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.remobile.cordova.CordovaPlugin;

public class CameraPermissionModule extends CordovaPlugin {

    public static String FLOG_TAG = "CameraPermissionModule";
    private Activity activity;
    private PowerManager.WakeLock wakeLock;
    private Callback callback;


    public CameraPermissionModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext, true);
        this.activity = activity;
    }

    @Override
    public String getName() {
        return "CameraPermissionModule";
    }

    @ReactMethod
    public void cameraIsCanUse(Callback callback) {
        boolean isCanUse = true;
        Camera mCamera = null;
        try {
            mCamera = Camera.open();
            Camera.Parameters mParameters = mCamera.getParameters(); //针对魅族手机
            mCamera.setParameters(mParameters);
        } catch (Exception e) {
            isCanUse = false;
        }

        if (mCamera != null) {
            try {
                mCamera.release();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        Log.i("zhangtao", "=========="+isCanUse);
        callback.invoke(isCanUse);
    }

}
