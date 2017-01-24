package com.yxjqd.vhalllive;

import java.io.Serializable;

/**
 * 直播参数类
 */
public class Param implements Serializable{
    public String appKey;
    public String appSecretKey;
    public String videoId;
    public String accessToken;
    public int videoBitrate;
    public int frameRate;
    public int pixel_type;
    public int screenOri;
}
