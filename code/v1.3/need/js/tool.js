//环境
var route = myRoutes();
var detailid = getUserid()
var unionid = getCookies('_unionid'); //获取cookie的_unionid
//截取url后边的信息 返回一个对象
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

var wxShareObj={
    link:'',
    title:'道道需求',
    desc:'道道需求',
    imgUrl:'http://img.daodaoclub.com/daodao_logo/daodao_logo_100.png',
    success:function () {
    },
    cancel:function () {
    }
};
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

function getData(){
    var data = {}
    unionid = getCookies('_unionid');
    if(!unionid){
        data={
            need:detailid.need
        }
    }else{
        data={
            need:detailid.need,
            unionid:unionid
        }
    }
    $.ajax({
        type: 'GET',
        url:route+'/costin/mapi/need/detail',
        data:data,
        success: function (data){
            if(data.code==="1"){
                var res = data.original;
                renderData(res)
            }else{
                console.log(data.msg)
            }
        },
        error:function (err) {
            console.log(err)
        }
    })
}

function renderData(data) {
    //个人信息 headUrl
    if(data.gender==2){
        $('.info-gender').attr('src','http://img.daodaoclub.com/app/need/img/icon_woman.jpg')
    }else {
        $('.info-gender').attr('src','http://img.daodaoclub.com/app/need/img/icon_man.jpg')
    }
    var headurl = 'url('+data.headUrl+')';
    $('.info-name').text(data.userName);
    $('.headurl').css({'background-image':headurl});
    $('.info-post').text(data.job);
    $('.info-company').text(data.companyName);
    $('.info-class').text(data.className);
    $('.need-typeName').text(data.typeName);
    $('.need-detail').text(data.description);
    $('.need-label span').text(data.channelName)

    //分享
    var share=data.share
    wxShareObj.link=share.url;
    wxShareObj.title=share.showTitle;
    wxShareObj.desc=share.subtitle;
    wxShareObj.imgUrl= (share.imgurl&&share.imgurl!='')?share.imgurl:'http://img.daodaoclub.com/daodao_logo/daodao_logo_100.png';
    getWxShare();
}

//判断在app 微信
function browser(ua) {
    var os = this.os ={};
    var daodaoclub = ua.match(/daodaoclub/i),
        micromessenger = ua.match(/micromessenger/i)
	if(daodaoclub)  os.isApp = true;
	if(micromessenger) os.isWeixin =true;
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


//微信认证
function getUnionid(obj) {
    if(!obj.need){
        window.location.href=route+'/app/common/download/index.html'
       return
    }
    if(!obj.code){
        nodewxsign()
        return
    }
    $.ajax({
        type: "GET",
        url:route+ '/wx/api/oauth/wxoauth' ,
        //目标地址
        data:obj,
        success: function (res){
            if(res.code==1){
                if(!unionid||unionid==''||unionid==undefined){
                    setCookie('_unionid',res.data.unionid)
                }
                wxsign(res.data,getData)
            }else{
                toast('认证失败')
                return
            }
        },
        error:function(err){
            console.log(err)
        }
    });
}
//java认证
function wxsign(data,callback) {
    if(!data){
        return
    }
    ;
    $.ajax({
        type: "POST", //用POST方式传输
        url:route+ '/costin/mapi/wechat/auth' ,
        //目标地址
        data:data,
        success: function (res){
            if(res.code==1){
                var data = res.original
                if(data&&data!=null){
                    if(data.enid){
                        setCookie('_enid',data.enid)
                    }
                    if(data.status){
                        setCookie('_status',data.status)
                    }
                    if(data.userid){
                        setCookie('_userid',data.userid)
                    }
                }
                callback()
            }else if(res.code==10016){
                nodewxsign();
            }else{
                toast(res.msg)
            }
        },
        error:function(err){
            console.log(err)
        }
    });
}

function nodewxsign() {
    var uri =window.location.href;
    $.ajax({
        type: "GET", //用POST方式传输
        url:route+ '/wx/api/oauth/wxoauth' ,
        //目标地址
        data:{uri:uri},
        success: function (res){
            if(res.code==1){

                window.location.href = res.data
            }else{
                alert(res.msg)
            }
        },
        error:function(err){

        }
    });
}

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

