//
//  CMLedgerUtils.h
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 12/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Indy/Indy.h>

@interface CMLedgerUtils : NSObject

/**
 
 Will get schema from ledger following an alghoritm:
 
 1. get schema data by getTxn
 2. get schema
 */
+ (void)getSchemaDataBySeqNo:(NSNumber *)schemaSeqNo
                submitterDid:(NSString *)submitterDid
                  poolHandle:(IndyHandle)poolHandle
                walletHandle:(IndyHandle)walletHandle
                     inQueue:(dispatch_queue_t)queue
                  completion:(void (^)(NSError *error,
                                       NSString *schemaData)) completion;

+ (void)getSchemaFromLedgerForSubmitterDiD:(NSString *)submitterDid
                                 targetDid:(NSString *)targetDid
                                schemaData:(NSString *)schemaData
                              walletHandle:(IndyHandle)walletHandle
                                poolHandle:(IndyHandle)poolHandle
                                   inQueue:(dispatch_queue_t)queue
                                completion:(void (^)(NSError *error,
                                                     NSString *schemaJSON)) completion;


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
                                                       NSString *claimDefJSON)) completion;

/**
 Will get verkey of target's DID.
 */
+ (void)getVerkeyFromLedgerForTargetDid:(NSString *)targetDid
                           submitterDid:(NSString *)submitterDid
                           walletHandle:(IndyHandle)walletHandle
                             poolHandle:(IndyHandle)poolHandle
                                inQueue:(dispatch_queue_t)queue
                             completion:(void (^)(NSError *xerror,
                                                  NSString *verkey)) completion;



@end
