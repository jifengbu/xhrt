package com.remobile.vhall;

import android.app.Activity;
import android.support.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class RCTVhallPublishViewManager extends SimpleViewManager<RCTVhallPublishView> {
    private Activity activity;
    @Override
    public String getName() {
        return "RCTVhallPublish";
    }

    public RCTVhallPublishViewManager(Activity activity) {
        this.activity = activity;
    }

    @Override
    public RCTVhallPublishView createViewInstance(ThemedReactContext reactContext) {
        return new RCTVhallPublishView(reactContext, activity);
    }

    @Override
    @Nullable
    public Map getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder builder = MapBuilder.builder();
        for (RCTVhallPublishView.Events event : RCTVhallPublishView.Events.values()) {
            builder.put(event.getName(), MapBuilder.of("registrationName", event.getName()));
        }
        return builder.build();
    }

    @ReactProp(name = "videoId")
    public void setVideoId(RCTVhallPublishView view, String videoId) {
        view.setVideoId(videoId);
    }

    @ReactProp(name = "appKey")
    public void setAppKey(RCTVhallPublishView view, String appKey) {
        view.setAppKey(appKey);
    }

    @ReactProp(name = "appSecretKey")
    public void setAppSecretKey(RCTVhallPublishView view, String appSecretKey) {
        view.setAppSecretKey(appSecretKey);
    }

    @ReactProp(name = "accessToken")
    public void setAccessToken(RCTVhallPublishView view, String accessToken) {
        view.setAccessToken(accessToken);
    }

    @ReactProp(name = "isStart")
    public void setIsStart(RCTVhallPublishView view, boolean isStart) {
        view.setIsStart(isStart);
    }

    @ReactProp(name = "isMute")
    public void setIsMute(RCTVhallPublishView view, boolean isMute) {
        view.setIsMute(isMute);
    }

    @ReactProp(name = "isFrontCamera")
    public void setIsFrontCamera(RCTVhallPublishView view, boolean isFrontCamera) {
        view.setIsFrontCamera(isFrontCamera);
    }

    @ReactProp(name = "torchMode")
    public void setTorchMode(RCTVhallPublishView view, int torchMode) {
        view.setTorchMode(torchMode);
    }

    @ReactProp(name = "isFilterOn")
    public void setIsFilterOn(RCTVhallPublishView view, boolean isFilterOn) {
        view.setIsFilterOn(isFilterOn);
    }

    @ReactProp(name = "fps")
    public void setFps(RCTVhallPublishView view, int fps) {
        view.setFps(fps);
    }

    @ReactProp(name = "videoResolution")
    public void setVideoResolution(RCTVhallPublishView view, int videoResolution) {
        view.setVideoResolution(videoResolution);
    }

    @ReactProp(name = "bitRate")
    public void setBitRate(RCTVhallPublishView view, int bitRate) {
        view.setBitRate(bitRate);
    }

    @ReactProp(name = "connectTimes")
    public void setConnectTimes(RCTVhallPublishView view, int connectTimes) {
        view.setConnectTimes(connectTimes);
    }

    @ReactProp(name = "orgiation")
    public void setOrgiation(RCTVhallPublishView view, int orgiation) {
        view.setOrgiation(orgiation);
    }
}
