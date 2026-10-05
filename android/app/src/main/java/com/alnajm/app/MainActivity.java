package com.alnajm.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int PERMISSION_REQUEST_CODE = 1001;

    public class AndroidBridgeInterface {
        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(() -> finishAffinity());
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Request Android native permissions for Microphone and Audio
        requestAudioPermissions();

        // 2. Configure WebView for WebRTC Audio Capture and Hardware Acceleration
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                // Enable hardware layer for silky smooth rendering and thermal efficiency
                webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

                WebSettings settings = webView.getSettings();
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setMediaPlaybackRequiresUserGesture(false);

                // Add Native JS Bridge for clean app exit & native control
                webView.addJavascriptInterface(new AndroidBridgeInterface(), "AndroidBridge");

                // Crucial for WebRTC: Allow Android WebView to capture microphone audio
                webView.setWebChromeClient(new WebChromeClient() {
                    @Override
                    public void onPermissionRequest(final PermissionRequest request) {
                        runOnUiThread(() -> {
                            String[] resources = request.getResources();
                            for (String resource : resources) {
                                if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource) ||
                                    PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)) {
                                    request.grant(resources);
                                    return;
                                }
                            }
                            request.grant(resources);
                        });
                    }
                });
            }
        } catch (Exception ignored) {}
    }

    @Override
    public void onBackPressed() {
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.evaluateJavascript("window.handleAndroidHardwareBack ? window.handleAndroidHardwareBack() : false", value -> {
                    if ("false".equals(value) || "null".equals(value)) {
                        super.onBackPressed();
                    }
                });
                return;
            }
        } catch (Exception ignored) {}
        super.onBackPressed();
    }

    private void requestAudioPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            boolean audioPermission = ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
            boolean modifyAudio = ContextCompat.checkSelfPermission(this, Manifest.permission.MODIFY_AUDIO_SETTINGS) == PackageManager.PERMISSION_GRANTED;

            if (!audioPermission || !modifyAudio) {
                ActivityCompat.requestPermissions(
                    this,
                    new String[]{
                        Manifest.permission.RECORD_AUDIO,
                        Manifest.permission.MODIFY_AUDIO_SETTINGS
                    },
                    PERMISSION_REQUEST_CODE
                );
            }
        }
    }
}
