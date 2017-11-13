cordova.define("cordova-plugin-androidgps.androidgps", function(require, exports, module) {
module.exports = {
  getLocation: function(success,error) {
    // 第1引数: 成功時に呼び出す関数
    // 第2引数: エラー時に呼び出す関数
    // 第3引数: プラグインの名前（plugin.xmlのfeatureのnameに設定したもの）
    // 第4引数: AndroidGps.javaの第1引数に渡る名前
    // 第5引数: AndroidGps.javaの第2引数に渡る値
    cordova.exec(function(message) {
    	console.log('プラグイン呼び出しに成功しました'.message);
}, function(error) {
    	console.log('プラグイン呼び出しに失敗しました');
}, "AndroidGps", "getLocation", []);
  }
};
});