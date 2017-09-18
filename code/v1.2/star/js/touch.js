(function(w){
	w.css=function(obj,name,value){
        if(!obj.transform){
            obj.transform={};
        }
		if(arguments.length>2){
			var result="";
			obj.transform[name]=value;
			for (item in obj.transform) {
				switch (item){
					case "rotate":
					case "skewX":
					case "skewY":
					case "skew":
						result += item+"("+obj.transform[item]+"deg)";				
						break;
					
					case "translateX":
					case "translateY":
                    case "translateZ":
					case "translate":
						result += item+"("+obj.transform[item]+"px)";
						break;
						
					case "scale":
					case "scaleX":
					case "scaleY":
						result += item+"("+obj.transform[item]+")"
						break;
				}
			}
			obj.style.WebkitTransform=obj.style.transform=result;
			
		}else if(arguments.length==2){
			value = obj.transform[name];
			
			if(typeof value=="undefined"){
				if(name=="scale"||name=="scaleX"||name=="scaleY"){
					return 1;
				}else{
					return 0;
				}
			}
			return value
		}
	}
	
	//带快速滑屏的竖向滑屏（即点即停版,带滚动条,防抖动）
	
	w.drag=function(wrap,index,callback){
		var child =wrap.children[index];//剔除文本节点
		css(child,"translateZ",0.01); //开启3d加速
		var minY = wrap.clientHeight - child.offsetHeight;
		
		var start = {};
		var elementY = 0;
		//橡皮筋系数
		var ratio = 1;
		
		var lastPoint = 0; //上一次的位置
		var lastTime = 0; //上一次的时间
		var timeV = 1; //时间差（不能为0，第一次会出现bug）
		var pointV = 0; //位置差
		
		//Tween算法
		var Tween = {
			//模拟transtion的贝塞尔去实现回弹
			easeOut: function(t,b,c,d,s){
				 if (s == undefined) s = 1.70158;
		         return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			},
			//模拟transtion的线性
			Linear: function(t,b,c,d){ return c*t/d + b; }
		}
		
		//防抖动
		var isY = true;
		var isFirst=true;
		
		wrap.addEventListener("touchstart",function(ev){
			//重置
			pointV =0;
			timeV = 1;
			child.style.transition="none";	
			
			var touch = ev.changedTouches[0];
			start = {clientX:touch.clientX,clientY:touch.clientY};
			elementY = css(child,"translateY");
			
			lastPoint = start.clientY;
			lastTime = new Date().getTime();
			
			clearInterval(wrap.clear);
			
			//外部的touchstart逻辑
			if(callback&&callback["start"]){
                callback["start"]();
			}
				isY = true;
				isFirst=true;
		})
		
		//即点即停跟touchmove没有关系
		
		wrap.addEventListener("touchmove",function(ev){
			//非竖屏返回
			if(!isY){
				return;
			}
			//位移差值
			var touch = ev.changedTouches[0];
			var now = touch;
			var disX = now.clientX-start.clientX;
			var disY = now.clientY-start.clientY;
			
			if(isFirst){
				isFirst=false;
				if(Math.abs(disX)>Math.abs(disY)){
					isY = false;
					//禁止单次逻辑时的抖动
					return
				}
			}
			
			var translateY=elementY+disY;
			
			//超出的时候，橡皮筋效果
			//刷新效果在此埋坑
			if(translateY>0){
				ratio = document.documentElement.clientHeight/((document.documentElement.clientHeight+translateY)*1.8);
				translateY=translateY*ratio;
			}else if(translateY<minY){
				//右边的留白（正值）
				var over = minY - translateY;
				ratio = document.documentElement.clientHeight/((document.documentElement.clientHeight+over)*1.8);
				translateY=minY-(over*ratio);
			}
            var nowTime = new Date().getTime();
            var nowPoint = now.clientY;

            pointV = nowPoint - lastPoint;
            timeV = nowTime - lastTime;

            lastPoint = nowPoint;
            lastTime = nowTime;

            css(child,"translateY",translateY);

            if(callback&&callback["move"]){
                callback["move"]();
            }
		})

		wrap.addEventListener("touchend",function () {
            var speed = pointV/timeV;
            var addY = speed*200;//快速滑屏
            var target= css(child,"translateY")+addY;

            var type="Linear";
            var time =0;
            time = Math.abs(speed)*0.3;
            time =time<0.3?0.3:time;

            //回弹效果
            if(target>0){
                target=0;
                type="easeOut";
			}else if(target<minY){
                target = minY;
                type="easeOut";
			}

            //抽象整个过渡过程
            move(target,time,type);
        })

		function move(target,time,type) {
            //		t :当前次数(t从1开始)
            //		b :初始位置
            //		c :目标位置与初始位置之间的差值
            //		d :总次数
            //		s :一般我们不改,它用来抽象回弹距离

            var t=0;
            var b=css(child,"translateY");
            var c=target-b;
            var d=time/0.01;

            //开启循环定时器之前必须清除这个定时器
            //避免重复开启逻辑一样的定时器
            clearInterval(wrap.clear);
            wrap.clear = setInterval(function () {
				t++;
				if(t>d){
                    clearInterval(wrap.clear);
                    //外部的touchend逻辑
                    if(callback&&callback["end"]){
                        callback["end"]();
                    }
				}else {
                    //如果直接触发touchstart和end  你们这个代码块里的逻辑会被执行300ms
                    //Tween算法给我们提供了每一帧具体的位置;
                    var dis = Tween[type](t,b,c,d);
                    css(child,"translateY",dis);
                    if(callback&&callback["move"]){
                        callback["move"]();
                    }
				}
            },10)
        }
	}

	//横向滑屏
   w.listdrag=function(wrap,list){
        var minX = wrap.clientWidth - list.offsetWidth;
        var startX = 0;
        var elementX = 0;
        //橡皮筋
        var ratio = 1;
        //上一次的位置
        var lastPoint =0;
        //上一次的时间
        var lastTime = 0;
        var timeV = 1;
        var pointV = 0;
        wrap.addEventListener("touchstart",function (ev) {
            //速度残留
            pointV =0;
            timeV = 1;
            list.style.transition="none";
            var touch = ev.changedTouches[0];
            startX = touch.clientX;
            elementX = css(list,"translateX");
            lastPoint = startX;
            lastTime = new Date().getTime();
        })
        wrap.addEventListener('touchmove',function (ev) {
            var touch = ev.changedTouches[0];
            var nowX = touch.clientX;
            var dis = nowX - startX;
            var translateX=elementX+dis;

            if(translateX>0){
                //随着ul移动距离越来越大，整个ul移动距离的增幅越来越小
                ratio = document.documentElement.clientWidth/((document.documentElement.clientWidth+translateX)*1.8);
                translateX=translateX*ratio;
            }else if(translateX<minX){
                //右边的留白（正值）
                var over = minX - translateX;
                ratio = document.documentElement.clientWidth/((document.documentElement.clientWidth+over)*1.8);
                translateX=minX-(over*ratio);
            }
            var nowTime = new Date().getTime();
            var nowPoint = nowX;
            pointV = nowPoint - lastPoint;
            timeV = nowTime - lastTime;
            lastPoint = nowPoint;
            lastTime = nowTime;
            css(list,"translateX",translateX);

        })
        wrap.addEventListener('touchend',function (ev) {
            var speed = pointV/timeV;
            var addX = speed*200;
            var target= css(list,"translateX")+addX;
            var bessel ="";
            var time =0;
            time = Math.abs(speed)*0.3;
            time =time<0.3?0.3:time;

            if(target>0){
                target=0;
                bessel="cubic-bezier(.65,1.49,.63,1.54)";
            }else if(target<minX){
                target = minX;
                bessel="cubic-bezier(.65,1.49,.63,1.54)";
            }

            list.style.transition=time+"s "+bessel;
            css(list,"translateX",target);
        })
    }



})(window)
