
//路由
function myRoutes(){
	
	var route = 'http://m.daodaoclub.com';
	
	return route
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
