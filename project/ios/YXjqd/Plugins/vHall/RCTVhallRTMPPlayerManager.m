#import "RCTVhallRTMPPlayerManager.h"
#import "RCTVhallPlayerView.h"
#import <React/RCTBridge.h>
#import <AVFoundation/AVFoundation.h>

@implementation RCTVhallRTMPPlayerManager


RCT_EXPORT_MODULE();

- (UIView *)view
{
  return [[RCTVhallPlayerView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(videoId, NSString);
RCT_EXPORT_VIEW_PROPERTY(appKey, NSString);
RCT_EXPORT_VIEW_PROPERTY(appSecretKey, NSString);
RCT_EXPORT_VIEW_PROPERTY(name, NSString);
RCT_EXPORT_VIEW_PROPERTY(email, NSString);
RCT_EXPORT_VIEW_PROPERTY(password, NSString);

RCT_EXPORT_VIEW_PROPERTY(onDocFlash, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStateChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPlayError, RCTDirectEventBlock)

@end
