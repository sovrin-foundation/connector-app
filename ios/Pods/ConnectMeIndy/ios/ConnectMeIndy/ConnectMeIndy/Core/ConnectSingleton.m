//
//  ConnectMeIndy.m
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 27/09/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import "ConnectSingleton.h"
#import "NS+BTCBase58.h"
#import "JSONConverter.h"
#import "CMLedgerUtils.h"
#import "CMPairwiseUtils.h"
#import "CMAnoncredsUtils.h"
#import "ConnectMeUtils.h"
#import <Indy/Indy.h>
    
@interface ConnectMeIndy()

/**
 Serial queue, used to execute all operations.
 */
@property (nonatomic, strong) dispatch_queue_t globalQueue;

@property (nonatomic, strong) dispatch_queue_t serialQueue;

@property (nonatomic, strong) NSString *signatureType;

@property (strong) NSString *masterSecretName;

@end

@implementation ConnectMeIndy

+ (ConnectMeIndy *)sharedInstance
{
    static ConnectMeIndy *instance = nil;
    static dispatch_once_t dispatch_once_block;
    
    dispatch_once(&dispatch_once_block, ^ {
        instance = [ConnectMeIndy new];
        
        instance.pool = [[CMPoolObject alloc] initWithName:nil nodesConfig:nil];
        instance.wallet = [[CMWalletObject alloc] initWithName:nil type:nil];
        instance.myIdentityJson = @"{}";
        instance.signatureType = @"CL";
        instance.globalQueue = dispatch_queue_create("org.hyperledger.ConnectMeIndy.globalConcurrentQueue", DISPATCH_QUEUE_CONCURRENT);
        instance.serialQueue = dispatch_queue_create("org.hyperledger.ConnectMeIndy.serialQueue", DISPATCH_QUEUE_SERIAL);
    });
    
    return instance;
}

- (dispatch_time_t)semaphoreTimeout
{
    return  dispatch_time(DISPATCH_TIME_NOW, (60.0 * NSEC_PER_SEC));
}
    

- (dispatch_queue_t)queue
{
    return self.globalQueue;
}

/**
 
 Will generate a pairwise DID for theirDid if it is a first time connection with this DID.
 
 */
