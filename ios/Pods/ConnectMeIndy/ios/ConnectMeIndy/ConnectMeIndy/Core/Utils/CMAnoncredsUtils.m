//
//  CMAnoncredsUtils.m
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 16/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import "CMAnoncredsUtils.h"
#import "JSONConverter.h"
#import "ConnectMeUtils.h"
#import "CMLedgerUtils.h"

@interface CMClaimsData : NSObject

@property (strong) NSString *claimUUID;
@property (strong) NSString *issuerDid;
@property (strong) NSNumber *schemaSeqNo;

@property (strong) NSString *schemaJson;
@property (strong) NSString *claimDefJson;

- (instancetype)initWithClaim:(NSDictionary *)claim;

@end

// MARK: - CMAnoncredsUtils

@implementation CMAnoncredsUtils

/**
 Will get schemas from ledger for each unique data from claims
 
 //TODO:: Need to implement it
 */
+ (void)getDataFromLedgerForClaimsJSON:(NSString *)claimsJSON
                                 myDid:(NSString *)myDid
                               inQueue:(dispatch_queue_t)queue
                          walletHandle:(IndyHandle)walletHandle
                            poolHandle:(IndyHandle)poolHandle
                            completion:(void (^)(NSError *error,
                                                 NSString *schemasJSON,
                                                 NSString *claimDefsJSON)) completion
{
    dispatch_async(queue, ^{
        __block NSError *err;
        dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
        NSDictionary *claims = [JSONConverter convertToDictionary:claimsJSON];
        
        if (claims == nil)
        {
            NSLog(@"getSchemaSeqNumbersFrom - Failed to convert claimsJSON to dictionary.");
            completion([ConnectMeUtils errorWithIndyCode:CommonInvalidState], nil, nil);
        }
        
        // array of CMClaimsData objects
        NSMutableArray *claimsDataArray = [NSMutableArray new];
        
        // iterate throug attrs
        
        NSDictionary *attrs = claims[@"attrs"];
        NSDictionary *predicates = claims[@"predicates"];
        
        NSMutableArray *values = [[NSMutableArray alloc] initWithArray:[attrs allValues]];
        [values addObjectsFromArray:[predicates allValues]];
        
        // iterating throug all claims in claimsJson and get data
        for (NSDictionary *claim in values )
        {
            CMClaimsData *claimData = [[CMClaimsData alloc] initWithClaim:claim];
            [claimsDataArray addObject:claimData];
        }

        // get data from ledger for each pair issuerDid: seqNo
        for (__block CMClaimsData *claimData in claimsDataArray)
        {
            // 1.  get claimDef
            [CMLedgerUtils getClaimDefFromLedgerForSubmitterDid:myDid
                                                      remoteDid:claimData.issuerDid
                                                    schemaSeqNo:claimData.schemaSeqNo
                                                   walletHandle:walletHandle
                                                     poolHandle:poolHandle
                                                        inQueue:queue
                                                     completion:^(NSError *xerror, NSString *xclaimDefJSON) {
                                                         err = xerror;
                                                         claimData.claimDefJson = xclaimDefJSON;
                                                         dispatch_semaphore_signal(semaphore);
                                                     }];
            
            dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
            
            if (err.code != Success)
            {
                NSLog(@"Failed to get claimDefinition from ledger for claim with uuid: %@, issuerDid: %@, schemaSeqNo: %@", claimData.claimUUID, claimData.issuerDid, claimData.schemaSeqNo);
                completion(err, nil, nil);
                return;
            }
            
            // 2. get schema data
            __block NSString *schemaData;
            [CMLedgerUtils getSchemaDataBySeqNo:claimData.schemaSeqNo
                                   submitterDid:myDid
                                     poolHandle:poolHandle
                                   walletHandle:walletHandle
                                        inQueue:queue
                                     completion:^(NSError *xerror, NSString *xschemaData) {
                                         err = xerror;
                                         schemaData = xschemaData;
                                         dispatch_semaphore_signal(semaphore);
                                     }];
            
            dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
            
            if (err.code != Success)
            {
                NSLog(@"Failed to get schemaData for claim with uuid: %@, issuerDid: %@, schemaSeqNo: %@", claimData.claimUUID, claimData.issuerDid, claimData.schemaSeqNo);
                completion(err, nil, nil);
                return;
            }
            
            // 3. get schema
            [CMLedgerUtils getSchemaFromLedgerForSubmitterDiD:myDid
                                                    targetDid:claimData.issuerDid
                                                   schemaData:schemaData
                                                 walletHandle:walletHandle
                                                   poolHandle:poolHandle
                                                      inQueue:queue
                                                   completion:^(NSError *xerror, NSString *xschemaJSON) {
                                                       err = xerror;
                                                       claimData.schemaJson = xschemaJSON;
                                                       dispatch_semaphore_signal(semaphore);
                                                   }];
            
            dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
            
            if (err.code != Success)
            {
                NSLog(@"Failed to get schema for claim with uuid: %@, issuerDid: %@, schemaSeqNo: %@", claimData.claimUUID, claimData.issuerDid, claimData.schemaSeqNo);
                completion(err, nil, nil);
                return;
            }
        }
        
        // configure schemasJson and claimDefsJson
        
        NSMutableDictionary *schemas = [NSMutableDictionary new];
        NSMutableDictionary *claimDefs = [NSMutableDictionary new];
        
        
        // iterate throuh predicated
        
        for (CMClaimsData *claimData in claimsDataArray)
        {
            schemas[claimData.claimUUID] = [JSONConverter convertToDictionary:claimData.schemaJson];
            claimDefs[claimData.claimUUID] = [JSONConverter convertToDictionary:claimData.claimDefJson];
        }
        
        NSString *schemasString = [JSONConverter convertToString:schemas];
        NSString *claimDefsString = [JSONConverter convertToString:claimDefs];
        
        completion([ConnectMeUtils errorWithIndyCode:Success], schemasString, claimDefsString);
    });
}



@end


@implementation CMClaimsData

- (instancetype)initWithClaim:(NSDictionary *)claim
{
    self = [super init];
    if (self) {
        self.claimUUID = claim[@"claim_uuid"];
        self.issuerDid = claim[@"issuer_did"];
        self.schemaSeqNo = claim[@"schema_seq_no"];
    }
    return self;
}

@end
