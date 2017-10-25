//
//  JSONConverter.h
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 12/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface JSONConverter : NSObject

/**
 Will convert JSON string to NSDictionary.
 */
+ (NSDictionary *)convertToDictionary:(NSString *)string;

/**
 Will convert NSDictionary string to JSON string.
 */
+ (NSString *)convertToString:(NSDictionary *)dictionary;

@end
