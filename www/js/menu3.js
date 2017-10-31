app.controller('menu3Ctr', function($scope, $http) {
    console.log("3つめメニュー");

    var id = localStorage.getItem('ID');
    var img64;
    //サーバーへの保存処理
    var postData = null;
    if (id) {
        postData = {
            userId: id,
        };
    }

    //Ajax通信でphpにアクセス
    var url = "http://japan-izm.com/dat/kon/test/stamp/api/imageList.php",
        config = {
            timeout: 5000
        };
    $http.post(url, postData, config).
    success(function(e, status) {
        if (e["response"] == true) {
            img64 = e["data"];
            var img = new Image();
            img.src = img64[0]["img_pass"];
            img.onload = function() {
                imgTest.src = img64[0]["img_pass"];
            };

        } else {
            console.log(e);
        }
    }).
    error(function(data, status) {
        ons.notification.alert({ message: "エラーが発生しました。", title: "エラー", cancelable: true });
        console.log(data);
    });

    var itemCount = 0;
    $scope.imgItemListDelegate = {
        configureItemScope: function(index, itemScope) {
            if (!itemScope.imgItem) {
                console.log('Item #' + (index + 1) + '作成');
                itemScope.imgScr = img64[index]["img_pass"];
            }
            return itemScope.imgItem;
        },

        countItems: function() {
            // Return number of items.
            if (img64) {
                itemCount = img64.length;
            }
            return itemCount;
        },

        calculateItemHeight: function(index) {
            // Return the height of an item in pixels.
            return 44;
        },

        destroyItemScope: function(index, itemScope) {
            // Optional method that is called when an item is unloaded.
            console.log('Item #' + (index + 1) + '削除');
        }
    };

});