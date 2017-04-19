//
//  CRTVhallPublishView.m
//  YXjqd
//
//  Created by ghg on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//
#import <React/RCTConvert.h>
#import "RCTVhallPublishView.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>
#import "VHallLivePublish.h"

@interface RCTVhallPublishView ()<CameraEngineRtmpDelegate> {
    VHallLivePublish  *_moviePublish;   //播放器
    AVCaptureDevicePosition _position;  //相机的方向
    AVCaptureTorchMode _torch; //闪光模式
    DeviceOrgiation _org; //屏幕方向
    BOOL _isInit;   //是否初始化
}
@end

@implementation RCTVhallPublishView
#pragma mark - Lifecycle Method
- (instancetype)init {
    if ((self = [super init])) {
        _isInit = NO;
        _torch = AVCaptureTorchModeAuto;
        _position = AVCaptureDevicePositionFront;
    }
    return self;
}

- (void) dealloc {
    if (_isInit) {
        [_moviePublish destoryObject];
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    if (!_isInit) {
        _moviePublish = [[VHallLivePublish alloc] initWithOrgiation:_org];
        _moviePublish.displayView.frame = self.bounds;
        _moviePublish.videoCaptureFPS = (int)self.fps;
        _moviePublish.publishConnectTimes = (int)self.connectTimes;
        _moviePublish.isMute = self.isMute;
        _moviePublish.videoResolution = (VideoResolution)self.videoResolution;
        _moviePublish.bitRate = self.bitRate;
        [_moviePublish setDeviceTorchModel:_torch];
        _moviePublish.delegate = self;
        [self insertSubview:_moviePublish.displayView atIndex:0];
        BOOL ret = [_moviePublish initCaptureVideo:_position];
        if (!ret) {
             self.onPublishStatus(@{@"state": [NSNumber numberWithInt:kLiveStatusVideoInitError]});
        }
        ret = [_moviePublish initAudio];
        if (!ret) {
            self.onPublishStatus(@{@"state": [NSNumber numberWithInt:kLiveStatusAudioInitError]});
        }
        ret = [_moviePublish startVideoCapture];
        if (!ret) {
            self.onPublishStatus(@{@"state": [NSNumber numberWithInt:kLiveStatusCaptureStartError]});
        }
        if (_isStart) {
            [self startLive];
        }
        _isInit = YES;
    } else {
        _moviePublish.displayView.frame = self.bounds;
    }
}

-(void)startLive {
    NSMutableDictionary * param = [[NSMutableDictionary alloc]init];
    param[@"id"] =  self.videoId;
    param[@"app_key"] = self.appKey;
    param[@"access_token"] = self.accessToken;
    param[@"app_secret_key"] = self.appSecretKey;
    [_moviePublish startLive:param];
}

-(void) setOrgiation:(NSInteger)orgiation {
    _org = orgiation==0 ? kDevicePortrait : orgiation==1 ? kDeviceLandSpaceRight : kDeviceLandSpaceLeft;
}

-(void) setIsStart:(BOOL)isStart {
    _isStart = isStart;
    if (_isInit) {
        if (isStart) {
            [self startLive];
        } else {
            [_moviePublish disconnect];
        }
    }
}

-(void) setIsFrontCamera:(BOOL)isFrontCamera {
    _position = isFrontCamera ? AVCaptureDevicePositionFront : AVCaptureDevicePositionBack;
    if (_isInit) {
        [_moviePublish swapCameras:_position];
    }
}

-(void) setIsMute:(BOOL)isMute {
    _isMute = isMute;
    if (_isInit) {
        _moviePublish.isMute = isMute;
    }
}

-(void) setIsFilterOn:(BOOL)isFilterOn {
    _isFilterOn = isFilterOn;
    if (_isInit) {
        _moviePublish.openFilter = isFilterOn;
    }
}

-(void) setTorchMode:(NSInteger)torchMode {
    _torch = torchMode==0 ? AVCaptureTorchModeOff : torchMode==1 ? AVCaptureTorchModeOn : AVCaptureTorchModeAuto;
    if (_isInit) {
        [_moviePublish setDeviceTorchModel:_torch];
    }
}

-(void)firstCaptureImage:(UIImage*)image {
}

-(void)publishStatus:(LiveStatus)liveStatus withInfo:(NSDictionary *)info {
    self.onPublishStatus(@{@"state": [NSNumber numberWithInt:liveStatus], @"info": info});
}

@end
