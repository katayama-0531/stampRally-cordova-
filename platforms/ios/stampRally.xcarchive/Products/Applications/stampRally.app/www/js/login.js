var app = ons.bootstrap();
app.controller('AppController', function($scope, $http, $timeout) {
    //ログイン画面のコントローラー
    // メンバ
    this.menu = null;
    var id = localStorage.getItem('ID');
    $scope.loginClick = function() {
        login(id, $http);
    }

    $scope.loginInit = function() {
        var module = angular.module('app', ['onsen.directives']);
        //ログインの通信の為の準備
        module.config(function($httpProvider) {
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
        });
        login(id, $http);
    };

    document.addEventListener("deviceready", function() {
        console.log(navigator.camera);
    }, false);
});

function login(id, $http) {
    //ログイン処理
    var postData = null;
    if (id) {
        postData = {
            userId: id
        };
    }
    //Ajax通信でphpにアクセス
    var url = "http://japan-izm.com/dat/kon/test/stamp/api/login.php",
        config = {
            timeout: 5000
        };
    $http.post(url, postData, config).
    success(function(data, status) {
        if (data[0] == "success") {
            localStorage.setItem("ID", data[1]);
            navi.replacePage("html/menu.html");
        } else {
            ons.notification.alert({ message: "ログインできませんでした。", title: "エラー", cancelable: true });
            console.log(data);
            retry();
        }
    }).
    error(function(data, status) {
        ons.notification.alert({ message: "エラーが発生しました。", title: "エラー", cancelable: true });
        console.log(data);
        retry();
    });
}

function retry() {
    document.getElementsByTagName("h3")[0].innerHTML = "ログイン画面"
    loginBtn.disabled = false;
}