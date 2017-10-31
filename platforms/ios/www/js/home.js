app.controller('homeCtr', function($scope) {

    loginName.innerHTML = "ID:" + localStorage.getItem('ID') + "でログイン中";

    $scope.MyDelegate = {
        configureItemScope: function(index, itemScope) {
            // Initialize scope
            itemScope.item = 'Item #' + (index + 1);
        },

        countItems: function() {
            // Return number of items.
            return 1000000;
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

    /* 前ページにスワイプ
    documentにイベントリスナーをつけるとメモリを保持し続けるようなので
    各ページ毎に書いた方が良い*/
    // document.addEventListener('swiperight', function(event) {
    //     mainTab.setActiveTab(mainTab.getActiveTabIndex() - 1);
    // });

    /* 次ページにスワイプ */
    // document.addEventListener('swipeleft', function(event) {
    //     mainTab.setActiveTab(mainTab.getActiveTabIndex() + 1);
    // });
});