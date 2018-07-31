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
#import <vcx/vcx/vcx.h>

@implementation RNIndy
@synthesize bridge = _bridge;

+ (ConnectMeIndy *)sharedIndyInstance:(NSString *)nodesConfig {
  static dispatch_once_t onceToken;
  static ConnectMeIndy *indy;
  dispatch_once(&onceToken, ^{
    indy = [ConnectMeIndy sharedInstance];
    NSString *xNodesConfig;
    if (nodesConfig != nil)
    {
      xNodesConfig = nodesConfig;
    } else
    {
      xNodesConfig = @"{\"data\":{\"alias\":\"Node1\",\"blskey\":\"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba\",\"client_ip\":\"34.212.206.9\",\"client_port\":9702,\"node_ip\":\"34.212.206.9\",\"node_port\":9701,\"services\":[\"VALIDATOR\"]},\"dest\":\"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv\",\"identifier\":\"Th7MpTaRZVRYnPiabds81Y\",\"txnId\":\"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62\",\"type\":\"0\"}\n{\"data\":{\"alias\":\"Node2\",\"blskey\":\"37rAPpXVoxzKhz7d9gkUe52XuXryuLXoM6P6LbWDB7LSbG62Lsb33sfG7zqS8TK1MXwuCHj1FKNzVpsnafmqLG1vXN88rt38mNFs9TENzm4QHdBzsvCuoBnPH7rpYYDo9DZNJePaDvRvqJKByCabubJz3XXKbEeshzpz4Ma5QYpJqjk\",\"client_ip\":\"34.212.206.9\",\"client_port\":9704,\"node_ip\":\"34.212.206.9\",\"node_port\":9703,\"services\":[\"VALIDATOR\"]},\"dest\":\"8ECVSk179mjsjKRLWiQtssMLgp6EPhWXtaYyStWPSGAb\",\"identifier\":\"EbP4aYNeTHL6q385GuVpRV\",\"txnId\":\"1ac8aece2a18ced660fef8694b61aac3af08ba875ce3026a160acbc3a3af35fc\",\"type\":\"0\"}\n{\"data\":{\"alias\":\"Node3\",\"blskey\":\"3WFpdbg7C5cnLYZwFZevJqhubkFALBfCBBok15GdrKMUhUjGsk3jV6QKj6MZgEubF7oqCafxNdkm7eswgA4sdKTRc82tLGzZBd6vNqU8dupzup6uYUf32KTHTPQbuUM8Yk4QFXjEf2Usu2TJcNkdgpyeUSX42u5LqdDDpNSWUK5deC5\",\"client_ip\":\"34.212.206.9\",\"client_port\":9706,\"node_ip\":\"34.212.206.9\",\"node_port\":9705,\"services\":[\"VALIDATOR\"]},\"dest\":\"DKVxG2fXXTU8yT5N7hGEbXB3dfdAnYv1JczDUHpmDxya\",\"identifier\":\"4cU41vWW82ArfxJxHkzXPG\",\"txnId\":\"7e9f355dffa78ed24668f0e0e369fd8c224076571c51e2ea8be5f26479edebe4\",\"type\":\"0\"}\n{\"data\":{\"alias\":\"Node4\",\"blskey\":\"2zN3bHM1m4rLz54MJHYSwvqzPchYp8jkHswveCLAEJVcX6Mm1wHQD1SkPYMzUDTZvWvhuE6VNAkK3KxVeEmsanSmvjVkReDeBEMxeDaayjcZjFGPydyey1qxBHmTvAnBKoPydvuTAqx5f7YNNRAdeLmUi99gERUU7TD8KfAa6MpQ9bw\",\"client_ip\":\"34.212.206.9\",\"client_port\":9708,\"node_ip\":\"34.212.206.9\",\"node_port\":9707,\"services\":[\"VALIDATOR\"]},\"dest\":\"4PS3EDQ3dW1tci1Bp6543CfuuebjFrg36kLAUcskGfaA\",\"identifier\":\"TWwCRQRZ2ZHMJFn9TzLp7W\",\"txnId\":\"aa5e817d7cc626170eca175822029339a444eb0ee8f0bd20d3b0b76e566fb008\",\"type\":\"0\"}";
    }
    indy.pool = [[CMPoolObject alloc] initWithName:@"sandboxPool" nodesConfig:xNodesConfig];
  });

  return indy;
}

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

