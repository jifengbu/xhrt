package com.remobile.hlsplayer;

import android.graphics.SurfaceTexture;
import android.os.Handler;
import android.view.Surface;
import android.view.TextureView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.remobile.video.RCTVideoViewManager;
import com.vhall.playersdk.player.TimeRange;
import com.vhall.playersdk.player.chunk.Format;
import com.vhall.playersdk.player.impl.HlsRendererBuilder;
import com.vhall.playersdk.player.impl.VhallHlsPlayer;
import com.vhall.playersdk.player.util.Util;
import com.yqritc.scalablevideoview.ScalableType;


public class RCTHLSPlayerView extends TextureView {
    public enum Events {
        EVENT_LOAD_START("onVideoLoadStart"),
        EVENT_LOAD("onVideoLoad"),
        EVENT_ERROR("onVideoError"),
        EVENT_PROGRESS("onVideoProgress"),
        EVENT_SEEK("onVideoSeek"),
        EVENT_END("onVideoEnd");

        private final String mName;

        Events(final String name) {
            mName = name;
        }

        @Override
        public String toString() {
            return mName;
        }
    }

    public static final String EVENT_PROP_FAST_FORWARD = "canPlayFastForward";
    public static final String EVENT_PROP_SLOW_FORWARD = "canPlaySlowForward";
    public static final String EVENT_PROP_SLOW_REVERSE = "canPlaySlowReverse";
    public static final String EVENT_PROP_REVERSE = "canPlayReverse";
    public static final String EVENT_PROP_STEP_FORWARD = "canStepForward";
    public static final String EVENT_PROP_STEP_BACKWARD = "canStepBackward";

    public static final String EVENT_PROP_DURATION = "duration";
    public static final String EVENT_PROP_PLAYABLE_DURATION = "playableDuration";
    public static final String EVENT_PROP_CURRENT_TIME = "currentTime";
    public static final String EVENT_PROP_SEEK_TIME = "seekTime";

    private ThemedReactContext context;
    private static final String TAG = "RCTVhallPlayerView";
    private VhallHlsPlayer mMediaPlayer = null;
    private VhallPlayerListener mVhallPlayerListener;
    private hlsSampleInfoListener mHlsSampleInfoListener;
    private RCTEventEmitter mEventEmitter;
    private Handler mProgressUpdateHandler = new Handler();
    private Runnable mProgressUpdateRunnable = null;

    private String mSrcUriString = null;
    private String mSrcType = "mp4";
    private boolean mSrcIsNetwork = false;
    private boolean mSrcIsAsset = false;
    private boolean mRepeat = false;
    private boolean mMuted = false;
    private float mVolume = 1.0f;
    private float mRate = 1.0f;
    private long m_msec = 0;

    private int mVideoDuration = 0;
    private int mVideoBufferedDuration = 0;
    private boolean mPaused = false;
    private boolean mMediaPlayerValid = false; // True if mMediaPlayer is in prepared, started, or paused state.
    private SurfaceTexture mSurface;

    public RCTHLSPlayerView(ThemedReactContext reactContext) {
        super(reactContext);
        this.context = reactContext;
        mEventEmitter = context.getJSModule(RCTEventEmitter.class);
        mProgressUpdateRunnable = new Runnable() {
            @Override
            public void run() {
                if (mMediaPlayerValid && mMediaPlayer != null) {
                    WritableMap event = Arguments.createMap();
                    event.putDouble(EVENT_PROP_CURRENT_TIME, mMediaPlayer.getCurrentPosition() / 1000.0);
                    event.putDouble(EVENT_PROP_PLAYABLE_DURATION, mVideoBufferedDuration / 1000.0);
                    mEventEmitter.receiveEvent(getId(), Events.EVENT_PROGRESS.toString(), event);
                }
                mProgressUpdateHandler.postDelayed(mProgressUpdateRunnable, 250);
            }
        };
        mProgressUpdateHandler.post(mProgressUpdateRunnable);
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

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        startMediaPlayer(mSrcUriString);
        WritableMap src = Arguments.createMap();
        src.putString(RCTVideoViewManager.PROP_SRC_URI, mSrcUriString);
        src.putString(RCTVideoViewManager.PROP_SRC_TYPE, mSrcType);
        src.putBoolean(RCTVideoViewManager.PROP_SRC_IS_NETWORK, mSrcIsNetwork);
        WritableMap event = Arguments.createMap();
        event.putMap(RCTVideoViewManager.PROP_SRC, src);
        mEventEmitter.receiveEvent(getId(), Events.EVENT_LOAD_START.toString(), event);
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        releaseMediaPlayer();
    }

