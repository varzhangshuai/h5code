
    //认证
var _unionid = getCookies('_unionid'); //获取cookie的_unionid
var route=myRoutes();
var uriObj =getUserid(); //链接参数

//获取数据
//    getUnionid(uri);
//去认证
//微信的接口


function gotoSign(count) {
    delCookie('_unionid')
    var url = route+'/app/gifts/sign.html';
    if(!count){
        count=uriObj.count || 1;
        count++;
    }else if(count){
        count++
    }
    url+='?count='+count;
    if(uriObj.sharerid){
        url+='&sharerid='+uriObj.sharerid;
    }
    window.location.href =url;
}
//微信认证
function getUnionid(uri) {
    if(!uri){
        var count = uriObj.count || 2;
        window.location.href =route+'/app/gifts/sign.html?count='+count;
    }
    if(!uri.code){
        gotoSign()
    }
    $.ajax({
        type: "GET",
        url:route+ '/wx/api/oauth/wxoauth' ,
        //目标地址
        data:uri,
        success: function (res){
            if(res.code==1){
                console.log(res)
                if(!_unionid||_unionid==''){
                    var unionid=res.data.unionid;
                    setCookie('_unionid',res.data.unionid)
                    delCookie('_userid')
                    delCookie('_enid')
                    delCookie('_status')
                }
                wxsign(res.data,getData)
            }else{
                toast('认证失败')
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
                gotoSign();
            }else{
                toast(res.msg)
                // gotoSign();
            }
        },
        error:function(err){
            console.log(err)
        }
    });
}
var indexData = new Object();

//获取数据
function getData(data) {
    var _unionid = getCookies('_unionid')

    if(!data&&isWechat){
        if(!_unionid||_unionid == undefined){
            return false
        }
        data={_unionid:_unionid}
        if(uriObj.sharerid){
            data.sharerid = uriObj.sharerid;
        }
    }
    if(isApp&&!data.enid){
        return
    }

    $.ajax({
        type: "GET", //用POST方式传输
        url:route+ '/costin/mapi/lottery/gifts',
        //目标地址
        data:data,
        success: function (res){
            if(res.code==1){
                $('#home-content').css('display','block');
                indexData=res.original
                renderIndex(indexData)
            }else if(res.code==10016){
                gotoSign()
            }else if(res.code==10001){
                $('#home-content').css('display','none');
            } else{
                $('#home-content').css('display','none');
                alert(res.msg)
                // gotoSign()
            }
        },
        error:function(err){
            console.log(err)
        }
    });
}

//首页数据
function renderIndex(data) {
    //奖品列表
    if(!data || data==null || data==''){
        $('.home-whole').css('display','none');
    }

    if(data.commodity.length==0){
        //没有奖品
        // $('#commodity').css('display','none')
    }else{
        var imglist = data.commodity;
        var len = imglist.length;

        for(var i=0;i<len;i++){
            var id=imglist[i].commodityid;
            if(id>3){
                id=id+1; //跳过谢谢图
            }
            $('.lottery-unit-'+(id-1)+' img').attr('src',imglist[i].commodityImageUrl)
        }
    }

    //我的奖品
    if(data.express.length==0){
        $('#home-ul-none').css('display','block')
        $('#home-ul').css('display','none')
    }else {
        $('#home-ul').css('display','block')
        $('#home-ul-none').css('display','none')



        var len = data.express.length;
        var express = data.express;
        var item = $('#home-ul').html();
        var newItem='';

        for(var i=0;i<len;i++){
            newItem+=item;
        }

        $('#home-ul').html(newItem);
        $('.home-express-item').each(function (i) {
            var str ='';
            if(express[i].status==10){
                str = '已发货'
            }else if(express[i].status==1 || express[i].status==5){
                str = '待发货'
            }else{
                str = '领奖'
            }

            var sponsor = express[i].sponsor;
            var arr = sponsor.split(" ");

            $(this).find('.item-statusing').text(str);//状态
            $(this).find('.item-prize').text(express[i].commodityName);
            $(this).find('.item-patron').text(arr[0]);//赞助ren
            $(this).find('.item-name').text(arr[1]);//赞助
            $(this).find('.item-status').text(express[i].statusName);//状态
            $(this).find('.item-img').attr('src',express[i].commodityImageUrl);//图片
            $(this).find('.toWinning').attr('id','recordid'+express[i].recordid)//recordid
            $(this).find('.toWinning').addClass('status'+express[i].status)
        })
    }


    //是否有资格抽奖
    if(data.can==0){
        $('.home-enjoy-key').addClass('count-0')
    }else {
        if(data.frequency==0){
            $('.home-enjoy-key').addClass('count-0')
        }else if (data.frequency==1){
            $('#frequency').text(data.frequency)
            $('.home-counts').css('display','none')
        }else{
            $('.home-counts').css('display','block')
            $('.lottery-button').css('display','block');
            $('#frequency').text(data.frequency);

        }
    }
}



