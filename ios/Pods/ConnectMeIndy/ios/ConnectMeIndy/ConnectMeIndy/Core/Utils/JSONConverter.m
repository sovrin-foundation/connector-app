//
//  JSONConverter.m
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 12/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import "JSONConverter.h"

@implementation JSONConverter

/**
 Will convert JSON string to NSDictionary.
 */
+ (NSDictionary *)convertToDictionary:(NSString *)string
{
    if (string == nil)
    {
        return nil;
    }
    
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:[NSData dataWithBytes:[string UTF8String]
                                                                                length:[string length]]
                                                         options:kNilOptions
                                                           error:nil];
    return dict;
}

/**
 Will convert NSDictionary string to JSON string.
 */
+ (NSString *)convertToString:(NSDictionary *)dictionary;
{
    if (dictionary == nil)
    {
        return nil;
    }
    
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dictionary
                                                       options:kNilOptions
                                                         error:nil];
    
    if (!jsonData)
    {
        return nil;
    }
    else
    {
        return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
}

@end
