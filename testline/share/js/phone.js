

function ismobile(test){
    var u = navigator.userAgent, app = navigator.appVersion;
    if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
     if(window.location.href.indexOf("?mobile")<0){
      try{
       if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
        return '1'; //非iPhone
       }else{
        return '0';  //是iPhone
       }
      }catch(e){}
     }
    }else if(u.indexOf('iPad') > -1){
        return '1';
    }else{
        return '0';
    }
};

		
		
function isWeiXin(){
			    var ua = window.navigator.userAgent.toLowerCase();
			    var isWeiXin;
			    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			        return '1';  //是微信
			    }else{
				    return '0';  //不是微信
				}
			};

