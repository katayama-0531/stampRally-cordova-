package com.example.android.gps;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.PowerManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;


import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by ashira04 on 2017/11/09.
 * AndroidGps(Android専用位置情報取得plugin)
 */

public class AndroidGps extends CordovaPlugin {

    private static LocationManager mLocationManager;
    private static PowerManager.WakeLock wakelock;
    private Context context;
    private int REQUEST_CODE_LOCATION = 0x01;

    String[] permissions = {Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION};


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
        Log.i(null, "カスタムプラグイン初期化");
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
        String msg = "";

        if (action.equals("getLocation")) {
            mLocationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
            // 位置情報機能非搭載端末の場合
            if (mLocationManager == null) {
                Log.i(null, "位置情報機能非搭載端末で実行");

                msg = "位置情報機能非搭載端末です。";
            }

            Criteria criteria = new Criteria();
            criteria.setAltitudeRequired(true);
            criteria.setPowerRequirement(Criteria.POWER_LOW);
            String provider = mLocationManager.getBestProvider(criteria, true);
            Log.i(null, "位置情報取得開始" + provider);

            // 初期化時．PARTIAL_WAKE_LOCKの準備をする
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            wakelock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, this.getClass().getName());

            // GPS使用開始時．PARTIAL_WAKE_LOCKを取得する
            wakelock.acquire();

            // 表示しているActivityの取得
            //Activity activity = cordova.getActivity();

            int fineLocation = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION);
            int coarseLocation = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION);
            if (fineLocation != PackageManager.PERMISSION_GRANTED && coarseLocation != PackageManager.PERMISSION_GRANTED) {
                if (ActivityCompat.shouldShowRequestPermissionRationale(this.cordova.getActivity(), Manifest.permission.ACCESS_COARSE_LOCATION)){
                   new AlertDialog.Builder(context).setTitle("パーミッション").setMessage("位置情報を使用するにはパーミッションが必要です。")
                           .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                               @Override
                               public void onClick(DialogInterface dialog, int which) {
                                   ActivityCompat.requestPermissions(cordova.getActivity()
                                           , new String[]{Manifest.permission.ACCESS_FINE_LOCATION}
                                           ,REQUEST_CODE_LOCATION);
                               }
                           }).create()
                           .show();
                }

                //権限を取得する
                ActivityCompat.requestPermissions(this.cordova.getActivity()
                        , new String[]{Manifest.permission.ACCESS_FINE_LOCATION}
                        , REQUEST_CODE_LOCATION);
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return false;
            }
            mLocationManager.getLastKnownLocation(provider);

            mLocationManager.requestLocationUpdates(provider, 1000, 1, new LocationListener() {
                @Override
                public void onLocationChanged(Location location) {
                    Log.i("debug", "位置情報取得"+location);

                    mLocationManager.removeUpdates(this);
                    wakelock.release();
                    StringBuilder strB = new StringBuilder();

                    strB.append("Latitude:"+String.valueOf(location.getLatitude()));
                    strB.append("Longitude:"+String.valueOf(location.getLongitude()));
                    strB.append("Accuracy:"+String.valueOf(location.getAccuracy()));
                    Log.i("debug", "コールバック"+callbackContext);
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, strB.toString()));
                }

                @Override
                public void onStatusChanged(String provider, int status, Bundle extras) {
                    Log.i(null, "位置情報onStatusChanged:"+provider);

                }

                @Override
                public void onProviderEnabled(String provider) {
                    Log.i(null, "位置情報取得"+provider);

                }

                @Override
                public void onProviderDisabled(String provider) {
                    Log.i(null, "位置情報onProviderEnabled:"+provider);

                }
            });

        } else {
            msg += "位置情報の取得に失敗しました。";
            callbackContext.error(msg);
            Log.w(null, msg);
            return false;
        }

        return true;
    }
}
