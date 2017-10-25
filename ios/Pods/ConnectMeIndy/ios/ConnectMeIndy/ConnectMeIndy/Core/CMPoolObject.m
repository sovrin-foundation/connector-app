//
//  CMPoolObject.m
//  ConnectMeIndy
//

#import "CMPoolObject.h"
#import "CMEnvironment.h"
#import "ConnectMeUtils.h"
#import "ConnectSingleton.h"
#import <Indy/Indy.h>


@interface CMPoolObject ()

@property (readwrite, strong) NSString *nodesConfig;

@property (readwrite, strong) NSString *poolConfig;

@property (readwrite, strong) NSString * poolIp;

@property (readwrite, strong) NSString * name;

@property (readwrite, assign) IndyHandle handle;

- (NSString *)poolConfigJsonForTxnFilePath:(NSString *)txnFilePath;

- (NSString *)createGenesisTxnFile;

@end

@implementation CMPoolObject

- (instancetype)initWithName: (NSString *)name
                 nodesConfig: (NSString *)nodesConfig
{
    self = [super init];
    if (self) {
        self.name = (name) ? name : [CMEnvironment poolName];
        self.nodesConfig = (nodesConfig) ? nodesConfig :[CMEnvironment defaultNodesConfig];
        self.handle = 0;
        self.isCreated = false;
        self.isOpened = false;
    }
    return self;
}

//// MARK: - TXN File

// Note that to be config valid it assumes genesis txt file already exists.
- (NSString *)poolConfigJsonForTxnFilePath:(NSString *)txnFilePath
{
    return [NSString stringWithFormat:@"{\"genesis_txn\":\"%@\"}", txnFilePath];
}

- (NSString *)createGenesisTxnFile;
{
    NSString *filePath;
    if (!self.txnFilePath)
    {
        filePath = [NSString stringWithFormat:@"%@%@.txn", [CMEnvironment getUserTmpDir], self.name];
    }
    else
    {
        filePath = self.txnFilePath;
    }

    NSString *fileContent = self.nodesConfig;

    BOOL isSuccess =  [[NSFileManager defaultManager] createFileAtPath:filePath
                                                              contents:[NSData dataWithBytes:[fileContent UTF8String]
                                                                                      length:[fileContent length]]
                                                            attributes:nil];
    
    if (isSuccess == false)
    {
        return nil;
    }
    
    return filePath;
}

// MARK: - Indy interaction

/**
 Will create Indy pool using stored parameters.
 */
- (void)create:(void (^)(NSError *error))completion
{
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
    if (self.poolConfig == nil)
    {
        NSString *txnFilePath = [self createGenesisTxnFile];
        if (txnFilePath != nil)
        {
            self.txnFilePath = txnFilePath;
        }
        
        NSString *poolConfig = [self poolConfigJsonForTxnFilePath:txnFilePath];
        
        if (poolConfig != nil)
        {
            self.poolConfig = poolConfig;
        }
    }
    
    __block CMPoolObject *welf = self;
    __block NSError *err;
    dispatch_async(queue, ^{
    [IndyPool createPoolLedgerConfigWithPoolName:self.name
                                      poolConfig:self.poolConfig
                                      completion:^(NSError *xerror) {
                                          dispatch_async(queue, ^{
                                              err = xerror;
                                              if (xerror.code == Success || xerror.code == PoolLedgerConfigAlreadyExistsError)
                                              {
                                                  welf.isCreated = TRUE;
                                              }
                                              
                                              dispatch_semaphore_signal(semaphore);
                                          });
                                      }];
        dispatch_semaphore_wait(semaphore,  [ConnectMeUtils semaphoreTimeout]);
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(err);
        });
    });
}

/**
 Will open Indy pool using instance's parameters.
 */
