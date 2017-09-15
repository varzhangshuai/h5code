
		bigImg();
		function bigImg(){
			var img = document.querySelector("#mask img")
			var li = document.querySelector("#photolist")
			li.addEventListener('touchstart',function(){
				this.isMove=false;
			})
			li.addEventListener("touchmove",function(ev){

                    var touch = ev.changedTouches[0];
                    if(!this.isMove){
                        this.isMove=true;
                    }
                })
			 li.addEventListener("touchend",function(ev){
                    if(!this.isMove){
                        console.log(ev.target.tagName)
                    	if(ev.target.tagName=='img'||ev.target.tagName=='IMG'){
                            img.src =ev.target.src
						}else {
                            return
						}
                        var left = this.getBoundingClientRect().left;
                        var top = this.getBoundingClientRect().top;
                        mask.style.transformOrigin = mask.style.webkitTransformOrigin = left+"px "+top+"px";
                        css(mask,"scale",1);
                    }
                })
		}
		closeImg();
		function closeImg(){
			var mask = document.querySelector("#mask");
	        var img = document.querySelector("#mask img")
	        var close = document.querySelector("#close");

	        mask.addEventListener("touchend",function(ev){
	            var touch = ev.changedTouches;
	            if(touch.length==1){
	                css(mask,"scale",0);
	                css(img,"scale",1);
	                css(img,"rotate",0);
	            }
       		 })
		}
        var route = myRoutes()
        var ua = this.navigator.userAgent;
        var platform =  this.navigator.platform
        detect(ua, platform);
        os = JSON.stringify(os.daodaoclub);


        //是否已关注
        var followed='';
        var userid = ''

        var uriSearch = getUserid();


        function getData(uri) {
            // $('#log').html(JSON.stringify(uriSearch))
            $.ajax({
                type: 'GET',
                url:route+uri ,
                data:{enid:uriSearch.enid},
                success: function (data) {
                    if(data.code==1){
                        var needs = data.original.needs;
                        var labels = data.original.labels;
                        var followCount =  data.original.followCount;
                        followed =  data.original.followed;
                        userid = data.original.user.userid;
                        // console.log('userid',userid)
                        $('#followCount').html(followCount);
                        isFollowed(followed)
                        if(needs!=[]&&needs!=null&&needs!=''){
                            var needItem='';

                            if(os){
                                for (var i in needs){
                                    if(!needs[i].channelName){
                                        // needs[i].channelName='公开需求'
                                    }
                                    needItem +=
                                        '<li> <div class="needDesc"> <span id="typeName">#'+ needs[i].typeName +'#</span><span id="description">'+needs[i].description+'</span> </div> <div> <div class="label" id="channelName">'+needs[i].channelName+'</div> <div class="interested" id='+ needs[i].needid +'>感兴趣</div> </div> </li>'
                                }
                            }else {
                                for (var i in needs){
                                    needItem +=
                                        '<li> <div class="needDesc"> <span id="typeName">#'+ needs[i].typeName +'#</span><span id="description">'+needs[i].description+'</span> </div> <div> <div class="label" id="channelName">'+needs[i].channelName+'</div> </div> </li>'
                                }
                            }
                            $('#needlist').html(needItem)
                        }else {
                            $('#needlist').parents('.need').css('display','none')
						}
                        if(labels!=[]&&labels!=null&&labels!=''){
                            var labelItem = '';
                            for (var j in labels){
                                labelItem += '<li>'+ labels[j] +'</li>'
                            }
                            $('#labellist').html(labelItem);
                        }else {
                            $('#labellist').parent('.label').css('display','none')
						}
                        definedByself();
                        var need = document.querySelector('.needwrap')
                        var needlist = document.querySelector('#needlist')
                        listdrag(need,needlist);
                    }
                } ,
                error:function (err) {
                    $('#needlist').parents('.need').css('display','none')
                    $('#labellist').parent('.label').css('display','none')
                    console.log(err)
                }
            });
        }

        function definedByself() {
            var scrollBar = document.querySelector(".scrollBar");
            var wrap = document.querySelector("#wrap");
            var content = document.querySelector("#content");
            var scale = wrap.clientHeight/content.offsetHeight;
            scrollBar.style.height = wrap.clientHeight*scale+"px";
            drag(wrap,0);
        }

        //相册
        function morePhoto(name) {
            var photobtn = document.querySelector('#photomore')
            var list = document.querySelector("#photolist");
            var len = $('#photolist li').length
            if(len>5){
                    $('#photomore').css('display','inline-block')
            }else{
                $('#photomore').css('display','none')
                return
            }
            list.addEventListener("touchmove", function () {
                if (!this.move) {
                    this.move = true;
                }
            })
            clickEvent(photobtn,function () {
                window.location.href = "/app/star/image.html?userName="+name;
            })
        }

        function isFollowed(followed) {
            if(!os) {
                return
            }
            if(followed==0||followed==''){
                $('#followed').css('display','none')
                $('#follow').css('display','block')
            }else if(followed==1){
                $('#followed').css('display','block')
                $('#follow').css('display','none')
            }else {
                $('.brife-button').css('display','none')
            }
        }

        function getFollow(appObj) {
            appObj.userid = userid;
            $.ajax({
                type: 'POST',
                url:route+'relation/follow' ,
                data:appObj,
                success:function (res) {
                    var count = $('#followCount').html();
                    isFollowed(followed)
                    if(res.code==1){
                        if(followed==1){
                            followed=0
                            count=count-1;
                            $('#followCount').html(count);
                            isFollowed(followed)
                            return
                        }else if(followed==0){
                            followed=1
                            count++;
                            $('#followCount').html(count);
                            isFollowed(followed)
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
        function clickEvent(dom,callback) {
            var len=0;
            dom.addEventListener('touchstart',function () {
                this.move=false;

            })
            dom.addEventListener('touchmove',function () {
                len++;
                if(len<2){
                    return
                }
                if(!this.move){
                    this.move=true;
                }
            })
            dom.addEventListener('touchend',function (ev) {
                len=0;
                if(!this.move&&ev.target&&ev.target.className!='followers'){
                    callback()
                }
            })
        }

        goInterest() //感兴趣
        function goInterest() {
            var goInterbtn =document.querySelector('#needlist');
            goInterbtn.addEventListener('touchstart',function () {
                this.move=false;
            })
            goInterbtn.addEventListener('touchmove',function () {
                if(!this.move){
                    this.move=true;
                }
            })
            var index = 0;
            goInterbtn.addEventListener('touchend',function (ev) {
                var touch = ev.changedTouches[0];
                index++;
                $('#log').html(index);
                if(!this.move && ev.target && ev.target.className == "interested") {

                    setupWebViewJavascriptBridge(function (bridge) {
                        bridge.callHandler('webCallApp',{'userid':userid,'needid':ev.target.id},function (res) {
                        })
                    })
                }
            })
        }

        //各有各道
        //各有各道
        var starfloat = document.querySelector('#star_float');
        clickstarfloat(starfloat)
        function clickstarfloat(dom) {
            dom.addEventListener('touchstart',function () {
                this.move=false;

            })
            dom.addEventListener('touchmove',function () {
                if(!this.move){
                    this.move=true;
                }
            })
            dom.addEventListener('touchend',function (ev) {
                var target = ev.target;
                if(target.nodeName == 'IMG'){
                    $('#star_float').css('display','none');
                    return
                }
                window.location.href = "/app/star/join/index.html"
            })
        }








