app.controller('memoCtr', function($scope) {
    //メモ詳細画面のコントローラー
    var options = $scope.navi.topPage.data;

    memoTitle.innerText = options[1].dataTime;
    description.innerText = options[1].memo;

    $scope.reSave = function() {
        //jsonで保存されているのでパースする
        var mlItem = JSON.parse(localStorage.getItem('memo'));
        //jsonに変換して保存
        mlItem[options[0]] = { dataTime: mlItem[options[0]].dataTime, memo: description.value }
        localStorage.setItem('memo', JSON.stringify(mlItem));
        navi.popPage();
    }
});