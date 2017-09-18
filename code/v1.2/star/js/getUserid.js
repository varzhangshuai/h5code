//截取url 获取参数
//使用
//		var sharerid = new Object();
//		sharerid = getUserid(); 

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


		//getRoot()
//		function getRoot(){
//			$.ajax({  
//		        type: "POST", //用GET方式传输   
//		        url: route+'login', //目标地址  
//		        success: function (data){
//		        	console.log(data)
//	                if(data.code==1){	
//	                	
//	                	console.log(data)
//
//	                }else{
//	                	//跳回ios
//	                }
//		        },
//		            error:function(err){
//				        console.log(err);
//				    }
//	     		 });  	
//		}
//		