//winning 奖品详情
    function renderAdd(data) {
        $.ajax({
            type: "GET", //用POST方式传输
            url:route+ '/costin/mapi/lottery/gifts/express' ,
            //目标地址
            data:data,
            success: function (res){
                if(res.code==1){
                    addData(res.original)
                }else if(res.code==10016){
                    // gotoSign()
                }else{
                    // alert(res.msg)
                    // gotoSign()
                }
            },
            error:function(err){
                console.log(err)
            }
        });
    }

//选择收货地址
    function selectAdd(data) {

        $.ajax({
            type: "POST", //用POST方式传输
            url:route+ '/costin/mapi/lottery/gifts/address' ,
            data:data,
            success: function (res){
                if(res.code==1){
                    toAddress(data.recordid)
                }else if(res.code==10016){
                     gotoSign()
                }else{
                    toast(res.msg)
                    if(res.code=='60003'){
                        var id = data.recordid;
                        setTimeout(function () {
                            toAddress(id);
                        },2000)

                    }
                    // gotoSign()
                }
            },
            error:function(err){
                console.log(err)
            }
        });
    }

    //地址页
    function addData(data) {
        if(isWechat){
            // isWeixinAdd(data.status)
            // isWeixinAdd(data.status)
            isAppAdd(data);
        }else if(isApp){
            isAppAdd(data);
        }
    }
    //微信内
    function isWeixinAdd(status) {
        if (status == 0) {
            $('.isStatus').html('添加地址领奖')
        } else {
            $('.isStatus').html('查看发货进度')
        }
    }
    //app
    //status管理
    function isAppAdd(data) {
        if (data.status == 0) {
            var url = '/app/gifts/index.html';
            window.location.href =route+url;
        } else {
            var obj={
                name : data.name,
                addr : data.addr,
                cityName : data.cityName,
                addressid : data.addressid,
                expressName:data.expressName,
                expressCode:data.expressCode
            };
            if (data.status == 1) {
                $('.orderinfo').css('display', 'none');

            } else if (data.status == 10) {
                $('.orderinfo').css('display', 'block');
            }

            var addrevise = $('#orderdetail')
            appAddDetail(addrevise,obj)
        }

       //产品和地址 拼接

        if(data.commodityid){
            var id =data.commodityid;
            var str = data.sponsor;
            var arr = str.split(' ');

            $('.win-item-prize').text(data.commodityName);
            $('.win-item-patron').text(arr[0]);//赞助ren
            $('.win-item-name').text(arr[1]);//赞助
            $('.win-item-img').attr('src',data.commodityImageUrl);//图片
            $('.win-item-detail').attr('id','pro'+id)

        }else{
            $('#add-image').css('display','none')
            //$('#production-item').parent().css('display','none')
        }


        //
    }
    function appAddDetail(dom,obj) {
        dom.find('.item-express-name').html(obj.expressName)
        dom.find('.item-express-number').html(obj.expressCode)
        dom.find('.name').html(obj.name);
        dom.find('.phone').html(obj.phone);
        dom.find('.addr').html(obj.addr);
        dom.find('#add_revise').parent().attr('id','addr'+obj.addressid);
    }



    //奖品页
    function winningData(data) {
        var str = data.prize.sponsor;
        var arr = str.split(" ");
        $('.win-item-prizename').text(data.prize.commodityName);
        $('.win-item-sponsor').text(arr[0]);
        $('.win-item-name').text(arr[1]);
        $('.award-winn-shop img').attr('src',data.prize.commodityImageUrl);
        $('.award-button').attr('id','recordid'+data.recordid);

        //other prise
        var others = data.other;
        var item = $('#award-ul').html();
        var newItem='';

        for(var i=0;i<others.length;i++){
            newItem+=item;
        }

        $('#award-ul').html(newItem);
        $('.win-other-item').each(function (i) {
            var str = others[i].sponsor;
            var arr = str.split(" ");
            $(this).find('.win-item-prize').text(others[i].commodityName);
            $(this).find('.win-item-patron').text(arr[0]);//赞助ren
            $(this).find('.win-item-name').text(arr[1]);//赞助
            $(this).find('.win-item-img').attr('src',others[i].commodityImageUrl);//图片
            $(this).find('.win-item-detail').attr('id','winprize'+others[i].commodityid)//recordid
        })


    }

