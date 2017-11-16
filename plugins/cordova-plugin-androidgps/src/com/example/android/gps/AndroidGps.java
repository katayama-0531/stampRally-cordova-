package com.example.android.gps;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.PowerManager;
import android.support.v4.content.ContextCompat;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by ashira04 on 2017/11/09.
 * AndroidGps(Android専用位置情報取得plugin)
 */

public class AndroidGps extends CordovaPlugin {

    private static LocationManager mLocationManager;
    private static PowerManager.WakeLock wakelock;
    private Context context;
    java.util.Timer timer;
    String msg = "";

    /**
     * コンストラクタ（プラグイン時）
     */
    public AndroidGps() {

    }

    /**
     * コンストラクタ（非プラグイン時）
     */
    public AndroidGps(Context context) {
        this.context = context;
        init();
    }

    /**
     * Cordovaプラグインとして動作するときの初期化処理
     *
     * @param cordova
     * @param webView
     */
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        context = cordova.getActivity();
        init();
    }

    /**
     * 初期化
     */
    private void init() {
    }

    /**
     * cordovaプラグインの実行
     *
     * @param action
     * @param args
     * @param callbackContext
     * @return
     * @throws JSONException
     */
    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {

        if (action.equals("getLocation")) {
            mLocationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
            // 位置情報機能非搭載端末の場合
            if (mLocationManager == null) {
                msg = "位置情報機能非搭載端末です。";
            }

            Criteria criteria = new Criteria();
            criteria.setAltitudeRequired(true);
            criteria.setPowerRequirement(Criteria.POWER_LOW);
            String provider = mLocationManager.getBestProvider(criteria, true);
            
            // 初期化時．PARTIAL_WAKE_LOCKの準備をする
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            wakelock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, this.getClass().getName());

            // GPS使用開始時．PARTIAL_WAKE_LOCKを取得する
            wakelock.acquire();

            int fineLocation = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION);
            int coarseLocation = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION);
            if (fineLocation != PackageManager.PERMISSION_GRANTED && coarseLocation != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
            mLocationManager.getLastKnownLocation(provider);
            final LocationListener locationListener = new LocationListener() {
                @Override
                public void onLocationChanged(Location location) {

                    timer.cancel();
                    mLocationManager.removeUpdates(this);
                    wakelock.release();

                    Map<String,Object> map = new HashMap<>();
                    map.put("latitude", location.getLatitude());
                    map.put("longitude", location.getLongitude());
                    map.put("altitude", location.getAltitude());
                    map.put("accuracy", location.getAccuracy());

                    ObjectMapper mapper = new ObjectMapper();

                    String json = new String();
                    try {
                        json = mapper.writeValueAsString(map);
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK,json));
                }

                @Override
                public void onStatusChanged(String provider, int status, Bundle extras) {}

                @Override
                public void onProviderEnabled(String provider) {}

                @Override
                public void onProviderDisabled(String provider) {}
            };

            //タイムアウト処理
            final java.util.TimerTask tt = new java.util.TimerTask() {
                android.os.Handler handler = new android.os.Handler();
                @Override
                public void run() {
                    mLocationManager.removeUpdates(locationListener);
                    wakelock.release();
                    msg = "位置情報の取得に時間がかかりすぎるため位置情報の取得をキャンセルしました。";
                    callbackContext.error(msg);
                }
            };
            timer = new java.util.Timer(true);
            timer.schedule(tt,(long)5000);

            mLocationManager.requestLocationUpdates(provider, 1000, 0, locationListener);


        } else {
            msg = "位置情報の取得に失敗しました。";
            callbackContext.error(msg);
            return false;
        }

        return true;
    }
}
