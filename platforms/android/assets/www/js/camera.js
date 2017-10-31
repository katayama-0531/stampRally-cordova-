app.controller('cameraCtr', function($scope) {
    //スライドメニュー2のコントローラー(ソースツリー文字化け対策の為文字挿入）
    $scope.snapSaveClick = function() {
        getCamera();
    }
});

function getCamera() {
    // カメラのチェク
    if (!navigator.camera) {
        navigator.notification.alert('カメラがない端末です', alertCallback, ['アラート'], ['OK']);
        return;
    }
    
    //カメラ起動
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: true
    });

    //撮影成功
    function onSuccess(imageData) {
        ons.notification.toast({ message: '保存しました。', timeout: 1500 });
        console.log(imageData)
    }

    //撮影失敗
    function onFail(message) {
        ons.notification.alert({ message: message, title: "エラー", cancelable: true });
    }
}
function alertCallback (){

}