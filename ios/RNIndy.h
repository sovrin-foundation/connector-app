//  Created by react-native-create-bridge

// import RCTBridgeModule
#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include(“RCTBridgeModule.h”)
#import “RCTBridgeModule.h”
#else
#import “React/RCTBridgeModule.h” // Required when used as a Pod in a Swift project
#endif

// import RCTEventEmitter
#if __has_include(<React/RCTEventEmitter.h>)
#import <React/RCTEventEmitter.h>
#elif __has_include(“RCTEventEmitter.h”)
#import “RCTEventEmitter.h”
#else
#import “React/RCTEventEmitter.h” // Required when used as a Pod in a Swift project
#endif

#import <libindy/IndyTypes.h>

typedef void(^CompletionWithError)(NSError *error);
typedef void(^OpenWalletCompletion)(NSError *error, IndyHandle walletHandle);
typedef void(^CreateDidCompletion)(NSError *error, NSString *did, NSString *verkey, NSString *pk);
typedef void(^SignCompletion)(NSError *error, NSString *signature);
typedef void(^VerifySignatureCompletion)(NSError *error, BOOL valid);
typedef void(^EncryptCompletion)(NSError *error, NSData *data, NSData *nonce);
typedef void(^DecryptCompletion)(NSError *error, NSData *data);
typedef void(^CompletionWithJson)(NSError *error, NSString *resultJson);

@interface RNIndy : RCTEventEmitter <RCTBridgeModule>
# pragma mark Wallet blocks
  @property (nonatomic, strong) CompletionWithError walletCreateBlock;
  @property (nonatomic, strong) OpenWalletCompletion openWalletBlock;
  @property (nonatomic, strong) CompletionWithError closeWalletBlock;
  @property (nonatomic, strong) CompletionWithError deleteWalletBlock;
# pragma mark DID blocks
  @property (nonatomic, strong) CreateDidCompletion createDidBlock;
  @property (nonatomic, strong) CreateDidCompletion replaceKeysBlock;
  @property (nonatomic, strong) CompletionWithError storeTheirDidBlock;
# pragma mark Signature blocks
  @property (nonatomic, strong) SignCompletion signBlock;
  @property (nonatomic, strong) VerifySignatureCompletion verifySignatureBlock;
# pragma mark Encryption/Decryption blocks
  @property (nonatomic, strong) EncryptCompletion encryptBlock;
  @property (nonatomic, strong) DecryptCompletion decryptBlock;
# pragma mark Ledger based communication blocks
  @property (nonatomic, strong) CompletionWithJson getNymBlock;
  @property (nonatomic, strong) CompletionWithJson getAttribBlock;
  @property (nonatomic, strong) CompletionWithJson getSchemaBlock;
  @property (nonatomic, strong) CompletionWithJson getClaimDefBlock;
  @property (nonatomic, strong) CompletionWithJson getDdoBlock;
  @property (nonatomic, strong) CompletionWithJson getTxnBlock;
# pragma mark Prover based blocks
  @property (nonatomic, strong) CompletionWithError proverStoreClaimOfferBlock;
  @property (nonatomic, strong) CompletionWithJson proverGetClaimOffersBlock;
  @property (nonatomic, strong) CompletionWithError proverCreateMasterSecretBlock;
  @property (nonatomic, strong) CompletionWithJson proverCreateStoreClaimBlock;
  @property (nonatomic, strong) CompletionWithError proverStoreClaimBlock;
  @property (nonatomic, strong) CompletionWithJson proverGetClaimsBlock;
  @property (nonatomic, strong) CompletionWithJson proverGetClaimsForProofReqBlock;
  @property (nonatomic, strong) CompletionWithJson proverCreateProofBlock;
@end
