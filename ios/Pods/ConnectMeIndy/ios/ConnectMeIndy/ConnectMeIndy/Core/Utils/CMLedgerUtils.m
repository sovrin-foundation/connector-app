//
//  CMLedgerUtils.m
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 12/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import "CMLedgerUtils.h"
#import "ConnectMeUtils.h"
#import "JSONConverter.h"
#import "CMPairwiseUtils.h"
#import "CMClaimDefinition.h"
#import "CMSchema.h"


@implementation CMLedgerUtils

+ (void)getSchemaDataBySeqNo:(NSNumber *)schemaSeqNo
                submitterDid:(NSString *)submitterDid
                  poolHandle:(IndyHandle)poolHandle
                walletHandle:(IndyHandle)walletHandle
                     inQueue:(dispatch_queue_t)queue
                  completion:(void (^)(NSError *error,
                                       NSString *schemaData)) completion
{
    dispatch_async(queue, ^{
        __block NSError *err;
        dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        
        // 1. build get txn request
        
        __block NSString *getTxnRequestJson;
        [IndyLedger buildGetTxnRequestWithSubmitterDid:submitterDid
                                                  data:schemaSeqNo
                                            completion:^(NSError *xerror, NSString *requestJSON) {
                                                dispatch_async(queue,^{
                                                    err = xerror;
                                                    getTxnRequestJson = requestJSON;
                                                    dispatch_semaphore_signal(semaphore);
                                                });
                                            }];
        
        dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
        
        if (err.code != Success || getTxnRequestJson == nil)
        {
            NSLog(@"IndyLedger:buildGetTxnRequestWithSubmitterDid failed. Error: %@", err);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // 2. send request
        
        __block NSString *getTxnResponceJSON;
        [IndyLedger signAndSubmitRequest:getTxnRequestJson
                            submitterDID:submitterDid
                              poolHandle:poolHandle
                            walletHandle:walletHandle
                              completion:^(NSError *xerror, NSString *requestResultJSON) {
                                  dispatch_async(queue,^{
                                      err = xerror;
                                      getTxnResponceJSON = requestResultJSON;
                                      dispatch_semaphore_signal(semaphore);
                                  });
                              }];
        
        dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
        
        if (err.code != Success || getTxnResponceJSON == nil)
        {
            NSLog(@"IndyLedger:signAndSubmitRequest failed. Error: %@", err);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        NSDictionary *getTxnResponce = [JSONConverter convertToDictionary:getTxnResponceJSON];
        
        NSDictionary *data = getTxnResponce[@"result"][@"data"][@"data"];
        NSString *dataJSON = [JSONConverter convertToString:data];
        
        if (data == nil)
        {
            NSLog(@"GetTxnResponce doesn't contain valid \"data\" field");
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, dataJSON);
            });
            return;
        }
        
        completion(err, dataJSON);
    });
}

/**
 Submitter did is my pairwise did
 */
+ (void)getSchemaFromLedgerForSubmitterDiD:(NSString *)submitterDid
                                 targetDid:(NSString *)targetDid
                                schemaData:(NSString *)schemaData
                              walletHandle:(IndyHandle)walletHandle
                                poolHandle:(IndyHandle)poolHandle
                                   inQueue:(dispatch_queue_t)queue
                                completion:(void (^)(NSError *error,
                                                     NSString *schemaJSON)) completion
{
    dispatch_async(queue, ^{
        __block NSError *err;
        dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);

        __block NSString *getSchemaRequestJSON;
        
        // 1. build get schema request
        [IndyLedger buildGetSchemaRequestWithSubmitterDid:submitterDid
                                                     dest:targetDid
                                                     data:schemaData
                                               completion:^(NSError *xerror, NSString *requestJSON) {
                                                   dispatch_async(queue,^{
                                                       err = xerror;
                                                       getSchemaRequestJSON = requestJSON;
                                                       dispatch_semaphore_signal(semaphore);
                                                   });
                                               }];
        
         dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
        
        if (err.code != Success || getSchemaRequestJSON == nil)
        {
            NSLog(@"Indyledger:buildGetSchemaRequestWithSubmitterDid failed with error: %@", err);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // 2. sign and submit request
        
        __block NSString *getSchemaResponceJSON;
        [IndyLedger signAndSubmitRequest:getSchemaRequestJSON
                            submitterDID:submitterDid
                              poolHandle:poolHandle
                            walletHandle:walletHandle
                              completion:^(NSError *xerror, NSString *requestResultJSON) {
                                  dispatch_async(queue,^{
                                      err = xerror;
                                      getSchemaResponceJSON = requestResultJSON;
                                      dispatch_semaphore_signal(semaphore);
                                  });
                              }];
        
        dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
        
        if (err.code != Success || getSchemaResponceJSON == nil)
        {
            NSLog(@"Failed to get schema from ledger for submitterDid: %@, targetDid: %@", submitterDid, targetDid);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        CMSchema *schemaDto = [[CMSchema alloc] initWithReply:getSchemaResponceJSON];
        
        if (![schemaDto isValid])
        {
            NSLog(@"Failed to get schema seqNo and data from getSchema responce: %@", getSchemaResponceJSON);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(err, [schemaDto toJSON]);
        });
    });
}

/**
 Will get claim definition from ledger
 */
