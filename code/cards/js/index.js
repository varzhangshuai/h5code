
window.onload=function () {

    var aliImgurl='http://img.daodaoclub.com/app/spread/img/'
    var list = document.querySelector("#image");
    var lis = list.getElementsByTagName("li");
    var start = 1;
    var length =36;

    var urlArr =[];
    for(var i=0;i<length+1;i++){
        urlArr.push(aliImgurl+i+".png");
    }
    createLi();

    function createLi() {
        var end = start + length;
        end = end > urlArr.length ? urlArr.length : end;
        for(var i=start;i<end;i++) {
            var li = document.createElement("li");
            li.src = urlArr[i];
            list.appendChild(li);
        }
        showImg();
    }


//加载图片（懒加载）
    function showImg(){
        for(var i=0;i<lis.length;i++){
            creatImg(lis[i]);
        }
    }

    //创建img标签
    //transtion在元素没有完全渲染完的情况下是不会被触发的
    function creatImg(li){
        var img = new Image();
        img.src=li.src;
        li.appendChild(img);
        img.onload=function(){
            img.style.opacity="1";
        }
    }

    //跳转下载页
    $('#btn-click').click(function () {
        window.location.href='/app/common/download/index.html'
    })
}