- (void)addConnectionWithRemoteDid:(NSString *)remoteDid
                      remoteVerkey:(NSString *)remoteVerkey
                          metadata:(NSDictionary *)metadata
                        completion:(void (^)(NSError *error, NSString *pairwiseInfo)) completion
{
    NSLog(@"ConnectMeIndy::addConnectionWithRemoteDid is called.");
    
    __block ConnectMeIndy *welf = self;
    dispatch_async(welf.globalQueue, ^{
        
        __block IndyHandle walletHandle = 0;
        __block IndyHandle poolHandle = 0;
        __block NSError *err;
        dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        
        // 1. Obtain wallet hanle
        
        [self obtainHandles:^(NSError *xerror, IndyHandle xwalletHandle, IndyHandle xpoolHandle) {
            dispatch_async(welf.globalQueue,^{
                err = xerror;
                walletHandle = xwalletHandle;
                poolHandle = xpoolHandle;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (walletHandle == 0 || poolHandle == 0)
        {
            NSLog(@"Failed to obtain wallet handle. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // 2. check if pairwise did exists for their did
        
        __block BOOL pairExists = false;
        
        [IndyPairwise isPairwiseExistsForDid:remoteDid
                                walletHandle:walletHandle
                                  completion:^(NSError *xerror, BOOL exists) {
            dispatch_async(welf.globalQueue,^{
                err = xerror;
                pairExists = exists;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code != Success)
        {
            NSLog(@"IndyPairwise::isPairwiseExistsForDid failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        NSMutableDictionary *pairwiseInfo = [NSMutableDictionary new];
        pairwiseInfo[@"userDID"] = nil;
        pairwiseInfo[@"verificationKey"] = nil;
        
        // 3. Create pairwise if needed
        if (pairExists == false)
        {
            
            // 3.1 create myDid
            __block NSString *myDid;
            __block NSString *myVerkey;
            [IndySignus createAndStoreMyDid:welf.myIdentityJson
                               walletHandle:walletHandle
                                 completion:^(NSError *xerror,
                                              NSString *did,
                                              NSString *verkey,
                                              NSString *pk) {
                                     dispatch_async(welf.globalQueue,^{
                                         myDid = did;
                                         myVerkey = verkey;
                                         err = xerror;
                                         dispatch_semaphore_signal(semaphore);
                                    });
                                 }];
            
            dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
            
            if (err.code != Success)
            {
                NSLog(@"IndySignus::createAndStoreMyDid failed. Error: %ld", (long)err.code);
                dispatch_async(dispatch_get_main_queue(), ^{
                    completion(err, nil);
                });
                return;
            }
            
            NSString *theirIdentityJson = [NSString stringWithFormat:@"{\"did\":\"%@\", \"verkey\": \"%@\"}", remoteDid, remoteVerkey];

            // 3.2 store remoteDid
            [IndySignus storeTheirDid:theirIdentityJson
                         walletHandle:walletHandle
                           completion:^(NSError *xerror) {
                               dispatch_async(welf.globalQueue,^{
                                   err = xerror;
                                   dispatch_semaphore_signal(semaphore);
                               });
                           }];

            dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
            
            // storeTheirDid failed
            if (err.code != Success)
            {
                NSLog(@"IndySignus::storeTheirDid failed. Error: %ld", (long)err.code);
                dispatch_async(dispatch_get_main_queue(), ^{
                    completion(err, nil);
                });
                return;
            }
            
            // 3.3 create pairwise
            
            // Insert myVerkey into metadata
            NSDictionary *newMetadata = [CMPairwiseUtils insertVerkey:myVerkey
                                                         intoMetadata:metadata];
            
            [IndyPairwise createPairwiseForTheirDid:remoteDid
                                              myDid:myDid
                                           metadata:[JSONConverter convertToString:newMetadata]
                                       walletHandle:walletHandle
                                         completion:^(NSError *xerror) {
                                             dispatch_async(welf.globalQueue,^{
                                                 err = xerror;
                                                 dispatch_semaphore_signal(semaphore);
                                             });
                                         }];
            
            dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
            
            if (err.code == Success)
            {
                pairwiseInfo[@"userDID"] = myDid;
                pairwiseInfo[@"verificationKey"] = myVerkey;
            }
            else
            {
                NSLog(@"IndyPairwise::createPairwiseForTheirDid failed. Error: %ld", (long)err.code);
                dispatch_async(dispatch_get_main_queue(), ^{
                    completion(err, nil);
                });
                return;
            }
        }
        else
        {
            // 3.1 Get stored pairwise did
            
            __block NSString *myDid;
            __block NSString *oldMetadataJSON;
            [CMPairwiseUtils getPairwiseInfoForDid:remoteDid
                                        fromWallet:walletHandle
                                           inQueue:welf.globalQueue
                                        completion:^(NSError *xerror, NSString *xmyDid, NSString *xmetadata) {
                                            dispatch_async(self.globalQueue,^{
                                                err = xerror;
                                                myDid = xmyDid;
                                                oldMetadataJSON = xmetadata;
                                                dispatch_semaphore_signal(semaphore);
                                            });
                                        }];
            
            dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
            
            if (err.code != Success)
            {
                NSLog(@"GetPairwiseInfoForDid failed. Error: %ld", (long)err.code);
                dispatch_async(dispatch_get_main_queue(), ^{
                    completion(err, nil);
                });
                return;
            }
            
            NSDictionary *oldMetadata = [JSONConverter convertToDictionary:oldMetadataJSON];
            NSString * verkey = oldMetadata[@"verificationKey"];
            
            NSDictionary *newMetadata = [CMPairwiseUtils insertVerkey:verkey
                                                        intoMetadata:metadata];
            NSString *newMetadataString = [JSONConverter convertToString:newMetadata];
            
            if (newMetadataString != nil)
            {
                [IndyPairwise setPairwiseMetadata:newMetadataString
                                      forTheirDid:remoteDid
                                     walletHandle:walletHandle
                                       completion:^(NSError *xerror) {
                                           dispatch_async(welf.globalQueue,^{
                                               err = xerror;
                                               dispatch_semaphore_signal(semaphore);
                                           });
                                       }];
                dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
                
                if (err.code != Success)
                {
                    NSLog(@"IndyPairwise::setPairwiseMetadata failed. Error: %ld", (long)err.code);
                    dispatch_async(dispatch_get_main_queue(), ^{
                        completion(err, nil);
                    });
                    return;
                }
            }
            
            
            pairwiseInfo[@"userDID"] = myDid;
            pairwiseInfo[@"verificationKey"] = verkey;
        }
       
        // 4. invoke completion
        
        NSString *pairwiseInfoJson = [JSONConverter convertToString:pairwiseInfo];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(nil, pairwiseInfoJson);
        });
    });
}

/**
Will return metadata and userDid for remote did, processed in addConnection call.
 
Callback will be invoked in main queue.
*/
- (void)getConnectionForDid:(NSString *)remoteDid
                   completion:(void (^)(NSError *error,
                                        NSString * did,
                                        NSString * metadata)) completion
{
    dispatch_async(self.globalQueue, ^{
        
        __block IndyHandle walletHandle = 0;
        __block dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        __block ConnectMeIndy *welf = self;
        __block NSError *err;
        
        // 1. Obtain wallet hanle
        
        [self obtainHandles:^(NSError *xerror, IndyHandle xwalletHandle, IndyHandle xpoolHandle) {
            dispatch_async(welf.globalQueue,^{
                err = xerror;
                walletHandle = xwalletHandle;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (walletHandle == 0)
        {
            NSLog(@"Failed to obtain wallet handle. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil, nil);
            });
            return;
        }
        
        // 2. check if pairwise did exists for their did
        
        __block BOOL pairExists = false;
        [IndyPairwise isPairwiseExistsForDid:remoteDid
                                walletHandle:walletHandle
                                  completion:^(NSError *xerror, BOOL exists) {
                                      dispatch_async(self.globalQueue,^{
                                          err = xerror;
                                          pairExists = exists;
                                          dispatch_semaphore_signal(semaphore);
                                      });
                                  }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        // check completion error code
        if (err.code != Success)
        {
            NSLog(@"IndyPairwise::isPairwiseExistsForDid failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil, nil);
            });
            return;
        }
        
        // check if pairwise inso exists for this did
        if (pairExists == false)
        {
            NSLog(@"No pairwise info is stored for DID: %@.", remoteDid);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil, nil);
            });
            return;
        }
        
        // 3. Get pairwise info
        
        __block NSString *myDid;
        __block NSString *theirMetadata;
        
        [CMPairwiseUtils getPairwiseInfoForDid:remoteDid
                                  fromWallet:walletHandle
                                     inQueue:welf.globalQueue
                                  completion:^(NSError *xerror, NSString *xmyDid, NSString *xmetadata) {
                                      dispatch_async(self.globalQueue,^{
                                          err = xerror;
                                          myDid = xmyDid;
                                          theirMetadata = xmetadata;
                                          dispatch_semaphore_signal(semaphore);
                                      });
                                  }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code != Success)
        {
            NSLog(@"getPairwiseInfoForDid failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, myDid,theirMetadata);
            });
            return;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(nil, myDid, theirMetadata);
        });
    });
}

/**
 encryptedPayload and nonce - string is base58 encoding.
 */
- (void)encryptPayload:(NSString *)payload
          forRemoteDid:(NSString *)remoteDid
            completion:(void (^)(NSError *error,
                                 NSString * encryptedPayload,
                                 NSString * nonce)) completion
{
    __block ConnectMeIndy *welf = self;
    dispatch_async(welf.globalQueue, ^{
        
        __block IndyHandle walletHandle = 0;
        __block IndyHandle poolHandle = 0;
        __block dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        __block NSError *err;
        
        // 1. Obtain wallet hanle
        
        [self obtainHandles:^(NSError *xerror, IndyHandle xwalletHandle, IndyHandle xpoolHandle) {
            dispatch_async(welf.globalQueue,^{
                err = xerror;
                walletHandle = xwalletHandle;
                poolHandle = xpoolHandle;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (walletHandle == 0)
        {
            NSLog(@"Failed to obtain wallet handle. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil, nil);
            });
            return;
        }
        
        // 2. Get pairwise info
        
        __block NSString *myDid;
        
        [CMPairwiseUtils getPairwiseInfoForDid:remoteDid
                                  fromWallet:walletHandle
                                     inQueue:welf.globalQueue
                                  completion:^(NSError *xerror, NSString *xmyDid, NSString *metadata) {
                                      dispatch_async(welf.globalQueue,^{
                                          err = xerror;
                                          myDid = xmyDid;
                                          dispatch_semaphore_signal(semaphore);
                                      });
                                  }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code != Success)
        {
            NSLog(@"getPairwiseInfoForDid failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil, nil);
            });
            return;
        }
        
        // 3. encrypt
        
        NSData *message = [payload dataUsingEncoding:NSUTF8StringEncoding];
        __block NSData *outEncryptedMessage;
        __block NSData *outNonce;
        [IndySignus encryptMessage:message
                             myDid:myDid
                               did:remoteDid
                      walletHandle:walletHandle
                              pool:poolHandle
                        completion:^(NSError *xerror, NSData *encryptedMsg, NSData *xnonce) {
                            dispatch_async(welf.globalQueue,^{
                                err = xerror;
                                outEncryptedMessage = encryptedMsg;
                                outNonce = xnonce;
                                dispatch_semaphore_signal(semaphore);
                            });
                        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code != Success)
        {
            NSLog(@"IndySignus::encryptMessage failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil, nil);
            });
            return;
        }
        
        NSString *base58message = [outEncryptedMessage base58String];
        NSString *base58nonce = [outNonce base58String];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(nil, base58message, base58nonce);
        });
    });
}

/**
 Payload and nonce are strings in base58 format
 
 decryptedPayload - string in utf8 format
 */
- (void)decryptPayload:(NSString *)payload
             withNonce:(NSString *)nonce
          forRemoteDid:(NSString *)remoteDid
            completion:(void (^)(NSError *error,
                                 NSString * decryptedPayload)) completion
{
    
    dispatch_async(self.globalQueue, ^{
        
        __block IndyHandle walletHandle = 0;
        __block dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        __block ConnectMeIndy *welf = self;
        __block NSError *err;
        
        // 1. Obtain wallet hanle
        
        [self obtainHandles:^(NSError *xerror, IndyHandle xwalletHandle, IndyHandle xpoolHandle) {
            dispatch_async(welf.globalQueue,^{
                err = xerror;
                walletHandle = xwalletHandle;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (walletHandle == 0)
        {
            NSLog(@"Failed to obtain wallet handle. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // 2. check if pairwise did exists for their did
        
        __block BOOL pairExists = false;
        [IndyPairwise isPairwiseExistsForDid:remoteDid
                                walletHandle:walletHandle
                                  completion:^(NSError *xerror, BOOL exists) {
                                      dispatch_async(self.globalQueue,^{
                                          err = xerror;
                                          pairExists = exists;
                                          dispatch_semaphore_signal(semaphore);
                                      });
                                  }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        // check completion error code
        if (err.code != Success)
        {
            NSLog(@"IndyPairwise::isPairwiseExistsForDid failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // check if pairwise inso exists for this did
        if (pairExists == false)
        {
            NSLog(@"No pairwise info is stored for DID: %@.", remoteDid);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // 3. Get pairwise info
        
        __block NSString *myDid;
        [CMPairwiseUtils getPairwiseInfoForDid:remoteDid
                                  fromWallet:walletHandle
                                     inQueue:welf.globalQueue
                                  completion:^(NSError *xerror, NSString *xmyDid, NSString *metadata) {
                                      dispatch_async(self.globalQueue,^{
                                          err = xerror;
                                          myDid = xmyDid;
                                          dispatch_semaphore_signal(semaphore);
                                      });
                                  }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code != Success)
        {
            NSLog(@"getPairwiseInfoForDid failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // 4. decrypt
        
        NSData *message = [payload dataFromBase58];
        NSData *dataNonce = [nonce dataFromBase58];
        __block NSData * decryptedMessage;
        [IndySignus decryptMessage:message
                             myDid:myDid
                               did:remoteDid
                             nonce:dataNonce
                      walletHandle:walletHandle
                        completion:^(NSError *xerror, NSData *xdecryptedMessage) {
                            dispatch_async(self.globalQueue,^{
                                err = xerror;
                                decryptedMessage = xdecryptedMessage;
                                dispatch_semaphore_signal(semaphore);
                            });

                        }];
        
         dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code != Success)
        {
            NSLog(@"IndySignus::decryptMessage failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        NSString *decryptedString = [[NSString alloc] initWithData:decryptedMessage
                                                          encoding:NSUTF8StringEncoding];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(nil, decryptedString);
        });
        
    });
}

// MARK: - Claim

/**
 Will return a json with combination of isuer_did and schema_seq_no.
 Provide it to getClaim function.
 */

- (void)addClaim:(NSString *)claimJSON
      completion:(void (^)(NSError *error, NSString *filterJson))completion
{
    dispatch_async(self.globalQueue, ^{
        
        __block IndyHandle walletHandle = 0;
        __block dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        __block ConnectMeIndy *welf = self;
        __block NSError *err;
        
        // 1. Obtain wallet hanle
        
        [self obtainHandles:^(NSError *xerror, IndyHandle xwalletHandle, IndyHandle xpoolHandle) {
            dispatch_async(welf.globalQueue,^{
                err = xerror;
                walletHandle = xwalletHandle;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (walletHandle == 0)
        {
            NSLog(@"Failed to obtain wallet handle. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        
        [IndyAnoncreds proverStoreClaim:claimJSON
                           walletHandle:walletHandle
                             completion:^(NSError *xerror) {
                                 dispatch_async(welf.globalQueue,^{
                                     err = xerror;
                                     dispatch_semaphore_signal(semaphore);
                                 });
                             }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code != Success)
        {
            NSLog(@"IndyAnoncreds::proverStoreClaim failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // configure filtersJSON
        
        NSDictionary *claim = [JSONConverter convertToDictionary:claimJSON];
        
        NSString *issuerDid = claim[@"issuer_did"];
        NSString *schemaSeqNo = claim[@"schema_seq_no"];
        
        NSMutableDictionary *filter = [NSMutableDictionary new];
        filter[@"issuer_did"] = issuerDid;
        filter[@"schema_seq_no"] = schemaSeqNo;
        
        NSString *filterJSON = [JSONConverter convertToString:filter];
        
        // invoke completion
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(nil, filterJSON);
        });
    });
}

- (void)getClaimForFilter:(NSString *)filterJSON
               completion:(void (^)(NSError *error, NSString *claim))completion
{
    NSLog(@"ConnectMeIndy::claimRequestForRemoteDid is called.");
    
    dispatch_async(self.globalQueue, ^{
        
        __block IndyHandle walletHandle = 0;
        __block NSError *err;
        __block ConnectMeIndy *welf = self;
        __block dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        
        // 1. Get wallet hanle
        [self obtainHandles:^(NSError *xerror, IndyHandle xwalletHandle, IndyHandle xpoolHandle) {
            dispatch_async(welf.globalQueue,^{
                err = xerror;
                walletHandle = xwalletHandle;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (walletHandle == 0)
        {
            NSLog(@"Failed to obtain wallet handle. Error: %ld", (long)err.code);
            completion(err, nil);
            return;
        }
        
        // get claimJSONS
        
        // result list of claim jsons
        __block NSString *claimsJSONList;
        [IndyAnoncreds proverGetClaimsWithFilter:filterJSON
                                    walletHandle:walletHandle
                                      completion:^(NSError *xerror, NSString *claimsJSON) {
                                          dispatch_async(welf.globalQueue,^{
                                              err = xerror;
                                              claimsJSONList = claimsJSON;
                                              dispatch_semaphore_signal(semaphore);
                                          });
                                      }];
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        

        if (err.code != Success)
        {
            NSLog(@"IndyAnoncreds::proverGetClaimsWithFilter failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        NSDictionary *claimJSONs = [JSONConverter convertToDictionary:claimsJSONList];
        
        if (claimJSONs == nil)
        {
            NSLog(@"Failed to convert claimsJSON to dictionary. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion([ConnectMeUtils errorWithIndyCode:CommonInvalidState], nil);
            });
            return;
        }
        
        // expecting to get one claim in array
        
        NSArray *claims = (NSArray *)claimJSONs;
        
        NSDictionary *claimDict = claims[0];
        
        if (claimDict == nil)
        {
            NSLog(@"Failed to get claim from claims json: %@.", claimsJSONList);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion([ConnectMeUtils errorWithIndyCode:CommonInvalidState], nil);
            });
            return;
        }
        
        NSString *claimJSON = [JSONConverter convertToString:claimDict];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion([ConnectMeUtils errorWithIndyCode:Success], claimJSON);
        });
        return;
    });
}


- (void)generateClaimRequestForRemoteDid:(NSString *)remoteDid
                              claimOffer:(NSString *)claimOffer
                              completion:(void (^)(NSError *error,
                                                   NSString *generatedClaimReqJSON))completion
{
    NSLog(@"ConnectMeIndy::claimRequestForRemoteDid is called.");
    
    dispatch_async(self.globalQueue, ^{
        
        __block IndyHandle walletHandle = 0;
        __block IndyHandle poolHandle = 0;
        __block NSError *err;
        __block ConnectMeIndy *welf = self;
        __block dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        
        // 1. Get wallet hanle
        [self obtainHandles:^(NSError *xerror, IndyHandle xwalletHandle, IndyHandle xpoolHandle) {
            dispatch_async(welf.globalQueue,^{
                err = xerror;
                walletHandle = xwalletHandle;
                poolHandle = xpoolHandle;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (walletHandle == 0)
        {
            NSLog(@"Failed to obtain wallet handle. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // 2. Get pairwise did for theirDid
        
        __block NSString * myDid;
        
        [CMPairwiseUtils getPairwiseInfoForDid:remoteDid fromWallet:walletHandle
                                       inQueue:welf.globalQueue
                                    completion:^(NSError *xerror, NSString *xmyDid, NSString *metadata) {
                                        dispatch_async(welf.globalQueue,^{
                                            err = xerror;
                                            myDid = xmyDid;
                                            dispatch_semaphore_signal(semaphore);
                                        });
                                    }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code != Success)
        {
            NSLog(@"getPairwiseInfoForDid failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // 3. Get schemaSeqNo from claimOffer
        
        NSDictionary *claimOfferDict = [JSONConverter convertToDictionary:claimOffer];
        NSNumber *schemaSeqNo = claimOfferDict[@"schema_seq_no"];
        
        if (schemaSeqNo == nil)
        {
            NSLog(@"Failed to fetch schema_seq_no field from claimOffer: %@.", claimOffer);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion([ConnectMeUtils errorWithIndyCode:CommonInvalidState], nil);
            });
            return;
        }
        
        // 4. get claim def
        
        __block NSString *claimDefJSON;
        
        [CMLedgerUtils getClaimDefFromLedgerForSubmitterDid:myDid
                                                remoteDid:remoteDid
                                              schemaSeqNo:schemaSeqNo
                                             walletHandle:walletHandle
                                               poolHandle:poolHandle
                                                  inQueue:welf.globalQueue
                                               completion:^(NSError *xerror, NSString *xclaimDefJSON) {
                                                   err = xerror;
                                                   claimDefJSON = xclaimDefJSON;
                                                   dispatch_semaphore_signal(semaphore);

                                               }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code != Success)
        {
            NSLog(@"CMLedgerUtils:getClaimDefFromLedgerForSubmitterDid failed with code: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        __block NSString *claimRequestJSON;
        [IndyAnoncreds proverCreateAndStoreClaimReqWithClaimDef:claimDefJSON
                                                      proverDID:myDid
                                                 claimOfferJSON:claimOffer
                                               masterSecretName:welf.masterSecretName
                                                   walletHandle:walletHandle
                                                     completion:^(NSError *xerror, NSString *claimReqJSON) {
                                                         dispatch_async(welf.globalQueue,^{
                                                             err = xerror;
                                                             claimRequestJSON = claimReqJSON;
                                                             dispatch_semaphore_signal(semaphore);
                                                         });
                                                     }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code != Success)
        {
            NSLog(@"IndyAnoncreds:proverCreateAndStoreClaimReqWithClaimDef failed with code: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // invoke completion
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(nil, claimRequestJSON);
        });
    });
}


// MARK: - Proof


/**
 Result can be usen in generateProofForRemoteDid
 */
- (void)prepareProofForRequest:(NSString *)proofRequest
                    completion:(void (^)(NSError *error, NSString *claimsJSON))completion
{
    dispatch_async(self.globalQueue, ^{
        
        __block IndyHandle walletHandle = 0;
        __block NSError *err;
        __block ConnectMeIndy *welf = self;
        __block dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        
        // 1. Get wallet hanle
        [welf obtainHandles:^(NSError *xerror, IndyHandle xwalletHandle, IndyHandle xpoolHandle) {
            dispatch_async(welf.globalQueue,^{
                err = xerror;
                walletHandle = xwalletHandle;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (walletHandle == 0)
        {
            NSLog(@"Failed to obtain wallet handle. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        __block NSString *claimsJSON;
        [IndyAnoncreds proverGetClaimsForProofReq:proofRequest
                                     walletHandle:walletHandle
                                       completion:^(NSError *xerror, NSString *xclaimsJSON) {
                                           dispatch_async(welf.globalQueue,^{
                                               err = xerror;
                                               claimsJSON = xclaimsJSON;
                                               dispatch_semaphore_signal(semaphore);
                                           });
                                       }];
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(nil, claimsJSON);
        });
    });
}


/**
 
 requestedClaimsJson -  {
 ///         "requested_attr1_uuid": [claim1_uuid_in_wallet, true <reveal_attr>],
 ///         "requested_attr2_uuid": [self_attested_attribute],
 ///         "requested_attr3_uuid": [claim2_seq_no_in_wallet, false]
 ///         "requested_attr4_uuid": [claim2_seq_no_in_wallet, true]
 ///         "requested_predicate_1_uuid": [claim2_seq_no_in_wallet],
 ///         "requested_predicate_2_uuid": [claim3_seq_no_in_wallet],
 ///     }
 
 claims - result of prepareproof function
 
 What is needed to get from ledger:
 
 1. Get unique pairs of issuerDid:seqNo from claims
 2. get claim defs for those pairs
 3. get schemas for those pairs
 4. get revocation registries
 */

- (void)generateProofForRequest:(NSString *)proofRequest
                      remoteDid:(NSString *)remoteDid
            requestedClaimsJson:(NSString*)requestedClaimsJson
                         claims:(NSString *)claims
                     completion:(void (^)(NSError *error, NSString *generatedProof))completion
{
    NSLog(@"ConnectMeIndy::generateProofForRemoteDid is called.");
    
    dispatch_async(self.globalQueue, ^{
        
        __block IndyHandle walletHandle = 0;
        __block IndyHandle poolHandle = 0;
        __block NSError *err;
        __block ConnectMeIndy *welf = self;
        __block dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        
        // 1. Get wallet hanle
        [welf obtainHandles:^(NSError *xerror, IndyHandle xwalletHandle, IndyHandle xpoolHandle) {
            dispatch_async(welf.globalQueue,^{
                walletHandle = xwalletHandle;
                poolHandle = xpoolHandle;
                err = xerror;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (walletHandle == 0)
        {
            NSLog(@"Failed to obtain wallet handle. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        __block NSString *myDid;
        
        // 2. get pairwise did
        [CMPairwiseUtils getPairwiseInfoForDid:remoteDid
                                  fromWallet:walletHandle
                                     inQueue:welf.globalQueue
                                  completion:^(NSError *xerror, NSString *xmyDid, NSString *metadata) {
                                      dispatch_async(welf.globalQueue,^{
                                          err = xerror;
                                          myDid = xmyDid;
                                          dispatch_semaphore_signal(semaphore);
                                      });
                                  }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        
        // 3. get schemasJSON and claimDefsJSON
        __block NSString *schemasJSON;
        __block NSString *claimDefsJSON;
        [CMAnoncredsUtils getDataFromLedgerForClaimsJSON:claims
                                                   myDid:myDid
                                                 inQueue:welf.globalQueue
                                            walletHandle:walletHandle
                                              poolHandle:poolHandle
                                              completion:^(NSError *xerror, NSString *xschemasJSON, NSString *xclaimDefsJSON) {
                                                  err = xerror;
                                                  schemasJSON = xschemasJSON;
                                                  claimDefsJSON = xclaimDefsJSON;
                                                  dispatch_semaphore_signal(semaphore);
                                              }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code == 0)
        {
            NSLog(@"Failed to obtain schemasJSON and claimdefsJSON for data in claimsJSON. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }

        
        // 4. generate proof
        __block NSString *proofJSON;
        [IndyAnoncreds proverCreateProofForRequest:proofRequest
                               requestedClaimsJSON:requestedClaimsJson
                                       schemasJSON:schemasJSON
                                  masterSecretName:welf.masterSecretName
                                     claimDefsJSON:claimDefsJSON
                                     revocRegsJSON:@"{}"
                                      walletHandle:walletHandle
                                        completion:^(NSError *xerror, NSString *xproofJSON) {
                                            dispatch_async(self.globalQueue,^{
                                                err = xerror;
                                                proofJSON = xproofJSON;
                                                dispatch_semaphore_signal(semaphore);
                                            });
                                        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code == 0)
        {
            NSLog(@"IndyAnoncreds:proverCreateProofForRequest failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(nil, proofRequest);
        });
    });
}

// MARK: - Public Utilities
/**
 Will create master secret.
 */
- (void)createMasterSecretNamed:(NSString *)masterSecretName
                     completion:(void (^)(NSError *error)) completion
{
    dispatch_async(self.globalQueue, ^{

        __block IndyHandle walletHandle = 0;
        __block dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        __block ConnectMeIndy *welf = self;
        __block NSError *err;
        
        // 1. Get wallet hanle
        [self obtainHandles:^(NSError *xerror, IndyHandle xwalletHandle, IndyHandle xpoolHandle) {
            dispatch_async(welf.globalQueue,^{
                walletHandle = xwalletHandle;
                err = xerror;
                dispatch_semaphore_signal(semaphore);
            });
        }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (walletHandle == 0)
        {
            NSLog(@"Failed to obtain wallet handle. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err);
            });
            return;
        }
        
        // Generate master secret
        [IndyAnoncreds proverCreateMasterSecretNamed:masterSecretName
                                        walletHandle:welf.wallet.handle
                                          completion:^(NSError *xerror) {
                                              err = xerror;
                                              dispatch_semaphore_signal(semaphore);
                                          }];
        
        dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
        
        if (err.code == Success || err.code == AnoncredsMasterSecretDuplicateNameError)
        {
            welf.masterSecretName = masterSecretName;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(nil);
        });
    });
}

// MARK: - Private utility

/**
 Will return wallet handle in completion.
 
 Steps:
 1. Check that wallet object has handle. Return it, if handle != 0.
 2. Create and open pool if not done already.
 3. Create and open wallet
 
 Callback is invoked in caller's thread.
 */
- (void)obtainHandles:(void (^)(NSError *error, IndyHandle walletHandle, IndyHandle poolHandle)) completion
{
    __block ConnectMeIndy *welf = self;
    __block dispatch_semaphore_t serialSemaphore = dispatch_semaphore_create(0);
    
    dispatch_async(welf.serialQueue, ^{
        
        if (welf.wallet.handle != 0 && welf.pool.handle != 0)
        {
            dispatch_async(dispatch_get_main_queue(), ^{
                completion([ConnectMeUtils errorWithIndyCode:Success], welf.wallet.handle, welf.pool.handle);
            });
            return;
        }
        
        dispatch_async(welf.globalQueue, ^{
            
            __block dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
            
            // 1. Check pool and get pool handle
            __block NSError *err;
            __block IndyHandle poolHandle = 0;
            
            if (welf.pool.handle == 0)
            {
                NSLog(@"addConnection: Pool handle is 0. Will attempt to create and open pool.");
                [welf.pool createAndOpen:^(NSError *xerror, IndyHandle xpoolHandle) {
                    dispatch_async(welf.globalQueue, ^{
                        err = xerror;
                        poolHandle = xpoolHandle;
                        dispatch_semaphore_signal(semaphore);
                    });
                }];
                
                dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
            }
            else
            {
                poolHandle = welf.pool.handle;
            }
            
            if (poolHandle == 0)
            {
                NSLog(@"ConnectMeIndy::obtainHadles - Failed to open pool. Error: %ld", (long)err.code);
                dispatch_semaphore_signal(serialSemaphore);
                dispatch_async(dispatch_get_main_queue(), ^{
                    completion(err, 0, 0);
                });
                return;
            }
            
            // 2. Create wallet
            [welf.wallet createWithPoolName:self.pool.name
                                 completion:^(NSError *xerror) {
                                     dispatch_async(welf.globalQueue, ^{
                                         err = xerror;
                                         dispatch_semaphore_signal(semaphore);
                                     });
                                 }];
            
            dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
            
            __block IndyHandle bwalletHandle;
            if (welf.wallet.isOpened == false)
            {
                [welf.wallet open:^(NSError *xerror, IndyHandle xwalletHandle) {
                    dispatch_async(welf.globalQueue, ^{
                        err = xerror;
                        bwalletHandle = xwalletHandle;
                        dispatch_semaphore_signal(semaphore);
                    });
                }];
                
                dispatch_semaphore_wait(semaphore, welf.semaphoreTimeout);
                
                if (welf.wallet.isOpened != true)
                {
                    NSLog(@"Failed to open wallet with name:%@. Error: %ld",welf.wallet.name, (long)err.code);
                    dispatch_semaphore_signal(serialSemaphore);
                    dispatch_async(dispatch_get_main_queue(), ^{
                        completion(err, 0, welf.pool.handle);
                    });
                    return;
                }
            }
            
            dispatch_semaphore_signal(serialSemaphore);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion([ConnectMeUtils errorWithIndyCode:Success], welf.wallet.handle, welf.pool.handle);
            });
        });
        
        dispatch_semaphore_wait(serialSemaphore, [self semaphoreTimeout]);
    });
}

@end


