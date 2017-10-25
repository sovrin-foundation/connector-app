//
//  CMSchema.m
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 16/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import "CMSchema.h"
#import "JSONConverter.h"

@implementation CMSchema

- (instancetype)initWithReply:(NSString *)replyJSON
{
    self = [super init];
    if (self) {
        NSDictionary *reply = [JSONConverter convertToDictionary:replyJSON];
        self.data = reply[@"result"][@"data"];
        self.sequenceNumber = reply[@"result"][@"seqNo"];
    }
    return self;
}

- (NSString *)toJSON
{
    NSMutableDictionary *schema = [NSMutableDictionary new];
    schema[@"data"] = self.data;
    schema[@"seqNo"] = self.sequenceNumber;
    
    return [JSONConverter convertToString:schema];
}

- (BOOL)isValid
{
    if (self.data == nil || self.sequenceNumber == nil)
    {
        return false;
    }
    
    return true;
}

@end
