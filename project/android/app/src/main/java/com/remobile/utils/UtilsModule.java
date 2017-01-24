package com.remobile.utils;

import android.Manifest;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.hardware.Camera;
import android.os.Build;
import android.os.PowerManager;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.remobile.cordova.CordovaPlugin;
import com.remobile.cordova.PermissionHelper;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

public class UtilsModule extends CordovaPlugin {

    public static String FLOG_TAG = "UtilsModule";
    private static final String KEY_MIUI_VERSION_CODE = "ro.miui.ui.version.code";
    private static final String KEY_MIUI_VERSION_NAME = "ro.miui.ui.version.name";
    private static final String KEY_MIUI_INTERNAL_STORAGE = "ro.miui.internal.storage";

    private Activity activity;
    private PowerManager.WakeLock wakeLock;
    private Callback callback;


    public UtilsModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext, true);
        this.activity = activity;
    }

    @Override
    public String getName() {
        return "UtilsModule";
    }

    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && !isFlyme()) {
            //魅族手机和5.0以下不设置沉浸式状态栏
            if (isMIUI()) {
                setStatusBarDarkMode(true, activity);
            }
            WindowManager.LayoutParams localLayoutParams = activity.getWindow().getAttributes();
            localLayoutParams.flags = (WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS | localLayoutParams.flags);
            constants.put("isStatusBar", true);
        } else {
            constants.put("isStatusBar", false);
        }

        constants.put("statusBarHeight", getStatusBarHeight());

        return constants;
    }


    public int getStatusBarHeight() {
        int result = 0;
        int resourceId = activity.getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = activity.getResources().getDimensionPixelSize(resourceId);
        }
        return result;
    }

    //设置小米手机状态栏颜色
    public void setStatusBarDarkMode(boolean darkmode, Activity activity) {
        Class<? extends Window> clazz = activity.getWindow().getClass();
        try {
            int darkModeFlag = 0;
            Class<?> layoutParams = Class.forName("android.view.MiuiWindowManager$LayoutParams");
            Field field = layoutParams.getField("EXTRA_FLAG_STATUS_BAR_DARK_MODE");
            darkModeFlag = field.getInt(layoutParams);
            Method extraFlagField = clazz.getMethod("setExtraFlags", int.class, int.class);
            extraFlagField.invoke(activity.getWindow(), darkmode ? darkModeFlag : 0, darkModeFlag);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 小米rom
     * @return
     */
    public boolean isMIUI() {
        try {
            final BuildProperties prop = BuildProperties.newInstance();
            return prop.getProperty(KEY_MIUI_VERSION_CODE, null) != null
                    || prop.getProperty(KEY_MIUI_VERSION_NAME, null) != null
                    || prop.getProperty(KEY_MIUI_INTERNAL_STORAGE, null) != null;
        } catch (final IOException e) {
            return false;
        }
    }

    //设置魅族手机状态栏颜色
    private void processFlyMe(boolean isLightStatusBar) {
        WindowManager.LayoutParams lp= activity.getWindow().getAttributes();
        try {
            Class<?> instance = Class.forName("android.view.WindowManager$LayoutParams");
            int value = instance.getDeclaredField("MEIZU_FLAG_DARK_STATUS_BAR_ICON").getInt(lp);
            Field field = instance.getDeclaredField("meizuFlags");
            field.setAccessible(true);
            int origin = field.getInt(lp);
            if (isLightStatusBar) {
                field.set(lp, origin | value);
            } else {
                field.set(lp, (~value)& origin);
            }
        } catch (Exception ignored) {

        }
    }

    /**
     * 魅族rom
     * @return
     */
    public static boolean isFlyme() {
        try {
            final Method method = Build.class.getMethod("hasSmartBar");
            return method != null;
        } catch (final Exception e) {
            return false;
        }
    }

    @ReactMethod
    public void lockScreen() {
        PowerManager powerManager = (PowerManager)(activity.getSystemService(Context.POWER_SERVICE));
        wakeLock = powerManager.newWakeLock(PowerManager.SCREEN_BRIGHT_WAKE_LOCK, "My Tag");
        wakeLock.acquire();
    }

    @ReactMethod
    public void unlockScreen() {
        if (wakeLock != null) {
            wakeLock.release();
            wakeLock = null;
        }
    }

    @ReactMethod
    public void startChildApp(String pkg, String cls, String param, Callback callback) {
        try {
            ComponentName componet = new ComponentName(pkg, cls);
            Intent intent = new Intent();
            intent.setComponent(componet);
            intent.setAction("android.intent.action.MAIN");
            intent.putExtra("param", param);
            cordova.startActivityForResult((CordovaPlugin)this, intent, 0);
            this.callback = callback;
        } catch (Exception e) {
            callback.invoke(true);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 0) {
            callback.invoke(false);
        }
    }

    @ReactMethod
    public void checkCameraPermission(Callback callback) {
        boolean hasPermission = true;
        Camera mCamera = null;
        try {
            mCamera = Camera.open();
            Camera.Parameters mParameters = mCamera.getParameters(); //针对魅族手机
            mCamera.setParameters(mParameters);
        } catch (Exception e) {
            hasPermission = false;
        }

        if (mCamera != null) {
            try {
                mCamera.release();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        callback.invoke(hasPermission);
    }

}
