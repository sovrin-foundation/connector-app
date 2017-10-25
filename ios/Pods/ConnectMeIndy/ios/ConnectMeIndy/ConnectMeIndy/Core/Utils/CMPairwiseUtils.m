//
//  CMPairwiseUtils.m
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 12/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import "CMPairwiseUtils.h"
#import "ConnectMeUtils.h"
#import "JSONConverter.h"

@implementation CMPairwiseUtils


/**
 Will get pairwise info for did from wallet.
 
 Callback is invoked in caller's thread.
 */
+ (void)getPairwiseInfoForDid:(NSString *)theirDid
                   fromWallet:(IndyHandle)walletHandle
                      inQueue:(dispatch_queue_t)queue
                   completion:(void (^)(NSError *xerror,
                                        NSString *myDid,
                                        NSString *metadata)) completion
{
    dispatch_async(queue, ^{
        __block NSError *err;
        dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
        
        __block NSString *pairwiseInfoJson;
        [IndyPairwise getPairwiseForTheirDid:theirDid
                                walletHandle:walletHandle
                                  completion:^(NSError *xerror, NSString *xpairwiseInfoJson) {
                                      dispatch_async(queue,^{
                                          err = xerror;
                                          pairwiseInfoJson = xpairwiseInfoJson;
                                          dispatch_semaphore_signal(semaphore);
                                      });
                                  }];
        
        dispatch_semaphore_wait(semaphore, [ConnectMeUtils semaphoreTimeout]);
        
        // check getPairwiseForTheirDid error code
        if (err.code != Success )
        {
            NSLog(@"IndyPairwise::getPairwiseForTheirDid failed. Error: %ld", (long)err.code);
            dispatch_async(dispatch_get_main_queue(), ^{
                completion(err, nil, nil);
            });
            return;
        }
        
        // check result json
        if (pairwiseInfoJson == nil)
        {
            NSLog(@"No pairwise info is found for remoteDid.");
            dispatch_async(dispatch_get_main_queue(), ^{
                completion([ConnectMeUtils errorWithIndyCode:CommonInvalidState], nil, nil);
            });
            return;
        }
        
        // Convert json to dictionary and retrieve myDid
        
        NSDictionary * pairwiseInfo = [JSONConverter convertToDictionary:pairwiseInfoJson];
        
        if (pairwiseInfo == nil)
        {
            NSLog(@"Failed to convert pairwise info json to dictionary.");
            dispatch_async(dispatch_get_main_queue(), ^{
                completion([ConnectMeUtils errorWithIndyCode:CommonInvalidState], nil, nil);
            });
            return;
        }
        
        
        NSString *myDid = pairwiseInfo[@"my_did"];
        NSString *metadata = pairwiseInfo[@"metadata"];
        
        if (myDid == nil)
        {
            NSLog(@"pairwiseInfo doesn't comtain valid my_did.");
             dispatch_async(dispatch_get_main_queue(), ^{
                 completion([ConnectMeUtils errorWithIndyCode:CommonInvalidState] , nil, nil);
             });
            return;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            completion(err, myDid, metadata);
        });
    });
}
    
+ (NSDictionary*)insertVerkey:(NSString *)verkey
                 intoMetadata:(NSDictionary*)metadata
{
    NSString * currentVerkey = metadata[@"verificationKey"];
    if (currentVerkey != nil)
    {
        NSLog(@"Metadata already contains a verkey.");
        return metadata;
    }
    
    NSMutableDictionary *newMetadata;
    if (metadata != nil)
    {
        newMetadata = [[NSMutableDictionary alloc] initWithDictionary:metadata];
    }
    else
    {
        newMetadata = [NSMutableDictionary new];
    }
    
    newMetadata[@"verificationKey"] = verkey;
    return newMetadata;
}
    

@end
