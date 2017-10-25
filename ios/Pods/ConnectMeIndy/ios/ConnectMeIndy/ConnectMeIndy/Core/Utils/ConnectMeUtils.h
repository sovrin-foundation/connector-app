//
//  IndyUtils.h
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 12/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Indy/Indy.h>


@interface ConnectMeUtils : NSObject

+ (NSError *)errorWithIndyCode:(IndyErrorCode)code;

/**
 Returns dispatch timeout - 10 seconds from function call.
 */
+ (dispatch_time_t)semaphoreTimeout;

+ (NSString *)signatureType;

@end
