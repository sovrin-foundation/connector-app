//
//  CMWalletObject.h
//  ConnectMeIndy
//

#import <Foundation/Foundation.h>
#import "CMTypes.h"

@interface CMWalletObject : NSObject

/**
 Indicates that Indy wallet is created.
 */
@property (assign) BOOL isCreated;

/**
 Indicated that Indy wallet is opened.
 */
@property (assign) BOOL isOpened;

/**
 Wallet name. Default value: "connectMeWallet"
 */
@property (strong, readonly) NSString * name;

/**
 String associated with used wallet type.
 Default value: "default".
 */
@property (strong, readonly) NSString * type;

/**
 Config JSON string.
 
 Example: "{\"freshness_time\":1000}" .
 Default value: nil
 */
@property (strong) NSString * config;

@property (strong) NSString * runtimeConfig;

@property (strong) NSString * credentials;

@property (assign, readonly) CMHandle handle;

/**
 @param name Wallet name
 @param walletType registered vallet type. Set nil, if you want to use default type.
 */
- (instancetype)initWithName:(NSString *)name
                        type:(NSString *)walletType;

// MARK: - Indy interaction

/**
 
 Create Indy wallet for pool with name: poolName.
 */
- (void)createWithPoolName:(NSString *)poolName
                completion:(void (^)(NSError *error))completion;

- (void)open:(void (^)(NSError *error, CMHandle walletHandle))completion;

/**
 Create and open Indy wallet.
 Will be executed in ConnectMeIndy.sharedInstance.queue.
 
 @param poolName Pool name for which wallet will be created.
 */
- (void)createAndOpenWithPoolName:(NSString *)poolName
                       completion:(void (^)(NSError *error, CMHandle walletHandle))completion;

- (void)close:(void (^)(NSError *error))completion;

- (void)deleteWallet:(void (^)(NSError *error))completion;

@end
