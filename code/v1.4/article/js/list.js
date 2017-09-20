var route = myRoutes();

//分享
//wx
window.onload=function () {
    var ua = window.navigator.userAgent;
    var platform =  window.navigator.platform;
    detect(ua, platform);
    var android=os.android;
    var daodaoclub = os.daodaoclub;
    if(!daodaoclub){
        $('.float-bottom').css('display','block')
        $('body').css('padding-bottom','2rem')
    }else{
        $('.float-bottom').css('display','none')
    }
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
//与app交互
    function setupWebViewJavascriptBridge(callback) {
        var android =false
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
//分享接口
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
//列表接口

    function getList(data) {
        $.ajax({
            type: 'GET',
            url:route+'/costin/mapi/article/list',
            data:data,
            success:function (res) {
                if(res.code==1){
                    var data =res.original.pageList;
                    renderPageList(data)

                    var obj = res.original
                    iosTitle({topName:document.title,topCloseButton:1});
                    //分页
                    var len = res.original.pageCount;
                    var list="<option value=''>分页</option>"
                    for (var i=1;i<len+1;i++){
                        if(i==res.original.pageIndex){
                            list += "<option value="+i+" selected >第"+i+"页</option>";
                        }else{
                            list += "<option value="+i+">第"+i+"页</option>";

                        }
                    }
                    $('#toPage').html(list);
                    var count = $('#toPage').val();
                    if(count==1){
                        $('.prev').css({'background': '#eeeeee', 'color': '#666666'})
                    }else{
                        $('.prev').css({'background': '#cb9555', 'color': '#FFFFFF'})
                    }
                    if(count==len){
                        $('.next').css({'background': '#eeeeee', 'color': '#666666'})
                    }else{
                        $('.next').css({'background': '#cb9555', 'color': '#FFFFFF'})
                    }

                    $('.next').click(function () {
                        var count = $('#toPage').val();
                        if(count==len){
                            toast('已是最后一页')
                            return
                        }
                        count++;
                        getList({pageIndex:count})
                    })
                    $('.prev').click(function () {
                        var count = $('#toPage').val();
                        if(count==1){
                            toast('已是第一页')
                            return
                        }
                        count--;
                        getList({pageIndex:count})
                    })
                    $('#toPage').change(function () {
                        var val=$(this).val()
                        if(val==res.original.pageIndex){
                            return
                        }
                        getList({pageIndex:val})
                    })
                }
            },
            error:function (err) {
                console.log(err)
            }
        })
    }
    function renderPageList(data){
        if(data.length>0){
            var lis=''
            for(var i=0;i<data.length;i++){
                lis+='<li class="page" id='+data[i].articleidStr+'><img class="page-img" src='+data[i].imageUrl+' alt=""><div class="page-r"><div class="page-title"><p class="els2">'+data[i].title+'</p></div><div class="page-time">'+data[i].utime+'</div></div> </li>'
            }
            $('#page-list').html(lis)
        }
        $('#page-list li').click(function () {
            var id=$(this).attr('id')
            window.location.href='/app/article/detail/'+id+'.html'
        })
    }

    var filter={
        pageIndex:'1'
    }
    getList(filter)


//toast
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
            "background": "rgba(0, 0, 0, 0.6)",
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

    //浮层跳转
    $('.float-bottom').click(function () {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.daodaoclub.costin'
    })

}
