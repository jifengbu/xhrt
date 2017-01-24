//
//  CRTVhallPublishView.h
//  YXjqd
//
//  Created by ghg on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTView.h"
#import <AVFoundation/AVFoundation.h>
#import "AVKit/AVKit.h"
#import "VHallLivePublish.h"


typedef NS_ENUM(int,LiveErrorStatus)
{
    kLiveStatusAudioInitError = 100,
    kLiveStatusVideoInitError = 101,
    kLiveStatusCaptureStartError = 102
};

@interface RCTVhallPublishView : UIView

@property(nonatomic, strong)NSString * videoId;
@property(nonatomic, strong)NSString * appKey;
@property(nonatomic, strong)NSString * appSecretKey;
@property(nonatomic, strong)NSString * accessToken;
@property(nonatomic, assign)BOOL isStart;
@property(nonatomic, assign)BOOL isMute;
@property(nonatomic, assign)BOOL isFrontCamera;
@property(nonatomic, assign)NSInteger torchMode;
@property(nonatomic, assign)BOOL isFilterOn;
@property(nonatomic, assign)NSInteger fps;
@property(nonatomic, assign)NSInteger videoResolution;
@property(nonatomic, assign)NSInteger bitRate;
@property(nonatomic, assign)NSInteger connectTimes;
@property(nonatomic, assign)NSInteger orgiation;

@property (nonatomic, copy) RCTDirectEventBlock onPublishStatus;

- (instancetype)init;

@end
