//
//  UserDefaultsStorable.h
//  ConnectMeIndy
//
//  Created by Anastasia Tarasova on 18/10/2017.
//  Copyright © 2017 hyperledger. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol CMUserDefaultStorable

- (void)saveInUserDefaults;

- (void)fetchFromUserDefaults;

- (void)deleteFromUserDefaults;

- (NSString *)keyForUserDefaults;

@end
