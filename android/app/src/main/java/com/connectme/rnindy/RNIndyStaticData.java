package com.connectme.rnindy;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;


public class RNIndyStaticData {
    private int addConnectionCalls = 0;
    private int pairwiseAgentCalls = 0;
    private int getMessageCalls = 0;

    private Map<String, String> oneTimeAddConnection = new HashMap<String, String>(){{
        put("userDID", "3akhf906816kahfadhfas85");
        put("verificationKey", "3akhf906816kahfadhfas853akhf906816kahfadhfas85");
    }};

    private Map<String, String> secondTimeAddConnection = new HashMap<String, String>(){{
        put("userDID", "user1Did");
        put("verificationKey", "user1VerificationKey");
    }};

    private Map<String, String> allOtherAddConnection = new HashMap<String, String>(){{
        put("userDID", "user2Did");
        put("verificationKey", "user2VerificationKey");
    }};

    public String addConnection() {
        if (addConnectionCalls == 0) {
            addConnectionCalls += 1;
            return new JSONObject(oneTimeAddConnection).toString();
        }

        if (addConnectionCalls == 1) {
            addConnectionCalls += 1;
            return new JSONObject(secondTimeAddConnection).toString();
        }

        return new JSONObject(allOtherAddConnection).toString();
    }

    public WritableMap connectAgency() {
        WritableMap connectAgency = Arguments.createMap();
        connectAgency.putString("withPairwiseDID", "oneTimeAgencyDid");
        connectAgency.putString("withPairwiseDIDVerKey", "oneTimeAgencyVerKey");

        return connectAgency;
    }

    public WritableMap oneTimeAgent() {
        WritableMap oneTimeAgent = Arguments.createMap();
        oneTimeAgent.putString("withPairwiseDID", "oneTimeAgentDid");
        oneTimeAgent.putString("withPairwiseDIDVerKey", "oneTimeAgentVerKey");

        return oneTimeAgent;
    }

    public WritableMap pairwiseAgent() {
        if (pairwiseAgentCalls == 0) {
            pairwiseAgentCalls += 1;
            WritableMap pairwiseAgent = Arguments.createMap();
            pairwiseAgent.putString("withPairwiseDID", "myPairwiseAgentDID");
            pairwiseAgent.putString("withPairwiseDIDVerKey", "myPairwiseAgentVerKey");

            return pairwiseAgent;
        }

        WritableMap pairwiseAgentSecondTime = Arguments.createMap();
        pairwiseAgentSecondTime.putString("withPairwiseDID", "myPairwiseAgentDID2");
        pairwiseAgentSecondTime.putString("withPairwiseDIDVerKey", "myPairwiseAgentVerKey2");

        return pairwiseAgentSecondTime;
    }

    public WritableMap getMessage() {
        if (getMessageCalls  % 3 == 0) {
            // if called first, fourth, seventh times etc. then return claim offer
            WritableMap claimOffer = Arguments.createMap();
            claimOffer.putString("payload", "{\"msg_type\":\"CLAIM_OFFER\",\"version\":\"0.1\",\"to_did\":\"BnRXf8yDMUwGyZVDkSENeq\",\"from_did\":\"GxtnGN6ypZYgEqcftSQFnC\",\"iid\":\"cCanHnpFAD\",\"mid\":\"\",\"claim\":{\"name\":[\"Alice\"],\"date_of_birth\":[\"2000-05-17\"],\"height\":[\"175\"]},\"schema_seq_no\":12,\"issuer_did\":\"V4SGRU86Z58d6TV7PBUe6f\",\"nonce\":\"351590\",\"claim_name\":\"Profile detail\",\"issuer_name\":\"Test Enterprise\",\"optional_data\":{\"terms_of_service\":\"<Large block of text>\",\"price\":6},\"remoteName\":\"Test remote name\"}");

            return claimOffer;
        }

        if (getMessageCalls  % 3 == 1) {
            // if called second, fifth, eight times etc. then return claim
            WritableMap claim = Arguments.createMap();
            claim.putString("payload", "{\"msg_type\":\"claim\",\"version\":\"0.1\",\"claim_offer_id\":\"7TNw2k5\",\"from_did\":\"3KFuh4jmMC5Agsy5HcCwFB\",\"to_did\":\"5RHwxmBrGxaEskHcBnLKve\",\"claim\":{\"name\":[\"Test\",\"12\"]},\"schema_seq_no\":12,\"issuer_did\":\"V4SGRU86Z58d6TV7PBUe6f\",\"signature\":{\"primary_claim\":{\"m2\":\"m2\",\"a\":\"a\",\"e\":\"e\",\"v\":\"v\"}}}");

            return claim;
        }

        // if called third, sixth, ninth times etc. then return proof request
        WritableMap proofRequest = Arguments.createMap();
        proofRequest.putString("payload", "{\"@type\":{\"name\":\"PROOF_REQUEST\",\"version\":\"1.0\"},\"@topic\":{\"tid\":1,\"mid\":9},\"intended_use\":\"Verify Home Address\",\"proof_request_data\":{\"nonce\":\"123432421212\",\"name\":\"Home Address\",\"version\":\"0.1\",\"requested_attrs\":{\"<attr1_uuid>\":{\"name\":\"your_name\"},\"<attr2_uuid>\":{\"schema_seq_no\":1,\"name\":\"address_1\"},\"<attr3_uuid>\":{\"schema_seq_no\":2,\"issuer_did\":\"ISSUER_DID2\",\"name\":\"address_2\"},\"<attr4_uuid>\":{\"schema_seq_no\":1,\"name\":\"city\"},\"<attr5_uuid>\":{\"schema_seq_no\":1,\"name\":\"state\"},\"<attr6_uuid>\":{\"schema_seq_no\":1,\"name\":\"zip\"}},\"requested_predicates\":{\"predicate1_uuid\":{\"attr_name\":\"age\",\"p_type\":\"GE\",\"value\":18,\"schema_seq_no\":1,\"issuer_did\":\"DID1\"}}},\"remoteName\":\"Evernym\"}");

        return proofRequest;
    }

    public String generateClaimRequest() {
        Map<String, String> claimRequest = new HashMap<String, String>(){{
            put("blinded_ms", "blindedMasterSecret");
            put("schema_seq_no", "1243");
            put("issuer_did", "issuerDID");
        }};

        return new JSONObject(claimRequest).toString();
    }

    public WritableArray getClaim() {
        WritableArray claims = Arguments.createArray();

        WritableMap claim1 = Arguments.createMap();
        claim1.putString("claim_uuid", "claimuuid1");

        WritableMap claim2 = Arguments.createMap();
        claim1.putString("claim_uuid", "claimuuid2");

        claims.pushMap(claim1);
        claims.pushMap(claim2);

        return claims;
    }


}
