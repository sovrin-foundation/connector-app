//
//  CMClaimDefinition.m
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 16/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import "CMClaimDefinition.h"
#import "JSONConverter.h"

@implementation CMClaimDefinition

- (instancetype)initWithReply:(NSString *)replyJSON
{
    self = [super init];
    if (self) {
        NSDictionary *reply = [JSONConverter convertToDictionary:replyJSON];
        self.ref = reply[@"result"][@"ref"];
        self.orifin = reply[@"result"][@"origin"];
        self.signatureType = reply[@"result"][@"signature_type"];
        self.data = reply[@"result"][@"data"];
    }
    return self;
}

- (NSString *)toJSON
{
    NSMutableDictionary *claimDef = [NSMutableDictionary new];
    claimDef[@"ref"] = self.ref;
    claimDef[@"origin"] = self.orifin;
    claimDef[@"signature_type"] = self.signatureType;
    claimDef[@"data"] = self.data;
    
    return [JSONConverter convertToString:claimDef];
}

- (BOOL)isValid
{
    if (self.ref == nil
        || self.orifin == nil
        || self.signatureType == nil
        || self.data == nil)
    {
        return false;
    }
    
    return true;
}

@end
