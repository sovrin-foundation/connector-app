//
//  CMSchema.h
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 16/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CMSchema : NSObject

@property (strong) NSString *data;
@property (strong) NSNumber *sequenceNumber;

- (instancetype)initWithReply:(NSString *)replyJSON;

- (NSString *)toJSON;

- (BOOL)isValid;

@end
