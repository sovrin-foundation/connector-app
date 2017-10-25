//
//  CMWalletObject.m
//  ConnectMeIndy
//

#import "CMWalletObject.h"
#import "CMEnvironment.h"
#import "ConnectSingleton.h"
#import "ConnectMeUtils.h"
#import <Indy/Indy.h>


@interface CMWalletObject()

@property (assign, readwrite) IndyHandle handle;
@property (strong, readwrite) NSString * type;
@property (strong, readwrite) NSString * name;

@end

@implementation CMWalletObject

- (instancetype)initWithName:(NSString *)name
                        type:(NSString *)walletType
{
    self = [super init];
    if (self) {
        self.handle = 0;
        self.name = (name) ? name : [CMEnvironment walletName] ;
        self.type = (walletType) ? walletType : @"default";
        self.isCreated = false;
        self.isOpened = false;
    }
    return self;
}

- (void)createWithPoolName:(NSString *)poolName
                completion:(void (^)(NSError *error))completion
{
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);

    
    __block CMWalletObject *welf = self;
    __block NSError *err;
     dispatch_async(queue, ^{
         
         [[IndyWallet sharedInstance] createWalletWithName:self.name
                                                  poolName:poolName
                                                      type:self.type
                                                    config:self.config
                                               credentials:self.credentials
                                                completion:^(NSError *xerror) {
                                                    err = xerror;
                                                    if (xerror.code == Success || xerror.code == WalletAlreadyExistsError)
                                                    {
                                                        welf.isCreated = true;
                                                    }
                                                    else
                                                    {
                                                        NSLog(@"Failed to create wallet with name: %@. Error: %ld", welf.name, (long)xerror.code );
                                                        welf.isCreated = false;
                                                    }
                                                    dispatch_semaphore_signal(semaphore);
                                                }];

         dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
         
         dispatch_async(dispatch_get_main_queue(), ^{
             completion(err);
         });
     });
}

- (void)open:(void (^)(NSError *error, IndyHandle walletHandle))completion
{
    __block CMWalletObject *welf = self;
    
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
    __block NSError *err;
    __block IndyHandle blockWalletHandle = 0;
    dispatch_async(queue, ^{
    [[IndyWallet sharedInstance] openWalletWithName:self.name
                                      runtimeConfig:self.runtimeConfig
                                        credentials:self.credentials
                                         completion:^(NSError *xerror, IndyHandle xwalletHandle){
                                             blockWalletHandle = xwalletHandle;
                                             err = xerror;
                                            if (xerror.code == Success)
                                            {
                                                welf.isOpened = true;
                                                welf.handle = xwalletHandle;
                                            }
                                            else
                                            {
                                                NSLog(@"Failed to open wallet with name: %@. Error: %ld", welf.name, (long)xerror.code );
                                                welf.isOpened = false;
                                            }
                                            
                                            dispatch_semaphore_signal(semaphore);
                                        }];
        dispatch_semaphore_wait(semaphore,  [ConnectMeUtils semaphoreTimeout]);
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(err, blockWalletHandle);
        });
    });
}

- (void)createAndOpenWithPoolName:(NSString *)poolName
                       completion:(void (^)(NSError *error, IndyHandle walletHandle))completion
{
    
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
    dispatch_async(queue, ^{
        
        __block NSError *err;
        
        // 1. create
        
        [self createWithPoolName:poolName
                      completion:^(NSError *xerror) {
              dispatch_async(queue, ^{
                  NSLog(@"CMWalletObject::CreateAndOpen - Received create wallet callback with error: %ld", (long)err.code);
                  err = xerror;
                  dispatch_semaphore_signal(semaphore);
              });
        }];
        
        
        dispatch_semaphore_wait(semaphore,  [ConnectMeUtils semaphoreTimeout]);
        
        if (err.code != Success && err.code != WalletAlreadyExistsError)
        {
            NSLog(@"CMWalletObject::CreateAndOpen - error code doesn't match Success or WalletAlreadyExistsError.");
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, self.handle);
            });
            return;
        }
        
        // 2. open wallet
        
        if (self.handle == 0)
        {
            [self open:^(NSError *xerror, IndyHandle xwalletHandle) {
                dispatch_async(queue, ^{
                    NSLog(@"CMWalletObject::CreateAndOpen - Received open wallet callback with error: %ld", (long)err.code);
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

- (void)close:(void (^)(NSError *error))completion
{
    [[IndyWallet sharedInstance] closeWalletWithHandle:self.handle
                                            completion:^(NSError *xerror) {
                                                if (xerror.code == Success)
                                                {
                                                    self.handle = 0;
                                                    self.isOpened = false;
                                                }
                                                else
                                                {
                                                    NSLog(@"Failed to close wallet with handle: %d. Error: %ld", (int)self.handle, (long)xerror.code);
                                                }
                                                
                                                completion(xerror);
                                            }];
    
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
    __block NSError *err;
    dispatch_async(queue, ^{
        [[IndyWallet sharedInstance] closeWalletWithHandle:self.handle
                                                completion:^(NSError *xerror) {
                                                    err = xerror;
                                                    if (xerror.code == Success)
                                                    {
                                                        self.handle = 0;
                                                        self.isOpened = false;
                                                    }
                                                    else
                                                    {
                                                        NSLog(@"Failed to close wallet with handle: %d. Error: %ld", (int)self.handle, (long)xerror.code);
                                                    }
                                                    
                                                    dispatch_semaphore_signal(semaphore);
                                                }];
        dispatch_semaphore_wait(semaphore,  [ConnectMeUtils semaphoreTimeout]);
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(err);
        });
    });
}

- (void)deleteWallet:(void (^)(NSError *error))completion
{
    dispatch_queue_t queue = ConnectMeIndy.sharedInstance.queue;
    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
    __block NSError *err;
    dispatch_async(queue, ^{
        [[IndyWallet sharedInstance] deleteWalletWithName:self.name
                                              credentials:self.credentials
                                               completion:^(NSError *xerror) {
                                                   
                                                   err = xerror;
                                                   if (xerror.code == Success)
                                                   {
                                                       self.isCreated = false;
                                                   }
                                                   else
                                                   {
                                                       NSLog(@"Failed to delete wallet with name: %d. Error: %ld", (int)self.name, (long)xerror.code);
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
