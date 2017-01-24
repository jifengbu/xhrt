package com.remobile.vhall;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.graphics.SurfaceTexture;
import android.text.TextUtils;
import android.view.Surface;
import android.view.SurfaceView;
import android.view.TextureView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.vhall.netbase.constants.ZReqEngine;
import com.vhall.playersdk.player.TimeRange;
import com.vhall.playersdk.player.chunk.Format;
import com.vhall.playersdk.player.impl.HlsRendererBuilder;
import com.vhall.playersdk.player.impl.VhallHlsPlayer;
import com.vhall.playersdk.player.util.Util;

import org.json.JSONException;
import org.json.JSONObject;


public class RCTVhallPlayerView extends TextureView implements ZReqEngine.FlashMsgListener {
    private String videoId;
    private String appKey;
    private String appSecretKey;
    private String name;
    private String email;
    private String password;
    private boolean isSetSurface = false;
    private SurfaceTexture mSurface;

    private  Activity activity;
    private ThemedReactContext context;
    private static final String TAG = "RCTVhallPlayerView";
    private VhallHlsPlayer mMediaPlayer;
    private ZReqEngine.Attend attend;// 参会 用于统计参与人数 接收文档 聊天等即时消息
    private VhallPlayerListener mVhallPlayerListener;
    private hlsSampleInfoListener mHlsSampleInfoListener;

    // 文档信息 获取文档拼接Path host + "/" + doc + "/" + page + ".jpg"
    private String host = null;// 文档根路径(获取视频信息时返回 )
    private int type = 0;// 界面布局1为单视频，2为单文档(语音 + 文档)，3为文档+视频

    public enum Events {
        EVENT_ON_DOC_FLASH("onDocFlash"),
        EVENT_ON_STATE_CHANGE("onStateChange"),
        EVENT_ON_PLAY_ERROR("onPlayError");

        private final String _name;
        Events(final String name) {
            _name = name;
        }
        public String getName() {
            return _name;
        }
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    public void setAppKey(String appKey) {
        this.appKey = appKey;
    }

    public void setAppSecretKey(String appSecretKey) {
        this.appSecretKey = appSecretKey;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        startMediaPlayer();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        releaseMediaPlayer();
    }

    public RCTVhallPlayerView(ThemedReactContext reactContext, Activity activity) {
        super(reactContext);
        this.context = reactContext;
        this.activity = activity;
        setSurfaceTextureListener(mSurfaceTextureListener);
    }

    TextureView.SurfaceTextureListener mSurfaceTextureListener = new SurfaceTextureListener() {
        @Override
        public void onSurfaceTextureSizeChanged(final SurfaceTexture surface, final int width, final int height) {
            if (mMediaPlayer != null) {
                mMediaPlayer.start();
            }
        }

        @Override
        public void onSurfaceTextureAvailable(final SurfaceTexture surface, final int width, final int height) {
            mSurface = surface;
            if (mMediaPlayer != null) {
                isSetSurface = true;
                mMediaPlayer.setSurface(new Surface(mSurface));
                mMediaPlayer.start();
            }
        }

        @Override
        public boolean onSurfaceTextureDestroyed(final SurfaceTexture surface) {
            mSurface = null;
            return false;
        }

        @Override
        public void onSurfaceTextureUpdated(final SurfaceTexture surface) {
        }
    };


