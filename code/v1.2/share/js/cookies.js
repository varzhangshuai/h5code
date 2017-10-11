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