// Export methods to a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html

#pragma mark - React Native exposed methods

RCT_EXPORT_METHOD(addConnection: (NSString *) remoteDID
                  remoteVerKey: (NSString *) remoteVerificationKey
                  withMetadata: (NSDictionary *) metadata
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject
                  )
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy addConnectionWithRemoteDid:remoteDID remoteVerkey:remoteVerificationKey metadata:metadata completion:^(NSError *error, NSString *pairwiseInfo) {
    if (error != nil) {
      reject(@"Error_AddConnection", @"An error occurred while creating a connection", error);
    } else {
      resolve(pairwiseInfo);
    }
  }];
}

RCT_EXPORT_METHOD(getConnectionForDid: (NSString *) remoteDID
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy getConnectionForDid:remoteDID completion:^(NSError *error, NSString *did, NSString *metadata) {
    if (error != nil) {
      reject(@"Error_getConnection", @"Error occurred while getting connection", error);
    } else {
      resolve(metadata);
    }
  }];
}

RCT_EXPORT_METHOD(generateClaimRequest: (NSString *) remoteDID
                  withClaimOffer: (NSString *) claimOffer
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
    [indy generateClaimRequestForRemoteDid:remoteDID
                                claimOffer:claimOffer
                                completion:^(NSError *error, NSString *generatedClaimReqJSON) {
        if (error != nil) {
            reject(@"Error_generateClaimRequest", @"Error occurred while generating claim request", error);
        } else {
            resolve(generatedClaimReqJSON);
        }
    }];
}

RCT_EXPORT_METHOD(addClaim: (NSString *) claim
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy addClaim:claim completion:^(NSError *error, NSString *filterJson) {
    if (error != nil) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while saving calim to wallet", error);
    } else {
      resolve(filterJson);
    }
  }];
}

RCT_EXPORT_METHOD(getClaim: (NSString *) filterJson
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  // get claim from did and store it, with given claim name and version
  // return claim in json format to JavaScript
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy getClaimForFilter:filterJson completion:^(NSError *error, NSString *claimsJSON) {
    if (claimsJSON == nil) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while getting claim", error);
    } else {
      resolve(claimsJSON);
    }
  }];
}

RCT_EXPORT_METHOD(prepareProof: (NSString *) proofRequest
                  withNodesConfig:(NSString *)nodesConfig
                      resolver: (RCTPromiseResolveBlock) resolve
                      rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy prepareProofForRequest:proofRequest completion:^(NSError *error, NSString *claimsJSON) {
    if (error != nil) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while preparing proof", error);
    } else {
      resolve(claimsJSON);
    }
  }];
}

RCT_EXPORT_METHOD(getProof: (NSString *) proofRequest
                 remoteDid: (NSString *) remoteDid
       requestedClaimsJson: (NSString *) requestedClaimsJson
                    claims: (NSString *) claims
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  // generate proof for proof request passed
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy generateProofForRequest:proofRequest
                      remoteDid:remoteDid
            requestedClaimsJson: requestedClaimsJson
                         claims: claims
                     completion: ^(NSError *error, NSString *proofJSON) {
    if (error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while getting proof", error);
    } else {
      resolve(proofJSON);
    }
  }];
}

RCT_EXPORT_METHOD(switchEnvironment: (NSString *)poolConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:poolConfig];
  if (indy.pool.handle) {
    [indy.pool deletePool:^(NSError *error) {
      if (indy.wallet.handle) {
        [indy.wallet deleteWallet:^(NSError *error) {
          if (error != nil && error.code != 0) {
            NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
            reject(indyErrorCode, @"Error deleting wallet", error);
          } else {
            NSString *uuid = [[NSUUID UUID] UUIDString];
            NSString *uuidWallet = [[NSUUID UUID] UUIDString];
            indy.wallet = [[CMWalletObject alloc] initWithName:uuidWallet type:nil];
            indy.pool = [[CMPoolObject alloc] initWithName:uuid nodesConfig:poolConfig];
            resolve(@YES);
          }
        }];
      } else {
        // if there is no wallet, then we can directly resolve
        resolve(@YES);
      }
    }];
  } else {
    indy.wallet = [[CMWalletObject alloc] initWithName:nil type:nil];
    // if no pool was opened, then we can set the pool config and don't need to close the pool
    indy.pool = [[CMPoolObject alloc] initWithName:@"pool" nodesConfig:poolConfig];
    resolve(@YES);
  }
}

