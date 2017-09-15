var route = 'http://test.m.daodaoclub.com'
var articleid = getPerson();
var ajaxurl = '/costin/mapi/article';
var appObj={
    articleid:articleid,
    type:1,//永久链接
    isApp:0
}

//bridge

var ua = this.navigator.userAgent;
var platform =  this.navigator.platform;
detect(ua, platform);
var android=os.android;
var daodaoclub = os.daodaoclub;
if(daodaoclub){
    appObj.isApp=1
    OCJSJAVA(ajaxurl,getData,appObj)
}else {
    appObj.isApp=0
    getData(appObj);
}



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


//分享
//wx
var wxShareObj={
    link:window.location.href,
    title:document.title,
    desc:'',
    imgUrl:'http://img.daodaoclub.com/daodao_logo/daodao_logo_100.png',
    success:function () {
    },
    cancel:function () {
    }
};
//app
var shareObj ={
    topName:'document.title',
    shareurl:window.location.href,
    title:'document.title',
    image:'http://img.daodaoclub.com/daodao_logo/daodao_logo_100.png',
    describe:''
}

//微信分享
function wechatShare(config,data) {
    wx.config(config);
    wx.ready(function () {
        wx.onMenuShareAppMessage(data);
        wx.onMenuShareTimeline(data);
    })
}

function getWxShare() {
    $.ajax({
        type: "GET",
        url: route+'/wx/api/oauth/wxshare',
        success: function(res){
            if(res.code==1){
                wechatShare(res.data,wxShareObj)
            }
        },
        error:function(err){
            console.log('err',err)
        }

    });
}

function getData(data) {
    $.ajax({
        type: 'POST',
        url:route+ajaxurl,
        data:data,
        success:function (res) {
            if(res.code==1){
                var data =res.original;
                var content = data.content;
                if(content.indexOf('<body>')>-1){
                    content=content.split("<body>")[1].split("</body>")[0];
                    $('#content').html(content);
                }else {
                    $('#content').html(content);
                }
                document.title=data.title;
                //微信分享
                wxShareObj.title = data.title;
                wxShareObj.desc = data.content;
                wxShareObj.imgUrl = data.img;
                getWxShare();
                //app分享
                shareObj.topName = data.title;
                shareObj.title = data.title;
                shareObj.image = data.img;
                shareObj.describe = data.content;
                appShareWX(shareObj);

                var recommend =res.original.recommend;
                renderList(recommend)
            }
        },
        error:function (err) {
            console.log(err)
        }
    })
}
function getPerson() {
    var str = window.location.pathname;
    var index = str.lastIndexOf("\/");
    str= str.substring(index + 1, str .length);
    if(str.indexOf('html')){
        str=str.split('.')[0]
    }else{
        return
    }
    return str
}
function renderList(data){
    if(data.length>0){
        $('#lists').show()
        var lis=''
        for(var i=0;i<data.length;i++){
            lis+='<li class="list" id='+data[i].articleidStr+'><img class="list-img" src='+data[i].imageUrl+' alt=""><div class="list-r"> <p class="els3"> '+data[i].title+'</p></div> </li>'
        }
        $('#lis').html(lis)
    }else{
        $('#lists').hide()
    }

    $('#lis li').click(function () {
        var id=$(this).attr('id')
        console.log(id)
        window.location.href='/app/headline/'+id+'.html'
    })
}







