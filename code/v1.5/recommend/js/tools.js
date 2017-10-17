//截取url 获取参数
//使用
//		var sharerid = new Object();
//		sharerid = getUserid(); 

function getUserid(){
			var url = location.search
			var cookie = new Object();
			if(url.indexOf("?")!=-1){
				var str = url.substr(1);
				strs = str.split("&"); 
				
				for (var i=0;i<strs.length;i++) {
					cookie[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
				}
			}
			return cookie;
		}

//截取uri
　function getUri(url){
　　　　
　　　　var arrUrl = url.split("//");

　　　　var start = arrUrl[1].indexOf("/");
　　　　var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

　　　　if(relUrl.indexOf("?") != -1){
　　　　　　relUrl = relUrl.split("?")[0];
　　　　}
　　　　return relUrl;
　　}

// var appData={_time:"1504858925",_sign:"11d7b6d300b58e72735ad8a26d03d2d9",_d:"oPaTTuHVRNxooCNQzSkvlQImzqxSS+xAx+7IfBoQDc0="}
//是否为空对象
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
//
// //判断在app 微信
// function browser(ua) {
// 	var app ;
// 	var weixin ;
//     daodaoclub = ua.match(/daodaoclub/i)
//     micromessenger = ua.match(/micromessenger/i)
// 	if(daodaoclub)  return app=true;
// 	if(micromessenger) return weixin=true;
//
// }


//bridge

var ua = this.navigator.userAgent;
var platform =  this.navigator.platform;
detect(ua, platform);
var android=os.android;

//与app交互
function setupWebViewJavascriptBridge(callback) {
    if(android){
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                , function() {
                    var time = new Date().getTime();
                    callback(WebViewJavascriptBridge)
                },
                false
            );
        }
    }else{
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
}

var index=0;
/*
* uri:api路径
* callback：回调函数
* obj:回调函数的参数
* childcall：回调函数执行完成后的执行函数
*/
function OCJSJAVA(uri,callback,obj,childcall) {
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
                appObj=JSON.parse(appObj)
            }

            if(obj&&!isEmptyObject(obj)){
                $.extend(appObj,obj)
            }
            if(childcall){
                callback(appObj,childcall)
            }else {
                callback(appObj)
            }
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
        bridge.callHandler('webCallApp',{'topName':obj.topName,'title':obj.title,'image':obj.image,'describe':obj.describe,'shareurl':obj.shareurl},function (response) {
            var res = JSON.stringify(response)
        })
    })
}

function iosTitle(obj) {
    if(!obj.topName || obj.topName==''){
        obj.topName=''
    }
    if(!obj.topShare || obj.topShare==''){
        obj.topShare=0
    }
    if(!obj.topCloseButton || obj.topCloseButton==''){
        obj.topCloseButton=''
    }
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('webCallApp',{'topName':obj.topName,'topShare':obj.topShare,'topCloseButton':obj.topCloseButton},function (response) {
            var res = JSON.stringify(response)
        })
    })
}
//调用 认证toast
function appAuthToast(obj) {
    if(!obj.toast || obj.toast==''){
        obj.toast=''
    }
    if(!obj.enid || obj.enid==''){
        obj.enid=0
    }
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('webCallApp',{'toast':obj.toast,'enid':obj.enid},function (response) {
            var res = JSON.stringify(response)
        })
    })
}

//判断app weixin
var _unionid = getCookies('_unionid');  //cookie是否有unionid
var isApp = os.daodaoclub;
var isWechat = os.micromessenger;
var search = getUserid();//链接

function deleteOs(callback,uri,obj) {
    if(!obj){
        obj = new Object();
    }
    if(isWechat){
        if(_unionid && _unionid!=''){
            obj._unionid=_unionid;
            callback(obj)
        }else{
            getUnionid(search);
        }
    }else if(isApp){
        OCJSJAVA(uri,callback,obj)
    }else{
        //其他浏览器
    }
}


//cookie

function setCookie(name,value)
{
    var Days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//读取cookie
function getCookies(key) {
    var tips;
    var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
    var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
    for(var i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
        var arr=arrCookie[i].split("=");//将单条cookie用"等号"为标识，将单条cookie保存为arr数组
        if(key==arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
            tips=unescape(arr[1]).substring(0,arr[1].length)//将cookie的值赋给变量tips
            break;   //终止for循环遍历
        }
    }
    return tips;
}

//删除cookies
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookies(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}


//timeStamp

function gettimestamp() {
    var time = new Date().getTime();
    return time;
}

//toast弹窗
function toast(tip) {
    var $toast = $("<div id='toast'></div>")
    $("body").append($toast);
    var obj= {
        "display": "none",
        "background": "rgba(0, 0, 0, 0.7)",
        "position": "fixed",
        "z-index": "10",
        "width": "4rem",
        "line-height": "0.8rem",
        "left": "3rem",
        "top": "50%",
        "margin-top":" -0.66666667rem",
        "border-radius":" 0.16rem",
        "font-size": "0.4rem",
        "color": "white",
        "text-align":" center",
        "padding": "0.26666667rem 0.13333333rem"
    }
    $('#toast').css(obj);

    $('#toast').css('display','block').html(tip)
    setTimeout(function () {
        $('#toast').css('display','none').html()
    },2000)
}

//loading
function loadingGif(boolean) {
    var $loading = $("<div id='loading'><div id='gif'></div></div>")
    $(".whole").append($loading);
    var gifObj={
        "position": "fixed",
        "width": "50px",
        "height": "50px",
        "z-index": "13",
        "background": "url('http://img.daodaoclub.com/app/userauth/img/loading.gif') no-repeat ",
        "background-size": "cover",
        "top": "40%",
        "left": "50%",
        "margin-left": "-25px",

    }
    $('#gif').css(gifObj);
    var obj= {
        "display": "none",
        "background": "rgba(0, 0, 0, 0.7)",
        "position": "fixed",
        "top": "0",
        "z-index": "12",
        "width": "10rem",
        "height": "100%",
    }
    $('#loading').css(obj);

    if(boolean==true){
        $('#loading').css('display','block')
    }else {
        $('#loading').css('display','none')
    }
}




