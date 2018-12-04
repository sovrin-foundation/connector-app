//
//  OnfidoSDK.m
//  ReactNativeSampleApp
//
//  Created by Shuichi Nagao on 2018/06/15.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(OnfidoSDK, NSObject)

RCT_EXTERN_METHOD(startSDK:(NSString *)applicationID
                  resolver:(RCTResponseSenderBlock *)resolve
                  rejecter:(RCTResponseSenderBlock *)reject)

@end