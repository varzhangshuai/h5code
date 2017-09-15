
var ua = this.navigator.userAgent;
var platform =  this.navigator.platform;
detect(ua, platform);
var android=os.android;
$('#log0').html('log0'+android)

//与app交互
function setupWebViewJavascriptBridge(callback) {

        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        // if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }

var index=0;
function OCJSJAVA(uri,callback) {
    var appObj = new Object()
    var time = new Date().getDate()
    var getSign = function(bridge) {
        index++;
        if(android&&index==1){
            bridge.init();
        }
        bridge.callHandler('webCallApp',{'iNeed':'you','uri':uri}, function(response) {
            appObj = response;
            if(android){
                appObj=JSON.parse(response)
            }else{
                appObj=response;
            }
            callback(appObj)
        });
    }
    setupWebViewJavascriptBridge(getSign)
}

//分享接口
function appShareWX(obj) {
    if(!obj.topName || obj.topName==''){
        obj.topName=''
    }
    if(!obj.title || obj.title==''){
        obj.title=''
    }
    if(!obj.image || obj.image==''){
        obj.image=''
    }
    if(!obj.describe || obj.describe==''){
        obj.describe=''
    }
    if(!obj.shareurl || obj.shareurl==''){
        obj.shareurl=''
    }
    setupWebViewJavascriptBridge(function (bridge) {
        if(android){
            bridge.init();
        }
        bridge.callHandler('webCallApp',{'topName':obj.topName,'title':obj.title,'image':obj.image,'describe':obj.describe,'shareurl':obj.shareurl},function (response) {
            var res = JSON.stringify(response)
        })
    })
}


function getUri(url){
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

    if(relUrl.indexOf("?") != -1){
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}



function getSign() {
    bridge.callHandler('webCallApp',  function(response) {
        return appObj = response;
    });
}

function getBridge(){
    setupWebViewJavascriptBridge(function(bridge) {
        //e.preventDefault();
        var appObj = new Object()
        var url= 'http://test.m.daodaoclub.com/costin/mapi';
        var uri = getUri(url);
        bridge.callHandler('webCallApp', {'uri':uri }, function(response) {
            return appObj = response;
        });
        return appObj
    });
}