    private void onDocFlash(int type, String doc, int page) {
        String path = host + "/" + doc + "/" + page + ".jpg";
        final WritableMap event = Arguments.createMap();
        event.putInt("type", type);
        event.putString("path", path);

        context.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                context.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        Events.EVENT_ON_DOC_FLASH.getName(),
                        event);
            }
        });
    }

    private void onStateChange(int state) {
        final WritableMap event = Arguments.createMap();
        event.putInt("state", state);

        context.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                context.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        Events.EVENT_ON_STATE_CHANGE.getName(),
                        event);
            }
        });
    }

    private void onPlayError(String error) {
        final WritableMap event = Arguments.createMap();
        event.putString("error", error);

        context.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                context.getJSModule(RCTEventEmitter.class).receiveEvent(
                        getId(),
                        Events.EVENT_ON_STATE_CHANGE.getName(),
                        event);
            }
        });
    }
    /**
     * 创建播放器,并播放
     *
     */
    private void startMediaPlayer() {
        ZReqEngine.watch(videoId, appKey, appSecretKey, name, email, password, new ZReqEngine.ReqCallback() {
            @Override
            public void OnSuccess(final String data) {
                try {
                    final JSONObject obj = new JSONObject(data);
                    context.runOnUiQueueThread(new Runnable() {
                        @Override
                        public void run() {
                            startMediaPlayer(obj);
                        }
                    });
                } catch (JSONException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    releaseMediaPlayer();
                }
            }

            @Override
            public void OnFail(final String errorMsg) {
            }
        });
    }

    private void startMediaPlayer(JSONObject obj) {
        String video = obj.optString("video");
        int status = obj.optInt("status");// 1 直播2 预约3 结束4 回放
        String msg_server = obj.optString("msg_server");
        String msg_token = obj.optString("msg_token");

        host = obj.optString("host");// 文档根路径
        type = obj.optInt("layout");// 界面布局1为单视频，2为单文档(语音 + 文档)，3为文档+视频
        String doc = obj.optString("doc");// 文档名称(直播)
        int page = obj.optInt("page");// 文档当前页码(直播)
        String docurl = obj.optString("docurl");// 文档 （ppt img）地址

        if (!TextUtils.isEmpty(msg_server) && !TextUtils.isEmpty(msg_token)) {
            attend = new ZReqEngine().new Attend(msg_server, msg_token);
            attend.setFlashMsgListener(this);
        }
        onDocFlash(type, doc, page);
        String userAgent = Util.getUserAgent(context, "yxjqd");
        mVhallPlayerListener = new VhallPlayerListener();
        HlsRendererBuilder builder = new HlsRendererBuilder(context, userAgent, video);
        mMediaPlayer = new VhallHlsPlayer(builder);
        mHlsSampleInfoListener = new hlsSampleInfoListener();
        mMediaPlayer.addListener(mVhallPlayerListener);
        mMediaPlayer.setInfoListener(mHlsSampleInfoListener);
        mMediaPlayer.prepare();
        if (!isSetSurface && mSurface != null) {
            mMediaPlayer.setSurface(new Surface(mSurface));
        }
        mMediaPlayer.setPlayWhenReady(true);

        if (attend != null) {
            attend.attend(); // 参会
        }
    }

    /**
     * 释放播放器
     */
    private void releaseMediaPlayer() {
        if (attend != null) {
            attend.disAttend();
        }
        if (mMediaPlayer != null) {
            mMediaPlayer.release();
            mMediaPlayer = null;
        }
    }


    @Override
    public void onFlash(String flashMsg) {
        JSONObject obj;
        try {
            obj = new JSONObject(flashMsg);
            String doc = obj.optString("doc");
            int page = obj.optInt("page");// 当前页
            onDocFlash(type, doc, page);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * 自定义播放器监听事件处理
     */

    private class VhallPlayerListener implements VhallHlsPlayer.Listener {
        @Override
        public void onStateChanged(boolean playWhenReady, int playbackState) {
            switch (playbackState) {
                case VhallHlsPlayer.STATE_IDLE:
                    onStateChange(VhallHlsPlayer.STATE_IDLE);
                    break;
                case VhallHlsPlayer.STATE_PREPARING:
                    onStateChange(VhallHlsPlayer.STATE_PREPARING);
                    break;
                case VhallHlsPlayer.STATE_BUFFERING:
                    onStateChange(VhallHlsPlayer.STATE_BUFFERING);
                    break;
                case VhallHlsPlayer.STATE_READY:
                    onStateChange(VhallHlsPlayer.STATE_READY);
                    break;
                case VhallHlsPlayer.STATE_ENDED:
                    onStateChange(VhallHlsPlayer.STATE_ENDED);
                    releaseMediaPlayer();
                    break;
                default:
                    break;
            }
        }
        @Override
        public void onError(Exception e) {
            onPlayError(e.getMessage());
            releaseMediaPlayer();
        }
        @Override
        public void onVideoSizeChanged(int width, int height, int unappliedRotationDegrees, float pixelWidthHeightRatio) {
        }
    }

    private class hlsSampleInfoListener implements VhallHlsPlayer.InfoListener {
        @Override
        public void onAudioFormatEnabled(Format arg0, int arg1, long arg2) {
            // TODO Auto-generated method stub
        }
        @Override
        public void onAvailableRangeChanged(TimeRange arg0) {
            // TODO Auto-generated method stub
        }
        @Override
        public void onBandwidthSample(int arg0, long arg1, long arg2) {
            // TODO Auto-generated method stub
        }
        @Override
        public void onDecoderInitialized(String arg0, long arg1, long arg2) {
            // TODO Auto-generated method stub
        }
        @Override
        public void onDroppedFrames(int arg0, long arg1) {
            // TODO Auto-generated method stub
        }
        @Override
        public void onLoadCompleted(int arg0, long arg1, int arg2, int arg3,
                                    Format arg4, long arg5, long arg6, long arg7, long arg8) {
        }
        @Override
        public void onLoadStarted(int arg0, long arg1, int arg2, int arg3,
                                  Format arg4, long arg5, long arg6) {
        }
        @Override
        public void onVideoFormatEnabled(Format arg0, int arg1, long arg2) {
        }
    }
}
