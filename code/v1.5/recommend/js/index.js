// 截取 url search
function getUserid(){
    var url = location.search
    var search = new Object();
    if(url.indexOf("?")!=-1){
        var str = url.substr(1);
        strs = str.split("&");

        for (var i=0;i<strs.length;i++) {
            search[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return search;
}


