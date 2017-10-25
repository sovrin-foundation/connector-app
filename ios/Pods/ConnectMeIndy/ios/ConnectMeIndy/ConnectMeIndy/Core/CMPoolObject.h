//
//  CMPoolObject.h
//  ConnectMeIndy
//

#import <Foundation/Foundation.h>
#import "CMTypes.h"

@interface CMPoolObject: NSObject

@property (readonly, strong) NSString * name;

@property (readonly, assign) CMHandle handle;

/**
 Path to *.txn file where configuration will be stored.
 */
@property (assign) NSString * txnFilePath;

@property (assign) BOOL isCreated;

@property (assign) BOOL isOpened;


/**
 Initialize pool object
 
 @param name Pool name. If nothing is passed, default value will be set from CMEnvironment.
 @param nodesConfig NodesConfig. If nothing is passed, default value will be set from CMEnvironment.
 */
- (instancetype)initWithName: (NSString *)name
                 nodesConfig: (NSString *)nodesConfig;

// MARK: - Pool ledger

/**
 Will create Indy pool using stored parameters.
 */
- (void)create:(void (^)(NSError *error))completion;

/**
 Will open Indy pool using instance's parameters.
 */
- (void)open:(void (^)(NSError *error, CMHandle poolHandle))completion;

/**
 Will create and open Indy pool.
 
 Calls will be performed in CennectMeIndy singletone's serial queue.
 */
- (void)createAndOpen:(void (^)(NSError *error, CMHandle poolHandle))completion;

/**
 Will refresh Indy pool with instanse's poolHandle.
 */
- (void)refresh:(void (^)(NSError * error))completion;

/**
 Will close Indy pool with instanse's poolHandle.
 */
- (void)close:(void (^)(NSError *error))completion;

/**
 Will delete Indy pool with instanse's poolHandle.
 */
- (void)deletePool:(void (^)(NSError *error))completion;



@end
