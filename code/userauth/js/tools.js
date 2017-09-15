//截取url 获取参数
//使用
//		var sharerid = new Object();
//		sharerid = getUserid(); 

function getUserid(){
			var url = location.search
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
    var route = 'http://test.m.daodaoclub.com';
    return route
}
var route = myRoutes()
// var appData={_time:"1504858925",_sign:"11d7b6d300b58e72735ad8a26d03d2d9",_d:"oPaTTuHVRNxooCNQzSkvlQImzqxSS+xAx+7IfBoQDc0="}
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


//获取表单数据
function getFormData(data,callback) {
    $.ajax({
        type: "GET", //用POST方式传输
        url:route+ '/costin/mapi/authentication/after',
        //目标地址
        data:data,
        success: function (res){
            if(res.code==1){
                callback(res.original)
            } else{
                toast(res.msg)
            }
        },
        error:function(err){
            console.log(err)
        }
    });
}


//手机验证 button变色
/**
 * 生成文件名
 * @returns
 */

function timestamp(){
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return ""+y+add0(m)+"/"+add0(d)+add0(h)+add0(mm)+add0(s);
}
function add0(m){
    return m<10?'0'+m : m;
}
function times(){
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return add0(d)+add0(h)+add0(mm)+add0(s);
}

//formtwo 初始数据渲染
//        表单认证，所有state
//表单认证
var head_state = false;//头像状态
var name_state = false;//姓名状态
var company_state = false;//公司状态
// var commercial_state = false;//商学院状态
//2页
var phone_state1 = false;//手机状态
var phone_state2 = false;//手机状态
var name_state1 = false;//姓名状态
var name_state2 = false;//姓名状态
var major_state1 = false;//商学院状态
var major_state2 = false;//商学院状态
var classes_state1 = false;//班级状态
var classes_state2 = false;//班级状态
function renderLast(data) {
    if(data.alumni1Name!=''){
        $('#alumni1Name').val(data.alumni1Name)
        name_state2 = true;
    }
    if(data.alumni1Major!=''){
        $('#alumni1Major').val(data.alumni1Major)
        selectColor($('#alumni1Major'))
        if($('#alumni1Major').val()!=null){
            major_state1 = true;
            buttonChange2()

        }
    }
    if(data.alumni1Classes!=''){
        $('#alumni1Classes').val(data.alumni1Classes)
        classes_state1 = true;
    }
    if(data.alumni1Phone!=''){
        $('#alumni1Phone').val(data.alumni1Phone)
        phone_state1 = true;
    }
    if(data.alumni2Name!=''){
        $('#alumni2Name').val(data.alumni2Name)
        name_state2 = true;

    }
    if(data.alumni2Phone!=''){
        $('#alumni2Phone').val(data.alumni2Phone)
        phone_state2 = true;
    }
    if(data.alumni2Major!=''){
        $('#alumni2Major').val(data.alumni2Major)
        selectColor($('#alumni2Major'))
        if($('#alumni2Major').val()!=null){
            major_state2 = true;
            buttonChange2()
        }
    }
    if(data.alumni2Classes!=''){
        $('#alumni2Classes').val(data.alumni2Classes)
        classes_state2 = true;
    }
}
//设置img样式
function imgCss(url) {
    url = 'url("'+url+'")'
    var obj = { 'background': url+' no-repeat center center','background-size': 'cover'}
    return obj
}
//获取css的背景 url
function getImgUrl(url) {
    if(url.indexOf('("')>-1){
        url = url.split('("')[1].split('")')[0]
    }else if(url.indexOf('(')>-1){
        url = url.split("(")[1].split(")")[0]
    }
    return url
}
// button 样式改变
function buttonChange2() {
    if(phone_state1 && phone_state2 && major_state1 && major_state2 &&classes_state1 &&classes_state2 &&name_state1 &&name_state2){
        $('.next-button').css('background','#cb9555')
    }else{
        $('.next-button').css('background','#cccccc')
    }
}
function buttonChange() {
    console.log('head_state:'+head_state, 'name_state:'+name_state,  'company_state:'+company_state )
    if(head_state && name_state && company_state ){
        $('.next-button').css('background','#cb9555')
    }else{
        $('.next-button').css('background','#cccccc')
    }
}

//formone 初始数据渲染
function renderAfter(data) {
    if(data.name!=''){
        $('#name').val(data.name)
        name_state = true;
    }
    if(data.headUrl!=''){
        var url = imgCss(data.headUrl)
        $('#headUrl').css(url)
        head_state = true;

    }
    if(data.companyImg!=''){
        $('#companyImg').css(imgCss(data.companyImg))
        $('#companyImg').parent().next().css('display','block')
        company_state = true
    }

    buttonChange()
}



