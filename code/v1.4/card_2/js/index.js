window.onload=function () {
    var route = myRoutes();
    var superid = getPerson();

    //微信分享
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

    if(superid=='index'){
        var search=getUserid();
        if(search.superid){
            superid=search.superid
        }else {
            openApp()
            return
        }
    }
    getData();
    function getData() {
        $.ajax({
            type: 'POST',
            url:route+'/costin/mapi/home/super/mine',
            data:{superid:superid},
            success: function (data){
                if(data.code==="1"){
                    var res = data.original;
                    renderData(res)
                }else{
                    alert(data.msg)
                }
            },
            error:function (err) {
                console.log(err)
            }
        })
    }
    function renderData(data) {
        var bgSex = data.gender;
        if(bgSex){
            var urlMan = "url('http://img.daodaoclub.com/app/card/img/bg.jpg')";
            var urlWoman ="url('http://img.daodaoclub.com/app/card/img/bg_female.jpg')";
            var middleBgFe = "url('http://img.daodaoclub.com/app/card/img/bg_femiddle.png')"
            var middleBg = "url('http://img.daodaoclub.com/app/card/img/bg_middle.png')"
            if(bgSex==2){
                $('.whole').css({'background-image':urlWoman,'background-repeat':'no-repeat','background-size':'cover'})
                //性别
                $('.conone-name img').attr('src','http://img.daodaoclub.com/app/card/img/icon_woman.png');
                $('.middle-con .swiper-slide').css({'background-image':middleBgFe})

            }else {
                $('.whole').css({'background-image':urlMan,'background-repeat':'no-repeat','background-size':'cover'})
                $('.conone-name img').attr('src','http://img.daodaoclub.com/app/card/img/icon_man.png');
                $('.middle-con .swiper-slide').css({'background-image':middleBg})

            }
        }
        //基本信息
        $('.conone-headimg').css({'background-image':'url('+data.headUrl+')'});
        $('.conone-name span').text(data.nickName);
        $('.companyName').text(data.companyName);
        $('.companyJob').text(data.companyJob);
        $('.companyAddr').text(data.address);
        $('.className').text(data.className);
        $('.industryName').text(data.industryName);

        //公司简介
        $('.contwo-brife-word').text(data.summary);

        //公司动态
        function dynamicItem(content) {
            return '<li><span class="dynamic-icon"></span> <div class="dynamic-word"><span>'+ content +'</span></div></li>'
        }
        var dynamicHtml=''

        if(data.dynamic.length>0){
            $('.contwo-dynamic').css('display','block')
            for(var i in data.dynamic){
                var content=data.dynamic[i].content;
                dynamicHtml+= dynamicItem(content)
            }
            $('.contwo-dynamic-word').html(dynamicHtml);
        }

        //公司简介
        function caseItem(content) {
            return '<li><span class="dynamic-icon"></span> <div class="case-word"><span>'+ content +'</span></div> </li>'
        }
        var caseHtml='';
        if (data.cases.length>0){
            $('.contwo-case').css('display','block')
            for(var i in data.cases){
                var content=data.cases[i].description;
                caseHtml+= caseItem(content)
            }

            $('.contwo-case-word').html(caseHtml);
        }

        //商业经历
        function experiencesItem(res) {
            var title =res.title;
            var beginDate = res.beginDate;
            var endDate = res.endDate;
            var description = res.description;
            return '<li><span class="conthree-icon"></span><div class="conthree-name">'+title+'</div> <div class="conthree-time ft100">'+beginDate+'-'+endDate+'</div><div class="conthree-position els1 ft100">'+description+'</div><div class="conthree-dashed els1"></div></li>'
        }
        var experiencesHtml='';
        if(data.experiences.length>3){
            $('.conthree-more').show()
        }
        var len = data.experiences.length<=3 ? data.experiences.length : 3;
        for(var i=0;i<len;i++){
            var res = data.experiences;
            experiencesHtml+= experiencesItem(res[i]);
        }
        $('.conthree-company').html(experiencesHtml)

        //查看更多按钮


        //fenxiang
        //分享
        var share=data.share
        if(share&&share!=null){
            wxShareObj.link=share.url;
            wxShareObj.title=share.showTitle;
            wxShareObj.desc=share.subtitle;
            wxShareObj.imgUrl= (share.imgurl&&share.imgurl!='')?share.imgurl:'http://img.daodaoclub.com/daodao_logo/daodao_logo_100.png';
            getWxShare();
        }

    }

    $('.bottom-btn-right').click(toastDown)
    $('.bottom-btn-left').click(toastDown)
    $('.conthree-more').click(toastDown)

    $('.toast-show').click(toastDown)
    function toastDown() {
        $('#mask').show()
    }
    //关闭弹窗
    $('.toast-close').click(function () {
        $('#mask').hide()
    })

    //跳转下载页
    $('.toast-button').click(openApp)
    $('.confour-button').click(openApp)
    //跳转到下载页
    function openApp() {
        window.location.href=route+'/app/common/download/index.html'
    }

    //获取加密的endid
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
}
