#ifndef _BEAR_INTERFACE_IOS_H_
#define _BEAR_INTERFACE_IOS_H_

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

// don't break this callback;
@protocol BearCallBackProtocol

- (void)onJoinChatroomRS : (int32_t) result : (NSString *) chatroomID : (NSString *) userID;
- (void)onExitChatroomRS : (int32_t) result : (NSString *) chatroomID : (NSString *) userID;
- (void)onAudioServerConnect;
- (void)onAudioServerDisconnect;

- (void)onAudioServerBroadcast : (NSString *) resultJson;

- (void)onSetMessageToServerRS : (int32_t) result : (int32_t) message;
- (void)onMatchingChatroomRS : (int32_t) result : (NSString *) chatroomID : (NSString *) userID;
- (void)onSetGradeToServerRS : (int32_t) result;
- (void)onRequestRS : (int32_t) result : (NSString *) resultJson;

@end

@interface BearDelegate :NSObject {
    id<BearCallBackProtocol> _bearDelegate;
}

@property (nonatomic, retain) id<BearCallBackProtocol> _bearDelegate;;

// set delegate
-(void) setBearCallBackDelegate :(id<BearCallBackProtocol>) delegate;

- (void)onAudioServerConnect;
- (void)onAudioServerDisconnect;

- (void)onAudioServerBroadcast : (NSString *) resultJson;

- (void)onSetMessageToServerRS : (int32_t) result : (int32_t) message;
- (void)onMatchingChatroomRS : (int32_t) result : (NSString *) chatroomID : (NSString *) userID;
- (void)onSetGradeToServerRS : (int32_t) result;
- (void)onRequestRS : (int32_t) result : (NSString *) resultJson;

+(BearDelegate*) getInstance;

@end

@interface BearInterface :NSObject {
    NSString* _chatroomID;
    NSString* _userID;
}

// init and release
-(void) initNetioIos :(NSString*) serverIP : (uint16_t) serverPort : (id<BearCallBackProtocol>) delegate;
-(void) releaseNetioIos;

-(int) joinChatroom : (NSString*) userID : (NSString*) chatroomID;
-(int) exitChatroom : (NSString*) userID : (NSString*) chatroomID;

-(int) setMessageToServer : (NSString*) userID : (NSString*) chatroomID : (uint16_t) message;
-(int) matchingChatroom : (NSString*) userID;

-(int) setGradeToServer : (NSString*) userID : (NSString*) chatroomID : (NSString*) gradeUserID : (uint16_t) gradeCount;

-(int) pausePlayout;
-(int) resumePlayout;

-(int) pauseRecord;
-(int) resumeRecord;

-(int) speakerOn;
-(int) speakerOff;

-(int) request : (NSString*) requestJson;

+(BearInterface*) getInstance;

@end

#endif //_BEAR_INTERFACE_IOS_H_