    private void onPlayError(String error) {
        final WritableMap event = Arguments.createMap();
        event.putString("error", error);
        mEventEmitter.receiveEvent(getId(), Events.EVENT_ERROR.toString(), event);
    }

    public void onPrepared() {
        mVideoDuration = (int)mMediaPlayer.getDuration();
        mMediaPlayerValid = true;

        WritableMap event = Arguments.createMap();
        event.putDouble(EVENT_PROP_DURATION, mVideoDuration / 1000.0);
        event.putDouble(EVENT_PROP_CURRENT_TIME, mMediaPlayer.getCurrentPosition() / 1000.0);
        // TODO: Actually check if you can.
        event.putBoolean(EVENT_PROP_FAST_FORWARD, true);
        event.putBoolean(EVENT_PROP_SLOW_FORWARD, true);
        event.putBoolean(EVENT_PROP_SLOW_REVERSE, true);
        event.putBoolean(EVENT_PROP_REVERSE, true);
        event.putBoolean(EVENT_PROP_FAST_FORWARD, true);
        event.putBoolean(EVENT_PROP_STEP_BACKWARD, true);
        event.putBoolean(EVENT_PROP_STEP_FORWARD, true);
        mEventEmitter.receiveEvent(getId(), Events.EVENT_LOAD.toString(), event);

        applyModifiers();
    }

    private void startMediaPlayer(String url) {
        String userAgent = Util.getUserAgent(context, "yxjqd");
        mVhallPlayerListener = new VhallPlayerListener();
        HlsRendererBuilder builder = new HlsRendererBuilder(context, userAgent, url);
        mMediaPlayer = new VhallHlsPlayer(builder);
        mHlsSampleInfoListener = new hlsSampleInfoListener();
        mMediaPlayer.addListener(mVhallPlayerListener);
        mMediaPlayer.setInfoListener(mHlsSampleInfoListener);
        mMediaPlayer.prepare();
        mMediaPlayer.setPlayWhenReady(true);
    }

    private void releaseMediaPlayer() {
        if (mMediaPlayerValid) {
            mMediaPlayerValid = false;
            mMediaPlayer.release();
            mMediaPlayer = null;
        }
    }

    public void seekTo(long msec) {
        if (mMediaPlayerValid) {
            m_msec = msec;
            mMediaPlayer.seekTo(msec);
        }
    }


    public void setSrc(final String uriString, final String type, final boolean isNetwork, final boolean isAsset) {
        mSrcUriString = uriString;
        mSrcType = type;
        mSrcIsNetwork = isNetwork;
        mSrcIsAsset = isAsset;
        mVideoDuration = 0;
        mVideoBufferedDuration = 0;
    }

    public void setResizeModeModifier(final ScalableType resizeMode) {
    }

    public void setRepeatModifier(final boolean repeat) {
        mRepeat = repeat;
    }

    public void setPausedModifier(final boolean paused) {
        mPaused = paused;

        if (!mMediaPlayerValid) {
            return;
        }

        if (mPaused) {
            if (mMediaPlayer.isPlaying()) {
                mMediaPlayer.pause();
            }
        } else {
            if (!mMediaPlayer.isPlaying()) {
                mMediaPlayer.start();
            }
        }
    }

    public void setMutedModifier(final boolean muted) {
        mMuted = muted;

        if (!mMediaPlayerValid) {
            return;
        }

        if (mMuted) {
//            mMediaPlayer.setVolume(0, 0);
        } else {
//            mMediaPlayer.setVolume(mVolume, mVolume);
        }
    }

    public void setVolumeModifier(final float volume) {
        mVolume = volume;
        setMutedModifier(mMuted);
    }

    public void setRateModifier(final float rate) {
        mRate = rate;
    }

    public void applyModifiers() {
        setRepeatModifier(mRepeat);
        setPausedModifier(mPaused);
        setMutedModifier(mMuted);
        setRateModifier(mRate);
    }

    private class VhallPlayerListener implements VhallHlsPlayer.Listener {
        @Override
        public void onStateChanged(boolean playWhenReady, int playbackState) {
            switch (playbackState) {
                case VhallHlsPlayer.STATE_IDLE:
                    break;
                case VhallHlsPlayer.STATE_PREPARING:
                    break;
                case VhallHlsPlayer.STATE_BUFFERING:
                    break;
                case VhallHlsPlayer.STATE_READY:
                    onPrepared();
                    break;
                case VhallHlsPlayer.STATE_ENDED:
                    mEventEmitter.receiveEvent(getId(), Events.EVENT_END.toString(), null);
                    break;
                default:
                    break;
            }
        }
        @Override
        public void onError(Exception e) {
            onPlayError(e.getMessage());
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
