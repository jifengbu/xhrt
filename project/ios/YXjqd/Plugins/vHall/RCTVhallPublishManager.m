//
//  RCTVhallPublishManager.m
//  YXjqd
//
//  Created by ghg on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTVhallPublishManager.h"
#import "RCTVhallPublishView.h"
#import <React/RCTBridge.h>
#import <AVFoundation/AVFoundation.h>

@implementation RCTVhallPublishManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
  return [[RCTVhallPublishView alloc] init];
}


- (NSDictionary *)constantsToExport
{
  return @{
           @"kLiveStatusUploadSpeed": @(kLiveStatusUploadSpeed),
           @"kLiveStatusPushConnectSucceed": @(kLiveStatusPushConnectSucceed),
           @"kLiveStatusSendError": @(kLiveStatusSendError),
           @"kLiveStatusPushConnectError": @(kLiveStatusPushConnectError),
           @"kLiveStatusParamError": @(kLiveStatusParamError),
           @"kLiveStatusGetUrlError": @(kLiveStatusGetUrlError),
           @"kLiveStatusUploadNetworkOK": @(kLiveStatusUploadNetworkOK),
           @"kLiveStatusUploadNetworkException": @(kLiveStatusAudioInitError),
           @"kLiveStatusUploadNetworkException": @(kLiveStatusUploadNetworkException),
           @"kLiveStatusUploadNetworkException": @(kLiveStatusVideoInitError),
           @"kLiveStatusUploadNetworkException": @(kLiveStatusCaptureStartError)
           };
}

RCT_EXPORT_VIEW_PROPERTY(videoId, NSString);
RCT_EXPORT_VIEW_PROPERTY(appKey, NSString);
RCT_EXPORT_VIEW_PROPERTY(appSecretKey, NSString);
RCT_EXPORT_VIEW_PROPERTY(accessToken, NSString);
RCT_EXPORT_VIEW_PROPERTY(isStart, BOOL);
RCT_EXPORT_VIEW_PROPERTY(isMute, BOOL);
RCT_EXPORT_VIEW_PROPERTY(isFrontCamera, BOOL);
RCT_EXPORT_VIEW_PROPERTY(torchMode, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(isFilterOn, BOOL);
RCT_EXPORT_VIEW_PROPERTY(fps, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(videoResolution, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(bitRate, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(connectTimes, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(orgiation, NSInteger);

RCT_EXPORT_VIEW_PROPERTY(onPublishStatus, RCTDirectEventBlock)

@end