#pragma mark msg pack apis
// CONNECT
RCT_EXPORT_METHOD(connectToAgency: (NSString *)url
                  withMyDid: (NSString *)myDid
                  withAgencyDid: (NSString *)agencyDid
                  withMyVerKey: (NSString *)myVerKey
                  withAgencyVerKey: (NSString *)agencyVerKey
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy sendConnectRequestWithUrl:url
                        withMyDid:myDid
                    withAgencyDid:agencyDid
                     withMyVerKey:myVerKey
                 withAgencyVerKey:agencyVerKey
                   withCompletion:^(NSError *error, NSDictionary *dataFromServer)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while connect to agency", error);
    } else {
      resolve(dataFromServer);
    }
  }];
}

// REGISTER/SIGNUP
RCT_EXPORT_METHOD(signupWithAgency: (NSString *)url
                  withOneTimeAgentVerKey: (NSString *)oneTimeAgencyVerKey
                  withOneTimeAgentDid: (NSString *)oneTimeAgencyDid
                  withMyOneTimeVerKey: (NSString *)myOneTimeVerKey
                  withAgencyVerKey: (NSString *)agencyVerKey
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy sendSignupRequestWithUrl:url
          withOneTimeAgentVerKey:oneTimeAgencyVerKey
             withOneTimeAgentDid:oneTimeAgencyDid
             withMyOneTimeVerKey:myOneTimeVerKey
                withAgencyVerKey:agencyVerKey
                  withCompletion:^(NSError *error, NSDictionary *dataFromServer)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while signup to agency", error);
    } else {
      resolve(dataFromServer);
    }
  }];
}

// CREATE ONE TIME AGENT
RCT_EXPORT_METHOD(createOneTimeAgent: (NSString *)url
                  withOneTimeAgentVerKey:(NSString *)oneTimeAgencyVerKey
                  withOneTimeAgentDid:(NSString *)oneTimeAgencyDid
                  withMyOneTimeVerKey:(NSString *)myOneTimeVerKey
                  withAgencyVerKey:(NSString *)agencyVerKey
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy sendCreateAgentRequestWithUrl:url
               withOneTimeAgentVerKey:oneTimeAgencyVerKey
                  withOneTimeAgentDid:oneTimeAgencyDid
                  withMyOneTimeVerKey:myOneTimeVerKey
                     withAgencyVerKey:agencyVerKey
                       withCompletion:^(NSError *error, NSDictionary *dataFromServer)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while creating one time agent", error);
    } else {
      resolve(dataFromServer);
    }
  }];
}

// CREATE PAIRWISE AGENT
RCT_EXPORT_METHOD(createPairwiseAgent: (NSString *)url
                  withMyPairwiseDid: (NSString *)myPairwiseDid
                  withMyPairwiseVerKey: (NSString *)myPairwiseVerKey
                  withOneTimeAgentVerKey: (NSString *)oneTimeAgentVerKey
                  withOneTimeAgentDid: (NSString *)oneTimeAgentDid
                  myVerKey: (NSString *)myOneTimeVerKey
                  agencyVerKey: (NSString *)agencyVerKey
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy sendCreateKeyRequestWithUrl:url
                  withMyPairwiseDid:myPairwiseDid
               withMyPairwiseVerKey:myPairwiseVerKey
             withOneTimeAgentVerKey:oneTimeAgentVerKey
                withOneTimeAgentDid:oneTimeAgentDid
                           myVerKey:myOneTimeVerKey
                       agencyVerKey:agencyVerKey
                     withCompletion:^(NSError *error, NSDictionary *dataFromServer)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while creating pairwise agent", error);
    } else {
      resolve(dataFromServer);
    }
  }];
}

