package com.connectme;

import com.facebook.react.ReactActivity;


import android.os.Bundle;

import org.devio.rn.splashscreen.SplashScreen;
import android.content.Intent;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

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
        SplashScreen.show(this);
       super.onCreate(savedInstanceState);

   }
}