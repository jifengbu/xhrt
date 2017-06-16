#import <React/RCTBridge.h>
#import <React/RCTUtils.h>
#import <AVFoundation/AVCaptureDevice.h>
#import <AVFoundation/AVMediaFormat.h>

#import <ifaddrs.h>
#import <arpa/inet.h>
#import <net/if.h>

#define IOS_CELLULAR    @"pdp_ip0"
#define IOS_WIFI        @"en0"
#define IOS_VPN         @"utun0"
#define IP_ADDR_IPv4    @"ipv4"
#define IP_ADDR_IPv6    @"ipv6"


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

//- (BOOL)isIpv6{
//    NSArray *searchArray =
//    @[ IOS_VPN @"/" IP_ADDR_IPv6,
//       IOS_VPN @"/" IP_ADDR_IPv4,
//       IOS_WIFI @"/" IP_ADDR_IPv6,
//       IOS_WIFI @"/" IP_ADDR_IPv4,
//       IOS_CELLULAR @"/" IP_ADDR_IPv6,
//       IOS_CELLULAR @"/" IP_ADDR_IPv4 ] ;
//    
//    NSDictionary *addresses = [self getIPAddresses];
//    NSLog(@"addresses: %@", addresses);
//    
//    __block BOOL isIpv6 = NO;
//    [searchArray enumerateObjectsUsingBlock:^(NSString *key, NSUInteger idx, BOOL *stop)
//     {
//         
//         NSLog(@"---%@---%@---",key, addresses[key] );
//         
//         if ([key rangeOfString:@"ipv6"].length > 0  && ![[NSString stringWithFormat:@"%@",addresses[key]] hasPrefix:@"(null)"] ) {
//             
//             if ( ![addresses[key] hasPrefix:@"fe80"]) {
//                 isIpv6 = YES;
//             }
//         }
//         
//     } ];
//    
//    return isIpv6;
//}
//
//
//- (NSDictionary *)getIPAddresses
//{
//    NSMutableDictionary *addresses = [NSMutableDictionary dictionaryWithCapacity:8];
//    // retrieve the current interfaces - returns 0 on success
//    struct ifaddrs *interfaces;
//    if(!getifaddrs(&interfaces)) {
//        // Loop through linked list of interfaces
//        struct ifaddrs *interface;
//        for(interface=interfaces; interface; interface=interface->ifa_next) {
//            if(!(interface->ifa_flags & IFF_UP) /* || (interface->ifa_flags & IFF_LOOPBACK) */ ) {
//                continue; // deeply nested code harder to read
//            }
//            const struct sockaddr_in *addr = (const struct sockaddr_in*)interface->ifa_addr;
//            char addrBuf[ MAX(INET_ADDRSTRLEN, INET6_ADDRSTRLEN) ];
//            if(addr && (addr->sin_family==AF_INET || addr->sin_family==AF_INET6)) {
//                NSString *name = [NSString stringWithUTF8String:interface->ifa_name];
//                NSString *type;
//                if(addr->sin_family == AF_INET) {
//                    if(inet_ntop(AF_INET, &addr->sin_addr, addrBuf, INET_ADDRSTRLEN)) {
//                        type = IP_ADDR_IPv4;
//                        
//                        NSLog(@"ipv4 %@",name);
//                    }
//                } else {
//                    const struct sockaddr_in6 *addr6 = (const struct sockaddr_in6*)interface->ifa_addr;
//                    if(inet_ntop(AF_INET6, &addr6->sin6_addr, addrBuf, INET6_ADDRSTRLEN)) {
//                        type = IP_ADDR_IPv6;
//                        NSLog(@"ipv6 %@",name);
//                        
//                    }
//                }
//                if(type) {
//                    NSString *key = [NSString stringWithFormat:@"%@/%@", name, type];
//                    addresses[key] = [NSString stringWithUTF8String:addrBuf];
//                }
//            }
//        }
//        // Free memory
//        freeifaddrs(interfaces);
//    }
//    return [addresses count] ? addresses : nil;
//}

