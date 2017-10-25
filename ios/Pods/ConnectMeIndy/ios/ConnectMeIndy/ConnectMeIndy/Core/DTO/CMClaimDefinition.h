//
//  CMClaimDefinition.h
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 16/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CMClaimDefinition : NSObject

@property (strong) NSString *ref;
@property (strong) NSString *orifin;
@property (strong) NSString *signatureType;
@property (strong) NSString *data;

- (instancetype)initWithReply:(NSString *)replyJSON;

- (NSString *)toJSON;

- (BOOL)isValid;

@end
