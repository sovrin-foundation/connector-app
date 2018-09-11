//  Created by react-native-create-bridge

package com.connectme.rnindy;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Environment;
import android.support.v7.graphics.Palette;
import android.util.Base64;
import android.util.Log;
import android.content.ContextWrapper;

import com.connectme.BridgeUtils;
import com.evernym.sdk.vcx.VcxException;
import com.evernym.sdk.vcx.wallet.WalletApi;
import com.evernym.sdk.vcx.connection.ConnectionApi;
import com.evernym.sdk.vcx.credential.CredentialApi;
import com.evernym.sdk.vcx.credential.GetCredentialCreateMsgidResult;
import com.evernym.sdk.vcx.proof.CreateProofMsgIdResult;
import com.evernym.sdk.vcx.proof.DisclosedProofApi;
import com.evernym.sdk.vcx.proof.ProofApi;
import com.evernym.sdk.vcx.token.TokenApi;
import com.evernym.sdk.vcx.utils.UtilsApi;
import com.evernym.sdk.vcx.vcx.AlreadyInitializedException;
import com.evernym.sdk.vcx.vcx.VcxApi;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.Charset;
import java.security.SecureRandom;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import android.net.Uri;
import java.io.InputStream;

public class RNIndyModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "RNIndy";
    public static final String TAG = "RNIndy::";
    private static final int BUFFER = 2048;
    private static ReactApplicationContext reactContext = null;
    // TODO:Remove this class once integration with vcx is done
    private static RNIndyStaticData staticData = new RNIndyStaticData();

    public RNIndyModule(ReactApplicationContext context) {
        // Pass in the context to the constructor and save it so you can emit events
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        super(context);

        reactContext = context;
    }

    @Override
    public String getName() {
        // Tell React the name of the module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        return REACT_CLASS;
    }

    @ReactMethod
    public void createOneTimeInfo(String agencyConfig, Promise promise) {
        Log.d(TAG, "createOneTimeInfo() called with: agencyConfig = [" + agencyConfig + "]");
        // We have top create thew ca cert for the openssl to work properly on android
        BridgeUtils.writeCACert(this.getReactApplicationContext());

        try {
            UtilsApi.vcxAgentProvisionAsync(agencyConfig).exceptionally((t) -> {
                Log.e(TAG, "createOneTimeInfo: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                Log.d(TAG, "vcx::APP::async result Prov: " + result);
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void getGenesisPathWithConfig(String poolConfig, String fileName, Promise promise) {
        Log.d(TAG, "getGenesisPathWithConfig() called with: poolConfig = [" + poolConfig + "], promise = [" + promise
                + "]");
        ContextWrapper cw = new ContextWrapper(reactContext);
        File genFile = new File(cw.getFilesDir().toString() + "/genesis_" + fileName + ".txn");
        if (genFile.exists()) {
            genFile.delete();
        }

        try (FileOutputStream fos = new FileOutputStream(genFile)) {
            fos.write(poolConfig.getBytes());
            promise.resolve(genFile.getAbsolutePath());
        } catch (IOException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void init(String config, Promise promise) {
        Log.d(TAG, " ==> init() called with: config = [" + config + "], promise = [" + promise + "]");
        try {
            VcxApi.vcxInitWithConfig(config).exceptionally((t) -> {
                Log.e(TAG, "init: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                // Need to put this logic in every accept because that is how ugly Java's
                // promise API is
                // even if exceptionally is called, then also thenAccept block will be called
                // we either need to switch to complete method and pass two callbacks as
                // parameter
                // till we change to that API, we have to live with this IF condition
                // also reason to add this if condition is because we already rejected promise
                // in
                // exceptionally block, if we call promise.resolve now, then it `thenAccept`
                // block
                // would throw an exception that would not be caught here, because this is an
                // async
                // block and above try catch would not catch this exception
                if (result != -1) {
                    promise.resolve(true);
                }
            });

        } catch (AlreadyInitializedException e) {
            // even if we get already initialized exception
            // then also we will resolve promise, because we don't care if vcx is already
            // initialized
            promise.resolve(true);
        } catch (VcxException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void createConnectionWithInvite(String invitationId, String inviteDetails, Promise promise) {
        Log.d(TAG, "createConnectionWithInvite() called with: invitationId = [" + invitationId + "], inviteDetails = ["
                + inviteDetails + "], promise = [" + promise + "]");
        try {
            ConnectionApi.vcxCreateConnectionWithInvite(invitationId, inviteDetails).exceptionally((t) -> {
                Log.e(TAG, "createOneTimeInfo: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });

        } catch (Exception e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void vcxAcceptInvitation(int connectionHandle, String connectionType, Promise promise) {
        Log.d(TAG, "acceptInvitation() called with: connectionHandle = [" + connectionHandle + "], connectionType = ["
                + connectionType + "], promise = [" + promise + "]");
        try {
            ConnectionApi.vcxAcceptInvitation(connectionHandle, connectionType).exceptionally((t) -> {
                Log.e(TAG, "vcxAcceptInvitation: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> BridgeUtils.resolveIfValid(promise, result));
        } catch (VcxException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void vcxUpdatePushToken(String config, Promise promise) {
        try {
            UtilsApi.vcxUpdateAgentInfo(config).exceptionally((t) -> {
                Log.e(TAG, "vcxUpdatePushToken: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getMessage(String url, String requestId, String myPairwiseDid, String myPairwiseVerKey,
            String myPairwiseAgentDid, String myPairwiseAgentVerKey, String myOneTimeAgentDid,
            String myOneTimeAgentVerKey, String myOneTimeDid, String myOneTimeVerKey, String myAgencyVerKey,
            String poolConfig, Promise promise) {
        promise.resolve(staticData.getMessage());
    }

    @ReactMethod
    public void sendMessage(String url, String messageType, String messageReplyId, String message, String myPairwiseDid,
            String myPairwiseVerKey, String myPairwiseAgentDid, String myPairwiseAgentVerKey, String myOneTimeAgentDid,
            String myOneTimeAgentVerKey, String myOneTimeDid, String myOneTimeVerKey, String myAgencyVerKey,
            String myPairwisePeerVerKey, String poolConfig, Promise promise) {
        promise.resolve(true);
    }

    @ReactMethod
    public void generateClaimRequest(String remoteDid, String claimOffer, String poolConfig, Promise promise) {
        promise.resolve(staticData.generateClaimRequest());
    }

    @ReactMethod
    public void addClaim(String claim, String poolConfig, Promise promise) {
        promise.resolve("{}");
    }

    @ReactMethod
    public void getClaim(String filterJson, String poolConfig, Promise promise) {
        promise.resolve(staticData.getClaim());
    }

    @ReactMethod
    public void prepareProof(String proofRequest, String poolConfig, Promise promise) {
        promise.resolve("{}");
    }

    @ReactMethod
    public void generateProof(String proofRequestId, String requestedAttrs, String requestedPredicates,
            String proofName, Promise promise) {
        try {
            ProofApi.proofCreate(proofRequestId, requestedAttrs, requestedPredicates, proofName).exceptionally((t) -> {
                Log.e(TAG, "generateProof: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void getColor(String imagePath, final Promise promise) {
        Bitmap bitmap = BitmapFactory.decodeFile(imagePath);
        Palette.from(bitmap).generate(new Palette.PaletteAsyncListener() {
            @Override
            public void onGenerated(Palette palette) {
                try {
                    Palette.Swatch swatch = palette.getVibrantSwatch();
                    if (swatch == null) {
                        swatch = palette.getDarkVibrantSwatch();
                    }
                    if (swatch == null) {
                        swatch = palette.getLightVibrantSwatch();
                    }
                    if (swatch == null) {
                        swatch = palette.getMutedSwatch();
                    }
                    if (swatch == null) {
                        swatch = palette.getDarkMutedSwatch();
                    }
                    if (swatch == null) {
                        swatch = palette.getLightMutedSwatch();
                    }
                    if (swatch == null) {
                        swatch = palette.getDominantSwatch();
                    }
                    if (swatch == null) {
                        List<Palette.Swatch> swatchList = palette.getSwatches();
                        for (Palette.Swatch swatchItem : swatchList) {
                            if (swatchItem != null) {
                                swatch = swatchItem;
                                break;
                            }
                        }
                    }

                    int rgb = swatch.getRgb();
                    int r = Color.red(rgb);
                    int g = Color.green(rgb);
                    int b = Color.blue(rgb);
                    WritableArray colors = Arguments.createArray();
                    colors.pushString(String.valueOf(r));
                    colors.pushString(String.valueOf(g));
                    colors.pushString(String.valueOf(b));
                    // add a value for alpha factor
                    colors.pushString("1");
                    promise.resolve(colors);
                } catch (Exception e) {
                    promise.reject("No color", e);
                }
            }
        });
    }

    @ReactMethod
    public void reset(boolean reset, final Promise promise) {
        // TODO: call vcx_reset or vcx_shutdown if later is available
        // pass true to indicate that we delete both pool and wallet objects
        Timer t = new Timer();
        t.schedule(new TimerTask() {
            @Override
            public void run() {
                promise.resolve(true);
            }
        }, (long) (Math.random() * 1000));
    }

    @ReactMethod
    public void backupWallet(String documentDirectory, String encryptionKey, String agencyConfig, Promise promise) {
        // TODO: Remove this file, this is a dummy file, testing for backup the wallet
        String fileName = "backup.txt";
        File file = new File(documentDirectory, fileName);
        String contentToWrite = "Dummy Content";
        try (FileWriter fileWriter = new FileWriter(file)) {
            fileWriter.append(contentToWrite);
            fileWriter.flush();
        } catch (IOException e) {
            promise.reject(e);
        }

        // convert the file to zip
        String inputDir = documentDirectory + "/" + fileName;
        String zipPath = documentDirectory + "/backup.zip";
        try (FileOutputStream dest = new FileOutputStream(zipPath);
                ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(dest));
                FileInputStream fi = new FileInputStream(inputDir);
                BufferedInputStream origin = new BufferedInputStream(fi);) {
            byte data[] = new byte[BUFFER];
            // fileName will be the wallet filename
            ZipEntry entry = new ZipEntry(fileName);
            out.putNextEntry(entry);
            int count;
            while ((count = origin.read(data, 0, BUFFER)) != -1) {
                out.write(data, 0, count);
            }
            out.closeEntry();
            promise.resolve(zipPath);
        } catch (IOException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getSerializedConnection(int connectionHandle, Promise promise) {
        // TODO:KS call vcx_connection_serialize and pass connectionHandle
        try {
            ConnectionApi.connectionSerialize(connectionHandle).exceptionally((t) -> {
                Log.e(TAG, "getSerializedConnection: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void deserializeConnection(String serializedConnection, Promise promise) {
        // TODO call vcx_connection_deserialize and pass serializedConnection
        // it would return an error code and an integer connection handle in callback
        try {
            ConnectionApi.connectionDeserialize(serializedConnection).exceptionally((t) -> {
                Log.e(TAG, "deserializeConnection: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void credentialCreateWithMsgId(String sourceId, int connectionHandle, String messageId, Promise promise) {
        // TODO call vcx_credential_create_with_msgid
        // pass sourceId, connectionHandle, & messageId
        // it would return an error code, an integer credential handle, a json string of
        // credential offer in callback
        // notice that we are returning a Map from here, not string or error code
        // JavaScript layer is expecting a map with two keys defined below
        // with one as an integer and another as json string of claim offer received
        // from vcx

        try {
            CredentialApi.credentialCreateWithMsgid(sourceId, connectionHandle, messageId).exceptionally((t) -> {
                Log.e(TAG, "credentialCreateWithMsgId: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                GetCredentialCreateMsgidResult typedResult = (GetCredentialCreateMsgidResult) result;
                WritableMap vcxCredentialCreateResult = Arguments.createMap();
                vcxCredentialCreateResult.putInt("credential_handle", typedResult.getCredential_handle());
                vcxCredentialCreateResult.putString("credential_offer", typedResult.getOffer());
                BridgeUtils.resolveIfValid(promise, vcxCredentialCreateResult);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }

    }

    @ReactMethod
    public void serializeClaimOffer(int credentialHandle, Promise promise) {
        // it would return error code, json string of credential inside callback

        try {
            CredentialApi.credentialSerialize(credentialHandle).exceptionally((t) -> {
                Log.e(TAG, "serializeClaimOffer: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }

    }

    @ReactMethod
    public void deserializeClaimOffer(String serializedCredential, Promise promise) {
        // it would return an error code and an integer credential handle in callback

        try {
            CredentialApi.credentialDeserialize(serializedCredential).exceptionally((t) -> {
                Log.e(TAG, "deserializeClaimOffer: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void sendClaimRequest(int credentialHandle, int connectionHandle, int paymentHandle, Promise promise) {
        // it would return an error code in callback
        // we resolve promise with an empty string after success
        // or reject promise with error code

        try {
            CredentialApi.credentialSendRequest(credentialHandle, connectionHandle, paymentHandle)
                    .exceptionally((t) -> {
                        Log.e(TAG, "sendClaimRequest: ", t);
                        promise.reject("FutureException", t.getMessage());
                        return null;
                    }).thenAccept(result -> {
                        BridgeUtils.resolveIfValid(promise, result);
                    });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void updateClaimOfferState(int credentialHandle, Promise promise) {
        try {
            CredentialApi.credentialUpdateState(credentialHandle).exceptionally((t) -> {
                Log.e(TAG, "updateClaimOfferState: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void getClaimOfferState(int credentialHandle, Promise promise) {
        try {
            CredentialApi.credentialGetState(credentialHandle).exceptionally((t) -> {
                Log.e(TAG, "getClaimOfferState: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void getClaimVcx(int credentialHandle, Promise promise) {
        try {
            CredentialApi.getCredential(credentialHandle).exceptionally((t) -> {
                Log.e(TAG, "getClaimVcx: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void exportWallet(String exportPath, String encryptionKey, Promise promise) {
        Log.d(TAG, "exportWallet() called with: exportPath = [" + exportPath + "], encryptionKey = [" + encryptionKey
                + "], promise = [" + promise + "]");
        try {
            WalletApi.exportWallet(exportPath, encryptionKey).exceptionally((t) -> {
                Log.e(TAG, "exportWallet: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if(result != -1){
                   BridgeUtils.resolveIfValid(promise, result);
                }        
            });
           

        } catch (Exception e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void decryptWalletFile(String config, Promise promise) {
        try {
            WalletApi.importWallet(config).exceptionally((t) -> {
                Log.e(TAG, "importWallet: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (Exception e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void copyToPath(String uri, String zipPath, Promise promise) {

        InputStream input = null;
        BufferedOutputStream output = null;
        try {

            input = reactContext.getContentResolver().openInputStream(Uri.parse(uri));
            output = new BufferedOutputStream(new FileOutputStream(zipPath));

            {
                byte data[] = new byte[BUFFER];
                int count;
                while ((count = input.read(data, 0, BUFFER)) != -1) {
                    output.write(data, 0, count);
                }
                input.close();
                output.close();
                promise.resolve(zipPath);
            }
        }

        catch (IOException e) {
            promise.reject("copyToPathException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void setWalletItem(String key, String value, Promise promise) {
        try {
            WalletApi.addRecordWallet("record_type", key, value).exceptionally((t) -> {
                Log.e(TAG, "setWalletItem: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VcxException", e.getMessage());
        }
    }

    @ReactMethod
    public void getWalletItem(String key, Promise promise) {
        try {
            WalletApi.getRecordWallet("record_type", key, "").exceptionally((t) -> {
                Log.e(TAG, "getWalletItem: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VcxException", e.getMessage());
        }
    }

    @ReactMethod
    public void deleteWalletItem(String key, Promise promise) {
        try {
            WalletApi.deleteRecordWallet("record_type", key).exceptionally((t) -> {
                Log.e(TAG, "deleteWalletItem: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VcxException", e.getMessage());
        }
    }

    @ReactMethod
    public void updateWalletItem(String key, String value, Promise promise) {
        try {
            WalletApi.updateRecordWallet("record_type", key, value).exceptionally((t) -> {
                Log.e(TAG, "updateWalletItem: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VcxException", e.getMessage());
        }
    }

    @ReactMethod
    public void exitAppAndroid() {
        android.os.Process.killProcess(android.os.Process.myPid());
    }

    @ReactMethod
    public void proofCreateWithMsgId(String sourceId, int connectionHandle, String messageId, Promise promise) {
        try {
            DisclosedProofApi.proofCreateWithMsgId(sourceId, connectionHandle, messageId).exceptionally((t) -> {
                Log.e(TAG, "proofCreateWithMsgId: ", t);
                promise.reject("FutureException: ", t.getMessage());
                return null;
            }).thenAccept(result -> {
                if (result != null) {
                    CreateProofMsgIdResult typedResult = (CreateProofMsgIdResult) result;
                    WritableMap vcxProofCreateResult = Arguments.createMap();
                    vcxProofCreateResult.putInt("proofHandle", typedResult.proofHandle);
                    vcxProofCreateResult.putString("proofRequest", typedResult.proofRequest);
                    BridgeUtils.resolveIfValid(promise, vcxProofCreateResult);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void proofRetrieveCredentials(int proofHandle, Promise promise) {
        try {
            DisclosedProofApi.proofRetrieveCredentials(proofHandle).exceptionally((t) -> {
                Log.e(TAG, "proofRetrieveCredentials: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void proofGenerate(int proofHandle, String selectedCredentials, String selfAttestedAttributes,
            Promise promise) {
        try {
            DisclosedProofApi.proofGenerate(proofHandle, selectedCredentials, selfAttestedAttributes)
                    .exceptionally((t) -> {
                        Log.e(TAG, "proofGenerate: ", t);
                        promise.reject("FutureException", t.getMessage());
                        return -1;
                    }).thenAccept(result -> {
                        if (result != -1) {
                            BridgeUtils.resolveIfValid(promise, result);
                        }
                    });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void proofSend(int proofHandle, int connectionHandle, Promise promise) {
        try {
            DisclosedProofApi.proofSend(proofHandle, connectionHandle).exceptionally((t) -> {
                Log.e(TAG, "proofSend: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void shutdownVcx(Boolean deleteWallet, Promise promise) {
        Log.d(TAG, " ==> shutdownVcx() called with: deleteWallet = [" + deleteWallet);
        try {
            VcxApi.vcxShutdown(deleteWallet);
            promise.resolve("");
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void getTokenInfo(int paymentHandle, Promise promise) {
        try {
            TokenApi.getTokenInfo(paymentHandle).exceptionally((t) -> {
                Log.e(TAG, "getTokenInfo: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void sendTokens(int paymentHandle, String tokens, String recipient, Promise promise) {
        try {
            TokenApi.sendTokens(paymentHandle, tokens, recipient).exceptionally((t) -> {
                Log.e(TAG, "sendTokens: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void createPaymentAddress(String seed, Promise promise) {
        try {
            TokenApi.createPaymentAddress(seed).exceptionally((t) -> {
                Log.e(TAG, "createPaymentAddress: ", t);
                promise.reject("FutureException", t.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void deleteConnection(int connectionHandle, Promise promise) {
        try {
            ConnectionApi.deleteConnection(connectionHandle).exceptionally((t) -> {
                Log.e(TAG, "deleteConnection: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void downloadMessages(String messageStatus, String uid_s, String pwdids, Promise promise) {
      Log.d(TAG, "downloadMessages() called with: messageStatus = [ " + messageStatus + "] , uid_s =[" + uid_s
          + "] and pwdids =[ " + pwdids);
      try {
        UtilsApi.vcxGetMessages(messageStatus, uid_s, pwdids).exceptionally((t) -> {
          Log.d(TAG, "downloadMessages: ", t);
          promise.reject("FutureException", t.getMessage());
          return null;
        }).thenAccept(result -> BridgeUtils.resolveIfValid(promise, result));
  
      } catch (VcxException e) {
        promise.reject("VCXException", e.getMessage());
      }
    }
  
    @ReactMethod
    public void updateMessages(String messageStatus, String pwdidsJson, Promise promise) {
      Log.d(TAG, "updateMessages() called with messageStatus = [ " + messageStatus + "], pwdidJson = [" + pwdidsJson);
  
      try {
        UtilsApi.vcxUpdateMessages(messageStatus, pwdidsJson).exceptionally((t) -> {
          Log.d(TAG, "updateMessages: ", t);
          promise.reject("FutureException", t.getMessage());
          return null;
        }).thenAccept(result -> BridgeUtils.resolveIfValid(promise, result));
      } catch (VcxException e) {
        promise.reject("FutureException", e.getMessage());
      }
    }

    @ReactMethod
    public void proofCreateWithRequest(String sourceId, String proofRequest, Promise promise) {
        Log.d(TAG, "proofCreateWithRequest() called with sourceId = ["+ sourceId +"], proofRequest =["+ proofRequest +"]");

        try {
            DisclosedProofApi.proofCreateWithRequest(sourceId, proofRequest).exceptionally((t)-> {
                Log.d(TAG, "proofCreateWithRequest", t);
                promise.reject("VcxException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch(VcxException e) {
            promise.reject("VcxException", e.getMessage());
        }
    }

    @ReactMethod
    public void proofSerialize(int proofHandle, Promise promise) {
        Log.d(TAG, "proofSerialize() called with proofHandle = ["+ proofHandle +"]");
        try {
            DisclosedProofApi.proofSerialize(proofHandle).exceptionally((e) -> {
                Log.d(TAG, "proofSerialize", e);
                promise.reject("VcxException", e.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch(VcxException e) {
            promise.reject("VcxException", e.getMessage());
        }
    }

    @ReactMethod
    public void proofDeserialize(String serializedProof, Promise promise) {
        Log.d(TAG, "proofDeserialize() called with serializedProof = ["+ serializedProof +"]");

        try {
            DisclosedProofApi.proofDeserialize(serializedProof).exceptionally((e)-> {
                Log.d(TAG, "proofDeserialize", e);
                promise.reject("VcxException", e.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    BridgeUtils.resolveIfValid(promise, result);
                }
            });
        } catch(VcxException e) {
            promise.reject("VcxException", e.getMessage());
        }
    }

    @ReactMethod
    public void createWalletKey(int lengthOfKey, Promise promise) {
        try {
            SecureRandom random = new SecureRandom();
            byte bytes[] = new byte[lengthOfKey];
            random.nextBytes(bytes);
            promise.resolve(Base64.encodeToString(bytes, Base64.NO_WRAP));
        } catch(Exception e) {
            Log.e(TAG, "createWalletKey: ", e);
            promise.reject("Exception", e.getMessage());
        }
    }

    @ReactMethod
    public void getLedgerFees(Promise promise) {
        Log.d(TAG, "getLedgerFees()");

        try {
            UtilsApi.getLedgerFees().exceptionally((e)-> {
                Log.d(TAG, "getLedgerFees", e);
                promise.reject("VcxException", e.getMessage());
                return null;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch(VcxException e) {
            Log.e(TAG, "createWalletKey: ", e);
            promise.reject("Exception", e.getMessage());
        }
    }
}
