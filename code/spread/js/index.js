    var start = 1;
    var list = document.querySelector("#image");
    var lis = list.getElementsByTagName("li");
    var urlArr =[];
    var length = 0;
    function render(name,count) {
        var aliImgurl='http://img.daodaoclub.com/app/spread/img/'+name+'/'
        length =count;

        for(var i=0;i<length+1;i++){
            urlArr.push(aliImgurl+i+".png?_t="+timestamp());
        }
        createLi();
    }



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

    //时间戳
    function timestamp(){
        var time = new Date();
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return add0(d)+add0(h)+add0(mm)+add0(s);
    }
    function add0(m){
        return m<10?'0'+m : m;
    }




