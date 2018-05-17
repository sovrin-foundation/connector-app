//  Created by react-native-create-bridge

package com.connectme.rnindy;

import android.animation.ArgbEvaluator;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.support.annotation.Nullable;
import android.support.v7.graphics.Palette;
import android.os.Environment;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import net.hockeyapp.android.metrics.model.Internal;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;

import org.json.JSONObject;

public class RNIndyModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "RNIndy";
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
        WritableMap oneTimeInfo = Arguments.createMap();
        oneTimeInfo.putString("sdk_to_remote_did", staticData.oneTimeAddConnection.get("userDID"));
        oneTimeInfo.putString("sdk_to_remote_verkey", staticData.oneTimeAddConnection.get("verificationKey"));
        oneTimeInfo.putString("institution_did", "oneTimeAgencyDid");
        oneTimeInfo.putString("institution_verkey", "oneTimeAgencyVerKey");
        oneTimeInfo.putString("remote_to_sdk_did", "oneTimeAgentDid");
        oneTimeInfo.putString("remote_to_sdk_verkey", "oneTimeAgentVerKey");

        // TODO: call vcx_agent_provision_async of libvcx
        // pass a json string
        // callback would get an error code and a json string back in case of success
        promise.resolve(oneTimeInfo);
    }

    @ReactMethod
    public void init(String config, final Promise promise) {
        // TODO: call vcx_init_with_config
        // pass a json config string
        Timer t = new Timer();
        t.schedule(new TimerTask() {
            @Override
            public void run() {
                promise.resolve(true);
            }
        }, (long)(Math.random()*1000));
    }

    @ReactMethod
    public void createConnectionWithInvite(String invitationId, String inviteDetails, Promise promise) {
        // TODO: call vcx_connection_create_with_invite
        // pass invitationId as sourceId
        // and inviteDetails is a json string
        // it will return connection handle that will be an integer or error code
        promise.resolve(1);
    }

    @ReactMethod
    public void acceptInvitation(int connectionHandle, Promise promise) {
        // TODO: call vcx_connection_connect
        // pass connection handle as integer that we got from createConnectionWithInvite
        WritableMap pairwiseInfo = Arguments.createMap();
        pairwiseInfo.putString("pw_did", "user1Did");
        pairwiseInfo.putString("pw_verkey", "user1VerificationKey");
        pairwiseInfo.putString("endpoint", "senderEndpoint");
        pairwiseInfo.putString("agent_did", "myPairwiseAgentDid");
        pairwiseInfo.putString("agent_vk", "myPairwiseAgentVerKey");
        pairwiseInfo.putString("their_pw_did", "senderPairwiseDid");
        pairwiseInfo.putString("their_pw_verkey", "senderPairwiseVerKey");

        promise.resolve(pairwiseInfo);
    }

    @ReactMethod
    public void updatePushToken(String config, Promise promise) {
        // TODO: call vcx_agent_update_info
        // with first parameter as json string
        promise.resolve(true);
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
        // call vcx_proof_create
        promise.resolve("{}");
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
                                for (Palette.Swatch swatchItem: swatchList) {
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
        }, (long)(Math.random()*1000));
    }

    private static final int BUFFER = 2048;

    @ReactMethod
    public void backupDataWallet(String documentDirectory, String agencyConfig, Promise promise) { 
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
        ){
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
        }
        catch (IOException e) {
            promise.reject(e);
        }
    }
}
