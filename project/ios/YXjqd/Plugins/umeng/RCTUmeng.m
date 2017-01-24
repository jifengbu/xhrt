#import "RCTUmeng.h"

#import "RCTBridge.h"
#import "RCTUtils.h"

#import "WXApi.h"

#import "UMSocialWechatHandler.h"
#import "UMSocialQQHandler.h"
#import "UMSocialSinaSSOHandler.h"
#import "UMSocialAlipayShareHandler.h"

@implementation RCTUmeng

@synthesize bridge = _bridge;

- (id)init {
  self = [super init];
  if (self) {
    [UMSocialData setAppKey:UmengAppkey];
    [UMSocialWechatHandler setWXAppId:@"wx18d0597c9febcd0d" appSecret:@"83453a0c858e052a3d73dfbdbc11c874" url:nil];
    [UMSocialQQHandler setQQWithAppId:@"1105204262" appKey:@"fELEobxl728L2MDl" url:@"http://www.baidu.com"];
    
    // 对所有未安装客户端平台进行隐藏
    [UMSocialConfig hiddenNotInstallPlatforms:nil];
  }
  return self;
}

- (NSDictionary *)constantsToExport {
  return @{@"platforms": @{
               @"UMShareToEmail":UMShareToEmail, // 邮箱
               @"UMShareToSms":UMShareToSms, // 短信
               @"UMShareToWechatSession":UMShareToWechatSession, // 微信好友
               @"UMShareToWechatTimeline":UMShareToWechatTimeline, // 微信朋友圈
               @"UMShareToQQ":UMShareToQQ, // 手机QQ
               @"UMShareToQzone":UMShareToQzone, // QQ空间
               },
           @"isWeixinInstalled": [NSNumber numberWithInteger:([WXApi isWXAppInstalled])],
           @"isQQInstalled": [NSNumber numberWithInteger:([QQApiInterface isQQInstalled])],
           };
};

RCT_EXPORT_MODULE(Umeng);

//调用umeng默认的分享
RCT_EXPORT_METHOD(shareWithActionSheet:(NSDictionary *)data callback:(RCTResponseSenderBlock) callback) {
  [self shareToSns:data callback:callback];
}

//直接调用微信好友分享
RCT_EXPORT_METHOD(shareSingle:(NSString *)platfrom data:(NSDictionary *)data callback:(RCTResponseSenderBlock) callback) {
  [self postSNSWithTypes:@[platfrom] params:data callback:callback];
}


-(void)shareToSns:(NSDictionary *)params callback:(RCTResponseSenderBlock)callback{
  self.callback = callback;

  dispatch_async(dispatch_get_main_queue(), ^{
    NSURL *url = [NSURL URLWithString: params[@"imageUrl"]];
    UIImage *img = [UIImage imageWithData: [NSData dataWithContentsOfURL:url]];
    if ([params[@"shareType"] isEqualToString:@"app"]) {
      [UMSocialData defaultData].extConfig.wxMessageType = UMSocialWXMessageTypeApp;
      [UMSocialData defaultData].extConfig.qqData.qqMessageType = UMSocialQQMessageTypeDefault;
      //设置分享的点击链接
      [UMSocialData defaultData].extConfig.wechatSessionData.url = params[@"url"];
      [UMSocialData defaultData].extConfig.wechatTimelineData.url =params[@"url"];
      [UMSocialData defaultData].extConfig.qqData.url =params[@"url"];
      [UMSocialData defaultData].extConfig.qzoneData.url =params[@"url"];
      if (img == nil) {
        img = [UIImage imageNamed:@"icon.png"];
      }
    } else if ([params[@"shareType"] isEqualToString:@"web"]) {
      [UMSocialData defaultData].extConfig.wxMessageType = UMSocialWXMessageTypeWeb;
      [UMSocialData defaultData].extConfig.qqData.qqMessageType = UMSocialQQMessageTypeDefault;
      //设置分享的点击链接
      [UMSocialData defaultData].extConfig.wechatSessionData.url = params[@"url"];
      [UMSocialData defaultData].extConfig.wechatTimelineData.url =params[@"url"];
      [UMSocialData defaultData].extConfig.qqData.url =params[@"url"];
      [UMSocialData defaultData].extConfig.qzoneData.url =params[@"url"];
      if (img == nil) {
        img = [UIImage imageNamed:@"icon.png"];
      }
    } else {
      [UMSocialData defaultData].extConfig.wxMessageType = UMSocialWXMessageTypeText;
      [UMSocialData defaultData].extConfig.qqData.qqMessageType = UMSocialQQMessageTypeDefault;
      img = nil;
    }

    //    设置微信好友title
    [UMSocialData defaultData].extConfig.wechatSessionData.title = params[@"title"];
    //    设置微信朋友圈title
    [UMSocialData defaultData].extConfig.wechatTimelineData.title = params[@"title"];
    
    [UMSocialData defaultData].extConfig.qqData.title = params[@"title"];
    [UMSocialData defaultData].extConfig.qzoneData.title = params[@"title"];
    
    if ([params[@"sharePlatforms"] isEqualToString:@"onlyEmailSms"]) {
      [UMSocialSnsService presentSnsIconSheetView:RCTKeyWindow().rootViewController
                                           appKey:UmengAppkey
                                        shareText:params[@"text"]
                                       shareImage:img
                                  shareToSnsNames:[NSArray arrayWithObjects:
                                                   UMShareToEmail,
                                                   UMShareToSms,
                                                   nil]
                                         delegate:self];
    } else {
      [UMSocialSnsService presentSnsIconSheetView:RCTKeyWindow().rootViewController
                                           appKey:UmengAppkey
                                        shareText:params[@"text"]
                                       shareImage:img
                                  shareToSnsNames:[NSArray arrayWithObjects:
                                                   UMShareToEmail,
                                                   UMShareToSms,
                                                   UMShareToWechatSession,
                                                   UMShareToWechatTimeline,
                                                   UMShareToQQ,
                                                   UMShareToQzone,
                                                   nil]
                                         delegate:self];
    }
    
  });
  
}


