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