//奖品页
    function renderPrize(data) {
        //data recordid	int	 	记录id
        if(data.recordid){
            setCookie('_recordid',data.recordid);
        }
        $.ajax({
            type: "GET", //用POST方式传输
            url:route+ '/costin/mapi/lottery/gifts/prize' ,
            //目标地址
            data:data,
            success: function (res){
                if(res.code==1){
                    //获取数据 渲染页面
                    winningData(res.original)
                }else if(res.code=='10016'){
                    gotoSign()
                }else{
                    //alert(res.msg)
                    // gotoSign()
                }
            },
            error:function(err){
                console.log(err)
            }
        });
    }


    //抽奖
    function  clickLottery(data,callback) {
        var count = $('#frequency').text();
        $('#log0').html('3childcall'+count+JSON.stringify(data))
        $.ajax({
            type: "GET", //用POST方式传输
            url:route+ '/costin/mapi/lottery/gifts/lottery' ,
            //目标地址
            data:data,
            success: function (res){
                $('#log0').html('ajax'+JSON.stringify(res))
                if(res.code==1){
                    count--;
                    if(count>1){
                        $('#frequency').text(count);
                    }else if(count==1){
                        $(".count-0").removeClass('count-0');
                        $('.home-counts').css('display','none')
                        $('#frequency').text(count)
                        $('.lottery-button').css('display','none');
                    }else {
                        $(".home-enjoy-key").addClass('count-0');
                        $('.home-counts').css('display','none')
                    }

                    var prize = res.original.commodityid ;
                    var imgUrl= res.original.commodityImageUrl;
                    var id = res.original.recordid;
                    callback(prize,imgUrl,id)
                }else if(res.code==10016){
                    gotoSign()
                }else if(res.code==10001){
                    alert('系统错误，请稍后再试')
                }else{
                    alert('您已抽过奖，可以直接领取奖品')
                    // gotoSign()
                }
            },
            error:function(err){
                console.log(err)
            }
        });
    }

    //动画
    var isClick=false;

    function animatLottery(prize,url,id){
        $('#log0').html('animate'+prize+url+id)
        if (isClick) {//click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
            $(".home-share").show();
            var bIsLayerOpen = true;// 标志弹出层是否打开，如果弹出层打开，则为true，否则为false
            return false;
        }else{
            lottery.speed=100;
            if(prize<=3){
                prize=prize-1;
            }
            console.log(prize)
            lottery.prize=prize;  //中奖的奖品
            $('.home-prize-box').attr('src',url)
//               var index = 6;
            roll();    //转圈过程不响应click事件，会将click置为false
            $('.mask-lamp').css('display','block');

            isClick=true; //一次抽奖完成后，设置click为true，可继续抽奖
            //return false;
            setTimeout(function(){
                $(".home-prize-gift").css('display','block')
                $('.mask-lamp').css('display','none');

                // $(".chest-close").click(animateStart)
                setTimeout(animateStart,500)
                // animateStart();
                setTimeout(function () {
                    toWinning(id)
                },4000)
            },5000)
        }
    }

    //动画开始函数
    function animateStart(callback){
        $('.chest-close').addClass("shake");
        var that = '.chest-close';
        this.addEventListener("webkitAnimationEnd", function(){
            $(that).closest(".open-has").addClass("opened");
            setTimeout(function(){
                $(that).removeClass("show");
                $(that).closest(".mod-chest").find(".chest-open").addClass("show");
                setTimeout(function(){
                    $(".chest-open").addClass("blur");
                    setTimeout(callback,2000)
                },1000)
            },500)
        }, false);
    }
    //跳转到领奖页面
    function toWinning(id) {
        var time=new Date().getTime()
        var uri = '/app/gifts/winning.html?id='+id+'&_t='+time;

        window.location.href=uri;
    }
    //跳转收货地址列表
    function toAddrlist(id,addressid) {
        var time = new Date().getTime()
        if (isApp) {
            var uri = '/app/gifts/adrlist.html?id=' + id + '&_t=' + time;
            if (addressid) {
                uri += '&addressid=' + addressid;
            }
            window.location.href=uri;
        }

    }



    //跳转到奖品详情
    function toAddress(id) {
        var time=new Date().getTime();
        var uri =  '/app/gifts/app_adddetail.html?id='+id+'&_t='+time;
        window.location.href=uri;
    }



    //客服弹窗
    function customer() {
        //客服电话弹窗
        $('.logo_2').click(function () {
            var isAlert = $('#alert-ios').css('display')
            if(isAlert == 'none'){
                $('#alert-ios').css('display','block')
                $('#mask').css('display','block');
                if(isWechat){
                    $('.phone-inWechat').css('display','block')
                }else {
                    $('.phone-inApp').css('display','block')
                }
            }
        })

        $('#alert-cancel').click(function () {
            var isCancel = $('#alert-ios').css('display')
            if(isCancel == 'block'){
                $('#alert-ios').css('display','none')
                $('#mask').css('display','none');
            }
        })

    }
    function appShareToast() {
        $('#add_share').click(function () {
            $('#mask-bac').css('display','block')
        })
    }

    function closeShareToast() {
        $('#click-area').click(function () {
            $('#mask-bac').css('display','none')
        })
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



    //跳转到公共下载页面
    function openApp(){
        var uri = '/app/gifts/index.html'
        window.location.href=route+uri;
    }

    //分享
    //share
    var shareObj ={
        topName:'礼尚往来',
        shareurl:route+'/app/gifts/index.html',
        title:'今日好礼相送，但看花落谁家',
        // image:'http://test.m.daodaoclub.com/img/daodaologo_40.png',
        describe:'校友馈赠，敬请笑纳'
    }

