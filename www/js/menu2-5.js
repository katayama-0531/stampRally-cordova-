//表示するマスク画像URL（Android)
var maskA = "img/mask_android.png";
//表示するマスク画像URL（ios)
var maskI = "img/mask_ios.png";
//選択中の画像
var choiceCanvase = 0;
//プリレンダリング用キャンバス
var m_canvas = document.createElement('canvas');
var m_1Canvas = document.createElement('canvas');
var m_2Canvas = document.createElement('canvas');
var m_3Canvas = document.createElement('canvas');

app.controller('menu2-5Ctr', function($scope, $http) {
    console.log("2つめメニュー");
    var w = $('.wrapper').width();
    var h = $('.wrapper').height();
    $(".relative").attr('width', w);
    $(".relative").attr('height', h);
    /* Imageオブジェクトを生成 */
    maskLoad();
    //画像を貼る予定のキャンバスのタッチイベント
    $scope.canvasClick = function($event) {
        //$eventの結果はブラウザによって若干の違いがある
        var touchPointY = ($event.offsetY) ? $event.offsetY : $event.layerY;
        if (touchPointY >= 0 && touchPointY < 180) {
            choiceCanvase = 1;
        } else if (touchPointY >= 180 && touchPointY < 355) {
            choiceCanvase = 2;
        } else if (touchPointY >= 355 && touchPointY < maskCanvas.height) {
            choiceCanvase = 3;
        }
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
    $scope.resetClick = function() {
        modal.show();

        var maskCanvasReset = maskCanvas.getContext('2d');
        maskCanvasReset.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCanvasReset.drawImage(m_canvas, 0, 0);
        m_1Canvas.getContext('2d').clearRect(0, 0, m_1Canvas.width, m_1Canvas.height);
        m_2Canvas.getContext('2d').clearRect(0, 0, m_2Canvas.width, m_2Canvas.height);
        m_3Canvas.getContext('2d').clearRect(0, 0, m_3Canvas.width, m_3Canvas.height);
        modal.hide();
    }
});

function maskLoad() {
    /* Imageオブジェクトを生成 */
    var mask = new Image();
    if (device.platform == "Android") {
        mask.src = maskA;
    } else if (device.platform == "iOS") {
        mask.src = maskI;
    } else {
        mask.src = maskA;
    }
    mask.onload = function() {
        //キャンバスは高さと幅を指定しておかないとiOSで表示できない
        var width = parseInt(mask.width);
        var height = parseInt(mask.height);
        maskCanvas.width = width;
        maskCanvas.height = height;
        m_canvas.width = width;
        m_canvas.height = height;
        m_1Canvas.width = width;
        m_1Canvas.height = 180;
        m_2Canvas.width = width;
        m_2Canvas.height = 335 - 180;
        m_3Canvas.width = width;
        m_3Canvas.height = height　 - 335;

        /* 画像を描画 */
        m_canvas.getContext('2d').drawImage(mask, 0, 0);
        maskCanvas.getContext('2d').drawImage(m_canvas, 0, 0);
    }
}

function canvasConfirmCallback(buttonIndex, $http) {
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
        /* 画像を描画 (ここで１枚のキャンバスに新たに描画していく)*/
        //合成の形式を指定する(数値はマスク画像から適当に指定している)
        var context = maskCanvas.getContext('2d');
        context.globalCompositeOperation = "destination-over";
        switch (choiceCanvase) {
            case 1:
                context.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                m_1Canvas.getContext('2d').drawImage(img, 0, 0, maskCanvas.width, 180);
                context.drawImage(m_canvas, 0, 0);
                context.drawImage(m_1Canvas, 0, 0);
                context.drawImage(m_2Canvas, 0, 180);
                context.drawImage(m_3Canvas, 0, 335);
                break;
            case 2:
                context.clearRect(0, 0, img.width, img.height);
                m_2Canvas.getContext('2d').drawImage(img, 0, 0, maskCanvas.width, 335 - 180);
                context.drawImage(m_canvas, 0, 0);
                context.drawImage(m_1Canvas, 0, 0);
                context.drawImage(m_2Canvas, 0, 180);
                context.drawImage(m_3Canvas, 0, 335);
                break;
            case 3:
                context.clearRect(0, 0, img.width, img.height);
                m_3Canvas.getContext('2d').drawImage(img, 0, 0, maskCanvas.width, maskCanvas.height - 335);
                context.drawImage(m_canvas, 0, 0);
                context.drawImage(m_1Canvas, 0, 0);
                context.drawImage(m_2Canvas, 0, 180);
                context.drawImage(m_3Canvas, 0, 335);
                break;
            default:
                break;
        }
        modal.hide();
        context = null;
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
    var buffer = maskCanvas.toDataURL("image/png");
    //保存する画像のファイル名
    var imgName = Date.now() + ".png";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        fs.root.getFile(imgName, { create: true, exclusive: false },
            function(entry) {
                entry.createWriter(
                    function(writer) {
                        // var cb = function() {
                        //     console.log("書き込み終了");
                        // }

                        // writer.onwrite = cb;
                        // writer.onerror = function(e) {
                        //     modal.hide();
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
        var data = "'" + maskCanvas.toDataURL("image/jpeg") + "'";
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
                modal.hide();
                ons.notification.alert({ message: "保存しました。", title: "完了", cancelable: true });
                //選択した画像をリセット
                var maskCanvasReset = maskCanvas.getContext('2d');
                maskCanvasReset.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                maskCanvasReset.drawImage(m_canvas, 0, 0);
                m_1Canvas.getContext('2d').clearRect(0, 0, m_1Canvas.width, m_1Canvas.height);
                m_2Canvas.getContext('2d').clearRect(0, 0, m_2Canvas.width, m_2Canvas.height);
                m_3Canvas.getContext('2d').clearRect(0, 0, m_3Canvas.width, m_3Canvas.height);
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