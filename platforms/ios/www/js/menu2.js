//表示するマスク画像URL（Android)
var maskA = "img/mask_android.png";
//表示するマスク画像URL（ios)
var maskI = "img/mask_ios.png";
//選択中の画像
var choiceCanvase = 0;
app.controller('menu2Ctr', function($scope, $http) {
    console.log("2つめメニュー");
    var w = $('.wrapper').width();
    var h = $('.wrapper').height();
    $(".relative").attr('width', w);
    $(".relative").attr('height', h);
    /* Imageオブジェクトを生成 */
    var img = new Image();
    if (device.platform == "Android") {
        img.src = maskA;
    } else if (device.platform == "iOS") {
        img.src = maskI;
    } else {
        img.src = maskA;
    }
    img.onload = function() {
        //キャンバスは高さと幅を指定しておかないとiOSで表示できない
        var width = parseInt(img.width);
        var height = parseInt(img.height);
        maskCanvas.width = width;
        maskCanvas.height = height;
        photCanvas.width = width;
        photCanvas.height = height;
        phot3Canvas.width = width;
        phot3Canvas.height = height - phot3Canvas.style.top.slice(0, -2);
        phot2Canvas.width = width;
        phot2Canvas.height = (height - phot2Canvas.style.top.slice(0, -2)) - phot3Canvas.height;
        phot1Canvas.width = width;
        phot1Canvas.height = (height - phot2Canvas.height) - phot3Canvas.height;
        photCanvas.getContext('2d').clearRect(0, 0, width, height);
        /* 画像を描画 */
        maskCanvas.getContext('2d').drawImage(img, 0, 0);
    }
    //画像を貼る予定のキャンバスのタッチイベント
    $scope.canvasClick = function(arg) {
        choiceCanvase = arg;
        setTimeout(function() {
            ons.notification.confirm({
                message: "アルバムの写真を使用するか撮影するか選択してください",
                buttonLabels: ["アルバム", "撮影"],
                cancelable: true,
                title: "写真の選択",
                callback: canvasConfirmCallback
            });
        }, 0);
    }

    $scope.saveClick = function() {
        modal.show();
        save($http);
    }
});

function canvasConfirmCallback(buttonIndex) {
    switch (buttonIndex) {
        case 0:
            getPhot();
            break;
        case 1:
            getMaskCamera();
            break;
        default:
            break;
    }
}

function getMaskCamera() {
    modal.show();
    //カメラ起動
    navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        pictureSourceType: Camera.PictureSourceTypeCAMERA,
        correctOrientation: true,
        saveToPhotoAlbum: true
    });

    //撮影成功
    function onCameraSuccess(imageData) {
        draw(imageData);
    }

    //撮影失敗
    function onCameraFail(message) {
        //撮影キャンセルもエラーが表示されるので取りあえずコメントアウト（表示文字：no image selected)
        //ons.notification.alert({ message: message, title: "エラー", cancelable: true });
        modal.hide();
    }
}

function getPhot() {
    modal.show();
    //アルバム起動
    navigator.camera.getPicture(onAlbumSuccess, onAlbumFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true,
        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
    });

    //取得成功
    function onAlbumSuccess(imageData) {
        draw(imageData);
    }

    //取得失敗
    function onAlbumFail(message) {
        //アルバム開いてもキャンセルのエラーが表示されるので取りあえずコメントアウト（表示文字：no image selected)
        //ons.notification.alert({ message: message, title: "エラー", cancelable: true });
        modal.hide();
    }
}

function draw(imageData) {
    /* Imageオブジェクトを生成 */
    var img = new Image();
    img.src = imageData;
    img.onload = function() {
        /* 画像を描画 (各キャンバスに描画していく)*/
        switch (choiceCanvase) {
            case 1:
                phot1Canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, 0, 0, phot1Canvas.width, phot1Canvas.height);
                break;
            case 2:
                phot2Canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, 0, 0, phot2Canvas.width, phot2Canvas.height);
                break;
            case 3:
                phot3Canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, 0, 0, phot3Canvas.width, phot3Canvas.height);
                break;
            default:
                break;
        }
        modal.hide();
    }
}
//64base→img変換
function Base64ToImage(base64img, callback) {
    var img = new Image();
    img.onload = function() {
        callback(img);
    };
    img.src = base64img;
}

function save($http) {
    //非表示のキャンバスに出力
    var imgAry = [phot1Canvas, phot2Canvas, phot3Canvas, maskCanvas];
    for (var i in imgAry) {
        if (imgAry[i] != null) {
            photCanvas.getContext('2d').drawImage(imgAry[i], 0, 0, imgAry[i].width, imgAry[i].height, 0, imgAry[i].offsetTop, imgAry[i].width, imgAry[i].height);
            imgAry[i] = null;
        }
    }
    var buffer = photCanvas.toDataURL("image/png");
    //保存する画像のファイル名
    var imgName = Date.now() + ".png";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        fs.root.getFile(imgName, { create: true, exclusive: false },
            function(entry) {
                entry.createWriter(
                    function(writer) {
                        // console.log("書き込み中");
                        // var cb = function() {
                        //     console.log("書き込み終了");
                        // }

                        // writer.onwrite = cb;
                        // writer.onerror = function(e) {
                        //     modal.hide();
                        //     console.log("書き込み失敗");
                        //     console.log("ファイルへの書き込みに失敗しました。: " + e.toString());
                        // }
                        //サーバーに保存するのでほんたいには保存しない
                        //writer.write(buffer);

                        //サーバーに保存する
                        upload(imgName, $http);
                    },
                    function() {
                        modal.hide();
                        console.log("create write error");
                    }
                );
            },
            function() {
                modal.hide();
            }
        );
    }, function() {
        modal.hide();
    });
}

// アップロード
function upload(image, $http) {

    if (image != '') {
        var data = "'" + photCanvas.toDataURL("image/jpeg") + "'";
        var id = localStorage.getItem('ID');
        //サーバーへの保存処理
        var postData = null;
        if (id) {
            postData = {
                userId: id,
                image_data: data
            };
        }
        //Ajax通信でphpにアクセス
        var url = "http://japan-izm.com/dat/kon/test/stamp/api/imageSave.php",
            config = {
                timeout: 5000
            };
        $http.post(url, postData, config).
        success(function(e, status) {
            if (e["response"] == true) {
                choiceCanvase = 0;
                modal.hide();
                ons.notification.alert({ message: "保存しました。", title: "完了", cancelable: true });
                //選択した画像をリセット
                phot1Canvas.getContext('2d').clearRect(0, 0, phot1Canvas.width, phot1Canvas.height);
                phot2Canvas.getContext('2d').clearRect(0, 0, phot2Canvas.width, phot2Canvas.height);
                phot3Canvas.getContext('2d').clearRect(0, 0, phot3Canvas.width, phot3Canvas.height);

            } else {
                modal.hide();
                ons.notification.alert({ message: "アップロードに失敗しました。", title: "エラー", cancelable: true });
                console.log(e);
            }
        }).
        error(function(data, status) {
            modal.hide();
            ons.notification.alert({ message: "アップロード中にエラーが発生しました。", title: "エラー", cancelable: true });
            console.log(data);
        });

    } else {
        modal.hide();
    }

}