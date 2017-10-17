
//路由
function myRoutes(){
	
	var route = 'http://test.m.daodaoclub.com';
	
	return route
}

//获取enid
function getUserid(){

    var url = location.search

    //var url =  '?sessionId=7593d2ca-6f4a-430d-bcd3-9f9a20702274'
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

//时间戳格式化
function timeJson(time) {
    var newDate = new Date();
    newDate.setTime(time);
    return newDate.toLocaleDateString();
}
