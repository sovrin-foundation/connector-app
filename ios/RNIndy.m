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

#import <ConnectMeIndy/ConnectMeIndy.h>

@implementation RNIndy
@synthesize bridge = _bridge;

+ (ConnectMeIndy *)sharedIndyInstance {
  static dispatch_once_t onceToken;
  static ConnectMeIndy *indy;
  dispatch_once(&onceToken, ^{
    indy = [ConnectMeIndy sharedInstance];
    indy.pool = [[CMPoolObject alloc] initWithName:@"sandboxPool" nodesConfig:@"{\"data\":{\"alias\":\"Node1\",\"blskey\":\"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba\",\"client_ip\":\"34.212.206.9\",\"client_port\":9702,\"node_ip\":\"34.212.206.9\",\"node_port\":9701,\"services\":[\"VALIDATOR\"]},\"dest\":\"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv\",\"identifier\":\"Th7MpTaRZVRYnPiabds81Y\",\"txnId\":\"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62\",\"type\":\"0\"}\n{\"data\":{\"alias\":\"Node2\",\"blskey\":\"37rAPpXVoxzKhz7d9gkUe52XuXryuLXoM6P6LbWDB7LSbG62Lsb33sfG7zqS8TK1MXwuCHj1FKNzVpsnafmqLG1vXN88rt38mNFs9TENzm4QHdBzsvCuoBnPH7rpYYDo9DZNJePaDvRvqJKByCabubJz3XXKbEeshzpz4Ma5QYpJqjk\",\"client_ip\":\"34.212.206.9\",\"client_port\":9704,\"node_ip\":\"34.212.206.9\",\"node_port\":9703,\"services\":[\"VALIDATOR\"]},\"dest\":\"8ECVSk179mjsjKRLWiQtssMLgp6EPhWXtaYyStWPSGAb\",\"identifier\":\"EbP4aYNeTHL6q385GuVpRV\",\"txnId\":\"1ac8aece2a18ced660fef8694b61aac3af08ba875ce3026a160acbc3a3af35fc\",\"type\":\"0\"}\n{\"data\":{\"alias\":\"Node3\",\"blskey\":\"3WFpdbg7C5cnLYZwFZevJqhubkFALBfCBBok15GdrKMUhUjGsk3jV6QKj6MZgEubF7oqCafxNdkm7eswgA4sdKTRc82tLGzZBd6vNqU8dupzup6uYUf32KTHTPQbuUM8Yk4QFXjEf2Usu2TJcNkdgpyeUSX42u5LqdDDpNSWUK5deC5\",\"client_ip\":\"34.212.206.9\",\"client_port\":9706,\"node_ip\":\"34.212.206.9\",\"node_port\":9705,\"services\":[\"VALIDATOR\"]},\"dest\":\"DKVxG2fXXTU8yT5N7hGEbXB3dfdAnYv1JczDUHpmDxya\",\"identifier\":\"4cU41vWW82ArfxJxHkzXPG\",\"txnId\":\"7e9f355dffa78ed24668f0e0e369fd8c224076571c51e2ea8be5f26479edebe4\",\"type\":\"0\"}\n{\"data\":{\"alias\":\"Node4\",\"blskey\":\"2zN3bHM1m4rLz54MJHYSwvqzPchYp8jkHswveCLAEJVcX6Mm1wHQD1SkPYMzUDTZvWvhuE6VNAkK3KxVeEmsanSmvjVkReDeBEMxeDaayjcZjFGPydyey1qxBHmTvAnBKoPydvuTAqx5f7YNNRAdeLmUi99gERUU7TD8KfAa6MpQ9bw\",\"client_ip\":\"34.212.206.9\",\"client_port\":9708,\"node_ip\":\"34.212.206.9\",\"node_port\":9707,\"services\":[\"VALIDATOR\"]},\"dest\":\"4PS3EDQ3dW1tci1Bp6543CfuuebjFrg36kLAUcskGfaA\",\"identifier\":\"TWwCRQRZ2ZHMJFn9TzLp7W\",\"txnId\":\"aa5e817d7cc626170eca175822029339a444eb0ee8f0bd20d3b0b76e566fb008\",\"type\":\"0\"}"];
  });
  
  return indy;
}

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

RCT_EXPORT_METHOD(addConnection: (NSString *) remoteDID
                  remoteVerKey: (NSString *) remoteVerificationKey
                  withMetadata: (NSDictionary *) metadata
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject
                  )
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance];
  [indy addConnectionWithRemoteDid:remoteDID remoteVerkey:remoteVerificationKey metadata:metadata completion:^(NSError *error, NSString *pairwiseInfo) {
    if (error != nil) {
      reject(@"Error_AddConnection", @"An error occurred while creating a connection", error);
    } else {
      resolve(pairwiseInfo);
    }
  }];
}

RCT_EXPORT_METHOD(getConnectionForDid: (NSString *) remoteDID
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject) {
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance];
  [indy getConnectionForDid:remoteDID completion:^(NSError *error, NSString *did, NSString *metadata) {
    if (error != nil) {
      reject(@"Error_getConnection", @"Error occurred while getting connection", error);
    } else {
      resolve(metadata);
    }
  }];
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
