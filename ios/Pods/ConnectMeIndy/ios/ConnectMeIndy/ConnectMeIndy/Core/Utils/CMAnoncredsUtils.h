//
//  CMAnoncredsUtils.h
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 16/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Indy/Indy.h>

@interface CMAnoncredsUtils : NSObject

+ (void)getDataFromLedgerForClaimsJSON:(NSString *)claimsJSON
                                 myDid:(NSString *)myDid
                               inQueue:(dispatch_queue_t)queue
                          walletHandle:(IndyHandle)walletHandle
                            poolHandle:(IndyHandle)poolHandle
                            completion:(void (^)(NSError *error,
                                                 NSString *schemasJSON,
                                                 NSString *claimDefsJSON)) completion;

@end
