package com.yxjqd.vhalllive;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.view.WindowManager;
import com.vhall.business.VhallSDK;

import org.json.JSONObject;
import org.json.JSONTokener;

public class BroadcastActivity extends FragmentActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Param param = getParam(getIntent().getStringExtra("param"));
        if (param == null) {
            setContentView(R.layout.not_support);
            return;
        }

        VhallSDK.init(param.appKey, param.appSecretKey);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setRequestedOrientation(param.screenOri);
        setContentView(R.layout.broadcast_activity);
        BroadcastFragment mainFragment = (BroadcastFragment) getSupportFragmentManager().findFragmentById(R.id.broadcastFrame);
        if (mainFragment == null) {
            mainFragment = BroadcastFragment.newInstance();
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.add( R.id.broadcastFrame, mainFragment);
            transaction.commit();
        }

        new BroadcastPresenter(param, mainFragment);
    }

    private Param getParam(String str) {
        Param param = new Param();
        try {
            JSONTokener jsonParser = new JSONTokener(str);
            JSONObject json = (JSONObject) jsonParser.nextValue();
            param.videoId = json.getString("videoId");
            param.accessToken= json.getString("accessToken");
            param.appKey= json.getString("appKey");
            param.appSecretKey= json.getString("appSecretKey");
            param.videoBitrate = json.getInt("bitRate")/1000;
            param.frameRate = json.getInt("fps");
            param.pixel_type = json.getInt("videoResolution");
            param.screenOri = json.getInt("orgiation")==0?1:0;
            if (param.pixel_type == 0) {
                param.pixel_type = 1;
            }
        } catch (Exception e) {
            param = null;
        }
        return param;
    }
}
