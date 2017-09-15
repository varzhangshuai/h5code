var route = 'http://test.m.daodaoclub.com'
var dynamicid = getPerson();
var ajaxurl = '/costin/mapi/dynamic/'+dynamicid;
getData();

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

function getData() {
    $.ajax({
        type: 'GET',
        url:route+ajaxurl,
        success:function (res) {
            console.log(res.code)
            if(res.code==1){
                var data =res.original;
                $('body').html(data.contentHtml);
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
