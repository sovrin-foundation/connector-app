package com.connectme;

import com.facebook.react.ReactActivity;

import android.os.Bundle;
import android.provider.Settings;
import android.content.pm.PackageManager;
import android.os.Build;    

import org.devio.rn.splashscreen.SplashScreen;
import io.branch.rnbranch.*;
import android.content.Intent;

// Un-comment below lines to enable vcx, indy logs
//import libcore.io.ErrnoException;
//import libcore.io.Libcore;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    public static final int PERMISSION_REQ_CODE = 1234;
    public static final int OVERLAY_PERMISSION_REQ_CODE = 1235;

    String[] perms = {
        "android.permission.READ_EXTERNAL_STORAGE", 
        "android.permission.WRITE_EXTERNAL_STORAGE"
    };

    public void checkPerms() {
        // Checking if device version > 22 and we need to use new permission model 
        if(Build.VERSION.SDK_INT>Build.VERSION_CODES.LOLLIPOP_MR1) {
            // Checking if we can draw window overlay
            for(String perm : perms){
                // Checking each persmission and if denied then requesting permissions
                if(checkSelfPermission(perm) == PackageManager.PERMISSION_DENIED){
                    requestPermissions(perms, PERMISSION_REQ_CODE);
                    break;
                }
            }
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
      super.onActivityResult(requestCode, resultCode, data);
      if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
          checkPerms();
      }
    }

    @Override
    public void onRequestPermissionsResult(int permsRequestCode, String[] permissions, int[] grantResults){
        switch(permsRequestCode){
            case PERMISSION_REQ_CODE:
                checkPerms();
                break;
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        // un-comment to enable logging in vcx, indy & sovtoken libraries
//        try {
//            Libcore.os.setenv("RUST_LOG", "TRACE", true);
//        } catch (ErrnoException e) {
//            e.printStackTrace();
//        }
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
        checkPerms();
        SplashScreen.show(this);
   }
}
