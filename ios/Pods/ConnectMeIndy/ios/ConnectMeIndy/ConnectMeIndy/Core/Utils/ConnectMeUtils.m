//
//  IndyUtils.m
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 12/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import "ConnectMeUtils.h"

@implementation ConnectMeUtils

+ (NSError *)errorWithIndyCode:(IndyErrorCode)code
{
    return [[NSError alloc] initWithDomain:@"ConnectMeIndy" code:code userInfo:nil];
}

+ (dispatch_time_t)semaphoreTimeout
{
    return dispatch_time(DISPATCH_TIME_NOW, (15.0 * NSEC_PER_SEC));
}

+ (NSString *)signatureType
{
    return @"CL";
}

@end

