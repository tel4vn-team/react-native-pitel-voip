package com.reactnativepitelvoip;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.os.Build;
import android.view.WindowManager;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.UiThreadUtil;

public class LockScreenModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "LockScreenModule";
    private static final String TAG = "LockScreenModule";
    
    private ReactApplicationContext reactContext;

    public LockScreenModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void showOnLockScreen(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            try {
                Activity currentActivity = getCurrentActivity();
                if (currentActivity == null) {
                    promise.reject("NO_ACTIVITY", "No current activity found");
                    return;
                }

                Log.d(TAG, "Setting up lock screen bypass flags");

                // Set flags to show over lock screen
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                    currentActivity.setShowWhenLocked(true);
                    currentActivity.setTurnScreenOn(true);
                    
                    // For Android 10+ (API 29+)
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        KeyguardManager keyguardManager = (KeyguardManager) currentActivity.getSystemService(Context.KEYGUARD_SERVICE);
                        if (keyguardManager != null) {
                            keyguardManager.requestDismissKeyguard(currentActivity, null);
                        }
                    }
                } else {
                    // For older Android versions
                    currentActivity.getWindow().addFlags(
                        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                        WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                    );
                }

                Log.d(TAG, "Lock screen bypass flags set successfully");
                promise.resolve(true);
                
            } catch (Exception e) {
                Log.e(TAG, "Error setting lock screen flags", e);
                promise.reject("LOCK_SCREEN_ERROR", "Failed to set lock screen flags: " + e.getMessage());
            }
        });
    }

    @ReactMethod
    public void clearLockScreenFlags(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            try {
                Activity currentActivity = getCurrentActivity();
                if (currentActivity == null) {
                    promise.reject("NO_ACTIVITY", "No current activity found");
                    return;
                }

                Log.d(TAG, "Clearing lock screen bypass flags");

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                    currentActivity.setShowWhenLocked(false);
                    currentActivity.setTurnScreenOn(false);
                } else {
                    currentActivity.getWindow().clearFlags(
                        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                        WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                    );
                }

                Log.d(TAG, "Lock screen bypass flags cleared successfully");
                promise.resolve(true);
                
            } catch (Exception e) {
                Log.e(TAG, "Error clearing lock screen flags", e);
                promise.reject("LOCK_SCREEN_ERROR", "Failed to clear lock screen flags: " + e.getMessage());
            }
        });
    }

    @ReactMethod
    public void isDeviceLocked(Promise promise) {
        try {
            KeyguardManager keyguardManager = (KeyguardManager) reactContext.getSystemService(Context.KEYGUARD_SERVICE);
            if (keyguardManager != null) {
                boolean isLocked = keyguardManager.isKeyguardLocked();
                Log.d(TAG, "Device lock status: " + isLocked);
                promise.resolve(isLocked);
            } else {
                promise.resolve(false);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking device lock status", e);
            promise.reject("LOCK_SCREEN_ERROR", "Failed to check lock status: " + e.getMessage());
        }
    }

    @ReactMethod
    public void wakeUpScreen(Promise promise) {
        UiThreadUtil.runOnUiThread(() -> {
            try {
                Activity currentActivity = getCurrentActivity();
                if (currentActivity == null) {
                    promise.reject("NO_ACTIVITY", "No current activity found");
                    return;
                }

                Log.d(TAG, "Waking up screen");
                
                currentActivity.getWindow().addFlags(
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                );

                promise.resolve(true);
                
            } catch (Exception e) {
                Log.e(TAG, "Error waking up screen", e);
                promise.reject("LOCK_SCREEN_ERROR", "Failed to wake up screen: " + e.getMessage());
            }
        });
    }
}