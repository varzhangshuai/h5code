//截取url 获取参数
//使用
//		var sharerid = new Object();
//		sharerid = getUserid(); 

function getUserid(){
			var url = location.search
			//var url =  '?sessionId=7593d2ca-6f4a-430d-bcd3-9f9a20702274'
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

//路由
function myRoutes(){
    var route = 'http://m.daodaoclub.com';
    return route
}
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
                    time-=$('#log').html();
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
    $('#sharelog').html('0'+JSON.stringify(obj))
    setupWebViewJavascriptBridge(function (bridge) {
        $('#sharelog').html('1'+JSON.stringify(obj))

        bridge.callHandler('webCallApp',{'topName':obj.topName,'title':obj.title,'image':obj.image,'describe':obj.describe,'shareurl':obj.shareurl},function (response) {
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


//复制

//复制
function copyToClipboard(elementId) {


    if(os.ios){
        var copyDOM = document.querySelector('#');  //要复制文字的节点
        var range = document.createRange();
        // 选中需要复制的节点
        range.selectNode(copyDOM);
        // 执行选中元素
        window.getSelection().addRange(range);
        // 执行 copy 操作
        var successful = document.execCommand('copy');
        try {
            var msg = successful ? 'successful' : 'unsuccessful';

            console.log('copy is' + msg);
        } catch(err) {
            console.log('Oops, unable to copy');
        }
        // 移除选中的元素
        window.getSelection().removeAllRanges();
    }else if(os.android){

        // 创建元素用于复制
        var aux = document.createElement("input");
        // 获取复制内容
        var content = document.getElementById(elementId).innerHTML || document.getElementById(elementId).value;
        // 设置元素内容
        aux.setAttribute("value", content);
        // 将元素插入页面进行调用
        document.body.appendChild(aux);
        // 复制内容
        aux.select();
        // 将内容复制到剪贴板
        document.execCommand("copy");
        toast( document.execCommand("copy"))
        // 删除创建元素
        document.body.removeChild(aux);
    }
}