- (void)open:(void (^)(NSError *error, IndyHandle poolHandle))completion
{
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
    __block CMPoolObject *welf = self;
    dispatch_async(queue, ^{
        
        __block NSError *err;
        [IndyPool openPoolLedgerWithName:welf.name
                              poolConfig:welf.poolConfig
                              completion:^(NSError *xerror, IndyHandle blockHandle)
         {
             dispatch_async(queue, ^{
                 welf.handle = blockHandle;
                 err = xerror;
                 if (xerror.code == Success)
                 {
                     welf.isOpened = TRUE;
                 }
                 
                 dispatch_semaphore_signal(semaphore);
             });
         }];
        
         dispatch_semaphore_wait(semaphore,  [ConnectMeUtils semaphoreTimeout]);
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(err, welf.handle);
        });
    });
}

/**
 Will create and open Indy pool.
 
 Calls will be performed in CennectMeIndy singletone's serial queue.
 */
- (void)createAndOpen:(void (^)(NSError *error, IndyHandle poolHandle))completion
{
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
    
    dispatch_async(queue, ^{
    
        __block NSError *err;
        
        [self create:^(NSError *xerror) {
            dispatch_async(queue, ^{
                err = xerror;
                NSLog(@"Pool create callback is triggered.");
                dispatch_semaphore_signal(semaphore);
            });
        }];
    
        
        dispatch_semaphore_wait(semaphore,  [ConnectMeUtils semaphoreTimeout]);
        
        if (err.code != Success && err.code != PoolLedgerConfigAlreadyExistsError)
        {
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, self.handle);
            });
            return;
        }
        
        if (self.handle == 0)
        {
            [self open:^(NSError *xerror, IndyHandle xpoolHandle) {
                dispatch_async(queue, ^{
                    err = xerror;
                    dispatch_semaphore_signal(semaphore);
                });
            }];
            
            dispatch_semaphore_wait(semaphore,  [ConnectMeUtils semaphoreTimeout]);
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
             completion(err, self.handle);
        });
    });
}


/**
 Will refresh Indy pool with instanse's poolHandle.
 */
- (void)refresh:(void (^)(NSError * error))completion
{
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
    
    dispatch_async(queue, ^{
        
        __block NSError *err;
        
        [IndyPool refreshPoolLedgerWithHandle:self.handle
                                   completion:^(NSError *xerror)
         {
             dispatch_async(queue, ^{
                 err = xerror;
                 dispatch_semaphore_signal(semaphore);
             });
         }];
        
        dispatch_semaphore_wait(semaphore,  [ConnectMeUtils semaphoreTimeout]);
        
        dispatch_async(dispatch_get_main_queue(), ^{
           completion(err);
        });
    });
}

/**
 Will close Indy pool with instanse's poolHandle.
 */
- (void)close:(void (^)(NSError *error))completion
{
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
    dispatch_async(queue, ^{
        
    __block NSError *err;
    [IndyPool closePoolLedgerWithHandle:self.handle
                             completion:^(NSError *xerror) {
                                 
                                 dispatch_async(queue, ^{
                                     err = xerror;
                                     if (xerror.code == Success )
                                     {
                                         self.isOpened = false;
                                     }
                                     
                                     dispatch_semaphore_signal(semaphore);
                                 });
                                 
                             }];
        dispatch_semaphore_wait(semaphore,  [ConnectMeUtils semaphoreTimeout]);
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(err);
        });
    });
}

/**
 Will delete Indy pool with instanse's poolName.
 */
- (void)deletePool:(void (^)(NSError *error))completion
{
    
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
    __block NSError *err;
    dispatch_async(queue, ^{
        [IndyPool deletePoolLedgerConfigWithName:self.name
                                      completion:^(NSError *xerror) {
                                          err = xerror;
                                          if (xerror.code == Success)
                                          {
                                              self.isCreated = false;
                                          }
                                          
                                          dispatch_semaphore_signal(semaphore);
                                      }];
        dispatch_semaphore_wait(semaphore,  [ConnectMeUtils semaphoreTimeout]);
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(err);
        });
    });
}

@end