// Accept Invitation
RCT_EXPORT_METHOD(acceptInvitation: (NSString *)url
                  withRequestId: (NSString *)requestId
                  withMyPairwiseDid: (NSString *)myPairwiseDid
                  withMyPairwiseVerKey: (NSString *)myPairwiseVerKey
                  withInvitation: (NSDictionary *)invitation
                  withMyPairwiseAgentDid: (NSString *)myPairwiseAgentDid
                  withMyPairwiseAgentVerKey: (NSString *)myPairwiseAgentVerKey
                  withMyOneTimeAgentDid: (NSString *)myOneTimeAgentDid
                  withMyOneTimeAgentVerKey: (NSString *)myOneTimeAgentVerKey
                  withMyOneTimeDid: (NSString *)myOneTimeDid
                  withMyOneTimeVerKey: (NSString *)myOneTimeVerKey
                  withMyAgencyVerKey: (NSString *)myAgencyVerKey
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy sendAcceptInvitationWithUrl:url
                      withRequestId:requestId
                  withMyPairwiseDid:myPairwiseDid
               withMyPairwiseVerKey:myPairwiseVerKey
                     withInvitation:invitation
             withMyPairwiseAgentDid:myPairwiseAgentDid
          withMyPairwiseAgentVerKey:myPairwiseAgentVerKey
              withMyOneTimeAgentDid:myOneTimeAgentDid
           withMyOneTimeAgentVerKey:myOneTimeAgentVerKey
                   withMyOneTimeDid:myOneTimeDid
                withMyOneTimeVerKey:myOneTimeVerKey
                 withMyAgencyVerKey:myAgencyVerKey
                     withCompletion:^(NSError *error, NSDictionary *dataFromServer)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while accepting connection", error);
    } else {
      resolve(dataFromServer);
    }
  }];
}

// Update push token
RCT_EXPORT_METHOD(updatePushToken: (NSString *)url
                  withToken: (NSString *)token
                  withUniqueDeviceId: (NSString *)uniqueDeviceId
                  withMyOneTimeAgentDid: (NSString *)myOneTimeAgentDid
                  withMyOneTimeAgentVerKey: (NSString *)myOneTimeAgentVerKey
                  withMyOneTimeVerKey: (NSString *)myOneTimeVerKey
                  withAgencyVerKey: (NSString *)myAgencyVerKey
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy sendPushTokenWithUrl:url
                   withToken:token
          withUniqueDeviceId:uniqueDeviceId
       withMyOneTimeAgentDid:myOneTimeAgentDid
    withMyOneTimeAgentVerKey:myOneTimeAgentVerKey
         withMyOneTimeVerKey:myOneTimeVerKey
            withAgencyVerKey:myAgencyVerKey
              withCompletion:^(NSError *error, NSDictionary *dataFromServer)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while sending push token", error);
    } else {
      resolve(dataFromServer);
    }
  }];
}

// download message
RCT_EXPORT_METHOD(getMessage: (NSString *)url
                  withRequestId: (NSString *)requestId
                  withMyPairwiseDid: (NSString *)myPairwiseDid
                  withMyPairwiseVerKey: (NSString *)myPairwiseVerKey
                  withMyPairwiseAgentDid: (NSString *)myPairwiseAgentDid
                  withMyPairwiseAgentVerKey: (NSString *)myPairwiseAgentVerKey
                  withMyOneTimeAgentDid: (NSString *)myOneTimeAgentDid
                  withMyOneTimeAgentVerKey: (NSString *)myOneTimeAgentVerKey
                  withMyOneTimeDid: (NSString *)myOneTimeDid
                  withMyOneTimeVerKey: (NSString *)myOneTimeVerKey
                  withMyAgencyVerKey: (NSString *)myAgencyVerKey
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy getMessageWithUrl:url
            withRequestId:requestId
        withMyPairwiseDid:myPairwiseDid
     withMyPairwiseVerKey:myPairwiseVerKey
   withMyPairwiseAgentDid:myPairwiseAgentDid
withMyPairwiseAgentVerKey:myPairwiseAgentVerKey
    withMyOneTimeAgentDid:myOneTimeAgentDid
 withMyOneTimeAgentVerKey:myOneTimeAgentVerKey
         withMyOneTimeDid:myOneTimeDid
      withMyOneTimeVerKey:myOneTimeVerKey
       withMyAgencyVerKey:myAgencyVerKey
           withCompletion:^(NSError *error, NSDictionary *dataFromServer)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while downloading message", error);
    } else {
      resolve(dataFromServer);
    }
  }];
}

