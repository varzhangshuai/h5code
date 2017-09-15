
//路由
function myRoutes(){
	var route = 'http://m.daodaoclub.com';
	return route
}
//时间戳格式化
function timeJson(time) {
    var newDate = new Date();
    newDate.setTime(time);
    return newDate.toLocaleDateString();
}
