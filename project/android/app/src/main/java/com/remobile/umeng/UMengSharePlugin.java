package com.remobile.umeng;

import android.app.Activity;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;


import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.umeng.socialize.Config;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UMengSharePlugin extends ReactContextBaseJavaModule  implements ActivityEventListener {
    public static String FLOG_TAG = "RCTUmeng";
    private Activity activity;
    private Callback mCallback;

    public UMengSharePlugin(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        this.activity = activity;

        PlatformConfig.setWeixin("wx18d0597c9febcd0d", "ef5d8db44f1954463b7e4ba86a908784");
       PlatformConfig.setQQZone("1105204262", "fELEobxl728L2MDl");
        // PlatformConfig.setQQZone("100424468", "c7394704798a158208a74ab60104f0ba");

        // PlatformConfig.setSinaWeibo("3921700954", "04b48b094faeb16683c32669824ebdad");
//        PlatformConfig.setAlipay("2015111700822536");
    }

    @Override
    public String getName() { return "Umeng"; }

    @Override
    public void initialize() {
        super.initialize();
        getReactApplicationContext().addActivityEventListener(this);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        final Map<String, Object> platforms = new HashMap<>();
        platforms.put("UMShareToSina", SHARE_MEDIA.SINA.toString());// 新浪微博
        platforms.put("UMShareToTencent", SHARE_MEDIA.TENCENT.toString());// 腾讯微博
        platforms.put("UMShareToQzone", SHARE_MEDIA.QZONE.toString());// QQ空间
        platforms.put("UMShareToEmail", SHARE_MEDIA.EMAIL.toString());// 邮箱
        platforms.put("UMShareToSms", SHARE_MEDIA.SMS.toString());// 短信
        platforms.put("UMShareToWechatSession", SHARE_MEDIA.WEIXIN.toString());// 微信好友
        platforms.put("UMShareToWechatTimeline", SHARE_MEDIA.WEIXIN_CIRCLE.toString());// 微信朋友圈
        platforms.put("UMShareToWechatFavorite", SHARE_MEDIA.WEIXIN.toString());// 微信收藏
        platforms.put("UMShareToAlipaySession", SHARE_MEDIA.ALIPAY.toString());// 支付宝好友
        platforms.put("UMShareToQQ", SHARE_MEDIA.QQ.toString());// 手机QQ
        constants.put("platforms", platforms);
        constants.put("isWeixinInstalled", isWeixinAvilible(getReactApplicationContext()));
        constants.put("isQQInstalled", isQQClientAvailable(getReactApplicationContext()));
        return constants;
    }

    public static boolean isWeixinAvilible(Context context) {
        final PackageManager packageManager = context.getPackageManager();// 获取packagemanager
        List<PackageInfo> pinfo = packageManager.getInstalledPackages(0);// 获取所有已安装程序的包信息
        if (pinfo != null) {
            for (int i = 0; i < pinfo.size(); i++) {
                String pn = pinfo.get(i).packageName;
                if (pn.equals("com.tencent.mm")) {
                    return true;
                }
            }
        }

        return false;
    }

    public static boolean isQQClientAvailable(Context context) {
        final PackageManager packageManager = context.getPackageManager();
        List<PackageInfo> pinfo = packageManager.getInstalledPackages(0);
        if (pinfo != null) {
            for (int i = 0; i < pinfo.size(); i++) {
                String pn = pinfo.get(i).packageName;
                if (pn.equals("com.tencent.mobileqq")) {
                    return true;
                }
            }
        }
        return false;
    }

    @ReactMethod
    public void shareWithActionSheet(final ReadableMap args, final Callback callback) {

        final String text = args.getString("text");
        final String title = args.getString("title");
        final String url = args.getString("url");
            mCallback = callback;
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        UMImage img = new UMImage(activity,
                                args.getString("imageUrl"));
                        ShareProgressDialog dialog =  new ShareProgressDialog(activity);
                        Config.dialog = dialog;
                        new ShareAction(activity)
                                .setDisplayList(
                                        SHARE_MEDIA.EMAIL,
                                        SHARE_MEDIA.SMS,
                                        SHARE_MEDIA.WEIXIN,
                                        SHARE_MEDIA.WEIXIN_CIRCLE,
                                        SHARE_MEDIA.QQ,
                                        SHARE_MEDIA.QZONE
                                )
                                .withMedia(img)
                                .setCallback(umShareListener)
                                .withText(text)
                                .withTitle(title)
                                .withTargetUrl(url)
                                .open();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                }
            });


    }

    @ReactMethod
    public void shareSingle(final String platfrom, final ReadableMap args, final Callback callback) {

        final String text = args.getString("text");
        final String title = args.getString("title");
        final String url = args.getString("url");
//        UmengTool.checkWx(activity);
            mCallback = callback;
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                    UMImage img = new UMImage(activity,
                            args.getString("imageUrl"));
                    ShareProgressDialog dialog =  new ShareProgressDialog(activity);
                    Config.dialog = dialog;
                    new ShareAction(activity)
                            .setPlatform(SHARE_MEDIA.convertToEmun(platfrom))
                            .withMedia(img)
                            .setCallback(umShareListener)
                            .withText(text)
                            .withTitle(title)
                            .withTargetUrl(url)
                            .share();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });


    }

    private UMShareListener umShareListener = new UMShareListener() {
        @Override
        public void onResult(SHARE_MEDIA platform) {
            WritableMap params = Arguments.createMap();
            params.putBoolean("success", true);
            mCallback.invoke(params);
        }

        @Override
        public void onError(SHARE_MEDIA platform, Throwable t) {
            WritableMap params = Arguments.createMap();
            params.putBoolean("success", false);
            params.putBoolean("cancel", false);
            mCallback.invoke(params);
        }

        @Override
        public void onCancel(SHARE_MEDIA platform) {
            WritableMap params = Arguments.createMap();
            params.putBoolean("success", false);
            params.putBoolean("cancel", true);
            mCallback.invoke(params);
        }
    };

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        UMShareAPI.get(this.activity).onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