RCT_EXPORT_METHOD(sendMessage: (NSString *)url
                  WithType: (NSString *)messageType
                  withMessageReplyId: (NSString *)messageReplyId
                  withMessage: (NSString *)message
                  withMyPairwiseDid: (NSString *)myPairwiseDid
                  withMyPairwiseVerKey: (NSString *)myPairwiseVerKey
                  withMyPairwiseAgentDid: (NSString *)myPairwiseAgentDid
                  withMyPairwiseAgentVerKey: (NSString *)myPairwiseAgentVerKey
                  withMyOneTimeAgentDid: (NSString *)myOneTimeAgentDid
                  withMyOneTimeAgentVerKey: (NSString *)myOneTimeAgentVerKey
                  withMyOneTimeDid: (NSString *)myOneTimeDid
                  withMyOneTimeVerKey: (NSString *)myOneTimeVerKey
                  withMyAgencyVerKey: (NSString *)myAgencyVerKey
                  withMyPairwisePeerVerKey: (NSString *)myPairwisePeerVerKey
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];
  [indy sendMessageWithUrl:url
                  WithType:messageType
        withMessageReplyId:messageReplyId
               withMessage:message
         withMyPairwiseDid:myPairwiseDid
      withMyPairwiseVerKey:myPairwiseVerKey
    withMyPairwiseAgentDid:myPairwiseAgentDid
 withMyPairwiseAgentVerKey:myPairwiseAgentVerKey
     withMyOneTimeAgentDid:myOneTimeAgentDid
  withMyOneTimeAgentVerKey:myOneTimeAgentVerKey
          withMyOneTimeDid:myOneTimeDid
       withMyOneTimeVerKey:myOneTimeVerKey
        withMyAgencyVerKey:myAgencyVerKey
  withMyPairwisePeerVerKey:myPairwisePeerVerKey
            withCompletion:^(NSError *error, NSDictionary *dataFromServer)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while sending message", error);
    } else {
      resolve(dataFromServer);
    }
  }];
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

// delete connection
RCT_EXPORT_METHOD(deleteConnection: (NSString *)url
                  withMyPairwiseDid: (NSString *)myPairwiseDid
                  withMyPairwiseVerKey: (NSString *)myPairwiseVerKey
                  withMyPairwiseAgentDid: (NSString *)myPairwiseAgentDid
                  withMyPairwiseAgentVerKey: (NSString *)myPairwiseAgentVerKey
                  withMyOneTimeAgentDid: (NSString *)myOneTimeAgentDid
                  withMyOneTimeAgentVerKey: (NSString *)myOneTimeAgentVerKey
                  withMyOneTimeDid: (NSString *)myOneTimeDid
                  withMyOneTimeVerKey: (NSString *)myOneTimeVerKey
                  withMyAgencyVerKey: (NSString *)myAgencyVerKey
                  withNodesConfig:(NSString *)nodesConfig
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  ConnectMeIndy *indy = [RNIndy sharedIndyInstance:nodesConfig];

  [indy deleteConnectionWithUrl:url
              withMyPairwiseDid:myPairwiseDid
           withMyPairwiseVerKey:myPairwiseVerKey
         withMyPairwiseAgentDid:myPairwiseAgentDid
      withMyPairwiseAgentVerKey:myPairwiseAgentVerKey
          withMyOneTimeAgentDid:myOneTimeAgentDid
       withMyOneTimeAgentVerKey:myOneTimeAgentVerKey
               withMyOneTimeDid:myOneTimeDid
            withMyOneTimeVerKey:myOneTimeVerKey
             withMyAgencyVerKey:myAgencyVerKey
                 withCompletion:^(NSError *error, NSDictionary *dataFromServer)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while deleting connection", error);
    } else {
      resolve(dataFromServer);
    }
  }];
}

RCT_EXPORT_METHOD(init: (NSString *)config
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] initWithConfig:config completion:^(NSError *error) {
    if (error != nil && error.code != 0 && error.code != 1044)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, [NSString stringWithFormat:@"Error occurred while initializing vcx: %@ :: %ld",error.domain, (long)error.code], error);
    }else{
      resolve(@true);
    }
  }];
}

RCT_EXPORT_METHOD(reset:
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    resolve(@{});
  });
}

RCT_EXPORT_METHOD(getSerializedConnection: (NSInteger)connectionHandle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  // TODO call vcx_connection_serialize and pass connectionHandle
  // it would return a string
  [[[ConnectMeVcx alloc] init] connectionSerialize:connectionHandle
                                              completion:^(NSError *error, NSString *state) {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while serializing connection handle", error);
    }else{

      resolve(state);
    }
  }];
}

