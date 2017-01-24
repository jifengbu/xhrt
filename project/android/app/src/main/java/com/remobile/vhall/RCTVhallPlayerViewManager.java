package com.remobile.vhall;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.*;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class RCTVhallPlayerViewManager extends SimpleViewManager<RCTVhallPlayerView> {
    private Activity activity;
    @Override
    public String getName() {
        return "RCTVhallRTMPPlayer";
    }

    public RCTVhallPlayerViewManager(Activity activity) {
        this.activity = activity;
    }

    @Override
    public RCTVhallPlayerView createViewInstance(ThemedReactContext reactContext) {
        return new RCTVhallPlayerView(reactContext, activity);
    }

    @Override
    @Nullable
    public Map getExportedCustomDirectEventTypeConstants() {
        MapBuilder.Builder builder = MapBuilder.builder();
        for (RCTVhallPlayerView.Events event : RCTVhallPlayerView.Events.values()) {
            builder.put(event.getName(), MapBuilder.of("registrationName", event.getName()));
        }
        return builder.build();
    }

    @ReactProp(name = "appKey")
    public void setAppKey(RCTVhallPlayerView view, String appKey) {
        view.setAppKey(appKey);
    }

    @ReactProp(name = "appSecretKey")
    public void setAppSecretKey(RCTVhallPlayerView view, String appSecretKey) {
        view.setAppSecretKey(appSecretKey);
    }

    @ReactProp(name = "videoId")
    public void setVideoId(RCTVhallPlayerView view, String videoId) {
        view.setVideoId(videoId);
    }

    @ReactProp(name = "name")
    public void setName(RCTVhallPlayerView view, String name) {
        view.setName(name);
    }

    @ReactProp(name = "email")
    public void setEmail(RCTVhallPlayerView view, String email) {
        view.setEmail(email);
    }

    @ReactProp(name = "password")
    public void setPassword(RCTVhallPlayerView view, String password) {
        view.setPassword(password);
    }
}
