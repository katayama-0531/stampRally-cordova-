app.controller('listitemCtr', function($scope) {
    var move = false;
    //バッジ数
    $scope.menuCount = 100;

    $scope.topClick = function(event) {
        if (!move) {
            console.log("1つめクリック" + navi.pages);
            content.load("html/top.html");
            isMenu();
        };
    };
    $scope.secondClick = function(event) {
        if (!move) {
            console.log("2つ目クリック");
            content.load("html/menu1.html");
            isMenu();
        };
    };
    $scope.thirdClick = function(event) {
        if (!move) {
            console.log("3つ目(canvas5枚)クリック");
            content.load("html/menu2.html");
            isMenu();
        };
    };
    $scope.third1Click = function(event) {
        if (!move) {
            console.log("3つ目(canvas1枚)クリック");
            content.load("html/menu2-5.html");
            isMenu();
        };
    };
    $scope.fourthClick = function(event) {
        if (!move) {
            console.log("4つ目クリック");
            content.load("html/menu3.html");
            isMenu();
        };
    };

    $scope.startIndex = 0;
    var table = Array.prototype.slice.call(menuList.children);
    $("#menuList").sortable({
        axis: "y", // 縦方向のみ
        //handle: "ons-icon", // アイコンをドラッグした場合に並び替える
        handle: "div", // アイコンをドラッグした場合に並び替える
        tolerance: "pointer", // タップした位置で並び替える
        containment: "parent", // ドラッグの範囲は親(ons-list)内
        revert: 200,
        start: function(e, ui) {
            //移動フラグを立てる
            move = true;
            // 開始位置を保存
            $scope.startIndex = ui.item.index();
            // helperのborder-top、background-colorを設定する
            ui.item[0].classList.add("item-helper");
            // placeholderを表示、border-bottomを設定する
            ui.placeholder.css("visibility", "visible");
            ui.placeholder[0].classList.add("item-placeholder");
        },
        stop: function(e, ui) {
            //移動フラグを立てる
            move = false;
            // helperのborder-top、background-colorを解除する
            ui.item[0].classList.remove("item-helper");
            // placeholderを非表示、border-bottomを解除する
            ui.placeholder.css("visibility", "hidden");
            ui.placeholder[0].classList.remove("item-placeholder");
        },
        update: function(e, ui) {
            // 配列を入れ替える
            var data = table[$scope.startIndex];
            table.splice($scope.startIndex, 1);
            table.splice(ui.item.index(), 0, data);

            // 配列の状態を表示
            //$scope.checkTable();
            $scope.$apply();
        },
        change: function(e, ui) {},
        over: function(e, ui) {},
        out: function(e, ui) {}
    });
    $("#menuList").disableSelection();
});

function isMenu() {
    menu.toggle();
};