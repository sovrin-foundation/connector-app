package com.connectme;

import com.facebook.react.ReactActivity;

import android.os.Bundle;
import android.provider.Settings;
import android.content.pm.PackageManager;
import android.os.Build;    

import org.devio.rn.splashscreen.SplashScreen;
import io.branch.rnbranch.*;
import android.content.Intent;

import android.content.ContextWrapper;
import android.system.Os;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

    @Override
    protected void onStart() {
        super.onStart();
        try {
          ContextWrapper c = new ContextWrapper(this);
          Os.setenv("EXTERNAL_STORAGE", c.getFilesDir().toString(), true);
          // un-comment to enable logging in vcx, indy & sovtoken libraries
          // Os.setenv("RUST_LOG", "TRACE", true);
        } catch(Exception e){
          e.printStackTrace();
        }
        RNBranchModule.initSession(getIntent().getData(), this);
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }

    @Override
    protected String getMainComponentName() {
        return "ConnectMe";
    }

    @Override
   protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
        SplashScreen.show(this);
   }
}
