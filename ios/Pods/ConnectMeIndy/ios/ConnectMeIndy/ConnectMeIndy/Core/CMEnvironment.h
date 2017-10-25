//
//  CMEnvironment.h
//  ConnectMeIndy
//

#import <Foundation/Foundation.h>
#import <Indy/Indy.h>

@interface CMEnvironment : NSObject

+ (NSString *)poolIp;
+ (NSString *)poolName;
+ (NSString *)walletName;

+ (NSMutableString*) getUserDocumentDir;
+ (NSMutableString*) getUserTmpDir;

/**
 Nodes config for local test environment
 */
+ (NSString *)defaultNodesConfig;

@end
