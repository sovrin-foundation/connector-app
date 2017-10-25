//
//  CMPairwiseUtils.h
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 12/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Indy/Indy.h>

@interface CMPairwiseUtils : NSObject

+ (void)getPairwiseInfoForDid:(NSString *)theirDid
                   fromWallet:(IndyHandle)walletHandle
                      inQueue:(dispatch_queue_t)queue
                   completion:(void (^)(NSError *xerror,
                                        NSString *myDid,
                                        NSString *metadata)) completion;
    
+ (NSDictionary*)insertVerkey:(NSString *)verkey
                 intoMetadata:(NSDictionary*)metadata;

@end
