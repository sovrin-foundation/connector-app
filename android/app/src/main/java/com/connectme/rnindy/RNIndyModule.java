//  Created by react-native-create-bridge

package com.connectme.rnindy;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Environment;
import android.support.v7.graphics.Palette;
import android.util.Log;

import com.connectme.BridgeUtils;
import com.evernym.sdk.vcx.VcxException;
import com.evernym.sdk.vcx.connection.ConnectionApi;
import com.evernym.sdk.vcx.credential.CredentialApi;
import com.evernym.sdk.vcx.credential.GetCredentialCreateMsgidResult;
import com.evernym.sdk.vcx.proof.ProofApi;
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
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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
        //We have top create thew ca cert for the openssl to work properly on android
        BridgeUtils.writeCACert(this.getReactApplicationContext());

        try {
            UtilsApi.vcxAgentProvisionAsync(agencyConfig).exceptionally((t) -> {
                Log.e(TAG, "createOneTimeInfo: ", t);
                promise.reject("FutureException", t.getMessage());
                return "";
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
        Log.d(TAG, "getGenesisPathWithConfig() called with: poolConfig = [" + poolConfig + "], promise = [" + promise + "]");
        File genFile = new File(Environment.getExternalStorageDirectory().getPath() + "/genesis_" + fileName +".txn");
        if (!genFile.exists()) {
            try (FileOutputStream fos = new FileOutputStream(genFile)) {
                fos.write(poolConfig.getBytes());
                promise.resolve(genFile.getAbsolutePath());
            } catch (IOException e) {
                promise.reject("VCXException", e.getMessage());
                e.printStackTrace();
            }

        } else {
            promise.resolve(genFile.getAbsolutePath());
        }

    }

    @ReactMethod
    public void init(String config, Promise promise) {
        Log.d(TAG, " ==> init() called with: config = [" + config + "], promise = [" + promise + "]");
        try {
            VcxApi.vcxInitWithConfig(config).exceptionally((t) -> {
                Log.e(TAG, "init: inside exceptionally of init, should not be here, because exceptionally was not never called");
                Log.e(TAG, "init: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                if (result != -1) {
                    promise.resolve(true);
                }
            });

        }
        catch (AlreadyInitializedException e) {
            // even if we get already initialized exception
            // then also we will resolve promise, because we don't care if vcx is already initialized
            promise.resolve(true);
        }
        catch (VcxException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void createConnectionWithInvite(String invitationId, String inviteDetails, Promise promise) {
        Log.d(TAG, "createConnectionWithInvite() called with: invitationId = [" + invitationId + "], inviteDetails = [" + inviteDetails + "], promise = [" + promise + "]");
        try {
            ConnectionApi.vcxCreateConnectionWithInvite(invitationId, inviteDetails).exceptionally((t) -> {
                Log.e(TAG, "createOneTimeInfo: ", t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> BridgeUtils.resolveIfValid(promise, result));

        } catch (Exception e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

    @ReactMethod
    public void vcxAcceptInvitation(int connectionHandle, String connectionType, Promise promise) {
        Log.d(TAG, "acceptInvitation() called with: connectionHandle = [" + connectionHandle + "], connectionType = [" + connectionType + "], promise = [" + promise + "]");
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
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getMessage(String url,
                           String requestId,
                           String myPairwiseDid,
                           String myPairwiseVerKey,
                           String myPairwiseAgentDid,
                           String myPairwiseAgentVerKey,
                           String myOneTimeAgentDid,
                           String myOneTimeAgentVerKey,
                           String myOneTimeDid,
                           String myOneTimeVerKey,
                           String myAgencyVerKey,
                           String poolConfig,
                           Promise promise) {
        promise.resolve(staticData.getMessage());
    }

    @ReactMethod
    public void sendMessage(String url,
                            String messageType,
                            String messageReplyId,
                            String message,
                            String myPairwiseDid,
                            String myPairwiseVerKey,
                            String myPairwiseAgentDid,
                            String myPairwiseAgentVerKey,
                            String myOneTimeAgentDid,
                            String myOneTimeAgentVerKey,
                            String myOneTimeDid,
                            String myOneTimeVerKey,
                            String myAgencyVerKey,
                            String myPairwisePeerVerKey,
                            String poolConfig,
                            Promise promise) {
        promise.resolve(true);
    }

    @ReactMethod
    public void deleteConnection(String url,
                                 String myPairwiseDid,
                                 String myPairwiseVerKey,
                                 String myPairwiseAgentDid,
                                 String myPairwiseAgentVerKey,
                                 String myOneTimeAgentDid,
                                 String myOneTimeAgentVerKey,
                                 String myOneTimeDid,
                                 String myOneTimeVerKey,
                                 String myAgencyVerKey,
                                 String poolConfig,
                                 Promise promise) {
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
    public void generateProof(String proofRequestId,
                              String requestedAttrs,
                              String requestedPredicates,
                              String proofName,
                              Promise promise) {
        try {
            ProofApi.proofCreate(proofRequestId, requestedAttrs, requestedPredicates, proofName).exceptionally((t) -> {
                Log.e(TAG, "generateProof: ",t );
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void getColor(String imagePath, final Promise promise) {
        Bitmap bitmap = BitmapFactory.decodeFile(imagePath);
        Palette.from(bitmap).generate(
                new Palette.PaletteAsyncListener() {
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
                }
        );
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
    public void backupWallet(String documentDirectory, String agencyConfig, Promise promise) {
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
        String zipPath = documentDirectory + "/wallet-backup.zip";
        try (
                FileOutputStream dest = new FileOutputStream(zipPath);
                ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(dest));
                FileInputStream fi = new FileInputStream(inputDir);
                BufferedInputStream origin = new BufferedInputStream(fi);
        ) {
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
                Log.e(TAG, "getSerializedConnection: ",t );
                promise.reject("FutureException", t.getMessage());
                return "";
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
                Log.e(TAG, "deserializeConnection: ",t );
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
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
        // it would return an error code, an integer credential handle, a json string of credential offer in callback
        // notice that we are returning a Map from here, not string or error code
        // JavaScript layer is expecting a map with two keys defined below
        // with one as an integer and another as json string of claim offer received from vcx

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
                return "";
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
                Log.e(TAG, "deserializeClaimOffer: ",t );
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
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
            CredentialApi.credentialSendRequest(credentialHandle, connectionHandle, paymentHandle).exceptionally((t) -> {
                Log.e(TAG, "sendClaimRequest: ",t );
                promise.reject("FutureException", t.getMessage());
                return "";
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
        // promise.resolve("");
    }

    @ReactMethod
    public void updateClaimOfferState(int credentialHandle, Promise promise) {
        // TODO: Add bridge methods and vcx wrapper methods for update_state api call
        // call vcx_credential_update_state with credentialHandle

        try {
            CredentialApi.credentialUpdateState(credentialHandle).exceptionally((t) -> {
                Log.e(TAG, "updateClaimOfferState: ",t );
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
        // number as 4 refers to accepted state from vcx
        // promise.resolve(4);
    }

    @ReactMethod
    public void getClaimOfferState(int credentialHandle, Promise promise) {
        // TODO: Add vcx wrapper method for vcx_credential_get_state
        // call vcx_credential_get_state and pass credentialHandle

        try {
            CredentialApi.credentialGetState(credentialHandle).exceptionally((t) -> {
                Log.e(TAG, "getClaimOfferState: ",t);
                promise.reject("FutureException", t.getMessage());
                return -1;
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
            e.printStackTrace();
        }
        // number as 4 refers to accepted state from vcx
        // promise.resolve(4);
    }

    @ReactMethod
    public void getClaimVcx(int credentialHandle, Promise promise) {
        // TODO: Add method in wrapper and call vcx_get_credential
        // it will return a json string of format {claimUUID: <stringifiedClaimJson>}
        // or error number as a code

        try {
            CredentialApi.getCredential(credentialHandle).exceptionally((t) -> {
                Log.e(TAG, "getClaimVcx: ",t );
                promise.reject("FutureException", t.getMessage());
                return "";
            }).thenAccept(result -> {
                BridgeUtils.resolveIfValid(promise, result);
            });
        } catch (VcxException e) {
            promise.reject("VCXException", e.getMessage());
        }
    }

}
