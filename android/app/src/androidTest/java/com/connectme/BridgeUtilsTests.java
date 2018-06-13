package com.connectme;

/**
 * Created by abdussami on 08/06/18.
 */

import android.Manifest;
import android.os.Environment;
import android.support.test.InstrumentationRegistry;
import android.support.test.filters.SmallTest;
import android.support.test.rule.GrantPermissionRule;
import android.support.test.runner.AndroidJUnit4;
import android.util.Log;

import junit.framework.Assert;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.RuleChain;
import org.junit.runner.RunWith;

import java.io.File;

import static com.connectme.BridgeUtils.generateCaCertContents;
import static com.connectme.BridgeUtils.writeCACert;

@RunWith(AndroidJUnit4.class)
@SmallTest
public class BridgeUtilsTests {
    public GrantPermissionRule readPermissionRule = GrantPermissionRule.grant(Manifest.permission.READ_EXTERNAL_STORAGE);

    public GrantPermissionRule writePermissionRule = GrantPermissionRule.grant(Manifest.permission.WRITE_EXTERNAL_STORAGE);


    @Rule
    public final RuleChain mRuleChain = RuleChain.outerRule(readPermissionRule)
            .around(writePermissionRule);
    String TAG = "BRIDGE TESTS::";

    @Before
    public void cleanup(){
        File f = new File(Environment.getExternalStorageDirectory().getPath() + "/cacert.pem");
        f.delete();

    }

    @Test
    public void caCertTest() throws InterruptedException {



        String certContents = generateCaCertContents();
        Log.i(TAG, "caCertTest: permission test");
        writeCACert(InstrumentationRegistry.getContext());
        Assert.assertTrue(certContents.contains("MIIEIDCCAwigAwIBAgIQNE7VVyDV7exJ9C/ON9srbTANBgkqhkiG9w0BAQUFADCB"));


    }


}