RCT_EXPORT_METHOD(deserializeConnection: (NSString *)serializedConnection
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  // TODO call vcx_connection_deserialize and pass serializedConnection
  // it would return an error code and an integer connection handle in callback
  [[[ConnectMeVcx alloc] init] connectionDeserialize:serializedConnection completion:^(NSError *error, NSInteger connectionHandle) {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while deserializing claim offer", error);
    }else{
      resolve(@(connectionHandle));
    }
  }];
}

RCT_EXPORT_METHOD(decryptWalletFile: (NSString *) config
                           resolver: (RCTPromiseResolveBlock) resolve
                           rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] importWallet: config
                               completion:^(NSError *error) {
    if(error != nil && error.code != 0){
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, [NSString stringWithFormat:@"Error occurred while importing wallet: %@ :: %ld",error.domain, (long)error.code], error);
    }else {
      resolve(@{});
    }
  }];
}


RCT_EXPORT_METHOD(shutdownVcx: (BOOL *) deletePool
                    resolver: (RCTPromiseResolveBlock) resolve
                    rejecter: (RCTPromiseRejectBlock) reject)
{
  resolve([NSNumber numberWithInt:[[[ConnectMeVcx alloc] init] vcxShutdown: deletePool]]);
}


RCT_EXPORT_METHOD(credentialCreateWithMsgId: (NSString *) sourceId
                  withConnectionHandle: (NSInteger) connectionHandle
                  withMessageId: (NSString *) messageId
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
    [[[ConnectMeVcx alloc] init] credentialCreateWithMsgid:sourceId
                                          connectionHandle:connectionHandle
                                                     msgId:messageId
                                                completion:^(NSError *error, NSInteger credentialHandle, NSString* credentialOffer) {
      if (error != nil && error.code != 0)
      {
        NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
        reject(indyErrorCode, @"Error occurred while creating credential handle", error);
      } else {
        NSDictionary* vcxCredentialCreateResult = @{
                                              @"credential_handle": @(credentialHandle),
                                              @"credential_offer": credentialOffer
                                              };
        resolve(vcxCredentialCreateResult);
      }
    }];
}

RCT_EXPORT_METHOD(serializeClaimOffer: (NSInteger)credentialHandle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  // it would return error code, json string of credential inside callback
  [[[ConnectMeVcx alloc] init] credentialSerialize:credentialHandle completion:^(NSError *error, NSString *claimOffer) {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while serializing claim offer", error);
    }else{
      resolve(claimOffer);
    }
  }];
}

RCT_EXPORT_METHOD(deserializeClaimOffer: (NSString *)serializedCredential
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  // it would return an error code and an integer credential handle in callback
  [[[ConnectMeVcx alloc] init] credentialDeserialize:serializedCredential
                                          completion:^(NSError *error, NSInteger credentailHandle) {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while deserializing claim offer", error);
    }
    else {
      resolve(@(credentailHandle));
    }
  }];
}

RCT_EXPORT_METHOD(sendClaimRequest: (NSInteger) credentialHandle
                  withConnectionHandle: (NSInteger) connectionHandle
                  withPaymentHandle: (NSInteger) paymentHandle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] credentialSendRequest:credentialHandle
                                    connectionHandle:connectionHandle
                                       paymentHandle:paymentHandle
                                          completion:^(NSError *error) {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while sending claim request", error);
    }
    else {
      resolve(@{});
    }
  }];
}

RCT_EXPORT_METHOD(initWithConfig: (NSString *)config
              resolver: (RCTPromiseResolveBlock) resolve
              rejecter: (RCTPromiseRejectBlock) reject)
{
  // TODO: call vcx_init_with_config of libvcx
  // pass a config as json string
  // callback would get an error code and a json string back in case of success
  NSError *error = nil; // remove this line after integrating libvcx method
  if (error != nil && error.code != 0)
  {
    NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
    reject(indyErrorCode, @"Init failed with error", error);
  } else {
    resolve(@{});
  }
}

RCT_EXPORT_METHOD(createOneTimeInfo: (NSString *)config
                           resolver: (RCTPromiseResolveBlock) resolve
                           rejecter: (RCTPromiseRejectBlock) reject)
{
  // pass a config as json string
  // callback would get an error code and a json string back in case of success

  [[[ConnectMeVcx alloc] init] agentProvisionAsync:config completion:^(NSError *error, NSString *oneTimeInfo) {
    NSLog(@"applicationDidBecomeActive callback:%@",oneTimeInfo);
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, [NSString stringWithFormat:@"Error occurred while creating one time info: %@ :: %ld",error.domain, (long)error.code], error);

    }else{
      resolve(oneTimeInfo);
    }
  }];
}

