#import <React/RCTBridge.h>
#import <React/RCTUtils.h>
#import <React/RCTEventDispatcher.h>
//#include "bear_interface_ios.h"

#define EVENT_ON_JOIN_ROOM @"EVENT_ON_JOIN_ROOM"
#define EVENT_ON_EXIT_ROOM @"EVENT_ON_EXIT_ROOM"
#define EVENT_ON_CONNECT @"EVENT_ON_CONNECT"
#define EVENT_ON_DISCONNECT @"EVENT_ON_DISCONNECT"
#define EVENT_ON_BROADCAST @"EVENT_ON_BROADCAST"
#define EVENT_ON_SEND_MESSAGE @"EVENT_ON_SEND_MESSAGE"
#define EVENT_ON_MATCHING_ROOM @"EVENT_ON_MATCHING_ROOM"
#define EVENT_ON_SET_GRADE @"EVENT_ON_SET_GRADE"
#define EVENT_ON_REQUEST @"EVENT_ON_REQUEST"


@interface RCTPhone : NSObject <RCTBridgeModule>

@end

@implementation RCTPhone

@synthesize bridge = _bridge;

- (id)init {
  self = [super init];
  if (self) {
  }
  return self;
}

RCT_EXPORT_MODULE(Phone);


RCT_EXPORT_METHOD(connectAudioServer:(NSDictionary *)data) {
  NSString *serverIP = data[@"serverIP"];
  int serverPort = [data[@"serverPort"] intValue];
//  [[BearInterface getInstance] initNetioIos:serverIP :serverPort :self];
}

RCT_EXPORT_METHOD(joinChatroom:(NSDictionary *)data) {
  NSString *options = data[@"options"];
  NSString *chatroomID = data[@"chatroomID"];
//  [[BearInterface getInstance] joinChatroom:options :chatroomID];
}

RCT_EXPORT_METHOD(exitChatroom:(NSDictionary *)data) {
  NSString *userID = data[@"userID"];
  NSString *chatroomID = data[@"chatroomID"];
//  [[BearInterface getInstance] exitChatroom:userID :chatroomID];
}

RCT_EXPORT_METHOD(setMessageToServer:(NSDictionary *)data) {
  NSString *userID = data[@"userID"];
  NSString *chatroomID = data[@"chatroomID"];
  int message = [data[@"message"] intValue];
//  [[BearInterface getInstance] setMessageToServer:userID :chatroomID :message];
}

RCT_EXPORT_METHOD(matchingChatroom:(NSDictionary *)data) {
  NSString *options = data[@"options"];
//  [[BearInterface getInstance] matchingChatroom:options];
}

RCT_EXPORT_METHOD(setGradeToServer:(NSDictionary *)data) {
  NSString *userID = data[@"userID"];
  NSString *chatroomID = data[@"chatroomID"];
  NSString *gradeUserID = data[@"gradeUserID"];
  int gradeCount = [data[@"gradeCount"] intValue];
//  [[BearInterface getInstance] setGradeToServer:userID :chatroomID :gradeUserID :gradeCount];
}

RCT_EXPORT_METHOD(pausePlayout) {
//  [[BearInterface getInstance] pausePlayout];
}

RCT_EXPORT_METHOD(resumePlayout) {
//  [[BearInterface getInstance] resumePlayout];
}

RCT_EXPORT_METHOD(pauseRecord) {
//  [[BearInterface getInstance] pauseRecord];
}

RCT_EXPORT_METHOD(resumeRecord) {
//  [[BearInterface getInstance] resumeRecord];
}


RCT_EXPORT_METHOD(speakerOn) {
//  [[BearInterface getInstance] speakerOn];
}

RCT_EXPORT_METHOD(speakerOff) {
// [[BearInterface getInstance] speakerOff];
}

RCT_EXPORT_METHOD(request:(NSString *)data) {
//  [[BearInterface getInstance] request: data];
}

- (void)onJoinChatroomRS : (int32_t) result : (NSString *) chatroomID : (NSString *) userID {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.bridge.eventDispatcher sendAppEventWithName:EVENT_ON_JOIN_ROOM
                                                 body:@{@"result": [NSNumber numberWithInteger:(result)],
                                                        @"chatroomID": chatroomID,
                                                        @"userID": userID}];
  });
}

- (void)onExitChatroomRS : (int32_t) result : (NSString *) chatroomID : (NSString *) userID {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.bridge.eventDispatcher sendAppEventWithName:EVENT_ON_EXIT_ROOM
                                                 body:@{@"result": [NSNumber numberWithInteger:(result)],
                                                        @"chatroomID": chatroomID,
                                                        @"userID": userID}];
  });
}

- (void)onAudioServerConnect {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.bridge.eventDispatcher sendAppEventWithName:EVENT_ON_CONNECT
                                                 body:@true];
  });
}

- (void)onAudioServerDisconnect {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.bridge.eventDispatcher sendAppEventWithName:EVENT_ON_DISCONNECT
                                                 body:@true];
  });
}

- (void)onAudioServerBroadcast : (NSString *) resultJson {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.bridge.eventDispatcher sendAppEventWithName:EVENT_ON_BROADCAST
                                                 body:resultJson];
  });
}

- (void)onSetMessageToServerRS : (int32_t) result : (int32_t) message {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.bridge.eventDispatcher sendAppEventWithName:EVENT_ON_SEND_MESSAGE
                                                 body:@{@"result": [NSNumber numberWithInteger:(result)],
                                                        @"message": [NSNumber numberWithInteger:(message)]}];
  });
}

- (void)onMatchingChatroomRS : (int32_t) result : (NSString *) chatroomID : (NSString *) userID {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.bridge.eventDispatcher sendAppEventWithName:EVENT_ON_MATCHING_ROOM
                                                 body:@{@"result": [NSNumber numberWithInteger:(result)],
                                                        @"chatroomID": chatroomID,
                                                        @"userID": userID}];
  });
}

- (void)onSetGradeToServerRS : (int32_t) result {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.bridge.eventDispatcher sendAppEventWithName:EVENT_ON_SET_GRADE
                                                 body:@{@"result": [NSNumber numberWithInteger:(result)]}];
  });
}

- (void)onRequestRS : (int32_t) result : (NSString *) resultJson {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.bridge.eventDispatcher sendAppEventWithName:EVENT_ON_REQUEST
                                                 body:@{@"result": [NSNumber numberWithInteger:(result)],
                                                        @"data": resultJson}];
  });
}

@end
