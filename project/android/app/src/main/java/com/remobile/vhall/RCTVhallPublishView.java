package com.remobile.vhall;

import android.app.Activity;
import android.graphics.SurfaceTexture;
import android.util.Log;
import android.widget.RelativeLayout;

import com.facebook.react.uimanager.ThemedReactContext;
import com.vhall.business.Broadcast;
import com.vhall.business.VhallSDK;
import com.vhall.business.VhallCameraView;

public class RCTVhallPublishView extends VhallCameraView {
    private static final String TAG = "RCTVhallPublishView";

    private String videoId;
    private String appKey;
    private String appSecretKey;
    private String accessToken;

    private boolean _isInit = false;
    private boolean _isStart = false;
    private boolean _isMute = false;
    private boolean _isFrontCamera = false;
    private int _torchMode = 0;
    private boolean _isFilterOn = false;
    private int _fps = 15;
    private int _videoResolution = 1;
    private int _bitRate = 300;
    private int _connectTimes = 0;
    private int _orgiation = 0;

    private Activity activity;
    private Broadcast broadcast = null;

    public enum Events {
        EVENT_ON_SET_START("onPublishStatus");
        private final String _name;
        Events(final String name) {
            _name = name;
        }
        public String getName() {
            return _name;
        }
    }

    public RCTVhallPublishView(ThemedReactContext reactContext, Activity activity) {
        super(reactContext);
        this.activity = activity;
        this.init(_videoResolution, activity, new RelativeLayout.LayoutParams(0, 0));
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        VhallSDK.init(appKey, appSecretKey);
        VhallSDK.getInstance().setLogEnable(true);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        finishBroadcast();
        _isInit = false;
    }

    @Override
    public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
        super.onSurfaceTextureAvailable(surface, width, height);
        if (!_isInit) {
            if (_isFrontCamera) {
                getBroadcast().changeCamera();
            }
            if (_isMute) {
                getBroadcast().setAudioing(!_isMute);
            }
            if (_torchMode != 0) {
                getBroadcast().changeFlash();
            }
            if (_isStart) {
                startBroadcast();
            }
            _isInit = true;
        } else {

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

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setIsStart(boolean isStart) {
        _isStart = isStart;
        if (_isInit) {
            if (isStart) {
                startBroadcast();
            } else {
                stopBroadcast();
            }
        }
    }

    public void setIsMute(boolean isMute) {
        if (_isMute != isMute) {
            _isMute = isMute;
            if (_isInit) {
                getBroadcast().setAudioing(!isMute);
            }
        }
    }

    public void setIsFrontCamera(boolean isFrontCamera) {
        if (_isFrontCamera != isFrontCamera) {
            _isFrontCamera = isFrontCamera;
            if (_isInit) {
                getBroadcast().changeCamera();
            }
        }
    }

    public void setTorchMode(int torchMode) {
        torchMode = torchMode==1 ? 1 : 0;
        if (_torchMode != torchMode) {
            _torchMode = torchMode;
            if (_isInit) {
                getBroadcast().changeFlash();
            }
        }
    }

    public void setIsFilterOn(boolean isFilterOn) {
        _isFilterOn = isFilterOn;
    }

    public void setFps(int fps) {
        _fps = fps;
    }

    public void setVideoResolution(int videoResolution) {
        _videoResolution = videoResolution==0?1:videoResolution;
    }

    public void setBitRate(int bitRate) {
        _bitRate = bitRate/1000;
    }

    public void setConnectTimes(int connectTimes) {
        _connectTimes = connectTimes;
    }

    public void setOrgiation(int orgiation) {
        _orgiation = orgiation;
    }

    public void startBroadcast() {//发起直播
        if (getBroadcast().isAvaliable()) {
            getBroadcast().start();
        } else {
            VhallSDK.getInstance().initBroadcast(videoId, accessToken, getBroadcast(), new VhallSDK.InitBroadcastCallback() {
                @Override
                public void initBroadcastSuccess() {
                    getBroadcast().start();
                }

                @Override
                public void initBroadcastFailed(String reason) {
                    Log.e(TAG, "finishFailed：" + reason);
                }
            });
        }
    }

    public void stopBroadcast() {//停止直播
        getBroadcast().stop();
    }

    public void finishBroadcast() {
        VhallSDK.getInstance().finishBroadcast(videoId, accessToken, getBroadcast(), new VhallSDK.FinishBroadcastCallback() {
            @Override
            public void finishSuccess() {
                Log.e(TAG, "finishSuccess");
            }

            @Override
            public void finishFailed(String reason) {
                Log.e(TAG, "finishFailed：" + reason);
            }
        });
    }


    private Broadcast getBroadcast() {
        if (broadcast == null) {
            Broadcast.Builder builder = new Broadcast.Builder().cameraView(this).frameRate(_fps).videoBitrate(_bitRate).callback(new Broadcast.BroadcastEventCallback() {
                @Override
                public void startFailed(String reason) {
                    Log.e(TAG, reason);
                }

                @Override
                public void onConnectSuccess() {
                    Log.e(TAG, "连接成功！");
                }

                @Override
                public void onErrorConnect() {
                    Log.e(TAG, "连接失败！");
                }

                @Override
                public void onErrorParam() {
                    Log.e(TAG, "直播参数错误！");
                }

                @Override
                public void onErrorSendData() {
                    Log.e(TAG, "数据传输失败！");
                }

                @Override
                public void uploadSpeed(String kbps) {
                    Log.e(TAG, kbps + "/kbps");
                }

                @Override
                public void onNetworkWeek() {
                    Log.e(TAG, "网络环境差！");
                }

                @Override
                public void onNetworkFluency() {
                    Log.e(TAG, "网络通畅！");
                }

                @Override
                public void onStop() {
                }
            });
            broadcast = builder.build();
        }
        return broadcast;
    }

}