//#pragma mark - 获取设备当前网络IP地址
//- (NSString *)getIPAddress:(BOOL)preferIPv4
//{
//    NSArray *searchArray = preferIPv4 ?
//    @[ IOS_VPN @"/" IP_ADDR_IPv4, IOS_VPN @"/" IP_ADDR_IPv6, IOS_WIFI @"/" IP_ADDR_IPv4, IOS_WIFI @"/" IP_ADDR_IPv6, IOS_CELLULAR @"/" IP_ADDR_IPv4, IOS_CELLULAR @"/" IP_ADDR_IPv6 ] :
//    @[ IOS_VPN @"/" IP_ADDR_IPv6, IOS_VPN @"/" IP_ADDR_IPv4, IOS_WIFI @"/" IP_ADDR_IPv6, IOS_WIFI @"/" IP_ADDR_IPv4, IOS_CELLULAR @"/" IP_ADDR_IPv6, IOS_CELLULAR @"/" IP_ADDR_IPv4 ] ;
//    
//    NSDictionary *addresses = [self getIPAddresses];
//    NSLog(@"addresses: %@", addresses);
//    
//    __block NSString *address;
//    [searchArray enumerateObjectsUsingBlock:^(NSString *key, NSUInteger idx, BOOL *stop)
//     {
//         address = addresses[key];
//         //筛选出IP地址格式
//         if([self isValidatIP:address]) *stop = YES;
//     } ];
//    return address ? address : @"0.0.0.0";
//}
//
//- (BOOL)isValidatIP:(NSString *)ipAddress {
//    if (ipAddress.length == 0) {
//        return NO;
//    }
//    NSString *urlRegEx = @"^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\."
//    "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\."
//    "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\."
//    "([01]?\\d\\d?|2[0-4]\\d|25[0-5])$";
//    
//    NSError *error;
//    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:urlRegEx options:0 error:&error];
//    
//    if (regex != nil) {
//        NSTextCheckingResult *firstMatch=[regex firstMatchInString:ipAddress options:0 range:NSMakeRange(0, [ipAddress length])];
//        
//        if (firstMatch) {
//            NSRange resultRange = [firstMatch rangeAtIndex:0];
//            NSString *result=[ipAddress substringWithRange:resultRange];
//            //输出结果
//            NSLog(@"%@",result);
//            return YES;
//        }
//    }
//    return NO;
//}
//
//- (NSDictionary *)getIPAddresses
//{
//    NSMutableDictionary *addresses = [NSMutableDictionary dictionaryWithCapacity:8];
//    
//    // retrieve the current interfaces - returns 0 on success
//    struct ifaddrs *interfaces;
//    if(!getifaddrs(&interfaces)) {
//        // Loop through linked list of interfaces
//        struct ifaddrs *interface;
//        for(interface=interfaces; interface; interface=interface->ifa_next) {
//            if(!(interface->ifa_flags & IFF_UP) /* || (interface->ifa_flags & IFF_LOOPBACK) */ ) {
//                continue; // deeply nested code harder to read
//            }
//            const struct sockaddr_in *addr = (const struct sockaddr_in*)interface->ifa_addr;
//            char addrBuf[ MAX(INET_ADDRSTRLEN, INET6_ADDRSTRLEN) ];
//            if(addr && (addr->sin_family==AF_INET || addr->sin_family==AF_INET6)) {
//                NSString *name = [NSString stringWithUTF8String:interface->ifa_name];
//                NSString *type;
//                if(addr->sin_family == AF_INET) {
//                    if(inet_ntop(AF_INET, &addr->sin_addr, addrBuf, INET_ADDRSTRLEN)) {
//                        type = IP_ADDR_IPv4;
//                    }
//                } else {
//                    const struct sockaddr_in6 *addr6 = (const struct sockaddr_in6*)interface->ifa_addr;
//                    if(inet_ntop(AF_INET6, &addr6->sin6_addr, addrBuf, INET6_ADDRSTRLEN)) {
//                        type = IP_ADDR_IPv6;
//                    }
//                }
//                if(type) {
//                    NSString *key = [NSString stringWithFormat:@"%@/%@", name, type];
//                    addresses[key] = [NSString stringWithUTF8String:addrBuf];
//                }
//            }
//        }
//        // Free memory
//        freeifaddrs(interfaces);
//    }
//    return [addresses count] ? addresses : nil;
//}

@end
