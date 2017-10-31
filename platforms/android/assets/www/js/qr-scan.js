app.controller('qrCtr', function($scope) {
    //QRコード読み取り画面のコントローラー
    $scope.getQRCode=function(){
        getQRCode($scope);
    }

    qrScanPage.addEventListener('hide', function(event) {
        //ページが見えなくなった時
        resultMessage.innerHTML = "ここに結果が表示されます。";
    });
});

function getQRCode($scope) {
    //QRコード読み取り
    // 結果画面をリセット
    resultMessage.innerHTML = "";

    //BarCodeScannerで読み込む
    cordova.plugins.barcodeScanner.scan(
        //成功時のコールバック
        function(result) {
            //キャンセルされたら何もしない
            if (result.cancelled) {
                return;
            }

            //結果テキストを表示
            resultMessage.innerHTML = result.text;

            //URLならブラウザで開く
            if (result.text.indexOf("http") === 0) {
                console.log("urlだった" + resultMessage.innerHTML);
                resultFrame.scr = resultMessage.innerHTML;
                $scope.$apply();
            }
        },
        //エラー時のコールバック
        function(error) {
            resultMessage.text = error;
        }

    );
}