+ (void)getClaimDefFromLedgerForSubmitterDid:(NSString *)submitterDid
                                   remoteDid:(NSString *)remoteDiD
                                 schemaSeqNo:(NSNumber *)schemaSeqNo
                                walletHandle:(IndyHandle)walletHandle
                                  poolHandle:(IndyHandle)poolHandle
                                     inQueue:(dispatch_queue_t)queue
                                  completion:(void (^)(NSError *error,
                                                       NSString *claimDefJSON)) completion

{
    dispatch_async(queue, ^{
        __block NSError *err;
        dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        
        // 1. get claimDef
        
        __block NSString *getClaimDefRequestJSON;
        [IndyLedger buildGetClaimDefTxnWithSubmitterDid:submitterDid
                                                   xref:schemaSeqNo
                                          signatureType:[ConnectMeUtils signatureType]
                                                 origin:remoteDiD
                                             completion:^(NSError *xerror, NSString *requestJSON) {
                                                 dispatch_async(queue,^{
                                                     err = xerror;
                                                     getClaimDefRequestJSON = requestJSON;
                                                     dispatch_semaphore_signal(semaphore);
                                                 });
                                             }];
        
        dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
        
        if (err.code != Success || getClaimDefRequestJSON == nil)
        {
            NSLog(@"IndyLedger:buildGetClaimDefTxnWithSubmitterDid Failed with error: %@", err);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // 2. send request
        
        __block NSString *getClaimDefResponceJSON;
        [IndyLedger signAndSubmitRequest:getClaimDefRequestJSON
                            submitterDID:submitterDid
                              poolHandle:poolHandle
                            walletHandle:walletHandle
                              completion:^(NSError *xerror, NSString *requestResultJSON) {
                                  dispatch_async(queue,^{
                                      err = xerror;
                                      getClaimDefResponceJSON = requestResultJSON;
                                      dispatch_semaphore_signal(semaphore);
                                  });
                              }];
        
         dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
        
        if (err.code != Success || getClaimDefResponceJSON == nil)
        {
            NSLog(@"IndyLedger:signAndSubmitRequest failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        NSDictionary *getClaimDefResponce = [JSONConverter convertToDictionary:getClaimDefResponceJSON];
        
        if (getClaimDefResponce == nil)
        {
            NSLog(@"Failed to convert getClaimDefResponceJSON to Dictionary: %@.", getClaimDefResponceJSON);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        CMClaimDefinition *claimDefDto = [[CMClaimDefinition alloc] initWithReply:getClaimDefResponceJSON];
        
        dispatch_async(dispatch_get_main_queue(), ^{
             completion(err, [claimDefDto toJSON]);
        });
    });
}


/**
 Will get verkey of target's DID.
 */
+ (void)getVerkeyFromLedgerForTargetDid:(NSString *)targetDid
                           submitterDid:(NSString *)submitterDid
                           walletHandle:(IndyHandle)walletHandle
                             poolHandle:(IndyHandle)poolHandle
                                inQueue:(dispatch_queue_t)queue
                             completion:(void (^)(NSError *xerror,
                                                  NSString *verkey)) completion
{
    
    dispatch_async(queue, ^{
        dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        __block NSError *err;
        
        // 1. Build nym request
        
        __block NSString *getNymRequest;
        [IndyLedger buildGetNymRequestWithSubmitterDid:submitterDid
                                             targetDID:targetDid
                                            completion:^(NSError *xerror, NSString *requestJSON) {
                                                dispatch_async(queue, ^{
                                                    err = xerror;
                                                    getNymRequest = requestJSON;
                                                    dispatch_semaphore_signal(semaphore);
                                                });
                                            }];
        dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
        
        if (err.code != Success || getNymRequest == nil )
        {
            NSLog(@"IndyLedger::buildGetNymRequestWithSubmitterDid failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // 3.2 Send nym request
        
        __block NSString *getNymResponceJson;
        [IndyLedger signAndSubmitRequest:getNymRequest
                            submitterDID:submitterDid
                              poolHandle:poolHandle
                            walletHandle:walletHandle
                              completion:^(NSError *xerror, NSString *requestResultJSON) {
                                  dispatch_async(queue, ^{
                                      err = xerror;
                                      getNymResponceJson = requestResultJSON;
                                      dispatch_semaphore_signal(semaphore);
                                  });
                              }];
        
        dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
        
        if (err.code != Success || getNymResponceJson == nil)
        {
            NSLog(@"IndyLedger::signAndSubmitRequestWithWalletHandle failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil);
            });
            return;
        }
        
        // parce nym responce
        
        NSDictionary *nymResponce = [JSONConverter convertToDictionary:getNymResponceJson];
        
        if (nymResponce == nil)
        {
            NSLog(@"Failed to convert getNymResponce to dictionary.");
            dispatch_async(dispatch_get_main_queue(), ^{
                completion([ConnectMeUtils errorWithIndyCode:CommonInvalidState], nil);
            });
            return;
        }
        
        NSString *dataString = nymResponce[@"result"][@"data"];
        
        NSDictionary *data = [JSONConverter convertToDictionary:dataString];
        
        if (data == nil)
        {
            NSLog(@"Failed to convert data string from getNymResponce to dictionary.");
            dispatch_async(dispatch_get_main_queue(), ^{
                completion([ConnectMeUtils errorWithIndyCode:CommonInvalidState], nil);
            });
            return;
        }
        
        NSString *dataVerkey = data[@"verkey"];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(err, dataVerkey);
        });
    });
}

@end
