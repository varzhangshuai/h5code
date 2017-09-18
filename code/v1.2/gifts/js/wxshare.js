
var enid = getCookies('_enid');
var url = route+'/app/gifts/index.html';
console.log(enid)
if(enid&&enid!=''){
    url+= ('?sharerid='+enid);
}

var wxShareObj={
    link:url,
    title:'今日好礼相送，但看花落谁家',
    desc:'校友馈赠，敬请笑纳',
    imgUrl:'http://img.daodaoclub.com/daodao_logo/daodao_logo_100.png',
    success:function () {
        var status = getCookies('_status')
        console.log(status)
        if(status==1){
            var time = new Date().getTime();
            window.location.href=route+'/app/gifts/signsuc.html?_t='+time;
        }
    },
    cancel:function () {
    }
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


