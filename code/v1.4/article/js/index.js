
window.onload=function () {

var route = myRoutes();
var articleid = getPerson();
var search = getUserid();
var ajaxurl = '/costin/mapi/article';
var appObj={
    articleid:articleid,
    type:1,//永久链接
    isApp:0
}

if(search.type){
    appObj.type = search.type
}

//bridge

    var ua = window.navigator.userAgent;
    var platform =  window.navigator.platform;

    detect(ua, platform);
    var android=os.android;
    var daodaoclub = os.daodaoclub;
    if(daodaoclub){
        $('.inApp').css('display','block')
        appObj.isApp=1;
        OCJSJAVA(ajaxurl,getData,appObj)
    }else{
        getData(appObj);
        $('.padding').css('display','block');
        $('.float-bottom').css('display','block');

    }

    //获取数据



//是否已关注
    var isPraise='';



//与app交互
function setupWebViewJavascriptBridge(callback) {
    if(android){
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
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
    //判断是否为空函数
    function isEmptyObject(e) {
        var t;
        for (t in e)
            return !1;
        return !0
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
    if(!obj.topShare || obj.topShare==''){
        obj.topShare=0
    }
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('webCallApp',{'topShare':obj.topShare,'topName':obj.topName,'title':obj.title,'image':obj.image,'describe':obj.describe,'shareurl':obj.shareurl},function (response) {
            var res = JSON.stringify(response)
        })
    })
}

//数据加载完
    function windowLoad(obj) {
        if(!obj.load || obj.load==''){
            obj.load=''
        }
        if(!obj.height || obj.height==''){
            obj.height=''
        }
        var getSign = function(bridge) {
            index++;
            if(android&&index==1){
                bridge.init();
            }
            bridge.callHandler('webCallApp',{'load':obj.load,'height':obj.height}, function(response) {

            });
        }
        setupWebViewJavascriptBridge(getSign)
    }
//分享
    function appShareWechat(obj) {
    //朋友圈：timeline
        //好友 message
        if(!obj.wechat || obj.wechat==''){
            return
        }
        var getSign = function(bridge) {
            index++;
            if(android&&index==1){
                bridge.init();
            }
            bridge.callHandler('webCallApp',{'wechat':obj.wechat,'shareObj':obj.shareObj}, function(response) {

            });
        }
        setupWebViewJavascriptBridge(getSign)
    }
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
    topName:document.title,
    shareurl:window.location.href,
    title:document.title,
    image:'http://img.daodaoclub.com/daodao_logo/daodao_logo_100.png',
    describe:'',
    topShare:1
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
                $('#title').html(data.title) //大标题
                $('#subtitle').html(data.subTitle) //副标题
                var content = data.content;//内容
                $('#content').html(content);
                $('#viewCount').html(data.viewCount);

                var articleid = data.articleid; //文章id

                isPraise = data.isPraise; //是否关注
                //获取点赞数据
                var praiseType={
                    objectid:articleid,
                    type:2 //商学院头条文章点赞
                }
                OCJSJAVA('/costin/mapi/praise/get',getPraise,praiseType)

//点赞
                $('#isPraise').click(function () {
                    OCJSJAVA('/costin/mapi/praise',toPraise,praiseType)
                    appShareWX(shareObj);
                })

                //微信分享
                var share = data.share;
                wxShareObj.title = share.showTitle;
                wxShareObj.desc = share.subtitle;
                wxShareObj.imgUrl = share.imgurl;
                wxShareObj.link = share.url;
                getWxShare();
                //app share
                shareObj.shareurl = share.url;
                shareObj.title = share.showTitle;
                shareObj.describe = share.subtitle;
                shareObj.image = share.imgurl;
                appShareWX(shareObj);
                var recommend =res.original.recommend;
                renderList(recommend)

                //分享给好友
                $('#sharefriend').click(function () {
                    appShareWechat({wechat:'message',shareObj:shareObj})
                    appShareWX(shareObj);
                })

                //分享到朋友圈
                $('#sharetimeline').click(function () {
                    appShareWechat({wechat:'timeline',shareObj:shareObj})
                    appShareWX(shareObj);
                })
            }
        },
        error:function (err) {
            console.log(err)
        }
    })
}

//截取Userid
function getUserid(){
    var url = location.search
    var obj = new Object();
    if(url.indexOf("?")!=-1){
        var str = url.substr(1);
        strs = str.split("&");

        for (var i=0;i<strs.length;i++) {
            obj[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return obj;
}
//截取person
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
        var lis=''
        for(var i=0;i<data.length;i++){
            lis+='<li class="list" id='+data[i].articleidStr+'><img class="list-img" src='+data[i].imageUrl+' alt=""><div class="list-r"> <p class="els2"> '+data[i].title+'</p></div><div class="page-bottom"><span class="page-time">'+data[i].utime+'</span><span class="page-count">'+data[i].viewCount+'浏览</span></div></div>  </li>'
        }
        $('#lis').html(lis);
        $('#lis li').last().css('border-bottom','none');
    }

    $('#lis li').click(function () {
        var id=$(this).attr('id')
        window.location.href='/app/article/detail/'+id+'.html'
    })
}




    //是否被喜欢
    function isLiked(isPraise) {
        if(!os) {
            return
        }
        if(isPraise==0||isPraise==''){
            $('#isPraise').removeClass('cancellike').addClass('like')
        }else if(isPraise==1){
            $('#isPraise').removeClass('like').addClass('cancellike')
        }else {
            $('#isPraise').css('display','none')
        }
    }



    //喜欢不喜欢
    function toPraise(obj) {
        $.ajax({
            type: 'POST',
            url:route+'/costin/mapi/praise',
            data:obj,
            success:function (res) {
                var count = $('#praiseCount').html();
                if(res.code==1){
                    isLiked(isPraise)
                    if(isPraise==1){
                        isPraise=0
                        count=count-1;
                        $('#praiseCount').html(count);
                        isLiked(isPraise)
                        return
                    }else if(isPraise==0){
                        isPraise=1
                        count++;
                        $('#praiseCount').html(count);
                        isLiked(isPraise)
                        return
                    }
                }
            },
            error:function (err) {
                console.log(err)
                err= JSON.stringify(err)
            }
        })
    }

    //post获取点赞数据
    function getPraise(data) {
        $.ajax({
            type: "POST",
            url: route+'/costin/mapi/praise/get',
            data:data,
            success: function(res){
                if(res.code==1){
                    var praiseCount=res.original.praiseCount; //喜欢数量

                    isPraise = res.original.isPraise;
                    //已关注、点赞初始默认样式
                    if(isPraise==0||isPraise==''){
                        if($('#isPraise').hasClass('cancellike')) {
                            $(this).removeClass('cancellike')
                        }
                        $('#isPraise').addClass('like')
                    }else if(isPraise==1){
                        if($('#isPraise').hasClass('like')) {
                            $('#isPraise').removeClass('like')
                        }
                        $('#isPraise').addClass('cancellike')
                    }else {
                        $('#isPraise').css('display','none')
                    }

                    //喜欢数量
                    $('#praiseCount').html(praiseCount)  //显示关注数
                }
            },
            error:function(err){
                console.log('err',err)
            }

        });
    }
    //toast弹窗
    function toast(tip,time) {
        if(!time){
            time=2000
        }else{
            time=time*1000
        }
        var $toast = $("<div id='toast'></div>")
        $("body").append($toast);
        var obj= {
            "display": "none",
            "background": "rgba(0, 0, 0, 0.3)",
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
        },time)

    }

}