-(void)didFinishGetUMSocialDataInViewController:(UMSocialResponseEntity *)response
{
  if(response.responseCode == UMSResponseCodeSuccess) {
    self.callback(@[@{@"success": @true}]);
  } else if(response.responseCode == UMSResponseCodeCancel) {
    self.callback(@[@{@"success": @false, @"cancel": @true}]);
  } else {
    self.callback(@[@{@"success": @false, @"cancel": @false}]);
  }
}


-(void)postSNSWithTypes:(NSArray *)type params:(NSDictionary *)params callback:(RCTResponseSenderBlock)callback
{
   self.callback = callback;
    dispatch_async(dispatch_get_main_queue(), ^{
  NSURL *url = [NSURL URLWithString: params[@"imageUrl"]];
  UIImage *img = [UIImage imageWithData: [NSData dataWithContentsOfURL:url]];
  if ([params[@"shareType"] isEqualToString:@"text"]) {
    [UMSocialData defaultData].extConfig.wxMessageType = UMSocialWXMessageTypeText;
    [UMSocialData defaultData].extConfig.qqData.qqMessageType = UMSocialQQMessageTypeDefault;
    img = nil;
  } else if([params[@"shareType"] isEqualToString:@"image"]) {
    [UMSocialData defaultData].extConfig.wxMessageType = UMSocialWXMessageTypeImage;
    [UMSocialData defaultData].extConfig.qqData.qqMessageType = UMSocialQQMessageTypeImage;
    if (img == nil) {
      img = [UIImage imageNamed:@"icon.png"];
    }
  } else if([params[@"shareType"] isEqualToString:@"app"]) {
    [UMSocialData defaultData].extConfig.wxMessageType = UMSocialWXMessageTypeApp;
    [UMSocialData defaultData].extConfig.qqData.qqMessageType = UMSocialQQMessageTypeDefault;
    [UMSocialData defaultData].extConfig.wechatSessionData.url = params[@"url"];
    [UMSocialData defaultData].extConfig.wechatTimelineData.url =params[@"url"];
    [UMSocialData defaultData].extConfig.qqData.url =params[@"url"];
    [UMSocialData defaultData].extConfig.qzoneData.url =params[@"url"];
    if (img == nil) {
      img = [UIImage imageNamed:@"icon.png"];
    }
  } else if([params[@"shareType"] isEqualToString:@"web"]){
    [UMSocialData defaultData].extConfig.wxMessageType = UMSocialWXMessageTypeWeb;
    [UMSocialData defaultData].extConfig.qqData.qqMessageType = UMSocialQQMessageTypeDefault;
    [UMSocialData defaultData].extConfig.wechatSessionData.url = params[@"url"];
    [UMSocialData defaultData].extConfig.wechatTimelineData.url =params[@"url"];
    [UMSocialData defaultData].extConfig.qqData.url =params[@"url"];
    [UMSocialData defaultData].extConfig.qzoneData.url =params[@"url"];
    if (img == nil) {
      img = [UIImage imageNamed:@"icon.png"];
    }
  }
      //    设置微信好友title
    [UMSocialData defaultData].extConfig.wechatSessionData.title = params[@"title"];
      //    设置微信朋友圈title
    [UMSocialData defaultData].extConfig.wechatTimelineData.title = params[@"title"];
      
    [UMSocialData defaultData].extConfig.qqData.title = params[@"title"];
    [UMSocialData defaultData].extConfig.qzoneData.title = params[@"title"];
    [[UMSocialDataService defaultDataService] postSNSWithTypes:type
                                                     content:params[@"text"]
                                                       image:img
                                                    location:nil
                                                 urlResource:nil
                                         presentedController:RCTKeyWindow().rootViewController
                                                  completion:^(UMSocialResponseEntity *response){
                                                    if(response.responseCode == UMSResponseCodeSuccess) {
                                                      self.callback(@[@{@"success": @true}]);
                                                    } else if(response.responseCode == UMSResponseCodeCancel) {
                                                      self.callback(@[@{@"success": @false, @"cancel": @true}]);
                                                    } else {
                                                      self.callback(@[@{@"success": @false, @"cancel": @false}]);
                                                    }
                                                  }];
        });
}

@end