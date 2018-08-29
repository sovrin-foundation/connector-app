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

#import <vcx/vcx/vcx.h>

@implementation RNIndy
@synthesize bridge = _bridge;

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

// List all your events here
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#sending-events-to-javascript
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"NoEvent"];
}

#pragma mark - Private methods
// Implement methods that you want to export to the native module
- (void) emitMessageToRN: (NSString *)eventName :(NSDictionary *)params {
  // The bridge eventDispatcher is used to send events from native to JS env
  // No documentation yet on DeviceEventEmitter: https://github.com/facebook/react-native/issues/2819
  [self sendEventWithName: eventName body: params];
}

#pragma mark - React Native exposed methods

// delete connection
RCT_EXPORT_METHOD(deleteConnection:(NSInteger) connectionHandle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] deleteConnection:connectionHandle
                                 withCompletion:^(NSError *error)
  {
     if (error != nil && error.code != 0)
     {
       NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
       reject(indyErrorCode, @"Error occurred while deleting connection", error);
     } else {
       resolve(@true);
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

RCT_EXPORT_METHOD(vcxUpdatePushToken: (NSString *)config
                         resolver: (RCTPromiseResolveBlock) resolve
                         rejecter: (RCTPromiseRejectBlock) reject)
{
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

RCT_EXPORT_METHOD(proofCreateWithRequest:(NSString*)sourceId
                  withProofRequest:(NSString*)proofRequest
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] proofCreateWithRequest:sourceId
                                     withProofRequest:proofRequest
                                       withCompletion:^(NSError *error, vcx_proof_handle_t proofHandle)
  {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while creating proof request", error);
    }
    else {
      resolve(@(proofHandle));
    }
  }];
}

RCT_EXPORT_METHOD(proofSerialize:(NSInteger)proofHandle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] proofSerialize:proofHandle
                               withCompletion:^(NSError *error, NSString *proof_request)
  {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while serializing proof request", error);
    }
    else {
      resolve(proof_request);
    }
  }];
}

RCT_EXPORT_METHOD(proofDeserialize:(NSString *)serializedProof
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] proofDeserialize:serializedProof
                                 withCompletion:^(NSError *error, vcx_proof_handle_t proofHandle)
  {
    if (error != nil && error.code != 0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while de-serializing proof request", error);
    }
    else {
      resolve(@(proofHandle));
    }
  }];
}

RCT_EXPORT_METHOD(downloadMessages: (NSString *) messageStatus
                             uid_s: (NSString *) uid_s
                            pwdids: (NSString *) pwdids
                          resolver: (RCTPromiseResolveBlock) resolve
                          rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] downloadMessages: messageStatus uid_s:uid_s pwdids:pwdids completion:^(NSError *error, NSString *messages) {
    if (error != nil && error.code !=0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occured while downloading messages", error);
    } else{
      resolve(messages);
    }
  }];
}
 RCT_EXPORT_METHOD(updateMessages: (NSString *)messageStatus
                      pwdidsJson: (NSString *)pwdidsJson
                        resolver: (RCTPromiseResolveBlock) resolve
                        rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] updateMessages:messageStatus pwdidsJson:pwdidsJson completion:^(NSError *error) {
    if (error != nil && error.code !=0) {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occured while updating message status", error);
    } else {
      resolve(@{});
    }
  }];
}

RCT_EXPORT_METHOD(getTokenInfo:(NSInteger) paymentHandle
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] getTokenInfo:paymentHandle withCompletion:^(NSError *error, NSString *tokenInfo) {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while getting token info", error);
    } else {
      resolve(tokenInfo);
    }
  }];
}

RCT_EXPORT_METHOD(sendTokens:(NSInteger) paymentHandle
                  withTokens:(NSString *) tokens
                  withRecipient:(NSString *) recipient
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] sendTokens:paymentHandle
                               withTokens:tokens
                            withRecipient:recipient
                           withCompletion:^(NSError *error, NSString *recipient)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while sending tokens", error);
    } else {
      resolve(recipient);
    }
  }];
}

RCT_EXPORT_METHOD(createPaymentAddress:(NSString*)seed
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  [[[ConnectMeVcx alloc] init] createPaymentAddress:seed
                                     withCompletion:^(NSError *error, NSString *address)
  {
    if (error != nil && error.code != 0)
    {
      NSString *indyErrorCode = [NSString stringWithFormat:@"%ld", (long)error.code];
      reject(indyErrorCode, @"Error occurred while creating payment address", error);
    } else {
      resolve(address);
    }
  }];
}

RCT_EXPORT_METHOD(createWalletKey: (NSInteger) lengthOfKey
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
  // Generate secure random string
  NSMutableData *data = [NSMutableData dataWithLength:lengthOfKey];
  int result = SecRandomCopyBytes(NULL, lengthOfKey, data.mutableBytes);
  if (result == 0) {
    NSString* value = [data base64EncodedStringWithOptions:0];
    resolve(value);
  } else {
    reject(@"W-001", @"Error occurred while generating wallet key", nil);
  }
}

@end
