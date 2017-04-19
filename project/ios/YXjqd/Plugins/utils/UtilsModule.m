#import <React/RCTBridge.h>
#import <React/RCTUtils.h>
#import <AVFoundation/AVCaptureDevice.h>
#import <AVFoundation/AVMediaFormat.h>

@interface RCTUtilsModule : NSObject <RCTBridgeModule>

@end

@implementation RCTUtilsModule


RCT_EXPORT_MODULE(UtilsModule);


- (NSDictionary *)constantsToExport {
    return @{
             @"statusBarHeight": [NSNumber numberWithInt:[self getStatusBarHeight]],
             };
};

- (int)getStatusBarHeight {
    CGRect rectStatus = [[UIApplication sharedApplication] statusBarFrame];
    return rectStatus.size.height;
}

RCT_EXPORT_METHOD(checkCameraPermission:(RCTResponseSenderBlock)callback)
{
    __block BOOL result = NO;
    // 在iOS7 时，只有部分地区要求授权才能打开相机
    if (floor(NSFoundationVersionNumber) <= NSFoundationVersionNumber_iOS_7_1) {
        // Pre iOS 8 -- No camera auth required.
    }else {
        AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
        switch (status) {
            case AVAuthorizationStatusNotDetermined:{
                // 许可对话没有出现，发起授权许可
                [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
                    //*******************先回主线程
                    if (granted) {
                        //第一次用户接受
                        result = YES;
                    }else{
                        //用户拒绝
                        result = NO;
                    }
                }];
                break;
            }
            case AVAuthorizationStatusAuthorized:{
                // 已经开启授权，可继续
                result = YES;
                break;
            }
            case AVAuthorizationStatusDenied:
            case AVAuthorizationStatusRestricted:
                // 用户明确地拒绝授权，或者相机设备无法访问
                result = NO;
                break;
            default:
                break;
        }
        
    }
    callback(@[[NSNumber numberWithInteger:(result)]]);
}

@end