RCT_EXPORT_METHOD(createConnectionWithInvite: (NSString *)invitationId
                               inviteDetails: (NSString *)inviteDetails
                                    resolver: (RCTPromiseResolveBlock) resolve
                                    rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] connectionCreateWithInvite:invitationId
                                            inviteDetails:inviteDetails
                                               completion:^(NSError *error, NSInteger connectionHandle) {
     if (error != nil && error.code != 0)
     {
       NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
       reject(indyErrorCode, @"Error occurred while creating connection", error);
     } else {
       resolve(@(connectionHandle));
     }
  }];
}

// TODO:repalce with acceptInvitation when vcx integration done
RCT_EXPORT_METHOD(vcxAcceptInvitation: (NSInteger )connectionHandle
                    connectionType: (NSString *)connectionType
                          resolver: (RCTPromiseResolveBlock) resolve
                          rejecter: (RCTPromiseRejectBlock) reject)
{
   [[[ConnectMeVcx alloc] init] connectionConnect:connectionHandle
                                            connectionType:connectionType
                                               completion:^(NSError *error, NSString *inviteDetails) {

    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while accepitng connection", error);
    } else {
      resolve(inviteDetails);
    }
   }];

}

// TODO:repalce with updatePushToken when vcx integration done
RCT_EXPORT_METHOD(vcxUpdatePushToken: (NSString *)config
                         resolver: (RCTPromiseResolveBlock) resolve
                         rejecter: (RCTPromiseRejectBlock) reject)
{
  // TODO: call vcx_agent_update_info of libvcx
  // pass a config as json string
  // callback would get an error code
  [[[ConnectMeVcx alloc] init] agentUpdateInfo:config completion:^(NSError *error) {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while updating push token", error);
    } else {
      resolve(@{});
    }
  }];
}

RCT_EXPORT_METHOD(getGenesisPathWithConfig: (NSString *)config
                        fileName: (NSString *)fileName
                       resolver: (RCTPromiseResolveBlock) resolve
                       rejecter: (RCTPromiseRejectBlock) reject)
{
  NSError *error;
  NSString *filePath = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject] stringByAppendingPathComponent:fileName];
  NSFileManager *fileManager = [NSFileManager defaultManager];
  if (![fileManager fileExistsAtPath: filePath])
  {
    NSInteger *success=[config writeToFile:filePath atomically:YES encoding:NSUTF8StringEncoding error:&error];
    if(!success)
    {
      resolve(@"error while creating genesis file");
    }
  }
  resolve(filePath);
}

RCT_EXPORT_METHOD(updateClaimOfferState: (int)credentialHandle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] credentialUpdateState:credentialHandle
                                          completion:^(NSError *error, NSInteger state)
  {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while updating claim offer state", error);
    }
    else {
      resolve(@(state));
    }
  }];
}

RCT_EXPORT_METHOD(getClaimOfferState: (int)credentialHandle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  // TODO: Add vcx wrapper method for vcx_credential_get_state
  // call vcx_credential_get_state and pass credentialHandle

  [[[ConnectMeVcx alloc] init] credentialGetState:credentialHandle completion:^(NSError *error, NSInteger state) {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while getting claim offer state", error);
    }
    else {
      resolve(@(state));
    }
  }];
}

RCT_EXPORT_METHOD(getClaimVcx: (int)credentialHandle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] getCredential:credentialHandle completion:^(NSError *error, NSString *credential) {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while getting claim", error);
    }
    else {
      resolve(credential);
    }
  }];
}

RCT_EXPORT_METHOD(exportWallet: (NSString *)exportPath
                               encryptWith: (NSString *)encryptionKey
                                    resolver: (RCTPromiseResolveBlock) resolve
                                    rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] exportWallet:exportPath
                                encryptWith:encryptionKey
                                completion:^(NSError *error, NSInteger exportHandle) {
     if (error != nil && error.code != 0)
     {
       NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
       reject(indyErrorCode, @"Error occurred while exporting wallet", error);
     } else {
       resolve(@(exportHandle));
     }
  }];
}

