package com.reduxslicesample;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Intent;
import android.os.Build;
import android.provider.AlarmClock;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import static android.app.Activity.RESULT_OK;
import static android.content.Context.KEYGUARD_SERVICE;

public class SecurityModule extends ReactContextBaseJavaModule {

    ReactContext reactContext;
    private static final String E_AUTH_RECOGNIZED_SUCCESS = "E_AUTH_RECOGNIZED_SUCCESS";
    private static final String E_AUTH_NOT_RECOGNIZED_SUCCESS = "E_AUTH_NOT_RECOGNIZED_SUCCESS";
    private static final String SECURITY_LOCK_NOT_AVAILABLE = "SECURITY_LOCK_NOT_AVAILABLE";
    private static final String IS_SECURITY_ENABLED = "IS_SECURITY_ENABLED";
    private static final String IS_SECURITY_DISABLED = "IS_SECURITY_DISABLED";

    private static final int LOCK_REQUEST_CODE = 221;
    private static final int SECURITY_SETTING_REQUEST_CODE = 233;
    private static final int OPEN_SECURITY_SETTING_REQUEST_CODE = 241;

    @Override
    public String getName() {
        /**
         * return the string name of the NativeModule which represents this class in JavaScript
         * In JS access this module through React.NativeModules.SecurityModule
         */
        return "SecurityModule";
    }

    @ReactMethod
    public void authenticateDevice() {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            return;
        }

        try {
            authenticateApp(currentActivity);
        } catch (Exception e) {

        }
    }

    @ReactMethod
    public void isSecurityEnabled() {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            return;
        }

        try {
            if (isDeviceSecure()) {
                WritableMap params = Arguments.createMap();
                params.putString("eventProperty", IS_SECURITY_ENABLED);

                sendEvent(reactContext, "SecurityAuth", params);
            } else {
                WritableMap params = Arguments.createMap();
                params.putString("eventProperty", IS_SECURITY_DISABLED);

                sendEvent(reactContext, "SecurityAuth", params);
            }
        } catch (Exception e) {

        }
    }

    @ReactMethod
    public void openSettingsScreen() {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            return;
        }

        //If some exception occurs means Screen lock is not set up please set screen lock
        //Open Security screen directly to enable patter lock
        Intent intent = new Intent(Settings.ACTION_SECURITY_SETTINGS);
        try {
            //Start activity for result
            currentActivity.startActivityForResult(intent, OPEN_SECURITY_SETTING_REQUEST_CODE);
        } catch (Exception ex) {

        }
    }

    @ReactMethod
    public void setRemainder(){
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            return;
        }
        Intent mClockIntent = new Intent(AlarmClock.ACTION_SHOW_ALARMS);
        mClockIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        currentActivity.startActivity(mClockIntent);
    }

    //method to authenticate app
    private void authenticateApp(Activity activity) {
        //Get the instance of KeyGuardManager
        KeyguardManager keyguardManager = (KeyguardManager) activity.getSystemService(KEYGUARD_SERVICE);

        //Check if the device version is greater than or equal to Lollipop(21)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            //Create an intent to open device screen lock screen to authenticate
            //Pass the Screen Lock screen Title and Description
            Intent i = keyguardManager.createConfirmDeviceCredentialIntent(activity.getResources().getString(R.string.unlock), activity.getResources().getString(R.string.confirm_pattern));
            try {
                //Start activity for result
                activity.startActivityForResult(i, LOCK_REQUEST_CODE);
            } catch (Exception e) {

                //If some exception occurs means Screen lock is not set up please set screen lock
                //Open Security screen directly to enable patter lock
                // Un-Commented it was used to show the settings screen when user not enabled a single security (PIN, pattern, PASSWORD, FINGERPRINT)
//                Intent intent = new Intent(Settings.ACTION_SECURITY_SETTINGS);
//                try {
//                    //Start activity for result
//                    activity.startActivityForResult(intent, SECURITY_SETTING_REQUEST_CODE);
//                } catch (Exception ex) {
//
//                }
            }
        } else {
            WritableMap params = Arguments.createMap();
            params.putString("eventProperty", SECURITY_LOCK_NOT_AVAILABLE);

            sendEvent(reactContext, "SecurityAuth", params);
        }
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

        /**
         * Get image data
         *
         * @param requestCode
         * @param resultCode
         * @param data
         */
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
            super.onActivityResult(activity, requestCode, resultCode, data);

            if (requestCode == LOCK_REQUEST_CODE) {

                    if (resultCode == RESULT_OK) {
                        //If screen lock authentication is success update text
                        WritableMap params = Arguments.createMap();
                        params.putString("eventProperty", E_AUTH_RECOGNIZED_SUCCESS);

                        sendEvent(reactContext, "SecurityAuth", params);
                        Log.d("aaa", "test 3");
                    } else {
                        //If screen lock authentication is failed update text
                        WritableMap params = Arguments.createMap();
                        params.putString("eventProperty", E_AUTH_NOT_RECOGNIZED_SUCCESS);

                        sendEvent(reactContext, "SecurityAuth", params);
                    }

              //  }
            } else if (requestCode == SECURITY_SETTING_REQUEST_CODE) {

                    if (isDeviceSecure()) {
                        //If screen lock enabled show toast and start intent to authenticate user
                        try {

                            authenticateApp(activity);

                        } catch (Exception e) {

                        }
                    } else {

                    }
            } else if (requestCode == OPEN_SECURITY_SETTING_REQUEST_CODE) {
                if (isDeviceSecure()) {
                    WritableMap params = Arguments.createMap();
                    params.putString("eventProperty", IS_SECURITY_ENABLED);

                    sendEvent(reactContext, "SecurityAuth", params);
                } else {
                    WritableMap params = Arguments.createMap();
                    params.putString("eventProperty", IS_SECURITY_DISABLED);

                    sendEvent(reactContext, "SecurityAuth", params);
                }
            }
        }
    };

    /**
     * method to return whether device has screen lock enabled or not
     **/
    private boolean isDeviceSecure() {
        KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(KEYGUARD_SERVICE);

        //this method only work whose api level is greater than or equal to Jelly_Bean (16)
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN && keyguardManager.isKeyguardSecure();

        //You can also use keyguardManager.isDeviceSecure(); but it requires API Level 23

    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    /* constructor */
    public SecurityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(mActivityEventListener);
    }
}