app.controller('tab1Ctr', function($scope) {
    //タブ1画面のコントローラー
    var browserUrl = linkFrame.scr;
    console.log("URL:".browserUrl);
    linkFrame.onload = function() {
        if (device.platform == "Android") {
            linkFrame.contentDocument.addEventListener('touchend', function(e) {
                if (document.getElementById) {
                    browserUrl = e.target.href;
                }
                if (browserUrl) {
                    //webviewのリンクを無効にする
                    e.target.removeAttribute("href");

                    //タッチした場所が外部リンクの場合標準ブラウザを立ち上げる
                    var browser = window.open(browserUrl, "_system", "location=no");
                }
            }, true);
        } else if (device.platform == "iOS") {
            //iOSの処理
            linkFrame.document.addEventListener('touchend', function(e) {
                if (!document.all) {
                    browserUrl = e.srcElement.href;
                }
                if (browserUrl) {
                    //webviewのリンクを無効にする
                    e.target.removeAttribute("href");

                    //タッチした場所が外部リンクの場合標準ブラウザを立ち上げる
                    var browser = window.open(browserUrl, "_system", "location=no", "EnableViewPortScale=yes");
                }
            });
        } else {
            linkFrame.contentDocument.addEventListener('click', function(e) {
                if (document.getElementById) {
                    browserUrl = e.target.href;
                }
                if (browserUrl) {
                    //webviewのリンクを無効にする
                    e.target.removeAttribute("href");

                    //タッチした場所が外部リンクの場合標準ブラウザを立ち上げる
                    var browser = window.open(browserUrl, "_system", "location=no");
                }
            });
        }
    }
    tab1Page.addEventListener("show", function(event) {
        if (browserUrl) {
            if (device.platform == "Android") {
                //android用
                linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            } else if (device.platform == "iOS") {
                //iOS用
                linkFrame.document.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            } else {
                linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            }
        }
    });

    tab1Page.addEventListener("show", function(event) {
        if (browserUrl) {
            if (device.platform == "Android") {
                //android用
                linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            } else if (device.platform == "iOS") {
                //iOS用
                linkFrame.document.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            } else {
                linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            }
        }
    });

    document.addEventListener("pause", function(event) {
        if (browserUrl) {
            if (device.platform == "Android") {
                //android用
                linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            } else if (device.platform == "iOS") {
                //iOS用
                linkFrame.document.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            } else {
                linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            }
        }
    });
});