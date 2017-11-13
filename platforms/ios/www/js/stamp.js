app.controller('stampCtr', function($scope, $http) {
    //スタンプ画面のコントローラー
    lodingIcon.style.visibility = "hidden";

    if (!navigator.geolocation) {
        // エラーコードに合わせたエラー内容をアラート表示
        ons.notification.alert({ message: "お使いの端末ではGPSがご利用いただけません。", title: "エラー", cancelable: true });
    }

    $scope.getGps = function() {
        lodingIcon.style.visibility = "visible";
        gpsButton.innerHTML = "現在位置取得中";
        //android専用高度取得プラグイン呼び出し
        androidgps.getLocation('', success, error);
        //現在位置取得ボタンタップ時
       //getGps($http);
    }

    function success(jsonArray){
        console.log(jsonArray);
    }

    function error (message){
        console.log(message);
    }

    stampPage.addEventListener("hide", function() {
        //スタンプページが隠れた場合
        gps.innerHTML = "";
        gpsButton.innerHTML = "現在位置取得";
        stamp.innerHTML = "";
        mapCanvas.innerHTML = null;
        stampImg.src = "";
        stampImg.className = "";
        stampImg2.src = "";
        stampImg2.className = "";
        gpsButton.disabled = false;
    });

    //アニメーション終了時のイベント
    stampImg.addEventListener("animationend", function() {
        switch (stampImg.className) {
            case "animated bounceInDown":
                stampImg.className = "animated bounceOutUp";
                break;
            case "animated bounceOutUp":
                stampImg.className = "animated rollIn";
                break;
        }
    });

    stampImg2.addEventListener("animationend", function() {
        switch (stampImg2.className) {
            case "animated wobble":
                stampImg2.className = "animated rubberBand infinite";
                break;

        }
    });


});

function getGps($http) {
    //位置情報取得
    var onGpsSuccess = function(position) {
        //この辺りで緯度、経度を送信する
        var id = localStorage.getItem('ID');
        var n = 6; // 小数点第n位まで残す
        var latitude = Math.floor(position.coords.latitude * Math.pow(10, n)) / Math.pow(10, n);
        var longitude = Math.floor(position.coords.longitude * Math.pow(10, n)) / Math.pow(10, n);
        var altitude = Math.floor(position.coords.altitude * Math.pow(10, n)) / Math.pow(10, n);
        var accuracy = Math.floor(position.coords.accuracy * Math.pow(10, n)) / Math.pow(10, n);
        var altitudeAccuracy = Math.floor(position.coords.altitudeAccuracy * Math.pow(10, n)) / Math.pow(10, n);
        var gpsData = {
            userId: id,
            lat: latitude,
            lng: longitude,
            alt: altitude,
            acc: accuracy,
            altacc: altitudeAccuracy
        };
        checkGps(gpsData, $http);
    };

    var onGpsError = function(message) {
        lodingIcon.style.visibility = "hidden";
        gpsButton.innerHTML = "再取得";
        //iOSでalterを使用すると問題が発生する可能性がある為、問題回避の為setTimeoutを使用する。
        setTimeout(function() {
            // エラーコードのメッセージを定義
            var errorMessage = {
                0: "原因不明のエラーが発生しました。",
                1: "位置情報の取得が許可されませんでした。",
                2: "電波状況などで位置情報が取得できませんでした。",
                3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました。",
            };

            // エラーコードに合わせたエラー内容をアラート表示
            ons.notification.alert({ message: errorMessage[message.code], title: "エラー", cancelable: true });
        }, 0);
        //navigator.geolocation.clearWatch(watchId);
    };

    //watchPositionは移動を検知できる。今回は移動は取得しないのでgetCurrentPositionを使用。
    //watchId = navigator.geolocation.watchPosition(onGpsSuccess, onGpsError, option);
    navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError);
}

function checkGps(gpsData, $http) {
    //Ajax通信でphpにアクセス
    var url = "http://japan-izm.com/dat/kon/test/stamp/api/pressStamp.php",
        config = {
            timeout: 5000
        };
    $http.post(url, gpsData, config).
    success(function(data, status) {
        lodingIcon.style.visibility = "hidden";
        var str =
            //Latitude(緯度)：-90.0～90.0
            "緯度:" + gpsData["lat"] +
            //Longitude(経度)：-180.0～180.0
            "/経度:" + gpsData["lng"] + " \n" +
            //Altitude(高度)　単位：メートル
            "高度:" + gpsData["alt"] + "m" + " \n" +
            //Accuracy(位置精度)　単位：メートル
            "位置精度:" + gpsData["acc"] + "m/ " +
            //AltitudeAccuracy(高度精度)　単位：メートル *Androidでは使えない。nullしか返ってこない
            "高度精度:" + gpsData["altacc"] + "m";
        $('#gps').html(str.replace(/\r?\n/g, '<br>'));

        gpsButton.innerHTML = "範囲内";
        stamp.innerHTML = "スタンプ取得済み";
        stampImg.src = "img/gif-test.gif";
        stampImg.className = "animated bounceInDown";
        stampImg2.src = "img/png-test.png";
        stampImg2.className = "animated wobble";
        gpsButton.disabled = true;
        var mapOptions = {
            center: new google.maps.LatLng(0, 0),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(mapCanvas, mapOptions);

        var latLong = new google.maps.LatLng(gpsData["lat"], gpsData["lng"]);

        var marker = new google.maps.Marker({
            position: latLong
        });

        // 誤差を円で描く
        new google.maps.Circle({
            map: map,
            center: latLong,
            radius: gpsData["acc"], // 単位はメートル
            strokeColor: '#0088ff',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#0088ff',
            fillOpacity: 0.2
        });
        marker.setMap(map);
        map.setZoom(16);
        map.setCenter(marker.getPosition());
        navigator.vibrate(1000, 1000);
    }).
    error(function(data, status) {
        ons.notification.alert({ message:"エラーが発生しました。", title: "エラー", cancelable: true });
        console.log(data);
    });
}