RCT_EXPORT_METHOD(setWalletItem: (NSString *) key
                          value: (NSString *) value
                       resolver: (RCTPromiseResolveBlock) resolve
                       rejecter: (RCTPromiseRejectBlock)reject)
{
  NSString *recordType = @"record_type";
  [[[ConnectMeVcx alloc] init] addRecordWallet:recordType
                                      recordId:key
                                   recordValue:value
                                    completion:^(NSError *error) {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, [NSString stringWithFormat:@"Error occurred while adding wallet item: %@ :: %ld",error.domain, (long)error.code], error);
    } else {
      resolve(@0);
    }
  }];
}

RCT_EXPORT_METHOD(getWalletItem: (NSString *) key
                       resolver: (RCTPromiseResolveBlock) resolve
                       rejecter: (RCTPromiseRejectBlock) reject)
{
  NSString *recordType = @"record_type";
  [[[ConnectMeVcx alloc] init] getRecordWallet:recordType
                                      recordId:key
                                    completion:^(NSError *error, NSString *result)
   {
     if (error != nil && error.code != 0)
     {
       NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
       reject(indyErrorCode, [NSString stringWithFormat:@"Error occurred while getting wallet item: %@ :: %ld",error.domain, (long)error.code], error);
     } else {
       resolve(result);
     }
   }];
}

RCT_EXPORT_METHOD(deleteWalletItem: (NSString *) key
                       resolver: (RCTPromiseResolveBlock) resolve
                       rejecter: (RCTPromiseRejectBlock) reject)
{
  NSString *recordType = @"record_type";
  [[[ConnectMeVcx alloc] init] deleteRecordWallet:recordType
                                         recordId:key
                                       completion:^(NSError *error) {
     if (error != nil && error.code != 0)
     {
       NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
       reject(indyErrorCode, [NSString stringWithFormat:@"Error occurred while deleting wallet item: %@ :: %ld",error.domain, (long)error.code], error);
     } else {
       resolve(@0);
     }
  }];
}

RCT_EXPORT_METHOD(updateWalletItem: (NSString *) key
                             value: (NSString *) value
                          resolver: (RCTPromiseResolveBlock) resolve
                          rejecter: (RCTPromiseRejectBlock) reject)
{
  NSString *recordType = @"record_type";

  [[[ConnectMeVcx alloc] init] updateRecordWallet:recordType
                                     withRecordId:key
                                  withRecordValue:value
                                   withCompletion:^(NSError *error) {
     if (error != nil && error.code != 0)
     {
       NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
       reject(indyErrorCode, [NSString stringWithFormat:@"Error occurred while updating wallet item: %@ :: %ld",error.domain, (long)error.code], error);
     } else {
       resolve(@0);
     }
  }];
}

RCT_EXPORT_METHOD(proofCreateWithMsgId: (NSString *)sourceId
                  withConnectionHandle: (NSInteger)connectionHandle
                  withMsgId: (NSString *)msgId
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] proofCreateWithMsgId:sourceId
                               withConnectionHandle:connectionHandle
                                          withMsgId:msgId
                                     withCompletion:^(NSError *error, vcx_proof_handle_t proofHandle, NSString *proofRequest)
  {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while downloading proof request", error);
    }
    else {
      resolve(@{
                @"proofHandle": @(proofHandle),
                @"proofRequest": proofRequest
                });
    }
  }];
}

RCT_EXPORT_METHOD(proofRetrieveCredentials:(NSInteger)proofHandle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] proofRetrieveCredentials:proofHandle
                                         withCompletion:^(NSError *error, NSString *matchingCredentials)
  {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while retrieving matching credentials", error);
    }
    else {
      resolve(matchingCredentials);
    }
  }];
}

RCT_EXPORT_METHOD(proofGenerate:(NSInteger)proofHandle
                  withSelectedCredentials:(NSString *)selectedCredentials
                  withSelfAttestedAttrs:(NSString *)selfAttestedAttributes
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] proofGenerate:proofHandle
                     withSelectedCredentials:selectedCredentials
                       withSelfAttestedAttrs:selfAttestedAttributes
                              withCompletion:^(NSError *error)
  {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while generating proof", error);
    }
    else {
      resolve(@{});
    }
  }];
}

RCT_EXPORT_METHOD(proofSend:(NSInteger)proof_handle
                  withConnectionHandle:(NSInteger)connection_handle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] proofSend:proof_handle
                    withConnectionHandle:connection_handle
                          withCompletion:^(NSError *error)
  {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while sending proof", error);
    }
    else {
      resolve(@{});
    }
  }];
}

@end
