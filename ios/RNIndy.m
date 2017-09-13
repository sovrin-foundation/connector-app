//  Created by react-native-create-bridge

#import "RNIndy.h"

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

// import RCTEventDispatcher
#if __has_include(<React/RCTEventDispatcher.h>)
#import <React/RCTEventDispatcher.h>
#elif __has_include(“RCTEventDispatcher.h”)
#import “RCTEventDispatcher.h”
#else
#import “React/RCTEventDispatcher.h” // Required when used as a Pod in a Swift project
#endif

// convert in same import format as above
#import <React/RCTLog.h>
#import <libindy/libindy.h>

@implementation RNIndy
@synthesize bridge = _bridge;

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

// Export constants
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#exporting-constants
- (NSDictionary *)constantsToExport
{
  return @{
           @"WALLET": @"wallet"
         };
}

// Export methods to a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html

#pragma mark - Abstracted methods
// TODO:KS Complete these abstracted methods
// these are the methods which are supposed to be used by ReactNative API
RCT_EXPORT_METHOD(getWallet)
{
  // this method will also need not be called from JavaScript
  // JavaScript API does not need to call each and every API
  // this bridge abstract a lot of details from JavaScript API
  // we create a wallet if not already created
  // open a wallet if it is already created
  // or return a wallet handle if already opened
}

RCT_EXPORT_METHOD(addConnection)
{
  // get the wallet handle
  // open the wallet if not already opened
  // check if a Did is already created for this DID
  // if not created, create a pairwise did for user
  // call createAndStoreMyDidWithWalletHandle
  // now store their Did corresponding to this new generated DID
  // call storeTheirDidWithWalletHandle
}

RCT_EXPORT_METHOD(sign)
{
  // sign the string for passed remote did
}

RCT_EXPORT_METHOD(verify)
{
  // verify data for given remote did
}

RCT_EXPORT_METHOD(getClaim)
{
  // get claim from did and store it, with given claim name and version
  // return claim in json format to JavaScript
}

RCT_EXPORT_METHOD(getProof)
{
  // generate proof for proof request passed
}

# pragma mark Indy APIs
// these are the same methods that Lib Indy exposes
// If JavaScript side chooses to use these API instead of abstracted ones
// they can do so, but abstracted ones are preferred
RCT_EXPORT_METHOD(createWalletWithPoolName:(NSString *)poolName
                  name:(NSString *)name
                  xType:(NSString *)type
                  config:(NSString *)config
                  credentials:(NSString *)credentials
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  __block NSError *err = nil;
  NSError *ret = nil;
  NSString *walletName = @"default-wallet-name";
  NSString *xTypeStr = @"default";
  self.walletCreateBlock = ^(NSError *error) {
    err = error;
  };
  ret = [[IndyWallet sharedInstance] createWalletWithPoolName:  @"default-pool-name"
                                                         name:  walletName
                                                        xType:  xTypeStr
                                                       config:  nil
                                                  credentials:  nil
                                                   completion: self.walletCreateBlock];
}

RCT_EXPORT_METHOD(openWalletWithName:(NSString *)name
                  runtimeConfig:(NSString *)config
                  credentials:(NSString *)credentials
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  __block NSError *err = nil;
  __block IndyHandle myWalletHandle = 0;
  NSError *ret = nil;
  self.openWalletBlock = ^(NSError *error, IndyHandle walletHandle) {
    err = error;
    myWalletHandle = walletHandle;
  };
  ret = [[IndyWallet sharedInstance] openWalletWithName: @"default-wallet-name"
                                          runtimeConfig: nil
                                            credentials: nil
                                             completion: self.openWalletBlock];
  NSString *valueForJavaScript = @"done";
  // this is how the promise will be resolved in JavaScript world
  // In JavaScript world, we can use async await now
  resolve(valueForJavaScript);
}

RCT_EXPORT_METHOD(closeWalletWithHandle:(IndyHandle)walletHandle)
{
  __block NSError *err = nil;
  NSError *ret = nil;
  self.closeWalletBlock = ^(NSError *error) {
    err = error;
  };
  ret = [[IndyWallet sharedInstance] closeWalletWithHandle: (IndyHandle)walletHandle
                                     completion: self.closeWalletBlock];
}

RCT_EXPORT_METHOD(deleteWalletWithName:(NSString *)walletName
                  credentials:(NSString *)credentials)
{
  __block NSError *err = nil;
  NSError *ret = nil;
  self.deleteWalletBlock = ^(NSError *error) {
    err = error;
  };
  ret = [[IndyWallet sharedInstance] deleteWalletWithName:@"default-wallet-name"
                                              credentials: nil
                                                completion: self.deleteWalletBlock];
}

# pragma mark Connection based methods

RCT_EXPORT_METHOD(createAndStoreMyDidWithWalletHandle)
{
  RCTLogInfo(@"called create and store did");
}

RCT_EXPORT_METHOD(signWithWalletHandle)
{
  RCTLogInfo(@"called sign with wallet handle and did");
}

RCT_EXPORT_METHOD(verifySignatureWithWalletHandle)
{
  RCTLogInfo(@"called verify signature with wallet handle and did");
}

RCT_EXPORT_METHOD(buildGetDdoRequestWithSubmitterDid:(NSString *)submitterDid
                  targetDID:(NSString *)targetDid
                  completion:(void (^)(NSError *error, NSString *requestResultJSON)) handler)
{
 RCTLogInfo(@"called verify signature with wallet handle and did");
}


// List all your events here
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#sending-events-to-javascript
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"SampleEvent"];
}

#pragma mark - Private methods

// Implement methods that you want to export to the native module
- (void) emitMessageToRN: (NSString *)eventName :(NSDictionary *)params {
  // The bridge eventDispatcher is used to send events from native to JS env
  // No documentation yet on DeviceEventEmitter: https://github.com/facebook/react-native/issues/2819
  [self sendEventWithName: eventName body: params];
}

@end
