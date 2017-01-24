package com.yxjqd.vhalllive;

import android.app.Activity;
import com.vhall.business.VhallCameraView;
/**
 * 发直播的View接口类
 */
public class BroadcastContract {
    interface View  {
        void setPresenter(Presenter presenter);

        VhallCameraView getCameraView();

        Activity getmActivity();

        void setStartBtnText(String text);

        void showErrorMsg(String msg);

        void setSpeedText(String text);
    }

    interface Presenter {
        void start();

        void onstartBtnClick();

        void initBroadcast();

        void startBroadcast();

        void stopBroadcast();

        void finishBroadcast();

        void changeFlash();

        void changeCamera();

        void changeAudio();

        void onPause();

        void onResume();
    }
}
