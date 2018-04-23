//  Created by react-native-create-bridge

package com.connectme.rnindy;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

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
    public void addConnection (String remoteDID,
                            String senderVerificationKey, 
                            ReadableMap metadata,
                            Promise promise) {
        promise.resolve(staticData.addConnection());
    }

    @ReactMethod
    public void connectToAgency(String url,
                                String myDid,
                                String agencyDid,
                                String myVerKey,
                                String agencyVerKey,
                                String poolConfig,
                                Promise promise) {
        promise.resolve(staticData.connectAgency());
    }

    @ReactMethod
    public void signupWithAgency(String url,
                                String oneTimeAgencyVerKey,
                                String oneTimeAgencyDid,
                                String myOneTimeVerKey,
                                String agencyVerKey,
                                String poolConfig,
                                Promise promise) {
        promise.resolve(true);
    }

    @ReactMethod
    public void createOneTimeAgent(String url,
                                String oneTimeAgencyVerKey,
                                String oneTimeAgencyDid,
                                String myOneTimeVerKey,
                                String agencyVerKey,
                                String poolConfig,
                                Promise promise) {
        promise.resolve(staticData.oneTimeAgent());
    }

    @ReactMethod
    public void createPairwiseAgent(String url,
                                    String myPairwiseDid,
                                    String myPairwiseVerKey,
                                    String oneTimeAgentVerKey,
                                    String oneTimeAgentDid,
                                    String myOneTimeVerKey,
                                    String agencyVerKey,
                                    String poolConfig,
                                    Promise promise) {
        promise.resolve(staticData.pairwiseAgent());
    }

    @ReactMethod
    public void acceptInvitation(String url,
                                String requestId,
                                String myPairwiseDid,
                                String myPairwiseVerKey,
                                ReadableMap invitation,
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
    public void updatePushToken(String url,
                                String token,
                                String uniqueDeviceId,
                                String myOneTimeAgentDid,
                                String myOneTimeAgentVerKey,
                                String myOneTimeVerKey,
                                String myAgencyVerKey,
                                String poolConfig,
                                Promise promise) {
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
    public void reset(String poolConfig, Promise promise) {
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
    public void generateProof(String proofRequest,
                            String remoteDid,
                            String prepareProof,
                            String requestedClaims,
                            String poolConfig,
                            Promise promise) {
        promise.resolve("{}");
    }
}
