#import "RCTView.h"
#import <AVFoundation/AVFoundation.h>
#import "AVKit/AVKit.h"

@interface RCTVhallPlayerView : UIView

@property(nonatomic, strong)NSString * videoId;
@property(nonatomic, strong)NSString * appKey;
@property(nonatomic, strong)NSString * appSecretKey;
@property(nonatomic, strong)NSString * name;
@property(nonatomic, strong)NSString * email;
@property(nonatomic, strong)NSString * password;

@property (nonatomic, copy) RCTDirectEventBlock onDocFlash;
@property (nonatomic, copy) RCTDirectEventBlock onStateChange;
@property (nonatomic, copy) RCTDirectEventBlock onPlayError;

- (instancetype)init;

@end