//提交表单
//提交表单1
function postDataFirst(data) {
    var name = $('#name').val()
    if(name==''){
        toast('请输入姓名！')
        return
    }
    var url = $('#headUrl').css('background-image')
    var headUrl = getImgUrl(url)

    if(headUrl=='none'||headUrl==null){
        toast('请选择头像')
        return
    }

    var companyImg = getImgUrl($('#companyImg').css('background-image'))
    if(companyImg==null || companyImg.indexOf('img/upload.png')>-1){
        toast('请选择照片')
        return
    }
    var collegeImg = getImgUrl($('#collegeImg').css('background-image'))
    if(collegeImg==null || collegeImg.indexOf('img/upload.png')>-1){
        collegeImg=''
    }
    var form = {
        headUrl: headUrl,
        name:name,
        companyImg: companyImg,
        collegeImg: collegeImg
    }
    // data = Object.assign(data,form)
    $.extend(data,form)
    $.ajax({
        type: "POST", //用POST方式传输
        url:route+ '/costin/mapi/authentication',
        //目标地址
        data:data,
        success: function (res){
            if(res.code==1){
                window.location.href='/app/userauth/formtwo.html?_t='+times();
            }else{
                toast(res.msg)
            }
        },
        error:function(err){
            console.log(err)
        }
    });
}
//提交表单2
function postDataLast(data) {
    var form = {
        alumni1Name:$('#alumni1Name').val(),
        alumni1Major:$('#alumni1Major').val(),
        alumni1Classes:$('#alumni1Classes').val(),
        alumni1Phone:$('#alumni1Phone').val(),
        alumni2Name:$('#alumni2Name').val(),
        alumni2Phone:$('#alumni2Phone').val(),
        alumni2Major:$('#alumni2Major').val(),
        alumni2Classes:$('#alumni2Classes').val(),
    }
    if(form.alumni1Name==''||form.alumni1Major==''||form.alumni1Classes==''||form.alumni1Phone==''||form.alumni2Name==''||form.alumni2Phone==''||form.alumni2Major==''||form.alumni2Classes==''){
        toast('请填写完全部内容')
        return
    }
    $.extend(data,form)
    // data = Object.assign(data,form)
    $.ajax({
        type: "POST", //用POST方式传输
        url:route+ '/costin/mapi/authentication/later',
        //目标地址
        data:data,
        success: function (res){
            if(res.code==1){
                window.location.href='/app/userauth/success.html';
            } else{
                toast(res.msg)
            }
        },
        error:function(err){
            console.log(err)
        }
    });
}
//获取商学院
function getMajors(data) {
    $.ajax({
        type: "GET", //用POST方式传输
        url:route+ '/costin/mapi/authentication/major',
        //目标地址
        data:data,
        success: function (res){
            if(res.code==1){
                renderMajor(res.original)
            } else{
                toast(res.msg)
            }
        },
        error:function(err){
            console.log(err)
        }
    });
}

//渲染商学院
function renderMajor(data) {
    var list="<option value=''>攻读方向</option>"
    var name=''
    for (var i=0;i<data.length;i++){
        list+="<option value="+data[i].majorItemid+">"+data[i].name+"</option>";
        name+=(data[i].name+',')
    }
    $('.select-style').append(list);
}
//select 默认颜色
function selectColor(dom) {
    if(dom.val()==0 ||dom.val()==null){
        dom.css('color','#cccccc')
    }else {
        dom.css('color','#333333')
    }
}

//上传图片
var client = new OSS.Wrapper({
    region: 'oss-cn-shanghai',
    accessKeyId : 'LTAIQXyCzQ8P9jEC',
    accessKeySecret : 'XUt1mgNViGNq2hPGISX8klqreWgxEb',
    bucket : 'daodao-upload'
});
function postPhoto(dom,callback){
    var imgReplace = dom.parent().find('label div');
    var closebtn = dom.parent().find('.close-img');
    var f = dom[0].files[0];
    var val= dom.val();
    //上传图片为空

    if(f.size==0){
        return
    }
    //判断文件类型
    // var type=(f.substr(f.lastIndexOf("."))).toLowerCase();
    var type = f.type;

    if(!(/(?:jpg|gif|png|jpeg)$/i.test(type))){
        toast("您上传图片的类型不符合(.jpg|.jpeg|.gif|.png)！");
        return;
    }

    if(f.size>2*1024*1024){
        toast('上传的图片的大于2M,请重新选择')
        return
    }
    var suffix = val.substr(val.indexOf("."));
    var obj=timestamp();  // 这里是生成文件名
    var storeAs = "user/apply/"+obj+suffix;  //命名空间
    client.multipartUpload(storeAs, f).then(function (result) {
        var imgUrl = 'http://img.daodaoclub.com/' + result.name ;
        var url = 'url('+imgUrl+')'
        var imgObj={
            'background-image': url,
            'background-repeat': 'no-repeat',
            'background-position': 'center center',
            'background-size': 'cover',
            'border':'none'
        }
        imgReplace.removeClass('bac-after').addClass('bac-before').css('background-image',url)
        // imgReplace.css(imgObj); //添加图片
        closebtn.css('display','block');
        if(callback){
            callback()
        }
    }).catch(function (err) {
        console.log(err);
    });
}

