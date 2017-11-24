app.controller('menu1Ctr', function ($scope) {

    console.log("1つめメニュー");

    $scope.current = new Date();
    //変数currentの値を監視
    $scope.$watch('current', function (new_value, old_value) {
        if (!angular.isDate(new_value)) {
            $scope.current = new Date();
        }
    });

    $scope.onopen = function ($event) {
        //カレンダーを開く
        $scope.opened = true;
    };
});