#import <React/RCTConvert.h>
#import "RCTVhallPlayerView.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>
#import "VHallMoviePlayer.h"

@interface RCTVhallPlayerView ()<VHallMoviePlayerDelegate> {
    VHallMoviePlayer  *_moviePlayer;//播放器
    BOOL _isStart;
    BOOL _isMute;

    NSInteger _playMode;
    NSInteger _state;
    NSString *_path;
}
@end

@implementation RCTVhallPlayerView
- (instancetype)init {
    if ((self = [super init])) {
        _isStart = NO;
        _isMute = NO;
        _path = @"";
      
        _moviePlayer = [[VHallMoviePlayer alloc]initWithDelegate:self];
        _moviePlayer.movieScalingMode = kRTMPMovieScalingModeAspectFill;
        [self addSubview:_moviePlayer.moviePlayerView];
    }
    
    return self;
}


#pragma mark - App lifecycle handlers

- (void)layoutSubviews {
    [super layoutSubviews];
    [self startMediaPlayer];
    
    [CATransaction begin];
    [CATransaction setAnimationDuration:0];
    _moviePlayer.moviePlayerView.frame = self.bounds;
    [CATransaction commit];
}

- (void)removeFromSuperview {
    [self releaseMediaPlayer];
    [super removeFromSuperview];
}

- (void)applicationWillResignActive:(NSNotification *)notification {
    [self startMediaPlayer];
}

- (void)applicationWillEnterForeground:(NSNotification *)notification {
    [self releaseMediaPlayer];
}


- (void) startMediaPlayer {
    if (!_isStart) {
        _isStart = true;
        NSDictionary *param = @{
                                @"id": self.videoId,
                                @"app_key": self.appKey,
                                @"app_secret_key": self.appSecretKey,
                                @"name": self.name,
                                @"email": self.email,
                                @"pass": self.password
                                };
        [_moviePlayer startPlay:param];
    }
}

- (void)releaseMediaPlayer {
    [_moviePlayer destroyMoivePlayer];
}

#pragma mark - 设置静音
- (void) setMute:(BOOL)flag {
    if (!_isStart) {
        _isMute = flag;
        [_moviePlayer setMute:flag];
    }
}

-(void)connectSucceed:(VHMoviePlayer *)moviePlayer info:(NSDictionary *)info {
    _moviePlayer.moviePlayerView.frame = self.bounds;
    self.onStateChange(@{@"state": @2}); //PREPARING
}

-(void)bufferStart:(VHMoviePlayer *)moviePlayer info:(NSDictionary *)info {
    self.onStateChange(@{@"state": @3}); //BUFFERING
}

-(void)bufferStop:(VHMoviePlayer *)moviePlayer info:(NSDictionary *)info {
    self.onStateChange(@{@"state": @4}); //READY
}

-(void)downloadSpeed:(VHMoviePlayer *)moviePlayer info:(NSDictionary *)info {
}

- (void)playError:(LivePlayErrorType)livePlayErrorType info:(NSDictionary *)info {
    self.onPlayError(info);
}

- (void)netWorkStatus:(VHMoviePlayer*)moviePlayer info:(NSDictionary*)info {
}

#pragma mark - VHallMoviePlayerDelegate
-(void)PPTScrollNextPagechangeImagePath:(NSString *)changeImagePath {
    _path = changeImagePath!=nil?changeImagePath:@"";
    self.onDocFlash(@{@"path": _path, @"type": [NSNumber numberWithInt:(int)_playMode]});
}

-(void)VideoPlayMode:(VHallMovieVideoPlayMode)playMode {
    _playMode = playMode;
    self.onDocFlash(@{@"path": _path, @"type": [NSNumber numberWithInt:(int)_playMode]});
}

-(void)ActiveState:(VHallMovieActiveState)activeState {
    int state = 1;
    
    if (activeState == VHallMovieActiveStateEnd) {
        state = 5;
    } else if (activeState == VHallMovieActiveStateReservation) {
         state = 2;
    }
    self.onStateChange(@{@"state": [NSNumber numberWithInt:state]});
}

@end
