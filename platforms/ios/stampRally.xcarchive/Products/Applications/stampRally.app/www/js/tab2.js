app.controller('tab2Ctr', function($scope, $timeout, $element) {
    //メモ画面のコントローラー
    save.disabled = true;
    //保存されているメモのリスト
    var memoListItem = localStorage.getItem('memo');
    //削除インデックス
    var delindex = 0;
    if (memoListItem != null && memoListItem.length >= 1) {
        //Jsonで保存されているのでパースする
        memoListItem = JSON.parse(localStorage.getItem('memo'));
    };

    var itemCount = 0;
    $scope.ItemListDelegate = {
        configureItemScope: function(index, itemScope) {
            if (!itemScope.memo) {
                //console.log('Item #' + (index + 1) + '作成');
                itemScope.memo = memoListItem[index].dataTime;
                itemScope.id = "listitem" + index;
            }
            return itemScope.memo;
        },

        countItems: function() {
            // Return number of items.
            if (memoListItem) {
                itemCount = memoListItem.length;
            }
            return itemCount;
        },

        calculateItemHeight: function(index) {
            // Return the height of an item in pixels.
            return 44;
        },

        destroyItemScope: function(index, itemScope) {
            // Optional method that is called when an item is unloaded.
            //console.log('Item #' + (index + 1) + '削除');
        }
    };

    $scope.listTouch = function(arg) {
        var itemNum = arg.substr(8);
        var options = {
            data: [itemNum, memoListItem[itemNum]]
        };
        navi.bringPageTop("html/memo.html", options);
    }

    memoList.addEventListener('hold', function(event) {
        var　 touchObject = event.target.offsetParent.id;
         if (touchObject.substr(0, 8) === "listitem") {
            delindex = touchObject.substr(8);
            ons.notification.confirm({
                message: "このメモを削除しますか？",
                buttonLabels: ["はい", "いいえ"],
                //cancelable: true,
                title: "メモの削除",
                callback: memoDelete
            });
        }
    });
    
    //保存ボタンタッチ
    $scope.save = function() {
        if (memo.value) {
            //現在日時
            var nowDataTime = new Date().toLocaleString();
            //Jsonに変換して保存
            if (memoListItem == null) {
                memoListItem = [];
            };
            memoListItem.push({ dataTime: nowDataTime, memo: memo.value });
            localStorage.setItem('memo', JSON.stringify(memoListItem));
            memo.value = "";
            ons.notification.toast({ message: '保存しました。', timeout: 1000 });
        } else {
            ons.notification.alert({ message: "内容がありません。メモを入力してください。", title: "エラー", cancelable: true });
        }
    }

    function memoDelete(buttonIndex) {
        //はいがタップされたら削除する
        if (buttonIndex == 0) {
            memoListItem.splice(delindex, 1);
            //一度memoを全部削除して入れ直す。
            localStorage.removeItem('memo');
            localStorage.setItem('memo', JSON.stringify(memoListItem));
            $timeout(function() {
                $scope.ItemListDelegate.refresh();
            });
            ons.notification.toast({ message: '削除しました。', timeout: 1000 });
        }
    }

});